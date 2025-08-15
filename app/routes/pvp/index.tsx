import { useState, useEffect } from 'react';
import type { PokemonBuild, CompetitiveTier } from '../../types/pokemon';
import { COMPETITIVE_TIERS } from '../../types/pokemon';
import { PokemonBuildService } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TierFilter } from '../../components/TierFilter';
import { PokemonBuildCard } from '../../components/PokemonBuildCard';
import { PokemonBuildListView } from '../../components/PokemonBuildListView';
import { ViewToggle } from '../../components/ViewToggle';
import { SortFilter } from '../../components/SortFilter';
import { TeamManager } from '../../components/TeamManager';
// FixedUtilityBar not used in this layout revert

import { AddPokemonModal } from '../../components/AddPokemonModal';
import { ExportModal } from '../../components/ExportModal';



export default function PVPPage() {
  const { user, initializing } = useAuth();
  const navigate = useNavigate();
  const [builds, setBuilds] = useState<PokemonBuild[]>([]);
  const [filteredBuilds, setFilteredBuilds] = useState<PokemonBuild[]>([]);
  const [selectedTier, setSelectedTier] = useState<CompetitiveTier | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBuild, setEditingBuild] = useState<PokemonBuild | undefined>();
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [modalDefaultTab, setModalDefaultTab] = useState<'manual' | 'showdown'>('manual');
  const [currentView, setCurrentView] = useState<'cards' | 'list'>('cards');
  const [showTeamManager, setShowTeamManager] = useState(false);
  const [currentSort, setCurrentSort] = useState<'tier' | 'name' | 'type' | 'newest' | 'oldest'>('tier');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportingPokemon, setExportingPokemon] = useState<PokemonBuild | undefined>();

  // Sort builds by different criteria
  const sortBuilds = (builds: PokemonBuild[], sortBy: 'tier' | 'name' | 'type' | 'newest' | 'oldest') => {
    return [...builds].sort((a, b) => {
      switch (sortBy) {
        case 'tier':
          const tierIndexA = COMPETITIVE_TIERS.indexOf(a.tier);
          const tierIndexB = COMPETITIVE_TIERS.indexOf(b.tier);
          if (tierIndexA === -1) return 1;
          if (tierIndexB === -1) return -1;
          return tierIndexA - tierIndexB;
        
        case 'name':
          return a.name.localeCompare(b.name);
        
        case 'type':
          // Get primary types for comparison
          const getTypeOrder = (species: string) => {
            // Pokemon type mapping for common competitive Pokemon
            const pokemonTypes: Record<string, string> = {
              // Fire types
              'charizard': 'fire',
              'arcanine': 'fire',
              'rapidash': 'fire',
              'flareon': 'fire',
              'moltres': 'fire',
              'typhlosion': 'fire',
              'entei': 'fire',
              'blaziken': 'fire',
              'torchic': 'fire',
              'combusken': 'fire',
              
              // Water types
              'blastoise': 'water',
              'gyarados': 'water',
              'lapras': 'water',
              'vaporeon': 'water',
              'starmie': 'water',
              'feraligatr': 'water',
              'suicune': 'water',
              'swampert': 'water',
              'mudkip': 'water',
              'marshtomp': 'water',
              
              // Grass types
              'venusaur': 'grass',
              'exeggutor': 'grass',
              'victreebel': 'grass',
              'vileplume': 'grass',
              'meganium': 'grass',
              'sceptile': 'grass',
              'treecko': 'grass',
              'grovyle': 'grass',
              
              // Electric types
              'pikachu': 'electric',
              'raichu': 'electric',
              'jolteon': 'electric',
              'zapdos': 'electric',
              'ampharos': 'electric',
              'raikou': 'electric',
              'manectric': 'electric',
              'electrode': 'electric',
              
              // Psychic types
              'alakazam': 'psychic',
              'mewtwo': 'psychic',
              'mew': 'psychic',
              'espeon': 'psychic',
              'lugia': 'psychic',
              'celebi': 'psychic',
              'gardevoir': 'psychic',
              'metagross': 'psychic',
              
              // Dragon types
              'dragonite': 'dragon',
              'dragonair': 'dragon',
              'dratini': 'dragon',
              'kingdra': 'dragon',
              'flygon': 'dragon',
              'altaria': 'dragon',
              'salamence': 'dragon',
              'rayquaza': 'dragon',
              
              // Steel types
              'magnezone': 'steel',
              'magneton': 'steel',
              'magnemite': 'steel',
              'steelix': 'steel',
              'skarmory': 'steel',
              'forretress': 'steel',
              'scizor': 'steel',
              
              // Dark types
              'umbreon': 'dark',
              'houndoom': 'dark',
              'tyranitar': 'dark',
              'absol': 'dark',
              'mightyena': 'dark',
              'sableye': 'dark',
              
              // Fighting types
              'machamp': 'fighting',
              'hitmonlee': 'fighting',
              'hitmonchan': 'fighting',
              'primeape': 'fighting',
              'heracross': 'fighting',
              'hariyama': 'fighting',
              
              // Normal types
              'snorlax': 'normal',
              'tauros': 'normal',
              'kangaskhan': 'normal',
              'chansey': 'normal',
              'ditto': 'normal',
              'eevee': 'normal',
              'slaking': 'normal',
              
              // Add more as needed...
            };
            
            const typeOrder = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 
                              'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];
            
            const pokemonName = species.toLowerCase().replace(/[^a-z]/g, '');
            const pokemonType = pokemonTypes[pokemonName] || 'normal';
            return typeOrder.indexOf(pokemonType);
          };
          return getTypeOrder(a.species) - getTypeOrder(b.species);
        
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        
        default:
          return 0;
      }
    });
  };

  // Load Pokemon builds
  useEffect(() => {
    if (initializing) return;
    if (!user) {
      navigate('/login');
      return;
    }
    loadBuilds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, initializing]);

  // Filter and sort builds when tier or sort changes
  useEffect(() => {
    let filtered = selectedTier 
      ? builds.filter(build => build.tier === selectedTier)
      : builds;
    
    // Sort by selected criteria
    filtered = sortBuilds(filtered, currentSort);
    setFilteredBuilds(filtered);
  }, [builds, selectedTier, currentSort]);

  const loadBuilds = async () => {
    try {
      setIsLoading(true);
      const data = await PokemonBuildService.getBuilds();
      setBuilds(data);
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/SB:.*(401|403)/.test(msg)) {
        setError('Unauthorized. Redirecting to login...');
        setTimeout(() => navigate('/login'), 1000);
      } else {
        setError('Failed to load Pokemon builds. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBuild = async (buildData: Omit<PokemonBuild, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingBuild) {
        await PokemonBuildService.updateBuild(editingBuild.id, buildData);
      } else {
        await PokemonBuildService.createBuild(buildData);
      }
      await loadBuilds();
      setShowAddModal(false);
      setEditingBuild(undefined);
    } catch (err) {
      console.error('Failed to save Pokemon build:', err);
      throw err;
    }
  };

  const handleEditBuild = (build: PokemonBuild) => {
    setEditingBuild(build);
    setModalDefaultTab('manual');
    setShowAddModal(true);
    setShowAddOptions(false);
  };

  const handleDeleteBuild = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this Pokemon build?')) {
      try {
        await PokemonBuildService.deleteBuild(id);
        await loadBuilds();
      } catch (err) {
        console.error('Failed to delete Pokemon build:', err);
        alert('Failed to delete Pokemon build. Please try again.');
      }
    }
  };

  const handleAddNew = () => {
    setEditingBuild(undefined);
    setModalDefaultTab('manual');
    setShowAddModal(true);
    setShowAddOptions(false);
  };

  const handleShowdownImport = () => {
    setEditingBuild(undefined);
    setModalDefaultTab('showdown');
    setShowAddModal(true);
    setShowAddOptions(false);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingBuild(undefined);
    setShowAddOptions(false);
    setModalDefaultTab('manual');
  };

  const handleUpdateBuildTeam = async (buildId: string, teamId?: string, teamName?: string) => {
    try {
      const response = await PokemonBuildService.updateBuild(buildId, {
        team_id: teamId || undefined,
        team_name: teamName || undefined
      });
      
      if (response) {
        // Update the builds array with the updated Pokemon
        setBuilds(prevBuilds => 
          prevBuilds.map(build => 
            build.id === buildId ? response : build
          )
        );
        console.log('✅ Updated Pokemon team assignment');
      }
    } catch (error) {
      console.error('❌ Error updating Pokemon team:', error);
    }
  };

  const handleEditTeamName = async (teamId: string, newName: string) => {
    try {
      // Update all Pokemon in the team with the new team name
      const pokemonInTeam = builds.filter(build => build.team_id === teamId);
      
      for (const pokemon of pokemonInTeam) {
        await PokemonBuildService.updateBuild(pokemon.id, {
          team_name: newName
        });
      }
      
      // Update the local state
      setBuilds(prevBuilds => 
        prevBuilds.map(build => 
          build.team_id === teamId ? { ...build, team_name: newName } : build
        )
      );
      
      console.log('✅ Updated team name');
    } catch (error) {
      console.error('❌ Error updating team name:', error);
    }
  };

  const handleExportPokemon = (pokemon: PokemonBuild) => {
    setExportingPokemon(pokemon);
    setShowExportModal(true);
  };

  const handleCloseExportModal = () => {
    setShowExportModal(false);
    setExportingPokemon(undefined);
  };

  // Organize builds into teams for team view
  const organizeIntoTeams = () => {
    const teamMap = new Map();
    const unassignedPokemon: PokemonBuild[] = [];

    filteredBuilds.forEach(build => {
      if (build.team_id && build.team_name) {
        if (!teamMap.has(build.team_id)) {
          teamMap.set(build.team_id, {
            id: build.team_id,
            name: build.team_name,
            pokemon: []
          });
        }
        teamMap.get(build.team_id).pokemon.push(build);
      } else {
        unassignedPokemon.push(build);
      }
    });

    const teams = Array.from(teamMap.values());
    
    if (unassignedPokemon.length > 0) {
      teams.unshift({
        id: 'unassigned',
        name: 'Unassigned Pokemon',
        pokemon: unassignedPokemon
      });
    }

    return teams;
  };

  const tierCounts = builds.reduce((acc, build) => {
    acc[build.tier] = (acc[build.tier] || 0) + 1;
    return acc;
  }, {} as Record<CompetitiveTier, number>);

  return (
    <>
      {/* Sticky Utility Bar - simplified */}
      <div
        className="sticky z-30 px-4 py-2 flex justify-between items-center bg-black/10 rounded-md shadow-sm"
        style={{
          position: 'sticky',
          top: '280px', // below navbar
          left: 0,
          right: 0,
          zIndex: 30,
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0)',
          margin: '0 auto',
          marginBottom: '24px', // Increased margin for better separation
          maxWidth: '1400px',
        }}
      >
        {/* Left Side - Tier Filter */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
          <TierFilter selectedTier={selectedTier} onTierChange={setSelectedTier} style="dropdown" />
        </div>
        
        {/* Centered Main Page Header */}
        <div style={{ 
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}>
          <h1 style={{
            color: '#ffcb05',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            margin: 0,
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            height: '50px',
            letterSpacing: '0.5px',
            whiteSpace: 'nowrap',
          }}>
            ⚔️ PVP Battle Builds ⚔️
          </h1>
        </div>
        
        <div style={{ position: 'relative', marginRight: '16px' }}> {/* Bring inward from edge */}
          <button
            onClick={() => setShowAddOptions(!showAddOptions)}
            style={{
              backgroundColor: '#ffcb05',
              color: '#000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e6b800';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffcb05';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Add Pokemon
            <span style={{ 
              transform: showAddOptions ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}>
              ▼
            </span>
          </button>

          {/* Add Options Dropdown */}
          {showAddOptions && (
            <>
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 100,
                }}
                onClick={() => setShowAddOptions(false)}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.95)',
                  border: '2px solid #ffcb05',
                  borderRadius: '8px',
                  marginTop: '4px',
                  zIndex: 200,
                  minWidth: '200px',
                }}
              >
                <button
                  onClick={handleAddNew}
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#ffcb05',
                    padding: '12px 16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    borderBottom: '1px solid rgba(255, 203, 5, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 203, 5, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  ✚ New Pokemon Entry
                </button>
                <button
                  onClick={handleShowdownImport}
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#ffcb05',
                    padding: '12px 16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 203, 5, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  📋 Showdown Import
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Scrollable content area that starts below utility bar */}
      <div 
        style={{
          position: 'fixed',
          top: '375px', // Start just below utility bar (280px navbar + ~95px utility bar)
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          zIndex: 1,
        }}
      >
        <div 
          style={{ 
            maxWidth: '1400px', 
            margin: '0 auto',
            padding: '1.5rem',
            paddingTop: '5px', // Small breathing room at top of scroll area
            width: '100%',
            minHeight: '100%', // Ensure content fills the scroll area
          }}
        >
          {/* Main Content Area */}
          <div style={{ width: '100%' }}>
            {/* Top Control Row - ViewToggle, Team Showcase, Sort Filter */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              padding: '0 16px',
              position: 'relative',
            }}>
              {/* Left: View Toggle */}
              <div style={{ flex: '0 0 auto' }}>
                <ViewToggle 
                  currentView={currentView} 
                  onViewChange={(view) => setCurrentView(view)} 
                />
              </div>

              {/* Center: Team Showcase Link */}
              <div style={{ 
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                flex: '0 0 auto',
              }}>
                <a
                  href="/pvp/teams"
                  style={{
                    backgroundColor: 'rgba(40, 167, 69, 0.2)',
                    color: '#28a745',
                    border: '2px solid #28a745',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#28a745';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
                    e.currentTarget.style.color = '#28a745';
                  }}
                >
                  🏆 Team Showcase
                </a>
              </div>

              {/* Right: Sort Filter */}
              <div style={{ flex: '0 0 auto', minWidth: '200px' }}>
                <SortFilter currentSort={currentSort} onSortChange={setCurrentSort} />
              </div>
            </div>

            {/* Team Manager (conditionally shown) */}
            {showTeamManager && (
              <TeamManager
                builds={builds}
                onUpdateBuild={handleUpdateBuildTeam}
              />
            )}

          {/* Content */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div
                style={{
                  color: '#ffcb05',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                }}
              >
                Loading Pokemon builds...
              </div>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div
                style={{
                  color: '#ff6b6b',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                }}
              >
                {error}
              </div>
              <button
                onClick={loadBuilds}
                style={{
                  backgroundColor: '#ffcb05',
                  color: '#000',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Try Again
              </button>
            </div>
          ) : filteredBuilds.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div
                style={{
                  color: '#ffcb05',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                }}
              >
                No Pokemon builds found
              </div>
              <p style={{ color: '#ccc', marginBottom: '2rem' }}>
                {selectedTier 
                  ? `No builds found for ${selectedTier} tier. Try selecting a different tier or add some builds.`
                  : 'Start building your competitive Pokemon team by adding your first build.'
                }
              </p>
              <button
                onClick={() => setShowAddOptions(true)}
                style={{
                  backgroundColor: '#ffcb05',
                  color: '#000',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Add Pokemon
              </button>
            </div>
          ) : (
            <>
              {/* Conditional View Rendering */}
              {currentView === 'list' ? (
                <PokemonBuildListView
                  builds={filteredBuilds}
                  onEdit={handleEditBuild}
                  onDelete={handleDeleteBuild}
                  onExport={handleExportPokemon}
                />
              ) : (
                /* Cards View */
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '3rem',
                    maxWidth: '100%',
                  }}
                >
                  {filteredBuilds.map((build) => (
                    <PokemonBuildCard
                      key={build.id}
                      build={build}
                      onEdit={handleEditBuild}
                      onDelete={handleDeleteBuild}
                      onExport={handleExportPokemon}
                    />
                  ))}
                </div>
              )}

              {/* Build Count */}
              {(
                <p 
                  className="text-center mt-10 text-sm text-white/60"
                  style={{ 
                    textAlign: 'center', 
                    marginTop: '2rem', 
                    fontSize: '0.875rem', 
                    color: 'rgba(255, 255, 255, 0.6)',
                    paddingBottom: '2rem',
                  }}
                >
                  {filteredBuilds.length} total builds
                  {selectedTier && ` in ${selectedTier}`}
                </p>
              )}
            </>
          )}
          </div>
        </div>
        
      </div> {/* Close scroll container */}

      {/* Add/Edit Modal */}
      <AddPokemonModal
        isOpen={showAddModal}
        onClose={closeModal}
        onSave={handleSaveBuild}
        editBuild={editingBuild}
        defaultTab={modalDefaultTab}
        existingBuilds={builds}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={handleCloseExportModal}
        pokemon={exportingPokemon}
      />
    </>
  );
}
