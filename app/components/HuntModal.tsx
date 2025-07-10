import React, { useState } from 'react';
import type { ShinyHunt, HuntingMethod } from '../types/pokemon';
import { HUNTING_METHODS } from '../types/pokemon';

interface HuntModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateHunt: (data: {
    pokemonId: number;
    pokemonName: string;
    method: HuntingMethod;
  }) => void;
  onAddPhase: (data: {
    huntId: number;
    pokemonId: number;
    pokemonName: string;
    encounters: number;
  }) => void;
  mode: 'create' | 'phase';
  huntForPhase?: ShinyHunt;
}

// Sample Pokemon data for Gen 1-5 (in a real app, this would come from an API)
const POKEMON_LIST = [
  { id: 1, name: 'Bulbasaur' },
  { id: 4, name: 'Charmander' },
  { id: 7, name: 'Squirtle' },
  { id: 25, name: 'Pikachu' },
  { id: 129, name: 'Magikarp' },
  { id: 130, name: 'Gyarados' },
  { id: 131, name: 'Lapras' },
  { id: 133, name: 'Eevee' },
  { id: 143, name: 'Snorlax' },
  { id: 150, name: 'Mewtwo' },
  { id: 151, name: 'Mew' },
  // Add more Pokemon as needed
];

export default function HuntModal({
  isOpen,
  onClose,
  onCreateHunt,
  onAddPhase,
  mode,
  huntForPhase
}: HuntModalProps) {
  const [selectedPokemon, setSelectedPokemon] = useState<{ id: number; name: string } | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<HuntingMethod>('Singles / Lures');
  const [encounterCount, setEncounterCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPokemon = POKEMON_LIST.filter(pokemon => 
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (!selectedPokemon) return;

    if (mode === 'create') {
      onCreateHunt({
        pokemonId: selectedPokemon.id,
        pokemonName: selectedPokemon.name,
        method: selectedMethod
      });
    } else if (mode === 'phase' && huntForPhase) {
      onAddPhase({
        huntId: huntForPhase.id,
        pokemonId: selectedPokemon.id,
        pokemonName: selectedPokemon.name,
        encounters: encounterCount
      });
    }

    // Reset form
    setSelectedPokemon(null);
    setSelectedMethod('Singles / Lures');
    setEncounterCount(0);
    setSearchTerm('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="hunt-modal-overlay">
      <div className="hunt-modal">
        <h3>
          {mode === 'create' ? '✨ Start New Hunt' : `➕ Add Phase to ${huntForPhase?.pokemonName}`}
        </h3>
        
        <div className="modal-form">
          <div className="form-group">
            <label htmlFor="pokemon-search">
              {mode === 'create' ? 'Target Pokemon:' : 'Phase Pokemon:'}
            </label>
            <input
              type="text"
              id="pokemon-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Pokemon..."
              className="pokemon-search-input"
            />
            <div className="pokemon-dropdown">
              {filteredPokemon.map(pokemon => (
                <div
                  key={pokemon.id}
                  className={`pokemon-option ${selectedPokemon?.id === pokemon.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPokemon(pokemon)}
                >
                  #{pokemon.id.toString().padStart(3, '0')} {pokemon.name}
                </div>
              ))}
            </div>
          </div>

          {mode === 'create' && (
            <div className="form-group">
              <label htmlFor="hunt-method">Hunting Method:</label>
              <select
                id="hunt-method"
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value as HuntingMethod)}
              >
                {HUNTING_METHODS.map(method => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          )}

          {mode === 'phase' && (
            <div className="form-group">
              <label htmlFor="encounter-count">Encounters in this phase:</label>
              <input
                type="number"
                id="encounter-count"
                value={encounterCount}
                onChange={(e) => setEncounterCount(parseInt(e.target.value) || 0)}
                placeholder="Number of encounters"
                min="0"
              />
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="submit-btn" 
            onClick={handleSubmit}
            disabled={!selectedPokemon}
          >
            {mode === 'create' ? 'Start Hunt' : 'Add Phase'}
          </button>
        </div>
      </div>
    </div>
  );
} 