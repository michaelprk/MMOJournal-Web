import { useState, useEffect, useCallback } from 'react';
import type { PokemonBuild, CompetitiveTier } from '../types/pokemon';
import { COMPETITIVE_TIERS, POKEMON_NATURES, TIER_FULL_NAMES } from '../types/pokemon';
import { parseMultipleShowdownImports, multipleShowdownImportsToBuilds, isValidShowdownImport } from '../utils/showdown-parser';
import { PokeApiService } from '../services/pokemon-backend';
import { AutocompleteInput } from './AutocompleteInput';

interface AddPokemonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (build: Omit<PokemonBuild, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  editBuild?: PokemonBuild;
  defaultTab?: 'manual' | 'showdown';
}

export function AddPokemonModal({ isOpen, onClose, onSave, editBuild, defaultTab = 'manual' }: AddPokemonModalProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'showdown'>(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const [showdownText, setShowdownText] = useState('');
  const [importedBuilds, setImportedBuilds] = useState<Array<Omit<PokemonBuild, 'id' | 'created_at' | 'updated_at'>>>([]);
  
  // Autocomplete states
  const [pokemonSuggestions, setPokemonSuggestions] = useState<string[]>([]);
  const [moveSuggestions, setMoveSuggestions] = useState<string[]>([]);
  const [itemSuggestions, setItemSuggestions] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    tier: 'OU' as CompetitiveTier,
    level: 50,
    nature: 'Hardy',
    ability: '',
    item: '',
    moves: ['', '', '', ''],
    ivs: {
      hp: 31,
      attack: 31,
      defense: 31,
      sp_attack: 31,
      sp_defense: 31,
      speed: 31,
    },
    evs: {
      hp: 0,
      attack: 0,
      defense: 0,
      sp_attack: 0,
      sp_defense: 0,
      speed: 0,
    },
    description: '',
  });

  // Set default tab and reset form when modal opens/closes or when editBuild changes
  useEffect(() => {
    if (isOpen) {
      // Disable navbar interactions when modal is open
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
      
      setActiveTab(defaultTab);
      if (editBuild) {
        setFormData({
          name: editBuild.name,
          species: editBuild.species,
          tier: editBuild.tier,
          level: editBuild.level,
          nature: editBuild.nature,
          ability: editBuild.ability,
          item: editBuild.item || '',
          moves: [...editBuild.moves, '', '', '', ''].slice(0, 4),
          ivs: editBuild.ivs,
          evs: editBuild.evs,
          description: editBuild.description || '',
        });
        setShowdownText(editBuild.showdown_import || '');
      } else {
        // Reset to defaults
        setFormData({
          name: '',
          species: '',
          tier: 'OU',
          level: 50,
          nature: 'Hardy',
          ability: '',
          item: '',
          moves: ['', '', '', ''],
          ivs: {
            hp: 31,
            attack: 31,
            defense: 31,
            sp_attack: 31,
            sp_defense: 31,
            speed: 31,
          },
          evs: {
            hp: 0,
            attack: 0,
            defense: 0,
            sp_attack: 0,
            sp_defense: 0,
            speed: 0,
          },
          description: '',
        });
        setShowdownText('');
      }
      setImportedBuilds([]);
    } else {
      // Re-enable navbar interactions when modal closes
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    }
  }, [isOpen, editBuild, defaultTab]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    };
  }, []);

  // Autocomplete search functions
  const searchPokemon = useCallback(async (query: string) => {
    if (query.length > 1) {
      const suggestions = await PokeApiService.searchPokemon(query);
      setPokemonSuggestions(suggestions);
    }
  }, []);

  const searchMoves = useCallback(async (query: string) => {
    if (query.length > 1) {
      const suggestions = await PokeApiService.searchMoves(query);
      setMoveSuggestions(suggestions);
    }
  }, []);

  const searchItems = useCallback(async (query: string) => {
    if (query.length > 1) {
      const suggestions = await PokeApiService.searchItems(query);
      setItemSuggestions(suggestions);
    }
  }, []);

  const handleShowdownImport = () => {
    try {
      if (!isValidShowdownImport(showdownText)) {
        alert('Invalid Showdown import format');
        return;
      }

      const parsedPokemon = parseMultipleShowdownImports(showdownText);
      if (parsedPokemon.length === 0) {
        alert('No valid Pokemon found in the import text');
        return;
      }

      const builds = multipleShowdownImportsToBuilds(parsedPokemon, formData.tier);
      setImportedBuilds(builds);
      
      if (builds.length === 1) {
        // Single Pokemon - populate manual form
        const build = builds[0];
        setFormData({
          name: build.name,
          species: build.species,
          tier: build.tier,
          level: build.level,
          nature: build.nature,
          ability: build.ability,
          item: build.item || '',
          moves: [...build.moves, '', '', '', ''].slice(0, 4),
          ivs: build.ivs,
          evs: build.evs,
          description: build.description || '',
        });
        setActiveTab('manual');
      }
    } catch (error) {
      console.error('Error parsing Showdown import:', error);
      alert('Error parsing Showdown import. Please check the format.');
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'showdown' && importedBuilds.length > 1) {
        // Save multiple Pokemon builds
        for (const build of importedBuilds) {
          await onSave({
            ...build,
            showdown_import: showdownText,
          });
        }
      } else {
        // Save single Pokemon build
        const build = {
          name: formData.name || formData.species,
          species: formData.species || formData.name,
          tier: formData.tier,
          level: formData.level,
          nature: formData.nature,
          ability: formData.ability,
          item: formData.item || undefined,
          moves: formData.moves.filter(move => move.trim()),
          ivs: formData.ivs,
          evs: formData.evs,
          description: formData.description || undefined,
          showdown_import: showdownText || undefined,
        };

        await onSave(build);
      }
      onClose();
    } catch (error) {
      console.error('Error saving Pokemon build:', error);
      alert('Error saving Pokemon build. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const canSave = activeTab === 'showdown' ? 
    importedBuilds.length > 0 : 
    (formData.name && formData.species && formData.ability);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '2rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          border: '2px solid #ffcb05',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <h2 style={{ color: '#ffcb05', marginTop: 0, marginBottom: '1.5rem' }}>
          {editBuild ? 'Edit Pokemon Build' : 'Add New Pokemon Build'}
        </h2>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', marginBottom: '1.5rem', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('manual')}
            style={{
              backgroundColor: activeTab === 'manual' ? '#ffcb05' : 'rgba(255, 203, 5, 0.2)',
              color: activeTab === 'manual' ? '#000' : '#ffcb05',
              border: '2px solid #ffcb05',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Manual Input
          </button>
          <button
            onClick={() => setActiveTab('showdown')}
            style={{
              backgroundColor: activeTab === 'showdown' ? '#ffcb05' : 'rgba(255, 203, 5, 0.2)',
              color: activeTab === 'showdown' ? '#000' : '#ffcb05',
              border: '2px solid #ffcb05',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Showdown Import
          </button>
        </div>

        {activeTab === 'showdown' ? (
          <div>
            <label style={{ color: '#ffcb05', display: 'block', marginBottom: '0.5rem' }}>
              Paste your Pokemon Showdown export (supports multiple Pokemon):
            </label>
            <textarea
              value={showdownText}
              onChange={(e) => setShowdownText(e.target.value)}
              placeholder={`Example (single Pokemon):
Garchomp @ Life Orb
Ability: Rough Skin
Level: 50
EVs: 252 Atk / 4 SpD / 252 Spe
Adamant Nature
- Earthquake
- Dragon Claw
- Stone Edge
- Protect

Example (multiple Pokemon - separate with blank lines):
Amoonguss @ Rocky Helmet
Ability: Regenerator
EVs: 252 HP / 98 Def / 158 SpD
Sassy Nature
- Giga Drain
- Spore
- Rage Powder
- Clear Smog

Zapdos @ Leftovers
Ability: Pressure
EVs: 50 HP / 206 SpA / 252 Spe
Timid Nature
- Detect
- Thunder
- Volt Switch
- Hurricane`}
              style={{
                width: '100%',
                height: '300px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid #ffcb05',
                borderRadius: '8px',
                color: '#fff',
                padding: '12px',
                fontSize: '0.9rem',
                fontFamily: 'monospace',
                resize: 'vertical',
              }}
            />
            <button
              type="button"
              onClick={handleShowdownImport}
              disabled={!showdownText.trim()}
              style={{
                backgroundColor: showdownText.trim() ? '#ffcb05' : 'rgba(255, 203, 5, 0.3)',
                color: showdownText.trim() ? '#000' : '#666',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                marginTop: '1rem',
                cursor: showdownText.trim() ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
              }}
            >
              Import from Showdown
            </button>

            {/* Show imported builds preview */}
            {importedBuilds.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ color: '#ffcb05', marginBottom: '1rem' }}>
                  Imported Pokemon ({importedBuilds.length})
                </h3>
                <div style={{ 
                  maxHeight: '300px', 
                  overflowY: 'auto',
                  border: '1px solid rgba(255, 203, 5, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                }}>
                  {importedBuilds.map((build, index) => (
                    <div key={index} style={{ 
                      backgroundColor: 'rgba(255, 203, 5, 0.1)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      marginBottom: '8px',
                      fontSize: '0.9rem',
                    }}>
                      <div style={{ color: '#ffcb05', fontWeight: 'bold' }}>
                        {build.name} ({build.species})
                      </div>
                      <div style={{ color: '#ccc', fontSize: '0.8rem' }}>
                        {build.tier} • {build.nature} • {build.ability}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Left Column - Basic Info */}
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ color: '#ffcb05', display: 'block', marginBottom: '0.5rem' }}>
                    Pokemon Name *
                  </label>
                  <AutocompleteInput
                    value={formData.name}
                    onChange={(value) => setFormData({ ...formData, name: value })}
                    placeholder="Enter Pokemon name"
                    suggestions={pokemonSuggestions}
                    onSearch={searchPokemon}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ color: '#ffcb05', display: 'block', marginBottom: '0.5rem' }}>
                    Species *
                  </label>
                  <AutocompleteInput
                    value={formData.species}
                    onChange={(value) => setFormData({ ...formData, species: value })}
                    placeholder="Enter species name"
                    suggestions={pokemonSuggestions}
                    onSearch={searchPokemon}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ color: '#ffcb05', display: 'block', marginBottom: '0.5rem' }}>
                      Tier
                    </label>
                    <select
                      value={formData.tier}
                      onChange={(e) => setFormData({ ...formData, tier: e.target.value as CompetitiveTier })}
                      style={{
                        width: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid #ffcb05',
                        borderRadius: '8px',
                        color: '#fff',
                        padding: '8px 12px',
                      }}
                    >
                      {COMPETITIVE_TIERS.map(tier => (
                        <option key={tier} value={tier} style={{ backgroundColor: '#000' }}>
                          {tier} - {TIER_FULL_NAMES[tier]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ color: '#ffcb05', display: 'block', marginBottom: '0.5rem' }}>
                      Level
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 50 })}
                      style={{
                        width: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid #ffcb05',
                        borderRadius: '8px',
                        color: '#fff',
                        padding: '8px 12px',
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ color: '#ffcb05', display: 'block', marginBottom: '0.5rem' }}>
                    Nature *
                  </label>
                  <select
                    value={formData.nature}
                    onChange={(e) => setFormData({ ...formData, nature: e.target.value })}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid #ffcb05',
                      borderRadius: '8px',
                      color: '#fff',
                      padding: '8px 12px',
                    }}
                  >
                    {POKEMON_NATURES.map(nature => (
                      <option key={nature} value={nature} style={{ backgroundColor: '#000' }}>
                        {nature}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ color: '#ffcb05', display: 'block', marginBottom: '0.5rem' }}>
                    Ability *
                  </label>
                  <input
                    type="text"
                    value={formData.ability}
                    onChange={(e) => setFormData({ ...formData, ability: e.target.value })}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid #ffcb05',
                      borderRadius: '8px',
                      color: '#fff',
                      padding: '8px 12px',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ color: '#ffcb05', display: 'block', marginBottom: '0.5rem' }}>
                    Item
                  </label>
                  <AutocompleteInput
                    value={formData.item}
                    onChange={(value) => setFormData({ ...formData, item: value })}
                    placeholder="Enter item name"
                    suggestions={itemSuggestions}
                    onSearch={searchItems}
                  />
                </div>
              </div>

              {/* Right Column - Moves and Description */}
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ color: '#ffcb05', display: 'block', marginBottom: '0.5rem' }}>
                    Moves
                  </label>
                  {formData.moves.map((move, index) => (
                    <div key={index} style={{ marginBottom: '0.5rem' }}>
                      <AutocompleteInput
                        value={move}
                        onChange={(value) => {
                          const newMoves = [...formData.moves];
                          newMoves[index] = value;
                          setFormData({ ...formData, moves: newMoves });
                        }}
                        placeholder={`Move ${index + 1}`}
                        suggestions={moveSuggestions}
                        onSearch={searchMoves}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ color: '#ffcb05', display: 'block', marginBottom: '0.5rem' }}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid #ffcb05',
                      borderRadius: '8px',
                      color: '#fff',
                      padding: '8px 12px',
                      resize: 'vertical',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* IV/EV Section */}
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* IVs */}
                <div>
                  <h3 style={{ color: '#ffcb05', marginBottom: '1rem' }}>Individual Values (IVs)</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {Object.entries(formData.ivs).map(([stat, value]) => (
                      <div key={stat}>
                        <label style={{ color: '#ccc', fontSize: '0.85rem' }}>
                          {stat.toUpperCase().replace('_', ' ')}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="31"
                          value={value}
                          onChange={(e) => setFormData({
                            ...formData,
                            ivs: { ...formData.ivs, [stat]: parseInt(e.target.value) || 0 }
                          })}
                          style={{
                            width: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid #ffcb05',
                            borderRadius: '6px',
                            color: '#fff',
                            padding: '6px 8px',
                            fontSize: '0.85rem',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* EVs */}
                <div>
                  <h3 style={{ color: '#ffcb05', marginBottom: '1rem' }}>Effort Values (EVs)</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {Object.entries(formData.evs).map(([stat, value]) => (
                      <div key={stat}>
                        <label style={{ color: '#ccc', fontSize: '0.85rem' }}>
                          {stat.toUpperCase().replace('_', ' ')}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="252"
                          value={value}
                          onChange={(e) => setFormData({
                            ...formData,
                            evs: { ...formData.evs, [stat]: parseInt(e.target.value) || 0 }
                          })}
                          style={{
                            width: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid #ffcb05',
                            borderRadius: '6px',
                            color: '#fff',
                            padding: '6px 8px',
                            fontSize: '0.85rem',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#aaa' }}>
                    Total: {Object.values(formData.evs).reduce((sum, val) => sum + val, 0)}/510
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(220, 53, 69, 0.2)',
              border: '2px solid #dc3545',
              color: '#dc3545',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !canSave}
            style={{
              backgroundColor: (isLoading || !canSave) 
                ? 'rgba(255, 203, 5, 0.3)' 
                : '#ffcb05',
              color: (isLoading || !canSave) 
                ? '#666' 
                : '#000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: (isLoading || !canSave) 
                ? 'not-allowed' 
                : 'pointer',
              fontWeight: 'bold',
            }}
          >
            {isLoading ? 'Saving...' : 
             activeTab === 'showdown' && importedBuilds.length > 1 ? 
             `Save ${importedBuilds.length} Pokemon` :
             editBuild ? 'Update Build' : 'Create Build'}
          </button>
        </div>
      </div>
    </div>
  );
} 