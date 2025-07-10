import React, { useState } from 'react';
import type { ShinyHunt, ShinyPortfolio, PokemonStats } from '../../types/pokemon';
import ShinyUtilityBar from '../../components/ShinyUtilityBar';
import ShinyHuntCard from '../../components/ShinyHuntCard';
import ShinyPortfolioSection from '../../components/ShinyPortfolioSection';
import ShinyPlayArea from '../../components/ShinyPlayArea';
import HuntModal from '../../components/HuntModal';

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
    }
  ]);

  const [showHuntModal, setShowHuntModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [huntModalMode, setHuntModalMode] = useState<'create' | 'phase'>('create');
  const [huntForPhase, setHuntForPhase] = useState<ShinyHunt | null>(null);
  const [completingHunt, setCompletingHunt] = useState<ShinyHunt | null>(null);

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

  return (
    <div
      style={{
        position: 'fixed',
        top: '220px', // Start below the navbar
        left: 0,
        right: 0,
        height: 'calc(100vh - 220px)', // Take remaining viewport height
        backgroundColor: 'transparent',
        overflowY: 'auto', // Allow scrolling within this container
        overflowX: 'hidden',
      }}
    >
      {/* Sticky Header */}
      <div className="sticky-header">
        <h1>✨ Shiny Hunt Tracker ✨</h1>
      </div>

      {/* Utility Bar */}
      <ShinyUtilityBar
        currentHunts={currentHunts}
        portfolio={portfolio}
        onStartNewHunt={handleStartNewHunt}
      />

      <main style={{ 
        maxWidth: '1400px',
        margin: '0 auto',
        padding: "2rem", 
        minHeight: "100%" 
      }}>
        {/* Current Hunts Section */}
        <section className="current-hunts-section">
          <h2>🎯 Current Hunts</h2>
          {currentHunts.length === 0 ? (
            <div className="empty-hunts">
              <p>No active hunts. Click "Start New Hunt" to begin!</p>
            </div>
          ) : (
            <div className="hunts-grid">
              {currentHunts.map(hunt => (
                <ShinyHuntCard
                  key={hunt.id}
                  hunt={hunt}
                  onEdit={handleEditHunt}
                  onAddPhase={handleAddPhase}
                  onMarkFound={handleMarkFound}
                  onUpdateNotes={handleUpdateNotes}
                />
              ))}
            </div>
          )}
        </section>

        {/* Portfolio Section */}
        <ShinyPortfolioSection
          portfolio={portfolio}
          showCompletionModal={showCompletionModal}
          completingHunt={completingHunt}
          onCompleteHunt={handleCompleteHunt}
          onCloseModal={() => {
            setShowCompletionModal(false);
            setCompletingHunt(null);
          }}
        />

        {/* Shiny Play Area */}
        <ShinyPlayArea portfolio={portfolio} />
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
    </div>
  );
}
