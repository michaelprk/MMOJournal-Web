const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Pokemon Build API is running!'
  });
});

// Get all Pokemon builds
app.get('/api/pokemon', async (req, res) => {
  try {
    console.log('Fetching all Pokemon builds...');
    const builds = await prisma.pokemonBuild.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Parse the moves JSON for each build
    const parsedBuilds = builds.map(build => ({
      ...build,
      moves: JSON.parse(build.moves || '[]')
    }));
    
    res.json(parsedBuilds);
    console.log(`✅ Found ${builds.length} Pokemon builds`);
  } catch (error) {
    console.error('❌ Error fetching Pokemon builds:', error);
    res.status(500).json({ error: 'Failed to fetch Pokemon builds' });
  }
});

// Get Pokemon build by ID
app.get('/api/pokemon/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching Pokemon build with ID: ${id}`);
    
    const build = await prisma.pokemonBuild.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!build) {
      return res.status(404).json({ error: 'Pokemon build not found' });
    }
    
    // Parse the moves JSON
    const parsedBuild = {
      ...build,
      moves: JSON.parse(build.moves || '[]')
    };
    
    res.json(parsedBuild);
    console.log(`✅ Found Pokemon build: ${build.name}`);
  } catch (error) {
    console.error('❌ Error fetching Pokemon build:', error);
    res.status(500).json({ error: 'Failed to fetch Pokemon build' });
  }
});

// Create new Pokemon build
app.post('/api/pokemon', async (req, res) => {
  try {
    console.log('Creating new Pokemon build...');
    const { name, species, gender, level, tier, moves, item, nature, ability, ivs, evs, description, hpIV, attackIV, defenseIV, spAttackIV, spDefenseIV, speedIV, hpEV, attackEV, defenseEV, spAttackEV, spDefenseEV, speedEV } = req.body;
    
    // Basic validation
    if (!name) {
      return res.status(400).json({ error: 'Pokemon name is required' });
    }
    
    const newBuild = await prisma.pokemonBuild.create({
      data: {
        name,
        species: species || name,
        gender: gender || null,
        level: level || 50,
        tier: tier || 'OU',
        moves: JSON.stringify(moves || []),
        item,
        nature,
        ability,
        // IVs with defaults - handle both nested and flat formats
        hpIV: hpIV ?? ivs?.hp ?? 31,
        attackIV: attackIV ?? ivs?.attack ?? 31,
        defenseIV: defenseIV ?? ivs?.defense ?? 31,
        spAttackIV: spAttackIV ?? ivs?.spAttack ?? 31,
        spDefenseIV: spDefenseIV ?? ivs?.spDefense ?? 31,
        speedIV: speedIV ?? ivs?.speed ?? 31,
        // EVs with defaults - handle both nested and flat formats
        hpEV: hpEV ?? evs?.hp ?? 0,
        attackEV: attackEV ?? evs?.attack ?? 0,
        defenseEV: defenseEV ?? evs?.defense ?? 0,
                      spAttackEV: spAttackEV ?? evs?.spAttack ?? 0,
        spDefenseEV: spDefenseEV ?? evs?.spDefense ?? 0,
        speedEV: speedEV ?? evs?.speed ?? 0,
        description,
        team_id: req.body.team_id,
        team_name: req.body.team_name
      }
    });
    
    // Parse the moves JSON for response
    const parsedBuild = {
      ...newBuild,
      moves: JSON.parse(newBuild.moves || '[]')
    };
    
    res.status(201).json(parsedBuild);
    console.log(`✅ Created Pokemon build: ${name}`);
  } catch (error) {
    console.error('❌ Error creating Pokemon build:', error);
    res.status(500).json({ error: 'Failed to create Pokemon build' });
  }
});

// Update Pokemon build
app.patch('/api/pokemon/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating Pokemon build with ID: ${id}`);
    
    const existingBuild = await prisma.pokemonBuild.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingBuild) {
      return res.status(404).json({ error: 'Pokemon build not found' });
    }
    
    const { name, species, gender, level, tier, moves, item, nature, ability, ivs, evs, description, hpIV, attackIV, defenseIV, spAttackIV, spDefenseIV, speedIV, hpEV, attackEV, defenseEV, spAttackEV, spDefenseEV, speedEV } = req.body;
    
    const updatedBuild = await prisma.pokemonBuild.update({
      where: { id: parseInt(id) },
      data: {
        name,
        species: species || name,
        gender: gender !== undefined ? gender : existingBuild.gender,
        level: level || existingBuild.level || 50,
        tier,
        moves: JSON.stringify(moves || []),
        item,
        nature,
        ability,
        // Update IVs if provided - handle both nested and flat formats
        hpIV: hpIV ?? ivs?.hp ?? existingBuild.hpIV,
        attackIV: attackIV ?? ivs?.attack ?? existingBuild.attackIV,
        defenseIV: defenseIV ?? ivs?.defense ?? existingBuild.defenseIV,
        spAttackIV: spAttackIV ?? ivs?.spAttack ?? existingBuild.spAttackIV,
        spDefenseIV: spDefenseIV ?? ivs?.spDefense ?? existingBuild.spDefenseIV,
        speedIV: speedIV ?? ivs?.speed ?? existingBuild.speedIV,
        // Update EVs if provided - handle both nested and flat formats
        hpEV: hpEV ?? evs?.hp ?? existingBuild.hpEV,
        attackEV: attackEV ?? evs?.attack ?? existingBuild.attackEV,
        defenseEV: defenseEV ?? evs?.defense ?? existingBuild.defenseEV,
        spAttackEV: spAttackEV ?? evs?.spAttack ?? existingBuild.spAttackEV,
        spDefenseEV: spDefenseEV ?? evs?.spDefense ?? existingBuild.spDefenseEV,
        speedEV: speedEV ?? evs?.speed ?? existingBuild.speedEV,
        description,
        team_id: req.body.team_id !== undefined ? req.body.team_id : existingBuild.team_id,
        team_name: req.body.team_name !== undefined ? req.body.team_name : existingBuild.team_name
      }
    });
    
    // Parse the moves JSON for response
    const parsedBuild = {
      ...updatedBuild,
      moves: JSON.parse(updatedBuild.moves || '[]')
    };
    
    res.json(parsedBuild);
    console.log(`✅ Updated Pokemon build: ${name}`);
  } catch (error) {
    console.error('❌ Error updating Pokemon build:', error);
    res.status(500).json({ error: 'Failed to update Pokemon build' });
  }
});

// Delete Pokemon build
app.delete('/api/pokemon/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting Pokemon build with ID: ${id}`);
    
    const existingBuild = await prisma.pokemonBuild.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingBuild) {
      return res.status(404).json({ error: 'Pokemon build not found' });
    }
    
    await prisma.pokemonBuild.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Pokemon build deleted successfully' });
    console.log(`✅ Deleted Pokemon build: ${existingBuild.name}`);
  } catch (error) {
    console.error('❌ Error deleting Pokemon build:', error);
    res.status(500).json({ error: 'Failed to delete Pokemon build' });
  }
});

// PokeAPI proxy endpoints
app.get('/api/pokeapi/pokemon/:name', async (req, res) => {
  try {
    const { name } = req.params;
    console.log(`Fetching Pokemon data for: ${name}`);
    
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Pokemon not found' });
      }
      throw new Error(`PokeAPI request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Return simplified data
    const simplifiedData = {
      id: data.id,
      name: data.name,
      types: data.types.map(type => type.type.name),
      abilities: data.abilities.map(ability => ({
        name: ability.ability.name,
        isHidden: ability.is_hidden
      })),
      stats: data.stats.map(stat => ({
        name: stat.stat.name,
        baseStat: stat.base_stat
      })),
      sprite: data.sprites.front_default,
      height: data.height,
      weight: data.weight
    };
    
    res.json(simplifiedData);
    console.log(`✅ Fetched Pokemon data for: ${name}`);
  } catch (error) {
    console.error('❌ Error fetching Pokemon data:', error);
    res.status(500).json({ error: 'Failed to fetch Pokemon data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 Pokemon Build API Server Started!');
  console.log(`📋 Server running on: http://localhost:${PORT}`);
  console.log(`💾 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API endpoints: http://localhost:${PORT}/api`);
  console.log('');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔌 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Error handling
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
}); 