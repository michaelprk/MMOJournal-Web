import { createClient } from '@supabase/supabase-js';
import type { PokemonBuild, PokemonApiData, CompetitiveTier } from '../types/pokemon';

// These will need to be set up in your environment
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-project-url';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

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

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching Pokemon builds:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getBuilds:', error);
      throw error;
    }
  }

  /**
   * Get a single Pokemon build by ID
   */
  static async getBuild(id: string): Promise<PokemonBuild | null> {
    try {
      const { data, error } = await supabase
        .from('pokemon_builds')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching Pokemon build:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getBuild:', error);
      throw error;
    }
  }

  /**
   * Create a new Pokemon build
   */
  static async createBuild(build: Omit<PokemonBuild, 'id' | 'created_at' | 'updated_at'>): Promise<PokemonBuild> {
    try {
      const { data, error } = await supabase
        .from('pokemon_builds')
        .insert([build])
        .select()
        .single();

      if (error) {
        console.error('Error creating Pokemon build:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createBuild:', error);
      throw error;
    }
  }

  /**
   * Update an existing Pokemon build
   */
  static async updateBuild(id: string, updates: Partial<PokemonBuild>): Promise<PokemonBuild> {
    try {
      const { data, error } = await supabase
        .from('pokemon_builds')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating Pokemon build:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateBuild:', error);
      throw error;
    }
  }

  /**
   * Delete a Pokemon build
   */
  static async deleteBuild(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('pokemon_builds')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting Pokemon build:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteBuild:', error);
      throw error;
    }
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