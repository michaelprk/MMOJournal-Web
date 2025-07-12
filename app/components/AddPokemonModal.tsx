import { useState, useEffect, useCallback } from 'react';
import type { PokemonBuild, CompetitiveTier } from '../types/pokemon';
import { COMPETITIVE_TIERS, POKEMON_NATURES, TIER_FULL_NAMES, TIER_COLORS } from '../types/pokemon';
import { parseMultipleShowdownImports, multipleShowdownImportsToBuilds, isValidShowdownImport } from '../utils/showdown-parser';
import { PokeApiService } from '../services/pokemon-backend';
import { AutocompleteInput } from './AutocompleteInput';

interface AddPokemonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (build: Omit<PokemonBuild, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  editBuild?: PokemonBuild;
  defaultTab?: 'manual' | 'showdown';
  existingBuilds?: PokemonBuild[];
}

export function AddPokemonModal({ isOpen, onClose, onSave, editBuild, defaultTab = 'manual', existingBuilds = [] }: AddPokemonModalProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'showdown'>(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const [showdownText, setShowdownText] = useState('');
  const [importedBuilds, setImportedBuilds] = useState<Array<Omit<PokemonBuild, 'id' | 'created_at' | 'updated_at'>>>([]);
  const [showTierPopup, setShowTierPopup] = useState(false);
  const [selectedImportTier, setSelectedImportTier] = useState<CompetitiveTier>('OU');
  const [teamName, setTeamName] = useState('');
  const [shouldCreateTeam, setShouldCreateTeam] = useState(false);
  
  // Autocomplete states
  const [pokemonSuggestions, setPokemonSuggestions] = useState<string[]>([]);
  const [moveSuggestions, setMoveSuggestions] = useState<string[]>([]);
  const [itemSuggestions, setItemSuggestions] = useState<string[]>([]);

  // Helper function to find existing team by name (case-insensitive)
  const findExistingTeam = (teamName: string): { team_id: string; team_name: string } | null => {
    const normalizedName = teamName.trim().toLowerCase();
    const existingTeam = existingBuilds.find(build => 
      build.team_name && build.team_id && build.team_name.toLowerCase() === normalizedName
    );
    return existingTeam ? { team_id: existingTeam.team_id!, team_name: existingTeam.team_name! } : null;
  };

  // Helper function to check if team name already exists
  const teamNameExists = (teamName: string): boolean => {
    const normalizedName = teamName.trim().toLowerCase();
    return existingBuilds.some(build => 
      build.team_name && build.team_name.toLowerCase() === normalizedName
    );
  };
  
  const [formData, setFormData] = useState({
    name: '',
    gender: '' as 'M' | 'F' | 'U' | '',
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
    team_id: '',
    team_name: '',
  });

  // Set default tab and reset form when modal opens/closes or when editBuild changes
  useEffect(() => {
    if (isOpen) {
      // Disable navbar interactions when modal is open
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
      
      if (editBuild) {
        setActiveTab(defaultTab);
        setFormData({
          name: editBuild.name,
          gender: editBuild.gender || '',
          tier: editBuild.tier,
          level: editBuild.level,
          nature: editBuild.nature,
          ability: editBuild.ability,
          item: editBuild.item || '',
          moves: [...editBuild.moves, '', '', '', ''].slice(0, 4),
          ivs: editBuild.ivs,
          evs: editBuild.evs,
          description: editBuild.description || '',
          team_id: editBuild.team_id || '',
          team_name: editBuild.team_name || '',
        });
        setShowdownText(editBuild.showdown_import || '');
        setShowTierPopup(false);
      } else {
        // Reset to defaults
        setFormData({
          name: '',
          gender: '',
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
          team_id: '',
          team_name: '',
        });
        setShowdownText('');
        setTeamName('');
        setShouldCreateTeam(false);
        
        // Show tier popup if opening directly to showdown tab
        if (defaultTab === 'showdown') {
          setShowTierPopup(true);
          // Don't set active tab yet, wait for tier selection
        } else {
          setActiveTab(defaultTab);
          setShowTierPopup(false);
        }
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

  const handleShowdownTabClick = () => {
    if (!editBuild) {
      setShowTierPopup(true);
    } else {
      setActiveTab('showdown');
    }
  };

  const handleTierSelection = (tier: CompetitiveTier) => {
    setSelectedImportTier(tier);
    setShowTierPopup(false);
    setActiveTab('showdown');
  };

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

      const builds = multipleShowdownImportsToBuilds(parsedPokemon, selectedImportTier);
      setImportedBuilds(builds);
      
      if (builds.length === 1) {
        // Single Pokemon - populate manual form
        const build = builds[0];
        setFormData({
          name: build.name,
          gender: build.gender || '',
          tier: build.tier,
          level: build.level,
          nature: build.nature,
          ability: build.ability,
          item: build.item || '',
          moves: [...build.moves, '', '', '', ''].slice(0, 4),
          ivs: build.ivs,
          evs: build.evs,
          description: build.description || '',
          team_id: build.team_id || '',
          team_name: build.team_name || '',
        });
        setActiveTab('manual');
        setShouldCreateTeam(false);
      } else if (builds.length > 1) {
        // Multiple Pokemon - suggest team creation
        setShouldCreateTeam(true);
        setTeamName(`Team ${Date.now()}`); // Default team name
      }
    } catch (error) {
      console.error('Error parsing Showdown import:', error);
      alert('Error parsing Showdown import. Please check the format.');
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'showdown' && importedBuilds.length > 0) {
        // Handle team creation for Showdown imports
        let teamId: string | undefined;
        let finalTeamName: string | undefined;
        
        if (shouldCreateTeam && teamName.trim()) {
          // Check if team already exists
          const existingTeam = findExistingTeam(teamName.trim());
          if (existingTeam) {
            teamId = existingTeam.team_id;
            finalTeamName = existingTeam.team_name;
          } else {
            // Create new team
            teamId = `team_${teamName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
            finalTeamName = teamName.trim();
          }
        }
        
        // Save all imported Pokemon builds
        for (const build of importedBuilds) {
          await onSave({
            ...build,
            showdown_import: showdownText,
            team_id: teamId,
            team_name: finalTeamName,
          });
        }
      } else {
        // Save single Pokemon build (manual input)
        const build = {
          name: formData.name,
          species: formData.name,
          gender: formData.gender || undefined,
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
          team_id: formData.team_id || undefined,
          team_name: formData.team_name || undefined,
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
    (formData.name && formData.ability);

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
      {/* Tier Selection Popup */}
      {showTierPopup && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowTierPopup(false);
            }
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.98)',
              border: '2px solid #ffcb05',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
            }}
          >
            <h3 style={{ color: '#ffcb05', marginTop: 0, marginBottom: '1.5rem', textAlign: 'center' }}>
              Select Tier for Import
            </h3>
            <p style={{ color: '#ccc', marginBottom: '1.5rem', textAlign: 'center' }}>
              Choose which tier these Pokemon belong to:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {COMPETITIVE_TIERS.map((tier) => {
                const tierColor = TIER_COLORS[tier];
                return (
                  <button
                    key={tier}
                    onClick={() => handleTierSelection(tier)}
                    style={{
                      background: tierColor.gradient,
                      color: tierColor.text,
                      border: `2px solid ${tierColor.background}`,
                      padding: '12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = `0 4px 15px rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.4)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{tier}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{TIER_FULL_NAMES[tier]}</div>
                  </button>
                );
              })}
            </div>
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button
                onClick={() => setShowTierPopup(false)}
                style={{
                  backgroundColor: 'rgba(220, 53, 69, 0.2)',
                  border: '2px solid #dc3545',
                  color: '#dc3545',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
            onClick={handleShowdownTabClick}
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
            {selectedImportTier && (
              <div style={{ marginBottom: '1rem', padding: '8px 12px', backgroundColor: `rgba(${TIER_COLORS[selectedImportTier].background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.2)`, borderRadius: '6px', border: `1px solid ${TIER_COLORS[selectedImportTier].background}` }}>
                <span style={{ color: '#ccc', fontSize: '0.85rem' }}>Importing to tier: </span>
                <span style={{ color: TIER_COLORS[selectedImportTier].background, fontWeight: 'bold' }}>
                  {selectedImportTier} - {TIER_FULL_NAMES[selectedImportTier]}
                </span>
              </div>
            )}
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
                
                {/* Team Creation Section - Always Available */}
                {(
                  <div style={{
                    backgroundColor: 'rgba(255, 203, 5, 0.1)',
                    border: '1px solid rgba(255, 203, 5, 0.3)',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px',
                  }}>
                    <h4 style={{ color: '#ffcb05', margin: '0 0 12px 0', fontSize: '1rem' }}>
                      🏆 Team Creation
                    </h4>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                      }}>
                        <input
                          type="checkbox"
                          checked={shouldCreateTeam}
                          onChange={(e) => setShouldCreateTeam(e.target.checked)}
                          style={{ cursor: 'pointer' }}
                        />
                        {importedBuilds.length === 0 ? 'Create a new team with imported Pokemon' :
                         importedBuilds.length === 1 ? 'Create a new team with this Pokemon' :
                         `Create a new team with these ${importedBuilds.length} Pokemon`}
                      </label>
                    </div>
                    
                    {shouldCreateTeam && (
                      <div>
                        <label style={{ color: '#ffcb05', display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>
                          Team Name:
                        </label>
                        <input
                          type="text"
                          value={teamName}
                          onChange={(e) => {
                            const newTeamName = e.target.value;
                            setTeamName(newTeamName);
                          }}
                          placeholder="Enter team name..."
                          style={{
                            width: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: teamName.trim() && teamNameExists(teamName) ? 
                              '1px solid #ffc107' : '1px solid #ffcb05',
                            borderRadius: '6px',
                            color: '#fff',
                            padding: '8px 12px',
                            fontSize: '0.9rem',
                          }}
                        />
                        <div style={{ color: '#ccc', fontSize: '0.8rem', marginTop: '4px' }}>
                          {teamName.trim() && teamNameExists(teamName) ? 
                            `⚠️ A team named "${teamName}" already exists. Pokemon will be added to the existing team.` :
                            teamName.trim() ?
                            `This will create a new team called "${teamName}" for easy management and export.` :
                            'Enter a team name to group Pokemon together for easy management and export.'
                          }
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
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
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'M' | 'F' | 'U' | '' })}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid #ffcb05',
                      borderRadius: '8px',
                      color: '#fff',
                      padding: '8px 12px',
                    }}
                  >
                    <option value="" style={{ backgroundColor: '#000' }}>No gender specified</option>
                    <option value="M" style={{ backgroundColor: '#000' }}>♂ Male</option>
                    <option value="F" style={{ backgroundColor: '#000' }}>♀ Female</option>
                    <option value="U" style={{ backgroundColor: '#000' }}>◯ Genderless</option>
                  </select>
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

                {/* Team Assignment Section */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ color: '#ffcb05', display: 'block', marginBottom: '0.5rem' }}>
                    🏆 Team Assignment (Optional)
                  </label>
                  <div style={{ 
                    backgroundColor: 'rgba(255, 203, 5, 0.05)',
                    border: '1px solid rgba(255, 203, 5, 0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                  }}>
                    <div style={{ marginBottom: '8px' }}>
                      <input
                        type="text"
                        value={formData.team_name}
                        onChange={(e) => {
                          const teamName = e.target.value;
                          if (teamName.trim()) {
                            // Check if team already exists
                            const existingTeam = findExistingTeam(teamName);
                            if (existingTeam) {
                              // Use existing team
                              setFormData({ 
                                ...formData, 
                                team_name: existingTeam.team_name,
                                team_id: existingTeam.team_id
                              });
                            } else {
                              // Create new team
                              setFormData({ 
                                ...formData, 
                                team_name: teamName,
                                team_id: `team_${teamName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`
                              });
                            }
                          } else {
                            // Clear team assignment
                            setFormData({ 
                              ...formData, 
                              team_name: '',
                              team_id: ''
                            });
                          }
                        }}
                        placeholder="Enter team name to assign this Pokemon to a team..."
                        style={{
                          width: '100%',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 203, 5, 0.3)',
                          borderRadius: '6px',
                          color: '#fff',
                          padding: '8px 12px',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>
                    <div style={{ color: '#ccc', fontSize: '0.8rem' }}>
                      {formData.team_name ? 
                        (() => {
                          const existingTeam = findExistingTeam(formData.team_name);
                          return existingTeam ? 
                            `This Pokemon will be added to the existing "${formData.team_name}" team.` :
                            `This Pokemon will be added to a new "${formData.team_name}" team.`;
                        })() :
                        'Leave empty to add this Pokemon without a team assignment.'
                      }
                    </div>
                  </div>
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