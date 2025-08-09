import { createClient } from '@supabase/supabase-js';
import type { PokemonBuild, PokemonApiData, CompetitiveTier, ShinyHunt } from '../types/pokemon';

// Singleton Supabase client
const readEnv = (key: string): string | undefined => {
  // Browser via Vite
  if (typeof window !== 'undefined' && typeof import.meta !== 'undefined') {
    return (import.meta as any).env?.[key];
  }
  // Node (scripts/tests)
  return (process.env as any)[key];
};

const supabaseUrl = readEnv('VITE_SUPABASE_URL');
const supabaseKey = readEnv('VITE_SUPABASE_ANON_KEY');

const isDev = (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) || process.env.NODE_ENV !== 'production';
if (isDev) {
  if (!supabaseUrl || !supabaseKey) {
    // eslint-disable-next-line no-console
    console.warn('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check your .env');
  }
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export async function ping(): Promise<{ ok: boolean }> {
  try {
    const { error } = await supabase
      .from('pokemon_builds')
      .select('id', { count: 'exact', head: true });
    if (error) return { ok: false };
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export class PokemonBuildService {
  /**
   * Get all Pokemon builds, optionally filtered by tier
   */
  static async getBuilds(tier?: CompetitiveTier): Promise<PokemonBuild[]> {
    try {
      let query = supabase
        .from('pokemon_builds')
        .select('*')
        .order('created_at', { ascending: false });

      if (tier) {
        query = query.eq('tier', tier);
      }

      const { data, error, status } = await query;

      if (error) throw new Error(`SB: ${status || ''} ${error.message}`.trim());

      return data || [];
    } catch (error) {
      throw error instanceof Error ? error : new Error('SB: failed to get builds');
    }
  }

  /**
   * Get a single Pokemon build by ID
   */
  static async getBuild(id: string): Promise<PokemonBuild | null> {
    try {
      const { data, error, status } = await supabase
        .from('pokemon_builds')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw new Error(`SB: ${status || ''} ${error.message}`.trim());

      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('SB: failed to get build');
    }
  }

  /**
   * Create a new Pokemon build
   */
  static async createBuild(build: Omit<PokemonBuild, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<PokemonBuild> {
    try {
      const { data, error, status } = await supabase
        .from('pokemon_builds')
        .insert([build])
        .select()
        .single();

      if (error) throw new Error(`SB: ${status || ''} ${error.message}`.trim());

      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('SB: failed to create build');
    }
  }

  /**
   * Update an existing Pokemon build
   */
  static async updateBuild(id: string, updates: Partial<PokemonBuild>): Promise<PokemonBuild> {
    try {
      const { data, error, status } = await supabase
        .from('pokemon_builds')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(`SB: ${status || ''} ${error.message}`.trim());

      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('SB: failed to update build');
    }
  }

  /**
   * Delete a Pokemon build
   */
  static async deleteBuild(id: string): Promise<void> {
    try {
      const { error, status } = await supabase
        .from('pokemon_builds')
        .delete()
        .eq('id', id);

      if (error) throw new Error(`SB: ${status || ''} ${error.message}`.trim());
    } catch (error) {
      throw error instanceof Error ? error : new Error('SB: failed to delete build');
    }
  }
}

// ================================
// Shiny Hunt Services (Supabase)
// ================================
export class ShinyHuntService {
  static async getHunts(userId: string): Promise<ShinyHunt[]> {
    const { data, error } = await supabase
      .from('shiny_hunts')
      .select('*')
      // optional scoping, RLS should enforce
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as any) || [];
  }

  static async createHunt(userId: string, hunt: Omit<ShinyHunt, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShinyHunt> {
    const { data, error } = await supabase
      .from('shiny_hunts')
      .insert([{ ...hunt, user_id: userId }])
      .select()
      .single();
    if (error) throw error;
    return data as any;
  }

  static async updateHunt(userId: string, id: number, updates: Partial<ShinyHunt>): Promise<ShinyHunt> {
    const { data, error } = await supabase
      .from('shiny_hunts')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    return data as any;
  }
}

export class PokeApiService {
  /**
   * Get Pokemon data from PokeAPI proxy
   */
  static async getPokemonData(name: string): Promise<PokemonApiData> {
    try {
      const response = await fetch(`http://localhost:4000/api/pokeapi/pokemon/${name.toLowerCase()}`);
      
      if (!response.ok) {
        throw new Error(`Pokemon not found: ${name}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
      throw error;
    }
  }

  /**
   * Get Pokemon sprite URL
   */
  static getPokemonSpriteUrl(name: string): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${name.toLowerCase()}.png`;
  }

  /**
   * Get Pokemon sprite URL by ID
   */
  static getPokemonSpriteById(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }
} 