import React, { useState, useEffect } from 'react';
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
import ShinyTile, { type ShinyHoverDetails } from '../../components/shiny/ShinyTile';
import { supabase } from '../../services/supabase';
import { shinyHuntService, type ShinyHuntRow } from '../../services/shinyHuntService';
import { useAuth } from '../../contexts/AuthContext';
import HuntModal from '../../components/HuntModal';
import { StartHuntModal } from '../../components/shiny/StartHuntModal';
import { AddPhaseModal } from '../../components/shiny/AddPhaseModal';
import { EditShinyModal } from '../../components/shiny/EditShinyModal';
import CompletionModal from '../../components/CompletionModal';

export default function ShinyShowcase() {
  const { user, initializing } = useAuth();
  // Mock data for demonstration - in a real app, this would come from an API
  const [currentHunts, setCurrentHunts] = useState<ShinyHunt[]>([]);

  const [portfolio, setPortfolio] = useState<ShinyPortfolio[]>([]);

  const [showHuntModal, setShowHuntModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [editingShiny, setEditingShiny] = useState<ShinyPortfolio | null>(null);
  const [huntModalMode, setHuntModalMode] = useState<'create' | 'phase'>('create');
  const [huntForPhase, setHuntForPhase] = useState<ShinyHunt | null>(null);
  const [completingHunt, setCompletingHunt] = useState<ShinyHunt | null>(null);
  
  // Display limit state
  const [displayHuntsLimit, setDisplayHuntsLimit] = useState(6);
  const [showPausedModal, setShowPausedModal] = useState(false);
  const [pausedHunts, setPausedHunts] = useState<ShinyHunt[]>([]);

  
  // View mode state  
  const [huntsViewMode, setHuntsViewMode] = useState<'grid' | 'compact'>('grid');

  
  // Filter and sort state
  const [huntFilter, setHuntFilter] = useState<'all' | HuntingMethod>('all');
  const [huntSort, setHuntSort] = useState<'date' | 'encounters' | 'name'>('date');

  const [searchTerm, setSearchTerm] = useState('');

  const [showStartHunt, setShowStartHunt] = useState(false);
  const handleStartNewHunt = () => setShowStartHunt(true);

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

  const [editHunt, setEditHunt] = useState<ShinyHunt | null>(null);
  const handleEditHunt = (hunt: ShinyHunt) => {
    setEditHunt(hunt);
  };

  const handleAddPhase = (hunt: ShinyHunt) => {
    setHuntForPhase(hunt);
    // new modal replaces legacy HuntModal for phase
  };

  const handleDeleteHunt = async (hunt: ShinyHunt) => {
    try {
      await shinyHuntService.pauseHunt(hunt.id);
      setCurrentHunts(prev => prev.filter(h => h.id !== hunt.id));
      setPausedHunts(prev => [{ ...hunt, paused: true }, ...prev]);
    } catch (e) {
      console.error('[shiny:pause] failed', e);
      alert('Failed to pause hunt');
    }
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

  const handleCompleteHunt = async (huntId: number, data: {
    nature?: string;
    ivs?: Partial<PokemonStats>;
    encounterCount?: number;
    notes?: string;
  }) => {
    const hunt = currentHunts.find(h => h.id === huntId);
    if (!hunt) return;
    try {
      await shinyHuntService.markFound(huntId as any);
      if (data.ivs || data.nature) {
        await shinyHuntService.updateMeta(huntId as any, { ivs: data.ivs, nature: data.nature });
      }
      if (typeof data.encounterCount === 'number') {
        await shinyHuntService.updateCounters(huntId as any, { total_encounters: data.encounterCount });
      }
      setPortfolio(prev => ([{
        id: hunt.id as any,
        pokemonId: hunt.pokemonId,
        pokemonName: hunt.pokemonName,
        method: hunt.method as any,
        dateFound: new Date().toISOString(),
        nature: data.nature,
        encounterCount: data.encounterCount || hunt.totalEncounters,
        ivs: data.ivs,
        notes: data.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }] as any).concat(prev));
      setCurrentHunts(prev => prev.filter(h => h.id !== huntId));
      setShowCompletionModal(false);
      setCompletingHunt(null);
    } catch (e) {
      console.error('[shiny:markFound] failed', e);
    }
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



  // Load hunts from Supabase (active & completed separated)
  useEffect(() => {
    if (initializing || !user) return;
    let cleanupInsert: (() => void) | undefined;
    let cleanupUpdate: (() => void) | undefined;
    (async () => {
      try {
        const [active, completed, paused] = await Promise.all([
          shinyHuntService.listActive(),
          shinyHuntService.listCompleted(),
          shinyHuntService.listPaused().catch(() => []),
        ]);
        setCurrentHunts(active.map((r) => ({
          id: r.id,
          pokemonId: r.pokemon_id,
          pokemonName: r.pokemon_name,
          method: r.method as any,
          startDate: (r.start_date || r.created_at) as string,
          phaseCount: r.phase_count,
          totalEncounters: r.total_encounters,
          isCompleted: r.is_completed,
          region: (r as any).region,
          area: (r as any).area,
          location: (r as any).location,
          rarity: (r as any).rarity,
          phasePokemon: [],
          createdAt: r.created_at,
          updatedAt: r.created_at,
        })));
        setPortfolio(completed.map((r: any) => ({
          id: r.id,
          pokemonId: r.pokemon_id,
          pokemonName: r.pokemon_name,
          method: r.method as any,
          dateFound: (r.found_at || r.start_date || r.created_at) as string,
          nature: r.meta?.nature,
          encounterCount: r.total_encounters,
          ivs: r.meta?.ivs,
          createdAt: r.created_at,
          updatedAt: r.created_at,
          is_phase: r.is_phase,
        })) as any);
        setPausedHunts(paused.map((r: any) => ({
          id: r.id,
          pokemonId: r.pokemon_id,
          pokemonName: r.pokemon_name,
          method: r.method as any,
          startDate: (r.start_date || r.created_at) as string,
          phaseCount: r.phase_count,
          totalEncounters: r.total_encounters,
          isCompleted: r.is_completed,
          region: (r as any).region,
          area: (r as any).area,
          location: (r as any).location,
          rarity: (r as any).rarity,
          phasePokemon: [],
          createdAt: r.created_at,
          updatedAt: r.created_at,
          paused: true,
        })) as any);
      } catch (err: any) {
        console.error('[shiny:list] error', err);
      }
      cleanupInsert = shinyHuntService.subscribe(String(user.id), (row) => {
        if (row.is_completed) {
          setPortfolio((prev) => ([{
            id: row.id,
            pokemonId: row.pokemon_id,
            pokemonName: row.pokemon_name,
            method: row.method as any,
            dateFound: (row.found_at || row.start_date || row.created_at) as string,
            nature: (row as any).meta?.nature,
            encounterCount: row.total_encounters,
            ivs: (row as any).meta?.ivs,
            createdAt: row.created_at,
            updatedAt: row.created_at,
            is_phase: (row as any).is_phase,
          }] as any).concat(prev));
        } else {
          if ((row as any).is_paused) {
            setPausedHunts((prev) => ([{
              id: row.id,
              pokemonId: row.pokemon_id,
              pokemonName: row.pokemon_name,
              method: row.method as any,
              startDate: (row.start_date || row.created_at) as string,
              phaseCount: row.phase_count,
              totalEncounters: row.total_encounters,
              isCompleted: row.is_completed,
              phasePokemon: [],
              createdAt: row.created_at,
              updatedAt: row.created_at,
              paused: true,
            }] as any).concat(prev));
          } else {
            setCurrentHunts((prev) => ([{
              id: row.id,
              pokemonId: row.pokemon_id,
              pokemonName: row.pokemon_name,
              method: row.method as any,
              startDate: (row.start_date || row.created_at) as string,
              phaseCount: row.phase_count,
              totalEncounters: row.total_encounters,
              isCompleted: row.is_completed,
              phasePokemon: [],
              createdAt: row.created_at,
              updatedAt: row.created_at,
            }] as any).concat(prev));
          }
        }
      });
      // Listen for updates to counters and phases to update UI live
      cleanupUpdate = shinyHuntService.subscribeUpdates(String(user.id), (row) => {
        const isPaused = (row as any).is_paused === true;
        if (isPaused) {
          setCurrentHunts((prev) => prev.filter((h) => h.id !== row.id));
          setPausedHunts((prev) => {
            const exists = prev.some((h) => h.id === row.id);
            if (exists) {
              return prev.map((h) => h.id === row.id ? { ...h, paused: true } : h);
            }
            return ([{
              id: row.id,
              pokemonId: row.pokemon_id,
              pokemonName: row.pokemon_name,
              method: row.method as any,
              startDate: (row.start_date || row.created_at) as string,
              phaseCount: row.phase_count,
              totalEncounters: row.total_encounters,
              isCompleted: row.is_completed,
              phasePokemon: [],
              createdAt: row.created_at,
              updatedAt: row.created_at,
              paused: true,
            }] as any).concat(prev);
          });
        } else {
          // Update counters live
          setCurrentHunts((prev) => prev.map((h) => (
            h.id === row.id
              ? {
                  ...h,
                  phaseCount: row.phase_count,
                  totalEncounters: row.total_encounters,
                  updatedAt: row.created_at,
                }
              : h
          )));
        }
      });
    })();
    return () => {
      cleanupInsert && cleanupInsert();
      cleanupUpdate && cleanupUpdate();
    };
  }, [initializing, user]);

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
          marginBottom: '13px', // slightly reduced gap below the bar
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
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          height: '50px',
          letterSpacing: '0.5px',
          transform: 'translateY(0px)',
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
          top: '350px', // Reduced by ~30px to tighten gap below utility bar
          left: 0,
          right: 0,
          height: 'calc(100vh - 350px)', // Match reduced top offset
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2>🎯 Current Hunts</h2>
              <button
                onClick={async () => {
                  try {
                    const paused = await shinyHuntService.listPaused();
                    setPausedHunts(paused.map((r) => ({
                      id: r.id,
                      pokemonId: r.pokemon_id,
                      pokemonName: r.pokemon_name,
                      method: r.method as any,
                      startDate: (r.start_date || r.created_at) as string,
                      phaseCount: r.phase_count,
                      totalEncounters: r.total_encounters,
                      isCompleted: r.is_completed,
                      phasePokemon: [],
                      createdAt: r.created_at,
                      updatedAt: r.created_at,
                      paused: true,
                    })) as any);
                    setShowPausedModal(true);
                  } catch (e) {
                    console.error('[paused:list] error', e);
                  }
                }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  backgroundColor: 'rgba(255, 215, 0, 0.15)', border: '1px solid rgba(255, 215, 0, 0.5)',
                  color: '#ffd700', padding: '6px 10px', borderRadius: 8, cursor: 'pointer'
                }}
                title="Paused Hunts"
              >
                ⏸️ Paused Hunts
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>View:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.8rem', color: '#ccc', minWidth: 70, textAlign: 'right' }}>
                  {huntsViewMode === 'grid' ? 'Grid' : 'Compact'}
                </span>
                <label style={{ position: 'relative', display: 'inline-block', width: 46, height: 24 }}>
                  <input
                    type="checkbox"
                    checked={huntsViewMode === 'compact'}
                    onChange={() => setHuntsViewMode(huntsViewMode === 'grid' ? 'compact' : 'grid')}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: 'rgba(255, 215, 0, 0.25)', border: '1px solid #ffd700', borderRadius: 999,
                      transition: '0.2s'
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute', height: 18, width: 18, left: huntsViewMode === 'compact' ? 26 : 4, bottom: 3,
                      backgroundColor: '#ffd700', borderRadius: '50%', transition: '0.2s'
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
          {filteredHunts.length === 0 ? (
            <div className="empty-hunts">
              <p>{searchTerm || huntFilter !== 'all' ? 'No hunts match your filters.' : 'No active hunts. Click "Start New Hunt" to begin!'}</p>
            </div>
          ) : (
            <>
              <div
                className={huntsViewMode === 'grid' ? 'hunts-grid' : 'hunts-compact'}
                style={huntsViewMode === 'grid' ? {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '14px',
                } : {}}
              >
                {filteredHunts.slice(0, displayHuntsLimit).map(hunt => (
                  <ShinyHuntCard
                    key={hunt.id}
                    hunt={hunt}
                    onEdit={handleEditHunt}
                    onAddPhase={handleAddPhase}
                    onMarkFound={handleMarkFound}
                    onUpdateNotes={handleUpdateNotes}
                    viewMode={huntsViewMode}
                    onDelete={handleDeleteHunt}
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
          
          <ShinyCalendar portfolio={portfolio} onEdit={(row) => setEditingShiny(row)} />
        </section>
      </main>

      {/* Start Hunt Modal (Supabase-backed, PVP modal pattern) */}
      {showPausedModal && (
        <div
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowPausedModal(false); }}
        >
          <div style={{ background: 'rgba(0,0,0,0.95)', border: '2px solid #ffcb05', borderRadius: 12, padding: 16, width: '100%', maxWidth: 720, color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ margin: 0, color: '#ffd700' }}>⏸️ Paused Hunts</h3>
              <button type="button" onClick={() => setShowPausedModal(false)} style={{ background: 'transparent', color: '#ffd700', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>×</button>
            </div>
            {pausedHunts.length === 0 ? (
              <div style={{ color: '#bbb' }}>No paused hunts.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 8 }}>
                {pausedHunts.map((h) => (
                  <React.Fragment key={h.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontWeight: 800 }}>{h.pokemonName}</span>
                      <span style={{ color: '#ccc', fontSize: '0.9rem' }}>
                        • {new Date(h.startDate).toLocaleDateString()} • {h.method}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={async () => {
                          try {
                            await shinyHuntService.resumeHunt(h.id);
                            // optimistic UI
                            setPausedHunts((prev) => prev.filter((ph) => ph.id !== h.id));
                            setCurrentHunts((prev) => [{ ...h, paused: false }, ...prev]);
                          } catch (e) {
                            console.error('[paused:resume] error', e);
                            alert('Failed to resume hunt');
                          }
                        }}
                        style={{ backgroundColor: 'rgba(255, 215, 0, 0.2)', color: '#ffd700', border: '1px solid #ffd700', padding: '6px 10px', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}
                      >
                        ▶️ Resume
                      </button>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Start Hunt Modal (Supabase-backed, PVP modal pattern) */}
      <StartHuntModal
        isOpen={showStartHunt}
        onClose={() => setShowStartHunt(false)}
        onCreated={async () => {
          try {
            const fetched = await shinyHuntService.listActive();
            setCurrentHunts((prev) => {
              const map = new Map(prev.map((r) => [r.id, r]));
              for (const r of fetched) {
                const existing = map.get(r.id);
                const merged = {
                  id: r.id,
                  pokemonId: r.pokemon_id,
                  pokemonName: r.pokemon_name,
                  method: r.method as any,
                  startDate: (r.start_date || r.created_at) as string,
                  phaseCount: r.phase_count,
                  totalEncounters: r.total_encounters,
                  isCompleted: r.is_completed,
                  region: (r as any).region,
                  area: (r as any).area,
                  location: (r as any).location,
                  rarity: (r as any).rarity,
                  phasePokemon: existing?.phasePokemon || [],
                  createdAt: r.created_at,
                  updatedAt: r.created_at,
                } as ShinyHunt;
                map.set(r.id, merged);
              }
              const mergedArr = Array.from(map.values()).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
              if (import.meta?.env?.DEV) console.debug('[merge] active count', mergedArr.length, 'first ids', mergedArr.slice(0, 5).map(x => x.id));
              return mergedArr;
            });
          } catch (e) {
            console.error('[shiny:list] error after create', e);
          }
        }}
      />

      {/* Edit Hunt Modal (reuse StartHuntModal in edit mode) */}
      <StartHuntModal
        isOpen={!!editHunt}
        onClose={() => setEditHunt(null)}
        mode="edit"
        initial={editHunt ? {
          id: editHunt.id,
          species: { id: editHunt.pokemonId, name: editHunt.pokemonName },
          method: editHunt.method as any,
          location: editHunt.region || editHunt.area ? {
            label: `${(editHunt.region || 'Unknown Region')} — ${editHunt.area ? String(editHunt.area).toUpperCase() : 'UNKNOWN AREA'}`,
            value: JSON.stringify({ region: editHunt.region ?? null, area: editHunt.area ?? null }),
            region: editHunt.region ?? null,
            area: editHunt.area ?? null,
            method: editHunt.method as any,
            rarity: editHunt.rarity ?? null,
          } : null,
          startDate: editHunt.startDate,
          notes: editHunt.notes,
        } : undefined}
        onUpdated={async () => {
          const active = await shinyHuntService.listActive();
          setCurrentHunts(active.map((r) => ({
            id: r.id,
            pokemonId: r.pokemon_id,
            pokemonName: r.pokemon_name,
            method: r.method as any,
            startDate: (r.start_date || r.created_at) as string,
            phaseCount: r.phase_count,
            totalEncounters: r.total_encounters,
            isCompleted: r.is_completed,
            region: (r as any).region,
            area: (r as any).area,
            location: (r as any).location,
            rarity: (r as any).rarity,
            phasePokemon: [],
            createdAt: r.created_at,
            updatedAt: r.created_at,
          })));
          const paused = await shinyHuntService.listPaused();
          setPausedHunts(paused.map((r) => ({
            id: r.id,
            pokemonId: r.pokemon_id,
            pokemonName: r.pokemon_name,
            method: r.method as any,
            startDate: (r.start_date || r.created_at) as string,
            phaseCount: r.phase_count,
            totalEncounters: r.total_encounters,
            isCompleted: r.is_completed,
            region: (r as any).region,
            area: (r as any).area,
            location: (r as any).location,
            rarity: (r as any).rarity,
            phasePokemon: [],
            createdAt: r.created_at,
            updatedAt: r.created_at,
            paused: true,
          })));
        }}
      />

      {/* Add Phase Modal (Supabase-backed) */}
      <AddPhaseModal
        isOpen={!!huntForPhase}
        onClose={() => setHuntForPhase(null)}
        parentHunt={huntForPhase as any || { id: 0, pokemonId: 0, pokemonName: '', method: '', region: null, area: null }}
        onAdded={async ({ parentId, addedEncounters }) => {
          // Optimistic update for current hunts list
          setCurrentHunts((prev) => prev.map((h) => (
            h.id === parentId
              ? { ...h, totalEncounters: h.totalEncounters + addedEncounters, phaseCount: h.phaseCount + 1 }
              : h
          )));

          // Refresh completed list to include the new phase in portfolio
          const completed = await shinyHuntService.listCompleted();
          setPortfolio(completed.map((r: any) => ({
            id: r.id,
            pokemonId: r.pokemon_id,
            pokemonName: r.pokemon_name,
            method: r.method as any,
            dateFound: (r.found_at || r.start_date || r.created_at) as string,
            nature: r.meta?.nature,
            encounterCount: r.total_encounters,
            ivs: r.meta?.ivs,
            createdAt: r.created_at,
            updatedAt: r.created_at,
          })) as any);
        }}
      />

      {/* Completion Modal */}
      <CompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        hunt={completingHunt}
        onCompleteHunt={handleCompleteHunt}
      />

      {/* Edit Shiny Modal */}
      <EditShinyModal
        isOpen={!!editingShiny}
        onClose={() => setEditingShiny(null)}
        initial={{
          id: editingShiny?.id || 0,
          phase_count: 0,
          total_encounters: editingShiny?.encounterCount || 0,
          meta: { ivs: editingShiny?.ivs, nature: (editingShiny as any)?.nature },
          pokemonName: editingShiny?.pokemonName || ''
        }}
        onSave={async ({ id, phase_count, total_encounters, meta }) => {
          await shinyHuntService.updateCounters(id, { phase_count, total_encounters });
          await shinyHuntService.updateMeta(id, meta);
          // Refresh completed list
          const completed = await shinyHuntService.listCompleted();
          setPortfolio(completed.map((r: any) => ({
            id: r.id,
            pokemonId: r.pokemon_id,
            pokemonName: r.pokemon_name,
            method: r.method as any,
            dateFound: (r.found_at || r.start_date || r.created_at) as string,
            nature: r.meta?.nature,
            encounterCount: r.total_encounters,
            ivs: r.meta?.ivs,
            createdAt: r.created_at,
            updatedAt: r.created_at,
          })) as any);
        }}
      />
      </div>
    </>
  );
}
