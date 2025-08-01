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

  const handleAddPhase = () => {
    onAddPhase(hunt);
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
          display: 'flex',
          flexDirection: 'column',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '12px',
        }}
      >
        {/* Top Row - Main Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ flex: '0 0 auto' }}>
            <img 
              src={spritePath} 
              alt={`Shiny ${hunt.pokemonName}`}
              style={{
                width: '40px',
                height: '40px',
                filter: `drop-shadow(0 0 8px ${pokemonColors.glow}) drop-shadow(0 0 16px ${pokemonColors.glowLight})`,
              }}
              onError={(e) => {
                e.currentTarget.src = '/images/shiny-sprites/001_Bulbasaur.gif';
              }}
            />
          </div>
          
          <div style={{ flex: '1 1 auto' }}>
            <h3 style={{ 
              color: '#fff', 
              margin: '0 0 4px 0', 
              fontSize: '1rem', 
              fontWeight: 'bold' 
            }}>
              {hunt.pokemonName}
            </h3>
            <div style={{ 
              display: 'inline-block',
              background: methodColor.background,
              color: methodColor.text,
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: 'bold'
            }}>
              {hunt.method}
            </div>
          </div>
          
          <div style={{ flex: '0 0 auto', display: 'flex', gap: '8px' }}>
            <button 
              onClick={handleAddPhase}
              style={{
                backgroundColor: 'rgba(255, 215, 0, 0.2)',
                color: '#ffd700',
                border: '1px solid #ffd700',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              + Phase
            </button>
            <button 
              onClick={() => onMarkFound(hunt)}
              style={{
                backgroundColor: 'rgba(40, 167, 69, 0.2)',
                color: '#28a745',
                border: '1px solid #28a745',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ✨ Found
            </button>
          </div>
        </div>
        
        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', fontSize: '0.8rem', color: '#ccc' }}>
          <div><strong>Started:</strong> {startDate}</div>
          <div><strong>Encounters:</strong> {hunt.totalEncounters.toLocaleString()}</div>
          <div><strong>Phase:</strong> {hunt.phaseCount}</div>
        </div>
        
        {/* Phase Timeline */}
        {hunt.phasePokemon && hunt.phasePokemon.length > 0 && (
          <div style={{ 
            borderTop: '1px solid rgba(255, 215, 0, 0.3)',
            paddingTop: '8px',
            marginTop: '8px'
          }}>
            <h4 style={{ 
              color: '#ffd700', 
              margin: '0 0 8px 0', 
              fontSize: '0.8rem',
              textAlign: 'center'
            }}>
              Phase Timeline
            </h4>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {hunt.phasePokemon.map((phasePokemon, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <img 
                    src={getShinySpritePath(phasePokemon.pokemonId, phasePokemon.pokemonName)}
                    alt={phasePokemon.pokemonName}
                    style={{ width: '24px', height: '24px' }}
                    onError={(e) => {
                      e.currentTarget.src = '/images/shiny-sprites/001_Bulbasaur.gif';
                    }}
                  />
                  <span style={{ 
                    fontSize: '0.7rem', 
                    color: '#aaa',
                    fontWeight: 'bold'
                  }}>
                    {phasePokemon.encounters}
                  </span>
                </div>
              ))}
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

        {/* Additional Details - Always Visible */}
        <div style={{ 
          marginTop: '12px', 
          fontSize: '0.8rem', 
          color: '#ccc',
          display: 'flex',
          gap: '16px',
          justifyContent: 'center'
        }}>
          <div><strong>Started:</strong> {startDate}</div>
          <div><strong>Phase:</strong> {hunt.phaseCount}</div>
        </div>

        <div className="hunt-card-footer">
          <button 
            className="phase-btn"
            onClick={handleAddPhase}
            style={{
              backgroundColor: 'rgba(255, 215, 0, 0.2)',
              color: '#ffd700',
              border: '1px solid #ffd700',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s ease'
            }}
          >
            + Phase
          </button>
          
          <button 
            className="found-btn"
            onClick={() => onMarkFound(hunt)}
            style={{
              backgroundColor: 'rgba(40, 167, 69, 0.2)',
              color: '#28a745',
              border: '1px solid #28a745',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s ease'
            }}
          >
            ✨ Mark as Found
          </button>
        </div>

        {/* Phase Timeline - Always Visible */}
        {hunt.phasePokemon && hunt.phasePokemon.length > 0 && (
          <div style={{ 
            marginTop: '16px',
            borderTop: '1px solid rgba(255, 215, 0, 0.3)',
            paddingTop: '12px'
          }}>
            <h4 style={{ 
              color: '#ffd700', 
              margin: '0 0 12px 0', 
              fontSize: '1rem',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              Phase Timeline
            </h4>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              {hunt.phasePokemon.map((phasePokemon, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px',
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 215, 0, 0.2)'
                }}>
                  <img 
                    src={getShinySpritePath(phasePokemon.pokemonId, phasePokemon.pokemonName)}
                    alt={phasePokemon.pokemonName}
                    style={{ 
                      width: '32px', 
                      height: '32px',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                    }}
                    onError={(e) => {
                      e.currentTarget.src = '/images/shiny-sprites/001_Bulbasaur.gif';
                    }}
                  />
                  <span style={{ 
                    fontSize: '0.7rem', 
                    color: '#ffd700',
                    fontWeight: 'bold'
                  }}>
                    {phasePokemon.encounters}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 