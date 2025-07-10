import React, { useState } from 'react';
import type { ShinyHunt, PhasePokemon } from '../types/pokemon';
import { getShinySpritePath, HUNTING_METHOD_COLORS, getPokemonColors } from '../types/pokemon';

interface ShinyHuntCardProps {
  hunt: ShinyHunt;
  onEdit: (hunt: ShinyHunt) => void;
  onAddPhase: (hunt: ShinyHunt) => void;
  onMarkFound: (hunt: ShinyHunt) => void;
  onUpdateNotes: (huntId: number, notes: string) => void;
  viewMode?: 'grid' | 'compact';
}

export default function ShinyHuntCard({
  hunt,
  onEdit,
  onAddPhase,
  onMarkFound,
  onUpdateNotes,
  viewMode = 'grid'
}: ShinyHuntCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState(hunt.notes || '');

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleNotesSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onUpdateNotes(hunt.id, notes);
    }
  };

  const spritePath = getShinySpritePath(hunt.pokemonId, hunt.pokemonName);
  const methodColor = HUNTING_METHOD_COLORS[hunt.method];
  const startDate = new Date(hunt.startDate).toLocaleDateString();
  const pokemonColors = getPokemonColors(hunt.pokemonId);

  if (viewMode === 'compact') {
    return (
      <div 
        className="shiny-hunt-card compact"
        style={{
          background: `rgba(0, 0, 0, 0.15)`,
          border: `1px solid rgba(255, 215, 0, 0.4)`,
          boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)`,
        }}
      >
        <div className="hunt-card-compact-content">
          <div className="compact-sprite-container">
            <img 
              src={spritePath} 
              alt={`Shiny ${hunt.pokemonName}`}
              className="compact-sprite"
              style={{
                filter: `drop-shadow(0 0 8px ${pokemonColors.glow}) drop-shadow(0 0 16px ${pokemonColors.glowLight})`,
              }}
              onError={(e) => {
                e.currentTarget.src = '/images/shiny-sprites/001_Bulbasaur.gif';
              }}
            />
          </div>
          
          <div className="compact-info">
            <h3 className="compact-pokemon-name">{hunt.pokemonName}</h3>
            <div className="compact-method-badge" style={{ background: methodColor.background }}>
              {hunt.method}
            </div>
          </div>
          
          <div className="compact-stats">
            <div className="compact-stat">
              <span className="compact-stat-label">Encounters:</span>
              <span className="compact-stat-value">{hunt.totalEncounters.toLocaleString()}</span>
            </div>
            <div className="compact-stat">
              <span className="compact-stat-label">Phase:</span>
              <span className="compact-stat-value">{hunt.phaseCount}</span>
            </div>
          </div>
          
          <div className="compact-actions">
            <button 
              className="compact-btn phase-btn"
              onClick={() => onAddPhase(hunt)}
            >
              + Phase
            </button>
            <button 
              className="compact-btn info-btn"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
            <button 
              className="compact-btn found-btn"
              onClick={() => onMarkFound(hunt)}
            >
              ✨ Found
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="hunt-details compact-details">
            <div className="detail-row">
              <span className="detail-label">Started:</span>
              <span className="detail-value">{startDate}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total Encounters:</span>
              <span className="detail-value">{hunt.totalEncounters.toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phases:</span>
              <span className="detail-value">{hunt.phaseCount}</span>
            </div>
            
            {hunt.phasePokemon && hunt.phasePokemon.length > 0 && (
              <div className="phase-timeline">
                <h4>Phase Timeline</h4>
                <div className="phase-sprites">
                  {hunt.phasePokemon.map((phasePokemon, index) => (
                    <div key={index} className="phase-sprite-item">
                      <img 
                        src={getShinySpritePath(phasePokemon.pokemonId, phasePokemon.pokemonName)}
                        alt={phasePokemon.pokemonName}
                        className="phase-sprite"
                        onError={(e) => {
                          e.currentTarget.src = '/images/shiny-sprites/001_Bulbasaur.gif';
                        }}
                      />
                      <span className="phase-encounters">{phasePokemon.encounters}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="notes-section">
              <label htmlFor={`notes-${hunt.id}`}>Notes:</label>
              <textarea
                id={`notes-${hunt.id}`}
                value={notes}
                onChange={handleNotesChange}
                onKeyDown={handleNotesSubmit}
                placeholder="Add your hunt notes here... (Press Enter to save)"
                className="notes-textarea"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className="shiny-hunt-card"
      style={{
        background: `rgba(0, 0, 0, 0.15)`,
        border: `1px solid rgba(255, 215, 0, 0.4)`,
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)`,
      }}
    >
      <div className="hunt-card-header">
        <button 
          className="edit-btn"
          onClick={() => onEdit(hunt)}
        >
          ✏️
        </button>
        <div className="method-badge" style={{ background: methodColor.background }}>
          {hunt.method}
        </div>
      </div>

      <div className="hunt-card-content">
        <div className="shiny-sprite-container">
          <img 
            src={spritePath} 
            alt={`Shiny ${hunt.pokemonName}`}
            className="shiny-sprite"
            style={{
              filter: `drop-shadow(0 0 10px ${pokemonColors.glow}) drop-shadow(0 0 20px ${pokemonColors.glowLight})`,
            }}
            onError={(e) => {
              // Fallback if sprite doesn't exist
              e.currentTarget.src = '/images/shiny-sprites/001_Bulbasaur.gif';
            }}
          />
        </div>

        <h3 className="pokemon-name">{hunt.pokemonName}</h3>
        
        <div className="hunt-stats">
          <div className="stat">
            <span className="stat-label">Encounters:</span>
            <span className="stat-value">{hunt.totalEncounters.toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Phase:</span>
            <span className="stat-value">{hunt.phaseCount}</span>
          </div>
        </div>

        <div className="hunt-card-footer">
          <button 
            className="phase-btn"
            onClick={() => onAddPhase(hunt)}
          >
            + Phase
          </button>
          
          <button 
            className="info-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '▼' : '▶'} Click for Info
          </button>
          
          <button 
            className="found-btn"
            onClick={() => onMarkFound(hunt)}
          >
            ✨ Mark as Found
          </button>
        </div>

        {isExpanded && (
          <div className="hunt-details">
            <div className="detail-row">
              <span className="detail-label">Started:</span>
              <span className="detail-value">{startDate}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total Encounters:</span>
              <span className="detail-value">{hunt.totalEncounters.toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phases:</span>
              <span className="detail-value">{hunt.phaseCount}</span>
            </div>
            
            {hunt.phasePokemon && hunt.phasePokemon.length > 0 && (
              <div className="phase-timeline">
                <h4>Phase Timeline</h4>
                <div className="phase-sprites">
                  {hunt.phasePokemon.map((phasePokemon, index) => (
                    <div key={index} className="phase-sprite-item">
                      <img 
                        src={getShinySpritePath(phasePokemon.pokemonId, phasePokemon.pokemonName)}
                        alt={phasePokemon.pokemonName}
                        className="phase-sprite"
                        onError={(e) => {
                          e.currentTarget.src = '/images/shiny-sprites/001_Bulbasaur.gif';
                        }}
                      />
                      <span className="phase-encounters">{phasePokemon.encounters}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="notes-section">
              <label htmlFor={`notes-${hunt.id}`}>Notes:</label>
              <textarea
                id={`notes-${hunt.id}`}
                value={notes}
                onChange={handleNotesChange}
                onKeyDown={handleNotesSubmit}
                placeholder="Add your hunt notes here... (Press Enter to save)"
                className="notes-textarea"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 