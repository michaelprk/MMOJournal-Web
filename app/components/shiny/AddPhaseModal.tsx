import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { getSpeciesList, getValidLocations, getSpeciesAtLocation } from '../../lib/pokedex';
import { shinyHuntService } from '../../services/shinyHuntService';

type SpeciesOption = { id: number; name: string };
type LocationOption = { label: string; value: string; region: string | null; area: string | null; method: string; rarity: string | null };

interface AddPhaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentHunt: {
    id: number;
    pokemonId: number;
    pokemonName: string;
    method: string;
    region?: string | null;
    area?: string | null;
    totalEncounters?: number;
    phaseCount?: number;
  };
  onAdded?: () => void;
}

export function AddPhaseModal({ isOpen, onClose, parentHunt, onAdded }: AddPhaseModalProps) {
  const [mounted, setMounted] = useState(false);
  const [speciesQuery, setSpeciesQuery] = useState('');
  const [species, setSpecies] = useState<SpeciesOption | null>(null);
  const [foundAt, setFoundAt] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [encounters, setEncounters] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!isOpen) {
      setSpeciesQuery('');
      setSpecies(null);
      setFoundAt(new Date().toISOString().slice(0, 10));
      setNotes('');
      setEncounters('');
      setErrorMsg(null);
    }
  }, [isOpen]);

  const lockedLocation: LocationOption | null = useMemo(() => {
    // Build locked location (Region — Location) from parent hunt info if present
    const region = (parentHunt as any)?.region ?? null;
    const area = (parentHunt as any)?.area ?? null;
    const label = `${region || 'Unknown Region'} — ${area ? String(area).toUpperCase() : 'UNKNOWN AREA'}`;
    return { label, value: JSON.stringify({ region, area }), region, area, method: (parentHunt as any)?.method, rarity: null };
  }, [parentHunt]);

  const speciesAtLockedLocation = useMemo(() => {
    const region = (parentHunt as any)?.region ?? null;
    const area = (parentHunt as any)?.area ?? null;
    return getSpeciesAtLocation(region, area);
  }, [parentHunt]);

  const filteredSpecies = useMemo(() => {
    const q = speciesQuery.trim().toLowerCase();
    const base = speciesAtLockedLocation;
    if (!q) return base.slice(0, 50);
    return base.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 50);
  }, [speciesQuery, speciesAtLockedLocation]);

  const canSubmit = !!species && typeof encounters === 'number' && encounters > 0;

  const validateSpeciesAtLocation = (): boolean => {
    if (!species) return false;
    // Filter valid locations for species to those matching the locked region/area
    const valid = getValidLocations(species.id).some((l) => l.region === lockedLocation?.region && l.area === lockedLocation?.area);
    return valid;
  };

  const handleSubmit = async () => {
    setErrorMsg(null);
    if (!species) { setErrorMsg('Select a species'); return; }
    if (typeof encounters !== 'number' || encounters <= 0) { setErrorMsg('Enter a valid encounter count (> 0)'); return; }
    if (!validateSpeciesAtLocation()) { setErrorMsg('Species is not available at the selected location'); return; }
    setSubmitting(true);
    try {
      await shinyHuntService.addPhase(parentHunt.id, {
        pokemon_id: species.id,
        pokemon_name: species.name,
        method: parentHunt.method,
        region: lockedLocation?.region || null,
        area: lockedLocation?.area || null,
        location: lockedLocation?.area || null,
        rarity: null,
        notes: notes || null as any,
        found_at: new Date(foundAt).toISOString(),
        total_encounters: encounters,
      } as any);

      // Update parent hunt counters: increment phase and total encounters
      const parentTotal = Number((parentHunt as any)?.totalEncounters || 0);
      const parentPhase = Number((parentHunt as any)?.phaseCount || 1);
      await shinyHuntService.updateCounters(parentHunt.id, {
        total_encounters: parentTotal + (encounters as number),
        phase_count: parentPhase + 1,
      });
      onAdded?.();
      onClose();
    } catch (e: any) {
      setErrorMsg(e?.message || 'Failed to add phase');
      // eslint-disable-next-line no-console
      console.error('[phase:add] error', e);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !mounted || typeof document === 'undefined') return null;
  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: 'rgba(0,0,0,0.95)', border: '2px solid #ffcb05', borderRadius: 12,
          padding: 16, width: '100%', maxWidth: 700, color: '#fff', position: 'relative', zIndex: 10000
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 12 }}>➕ Add Phase</h2>

        {/* Locked Location & Method */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label>Location</label>
            <input value={lockedLocation?.label || ''} readOnly
              style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid #ffcb05', borderRadius: 8, color: '#fff', padding: '8px 10px' }} />
          </div>
          <div>
            <label>Method</label>
            <input value={parentHunt.method} readOnly
              style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid #ffcb05', borderRadius: 8, color: '#fff', padding: '8px 10px' }} />
          </div>
        </div>

        {/* Species Select */}
        <div style={{ marginBottom: 12 }}>
          <label>Species</label>
          <input
            placeholder="Search species..."
            value={speciesQuery}
            onChange={(e) => setSpeciesQuery(e.target.value)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,203,5,0.5)', borderRadius: 8, color: '#fff', padding: '8px 10px', marginBottom: 8 }}
          />
          <div style={{ maxHeight: 180, overflowY: 'auto', border: '1px solid rgba(255,203,5,0.3)', borderRadius: 8 }}>
            {filteredSpecies.length === 0 && (
              <div style={{ padding: '8px 10px', color: '#bbb' }}>No species available at this location</div>
            )}
            {filteredSpecies.map((s) => (
              <div key={s.id}
                onClick={() => setSpecies(s)}
                style={{ padding: '8px 10px', cursor: 'pointer', background: species?.id === s.id ? 'rgba(255,203,5,0.2)' : 'transparent' }}
              >
                {s.name}
              </div>
            ))}
          </div>
          {species && !validateSpeciesAtLocation() && (
            <div style={{ color: '#ff7675', marginTop: 6, fontSize: '0.85rem' }}>
              Selected species is not available at {lockedLocation?.label}
            </div>
          )}
        </div>

        {/* Found date and encounters */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label>Found date</label>
            <input type="date" value={foundAt} onChange={(e) => setFoundAt(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid #ffcb05', borderRadius: 8, color: '#fff', padding: '8px 10px' }} />
          </div>
          <div>
            <label>Encounters (for this phase)</label>
            <input
              type="number"
              min={1}
              value={encounters}
              onChange={(e) => setEncounters(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 1234"
              style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid #ffcb05', borderRadius: 8, color: '#fff', padding: '8px 10px' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Notes (optional)</label>
          <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes"
            style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid #ffcb05', borderRadius: 8, color: '#fff', padding: '8px 10px' }} />
        </div>

        {errorMsg && (
          <div style={{ color: '#ff7675', marginBottom: 8 }}>{errorMsg}</div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onClose}
            style={{ backgroundColor: 'rgba(220, 53, 69, 0.2)', border: '2px solid #dc3545', color: '#dc3545', padding: '10px 16px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!canSubmit}
            style={{ backgroundColor: canSubmit ? '#ffcb05' : 'rgba(255,203,5,0.3)', color: canSubmit ? '#000' : '#666', border: 'none', padding: '10px 16px', borderRadius: 8, fontWeight: 700, cursor: canSubmit ? 'pointer' : 'not-allowed' }}>
            {submitting ? 'Saving…' : 'Add Phase'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}


