import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { ShinyHunt, PokemonStats } from '../types/pokemon';
import { POKEMON_NATURES } from '../types/pokemon';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  hunt: ShinyHunt | null;
  onCompleteHunt: (huntId: number, data: {
    nature?: string;
    ivs?: Partial<PokemonStats>;
    encounterCount?: number;
    notes?: string;
    is_secret_shiny?: boolean;
    is_alpha?: boolean;
  }) => void;
}

export default function CompletionModal({
  isOpen,
  onClose,
  hunt,
  onCompleteHunt
}: CompletionModalProps) {
  const [completionData, setCompletionData] = useState({
    gender: 'Genderless' as 'Male' | 'Female' | 'Genderless',
    nature: '',
    encounterCount: hunt?.totalEncounters || 0,
    ivs: {
      hp: 0,
      attack: 0,
      defense: 0,
      sp_attack: 0,
      sp_defense: 0,
      speed: 0
    },
    secret: false,
    alpha: false
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
    if (!hunt) return;
    
    const methodLower = String(hunt.method || '').toLowerCase();
    const isHorde = methodLower.includes('horde');
    const isAlphaEgg = methodLower.includes('alpha') && methodLower.includes('egg');
    onCompleteHunt(hunt.id, {
      nature: completionData.nature || undefined,
      ivs: completionData.ivs,
      encounterCount: completionData.encounterCount,
      notes: undefined,
      is_secret_shiny: isHorde ? false : completionData.secret,
      is_alpha: isAlphaEgg ? true : (methodLower.includes('single') || methodLower.includes('lure')) ? completionData.alpha : false,
    });
    
    // Reset form
    setCompletionData({
      gender: 'Genderless',
      nature: '',
      encounterCount: 0,
      ivs: {
        hp: 0,
        attack: 0,
        defense: 0,
        sp_attack: 0,
        sp_defense: 0,
        speed: 0
      },
      secret: false,
      alpha: false
    });
  };

  if (!isOpen || !hunt) return null;

  const modal = (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: 'rgba(0, 0, 0, 0.95)',
        border: '2px solid #ffd700',
        borderRadius: 12,
        padding: 24,
        maxWidth: 700,
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        color: '#fff'
      }}>
        <h3 style={{ color: '#ffd700', margin: '0 0 20px 0', fontSize: '1.5rem', textAlign: 'center' }}>
          🎉 Shiny {hunt.pokemonName} Found!
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ color: '#ffd700', display: 'block', marginBottom: '8px' }}>Gender:</label>
            <select 
              value={completionData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.4)',
                color: '#fff',
                fontSize: '0.9rem',
              }}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Genderless">Genderless</option>
            </select>
          </div>
          
          <div>
            <label style={{ color: '#ffd700', display: 'block', marginBottom: '8px' }}>Nature:</label>
            <select 
              value={completionData.nature}
              onChange={(e) => handleInputChange('nature', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.4)',
                color: '#fff',
                fontSize: '0.9rem',
              }}
            >
              <option value="">Select Nature</option>
              {POKEMON_NATURES.map(nature => (
                <option key={nature} value={nature}>{nature}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ color: '#ffd700', display: 'block', marginBottom: '8px' }}>Encounter Count:</label>
            <input 
              type="number"
              value={completionData.encounterCount}
              onChange={(e) => handleInputChange('encounterCount', parseInt(e.target.value) || 0)}
              placeholder="Total encounters"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.4)',
                color: '#fff',
                fontSize: '0.9rem',
              }}
            />
          </div>
          
          <div>
            <label style={{ color: '#ffd700', display: 'block', marginBottom: 8 }}>IVs (Optional):</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 8 }}>
          {/* Secret Shiny toggle (not allowed for horde) */}
          <div>
            {(() => {
              const isHorde = String(hunt.method || '').toLowerCase().includes('horde');
              return (
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: isHorde ? 'rgba(255,255,255,0.5)' : '#fff' }} title={isHorde ? 'Secret Shinies do not apply to Horde hunts' : 'Mark this as a Secret Shiny'}>
                  <input type="checkbox" checked={!isHorde && completionData.secret} onChange={(e) => handleInputChange('secret', e.target.checked)} aria-label="Secret Shiny" disabled={isHorde} />
                  <span style={{ color: '#ffd700', fontWeight: 700 }}>Secret Shiny</span>
                </label>
              );
            })()}
          </div>

          {/* Alpha toggle: read-only true for Alpha Egg; optional for Singles/Lures; hidden otherwise */}
          <div>
            {(() => {
              const methodLower = String(hunt.method || '').toLowerCase();
              const isAlphaEgg = methodLower.includes('alpha') && methodLower.includes('egg');
              const canAlphaToggle = methodLower.includes('single') || methodLower.includes('lure');
              if (isAlphaEgg) {
                return (
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#fff' }} title="Alpha is always true for Alpha Egg Hunts">
                    <input type="checkbox" checked readOnly aria-label="Alpha" />
                    <span style={{ color: '#ffd700', fontWeight: 700 }}>Alpha</span>
                  </label>
                );
              }
              if (canAlphaToggle) {
                return (
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#fff' }} title="Mark as Alpha shiny">
                    <input type="checkbox" checked={completionData.alpha} onChange={(e) => handleInputChange('alpha', e.target.checked)} aria-label="Alpha" />
                    <span style={{ color: '#ffd700', fontWeight: 700 }}>Alpha</span>
                  </label>
                );
              }
              return null;
            })()}
          </div>
              {[
                { key: 'hp', label: 'HP' },
                { key: 'attack', label: 'Atk' },
                { key: 'defense', label: 'Def' },
                { key: 'sp_attack', label: 'SpA' },
                { key: 'sp_defense', label: 'SpD' },
                { key: 'speed', label: 'Spe' }
              ].map(({ key, label }) => (
                <div key={key} style={{ minWidth: 0 }}>
                  <label style={{ color: '#ccc', fontSize: '0.8rem', display: 'block', marginBottom: 4 }}>{label}:</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="31"
                    value={completionData.ivs[key as keyof PokemonStats]}
                    onChange={(e) => handleIVChange(key as keyof PokemonStats, parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%', padding: 8,
                      border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: 6,
                      background: 'rgba(0, 0, 0, 0.4)', color: '#fff', fontSize: '0.9rem'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          
        </div>
        
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid #ccc',
              color: '#ccc',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              background: '#ffd700',
              color: '#000',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem',
            }}
          >
            Save to Portfolio
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return modal;
  return createPortal(modal, document.body);
} 