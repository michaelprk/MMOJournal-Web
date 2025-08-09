import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../services/supabase';
import { getSpeciesList, getMethodsForSpecies, getValidLocations, validateEncounter } from '../../lib/pokedex';

type SpeciesOption = { id: number; name: string };
type LocationOption = { label: string; value: string; region: string | null; area: string | null; method: string; rarity: string | null };

interface StartHuntModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (hunt: {
    pokemonId: number;
    pokemonName: string;
    method: string;
    startDate: string;
    notes?: string;
  }) => void;
  mode?: 'create' | 'edit';
  initial?: {
    species?: SpeciesOption;
    method?: string;
    location?: LocationOption | null;
    startDate?: string;
    notes?: string;
  };
}

export function StartHuntModal({ isOpen, onClose, onCreated, mode = 'create', initial }: StartHuntModalProps) {
  const [mounted, setMounted] = useState(false);
  const [speciesQuery, setSpeciesQuery] = useState('');
  const [species, setSpecies] = useState<SpeciesOption | null>(null);
  const [method, setMethod] = useState<string>('');
  const [locationQuery, setLocationQuery] = useState('');
  const [location, setLocation] = useState<LocationOption | null>(null);
  const [startDate, setStartDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [invalidCombo, setInvalidCombo] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isOpen) {
      setSpeciesQuery('');
      setSpecies(null);
      setMethod('');
      setLocationQuery('');
      setLocation(null);
      setStartDate(new Date().toISOString().slice(0, 10));
      setNotes('');
      setInvalidCombo(false);
      return;
    }
    // Prefill in edit mode
    if (mode === 'edit') {
      if (initial?.species) setSpecies(initial.species);
      if (initial?.method) setMethod(initial.method);
      if (initial?.location) {
        setLocation(initial.location);
        setLocationQuery(initial.location.label);
      }
      setStartDate(initial?.startDate || new Date().toISOString().slice(0, 10));
      setNotes(initial?.notes || '');
    }
  }, [isOpen, mode, initial]);

  const allSpecies = useMemo(() => getSpeciesList(), []);
  const filteredSpecies = useMemo(() => {
    const q = speciesQuery.trim().toLowerCase();
    if (!q) return allSpecies.slice(0, 20);
    return allSpecies.filter((s) => s.name.toLowerCase().includes(q) || String(s.id).includes(q)).slice(0, 20);
  }, [speciesQuery, allSpecies]);

  const methodOptions = useMemo(() => (species ? getMethodsForSpecies(species.id) : []), [species]);
  const allLocations = useMemo(() => (species ? getValidLocations(species.id) : []), [species]);
  const filteredLocations = useMemo(() => {
    const q = locationQuery.trim().toLowerCase();
    if (!q) return allLocations.slice(0, 30);
    return allLocations.filter((l) => l.label.toLowerCase().includes(q)).slice(0, 30);
  }, [locationQuery, allLocations]);

  useEffect(() => {
    if (!species || !method || !location) {
      setInvalidCombo(false);
      return;
    }
    const valueObj = safeParse<LocationOption['value']>(location.value);
    const parsed = valueObj ? (JSON.parse(location.value) as { region: string | null; area: string | null }) : { region: location.region, area: location.area };
    const ok = validateEncounter(species.id, { method, region: parsed.region, area: parsed.area });
    setInvalidCombo(!ok);
  }, [species, method, location]);

  const canSubmit = mode === 'edit' ? !submitting && !!species : (!!species && !!method && !!location && !invalidCombo && !submitting);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleSubmit = async () => {
    if (!canSubmit || !species) return;
    setSubmitting(true);
    try {
      if (mode === 'edit') {
        // For now, just close; future: update row in DB
        onClose();
        return;
      }
      if (!location) return;
      const parsed = JSON.parse(location.value) as { region: string | null; area: string | null };
      const insert: Record<string, any> = {
        pokemon_id: species.id,
        pokemon_name: species.name,
        method,
        start_date: startDate,
        phase_count: 1,
        total_encounters: 0,
        is_completed: false,
        notes: notes || null,
      };
      // Optional fields (uncomment if present)
      // insert.region = parsed.region;
      // insert.area = parsed.area;
      // insert.location = parsed.area;
      // insert.rarity = location.rarity;
      // insert.status = 'active';

      const { error } = await supabase.from('shiny_hunts').insert([insert]);
      if (error) throw error;
      onCreated?.({ pokemonId: species.id, pokemonName: species.name, method, startDate, notes });
      onClose();
    } catch (err) {
      console.error('Failed to create shiny hunt:', err);
      alert('Failed to start hunt. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
      onClick={handleOverlayClick}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          border: '2px solid #ffcb05',
          borderRadius: '12px',
          padding: '1.5rem',
          width: '100%',
          maxWidth: 700,
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          zIndex: 10000,
        }}
      >
        <h2 style={{ color: '#ffcb05', marginTop: 0, marginBottom: '1rem' }}>{mode === 'edit' ? '✏️ Edit Hunt' : '✨ Start New Hunt'}</h2>

        {/* Species */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: '#ffcb05', marginBottom: 6 }}>Species</label>
          <input
            type="text"
            placeholder={species ? `${species.name} (#${String(species.id).padStart(3, '0')})` : 'Search species by name or ID...'}
            value={speciesQuery}
            onChange={(e) => setSpeciesQuery(e.target.value)}
            disabled={mode === 'edit'}
            style={{
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid #ffcb05',
              borderRadius: 8,
              color: '#fff',
              padding: '10px 12px',
            }}
          />
          {speciesQuery && mode !== 'edit' && (
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.95)',
              border: '1px solid rgba(255,203,5,0.3)',
              borderRadius: 8,
              marginTop: 6,
              maxHeight: 200,
              overflowY: 'auto',
            }}>
              {filteredSpecies.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setSpecies(s);
                    setSpeciesQuery('');
                    setMethod('');
                    setLocation(null);
                  }}
                  style={{ padding: '8px 10px', cursor: 'pointer', color: '#fff' }}
                >
                  #{String(s.id).padStart(3, '0')} {s.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Method */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: '#ffcb05', marginBottom: 6 }}>Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            disabled={mode === 'edit' || !species || methodOptions.length === 0}
            style={{
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid #ffcb05',
              borderRadius: 8,
              color: '#fff',
              padding: '10px 12px',
            }}
          >
            <option value="" disabled>
              {species ? (methodOptions.length ? 'Select method' : 'No methods available') : 'Pick a species first'}
            </option>
            {methodOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', color: '#ffcb05', marginBottom: 6 }}>Location</label>
          <input
            type="text"
            placeholder={species ? 'Search location...' : 'Pick a species first'}
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            disabled={mode === 'edit' || !species}
            style={{
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid #ffcb05',
              borderRadius: 8,
              color: '#fff',
              padding: '10px 12px',
              marginBottom: 6,
            }}
          />
          {species && locationQuery && mode !== 'edit' && (
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.95)',
              border: '1px solid rgba(255,203,5,0.3)',
              borderRadius: 8,
              maxHeight: 220,
              overflowY: 'auto',
            }}>
              {filteredLocations.map((opt) => (
                <div
                  key={`${opt.region}|${opt.area}|${opt.method}|${opt.rarity}`}
                  onClick={() => {
                    setLocation(opt);
                    setLocationQuery(opt.label);
                  }}
                  style={{ padding: '8px 10px', cursor: 'pointer', color: '#fff' }}
                >
                  {opt.label} {opt.rarity ? `· ${opt.rarity}` : ''}
                </div>
              ))}
            </div>
          )}
        </div>
        {species && method && location && invalidCombo && (
          <div style={{ color: '#ff6b6b', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
            This method/location isn’t valid for this species
          </div>
        )}

        {/* Start date */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: '#ffcb05', marginBottom: 6 }}>Start date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid #ffcb05',
              borderRadius: 8,
              color: '#fff',
              padding: '10px 12px',
            }}
          />
        </div>

        {/* Notes */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: '#ffcb05', marginBottom: 6 }}>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid #ffcb05',
              borderRadius: 8,
              color: '#fff',
              padding: '10px 12px',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(220, 53, 69, 0.2)',
              border: '2px solid #dc3545',
              color: '#dc3545',
              padding: '10px 16px',
              borderRadius: 8,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              backgroundColor: canSubmit ? '#ffcb05' : 'rgba(255,203,5,0.3)',
              color: canSubmit ? '#000' : '#666',
              border: 'none',
              padding: '10px 16px',
              borderRadius: 8,
              fontWeight: 700,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
            }}
          >
            {submitting ? (mode === 'edit' ? 'Saving…' : 'Starting…') : (mode === 'edit' ? 'Save' : 'Start Hunt')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function safeParse<T = unknown>(_value: string): T | null {
  try {
    return JSON.parse(_value) as T;
  } catch {
    return null;
  }
}


