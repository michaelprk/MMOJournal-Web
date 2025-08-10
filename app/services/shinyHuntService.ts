import { supabase } from './supabase';

export type ShinyHuntRow = {
  id: number;
  pokemon_id: number;
  pokemon_name: string;
  method: string;
  region: string | null;
  area: string | null;
  location: string | null;
  rarity: string | null;
  phase_count: number;
  total_encounters: number;
  is_completed: boolean;
  is_phase?: boolean;
  parent_hunt_id?: string | null;
  start_date: string | null;
  found_at?: string | null;
  created_at: string;
};

export const shinyHuntService = {
  async list(): Promise<ShinyHuntRow[]> {
    const query = supabase
      .from('shiny_hunts')
      .select(
        'id,pokemon_id,pokemon_name,method,region,area,location,rarity,phase_count,total_encounters,is_completed,is_phase,parent_hunt_id,start_date,found_at,created_at'
      )
      .order('created_at', { ascending: false });

    const { data, error } = await query;
    if (import.meta?.env?.DEV) {
      // eslint-disable-next-line no-console
      console.log('[shiny:list] result', { data, error });
    }
    if (error) throw error;
    return (data || []) as ShinyHuntRow[];
  },

  subscribe(userId: string, onInsert: (row: ShinyHuntRow) => void) {
    const channel = supabase
      .channel('shiny_hunts_insert')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'shiny_hunts', filter: `user_id=eq.${userId}` },
        (payload) => {
          const newRow = payload.new as ShinyHuntRow;
          onInsert(newRow);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  async listActive(): Promise<ShinyHuntRow[]> {
    const { data, error } = await supabase
      .from('shiny_hunts')
      .select(
        'id,pokemon_id,pokemon_name,method,region,area,location,rarity,phase_count,total_encounters,is_completed,is_phase,start_date,created_at'
      )
      .eq('is_completed', false)
      .eq('is_phase', false)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as ShinyHuntRow[];
  },

  async listCompleted(): Promise<ShinyHuntRow[]> {
    const { data, error } = await supabase
      .from('shiny_hunts')
      .select(
        'id,pokemon_id,pokemon_name,method,region,area,location,rarity,phase_count,total_encounters,is_completed,is_phase,parent_hunt_id,start_date,created_at,found_at,completed_month,completed_year,meta'
      )
      .eq('is_completed', true)
      .order('found_at', { ascending: false });
    if (error) throw error;
    return (data || []) as any;
  },

  async create(payload: Partial<ShinyHuntRow> & { pokemon_id: number; pokemon_name: string; method: string }): Promise<void> {
    const insert = {
      ...payload,
      is_completed: false,
      // found_at left null; trigger will set cache when completed
    } as any;
    const { error } = await supabase.from('shiny_hunts').insert([insert]);
    if (error) throw error;
  },

  async addPhase(parentId: number | string, payload: Partial<ShinyHuntRow> & { pokemon_id: number; pokemon_name: string; method: string; found_at?: string | null }): Promise<void> {
    const insert = {
      ...payload,
      is_completed: true,
      is_phase: true,
      parent_hunt_id: String(parentId),
      found_at: payload.found_at || new Date().toISOString(),
    } as any;
    const { error } = await supabase.from('shiny_hunts').insert([insert]);
    if (error) throw error;
  },

  async markFound(id: number): Promise<void> {
    const { error } = await supabase
      .from('shiny_hunts')
      .update({ is_completed: true, found_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },

  async listPhases(parentId: number | string): Promise<ShinyHuntRow[]> {
    const { data, error } = await supabase
      .from('shiny_hunts')
      .select('id,pokemon_id,pokemon_name,found_at,total_encounters')
      .eq('parent_hunt_id', String(parentId))
      .eq('is_phase', true)
      .order('found_at', { ascending: true });
    if (error) throw error;
    return (data || []) as any;
  },

  async updateHunt(id: number, patch: Partial<Pick<ShinyHuntRow, 'method' | 'region' | 'area' | 'location' | 'rarity' | 'start_date' | 'notes'>>): Promise<void> {
    const { error } = await supabase
      .from('shiny_hunts')
      .update(patch)
      .eq('id', id);
    if (error) throw error;
  },

  async updateCounters(id: number, data: { phase_count?: number; total_encounters?: number }): Promise<void> {
    const { error } = await supabase
      .from('shiny_hunts')
      .update(data)
      .eq('id', id);
    if (error) throw error;
  },

  async updateMeta(id: number, partialMeta: any): Promise<void> {
    // Merge into meta JSONB
    const { data, error } = await supabase
      .from('shiny_hunts')
      .select('meta')
      .eq('id', id)
      .single();
    if (error) throw error;
    const newMeta = { ...(data?.meta || {}), ...partialMeta };
    const { error: upErr } = await supabase
      .from('shiny_hunts')
      .update({ meta: newMeta })
      .eq('id', id);
    if (upErr) throw upErr;
  },
};


