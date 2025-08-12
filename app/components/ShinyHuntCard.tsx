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
  onDelete?: (hunt: ShinyHunt) => void;
}

export default function ShinyHuntCard({
  hunt,
  onEdit,
  onAddPhase,
  onMarkFound,
  onUpdateNotes,
  viewMode = 'grid',
  onDelete,
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
  const methodColor = HUNTING_METHOD_COLORS[hunt.method] || { background: 'linear-gradient(45deg, #555, #333)', text: '#fff', gradient: '' } as any;
  const methodBg = (() => {
    // Subtle method-tinted panel background
    const label = String(hunt.method || '').toLowerCase();
    if (label.includes('fish') || label.includes('rod')) return 'linear-gradient(135deg, rgba(33, 150, 243, 0.06), rgba(33, 150, 243, 0.02))'; // blue for fishing
    if (label.includes('horde')) return 'linear-gradient(135deg, rgba(244, 67, 54, 0.05), rgba(244, 67, 54, 0.02))'; // red tint for horde
    if (label.includes('safari')) return 'linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(76, 175, 80, 0.02))'; // green tint for safari
    if (label.includes('egg')) return 'linear-gradient(135deg, rgba(255, 193, 7, 0.05), rgba(255, 193, 7, 0.02))'; // amber tint for eggs
    if (label.includes('fossil')) return 'linear-gradient(135deg, rgba(158, 158, 158, 0.06), rgba(120, 120, 120, 0.025))'; // gray tint for fossil
    if (label.includes('honey') || label.includes('headbutt')) return 'linear-gradient(135deg, rgba(255, 215, 0, 0.06), rgba(255, 215, 0, 0.025))'; // gold tint for honey
    // Singles / Lures and default: move to magenta/purple family
    return 'linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(168, 85, 247, 0.02))';
  })();
  const startDate = new Date(hunt.startDate).toLocaleDateString();
  const pokemonColors = getPokemonColors(hunt.pokemonId);

  if (viewMode === 'compact') {
    return (
      <div 
        className="shiny-hunt-card compact"
        style={{
          background: methodBg,
          border: `1px solid rgba(255, 215, 0, 0.35)`,
          boxShadow: `0 2px 8px rgba(0, 0, 0, 0.3), inset 0 0 14px rgba(255, 215, 0, 0.08)`,
          display: 'flex',
          flexDirection: 'column',
          padding: '8px',
          borderRadius: '8px',
          margin: '8px auto',
          maxWidth: '880px',
          minHeight: 0,
        }}
      >
        {/* Compact layout: center column with sprite row flanked by buttons, then text rows below */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            {/* Row: +Phase | Sprite | Found */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button 
                type="button"
                onClick={handleAddPhase}
                style={{ marginRight: 15, backgroundColor: 'rgba(255, 215, 0, 0.2)', color: '#ffd700', border: '1px solid #ffd700', padding: '8px 12px', borderRadius: 6, fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700 }}
              >
                + Phase
              </button>
              <img 
                src={spritePath} 
                alt={`Shiny ${hunt.pokemonName}`}
                style={{ width: '88px', height: '88px', filter: `drop-shadow(0 0 8px ${pokemonColors.glow}) drop-shadow(0 0 16px ${pokemonColors.glowLight})` }}
                onError={(e) => { e.currentTarget.src = '/images/shiny-sprites/001_Bulbasaur.gif'; }}
              />
              <button 
                type="button"
                onClick={() => onMarkFound(hunt)}
                style={{ marginLeft: 15, backgroundColor: 'rgba(40, 167, 69, 0.2)', color: '#28a745', border: '1px solid #28a745', padding: '8px 12px', borderRadius: 6, fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700 }}
              >
                ✨ Found
              </button>
            </div>
            {/* Method below sprite row */}
            <div style={{ display: 'inline-block', background: methodColor.background, color: '#fff', padding: '3px 8px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 800 }}>
              {hunt.method}
            </div>
            {/* Species and start date bolded, single row */}
            <div style={{ color: '#eee', fontSize: '0.9rem', fontWeight: 800, textAlign: 'center' }}>
              {hunt.pokemonName}  •  Started: {startDate}
            </div>
            {/* Encounters and optional location unbolded */}
            <div style={{ color: '#ccc', fontSize: '0.9rem', textAlign: 'center' }}>
              Encounters: {hunt.totalEncounters.toLocaleString()}
              {(hunt.region || hunt.area) && (
                <>
                  {"  |  "}
                  Location: {(hunt.region || 'Unknown Region')} — {hunt.area ? String(hunt.area).toUpperCase() : 'UNKNOWN AREA'}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Phase header row */}
        <div style={{ marginTop: 6, textAlign: 'center', color: '#ffd700', fontWeight: 800, fontSize: '0.95rem' }}>
          Phase {hunt.phaseCount}
        </div>
        
        {/* Phase timeline will be added later per request; removed to tighten box height */}
      </div>
    );
  }

  return (
    <div 
      className="shiny-hunt-card"
      style={{
        background: methodBg,
        border: `1px solid rgba(255, 215, 0, 0.4)`,
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)`,
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      {/* Header removed per new layout; actions pinned bottom */}

      {/* Top action row for grid cards */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <button 
          className="phase-btn"
          onClick={handleAddPhase}
          style={{
            backgroundColor: 'rgba(255, 215, 0, 0.2)',
            color: '#ffd700',
            border: '1px solid #ffd700',
            padding: '6px 12px',
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
            padding: '6px 12px',
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

      <div className="hunt-card-content" style={{ flex: 1 }}>
          <div className="shiny-sprite-container">
          <img 
            src={spritePath} 
            alt={`Shiny ${hunt.pokemonName}`}
            className="shiny-sprite"
            style={{
              width: '96px',
              height: '96px',
              filter: `drop-shadow(0 0 10px ${pokemonColors.glow}) drop-shadow(0 0 20px ${pokemonColors.glowLight})`,
            }}
            onError={(e) => {
              // Fallback if sprite doesn't exist
              e.currentTarget.src = '/images/shiny-sprites/001_Bulbasaur.gif';
            }}
          />
        </div>

        <h3 className="pokemon-name">{hunt.pokemonName}</h3>
        {/* Location only; method badge removed to avoid duplication */}
        <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          {(hunt.region || hunt.area) && (
            <div style={{ color: '#ccc', fontSize: '0.8rem' }}>
              {(hunt.region || 'Unknown Region')} — {hunt.area ? String(hunt.area).toUpperCase() : 'UNKNOWN AREA'}
            </div>
          )}
        </div>
        
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

        {/* Additional Details - Always Visible; keep consistent height so footer buttons align across cards */}
        <div style={{ minHeight: 24, marginTop: '12px', fontSize: '0.8rem', color: '#ccc', display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <div><strong>Started:</strong> {startDate}</div>
        </div>

        {/* Bottom bar: edit/pause left, method badge right; pinned to bottom; reserve height to avoid nudge */}
        <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 36 }}>
          <div>
            <button 
              className="edit-btn"
              onClick={() => onEdit(hunt)}
              title="Edit hunt"
              style={{ marginRight: 8 }}
            >
              ✏️
            </button>
            {onDelete && (
              <button
                onClick={() => { const ok = window.confirm('Pause this hunt? It will be moved to Paused Hunts and no longer appear under Current Hunts until you resume it.'); if (ok) onDelete(hunt); }}
                title="Pause hunt"
                style={{
                  background: 'transparent',
                  color: '#ffd700',
                  border: '1px solid rgba(255, 215, 0, 0.6)',
                  borderRadius: 6,
                  padding: '2px 8px',
                  cursor: 'pointer',
                  fontWeight: 800,
                }}
              >
                ⏸️
              </button>
            )}
          </div>
          <div className="method-badge" style={{ background: (() => {
                const m = String(hunt.method || '').toLowerCase();
                if (m.includes('fish') || m.includes('rod')) return 'linear-gradient(45deg, #2196f3, #42a5f5)';
                if (m.includes('horde')) return 'linear-gradient(45deg, #ef5350, #e53935)';
                if (m.includes('safari')) return 'linear-gradient(45deg, #66bb6a, #43a047)';
                if (m.includes('egg')) return 'linear-gradient(45deg, #ffca28, #ffc107)';
                if (m.includes('fossil')) return 'linear-gradient(45deg, #9e9e9e, #757575)';
                if (m.includes('honey') || m.includes('headbutt')) return 'linear-gradient(45deg, #ffd54f, #ffca28)';
                if (m.includes('lure') || m.includes('single')) return 'linear-gradient(45deg, #ec4899, #a855f7)';
                return methodColor.background;
              })(), color: '#fff' }}>
            {hunt.method}
          </div>
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
                      width: '36px', 
                      height: '36px',
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