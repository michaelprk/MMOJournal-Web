import React, { useState } from 'react';
import type { 
  ShinyHunt, 
  ShinyPortfolio, 
  PokemonStats, 
  HuntingMethod
} from '../../types/pokemon';
import { HUNTING_METHODS, POKEMON_NATURES } from '../../types/pokemon';
import ShinyUtilityBar from '../../components/ShinyUtilityBar';
import ShinyHuntCard from '../../components/ShinyHuntCard';

import ShinyCalendar from '../../components/ShinyPlayArea';
import HuntModal from '../../components/HuntModal';
import CompletionModal from '../../components/CompletionModal';

export default function ShinyShowcase() {
  // Mock data for demonstration - in a real app, this would come from an API
  const [currentHunts, setCurrentHunts] = useState<ShinyHunt[]>([
    {
      id: 1,
      pokemonId: 25,
      pokemonName: 'Pikachu',
      method: 'Singles / Lures',
      startDate: new Date().toISOString(),
      phaseCount: 1,
      totalEncounters: 1547,
      isCompleted: false,
      notes: 'Hunting in Viridian Forest',
      phasePokemon: [
        { phase: 1, pokemonId: 16, pokemonName: 'Pidgey', encounters: 234 },
        { phase: 1, pokemonId: 10, pokemonName: 'Caterpie', encounters: 123 }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const [portfolio, setPortfolio] = useState<ShinyPortfolio[]>([
    {
      id: 1,
      pokemonId: 129,
      pokemonName: 'Magikarp',
      method: 'Singles / Lures',
      dateFound: new Date().toISOString(),
      nature: 'Adamant',
      encounterCount: 2341,
      ivs: { hp: 31, attack: 31, defense: 20, sp_attack: 0, sp_defense: 25, speed: 31 },
      notes: 'Finally! My first shiny!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      pokemonId: 25,
      pokemonName: 'Pikachu',
      method: 'Hordes 5x',
      dateFound: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      nature: 'Jolly',
      encounterCount: 1543,
      ivs: { hp: 29, attack: 31, defense: 22, sp_attack: 15, sp_defense: 31, speed: 31 },
      notes: 'Lightning fast!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      pokemonId: 6,
      pokemonName: 'Charizard',
      method: 'Egg (including Alphas)',
      dateFound: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      nature: 'Modest',
      encounterCount: 512,
      ivs: { hp: 31, attack: 0, defense: 31, sp_attack: 31, sp_defense: 31, speed: 31 },
      notes: 'Perfect shiny dragon!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 4,
      pokemonId: 144,
      pokemonName: 'Articuno',
      method: 'Singles / Lures',
      dateFound: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      nature: 'Calm',
      encounterCount: 8934,
      ivs: { hp: 31, attack: 0, defense: 31, sp_attack: 31, sp_defense: 31, speed: 31 },
      notes: 'Legendary shiny!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 5,
      pokemonId: 448,
      pokemonName: 'Lucario',
      method: 'Hordes 3x',
      dateFound: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      nature: 'Jolly',
      encounterCount: 3421,
      ivs: { hp: 31, attack: 31, defense: 31, sp_attack: 0, sp_defense: 31, speed: 31 },
      notes: 'Aura warrior!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 6,
      pokemonId: 149,
      pokemonName: 'Dragonite',
      method: 'Singles / Lures',
      dateFound: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      nature: 'Adamant',
      encounterCount: 5678,
      ivs: { hp: 31, attack: 31, defense: 31, sp_attack: 0, sp_defense: 31, speed: 31 },
      notes: 'Green giant!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 7,
      pokemonId: 196,
      pokemonName: 'Espeon',
      method: 'Egg (including Alphas)',
      dateFound: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      nature: 'Timid',
      encounterCount: 234,
      ivs: { hp: 31, attack: 0, defense: 31, sp_attack: 31, sp_defense: 31, speed: 31 },
      notes: 'Psychic beauty!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 8,
      pokemonId: 282,
      pokemonName: 'Gardevoir',
      method: 'Hordes 5x',
      dateFound: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      nature: 'Modest',
      encounterCount: 4567,
      ivs: { hp: 31, attack: 0, defense: 31, sp_attack: 31, sp_defense: 31, speed: 31 },
      notes: 'Elegant dancer!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 9,
      pokemonId: 445,
      pokemonName: 'Garchomp',
      method: 'Singles / Lures',
      dateFound: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      nature: 'Jolly',
      encounterCount: 12345,
      ivs: { hp: 31, attack: 31, defense: 31, sp_attack: 0, sp_defense: 31, speed: 31 },
      notes: 'Land shark!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 10,
      pokemonId: 133,
      pokemonName: 'Eevee',
      method: 'Egg (including Alphas)',
      dateFound: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
      nature: 'Modest',
      encounterCount: 678,
      ivs: { hp: 31, attack: 0, defense: 31, sp_attack: 31, sp_defense: 31, speed: 31 },
      notes: 'Evolution potential!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 11,
      pokemonId: 94,
      pokemonName: 'Gengar',
      method: 'Hordes 3x',
      dateFound: new Date(Date.now() - 49 * 24 * 60 * 60 * 1000).toISOString(),
      nature: 'Timid',
      encounterCount: 3456,
      ivs: { hp: 31, attack: 0, defense: 31, sp_attack: 31, sp_defense: 31, speed: 31 },
      notes: 'Ghost master!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 12,
      pokemonId: 212,
      pokemonName: 'Scizor',
      method: 'Singles / Lures',
      dateFound: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000).toISOString(),
      nature: 'Adamant',
      encounterCount: 7890,
      ivs: { hp: 31, attack: 31, defense: 31, sp_attack: 0, sp_defense: 31, speed: 31 },
      notes: 'Metal bug!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 13,
      pokemonId: 376,
      pokemonName: 'Metagross',
      method: 'Singles / Lures',
      dateFound: new Date(Date.now() - 63 * 24 * 60 * 60 * 1000).toISOString(),
      nature: 'Adamant',
      encounterCount: 15678,
      ivs: { hp: 31, attack: 31, defense: 31, sp_attack: 0, sp_defense: 31, speed: 31 },
      notes: 'Silver monster!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 14,
      pokemonId: 350,
      pokemonName: 'Milotic',
      method: 'Egg (including Alphas)',
      dateFound: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
      nature: 'Bold',
      encounterCount: 1234,
      ivs: { hp: 31, attack: 0, defense: 31, sp_attack: 31, sp_defense: 31, speed: 31 },
      notes: 'Beautiful serpent!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 15,
      pokemonId: 609,
      pokemonName: 'Chandelure',
      method: 'Hordes 5x',
      dateFound: new Date(Date.now() - 77 * 24 * 60 * 60 * 1000).toISOString(),
      nature: 'Modest',
      encounterCount: 4321,
      ivs: { hp: 31, attack: 0, defense: 31, sp_attack: 31, sp_defense: 31, speed: 31 },
      notes: 'Spectral flames!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const [showHuntModal, setShowHuntModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [huntModalMode, setHuntModalMode] = useState<'create' | 'phase'>('create');
  const [huntForPhase, setHuntForPhase] = useState<ShinyHunt | null>(null);
  const [completingHunt, setCompletingHunt] = useState<ShinyHunt | null>(null);
  
  // Display limit state
  const [displayHuntsLimit, setDisplayHuntsLimit] = useState(6);

  
  // View mode state  
  const [huntsViewMode, setHuntsViewMode] = useState<'grid' | 'compact'>('grid');

  
  // Filter and sort state
  const [huntFilter, setHuntFilter] = useState<'all' | HuntingMethod>('all');
  const [huntSort, setHuntSort] = useState<'date' | 'encounters' | 'name'>('date');

  const [searchTerm, setSearchTerm] = useState('');

  const handleStartNewHunt = () => {
    setHuntModalMode('create');
    setShowHuntModal(true);
  };

  const handleCreateHunt = (data: {
    pokemonId: number;
    pokemonName: string;
    method: any;
  }) => {
    const newHunt: ShinyHunt = {
      id: Date.now(),
      pokemonId: data.pokemonId,
      pokemonName: data.pokemonName,
      method: data.method,
      startDate: new Date().toISOString(),
      phaseCount: 1,
      totalEncounters: 0,
      isCompleted: false,
      phasePokemon: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCurrentHunts(prev => [...prev, newHunt]);
  };

  const handleEditHunt = (hunt: ShinyHunt) => {
    // TODO: Implement edit functionality
    console.log('Edit hunt:', hunt);
  };

  const handleAddPhase = (hunt: ShinyHunt) => {
    setHuntForPhase(hunt);
    setHuntModalMode('phase');
    setShowHuntModal(true);
  };

  const handleAddPhaseData = (data: {
    huntId: number;
    pokemonId: number;
    pokemonName: string;
    encounters: number;
  }) => {
    setCurrentHunts(prev => prev.map(hunt => {
      if (hunt.id === data.huntId) {
        const newPhasePokemon = [...(hunt.phasePokemon || []), {
          phase: hunt.phaseCount,
          pokemonId: data.pokemonId,
          pokemonName: data.pokemonName,
          encounters: data.encounters
        }];
        return {
          ...hunt,
          phaseCount: hunt.phaseCount + 1,
          totalEncounters: hunt.totalEncounters + data.encounters,
          phasePokemon: newPhasePokemon,
          updatedAt: new Date().toISOString()
        };
      }
      return hunt;
    }));
  };

  const handleMarkFound = (hunt: ShinyHunt) => {
    setCompletingHunt(hunt);
    setShowCompletionModal(true);
  };

  const handleCompleteHunt = (huntId: number, data: {
    nature?: string;
    ivs?: Partial<PokemonStats>;
    encounterCount?: number;
    notes?: string;
  }) => {
    const hunt = currentHunts.find(h => h.id === huntId);
    if (!hunt) return;

    // Add to portfolio
    const newPortfolioEntry: ShinyPortfolio = {
      id: Date.now(),
      pokemonId: hunt.pokemonId,
      pokemonName: hunt.pokemonName,
      method: hunt.method,
      dateFound: new Date().toISOString(),
      nature: data.nature,
      encounterCount: data.encounterCount || hunt.totalEncounters,
      ivs: data.ivs,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPortfolio(prev => [...prev, newPortfolioEntry]);
    
    // Remove from current hunts
    setCurrentHunts(prev => prev.filter(h => h.id !== huntId));
    
    // Close modal
    setShowCompletionModal(false);
    setCompletingHunt(null);
  };

  const handleUpdateNotes = (huntId: number, notes: string) => {
    setCurrentHunts(prev => prev.map(hunt => 
      hunt.id === huntId 
        ? { ...hunt, notes, updatedAt: new Date().toISOString() }
        : hunt
    ));
  };

  // Filter and sort functions
  const getFilteredAndSortedHunts = () => {
    let filteredHunts = currentHunts;
    
    // Apply search filter
    if (searchTerm) {
      filteredHunts = filteredHunts.filter(hunt => 
        hunt.pokemonName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply method filter
    if (huntFilter !== 'all') {
      filteredHunts = filteredHunts.filter(hunt => hunt.method === huntFilter);
    }
    
    // Apply sorting
    filteredHunts.sort((a, b) => {
      switch (huntSort) {
        case 'date':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case 'encounters':
          return b.totalEncounters - a.totalEncounters;
        case 'name':
          return a.pokemonName.localeCompare(b.pokemonName);
        default:
          return 0;
      }
    });
    
    return filteredHunts;
  };



  // Get filtered data
  const filteredHunts = getFilteredAndSortedHunts();

  return (
    <>
      {/* Sticky Utility Bar - positioned outside scrollable container */}
      <div
        style={{
          position: 'sticky',
          top: '280px', // Below navbar (200px navbar + 80px spacing)
          left: 0,
          right: 0,
          zIndex: 30,
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center', // vertically center contents inside the bar
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          margin: '0 auto',
          marginBottom: '24px', // add breathing room below the bar
          maxWidth: '1400px',
        }}
      >
        <div style={{ marginLeft: '16px' }}> {/* Bring inward from edge */}
          {/* Left side stats */}
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Active Hunts:</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffd700', textShadow: '0 0 5px rgba(255, 215, 0, 0.5)' }}>
                {currentHunts.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Total Shinies:</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffd700', textShadow: '0 0 5px rgba(255, 215, 0, 0.5)' }}>
                {portfolio.length}
              </span>
            </div>

          </div>
        </div>
        
        {/* Main Page Header */}
        <h1 style={{
          color: '#ffd700',
          fontSize: '1.8rem',
          fontWeight: 'bold',
          margin: 0,
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          height: '50px',
          letterSpacing: '0.5px',
        }}>
          ✨ Shiny Hunt Tracker ✨
        </h1>
        
        <div style={{ marginRight: '16px' }}> {/* Bring inward from edge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handleStartNewHunt}
              style={{
                backgroundColor: '#ffd700',
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
                e.currentTarget.style.backgroundColor = '#e6c200';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffd700';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              ✨ Start New Hunt
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container - Scrollable */}
      <div
        style={{
          position: 'fixed',
          top: '380px', // Start below navbar + utility bar + extra gap for breathing room
          left: 0,
          right: 0,
          height: 'calc(100vh - 380px)', // Adjust to match new top offset
          backgroundColor: 'transparent',
          overflowY: 'auto', // Allow scrolling within this container
          overflowX: 'hidden',
        }}
      >
        
        <main style={{ 
          maxWidth: '1400px',
          margin: '0 auto',
          padding: "2rem", 
          minHeight: "100%" 
        }}>

        {/* Filter and Sort Controls - moved from fixed bar to content area */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          justifyContent: 'space-between',
          marginBottom: '32px',
          paddingTop: '16px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
        }}>
          {/* Method Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Method:</span>
            <select
              value={huntFilter}
              onChange={(e) => setHuntFilter(e.target.value as 'all' | HuntingMethod)}
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                background: 'rgba(0, 0, 0, 0.4)',
                color: 'white',
                fontSize: '0.875rem',
              }}
            >
              <option value="all">All Methods</option>
              {HUNTING_METHODS.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
          
          {/* Sort Options */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Sort:</span>
            <select
              value={huntSort}
              onChange={(e) => setHuntSort(e.target.value as 'date' | 'encounters' | 'name')}
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                background: 'rgba(0, 0, 0, 0.4)',
                color: 'white',
                fontSize: '0.875rem',
              }}
            >
              <option value="date">Date (Newest)</option>
              <option value="encounters">Encounters (Most)</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Current Hunts Section */}
        <section className="current-hunts-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>🎯 Current Hunts</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>View:</span>
              <button
                onClick={() => setHuntsViewMode(huntsViewMode === 'grid' ? 'compact' : 'grid')}
                style={{
                  backgroundColor: 'rgba(255, 215, 0, 0.2)',
                  color: '#ffd700',
                  border: '1px solid #ffd700',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
                }}
              >
                {huntsViewMode === 'grid' ? '☰' : '⊞'} {huntsViewMode === 'grid' ? 'Compact' : 'Grid'}
              </button>
            </div>
          </div>
          {filteredHunts.length === 0 ? (
            <div className="empty-hunts">
              <p>{searchTerm || huntFilter !== 'all' ? 'No hunts match your filters.' : 'No active hunts. Click "Start New Hunt" to begin!'}</p>
            </div>
          ) : (
            <>
              <div className={huntsViewMode === 'grid' ? 'hunts-grid' : 'hunts-compact'}>
                {filteredHunts.slice(0, displayHuntsLimit).map(hunt => (
                  <ShinyHuntCard
                    key={hunt.id}
                    hunt={hunt}
                    onEdit={handleEditHunt}
                    onAddPhase={handleAddPhase}
                    onMarkFound={handleMarkFound}
                    onUpdateNotes={handleUpdateNotes}
                    viewMode={huntsViewMode}
                  />
                ))}
              </div>
              {filteredHunts.length > displayHuntsLimit && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  marginTop: '1rem' 
                }}>
                  <button
                    onClick={() => setDisplayHuntsLimit(displayHuntsLimit + 6)}
                    style={{
                      backgroundColor: 'rgba(255, 215, 0, 0.2)',
                      color: '#ffd700',
                      border: '1px solid #ffd700',
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
                      e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.3)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    ⬇️ Show More Hunts ({filteredHunts.length - displayHuntsLimit} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Showcase/Calendar Section - added proper separation and heading */}
        <section style={{ 
          marginTop: '48px',
          paddingTop: '32px',
          borderTop: '2px solid rgba(255, 215, 0, 0.3)',
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '24px' 
          }}>
            <h2 style={{
              color: '#ffd700',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: 0,
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            }}>
              📅 Shiny Showcase & Calendar
            </h2>
          </div>
          
          <ShinyCalendar portfolio={portfolio} />
        </section>
      </main>

      {/* Hunt Modal */}
      <HuntModal
        isOpen={showHuntModal}
        onClose={() => {
          setShowHuntModal(false);
          setHuntForPhase(null);
        }}
        onCreateHunt={handleCreateHunt}
        onAddPhase={handleAddPhaseData}
        mode={huntModalMode}
        huntForPhase={huntForPhase || undefined}
      />

      {/* Completion Modal */}
      <CompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        hunt={completingHunt}
        onCompleteHunt={handleCompleteHunt}
      />
      </div>
    </>
  );
}
