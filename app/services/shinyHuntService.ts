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
  parent_hunt_id?: number | null;
  start_date: string | null;
  found_at?: string | null;
  created_at: string;
  is_paused?: boolean;
};

export const shinyHuntService = {
  async list(): Promise<ShinyHuntRow[]> {
    const query = supabase
      .from('shiny_hunts')
      .select(
        'id,pokemon_id,pokemon_name,method,region,area,location,rarity,phase_count,total_encounters,is_completed,is_phase,parent_hunt_id,start_date,found_at,created_at,meta,is_paused'
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
      .channel('shiny_hunts_changes')
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

  subscribeUpdates(userId: string, onUpdate: (row: ShinyHuntRow) => void) {
    const channel = supabase
      .channel('shiny_hunts_updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'shiny_hunts', filter: `user_id=eq.${userId}` },
        (payload) => {
          const updatedRow = payload.new as ShinyHuntRow;
          onUpdate(updatedRow);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  async listActive(): Promise<ShinyHuntRow[]> {
    // Robust client-side filtering to tolerate missing/null columns in dev
    const rows = await this.list();
    return rows.filter((r: any) => r.is_completed !== true && r.is_phase !== true && r?.is_paused !== true && r?.meta?.paused !== true);
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

  async create(payload: Partial<ShinyHuntRow> & { pokemon_id: number; pokemon_name: string; method: string }): Promise<ShinyHuntRow> {
    const insert = {
      ...payload,
      is_completed: false,
      found_at: null,
      // found_at left null; trigger will set cache when completed
    } as any;
    const { data, error } = await supabase
      .from('shiny_hunts')
      .insert([insert])
      .select('id,pokemon_id,pokemon_name,method,region,area,location,rarity,phase_count,total_encounters,is_completed,is_phase,parent_hunt_id,start_date,found_at,created_at')
      .single();
    if (error) throw error;
    return data as ShinyHuntRow;
  },

  async addPhase(parentId: number, payload: Partial<ShinyHuntRow> & { pokemon_id: number; pokemon_name: string; method: string; found_at?: string | null }): Promise<void> {
    const insert = {
      ...payload,
      is_completed: true,
      is_phase: true,
      parent_hunt_id: Number(parentId),
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

  async listPhases(parentId: number): Promise<ShinyHuntRow[]> {
    const { data, error } = await supabase
      .from('shiny_hunts')
      .select('id,pokemon_id,pokemon_name,found_at,total_encounters')
      .eq('parent_hunt_id', Number(parentId))
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

  async pauseHunt(id: number): Promise<void> {
    const { error } = await supabase
      .from('shiny_hunts')
      .update({ is_paused: true })
      .eq('id', id);
    if (error) {
      await this.updateMeta(id, { paused: true });
    }
  },

  async resumeHunt(id: number): Promise<void> {
    const { error } = await supabase
      .from('shiny_hunts')
      .update({ is_paused: false })
      .eq('id', id);
    if (error) {
      await this.updateMeta(id, { paused: false });
    }
  },

  async listPaused(): Promise<ShinyHuntRow[]> {
    // Robust client-side filtering
    const rows = await this.list();
    return rows.filter((r: any) => r.is_completed !== true && r.is_phase !== true && (r?.is_paused === true || r?.meta?.paused === true));
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

  async deleteHunt(id: number): Promise<void> {
    const { error } = await supabase
      .from('shiny_hunts')
      .delete()
      .eq('id', id)
      .single();
    if (error) throw new Error(`SB: ${error.message}`);
  },
};


