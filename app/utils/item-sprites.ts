// Pokemon item sprite utility functions
// Now using local images with external fallbacks for better performance and reliability

// Direct mapping of item names to local image paths
// This replaces the problematic require() approach
const LOCAL_ITEM_MAPPING: Record<string, string> = {
  "protective-pads": "/images/items/protective-pads.png",
  "terrain-extender": "/images/items/terrain-extender.png",
  "electric-seed": "/images/items/electric-seed.png",
  "grassy-seed": "/images/items/grassy-seed.png",
  "misty-seed": "/images/items/misty-seed.png",
  "psychic-seed": "/images/items/psychic-seed.png",
  "life-orb": "/images/items/life-orb.png",
  "choice-band": "/images/items/choice-band.png",
  "choice-scarf": "/images/items/choice-scarf.png",
  "choice-specs": "/images/items/choice-specs.png",
  "leftovers": "/images/items/leftovers.png",
  "focus-sash": "/images/items/focus-sash.png",
  "assault-vest": "/images/items/assault-vest.png",
  "rocky-helmet": "/images/items/rocky-helmet.png",
  "eviolite": "/images/items/eviolite.png",
  "toxic-orb": "/images/items/toxic-orb.png",
  "flame-orb": "/images/items/flame-orb.png",
  "air-balloon": "/images/items/air-balloon.png",
  "weakness-policy": "/images/items/weakness-policy.png",
  "safety-goggles": "/images/items/safety-goggles.png",
  "covert-cloak": "/images/items/covert-cloak.png",
  "clear-amulet": "/images/items/clear-amulet.png",
  "punching-glove": "/images/items/punching-glove.png",
  "loaded-dice": "/images/items/loaded-dice.png",
  "mirror-herb": "/images/items/mirror-herb.png",
  "booster-energy": "/images/items/booster-energy.png",
  "heavy-duty-boots": "/images/items/heavy-duty-boots.png",
  "throat-spray": "/images/items/throat-spray.png",
  "eject-pack": "/images/items/eject-pack.png",
  "blunder-policy": "/images/items/blunder-policy.png",
  "room-service": "/images/items/room-service.png",
  "utility-umbrella": "/images/items/utility-umbrella.png"
};

export function getLocalItemImagePath(itemName: string): string | null {
  if (!itemName) return null;
  
  const cleanName = itemName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
    
  return LOCAL_ITEM_MAPPING[cleanName] || null;
}

export function getItemSpriteUrl(itemName: string): string {
  if (!itemName) return '';
  
  // Check for local image first
  const localPath = getLocalItemImagePath(itemName);
  if (localPath) {
    return localPath;
  }
  
  // Fallback to external sources
  const cleanName = itemName
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^a-z0-9\-]/g, '')    // Remove special characters except hyphens
    .replace(/-+/g, '-')            // Collapse multiple hyphens
    .replace(/^-|-$/g, '');         // Remove leading/trailing hyphens

  // Handle special item name mappings for better sprite compatibility
  const specialMappings: Record<string, string> = {
    'covert-cloak': 'covert-cloak',
    'clear-amulet': 'clear-amulet', 
    'punching-glove': 'punching-glove',
    'loaded-dice': 'loaded-dice',
    'mirror-herb': 'mirror-herb',
    'booster-energy': 'booster-energy',
    'heavy-duty-boots': 'heavy-duty-boots',
    'throat-spray': 'throat-spray',
    'eject-pack': 'eject-pack',
    'blunder-policy': 'blunder-policy',
    'room-service': 'room-service',
    'utility-umbrella': 'utility-umbrella',
    'protective-pads': 'protective-pads',
    'terrain-extender': 'terrain-extender',
    'electric-seed': 'electric-seed',
    'grassy-seed': 'grassy-seed',
    'misty-seed': 'misty-seed',
    'psychic-seed': 'psychic-seed',
    'adrenaline-orb': 'adrenaline-orb',
    'weakness-policy': 'weakness-policy',
    'assault-vest': 'assault-vest',
    'safety-goggles': 'safety-goggles',
    'luminous-moss': 'luminous-moss',
    'ability-capsule': 'ability-capsule',
    'air-balloon': 'air-balloon',
    'eject-button': 'eject-button',
    'red-card': 'red-card',
    'rocky-helmet': 'rocky-helmet',
    'choice-band': 'choice-band',
    'choice-scarf': 'choice-scarf',
    'choice-specs': 'choice-specs',
    'life-orb': 'life-orb',
    'toxic-orb': 'toxic-orb',
    'flame-orb': 'flame-orb',
    'focus-sash': 'focus-sash',
    'expert-belt': 'expert-belt',
    'muscle-band': 'muscle-band',
    'wise-glasses': 'wise-glasses',
    'scope-lens': 'scope-lens',
    'wide-lens': 'wide-lens',
    'zoom-lens': 'zoom-lens',
    'quick-claw': 'quick-claw',
    'kings-rock': 'kings-rock',
    'bright-powder': 'bright-powder',
    'mental-herb': 'mental-herb',
    'white-herb': 'white-herb',
    'power-herb': 'power-herb',
    'big-root': 'big-root',
    'black-sludge': 'black-sludge',
    'grip-claw': 'grip-claw',
    'sticky-barb': 'sticky-barb',
    'shed-shell': 'shed-shell',
    'iron-ball': 'iron-ball',
    'lagging-tail': 'lagging-tail',
    'destiny-knot': 'destiny-knot',
    'light-clay': 'light-clay',
    'heat-rock': 'heat-rock',
    'damp-rock': 'damp-rock',
    'smooth-rock': 'smooth-rock',
    'icy-rock': 'icy-rock',
    'leftovers': 'leftovers',
    'shell-bell': 'shell-bell',
    'soothe-bell': 'soothe-bell',
    'macho-brace': 'macho-brace',
    'power-weight': 'power-weight',
    'power-bracer': 'power-bracer',
    'power-belt': 'power-belt',
    'power-lens': 'power-lens',
    'power-band': 'power-band',
    'power-anklet': 'power-anklet',
    'eviolite': 'eviolite',
    'float-stone': 'float-stone',
  };

  const mappedName = specialMappings[cleanName] || cleanName;

  // Primary source: PokemonDB (most reliable and updated)
  const pokemonDbUrl = `https://img.pokemondb.net/sprites/items/${mappedName}.png`;
  
  return pokemonDbUrl;
}

export function getFallbackItemSpriteUrl(itemName: string): string {
  if (!itemName) return '';
  
  const cleanName = itemName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Secondary source: Serebii
  return `https://www.serebii.net/itemdex/sprites/${cleanName}.png`;
}

export function getAlternativeItemSpriteUrl(itemName: string): string {
  if (!itemName) return '';
  
  const cleanName = itemName
    .toLowerCase()
    .replace(/\s+/g, '')  // Remove all spaces for this source
    .replace(/[^a-z0-9]/g, '');

  // Alternative source: Bulbapedia style
  return `https://archives.bulbagarden.net/media/upload/7/7a/Bag_${cleanName}_Sprite.png`;
}

export function getPokeMMOHubItemSpriteUrl(itemName: string): string {
  if (!itemName) return '';
  
  // Clean the item name for PokeMMO Hub format
  const cleanName = itemName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Special mappings for PokeMMO Hub newer generation items
  const pokeMMOHubMappings: Record<string, string> = {
    'covert-cloak': 'covert-cloak',
    'clear-amulet': 'clear-amulet',
    'punching-glove': 'punching-glove', 
    'loaded-dice': 'loaded-dice',
    'mirror-herb': 'mirror-herb',
    'booster-energy': 'booster-energy',
    'heavy-duty-boots': 'heavy-duty-boots',
    'throat-spray': 'throat-spray',
    'eject-pack': 'eject-pack',
    'blunder-policy': 'blunder-policy',
    'room-service': 'room-service',
    'utility-umbrella': 'utility-umbrella',
    'protective-pads': 'protective-pads',
    'terrain-extender': 'terrain-extender',
    'electric-seed': 'electric-seed',
    'grassy-seed': 'grassy-seed',
    'misty-seed': 'misty-seed',
    'psychic-seed': 'psychic-seed',
    'auspicious-armor': 'auspicious-armor',
    'malicious-armor': 'malicious-armor'
  };

  const mappedName = pokeMMOHubMappings[cleanName] || cleanName;
  
  // PokeMMO Hub items URL format
  return `https://pokemmohub.com/static/img/items/${mappedName}.png`;
}

// Comprehensive item category mapping for styling and organization
export const ITEM_CATEGORIES = {
  // Hold items - Competitive
  'life-orb': 'hold-item',
  'leftovers': 'hold-item',
  'rocky-helmet': 'hold-item',
  'choice-band': 'hold-item',
  'choice-scarf': 'hold-item',
  'choice-specs': 'hold-item',
  'focus-sash': 'hold-item',
  'assault-vest': 'hold-item',
  'eviolite': 'hold-item',
  'expert-belt': 'hold-item',
  'muscle-band': 'hold-item',
  'wise-glasses': 'hold-item',
  'weakness-policy': 'hold-item',
  'safety-goggles': 'hold-item',
  'protective-pads': 'hold-item',
  'terrain-extender': 'hold-item',
  'electric-seed': 'hold-item',
  'grassy-seed': 'hold-item',
  'misty-seed': 'hold-item',
  'psychic-seed': 'hold-item',
  'heavy-duty-boots': 'hold-item',
  'throat-spray': 'hold-item',
  'eject-pack': 'hold-item',
  'blunder-policy': 'hold-item',
  'room-service': 'hold-item',
  'utility-umbrella': 'hold-item',
  'covert-cloak': 'hold-item',
  'clear-amulet': 'hold-item',
  'punching-glove': 'hold-item',
  'loaded-dice': 'hold-item',
  'mirror-herb': 'hold-item',
  'booster-energy': 'hold-item',

  // Weather/Terrain items
  'heat-rock': 'weather-item',
  'damp-rock': 'weather-item',
  'smooth-rock': 'weather-item',
  'icy-rock': 'weather-item',
  'light-clay': 'weather-item',

  // Status orbs
  'toxic-orb': 'status-orb',
  'flame-orb': 'status-orb',
  'adrenaline-orb': 'status-orb',

  // Utility items
  'air-balloon': 'utility-item',
  'red-card': 'utility-item',
  'eject-button': 'utility-item',
  'shed-shell': 'utility-item',
  'iron-ball': 'utility-item',
  'lagging-tail': 'utility-item',
  'destiny-knot': 'utility-item',
  'quick-claw': 'utility-item',
  'kings-rock': 'utility-item',
  'scope-lens': 'utility-item',
  'wide-lens': 'utility-item',
  'zoom-lens': 'utility-item',
  'bright-powder': 'utility-item',
  'mental-herb': 'utility-item',
  'white-herb': 'utility-item',
  'power-herb': 'utility-item',
  'big-root': 'utility-item',
  'grip-claw': 'utility-item',
  'sticky-barb': 'utility-item',
  'float-stone': 'utility-item',

  // Recovery items
  'black-sludge': 'recovery-item',
  'shell-bell': 'recovery-item',

  // Training items
  'macho-brace': 'training-item',
  'power-weight': 'training-item',
  'power-bracer': 'training-item',
  'power-belt': 'training-item',
  'power-lens': 'training-item',
  'power-band': 'training-item',
  'power-anklet': 'training-item',
  'soothe-bell': 'training-item',

  // Type plates
  'flame-plate': 'type-plate',
  'splash-plate': 'type-plate',
  'zap-plate': 'type-plate',
  'meadow-plate': 'type-plate',
  'icicle-plate': 'type-plate',
  'fist-plate': 'type-plate',
  'toxic-plate': 'type-plate',
  'earth-plate': 'type-plate',
  'sky-plate': 'type-plate',
  'mind-plate': 'type-plate',
  'insect-plate': 'type-plate',
  'stone-plate': 'type-plate',
  'spooky-plate': 'type-plate',
  'draco-plate': 'type-plate',
  'dread-plate': 'type-plate',
  'iron-plate': 'type-plate',
  'pixie-plate': 'type-plate',

  // Berries
  'cheri-berry': 'berry',
  'chesto-berry': 'berry',
  'pecha-berry': 'berry',
  'rawst-berry': 'berry',
  'aspear-berry': 'berry',
  'leppa-berry': 'berry',
  'oran-berry': 'berry',
  'persim-berry': 'berry',
  'lum-berry': 'berry',
  'sitrus-berry': 'berry',
  'figy-berry': 'berry',
  'wiki-berry': 'berry',
  'mago-berry': 'berry',
  'aguav-berry': 'berry',
  'iapapa-berry': 'berry',
  'occa-berry': 'berry',
  'passho-berry': 'berry',
  'wacan-berry': 'berry',
  'rindo-berry': 'berry',
  'yache-berry': 'berry',
  'chople-berry': 'berry',
  'kebia-berry': 'berry',
  'shuca-berry': 'berry',
  'coba-berry': 'berry',
  'payapa-berry': 'berry',
  'tanga-berry': 'berry',
  'charti-berry': 'berry',
  'kasib-berry': 'berry',
  'haban-berry': 'berry',
  'colbur-berry': 'berry',
  'babiri-berry': 'berry',
  'chilan-berry': 'berry',
  'roseli-berry': 'berry',
  'kee-berry': 'berry',
  'maranga-berry': 'berry',

  // Mega stones
  'alakazite': 'mega-stone',
  'absolite': 'mega-stone',
  'aerodactylite': 'mega-stone',
  'aggronite': 'mega-stone',
  'altarianite': 'mega-stone',
  'ampharosite': 'mega-stone',
  'banettite': 'mega-stone',
  'blastoisinite': 'mega-stone',
  'blazikenite': 'mega-stone',
  'cameruptite': 'mega-stone',
  'charizardite-x': 'mega-stone',
  'charizardite-y': 'mega-stone',
  'diancite': 'mega-stone',
  'galladite': 'mega-stone',
  'garchompite': 'mega-stone',
  'gardevoirite': 'mega-stone',
  'gengarite': 'mega-stone',
  'glalitite': 'mega-stone',
  'gyaradosite': 'mega-stone',
  'heracronite': 'mega-stone',
  'houndoominite': 'mega-stone',
  'kangaskhanite': 'mega-stone',
  'latiasite': 'mega-stone',
  'latiosite': 'mega-stone',
  'lopunnite': 'mega-stone',
  'lucarionite': 'mega-stone',
  'manectite': 'mega-stone',
  'mawilite': 'mega-stone',
  'medichamite': 'mega-stone',
  'metagrossite': 'mega-stone',
  'mewtwonite-x': 'mega-stone',
  'mewtwonite-y': 'mega-stone',
  'pinsirite': 'mega-stone',
  'sablenite': 'mega-stone',
  'salamencite': 'mega-stone',
  'sceptilite': 'mega-stone',
  'scizorite': 'mega-stone',
  'sharpedonite': 'mega-stone',
  'steelixite': 'mega-stone',
  'swampertite': 'mega-stone',
  'tyranitarite': 'mega-stone',
  'venusaurite': 'mega-stone',

  // Z-Crystals
  'normalium-z': 'z-crystal',
  'firium-z': 'z-crystal',
  'waterium-z': 'z-crystal',
  'electrium-z': 'z-crystal',
  'grassium-z': 'z-crystal',
  'icium-z': 'z-crystal',
  'fightinium-z': 'z-crystal',
  'poisonium-z': 'z-crystal',
  'groundium-z': 'z-crystal',
  'flyinium-z': 'z-crystal',
  'psychium-z': 'z-crystal',
  'buginium-z': 'z-crystal',
  'rockium-z': 'z-crystal',
  'ghostium-z': 'z-crystal',
  'dragonium-z': 'z-crystal',
  'darkinium-z': 'z-crystal',
  'steelium-z': 'z-crystal',
  'fairium-z': 'z-crystal',
  'pikanium-z': 'z-crystal',
  'eevium-z': 'z-crystal',
  'snorlium-z': 'z-crystal',
  'mewnium-z': 'z-crystal',
  'decidium-z': 'z-crystal',
  'incinium-z': 'z-crystal',
  'primarium-z': 'z-crystal',
  'lycanium-z': 'z-crystal',
  'mimikium-z': 'z-crystal',
  'kommonium-z': 'z-crystal',
  'tapunium-z': 'z-crystal',
  'solganium-z': 'z-crystal',
  'lunalium-z': 'z-crystal',
  'marshadium-z': 'z-crystal',
  'aloraichium-z': 'z-crystal',
  'ultranecrozium-z': 'z-crystal',
} as const;

export function getItemCategory(itemName: string): keyof typeof ITEM_CATEGORIES | 'other' {
  const cleanName = itemName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
    
  return (ITEM_CATEGORIES as any)[cleanName] || 'other';
}

// Enhanced function to get multiple sprite URL options with local images prioritized
export function getItemSpriteUrls(itemName: string): string[] {
  const urls: string[] = [];
  
  // Always try local image first for best performance
  const localPath = getLocalItemImagePath(itemName);
  if (localPath) {
    urls.push(localPath);
  }
  
  // Add external fallbacks
  urls.push(
    getItemSpriteUrl(itemName),
    getFallbackItemSpriteUrl(itemName),
    getPokeMMOHubItemSpriteUrl(itemName),
    getAlternativeItemSpriteUrl(itemName)
  );
  
  return urls.filter(Boolean);
} 