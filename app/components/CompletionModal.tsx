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
    }
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
    
    onCompleteHunt(hunt.id, {
      nature: completionData.nature || undefined,
      ivs: completionData.ivs,
      encounterCount: completionData.encounterCount,
      notes: undefined,
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
      }
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
      padding: '20px',
    }}>
      <div style={{
        background: 'rgba(0, 0, 0, 0.95)',
        border: '2px solid #ffd700',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <h3 style={{ 
          color: '#ffd700', 
          margin: '0 0 20px 0',
          fontSize: '1.5rem',
          textAlign: 'center'
        }}>
          🎉 Shiny {hunt.pokemonName} Found!
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
            <label style={{ color: '#ffd700', display: 'block', marginBottom: '8px' }}>IVs (Optional):</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { key: 'hp', label: 'HP' },
                { key: 'attack', label: 'Atk' },
                { key: 'defense', label: 'Def' },
                { key: 'sp_attack', label: 'SpA' },
                { key: 'sp_defense', label: 'SpD' },
                { key: 'speed', label: 'Spe' }
              ].map(({ key, label }) => (
                <div key={key}>
                  <label style={{ color: '#ccc', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>{label}:</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="31"
                    value={completionData.ivs[key as keyof PokemonStats]}
                    onChange={(e) => handleIVChange(key as keyof PokemonStats, parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '6px',
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      borderRadius: '4px',
                      background: 'rgba(0, 0, 0, 0.4)',
                      color: '#fff',
                      fontSize: '0.8rem',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          
        </div>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
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