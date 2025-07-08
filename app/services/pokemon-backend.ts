import type { PokemonBuild, PokemonApiData, CompetitiveTier } from '../types/pokemon';

const API_BASE_URL = 'http://localhost:4000/api';

// Backend data structure (from your existing API)
interface BackendPokemonBuild {
  id: number;
  name: string;
  tier: string;
  level?: number;
  moves: string[];
  item?: string;
  nature: string;
  ability: string;
  hpIV: number;
  attackIV: number;
  defenseIV: number;
  spAttackIV: number;
  spDefenseIV: number;
  speedIV: number;
  hpEV: number;
  attackEV: number;
  defenseEV: number;
  spAttackEV: number;
  spDefenseEV: number;
  speedEV: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Transform backend data to frontend format
function transformBackendToFrontend(backendBuild: BackendPokemonBuild): PokemonBuild {
  return {
    id: backendBuild.id.toString(),
    name: backendBuild.name,
    species: backendBuild.name, // Use name as species for now
    tier: backendBuild.tier as CompetitiveTier,
    level: backendBuild.level || 50, // Default level if not provided
    nature: backendBuild.nature,
    ability: backendBuild.ability,
    item: backendBuild.item,
    moves: backendBuild.moves,
    ivs: {
      hp: backendBuild.hpIV,
      attack: backendBuild.attackIV,
      defense: backendBuild.defenseIV,
      sp_attack: backendBuild.spAttackIV,
      sp_defense: backendBuild.spDefenseIV,
      speed: backendBuild.speedIV,
    },
    evs: {
      hp: backendBuild.hpEV,
      attack: backendBuild.attackEV,
      defense: backendBuild.defenseEV,
      sp_attack: backendBuild.spAttackEV,
      sp_defense: backendBuild.spDefenseEV,
      speed: backendBuild.speedEV,
    },
    description: backendBuild.description,
    created_at: backendBuild.createdAt,
    updated_at: backendBuild.updatedAt,
  };
}

// Transform frontend data to backend format
function transformFrontendToBackend(frontendBuild: Omit<PokemonBuild, 'id' | 'created_at' | 'updated_at'>): Omit<BackendPokemonBuild, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    name: frontendBuild.name,
    tier: frontendBuild.tier,
    level: frontendBuild.level,
    moves: frontendBuild.moves,
    item: frontendBuild.item,
    nature: frontendBuild.nature,
    ability: frontendBuild.ability,
    hpIV: frontendBuild.ivs.hp,
    attackIV: frontendBuild.ivs.attack,
    defenseIV: frontendBuild.ivs.defense,
    spAttackIV: frontendBuild.ivs.sp_attack,
    spDefenseIV: frontendBuild.ivs.sp_defense,
    speedIV: frontendBuild.ivs.speed,
    hpEV: frontendBuild.evs.hp,
    attackEV: frontendBuild.evs.attack,
    defenseEV: frontendBuild.evs.defense,
    spAttackEV: frontendBuild.evs.sp_attack,
    spDefenseEV: frontendBuild.evs.sp_defense,
    speedEV: frontendBuild.evs.speed,
    description: frontendBuild.description,
  };
}

export class PokemonBuildService {
  /**
   * Get all Pokemon builds, optionally filtered by tier
   */
  static async getBuilds(tier?: CompetitiveTier): Promise<PokemonBuild[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/pokemon`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BackendPokemonBuild[] = await response.json();
      
      // Transform backend data to frontend format
      const transformedData = data.map(transformBackendToFrontend);
      
      // Filter by tier if specified
      if (tier) {
        return transformedData.filter((build: PokemonBuild) => build.tier === tier);
      }
      
      return transformedData;
    } catch (error) {
      console.error('Error fetching Pokemon builds:', error);
      throw error;
    }
  }

  /**
   * Get a single Pokemon build by ID
   */
  static async getBuild(id: string): Promise<PokemonBuild | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/pokemon/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BackendPokemonBuild = await response.json();
      return transformBackendToFrontend(data);
    } catch (error) {
      console.error('Error fetching Pokemon build:', error);
      throw error;
    }
  }

  /**
   * Create a new Pokemon build
   */
  static async createBuild(build: Omit<PokemonBuild, 'id' | 'created_at' | 'updated_at'>): Promise<PokemonBuild> {
    try {
      const backendData = transformFrontendToBackend(build);
      
      const response = await fetch(`${API_BASE_URL}/pokemon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BackendPokemonBuild = await response.json();
      return transformBackendToFrontend(data);
    } catch (error) {
      console.error('Error creating Pokemon build:', error);
      throw error;
    }
  }

  /**
   * Update an existing Pokemon build
   */
  static async updateBuild(id: string, updates: Partial<PokemonBuild>): Promise<PokemonBuild> {
    try {
      // Transform only the fields that are being updated
      const backendUpdates: any = {};
      
      if (updates.name !== undefined) backendUpdates.name = updates.name;
      if (updates.tier !== undefined) backendUpdates.tier = updates.tier;
      if (updates.level !== undefined) backendUpdates.level = updates.level;
      if (updates.moves !== undefined) backendUpdates.moves = updates.moves;
      if (updates.item !== undefined) backendUpdates.item = updates.item;
      if (updates.nature !== undefined) backendUpdates.nature = updates.nature;
      if (updates.ability !== undefined) backendUpdates.ability = updates.ability;
      if (updates.description !== undefined) backendUpdates.description = updates.description;
      
      if (updates.ivs) {
        if (updates.ivs.hp !== undefined) backendUpdates.hpIV = updates.ivs.hp;
        if (updates.ivs.attack !== undefined) backendUpdates.attackIV = updates.ivs.attack;
        if (updates.ivs.defense !== undefined) backendUpdates.defenseIV = updates.ivs.defense;
        if (updates.ivs.sp_attack !== undefined) backendUpdates.spAttackIV = updates.ivs.sp_attack;
        if (updates.ivs.sp_defense !== undefined) backendUpdates.spDefenseIV = updates.ivs.sp_defense;
        if (updates.ivs.speed !== undefined) backendUpdates.speedIV = updates.ivs.speed;
      }
      
      if (updates.evs) {
        if (updates.evs.hp !== undefined) backendUpdates.hpEV = updates.evs.hp;
        if (updates.evs.attack !== undefined) backendUpdates.attackEV = updates.evs.attack;
        if (updates.evs.defense !== undefined) backendUpdates.defenseEV = updates.evs.defense;
        if (updates.evs.sp_attack !== undefined) backendUpdates.spAttackEV = updates.evs.sp_attack;
        if (updates.evs.sp_defense !== undefined) backendUpdates.spDefenseEV = updates.evs.sp_defense;
        if (updates.evs.speed !== undefined) backendUpdates.speedEV = updates.evs.speed;
      }

      const response = await fetch(`${API_BASE_URL}/pokemon/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendUpdates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BackendPokemonBuild = await response.json();
      return transformBackendToFrontend(data);
    } catch (error) {
      console.error('Error updating Pokemon build:', error);
      throw error;
    }
  }

  /**
   * Delete a Pokemon build
   */
  static async deleteBuild(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/pokemon/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting Pokemon build:', error);
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
      const response = await fetch(`${API_BASE_URL}/pokeapi/pokemon/${name.toLowerCase()}`);
      
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
   * Get move data including type information
   */
  static async getMoveData(moveName: string): Promise<{ name: string; type: string }> {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/move/${moveName.toLowerCase().replace(/\s+/g, '-')}`);
      
      if (!response.ok) {
        // Return default if move not found
        return { name: moveName, type: 'normal' };
      }

      const data = await response.json();
      return {
        name: data.name,
        type: data.type.name
      };
    } catch (error) {
      console.error('Error fetching move data:', error);
      return { name: moveName, type: 'normal' };
    }
  }

  /**
   * Search Pokemon by name for autocomplete
   */
  static async searchPokemon(query: string): Promise<string[]> {
    try {
      // For now, return a common Pokemon list that matches the query
      const commonPokemon = [
        'Pikachu', 'Charizard', 'Blastoise', 'Venusaur', 'Garchomp', 'Metagross',
        'Tyranitar', 'Dragonite', 'Salamence', 'Lucario', 'Gengar', 'Alakazam',
        'Machamp', 'Golem', 'Lapras', 'Snorlax', 'Gyarados', 'Arcanine',
        'Jolteon', 'Vaporeon', 'Flareon', 'Espeon', 'Umbreon', 'Leafeon',
        'Glaceon', 'Sylveon', 'Scizor', 'Heracross', 'Skarmory', 'Forretress'
      ];
      
      return commonPokemon.filter(pokemon => 
        pokemon.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);
    } catch (error) {
      console.error('Error searching Pokemon:', error);
      return [];
    }
  }

  /**
   * Search moves by name for autocomplete
   */
  static async searchMoves(query: string): Promise<string[]> {
    try {
      const commonMoves = [
        'Thunderbolt', 'Ice Beam', 'Flamethrower', 'Surf', 'Earthquake',
        'Psychic', 'Shadow Ball', 'Energy Ball', 'Focus Blast', 'Aura Sphere',
        'Dragon Pulse', 'Dark Pulse', 'Air Slash', 'Stone Edge', 'Iron Head',
        'Close Combat', 'Outrage', 'Meteor Mash', 'Thunder Punch', 'Ice Punch',
        'Fire Punch', 'Protect', 'Substitute', 'Toxic', 'Thunder Wave',
        'Will-O-Wisp', 'Stealth Rock', 'Spikes', 'Rapid Spin', 'Defog'
      ];
      
      return commonMoves.filter(move => 
        move.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);
    } catch (error) {
      console.error('Error searching moves:', error);
      return [];
    }
  }

  /**
   * Search items by name for autocomplete
   */
  static async searchItems(query: string): Promise<string[]> {
    try {
      const commonItems = [
        'Life Orb', 'Choice Band', 'Choice Scarf', 'Choice Specs', 'Leftovers',
        'Focus Sash', 'Assault Vest', 'Light Ball', 'Eviolite', 'Rocky Helmet',
        'Heat Rock', 'Damp Rock', 'Smooth Rock', 'Icy Rock', 'Toxic Orb',
        'Flame Orb', 'Black Sludge', 'Sitrus Berry', 'Lum Berry', 'Chesto Berry',
        'Expert Belt', 'Muscle Band', 'Wise Glasses', 'Scope Lens', 'Razor Claw'
      ];
      
      return commonItems.filter(item => 
        item.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);
    } catch (error) {
      console.error('Error searching items:', error);
      return [];
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