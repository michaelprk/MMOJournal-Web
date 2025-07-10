import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validatePokemonBuild } from '../middleware/validation';

const router = express.Router();
const prisma = new PrismaClient();

// GET all Pokemon builds
router.get('/', async (req, res) => {
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

// GET Pokemon build by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const build = await prisma.pokemonBuild.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!build) {
      return res.status(404).json({ error: 'Pokemon build not found' });
    }
    
    res.json(build);
  } catch (error) {
    console.error('Error fetching Pokemon build:', error);
    res.status(500).json({ error: 'Failed to fetch Pokemon build' });
  }
});

// CREATE new Pokemon build
router.post('/', validatePokemonBuild, async (req, res) => {
  try {
    const buildData = req.body;
    
    const newBuild = await prisma.pokemonBuild.create({
      data: {
         name: buildData.name,
         species: buildData.species || buildData.name,
         level: buildData.level || 50,
         tier: buildData.tier,
         moves: JSON.stringify(buildData.moves),
         item: buildData.item,
         nature: buildData.nature,
         ability: buildData.ability,
         hpIV: buildData.ivs.hp,
         attackIV: buildData.ivs.attack,
         defenseIV: buildData.ivs.defense,
         spAttackIV: buildData.ivs.spAttack,
         spDefenseIV: buildData.ivs.spDefense,
         speedIV: buildData.ivs.speed,
         hpEV: buildData.evs.hp,
         attackEV: buildData.evs.attack,
         defenseEV: buildData.evs.defense,
         spAttackEV: buildData.evs.spAttack,
         spDefenseEV: buildData.evs.spDefense,
         speedEV: buildData.evs.speed,
         description: buildData.description,
         team_id: buildData.team_id,
         team_name: buildData.team_name
      }
    });
    
    res.status(201).json(newBuild);
  } catch (error) {
    console.error('Error creating Pokemon build:', error);
    res.status(500).json({ error: 'Failed to create Pokemon build' });
  }
});

// UPDATE Pokemon build
router.patch('/:id', validatePokemonBuild, async (req, res) => {
  try {
    const { id } = req.params;
    const buildData = req.body;
    
    const existingBuild = await prisma.pokemonBuild.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingBuild) {
      return res.status(404).json({ error: 'Pokemon build not found' });
    }
    
    const updatedBuild = await prisma.pokemonBuild.update({
      where: { id: parseInt(id) },
      data: {
         name: buildData.name,
         species: buildData.species || buildData.name,
         level: buildData.level || 50,
         tier: buildData.tier,
         moves: JSON.stringify(buildData.moves),
         item: buildData.item,
         nature: buildData.nature,
         ability: buildData.ability,
         hpIV: buildData.ivs.hp,
         attackIV: buildData.ivs.attack,
         defenseIV: buildData.ivs.defense,
         spAttackIV: buildData.ivs.spAttack,
         spDefenseIV: buildData.ivs.spDefense,
         speedIV: buildData.ivs.speed,
         hpEV: buildData.evs.hp,
         attackEV: buildData.evs.attack,
         defenseEV: buildData.evs.defense,
         spAttackEV: buildData.evs.spAttack,
         spDefenseEV: buildData.evs.spDefense,
         speedEV: buildData.evs.speed,
         description: buildData.description,
         team_id: buildData.team_id,
         team_name: buildData.team_name
      }
    });
    
    res.json(updatedBuild);
  } catch (error) {
    console.error('Error updating Pokemon build:', error);
    res.status(500).json({ error: 'Failed to update Pokemon build' });
  }
});

// DELETE Pokemon build
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
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
  } catch (error) {
    console.error('Error deleting Pokemon build:', error);
    res.status(500).json({ error: 'Failed to delete Pokemon build' });
  }
});

export default router; 