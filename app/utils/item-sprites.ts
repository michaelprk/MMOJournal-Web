// Pokemon item sprite utility functions
// Using multiple sources for item sprites to ensure coverage

export function getItemSpriteUrl(itemName: string): string {
  if (!itemName) return '';
  
  // Clean the item name for URL usage
  const cleanName = itemName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Try PokemonDB first (most reliable)
  const pokemonDbUrl = `https://img.pokemondb.net/sprites/items/${cleanName}.png`;
  
  return pokemonDbUrl;
}

export function getFallbackItemSpriteUrl(itemName: string): string {
  if (!itemName) return '';
  
  // Clean the item name for URL usage
  const cleanName = itemName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Alternative source from Serebii
  return `https://www.serebii.net/itemdex/sprites/${cleanName}.png`;
}

// Item category mapping for styling
export const ITEM_CATEGORIES = {
  // Hold items
  'life-orb': 'hold-item',
  'leftovers': 'hold-item',
  'rocky-helmet': 'hold-item',
  'choice-band': 'hold-item',
  'choice-scarf': 'hold-item',
  'choice-specs': 'hold-item',
  'focus-sash': 'hold-item',
  'assault-vest': 'hold-item',
  'heat-rock': 'hold-item',
  'damp-rock': 'hold-item',
  'smooth-rock': 'hold-item',
  'icy-rock': 'hold-item',
  
  // Berries
  'sitrus-berry': 'berry',
  'lum-berry': 'berry',
  'chople-berry': 'berry',
  'yache-berry': 'berry',
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
  
  // Mega stones
  'alakazite': 'mega-stone',
  'absolite': 'mega-stone',
  'aerodactylite': 'mega-stone',
  'aggronite': 'mega-stone',
  'altarianite': 'mega-stone',
  'ampharosite': 'mega-stone',
  
  // Z-Crystals
  'normalium-z': 'z-crystal',
  'firium-z': 'z-crystal',
  'waterium-z': 'z-crystal',
  'electrium-z': 'z-crystal',
  'grassium-z': 'z-crystal',
  'icium-z': 'z-crystal',
  'fightinium-z': 'z-crystal',
  'poisonium-z': 'z-crystal',
} as const;

export function getItemCategory(itemName: string): keyof typeof ITEM_CATEGORIES | 'other' {
  const cleanName = itemName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
    
  return (ITEM_CATEGORIES as any)[cleanName] || 'other';
} 