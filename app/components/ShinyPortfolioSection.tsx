import React, { useState } from 'react';
import type { ShinyPortfolio, ShinyHunt, PokemonStats, HuntingMethod } from '../types/pokemon';
import { getShinySpritePath, HUNTING_METHOD_COLORS, POKEMON_NATURES, HUNTING_METHODS, getPokemonColors } from '../types/pokemon';

interface ShinyPortfolioSectionProps {
  portfolio: ShinyPortfolio[];
  showCompletionModal: boolean;
  completingHunt: ShinyHunt | null;
  onCompleteHunt: (huntId: number, data: {
    nature?: string;
    ivs?: Partial<PokemonStats>;
    encounterCount?: number;
    notes?: string;
  }) => void;
  onCloseModal: () => void;
  displayLimit?: number;
  onShowMore?: () => void;
  viewMode?: 'grid' | 'compact';
  onViewModeChange?: (mode: 'grid' | 'compact') => void;
  portfolioFilter?: 'all' | HuntingMethod;
  onPortfolioFilterChange?: (filter: 'all' | HuntingMethod) => void;
  portfolioSort?: 'date' | 'encounters' | 'name';
  onPortfolioSortChange?: (sort: 'date' | 'encounters' | 'name') => void;
}

export default function ShinyPortfolioSection({
  portfolio,
  showCompletionModal,
  completingHunt,
  onCompleteHunt,
  onCloseModal,
  displayLimit,
  onShowMore,
  viewMode = 'grid',
  onViewModeChange,
  portfolioFilter = 'all',
  onPortfolioFilterChange,
  portfolioSort = 'date',
  onPortfolioSortChange
}: ShinyPortfolioSectionProps) {
  const [completionData, setCompletionData] = useState({
    nature: '',
    ivs: { hp: 0, attack: 0, defense: 0, sp_attack: 0, sp_defense: 0, speed: 0 },
    encounterCount: 0,
    notes: ''
  });

  const handleInputChange = (field: string, value: string | number) => {
    setCompletionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIVChange = (stat: keyof PokemonStats, value: number) => {
    setCompletionData(prev => ({
      ...prev,
      ivs: {
        ...prev.ivs,
        [stat]: value
      }
    }));
  };

  const handleSubmit = () => {
    if (completingHunt) {
      onCompleteHunt(completingHunt.id, {
        nature: completionData.nature || undefined,
        ivs: completionData.ivs,
        encounterCount: completionData.encounterCount || undefined,
        notes: completionData.notes || undefined
      });
    }
  };

  return (
    <div className="portfolio-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>🏆 Shiny Portfolio</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Portfolio Filter Controls */}
          {onPortfolioFilterChange && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Method:</span>
              <select
                value={portfolioFilter}
                onChange={(e) => onPortfolioFilterChange(e.target.value as 'all' | HuntingMethod)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  background: 'rgba(0, 0, 0, 0.4)',
                  color: 'white',
                  fontSize: '0.75rem',
                }}
              >
                <option value="all">All Methods</option>
                {HUNTING_METHODS.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
          )}
          
          {/* Portfolio Sort Controls */}
          {onPortfolioSortChange && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Sort:</span>
              <select
                value={portfolioSort}
                onChange={(e) => onPortfolioSortChange(e.target.value as 'date' | 'encounters' | 'name')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  background: 'rgba(0, 0, 0, 0.4)',
                  color: 'white',
                  fontSize: '0.75rem',
                }}
              >
                <option value="date">Date (Newest)</option>
                <option value="encounters">Encounters (Most)</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          )}
          
          {/* View Mode Toggle */}
          {onViewModeChange && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>View:</span>
              <button
                onClick={() => onViewModeChange(viewMode === 'grid' ? 'compact' : 'grid')}
                style={{
                  backgroundColor: 'rgba(255, 215, 0, 0.2)',
                  color: '#ffd700',
                  border: '1px solid #ffd700',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
                }}
              >
                {viewMode === 'grid' ? '☰' : '⊞'} {viewMode === 'grid' ? 'Compact' : 'Grid'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {portfolio.length === 0 ? (
        <div className="empty-portfolio">
          <p>No shinies found yet. Start hunting to build your collection!</p>
        </div>
      ) : (
        <>
          <div className={viewMode === 'grid' ? 'portfolio-grid' : 'portfolio-compact'}>
            {(displayLimit ? portfolio.slice(0, displayLimit) : portfolio).map(shiny => {
              const pokemonColors = getPokemonColors(shiny.pokemonId);
              return (
                <div 
                  key={shiny.id} 
                  className={viewMode === 'grid' ? 'portfolio-card' : 'portfolio-card compact'}
                  style={{
                    background: `rgba(0, 0, 0, 0.15)`,
                    border: `1px solid ${pokemonColors.glow}`,
                    boxShadow: `0 4px 12px rgba(${pokemonColors.primaryRgb}, 0.15), inset 0 0 20px ${pokemonColors.glowLight}`,
                  }}
                >
                  <div className={viewMode === 'grid' ? 'portfolio-sprite-container' : 'portfolio-sprite-container compact'}>
                    <img 
                      src={getShinySpritePath(shiny.pokemonId, shiny.pokemonName)}
                      alt={`Shiny ${shiny.pokemonName}`}
                      className={viewMode === 'grid' ? 'portfolio-sprite' : 'portfolio-sprite compact'}
                      style={{
                        filter: `drop-shadow(0 0 10px ${pokemonColors.glow}) drop-shadow(0 0 20px ${pokemonColors.glowLight})`,
                      }}
                      onError={(e) => {
                        e.currentTarget.src = '/images/shiny-sprites/001_Bulbasaur.gif';
                      }}
                    />
                  </div>
                  
                  <div className={viewMode === 'grid' ? 'portfolio-info' : 'portfolio-info compact'}>
                    <h3 className={viewMode === 'grid' ? 'portfolio-pokemon-name' : 'portfolio-pokemon-name compact'}>{shiny.pokemonName}</h3>
                    
                    <div className="portfolio-method" style={{ 
                      background: HUNTING_METHOD_COLORS[shiny.method].background 
                    }}>
                      {shiny.method}
                    </div>
                    
                    <div className="portfolio-date">
                      Found: {new Date(shiny.dateFound).toLocaleDateString()}
                    </div>
                    
                    {shiny.nature && (
                      <div className="portfolio-nature">
                        Nature: {shiny.nature}
                      </div>
                    )}
                    
                    {shiny.encounterCount && (
                      <div className="portfolio-encounters">
                        Encounters: {shiny.encounterCount.toLocaleString()}
                      </div>
                    )}
                    
                    {shiny.ivs && (
                      <div className="portfolio-ivs">
                        <div className="iv-display">
                          <span>HP: {shiny.ivs.hp ?? 'N/A'}</span>
                          <span>Atk: {shiny.ivs.attack ?? 'N/A'}</span>
                          <span>Def: {shiny.ivs.defense ?? 'N/A'}</span>
                          <span>SpA: {shiny.ivs.sp_attack ?? 'N/A'}</span>
                          <span>SpD: {shiny.ivs.sp_defense ?? 'N/A'}</span>
                          <span>Spe: {shiny.ivs.speed ?? 'N/A'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {displayLimit && portfolio.length > displayLimit && onShowMore && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginTop: '1rem' 
            }}>
              <button
                onClick={onShowMore}
                style={{
                  backgroundColor: 'rgba(255, 215, 0, 0.2)',
                  color: '#ffd700',
                  border: '1px solid #ffd700',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                ⬇️ Show More Shinies ({portfolio.length - displayLimit} remaining)
              </button>
            </div>
          )}
        </>
      )}

      {/* Completion Modal */}
      {showCompletionModal && completingHunt && (
        <div className="completion-modal-overlay">
          <div className="completion-modal">
            <h3>🎉 Shiny {completingHunt.pokemonName} Found!</h3>
            
            <div className="completion-form">
              <div className="form-group">
                <label htmlFor="nature">Nature:</label>
                <select 
                  id="nature"
                  value={completionData.nature}
                  onChange={(e) => handleInputChange('nature', e.target.value)}
                >
                  <option value="">Select Nature</option>
                  {POKEMON_NATURES.map(nature => (
                    <option key={nature} value={nature}>{nature}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="encounter-count">Encounter Count:</label>
                <input 
                  type="number"
                  id="encounter-count"
                  value={completionData.encounterCount}
                  onChange={(e) => handleInputChange('encounterCount', parseInt(e.target.value) || 0)}
                  placeholder="Total encounters"
                />
              </div>
              
              <div className="form-group">
                <label>IVs (Optional):</label>
                <div className="iv-inputs">
                  <div className="iv-input">
                    <label>HP:</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="31"
                      value={completionData.ivs.hp}
                      onChange={(e) => handleIVChange('hp', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="iv-input">
                    <label>Atk:</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="31"
                      value={completionData.ivs.attack}
                      onChange={(e) => handleIVChange('attack', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="iv-input">
                    <label>Def:</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="31"
                      value={completionData.ivs.defense}
                      onChange={(e) => handleIVChange('defense', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="iv-input">
                    <label>SpA:</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="31"
                      value={completionData.ivs.sp_attack}
                      onChange={(e) => handleIVChange('sp_attack', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="iv-input">
                    <label>SpD:</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="31"
                      value={completionData.ivs.sp_defense}
                      onChange={(e) => handleIVChange('sp_defense', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="iv-input">
                    <label>Spe:</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="31"
                      value={completionData.ivs.speed}
                      onChange={(e) => handleIVChange('speed', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="completion-notes">Notes:</label>
                <textarea
                  id="completion-notes"
                  value={completionData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Add any notes about this shiny..."
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="cancel-btn" onClick={onCloseModal}>
                Cancel
              </button>
              <button className="submit-btn" onClick={handleSubmit}>
                Save to Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 