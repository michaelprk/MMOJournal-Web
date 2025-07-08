import type { Request, Response, NextFunction } from 'express';

export interface PokemonBuildData {
  name: string;
  species: string;
  level: number;
  nature: string;
  ability: string;
  item?: string;
  moves: string[];
  ivs: {
    hp: number;
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
  };
  evs: {
    hp: number;
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
  };
  tier?: string;
  description?: string;
}

export const validatePokemonBuild = (req: Request, res: Response, next: NextFunction) => {
  const { name, species, level, nature, ability, moves, ivs, evs } = req.body;
  const errors: string[] = [];

  // Required fields
  if (!name || typeof name !== 'string') {
    errors.push('Name is required and must be a string');
  }
  
  if (!species || typeof species !== 'string') {
    errors.push('Species is required and must be a string');
  }
  
  if (!level || typeof level !== 'number' || level < 1 || level > 100) {
    errors.push('Level must be a number between 1 and 100');
  }
  
  if (!nature || typeof nature !== 'string') {
    errors.push('Nature is required and must be a string');
  }
  
  if (!ability || typeof ability !== 'string') {
    errors.push('Ability is required and must be a string');
  }
  
  if (!moves || !Array.isArray(moves) || moves.length === 0 || moves.length > 4) {
    errors.push('Moves must be an array with 1-4 moves');
  }

  // IV validation
  if (!ivs || typeof ivs !== 'object') {
    errors.push('IVs object is required');
  } else {
    const ivStats = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'];
    for (const stat of ivStats) {
      const value = ivs[stat as keyof typeof ivs];
      if (typeof value !== 'number' || value < 0 || value > 31) {
        errors.push(`IV ${stat} must be a number between 0 and 31`);
      }
    }
  }

  // EV validation
  if (!evs || typeof evs !== 'object') {
    errors.push('EVs object is required');
  } else {
    const evStats = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'];
    let totalEvs = 0;
    
    for (const stat of evStats) {
      const value = evs[stat as keyof typeof evs];
      if (typeof value !== 'number' || value < 0 || value > 252) {
        errors.push(`EV ${stat} must be a number between 0 and 252`);
      }
      totalEvs += value || 0;
    }
    
    if (totalEvs > 510) {
      errors.push('Total EVs cannot exceed 510');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}; 