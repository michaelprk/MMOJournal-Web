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
  start_date: string | null;
  created_at: string;
};

export const shinyHuntService = {
  async list(): Promise<ShinyHuntRow[]> {
    const query = supabase
      .from('shiny_hunts')
      .select(
        'id,pokemon_id,pokemon_name,method,region,area,location,rarity,phase_count,total_encounters,is_completed,start_date,created_at'
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
};


