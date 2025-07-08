import type { ShowdownImport, PokemonStats, PokemonBuild, CompetitiveTier } from '../types/pokemon';

/**
 * Parse a Pokemon Showdown import string into a structured object
 */
export function parseShowdownImport(importString: string): ShowdownImport {
  const lines = importString.trim().split('\n').map(line => line.trim());
  
  // First line contains name, item, and gender
  const firstLine = lines[0];
  const nameMatch = firstLine.match(/^(.+?)(?:\s+\(([^)]+)\))?(?:\s+@\s+(.+))?$/);
  
  if (!nameMatch) {
    throw new Error('Invalid Showdown import format');
  }
  
  const name = nameMatch[1].trim();
  const species = nameMatch[2] || name; // Use nickname if species is in parentheses
  const item = nameMatch[3]?.trim();
  
  // Initialize the result object
  const result: ShowdownImport = {
    name,
    species,
    item,
    ability: '',
    level: 50,
    nature: 'Hardy',
    moves: [],
    ivs: {},
    evs: {}
  };
  
  // Parse each line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('Ability:')) {
      result.ability = line.replace('Ability:', '').trim();
    } else if (line.startsWith('Level:')) {
      result.level = parseInt(line.replace('Level:', '').trim()) || 50;
    } else if (line.includes('Nature')) {
      result.nature = line.replace('Nature', '').trim();
    } else if (line.startsWith('EVs:')) {
      result.evs = parseStats(line.replace('EVs:', '').trim());
    } else if (line.startsWith('IVs:')) {
      result.ivs = parseStats(line.replace('IVs:', '').trim());
    } else if (line.startsWith('- ')) {
      // Move
      const move = line.replace('- ', '').trim();
      result.moves.push(move);
    }
  }
  
  return result;
}

/**
 * Parse stats string like "252 HP / 252 Atk / 4 Def" into PokemonStats object
 */
function parseStats(statsString: string): Partial<PokemonStats> {
  const stats: Partial<PokemonStats> = {};
  
  const statPairs = statsString.split('/').map(s => s.trim());
  
  for (const pair of statPairs) {
    const match = pair.match(/^(\d+)\s+(.+)$/);
    if (match) {
      const value = parseInt(match[1]);
      const statName = match[2].toLowerCase();
      
      switch (statName) {
        case 'hp':
          stats.hp = value;
          break;
        case 'atk':
        case 'attack':
          stats.attack = value;
          break;
        case 'def':
        case 'defense':
          stats.defense = value;
          break;
        case 'spa':
        case 'spatk':
        case 'sp. atk':
        case 'special attack':
          stats.sp_attack = value;
          break;
        case 'spd':
        case 'spdef':
        case 'sp. def':
        case 'special defense':
          stats.sp_defense = value;
          break;
        case 'spe':
        case 'speed':
          stats.speed = value;
          break;
      }
    }
  }
  
  return stats;
}

/**
 * Convert a ShowdownImport to a PokemonBuild-compatible object
 */
export function showdownImportToBuild(showdownImport: ShowdownImport, tier: string = 'OU'): Partial<any> {
  return {
    name: showdownImport.name,
    species: showdownImport.species,
    tier,
    level: showdownImport.level,
    nature: showdownImport.nature,
    ability: showdownImport.ability,
    item: showdownImport.item,
    moves: showdownImport.moves,
    ivs: {
      hp: showdownImport.ivs.hp || 31,
      attack: showdownImport.ivs.attack || 31,
      defense: showdownImport.ivs.defense || 31,
      sp_attack: showdownImport.ivs.sp_attack || 31,
      sp_defense: showdownImport.ivs.sp_defense || 31,
      speed: showdownImport.ivs.speed || 31,
    },
    evs: {
      hp: showdownImport.evs.hp || 0,
      attack: showdownImport.evs.attack || 0,
      defense: showdownImport.evs.defense || 0,
      sp_attack: showdownImport.evs.sp_attack || 0,
      sp_defense: showdownImport.evs.sp_defense || 0,
      speed: showdownImport.evs.speed || 0,
    }
  };
}

/**
 * Example Showdown import formats for validation
 */
export const EXAMPLE_SHOWDOWN_IMPORTS = [
  `Garchomp @ Life Orb
Ability: Rough Skin
Level: 50
EVs: 252 Atk / 4 SpD / 252 Spe
Adamant Nature
- Earthquake
- Dragon Claw
- Stone Edge
- Protect`,
  
  `Pikachu @ Light Ball
Ability: Static
Level: 50
EVs: 252 SpA / 4 SpD / 252 Spe
Timid Nature
IVs: 0 Atk
- Thunderbolt
- Hidden Power Ice
- Substitute
- Thunder Wave`
];

/**
 * Validate if a string looks like a valid Showdown import
 */
export function isValidShowdownImport(importString: string): boolean {
  try {
    const parsed = parseShowdownImport(importString);
    return parsed.name.length > 0 && parsed.moves.length > 0;
  } catch {
    return false;
  }
}

export function parseMultipleShowdownImports(text: string): ShowdownImport[] {
  if (!text.trim()) return [];
  
  // Split the text into individual Pokemon blocks
  const pokemonBlocks = text.split(/\n\s*\n/).filter(block => block.trim());
  
  const results: ShowdownImport[] = [];
  
  for (const block of pokemonBlocks) {
    try {
      const parsed = parseShowdownImport(block);
      if (parsed) {
        results.push(parsed);
      }
    } catch (error) {
      console.warn('Failed to parse Pokemon block:', block, error);
      // Continue parsing other blocks even if one fails
    }
  }
  
  return results;
}

export function multipleShowdownImportsToBuilds(
  parsedPokemon: ShowdownImport[],
  defaultTier: CompetitiveTier = 'OU'
): Array<Omit<PokemonBuild, 'id' | 'created_at' | 'updated_at'>> {
  return parsedPokemon.map(parsed => showdownImportToBuild(parsed, defaultTier));
} 