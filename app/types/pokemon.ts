export interface PokemonBuild {
  id: string;
  name: string;
  species: string;
  gender?: 'M' | 'F' | 'U'; // Male, Female, or Unknown/Genderless
  tier: CompetitiveTier;
  level: number;
  nature: string;
  ability: string;
  item?: string;
  moves: string[];
  ivs: PokemonStats;
  evs: PokemonStats;
  description?: string;
  showdown_import?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  sp_attack: number;
  sp_defense: number;
  speed: number;
}

export type CompetitiveTier = 'OU' | 'UU' | 'NU' | 'Doubles' | 'RU' | 'LC';

export interface PokemonApiData {
  id: number;
  name: string;
  types: string[];
  abilities: Array<{
    name: string;
    isHidden: boolean;
  }>;
  stats: Array<{
    name: string;
    baseStat: number;
  }>;
  sprite: string;
  height: number;
  weight: number;
}

export interface ShowdownImport {
  name: string;
  species: string;
  gender?: 'M' | 'F' | 'U';
  item?: string;
  ability: string;
  level: number;
  nature: string;
  moves: string[];
  ivs: Partial<PokemonStats>;
  evs: Partial<PokemonStats>;
}

export const COMPETITIVE_TIERS: CompetitiveTier[] = [
  'OU', 'UU', 'NU', 'Doubles', 'RU', 'LC'
];

export const TIER_FULL_NAMES: Record<CompetitiveTier, string> = {
  'OU': 'Over Used',
  'UU': 'Under Used',
  'NU': 'Never Used',
  'Doubles': 'Doubles/VGC',
  'RU': 'Rarely Used',
  'LC': 'Little Cup'
};

export const TIER_COLORS: Record<CompetitiveTier, { background: string; text: string; gradient: string }> = {
  'OU': { 
    background: '#2196f3', 
    text: '#fff', 
    gradient: 'linear-gradient(135deg, #2196f3, #42a5f5)' 
  },
  'UU': { 
    background: '#4caf50', 
    text: '#fff', 
    gradient: 'linear-gradient(135deg, #4caf50, #66bb6a)' 
  },
  'RU': { 
    background: '#ff9800', 
    text: '#fff', 
    gradient: 'linear-gradient(135deg, #ff9800, #ffb74d)' 
  },
  'NU': { 
    background: '#f9c74f', 
    text: '#000', 
    gradient: 'linear-gradient(135deg, #f9c74f, #f9d71c)' 
  },
  'LC': { 
    background: '#9c27b0', 
    text: '#fff', 
    gradient: 'linear-gradient(135deg, #9c27b0, #ba68c8)' 
  },
  'Doubles': { 
    background: '#f44336', 
    text: '#fff', 
    gradient: 'linear-gradient(135deg, #f44336, #ef5350)' 
  }
};

export const POKEMON_NATURES = [
  'Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty',
  'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax',
  'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive',
  'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash',
  'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky'
] as const;

export const MOVE_TYPE_COLORS: Record<string, { background: string; text: string }> = {
  'fire': { background: 'linear-gradient(45deg, #ff6b35, #f7931e)', text: '#fff' },
  'water': { background: 'linear-gradient(45deg, #4fc3f7, #29b6f6)', text: '#fff' },
  'grass': { background: 'linear-gradient(45deg, #81c784, #66bb6a)', text: '#fff' },
  'psychic': { background: 'linear-gradient(45deg, #ba68c8, #ab47bc)', text: '#fff' },
  'ghost': { background: 'linear-gradient(45deg, #7e57c2, #673ab7)', text: '#fff' },
  'steel': { background: 'linear-gradient(45deg, #90a4ae, #78909c)', text: '#fff' },
  'ice': { background: 'linear-gradient(45deg, #81d4fa, #4fc3f7)', text: '#000' },
  'rock': { background: 'linear-gradient(45deg, #a1887f, #8d6e63)', text: '#fff' },
  'ground': { background: 'linear-gradient(45deg, #8d6e63, #5d4037)', text: '#fff' },
  'electric': { background: 'linear-gradient(45deg, #ffd54f, #ffcc02)', text: '#000' },
  'normal': { background: 'linear-gradient(45deg, #bdbdbd, #9e9e9e)', text: '#000' },
  'fighting': { background: 'linear-gradient(45deg, #e57373, #ef5350)', text: '#fff' },
  'poison': { background: 'linear-gradient(45deg, #ad7be9, #9c27b0)', text: '#fff' },
  'flying': { background: 'linear-gradient(45deg, #81c784, #29b6f6)', text: '#fff' },
  'bug': { background: 'linear-gradient(45deg, #aed581, #9ccc65)', text: '#000' },
  'dragon': { background: 'linear-gradient(45deg, #7986cb, #5c6bc0)', text: '#fff' },
  'dark': { background: 'linear-gradient(45deg, #616161, #424242)', text: '#fff' },
  'fairy': { background: 'linear-gradient(45deg, #f8bbd9, #f48fb1)', text: '#000' },
};

// =============================================================================
// SHINY HUNT TYPES
// =============================================================================

export type HuntingMethod = 
  | 'Hordes 5x'
  | 'Hordes 3x'
  | 'Singles / Lures'
  | 'Safari'
  | 'Egg (including Alphas)'
  | 'Honey';

export interface ShinyHunt {
  id: number;
  pokemonId: number; // National Dex ID (1-649 for Gen 1-5)
  pokemonName: string;
  method: HuntingMethod;
  startDate: string;
  phaseCount: number;
  totalEncounters: number;
  isCompleted: boolean;
  notes?: string;
  phasePokemon?: PhasePokemon[]; // Array of Pokemon encountered in each phase
  createdAt: string;
  updatedAt: string;
}

export interface PhasePokemon {
  phase: number;
  pokemonId: number;
  pokemonName: string;
  encounters: number;
}

export interface ShinyPortfolio {
  id: number;
  pokemonId: number; // National Dex ID (1-649 for Gen 1-5)
  pokemonName: string;
  method: HuntingMethod;
  dateFound: string;
  nature?: string;
  encounterCount?: number;
  // IVs (Individual Values) - 0-31 for each stat
  ivs?: Partial<PokemonStats>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const HUNTING_METHODS: HuntingMethod[] = [
  'Hordes 5x',
  'Hordes 3x',
  'Singles / Lures',
  'Safari',
  'Egg (including Alphas)',
  'Honey'
];

export const HUNTING_METHOD_COLORS: Record<HuntingMethod, { background: string; text: string }> = {
  'Hordes 5x': { background: 'linear-gradient(45deg, #ff6b35, #f7931e)', text: '#fff' },
  'Hordes 3x': { background: 'linear-gradient(45deg, #ff9800, #ffb74d)', text: '#fff' },
  'Singles / Lures': { background: 'linear-gradient(45deg, #4fc3f7, #29b6f6)', text: '#fff' },
  'Safari': { background: 'linear-gradient(45deg, #81c784, #66bb6a)', text: '#fff' },
  'Egg (including Alphas)': { background: 'linear-gradient(45deg, #ba68c8, #ab47bc)', text: '#fff' },
  'Honey': { background: 'linear-gradient(45deg, #ffd54f, #ffcc02)', text: '#000' }
};

// Pokemon data for Gen 1-5 (IDs 1-649)
export interface PokemonData {
  id: number;
  name: string;
  sprite: string; // Path to shiny sprite
}

// Helper function to get shiny sprite path
export const getShinySpritePath = (pokemonId: number, pokemonName: string): string => {
  const paddedId = pokemonId.toString().padStart(3, '0');
  return `/images/shiny-sprites/${paddedId}_${pokemonName}.gif`;
};

// Generate consistent colors for each Pokemon based on their ID
export const getPokemonColors = (pokemonId: number) => {
  // Create a simple hash from the Pokemon ID to generate consistent colors
  const hue = (pokemonId * 137.508) % 360; // Golden ratio approximation for good color distribution
  const saturation = 60 + (pokemonId % 40); // 60-100% saturation
  const lightness = 45 + (pokemonId % 20); // 45-65% lightness
  
  const primaryColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const primaryColorRgb = hslToRgb(hue / 360, saturation / 100, lightness / 100);
  
  return {
    primary: primaryColor,
    primaryRgb: primaryColorRgb,
    // Lighter version for backgrounds
    light: `hsl(${hue}, ${Math.max(30, saturation - 20)}%, ${Math.min(80, lightness + 25)}%)`,
    // Darker version for borders
    dark: `hsl(${hue}, ${Math.min(100, saturation + 20)}%, ${Math.max(20, lightness - 20)}%)`,
    // For glows and effects
    glow: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`,
    glowLight: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.3)`,
    glowDark: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`
  };
};

// Helper function to convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): string {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return `${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}`;
}

// Shiny odds for PokeMMO (1 in 30,000)
export const SHINY_ODDS = 30000; 