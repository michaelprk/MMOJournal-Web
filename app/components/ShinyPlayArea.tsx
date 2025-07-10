import React, { useEffect, useState } from 'react';
import type { ShinyPortfolio } from '../types/pokemon';
import { getShinySpritePath } from '../types/pokemon';

interface ShinyPlayAreaProps {
  portfolio: ShinyPortfolio[];
}

interface AnimatedShiny {
  id: number;
  pokemonId: number;
  pokemonName: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  scale: number;
}

export default function ShinyPlayArea({ portfolio }: ShinyPlayAreaProps) {
  const [animatedShinies, setAnimatedShinies] = useState<AnimatedShiny[]>([]);

  useEffect(() => {
    // Initialize positions for all shinies
    const newAnimatedShinies: AnimatedShiny[] = portfolio.map((shiny, index) => ({
      id: shiny.id,
      pokemonId: shiny.pokemonId,
      pokemonName: shiny.pokemonName,
      x: Math.random() * 800,
      y: Math.random() * 200,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      rotation: Math.random() * 360,
      scale: 0.8 + Math.random() * 0.4
    }));
    
    setAnimatedShinies(newAnimatedShinies);
  }, [portfolio]);

  useEffect(() => {
    if (animatedShinies.length === 0) return;

    const animationInterval = setInterval(() => {
      setAnimatedShinies(prev => 
        prev.map(shiny => ({
          ...shiny,
          x: shiny.x + shiny.vx,
          y: shiny.y + shiny.vy,
          rotation: shiny.rotation + 0.2,
          // Bounce off walls
          vx: shiny.x <= 0 || shiny.x >= 750 ? -shiny.vx : shiny.vx,
          vy: shiny.y <= 0 || shiny.y >= 150 ? -shiny.vy : shiny.vy,
        }))
      );
    }, 50);

    return () => clearInterval(animationInterval);
  }, [animatedShinies.length]);

  if (portfolio.length === 0) {
    return (
      <div className="shiny-play-area">
        <div className="empty-play-area">
          <h3>🌟 Shiny Play Area</h3>
          <p>Your caught shinies will appear here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shiny-play-area">
      <h3>🌟 Shiny Play Area</h3>
      <div className="play-area-container">
        {animatedShinies.map(shiny => (
          <div
            key={shiny.id}
            className="floating-shiny"
            style={{
              left: `${shiny.x}px`,
              top: `${shiny.y}px`,
              transform: `rotate(${shiny.rotation}deg) scale(${shiny.scale})`,
              transition: 'all 0.05s linear'
            }}
          >
            <img 
              src={getShinySpritePath(shiny.pokemonId, shiny.pokemonName)}
              alt={`Shiny ${shiny.pokemonName}`}
              className="floating-shiny-sprite"
              onError={(e) => {
                e.currentTarget.src = '/images/shiny-sprites/001_Bulbasaur.gif';
              }}
            />
            <div className="shiny-name-tooltip">
              {shiny.pokemonName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 