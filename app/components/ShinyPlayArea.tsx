import React from 'react';
import type { ShinyPortfolio } from '../types/pokemon';
import { getShinySpritePath, getPokemonColors } from '../types/pokemon';

interface ShinyTrophyCaseProps {
  portfolio: ShinyPortfolio[];
}

export default function ShinyTrophyCase({ portfolio }: ShinyTrophyCaseProps) {
  if (portfolio.length === 0) {
    return (
      <div className="shiny-trophy-case">
        <div className="trophy-case-header">
          <h3>🏆 Shiny Trophy Case</h3>
          <p>Your prized shiny collection will be displayed here!</p>
        </div>
        <div className="empty-trophy-case">
          <div className="empty-display-case">
            <div className="glass-reflection"></div>
            <div className="empty-shelves">
              <div className="shelf"></div>
              <div className="shelf"></div>
              <div className="shelf"></div>
            </div>
            <div className="case-light"></div>
            <p>Start hunting to fill your trophy case!</p>
          </div>
        </div>
      </div>
    );
  }

  // Group shinies into display rows (6 per row for optimal display)
  const displayRows: ShinyPortfolio[][] = [];
  for (let i = 0; i < portfolio.length; i += 6) {
    displayRows.push(portfolio.slice(i, i + 6));
  }

  return (
    <div className="shiny-trophy-case">
      <div className="trophy-case-header">
        <h3>🏆 Shiny Trophy Case</h3>
        <div className="collection-stats">
          <span className="stat-badge">
            <span className="stat-number">{portfolio.length}</span>
            <span className="stat-label">Shinies Collected</span>
          </span>
          <span className="stat-badge">
            <span className="stat-number">{new Set(portfolio.map(s => s.method)).size}</span>
            <span className="stat-label">Hunt Methods Used</span>
          </span>
        </div>
      </div>
      
      <div className="display-case">
        <div className="glass-reflection"></div>
        <div className="case-lighting"></div>
        
        <div className="trophy-shelves">
          {displayRows.map((row, rowIndex) => (
            <div key={rowIndex} className="trophy-shelf">
              <div className="shelf-surface"></div>
              <div className="shelf-items">
                {row.map((shiny, itemIndex) => {
                  const pokemonColors = getPokemonColors(shiny.pokemonId);
                  const isRecent = new Date(shiny.dateFound).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000);
                  
                  return (
                    <div 
                      key={shiny.id} 
                      className={`trophy-item ${isRecent ? 'recently-added' : ''}`}
                      style={{
                        animationDelay: `${(rowIndex * 6 + itemIndex) * 0.1}s`
                      }}
                    >
                      <div className="trophy-pedestal">
                        <div 
                          className="pedestal-glow"
                          style={{
                            boxShadow: `0 0 20px ${pokemonColors.glowLight}, 0 0 40px ${pokemonColors.glowLight}`
                          }}
                        ></div>
                      </div>
                      
                      <div className="trophy-sprite-container">
                        <img 
                          src={getShinySpritePath(shiny.pokemonId, shiny.pokemonName)}
                          alt={`Shiny ${shiny.pokemonName}`}
                          className="trophy-sprite"
                          style={{
                            filter: `drop-shadow(0 0 8px ${pokemonColors.glow}) drop-shadow(0 0 16px ${pokemonColors.glowLight})`,
                          }}
                          onError={(e) => {
                            e.currentTarget.src = '/images/shiny-sprites/001_Bulbasaur.gif';
                          }}
                        />
                        {isRecent && <div className="new-badge">NEW!</div>}
                      </div>
                      
                      <div className="trophy-nameplate">
                        <div className="nameplate-text">{shiny.pokemonName}</div>
                        <div className="nameplate-date">
                          {new Date(shiny.dateFound).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="case-frame"></div>
      </div>
    </div>
  );
} 