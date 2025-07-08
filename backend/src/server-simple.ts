const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all Pokemon builds
app.get('/api/pokemon', async (req, res) => {
  try {
    const builds = await prisma.pokemonBuild.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(builds);
  } catch (error) {
    console.error('Error fetching Pokemon builds:', error);
    res.status(500).json({ error: 'Failed to fetch Pokemon builds' });
  }
});

// Create a Pokemon build
app.post('/api/pokemon', async (req, res) => {
  try {
    const { name, tier, moves, item, nature, ability, description } = req.body;
    
    const newBuild = await prisma.pokemonBuild.create({
      data: {
        name,
        tier,
        moves: JSON.stringify(moves || []),
        item,
        nature,
        ability,
        description
      }
    });
    
    res.status(201).json(newBuild);
  } catch (error) {
    console.error('Error creating Pokemon build:', error);
    res.status(500).json({ error: 'Failed to create Pokemon build' });
  }
});

// PokeAPI proxy
app.get('/api/pokeapi/pokemon/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    
    if (!response.ok) {
      return res.status(404).json({ error: 'Pokemon not found' });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Pokemon data:', error);
    res.status(500).json({ error: 'Failed to fetch Pokemon data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 API endpoints available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔌 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
}); 