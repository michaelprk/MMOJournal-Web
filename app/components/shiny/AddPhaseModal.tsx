import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { getSpeciesList, getValidLocations, getSpeciesAtLocation, getSpeciesAtLocationByMethod } from '../../lib/pokedex';
import { POKEMON_NATURES, type PokemonStats } from '../../types/pokemon';
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
  onAdded?: (result: { parentId: number; addedEncounters: number }) => void;
}

export function AddPhaseModal({ isOpen, onClose, parentHunt, onAdded }: AddPhaseModalProps) {
  const [mounted, setMounted] = useState(false);
  const [speciesQuery, setSpeciesQuery] = useState('');
  const [species, setSpecies] = useState<SpeciesOption | null>(null);
  const [speciesOpen, setSpeciesOpen] = useState(false);
  const [foundAt, setFoundAt] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [gender, setGender] = useState<'Male' | 'Female' | 'Genderless'>('Genderless');
  const [nature, setNature] = useState<string>('');
  const [ivs, setIvs] = useState<Partial<PokemonStats>>({ hp: 0, attack: 0, defense: 0, sp_attack: 0, sp_defense: 0, speed: 0 });
  const [encounters, setEncounters] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!isOpen) {
      setSpeciesQuery('');
      setSpecies(null);
      setFoundAt(new Date().toISOString().slice(0, 10));
      setGender('Genderless');
      setNature('');
      setIvs({ hp: 0, attack: 0, defense: 0, sp_attack: 0, sp_defense: 0, speed: 0 });
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
    const method = (parentHunt as any)?.method ?? '';
    return getSpeciesAtLocationByMethod(region, area, method, (parentHunt as any)?.pokemonId ?? undefined);
  }, [parentHunt]);

  const filteredSpecies = useMemo(() => {
    const q = speciesQuery.trim().toLowerCase();
    const targetId = (parentHunt as any)?.pokemonId as number | undefined;
    const base = speciesAtLockedLocation.filter((s) => (typeof targetId === 'number' ? s.id !== targetId : true));
    if (!q) return base.slice(0, 50);
    return base.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 50);
  }, [speciesQuery, speciesAtLockedLocation, parentHunt]);

  const canSubmit = !!species && typeof encounters === 'number' && encounters > 0 && !!nature;

  const validateSpeciesAtLocation = (): boolean => {
    if (!species) return false;
    // Filter valid locations for species to those matching the locked region/area
    const normalizeArea = (s: string | null | undefined) => {
      if (s == null) return null;
      return String(s).replace(/\s*\((?:NIGHT|DAY|MORNING|EVENING|AFTERNOON|DUSK|DAWN)\)\s*$/i, '').trim();
    };
    const valid = getValidLocations(species.id).some((l) => (
      l.region === lockedLocation?.region && normalizeArea(l.area) === normalizeArea(lockedLocation?.area)
    ));
    return valid;
  };

  const handleSubmit = async () => {
    setErrorMsg(null);
    if (!species) { setErrorMsg('Select a species'); return; }
    if (typeof encounters !== 'number' || encounters <= 0) { setErrorMsg('Enter a valid encounter count (> 0)'); return; }
    if (!validateSpeciesAtLocation()) { setErrorMsg('Species is not available at the selected location'); return; }
    // IV sanity check 0-31
    const stats: (keyof PokemonStats)[] = ['hp','attack','defense','sp_attack','sp_defense','speed'];
    for (const k of stats) {
      const v = Number(ivs[k] ?? 0);
      if (Number.isNaN(v) || v < 0 || v > 31) { setErrorMsg('IVs must be between 0 and 31'); return; }
    }
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
        found_at: new Date(foundAt).toISOString(),
        total_encounters: encounters,
        meta: { gender, nature, ivs }
      } as any);

      // Update parent hunt counters: increment phase and total encounters
      const parentTotal = Number((parentHunt as any)?.totalEncounters || 0);
      const parentPhase = Number((parentHunt as any)?.phaseCount || 1);
      await shinyHuntService.updateCounters(parentHunt.id, {
        total_encounters: parentTotal + (encounters as number),
        phase_count: parentPhase + 1,
      });
      onAdded?.({ parentId: parentHunt.id, addedEncounters: encounters as number });
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
            placeholder={species ? species.name : 'Search species...'}
            value={speciesQuery}
            onChange={(e) => setSpeciesQuery(e.target.value)}
            onFocus={() => setSpeciesOpen(true)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,203,5,0.5)', borderRadius: 8, color: '#fff', padding: '8px 10px', marginBottom: 8 }}
          />
          {speciesOpen && (
            <div style={{ maxHeight: 180, overflowY: 'auto', border: '1px solid rgba(255,203,5,0.3)', borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.95)' }} onMouseLeave={() => setSpeciesOpen(false)}>
              {filteredSpecies.length === 0 && (
                <div style={{ padding: '8px 10px', color: '#bbb' }}>No species available at this location</div>
              )}
              {filteredSpecies.map((s) => (
                <div key={s.id}
                  onClick={() => { setSpecies(s); setSpeciesOpen(false); setSpeciesQuery(''); }}
                  style={{ padding: '8px 10px', cursor: 'pointer', background: species?.id === s.id ? 'rgba(255,203,5,0.2)' : 'transparent', color: '#fff' }}
                >
                  {s.name}
                </div>
              ))}
            </div>
          )}
          {species && !validateSpeciesAtLocation() && (
            <div style={{ color: '#ff7675', marginTop: 6, fontSize: '0.85rem' }}>
              Selected species is not available at {lockedLocation?.label}
            </div>
          )}
        </div>

        {/* Gender and Nature */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value as any)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid #ffcb05', borderRadius: 8, color: '#fff', padding: '8px 10px' }}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Genderless">Genderless</option>
            </select>
          </div>
          <div>
            <label>Nature</label>
            <select value={nature} onChange={(e) => setNature(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid #ffcb05', borderRadius: 8, color: '#fff', padding: '8px 10px' }}>
              <option value="">Select Nature</option>
              {POKEMON_NATURES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {/* IVs */}
        <div style={{ marginBottom: 12 }}>
          <label>IVs</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 6 }}>
            {[
              ['hp','HP'], ['attack','Atk'], ['defense','Def'], ['sp_attack','SpA'], ['sp_defense','SpD'], ['speed','Spe']
            ].map(([key,label]) => (
              <div key={key}>
                <label style={{ fontSize: '0.8rem', color: '#ccc' }}>{label}</label>
                <input type="number" min={0} max={31}
                  value={(ivs as any)[key] ?? 0}
                  onChange={(e) => setIvs(prev => ({ ...prev, [key]: Math.max(0, Math.min(31, Number(e.target.value) || 0)) }))}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid #ffcb05', borderRadius: 8, color: '#fff', padding: '8px 10px' }} />
              </div>
            ))}
          </div>
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


