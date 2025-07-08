import type { PokemonBuild, PokemonApiData, CompetitiveTier } from '../types/pokemon';

const API_BASE_URL = 'http://localhost:4000/api';

// Backend data structure (from your existing API)
interface BackendPokemonBuild {
  id: number;
  name: string;
  species?: string;
  gender?: string;
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
    species: backendBuild.species || backendBuild.name,
    gender: backendBuild.gender as 'M' | 'F' | 'U' | undefined,
    tier: backendBuild.tier as CompetitiveTier,
    level: backendBuild.level || 50,
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
function transformFrontendToBackend(frontendBuild: Omit<PokemonBuild, 'id' | 'created_at' | 'updated_at'>): any {
  return {
    name: frontendBuild.name,
    species: frontendBuild.species || frontendBuild.name,
    gender: frontendBuild.gender,
    level: frontendBuild.level,
    tier: frontendBuild.tier,
    moves: frontendBuild.moves,
    item: frontendBuild.item,
    nature: frontendBuild.nature,
    ability: frontendBuild.ability,
    // Send both formats for maximum compatibility
    ivs: {
      hp: frontendBuild.ivs.hp,
      attack: frontendBuild.ivs.attack,
      defense: frontendBuild.ivs.defense,
      spAttack: frontendBuild.ivs.sp_attack,
      spDefense: frontendBuild.ivs.sp_defense,
      speed: frontendBuild.ivs.speed,
    },
    evs: {
      hp: frontendBuild.evs.hp,
      attack: frontendBuild.evs.attack,
      defense: frontendBuild.evs.defense,
      spAttack: frontendBuild.evs.sp_attack,
      spDefense: frontendBuild.evs.sp_defense,
      speed: frontendBuild.evs.speed,
    },
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
      if (updates.species !== undefined) backendUpdates.species = updates.species;
      if (updates.gender !== undefined) backendUpdates.gender = updates.gender;
      if (updates.tier !== undefined) backendUpdates.tier = updates.tier;
      if (updates.level !== undefined) backendUpdates.level = updates.level;
      if (updates.moves !== undefined) backendUpdates.moves = updates.moves;
      if (updates.item !== undefined) backendUpdates.item = updates.item;
      if (updates.nature !== undefined) backendUpdates.nature = updates.nature;
      if (updates.ability !== undefined) backendUpdates.ability = updates.ability;
      if (updates.description !== undefined) backendUpdates.description = updates.description;
      
      if (updates.ivs) {
        backendUpdates.ivs = {
          hp: updates.ivs.hp,
          attack: updates.ivs.attack,
          defense: updates.ivs.defense,
          spAttack: updates.ivs.sp_attack,
          spDefense: updates.ivs.sp_defense,
          speed: updates.ivs.speed,
        };
      }
      
      if (updates.evs) {
        backendUpdates.evs = {
          hp: updates.evs.hp,
          attack: updates.evs.attack,
          defense: updates.evs.defense,
          spAttack: updates.evs.sp_attack,
          spDefense: updates.evs.sp_defense,
          speed: updates.evs.speed,
        };
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
      // Try to get PokeMMO items first
      const pokeMMOItems = await PokeMMOService.searchItems(query);
      
      if (pokeMMOItems.length > 0) {
        return pokeMMOItems;
      }

      // Fallback to comprehensive hardcoded list if PokeMMO API fails or returns no results
      const commonItems = [
        // Classic competitive items
        'Life Orb', 'Choice Band', 'Choice Scarf', 'Choice Specs', 'Leftovers',
        'Focus Sash', 'Assault Vest', 'Light Ball', 'Eviolite', 'Rocky Helmet',
        'Heat Rock', 'Damp Rock', 'Smooth Rock', 'Icy Rock', 'Toxic Orb',
        'Flame Orb', 'Black Sludge', 'Sitrus Berry', 'Lum Berry', 'Chesto Berry',
        'Expert Belt', 'Muscle Band', 'Wise Glasses', 'Scope Lens', 'Razor Claw',
        'Quick Claw', 'King\'s Rock', 'BrightPowder', 'Amulet Coin', 'Lucky Egg',
        'Mental Herb', 'White Herb', 'Power Herb', 'Big Root', 'Metronome',
        'Wide Lens', 'Zoom Lens', 'Grip Claw', 'Sticky Barb', 'Iron Ball',
        'Lagging Tail', 'Shed Shell', 'Red Card', 'Eject Button', 'Air Balloon',
        'Float Stone', 'Weakness Policy', 'Safety Goggles', 'Terrain Extender',
        
        // Generation 6+ competitive items
        'Heavy Duty Boots', 'Throat Spray', 'Eject Pack', 'Blunder Policy',
        'Room Service', 'Utility Umbrella', 'Protective Pads',
        
        // Generation 9+ competitive items  
        'Covert Cloak', 'Clear Amulet', 'Punching Glove', 'Loaded Dice',
        'Mirror Herb', 'Booster Energy',
        
        // Seeds and terrain items
        'Electric Seed', 'Grassy Seed', 'Misty Seed', 'Psychic Seed'
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

interface PokeMMOItem {
  item_id: number;
  tradable: boolean;
  price: number;
  listings: number;
  quantity: number;
  last_updated: number[];
}

interface PokeMMOItemWithName {
  id: number;
  name: string;
  tradable: boolean;
  price: number;
  listings: number;
  quantity: number;
}

// PokeMMO Item names mapping (comprehensive list including all generations)
const POKEMMO_ITEM_NAMES: Record<number, string> = {
  // Poke Balls
  1: 'Master Ball',
  2: 'Ultra Ball',
  3: 'Great Ball',
  4: 'Poke Ball',
  5: 'Safari Ball',
  6: 'Net Ball',
  7: 'Dive Ball',
  8: 'Nest Ball',
  9: 'Repeat Ball',
  10: 'Timer Ball',
  11: 'Luxury Ball',
  12: 'Premier Ball',
  13: 'Dusk Ball',
  14: 'Heal Ball',
  15: 'Quick Ball',
  16: 'Cherish Ball',
  17: 'Park Ball',
  18: 'Dream Ball',
  19: 'Beast Ball',
  20: 'Fast Ball',
  21: 'Friend Ball',
  22: 'Heavy Ball',
  23: 'Level Ball',
  24: 'Love Ball',
  25: 'Lure Ball',
  26: 'Moon Ball',
  27: 'Sport Ball',

  // Key Items & Tools
  80: 'Bicycle',
  81: 'Town Map',
  82: 'VS Seeker',
  83: 'Fame Checker',
  84: 'TM Case',
  85: 'Berry Pouch',
  86: 'Teachy TV',
  87: 'Tri-Pass',
  88: 'Rainbow Pass',
  89: 'Tea',
  90: 'Mystery Ticket',
  91: 'Aurora Ticket',
  92: 'Powder Jar',
  93: 'Ruby',
  94: 'Sapphire',
  95: 'Magma Emblem',
  96: 'Old Sea Map',
  97: 'Douse Drive',
  98: 'Shock Drive',
  99: 'Burn Drive',
  100: 'Chill Drive',

  // Battle Items & Competitive Items
  201: 'BrightPowder',
  202: 'White Herb',
  203: 'Macho Brace',
  204: 'Exp. Share',
  205: 'Quick Claw',
  206: 'Soothe Bell',
  207: 'Mental Herb',
  208: 'Choice Band',
  209: 'King\'s Rock',
  210: 'SilverPowder',
  211: 'Amulet Coin',
  212: 'Cleanse Tag',
  213: 'Soul Dew',
  214: 'DeepSeaTooth',
  215: 'DeepSeaScale',
  216: 'Smoke Ball',
  217: 'Everstone',
  218: 'Focus Band',
  219: 'Lucky Egg',
  220: 'Scope Lens',
  221: 'Metal Coat',
  222: 'Leftovers',
  223: 'Dragon Scale',
  224: 'Light Ball',
  225: 'Soft Sand',
  226: 'Hard Stone',
  227: 'Miracle Seed',
  228: 'BlackGlasses',
  229: 'Black Belt',
  230: 'Magnet',
  231: 'Mystic Water',
  232: 'Sharp Beak',
  233: 'Poison Barb',
  234: 'NeverMeltIce',
  235: 'Spell Tag',
  236: 'TwistedSpoon',
  237: 'Charcoal',
  238: 'Dragon Fang',
  239: 'Silk Scarf',
  240: 'Up-Grade',
  241: 'Shell Bell',
  242: 'Sea Incense',
  243: 'Lax Incense',
  244: 'Lucky Punch',
  245: 'Metal Powder',
  246: 'Thick Club',
  247: 'Leek',

  // Type-enhancing Items
  250: 'Flame Plate',
  251: 'Splash Plate',
  252: 'Zap Plate',
  253: 'Meadow Plate',
  254: 'Icicle Plate',
  255: 'Fist Plate',
  256: 'Toxic Plate',
  257: 'Earth Plate',
  258: 'Sky Plate',
  259: 'Mind Plate',
  260: 'Insect Plate',
  261: 'Stone Plate',
  262: 'Spooky Plate',
  263: 'Draco Plate',
  264: 'Dread Plate',
  265: 'Iron Plate',
  266: 'Pixie Plate',

  // Generation 4+ Competitive Items
  280: 'Adamant Orb',
  281: 'Lustrous Orb',
  282: 'Griseous Orb',
  283: 'Flame Orb',
  284: 'Toxic Orb',
  285: 'Life Orb',
  286: 'Power Herb',
  287: 'Big Root',
  288: 'Choice Specs',
  289: 'Choice Scarf',
  290: 'Focus Sash',
  291: 'Zoom Lens',
  292: 'Metronome',
  293: 'Iron Ball',
  294: 'Lagging Tail',
  295: 'Destiny Knot',
  296: 'Black Sludge',
  297: 'Grip Claw',
  298: 'Sticky Barb',
  299: 'Shed Shell',
  300: 'Expert Belt',

  // Generation 5+ Items
  320: 'Eviolite',
  321: 'Float Stone',
  322: 'Rocky Helmet',
  323: 'Air Balloon',
  324: 'Red Card',
  325: 'Eject Button',
  326: 'Absorb Bulb',
  327: 'Cell Battery',
  328: 'Ring Target',
  329: 'Binding Band',
  330: 'Evolution Stone',
  331: 'Prism Scale',
  332: 'Razor Claw',
  333: 'Razor Fang',
  334: 'Dubious Disc',
  335: 'Protector',
  336: 'Electirizer',
  337: 'Magmarizer',
  338: 'Oval Stone',

  // Generation 6+ Items
  400: 'Weakness Policy',
  401: 'Assault Vest',
  402: 'Safety Goggles',
  403: 'Luminous Moss',
  404: 'Snowball',
  405: 'Kee Berry',
  406: 'Maranga Berry',
  407: 'Ability Capsule',
  408: 'Roseli Berry',

  // Generation 7+ Items  
  450: 'Protective Pads',
  451: 'Terrain Extender',
  452: 'Electric Seed',
  453: 'Grassy Seed',
  454: 'Misty Seed',
  455: 'Psychic Seed',
  456: 'Adrenaline Orb',

  // Z-Crystals
  500: 'Normalium Z',
  501: 'Firium Z',
  502: 'Waterium Z',
  503: 'Electrium Z',
  504: 'Grassium Z',
  505: 'Icium Z',
  506: 'Fightinium Z',
  507: 'Poisonium Z',
  508: 'Groundium Z',
  509: 'Flyinium Z',
  510: 'Psychium Z',
  511: 'Buginium Z',
  512: 'Rockium Z',
  513: 'Ghostium Z',
  514: 'Dragonium Z',
  515: 'Darkinium Z',
  516: 'Steelium Z',
  517: 'Fairium Z',
  518: 'Pikanium Z',
  519: 'Eevium Z',
  520: 'Snorlium Z',
  521: 'Mewnium Z',
  522: 'Decidium Z',
  523: 'Incinium Z',
  524: 'Primarium Z',
  525: 'Lycanium Z',
  526: 'Mimikium Z',
  527: 'Kommonium Z',
  528: 'Tapunium Z',
  529: 'Solganium Z',
  530: 'Lunalium Z',
  531: 'Marshadium Z',
  532: 'Aloraichium Z',
  533: 'Ultranecrozium Z',

  // Generation 8+ Items
  600: 'Throat Spray',
  601: 'Eject Pack',
  602: 'Heavy-Duty Boots',
  603: 'Blunder Policy',
  604: 'Room Service',
  605: 'Utility Umbrella',
  606: 'Rusted Sword',
  607: 'Rusted Shield',

  // Generation 6+ Items (continued)
  608: 'Covert Cloak',
  609: 'Clear Amulet', 
  610: 'Punching Glove',
  611: 'Loaded Dice',
  612: 'Auspicious Armor',
  613: 'Malicious Armor',
  614: 'Mirror Herb',
  615: 'Booster Energy',

  // Berries (comprehensive list)
  800: 'Cheri Berry',
  801: 'Chesto Berry',
  802: 'Pecha Berry',
  803: 'Rawst Berry',
  804: 'Aspear Berry',
  805: 'Leppa Berry',
  806: 'Oran Berry',
  807: 'Persim Berry',
  808: 'Lum Berry',
  809: 'Sitrus Berry',
  810: 'Figy Berry',
  811: 'Wiki Berry',
  812: 'Mago Berry',
  813: 'Aguav Berry',
  814: 'Iapapa Berry',
  815: 'Razz Berry',
  816: 'Bluk Berry',
  817: 'Nanab Berry',
  818: 'Wepear Berry',
  819: 'Pinap Berry',
  820: 'Pomeg Berry',
  821: 'Kelpsy Berry',
  822: 'Qualot Berry',
  823: 'Hondew Berry',
  824: 'Grepa Berry',
  825: 'Tamato Berry',
  826: 'Cornn Berry',
  827: 'Magost Berry',
  828: 'Rabuta Berry',
  829: 'Nomel Berry',
  830: 'Spelon Berry',
  831: 'Pamtre Berry',
  832: 'Watmel Berry',
  833: 'Durin Berry',
  834: 'Belue Berry',
  835: 'Occa Berry',
  836: 'Passho Berry',
  837: 'Wacan Berry',
  838: 'Rindo Berry',
  839: 'Yache Berry',
  840: 'Chople Berry',
  841: 'Kebia Berry',
  842: 'Shuca Berry',
  843: 'Coba Berry',
  844: 'Payapa Berry',
  845: 'Tanga Berry',
  846: 'Charti Berry',
  847: 'Kasib Berry',
  848: 'Haban Berry',
  849: 'Colbur Berry',
  850: 'Babiri Berry',
  851: 'Chilan Berry',
  852: 'Liechi Berry',
  853: 'Ganlon Berry',
  854: 'Salac Berry',
  855: 'Petaya Berry',
  856: 'Apicot Berry',
  857: 'Lansat Berry',
  858: 'Starf Berry',
  859: 'Enigma Berry',
  860: 'Micle Berry',
  861: 'Custap Berry',
  862: 'Jaboca Berry',
  863: 'Rowap Berry',
  864: 'Roseli Berry',
  865: 'Kee Berry',
  866: 'Maranga Berry',

  // Mega Stones
  900: 'Venusaurite',
  901: 'Charizardite X',
  902: 'Charizardite Y',
  903: 'Blastoisinite',
  904: 'Alakazite',
  905: 'Gengarite',
  906: 'Kangaskhanite',
  907: 'Pinsirite',
  908: 'Gyaradosite',
  909: 'Aerodactylite',
  910: 'Mewtwonite X',
  911: 'Mewtwonite Y',
  912: 'Ampharosite',
  913: 'Steelixite',
  914: 'Scizorite',
  915: 'Heracronite',
  916: 'Houndoominite',
  917: 'Tyranitarite',
  918: 'Sceptilite',
  919: 'Blazikenite',
  920: 'Swampertite',
  921: 'Gardevoirite',
  922: 'Sablenite',
  923: 'Mawilite',
  924: 'Aggronite',
  925: 'Medichamite',
  926: 'Manectite',
  927: 'Sharpedonite',
  928: 'Cameruptite',
  929: 'Altarianite',
  930: 'Banettite',
  931: 'Absolite',
  932: 'Glalitite',
  933: 'Salamencite',
  934: 'Metagrossite',
  935: 'Latiasite',
  936: 'Latiosite',
  937: 'Lopunnite',
  938: 'Garchompite',
  939: 'Lucarionite',
  940: 'Abomasite',
  941: 'Galladite',
  942: 'Audinite',
  943: 'Diancite',

  // More Battle Items
  1000: 'Power Weight',
  1001: 'Power Bracer',
  1002: 'Power Belt',
  1003: 'Power Lens',
  1004: 'Power Band',
  1005: 'Power Anklet',
  1006: 'Muscle Band',
  1007: 'Wise Glasses',
  1008: 'Wide Lens',
  1009: 'Quick Powder',
  1010: 'Heat Rock',
  1011: 'Damp Rock',
  1012: 'Smooth Rock',
  1013: 'Icy Rock',
  1014: 'Light Clay',
  1015: 'Mental Herb',
  1016: 'White Herb',
  1017: 'Power Herb',
  1018: 'Red Card',
  1019: 'Eject Button'
};

class PokeMMOService {
  private static readonly API_URL = 'https://apis.fiereu.de/pokemmoprices/v1/items';
  private static itemCache: PokeMMOItemWithName[] | null = null;
  private static cacheTimestamp: number = 0;
  private static readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  /**
   * Fetch items from PokeMMO API with caching
   */
  static async fetchItems(): Promise<PokeMMOItemWithName[]> {
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.itemCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.itemCache;
    }

    try {
      const response = await fetch(this.API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const items: PokeMMOItem[] = await response.json();
      
      // Transform items and add names
      this.itemCache = items
        .filter(item => item.tradable) // Only show tradable items
        .map(item => ({
          id: item.item_id,
          name: POKEMMO_ITEM_NAMES[item.item_id] || `Item ${item.item_id}`,
          tradable: item.tradable,
          price: item.price,
          listings: item.listings,
          quantity: item.quantity
        }))
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

      this.cacheTimestamp = now;
      return this.itemCache;
    } catch (error) {
      console.error('Error fetching PokeMMO items:', error);
      // Return empty array on error
      return [];
    }
  }

  /**
   * Search items by name with fuzzy matching
   */
  static async searchItems(query: string): Promise<string[]> {
    if (!query.trim()) {
      return [];
    }

    try {
      const items = await this.fetchItems();
      const searchTerm = query.toLowerCase().trim();
      
      return items
        .filter(item => item.name.toLowerCase().includes(searchTerm))
        .map(item => item.name)
        .slice(0, 15); // Limit to 15 results
    } catch (error) {
      console.error('Error searching PokeMMO items:', error);
      return [];
    }
  }
} 