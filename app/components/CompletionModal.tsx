import React, { useState } from 'react';
import type { ShinyHunt, PokemonStats } from '../types/pokemon';
import { POKEMON_NATURES } from '../types/pokemon';
import { ModalBase } from './ui/ModalBase';

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

  const initialData = {
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
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
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

  const isDirty = JSON.stringify(completionData) !== JSON.stringify(initialData);

  if (!hunt) return null;

  return (
    <ModalBase
      open={isOpen}
      onClose={onClose}
      confirmOnDirty={true}
      isDirty={isDirty}
      className="completion-modal"
    >
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

          {/* Secret / Alpha toggles above IVs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            {(() => {
              const isHorde = String(hunt.method || '').toLowerCase().includes('horde');
              return (
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: isHorde ? 'rgba(255,255,255,0.5)' : '#fff' }} title={isHorde ? 'Secret Shinies do not apply to Horde hunts' : 'Mark this as a Secret Shiny'}>
                  <input type="checkbox" checked={!isHorde && completionData.secret} onChange={(e) => handleInputChange('secret', e.target.checked)} aria-label="Secret Shiny" disabled={isHorde} />
                  <span style={{ color: '#ffd700', fontWeight: 700 }}>Secret Shiny</span>
                </label>
              );
            })()}
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
          
          <div>
            <label style={{ color: '#ffd700', display: 'block', marginBottom: 8, textAlign: 'center' }}>IVs (Optional)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
              {[
                { key: 'hp', label: 'HP' },
                { key: 'attack', label: 'Atk' },
                { key: 'defense', label: 'Def' },
                { key: 'sp_attack', label: 'SpA' },
                { key: 'sp_defense', label: 'SpD' },
                { key: 'speed', label: 'Spe' }
              ].map(({ key, label }) => (
                <div key={key} style={{ position: 'relative', minWidth: 0 }}>
                  <span style={{ position: 'absolute', top: -8, left: 10, fontSize: 10, color: '#ffd700', background: 'rgba(0,0,0,0.95)', padding: '0 4px', lineHeight: 1 }}>{label}</span>
                  <input 
                    type="number" 
                    min="0" 
                    max="31"
                    value={completionData.ivs[key as keyof PokemonStats]}
                    onChange={(e) => handleIVChange(key as keyof PokemonStats, parseInt(e.target.value) || 0)}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: 6, color: '#fff', padding: '10px 10px 8px' }}
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
          type="submit"
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
    </ModalBase>
  );
} 