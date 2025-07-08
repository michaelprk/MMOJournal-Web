import express from 'express';

const router = express.Router();

// Simple cache to avoid hitting PokeAPI too frequently
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to fetch from PokeAPI with caching
async function fetchFromPokeAPI(endpoint: string) {
  const cacheKey = endpoint;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const response = await fetch(`https://pokeapi.co/api/v2${endpoint}`);
  if (!response.ok) {
    throw new Error(`PokeAPI request failed: ${response.status}`);
  }
  
  const data = await response.json();
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

// GET Pokemon species data
router.get('/pokemon/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const pokemonData = await fetchFromPokeAPI(`/pokemon/${name.toLowerCase()}`);
    
    // Return simplified data
    const simplifiedData = {
      id: pokemonData.id,
      name: pokemonData.name,
      types: pokemonData.types.map((type: any) => type.type.name),
      abilities: pokemonData.abilities.map((ability: any) => ({
        name: ability.ability.name,
        isHidden: ability.is_hidden
      })),
      stats: pokemonData.stats.map((stat: any) => ({
        name: stat.stat.name,
        baseStat: stat.base_stat
      })),
      sprite: pokemonData.sprites.front_default,
      height: pokemonData.height,
      weight: pokemonData.weight
    };
    
    res.json(simplifiedData);
  } catch (error) {
    console.error('Error fetching Pokemon data:', error);
    if (error instanceof Error && error.message.includes('404')) {
      res.status(404).json({ error: 'Pokemon not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch Pokemon data' });
    }
  }
});

// GET Pokemon ability data
router.get('/ability/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const abilityData = await fetchFromPokeAPI(`/ability/${name.toLowerCase()}`);
    
    const simplifiedData = {
      id: abilityData.id,
      name: abilityData.name,
      effect: abilityData.effect_entries.find((entry: any) => entry.language.name === 'en')?.effect || '',
      shortEffect: abilityData.effect_entries.find((entry: any) => entry.language.name === 'en')?.short_effect || ''
    };
    
    res.json(simplifiedData);
  } catch (error) {
    console.error('Error fetching ability data:', error);
    if (error instanceof Error && error.message.includes('404')) {
      res.status(404).json({ error: 'Ability not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch ability data' });
    }
  }
});

// GET Pokemon move data
router.get('/move/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const moveData = await fetchFromPokeAPI(`/move/${name.toLowerCase()}`);
    
    const simplifiedData = {
      id: moveData.id,
      name: moveData.name,
      type: moveData.type.name,
      power: moveData.power,
      pp: moveData.pp,
      accuracy: moveData.accuracy,
      damageClass: moveData.damage_class.name,
      effect: moveData.effect_entries.find((entry: any) => entry.language.name === 'en')?.effect || '',
      shortEffect: moveData.effect_entries.find((entry: any) => entry.language.name === 'en')?.short_effect || ''
    };
    
    res.json(simplifiedData);
  } catch (error) {
    console.error('Error fetching move data:', error);
    if (error instanceof Error && error.message.includes('404')) {
      res.status(404).json({ error: 'Move not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch move data' });
    }
  }
});

// GET Pokemon nature data
router.get('/nature/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const natureData = await fetchFromPokeAPI(`/nature/${name.toLowerCase()}`);
    
    const simplifiedData = {
      id: natureData.id,
      name: natureData.name,
      increasedStat: natureData.increased_stat?.name || null,
      decreasedStat: natureData.decreased_stat?.name || null
    };
    
    res.json(simplifiedData);
  } catch (error) {
    console.error('Error fetching nature data:', error);
    if (error instanceof Error && error.message.includes('404')) {
      res.status(404).json({ error: 'Nature not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch nature data' });
    }
  }
});

// GET list of all Pokemon (simplified)
router.get('/pokemon', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const pokemonList = await fetchFromPokeAPI(`/pokemon?limit=${limit}&offset=${offset}`);
    res.json(pokemonList);
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    res.status(500).json({ error: 'Failed to fetch Pokemon list' });
  }
});

export default router; 