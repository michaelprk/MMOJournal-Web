import React, { useState } from 'react';
import type { ShinyHunt, PhasePokemon } from '../types/pokemon';
import { getShinySpritePath, HUNTING_METHOD_COLORS } from '../types/pokemon';

interface ShinyHuntCardProps {
  hunt: ShinyHunt;
  onEdit: (hunt: ShinyHunt) => void;
  onAddPhase: (hunt: ShinyHunt) => void;
  onMarkFound: (hunt: ShinyHunt) => void;
  onUpdateNotes: (huntId: number, notes: string) => void;
}

export default function ShinyHuntCard({
  hunt,
  onEdit,
  onAddPhase,
  onMarkFound,
  onUpdateNotes
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

  return (
    <div className="shiny-hunt-card">
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