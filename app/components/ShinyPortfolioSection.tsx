import React, { useState } from 'react';
import type { ShinyPortfolio, ShinyHunt, PokemonStats } from '../types/pokemon';
import { getShinySpritePath, HUNTING_METHOD_COLORS, POKEMON_NATURES } from '../types/pokemon';

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
}

export default function ShinyPortfolioSection({
  portfolio,
  showCompletionModal,
  completingHunt,
  onCompleteHunt,
  onCloseModal
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
      <h2>🏆 Shiny Portfolio</h2>
      
      {portfolio.length === 0 ? (
        <div className="empty-portfolio">
          <p>No shinies found yet. Start hunting to build your collection!</p>
        </div>
      ) : (
        <div className="portfolio-grid">
          {portfolio.map(shiny => (
            <div key={shiny.id} className="portfolio-card">
              <div className="portfolio-sprite-container">
                <img 
                  src={getShinySpritePath(shiny.pokemonId, shiny.pokemonName)}
                  alt={`Shiny ${shiny.pokemonName}`}
                  className="portfolio-sprite"
                  onError={(e) => {
                    e.currentTarget.src = '/images/shiny-sprites/001_Bulbasaur.gif';
                  }}
                />
              </div>
              
              <h3 className="portfolio-pokemon-name">{shiny.pokemonName}</h3>
              
              <div className="portfolio-info">
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
          ))}
        </div>
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