import type { ShowdownImport, PokemonStats, PokemonBuild, CompetitiveTier } from '../types/pokemon';

/**
 * Parse a Pokemon Showdown import string into a structured object
 */
export function parseShowdownImport(importString: string): ShowdownImport {
  const lines = importString.trim().split('\n').map(line => line.trim());
  
  // First line contains name, gender, item
  const firstLine = lines[0];
  
  // Parse the complex format: "Name (Species) (Gender) @ Item" or "Species (Gender) @ Item"
  let name = '';
  let species = '';
  let gender: 'M' | 'F' | 'U' | undefined = undefined;
  let item: string | undefined = undefined;
  
  // Split by @ to separate item first
  const parts = firstLine.split('@');
  const nameAndSpeciesPart = parts[0].trim();
  item = parts[1]?.trim();
  
  // Handle gender parsing - look for (M) or (F) at the end
  const genderMatch = nameAndSpeciesPart.match(/^(.+?)\s*\(([MF])\)\s*$/);
  
  if (genderMatch) {
    // Gender found, extract it
    const baseNameSpecies = genderMatch[1].trim();
    gender = genderMatch[2] as 'M' | 'F';
    
    // Now check if there's a nickname format: "Nickname (Species)"
    const nicknameMatch = baseNameSpecies.match(/^(.+?)\s*\((.+?)\)\s*$/);
    if (nicknameMatch) {
      // Format: "Nickname (Species) (Gender)"
      name = nicknameMatch[1].trim();
      species = nicknameMatch[2].trim();
    } else {
      // Format: "Species (Gender)"
      name = baseNameSpecies;
      species = baseNameSpecies;
    }
  } else {
    // No gender, check for nickname format: "Nickname (Species)"
    const nicknameMatch = nameAndSpeciesPart.match(/^(.+?)\s*\((.+?)\)\s*$/);
    if (nicknameMatch) {
      // Format: "Nickname (Species)"
      name = nicknameMatch[1].trim();
      species = nicknameMatch[2].trim();
    } else {
      // Format: "Species"
      name = nameAndSpeciesPart;
      species = nameAndSpeciesPart;
    }
  }
  
  // Initialize the result object
  const result: ShowdownImport = {
    name,
    species,
    gender,
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
 * Parse stats string like "252 SpA / 4 SpD / 252 Spe" into PokemonStats object
 */
function parseStats(statsString: string): Partial<PokemonStats> {
  const stats: Partial<PokemonStats> = {};
  
  const statPairs = statsString.split('/').map(s => s.trim());
  
  for (const pair of statPairs) {
    const match = pair.match(/^(\d+)\s+(.+)$/);
    if (match) {
      const value = parseInt(match[1]);
      const statName = match[2].toLowerCase().trim();
      
      // Handle Pokemon Showdown stat abbreviations exactly as they appear
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
        case 'defence':
          stats.defense = value;
          break;
        case 'spa':
        case 'spatk':
        case 'sp. atk':
        case 'special attack':
        case 'sp atk':
          stats.sp_attack = value;
          break;
        case 'spd':
        case 'spdef':
        case 'sp. def':
        case 'special defense':
        case 'special defence':
        case 'sp def':
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
export function showdownImportToBuild(showdownImport: ShowdownImport, tier: CompetitiveTier = 'OU'): Omit<PokemonBuild, 'id' | 'created_at' | 'updated_at'> {
  return {
    name: showdownImport.name,
    species: showdownImport.species,
    gender: showdownImport.gender,
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
 * Convert a PokemonBuild to Pokemon Showdown format string
 */
export function buildToShowdownFormat(build: PokemonBuild): string {
  const lines: string[] = [];
  
  // First line: Name (Species) (Gender) @ Item
  let firstLine = '';
  
  // Add name/species
  if (build.name !== build.species) {
    firstLine += `${build.name} (${build.species})`;
  } else {
    firstLine += build.species;
  }
  
  // Add gender if specified
  if (build.gender && build.gender !== 'U') {
    firstLine += ` (${build.gender})`;
  }
  
  // Add item if present
  if (build.item) {
    firstLine += ` @ ${build.item}`;
  }
  
  lines.push(firstLine);
  
  // Ability
  if (build.ability) {
    lines.push(`Ability: ${build.ability}`);
  }
  
  // Level (only if not 50)
  if (build.level !== 50) {
    lines.push(`Level: ${build.level}`);
  }
  
  // EVs (only include non-zero values)
  const evEntries: string[] = [];
  if ((build.evs.hp ?? 0) > 0) evEntries.push(`${build.evs.hp} HP`);
  if ((build.evs.attack ?? 0) > 0) evEntries.push(`${build.evs.attack} Atk`);
  if ((build.evs.defense ?? 0) > 0) evEntries.push(`${build.evs.defense} Def`);
  if ((build.evs.sp_attack ?? 0) > 0) evEntries.push(`${build.evs.sp_attack} SpA`);
  if ((build.evs.sp_defense ?? 0) > 0) evEntries.push(`${build.evs.sp_defense} SpD`);
  if ((build.evs.speed ?? 0) > 0) evEntries.push(`${build.evs.speed} Spe`);
  
  if (evEntries.length > 0) {
    lines.push(`EVs: ${evEntries.join(' / ')}`);
  }
  
  // Nature
  if (build.nature) {
    lines.push(`${build.nature} Nature`);
  }
  
  // IVs (only include non-31 values)
  const ivEntries: string[] = [];
  if (build.ivs.hp < 31) ivEntries.push(`${build.ivs.hp} HP`);
  if (build.ivs.attack < 31) ivEntries.push(`${build.ivs.attack} Atk`);
  if (build.ivs.defense < 31) ivEntries.push(`${build.ivs.defense} Def`);
  if (build.ivs.sp_attack < 31) ivEntries.push(`${build.ivs.sp_attack} SpA`);
  if (build.ivs.sp_defense < 31) ivEntries.push(`${build.ivs.sp_defense} SpD`);
  if (build.ivs.speed < 31) ivEntries.push(`${build.ivs.speed} Spe`);
  
  if (ivEntries.length > 0) {
    lines.push(`IVs: ${ivEntries.join(' / ')}`);
  }
  
  // Moves
  for (const move of build.moves) {
    if (move) {
      lines.push(`- ${move}`);
    }
  }
  
  return lines.join('\n');
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