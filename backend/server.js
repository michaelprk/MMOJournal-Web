const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads/journal');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

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

// ========================================
// JOURNAL API ENDPOINTS
// ========================================

// Get all journal entries
app.get('/api/journal/entries', async (req, res) => {
  try {
    console.log('📖 Journal entries endpoint called');
    
    // For now, return empty data to test the frontend
    const response = {
      entries: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
      }
    };
    
    res.json(response);
    console.log('✅ Journal entries returned successfully');
  } catch (error) {
    console.error('❌ Error in journal entries endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});

// Get single journal entry
app.get('/api/journal/entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await prisma.journalEntry.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!entry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    
    // Parse JSON fields
    const parsedEntry = {
      ...entry,
      tags: entry.tags ? JSON.parse(entry.tags) : [],
      mediaUrls: entry.mediaUrls ? JSON.parse(entry.mediaUrls) : []
    };
    
    res.json(parsedEntry);
    console.log(`✅ Fetched journal entry: ${entry.title}`);
  } catch (error) {
    console.error('❌ Error fetching journal entry:', error);
    res.status(500).json({ error: 'Failed to fetch journal entry' });
  }
});

// Create new journal entry
app.post('/api/journal/entries', async (req, res) => {
  try {
    console.log('📖 Create journal entry endpoint called');
    const { title, content, tags } = req.body;
    
    // For now, return a mock response to test the frontend
    const mockEntry = {
      id: Date.now(),
      title,
      content,
      plainText: content.replace(/<[^>]*>/g, ''),
      tags: tags || [],
      isPublic: false,
      mediaUrls: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    res.status(201).json(mockEntry);
    console.log('✅ Journal entry created successfully');
  } catch (error) {
    console.error('❌ Error creating journal entry:', error);
    res.status(500).json({ error: 'Failed to create journal entry' });
  }
});

// Update journal entry
app.put('/api/journal/entries/:id', async (req, res) => {
  try {
    console.log('📖 Update journal entry endpoint called');
    const { id } = req.params;
    const { title, content, tags } = req.body;
    
    // For now, return a mock response to test the frontend
    const mockEntry = {
      id: parseInt(id),
      title,
      content,
      plainText: content.replace(/<[^>]*>/g, ''),
      tags: tags || [],
      isPublic: false,
      mediaUrls: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    res.json(mockEntry);
    console.log('✅ Journal entry updated successfully');
  } catch (error) {
    console.error('❌ Error updating journal entry:', error);
    res.status(500).json({ error: 'Failed to update journal entry' });
  }
});

// Delete journal entry
app.delete('/api/journal/entries/:id', async (req, res) => {
  try {
    console.log('📖 Delete journal entry endpoint called');
    const { id } = req.params;
    
    res.json({ message: 'Journal entry deleted successfully' });
    console.log('✅ Journal entry deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting journal entry:', error);
    res.status(500).json({ error: 'Failed to delete journal entry' });
  }
});

// Get all tags
app.get('/api/journal/tags', async (req, res) => {
  try {
    console.log('📖 Journal tags endpoint called');
    
    // For now, return empty data to test the frontend
    const response = [];
    
    res.json(response);
    console.log('✅ Journal tags returned successfully');
  } catch (error) {
    console.error('❌ Error in journal tags endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// Create new tag
app.post('/api/journal/tags', async (req, res) => {
  try {
    console.log('📖 Create journal tag endpoint called');
    const { name } = req.body;
    
    // For now, return a mock response to test the frontend
    const mockTag = {
      id: Date.now(),
      name,
      useCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    res.status(201).json(mockTag);
    console.log('✅ Journal tag created successfully');
  } catch (error) {
    console.error('❌ Error creating journal tag:', error);
    res.status(500).json({ error: 'Failed to create tag' });
  }
});

// Upload media (simplified for now)
app.post('/api/journal/media', upload.single('file'), async (req, res) => {
  try {
    console.log('📖 Upload media endpoint called');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // For now, return a mock response
    const mockMedia = {
      id: Date.now(),
      url: `/api/journal/media/${Date.now()}`,
      filename: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size
    };
    
    res.status(201).json(mockMedia);
    console.log('✅ Media uploaded successfully');
  } catch (error) {
    console.error('❌ Error uploading media:', error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
});

// Serve media files (simplified)
app.get('/api/journal/media/:id', async (req, res) => {
  try {
    console.log('📖 Serve media endpoint called');
    res.status(404).json({ error: 'Media not found' });
  } catch (error) {
    console.error('❌ Error serving media:', error);
    res.status(500).json({ error: 'Failed to serve media' });
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