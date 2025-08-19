import React, { useEffect, useState } from 'react';
import type { PokemonBuild } from '../types/pokemon';
import { TIER_COLORS } from '../types/pokemon';
import { ExportModal } from './ExportModal';
import { ModalBase } from './ui/ModalBase';

interface Team {
  id: string;
  name: string;
  pokemon: PokemonBuild[];
}

interface TeamViewProps {
  teams: Team[];
  onEdit?: (build: PokemonBuild) => void;
  onDelete?: (id: string) => void;
  onEditTeamName?: (teamId: string, newName: string) => void;
  editingTeamId?: string | null;
  onRequestEditTeamName?: (teamId: string) => void;
  onCancelEditTeamName?: () => void;
}

// Team Name Edit Modal
function TeamNameEditModal({ isOpen, onClose, team, onSave }: { 
  isOpen: boolean; 
  onClose: () => void; 
  team: Team; 
  onSave: (newName: string) => void; 
}) {
  const [newName, setNewName] = useState(team.name);
  const initialName = team.name;

  // Close on Esc key when open
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const handleSave = () => {
    if (newName.trim()) {
      onSave(newName.trim());
      onClose();
    }
  };

  const isDirty = newName !== initialName;

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: 'rgba(0, 0, 0, 0.95)',
        border: '2px solid #ffcb05',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '500px',
        width: '100%',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#ffcb05', margin: 0 }}>Edit Team Name</h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid #dc3545',
              color: '#dc3545',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.2rem',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#ffcb05', display: 'block', marginBottom: '8px' }}>Team Name</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter team name..."
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid rgba(255, 203, 5, 0.3)',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.4)',
              color: '#fff',
              fontSize: '1rem',
            }}

          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid #ccc',
              color: '#ccc',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              background: '#ffcb05',
              color: '#000',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// Quick Pokemon Edit Modal
function QuickPokemonEditModal({ isOpen, onClose, pokemon, onSave }: { 
  isOpen: boolean; 
  onClose: () => void; 
  pokemon: PokemonBuild; 
  onSave: (updatedPokemon: PokemonBuild) => void; 
}) {
  const [editedPokemon, setEditedPokemon] = useState(pokemon);

  const handleSave = () => {
    onSave(editedPokemon);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: 'rgba(0, 0, 0, 0.95)',
        border: '2px solid #ffcb05',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#ffcb05', margin: 0 }}>Quick Edit: {pokemon.name}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid #dc3545',
              color: '#dc3545',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.2rem',
            }}
          >
            ✕
          </button>
        </div>

        {/* Nature and Ability */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ color: '#ffcb05', display: 'block', marginBottom: '8px' }}>Nature</label>
            <input
              type="text"
              value={editedPokemon.nature || ''}
              onChange={(e) => setEditedPokemon({...editedPokemon, nature: e.target.value})}
              placeholder="e.g., Adamant"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid rgba(255, 203, 5, 0.3)',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.4)',
                color: '#fff',
                fontSize: '0.9rem',
              }}
            />
          </div>
          <div>
            <label style={{ color: '#ffcb05', display: 'block', marginBottom: '8px' }}>Ability</label>
            <input
              type="text"
              value={editedPokemon.ability || ''}
              onChange={(e) => setEditedPokemon({...editedPokemon, ability: e.target.value})}
              placeholder="e.g., Intimidate"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid rgba(255, 203, 5, 0.3)',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.4)',
                color: '#fff',
                fontSize: '0.9rem',
              }}
            />
          </div>
        </div>

        {/* Item */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#ffcb05', display: 'block', marginBottom: '8px' }}>Item</label>
          <input
            type="text"
            value={editedPokemon.item || ''}
            onChange={(e) => setEditedPokemon({...editedPokemon, item: e.target.value})}
            placeholder="e.g., Choice Band"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid rgba(255, 203, 5, 0.3)',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.4)',
              color: '#fff',
              fontSize: '0.9rem',
            }}
          />
        </div>

        {/* EVs */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#ffcb05', display: 'block', marginBottom: '8px' }}>EVs</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {[
              { key: 'hp', label: 'HP', flatKey: 'hpEV' },
              { key: 'attack', label: 'Atk', flatKey: 'attackEV' },
              { key: 'defense', label: 'Def', flatKey: 'defenseEV' },
              { key: 'sp_attack', label: 'SpA', flatKey: 'spAttackEV' },
              { key: 'sp_defense', label: 'SpD', flatKey: 'spDefenseEV' },
              { key: 'speed', label: 'Spe', flatKey: 'speedEV' }
            ].map(({ key, label, flatKey }) => (
              <div key={key}>
                <label style={{ color: '#ccc', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>{label}</label>
                <input
                  type="number"
                  min="0"
                  max="252"
                  value={editedPokemon[flatKey as keyof PokemonBuild] as number || editedPokemon.evs?.[key as keyof typeof editedPokemon.evs] || 0}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setEditedPokemon({
                      ...editedPokemon,
                      [flatKey]: value,
                      evs: {
                        ...editedPokemon.evs,
                        [key]: value
                      }
                    });
                  }}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: '1px solid rgba(255, 203, 5, 0.3)',
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

        {/* Moves */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#ffcb05', display: 'block', marginBottom: '8px' }}>Moves</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[0, 1, 2, 3].map(index => (
              <div key={index}>
                <label style={{ color: '#ccc', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Move {index + 1}</label>
                <input
                  type="text"
                  value={editedPokemon.moves[index] || ''}
                  onChange={(e) => {
                    const newMoves = [...editedPokemon.moves];
                    newMoves[index] = e.target.value;
                    setEditedPokemon({...editedPokemon, moves: newMoves});
                  }}
                  placeholder={`Move ${index + 1}`}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: '1px solid rgba(255, 203, 5, 0.3)',
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

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid #ccc',
              color: '#ccc',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              background: '#ffcb05',
              color: '#000',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function PokemonMiniCard({ build, onEdit, onDelete, onQuickEdit }: { 
  build: PokemonBuild; 
  onEdit?: (build: PokemonBuild) => void; 
  onDelete?: (id: string) => void; 
  onQuickEdit?: (build: PokemonBuild) => void;
}) {
  const [showExportModal, setShowExportModal] = useState(false);
  const tierColor = TIER_COLORS[build.tier];

  const formatPokemonName = (name: string) => {
    // Handle Rotom forms specifically
    if (name.toLowerCase().includes('rotom')) {
      if (name.toLowerCase().includes('heat')) return 'rotom-heat';
      if (name.toLowerCase().includes('wash')) return 'rotom-wash';
      if (name.toLowerCase().includes('frost')) return 'rotom-frost';
      if (name.toLowerCase().includes('fan')) return 'rotom-fan';
      if (name.toLowerCase().includes('mow')) return 'rotom-mow';
      return 'rotom'; // Base form
    }
    
    return name.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/nidoranf/g, 'nidoran-f')
      .replace(/nidoranm/g, 'nidoran-m')
      .replace(/farfetchd/g, 'farfetchd')
      .replace(/mrmime/g, 'mrmime');
  };

  const spriteUrl = `https://img.pokemondb.net/sprites/home/normal/${formatPokemonName(build.species)}.png`;
  const fallbackSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png`;

  const handleExportToShowdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowExportModal(true);
  };

  return (
    <div
      style={{
        background: `linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6))`,
        border: `2px solid ${tierColor.background}`,
        borderRadius: '8px',
        padding: '12px',
        transition: 'all 0.3s ease',
        position: 'relative',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 4px 15px rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.4)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Pokemon Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <img
          src={spriteUrl}
          alt={build.species}
          style={{
            width: '40px',
            height: '40px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))',
          }}
          onError={(e) => {
            e.currentTarget.src = fallbackSpriteUrl;
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h5 style={{ 
            color: '#fff', 
            margin: '0 0 2px 0', 
            fontSize: '0.9rem', 
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {build.name}
          </h5>
          {build.name !== build.species && (
            <div style={{ color: '#ddd', fontSize: '0.75rem' }}>
              ({build.species})
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <span
              style={{
                backgroundColor: tierColor.background,
                color: tierColor.text,
                padding: '1px 4px',
                borderRadius: '3px',
                fontSize: '0.65rem',
                fontWeight: 'bold',
              }}
            >
              {build.tier}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div style={{ fontSize: '0.75rem', color: '#ccc', marginBottom: '8px' }}>
        <div><strong>Nature:</strong> {build.nature}</div>
        <div><strong>Ability:</strong> {build.ability}</div>
        {build.item && <div><strong>Item:</strong> {build.item}</div>}
        
        {/* EVs */}
        <div style={{ marginTop: '4px' }}>
          <strong>EVs:</strong> {(() => {
            // Handle both flat and nested EV formats for compatibility
            const evs = {
              hp: build.hpEV || build.evs?.hp || 0,
              attack: build.attackEV || build.evs?.attack || 0,
              defense: build.defenseEV || build.evs?.defense || 0,
              sp_attack: build.spAttackEV || build.evs?.sp_attack || 0,
              sp_defense: build.spDefenseEV || build.evs?.sp_defense || 0,
              speed: build.speedEV || build.evs?.speed || 0
            };
            const evEntries: string[] = [];
            if (evs.hp > 0) evEntries.push(`${evs.hp} HP`);
            if (evs.attack > 0) evEntries.push(`${evs.attack} Atk`);
            if (evs.defense > 0) evEntries.push(`${evs.defense} Def`);
            if (evs.sp_attack > 0) evEntries.push(`${evs.sp_attack} SpA`);
            if (evs.sp_defense > 0) evEntries.push(`${evs.sp_defense} SpD`);
            if (evs.speed > 0) evEntries.push(`${evs.speed} Spe`);
            return evEntries.length > 0 ? evEntries.join(' / ') : 'No EVs';
          })()}
        </div>
        
        {/* Moves */}
        <div style={{ marginTop: '4px' }}>
          <strong>Moves:</strong>
          <div style={{ marginTop: '2px' }}>
            {build.moves.filter(move => move.trim()).map((move, index) => (
              <div key={index} style={{ 
                fontSize: '0.7rem', 
                color: '#aaa',
                marginLeft: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span>•</span>
                <span>{move}</span>
              </div>
            ))}
            {build.moves.filter(move => move.trim()).length === 0 && (
              <div style={{ fontSize: '0.7rem', color: '#777', marginLeft: '8px' }}>
                No moves set
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
        <button
          onClick={handleExportToShowdown}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #28a745',
            color: '#28a745',
            padding: '2px 6px',
            borderRadius: '3px',
            fontSize: '0.65rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontWeight: '600',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title="Export to Pokemon Showdown format"
        >
          📋
        </button>
        
        {/* Quick Edit Button */}
        {onQuickEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickEdit(build);
            }}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #ffc107',
              color: '#ffc107',
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '0.65rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: '600',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 193, 7, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Quick edit EVs, moves, nature, etc."
          >
            ⚡
          </button>
        )}
        
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(build);
            }}
            style={{
              backgroundColor: 'transparent',
              border: `1px solid ${tierColor.background}`,
              color: tierColor.background,
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '0.65rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: '600',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.2)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ✏️
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(build.id);
            }}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #dc3545',
              color: '#dc3545',
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '0.65rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: '600',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            🗑️
          </button>
        )}
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        pokemon={build}
      />
    </div>
  );
}

function TeamCard({ team, onEdit, onDelete, onEditTeamName, onQuickEdit, editingTeamId, onRequestEditTeamName, onCancelEditTeamName }: { 
  team: Team; 
  onEdit?: (build: PokemonBuild) => void; 
  onDelete?: (id: string) => void; 
  onEditTeamName?: (teamId: string, newName: string) => void;
  onQuickEdit?: (build: PokemonBuild) => void;
  editingTeamId?: string | null;
  onRequestEditTeamName?: (teamId: string) => void;
  onCancelEditTeamName?: () => void;
}) {
  const [showTeamExportModal, setShowTeamExportModal] = useState(false);
  const [showTeamNameEdit, setShowTeamNameEdit] = useState(false);

  const exportTeamToShowdown = () => {
    setShowTeamExportModal(true);
  };

  const handleEditTeamName = (newName: string) => {
    if (onEditTeamName) {
      onEditTeamName(team.id, newName);
    }
  };

  const handleDeleteTeam = () => {
    if (window.confirm(`Are you sure you want to delete the entire "${team.name}" team? This will delete all ${team.pokemon.length} Pokemon in this team.`)) {
      // Delete all Pokemon in the team
      team.pokemon.forEach(pokemon => {
        if (onDelete) {
          onDelete(pokemon.id);
        }
      });
    }
  };

  return (
    <div
      style={{
        background: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 203, 5, 0.3)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
      }}
    >
      {/* Team Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div>
            <h3 style={{ 
              color: '#ffcb05', 
              margin: 0, 
              fontSize: '1.3rem', 
              fontWeight: 'bold' 
            }}>
              {team.name}
            </h3>
            <p style={{ 
              color: '#ccc', 
              margin: '4px 0 0 0', 
              fontSize: '0.9rem' 
            }}>
              {team.pokemon.length}/6 Pokemon
            </p>
          </div>
          
          {/* Edit Team Name Button */}
          {onEditTeamName && (
            <button
              onClick={() => {
                if (onRequestEditTeamName) {
                  onRequestEditTeamName(team.id);
                } else {
                  setShowTeamNameEdit(true);
                }
              }}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #ffcb05',
                color: '#ffcb05',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '600',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 203, 5, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              title="Edit team name"
            >
              ✏️ Edit Name
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={exportTeamToShowdown}
            disabled={team.pokemon.length === 0}
            style={{
              backgroundColor: team.pokemon.length > 0 ? '#28a745' : 'rgba(128, 128, 128, 0.5)',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: team.pokemon.length > 0 ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => {
              if (team.pokemon.length > 0) {
                e.currentTarget.style.backgroundColor = '#218838';
              }
            }}
            onMouseLeave={(e) => {
              if (team.pokemon.length > 0) {
                e.currentTarget.style.backgroundColor = '#28a745';
              }
            }}
            title="Export entire team to Pokemon Showdown format"
          >
            📋 Export Team
          </button>
          
          {/* Delete Team Button */}
          {team.pokemon.length > 0 && (
            <button
              onClick={handleDeleteTeam}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #dc3545',
                color: '#dc3545',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.2)';
                e.currentTarget.style.borderColor = '#dc3545';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#dc3545';
              }}
              title="Delete entire team (all Pokemon)"
            >
              🗑️ Delete Team
            </button>
          )}
        </div>
      </div>

      {/* Pokemon Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        minHeight: team.pokemon.length === 0 ? '100px' : 'auto',
      }}>
        {team.pokemon.map(pokemon => (
          <PokemonMiniCard
            key={pokemon.id}
            build={pokemon}
            onEdit={onEdit}
            onDelete={onDelete}
            onQuickEdit={onQuickEdit}
          />
        ))}
        
        {/* Empty slots for incomplete teams */}
        {Array.from({ length: Math.max(0, 6 - team.pokemon.length) }, (_, index) => (
          <div
            key={`empty-${index}`}
            style={{
              background: 'rgba(128, 128, 128, 0.1)',
              border: '2px dashed rgba(128, 128, 128, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              minHeight: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#888',
              fontSize: '0.8rem',
              fontStyle: 'italic',
            }}
          >
            Empty Slot
          </div>
        ))}
      </div>

      {team.pokemon.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#888', 
          fontSize: '1rem',
          fontStyle: 'italic'
        }}>
          No Pokemon in this team yet. Assign Pokemon using the Team Management section above.
        </div>
      )}

      {/* Team Export Modal */}
      <ExportModal
        isOpen={showTeamExportModal}
        onClose={() => setShowTeamExportModal(false)}
        team={team.pokemon}
        title={`${team.name} Team Export`}
      />
      
      {/* Team Name Edit Modal */}
      <TeamNameEditModal
        isOpen={editingTeamId ? editingTeamId === team.id : showTeamNameEdit}
        onClose={() => {
          if (onCancelEditTeamName) {
            onCancelEditTeamName();
          } else {
            setShowTeamNameEdit(false);
          }
        }}
        team={team}
        onSave={handleEditTeamName}
      />
    </div>
  );
}

export function TeamView({ teams, onEdit, onDelete, onEditTeamName, editingTeamId, onRequestEditTeamName, onCancelEditTeamName }: TeamViewProps) {
  const [showQuickEdit, setShowQuickEdit] = useState(false);
  const [quickEditPokemon, setQuickEditPokemon] = useState<PokemonBuild | null>(null);
  
  const realTeams = teams.filter(team => team.id !== 'unassigned');

  const handleQuickEdit = (pokemon: PokemonBuild) => {
    setQuickEditPokemon(pokemon);
    setShowQuickEdit(true);
  };

  const handleQuickEditSave = (updatedPokemon: PokemonBuild) => {
    if (onEdit) {
      onEdit(updatedPokemon);
    }
  };

  return (
    <div>
      {realTeams.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          color: '#ccc',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 203, 5, 0.3)',
        }}>
          <h3 style={{ 
            color: '#ffcb05', 
            fontSize: '1.5rem', 
            margin: '0 0 16px 0' 
          }}>
            🏆 No Teams Created Yet
          </h3>
          <p style={{ fontSize: '1rem', marginBottom: '8px' }}>
            Create your first team using the Team Management section above to organize your Pokemon builds.
          </p>
          <p style={{ fontSize: '0.9rem' }}>
            Teams help you group Pokemon for specific strategies and can be exported together to Pokemon Showdown.
          </p>
        </div>
      ) : (
        realTeams.map(team => (
          <TeamCard
            key={team.id}
            team={team}
            onEdit={onEdit}
            onDelete={onDelete}
            onEditTeamName={onEditTeamName}
            onQuickEdit={handleQuickEdit}
            editingTeamId={editingTeamId}
            onRequestEditTeamName={onRequestEditTeamName}
            onCancelEditTeamName={onCancelEditTeamName}
          />
        ))
      )}
      
      {/* Quick Edit Modal */}
      {showQuickEdit && quickEditPokemon && (
        <QuickPokemonEditModal
          isOpen={showQuickEdit}
          onClose={() => setShowQuickEdit(false)}
          pokemon={quickEditPokemon}
          onSave={handleQuickEditSave}
        />
      )}
    </div>
  );
} 