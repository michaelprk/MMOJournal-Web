import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../services/supabase';
import { shinyHuntService } from '../../services/shinyHuntService';
import { getSpeciesList, getMethodsForSpecies, getValidLocations, validateEncounter, getDedupedLocationsForSpecies, isMethodValidForLocation, canonicalizeMethod } from '../../lib/pokedex';

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
    id?: number;
    species?: SpeciesOption;
    method?: string;
    location?: LocationOption | null;
    startDate?: string;
    notes?: string;
  };
  onUpdated?: () => void;
}

export function StartHuntModal({ isOpen, onClose, onCreated, mode = 'create', initial, onUpdated }: StartHuntModalProps) {
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [methodOpen, setMethodOpen] = useState(false);
  const [methodActiveIdx, setMethodActiveIdx] = useState<number>(-1);

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

  // Display labels → canonical method mapping
  const METHOD_LABELS: Array<{ label: string; key: ReturnType<typeof canonicalizeMethod> }> = [
    { label: '5x Horde', key: 'horde' },
    { label: '3x Horde', key: 'horde' },
    { label: 'Singles / Lures', key: 'single_lures' },
    { label: 'Fishing', key: 'fishing' },
    { label: 'Egg Hunt', key: 'egg' },
    { label: 'Alpha Egg Hunt', key: 'alpha_egg' },
    { label: 'Fossil', key: 'fossil' },
  ];
  const METHOD_OPTIONS = METHOD_LABELS.map((m) => m.label);
  const methodOptions = METHOD_OPTIONS;
  const allLocations = useMemo(() => {
    if (!species) return [] as LocationOption[];
    // Show location options that match the selected method constraints
    const raw = getValidLocations(species.id);
    const canon = canonicalizeMethod(method);
    const filtered = raw.filter((l) => {
      switch (canon) {
        case 'horde':
          return (l.method || '').toLowerCase().includes('horde') || (l.rarity || '').toLowerCase() === 'horde';
        case 'single_lures':
          return ['very common','common','uncommon','rare','very rare','lure'].includes((l.rarity || '').toLowerCase());
        case 'fishing':
          // rod types, or water+rarity=lure
          const typeLower = (l.method || '').toLowerCase();
          const rarityLower = (l.rarity || '').toLowerCase();
          const isRod = typeLower.includes('rod') || typeLower.includes('fishing');
          const isWaterLure = (typeLower.includes('water') || typeLower.includes('surf')) && rarityLower === 'lure';
          return isRod || isWaterLure;
        case 'safari':
          return (l.method || '').toLowerCase().includes('safari');
        case 'egg':
        case 'alpha_egg':
          return false; // no locations for eggs
        case 'fossil':
          return (l.method || '').toLowerCase().includes('fossil');
        default:
          return true;
      }
    });
    // De-dup by (region, area)
    const dedupe = new Set<string>();
    const deduped: LocationOption[] = [];
    for (const l of filtered) {
      const key = `${l.region ?? ''}|${l.area ?? ''}`;
      if (dedupe.has(key)) continue;
      dedupe.add(key);
      deduped.push({
        label: l.label,
        value: l.value,
        region: l.region,
        area: l.area,
        method: l.method,
        rarity: l.rarity,
      });
    }
    return deduped;
  }, [species, method]);
  const filteredLocations = useMemo(() => {
    const q = locationQuery.trim().toLowerCase();
    if (!q) return allLocations.slice(0, 30);
    return allLocations.filter((l) => l.label.toLowerCase().includes(q)).slice(0, 30);
  }, [locationQuery, allLocations]);

  // When method changes in create mode, clear any previously selected location to avoid invalid combos
  useEffect(() => {
    if (mode !== 'edit') {
      setLocation(null);
      setLocationQuery('');
      setInvalidCombo(false);
    }
  }, [method, mode]);

  useEffect(() => {
    if (!species || !method || !location) {
      setInvalidCombo(false);
      return;
    }
    const valueObj = safeParse<LocationOption['value']>(location.value);
    const parsed = valueObj ? (JSON.parse(location.value) as { region: string | null; area: string | null }) : { region: location.region, area: location.area };
    // Canonicalize for validation (the validator will translate again internally)
    const ok = isMethodValidForLocation(species.id, parsed.region ?? null, parsed.area ?? null, method);
    setInvalidCombo(!ok);
  }, [species, method, location]);

  // Eggs skip location entirely
  const canonMethod = canonicalizeMethod(method);
  const requiresLocation = !(canonMethod === 'egg' || canonMethod === 'alpha_egg');
  const canSubmit = mode === 'edit'
    ? !submitting && !!species
    : (!!species && !!method && (!requiresLocation || !!location) && !invalidCombo && !submitting);

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
      // Duplicate prevention: check existing open (active or paused) hunts for same species/method/location
      const canon = canonicalizeMethod(method);
      const [activeRows, pausedRows] = await Promise.all([
        shinyHuntService.listActive(),
        shinyHuntService.listPaused().catch(() => []),
      ]);
      const allOpen = (activeRows as any[]).concat(pausedRows as any[]).filter((r) => r && (r as any).is_phase !== true);
      const parsedLocDup = location ? (safeParse<{ region: string | null; area: string | null }>(location.value) || { region: location.region, area: location.area }) : { region: null, area: null };
      const isDup = allOpen.some((r: any) => {
        const sameSpecies = r.pokemon_id === species.id;
        const sameMethod = canonicalizeMethod(r.method) === canon;
        const sameLoc = (requiresLocation
          ? (r.region ?? null) === (parsedLocDup.region ?? null) && (r.area ?? null) === (parsedLocDup.area ?? null)
          : true);
        return sameSpecies && sameMethod && sameLoc;
      });
      if (isDup) {
        setSubmitting(false);
        setErrorMsg(`You already have a hunt for ${species.name} via ${method}${requiresLocation && location ? ` at ${location.label}` : ''}. Resume or edit that hunt instead.`);
        return;
      }
      if (mode === 'edit') {
        const parsed = location ? (JSON.parse(location.value) as { region: string | null; area: string | null }) : { region: null, area: null };
        await shinyHuntService.updateHunt(initial?.id as number, {
          method,
          region: parsed.region,
          area: parsed.area,
          location: parsed.area,
          rarity: location?.rarity ?? null,
          start_date: startDate,
          notes: notes || null as any,
        } as any);
        onUpdated?.();
        onClose();
        return;
      }
       const parsed = location ? (JSON.parse(location.value) as { region: string | null; area: string | null }) : { region: null, area: null };
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
       // Optional fields now stored (skip for egg hunts)
       insert.region = requiresLocation ? parsed.region : null;
       insert.area = requiresLocation ? parsed.area : null;
       insert.location = requiresLocation ? parsed.area : null;
       insert.rarity = requiresLocation ? (location?.rarity ?? null) : null;
      // insert.status = 'active';

      const { data, error } = await supabase
        .from('shiny_hunts')
        .insert([insert])
        .select('id,pokemon_id,pokemon_name,method,region,area,location,rarity,phase_count,total_encounters,is_completed,is_phase,parent_hunt_id,start_date,found_at,created_at')
        .single();
      if (error) throw error;
      // eslint-disable-next-line no-console
      if (import.meta?.env?.DEV) console.debug('[create] returned', data);
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

        {/* Method - themed headless select */}
        <div style={{ marginBottom: '1rem', position: 'relative' }}>
          <label style={{ display: 'block', color: '#ffcb05', marginBottom: 6 }}>Method</label>
          <button
            type="button"
            disabled={mode === 'edit' || !species || methodOptions.length === 0}
            aria-haspopup="listbox"
            aria-expanded={methodOpen}
            onClick={() => setMethodOpen(!methodOpen)}
            onKeyDown={(e) => {
              if (!methodOpen && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setMethodOpen(true); return; }
              if (methodOpen) {
                if (e.key === 'Escape') setMethodOpen(false);
                if (e.key === 'ArrowDown') { e.preventDefault(); setMethodActiveIdx((i) => Math.min(i + 1, methodOptions.length - 1)); }
                if (e.key === 'ArrowUp') { e.preventDefault(); setMethodActiveIdx((i) => Math.max(i - 1, 0)); }
                if (e.key === 'Enter') { e.preventDefault(); const m = methodOptions[methodActiveIdx]; if (m) { setMethod(m); setMethodOpen(false); } }
              }
            }}
            style={{
              width: '100%',
              textAlign: 'left',
              backgroundColor: 'rgba(0,0,0,0.85)',
              color: '#fff',
              border: '1px solid rgba(255,203,5,0.5)',
              borderRadius: 8,
              padding: '10px 12px',
              cursor: 'pointer'
            }}
          >
            {species ? (method || (methodOptions.length ? 'Select method' : 'No methods available')) : 'Pick a species first'}
          </button>
          {methodOpen && (
            <div
              role="listbox"
              aria-activedescendant={methodActiveIdx >= 0 ? `method-opt-${methodActiveIdx}` : undefined}
              style={{
                position: 'absolute', zIndex: 10001, width: '100%', marginTop: 6,
                backgroundColor: 'rgba(6,6,6,0.98)', color: '#fff',
                border: '1px solid #27272a', borderRadius: 8, boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
                maxHeight: 240, overflowY: 'auto'
              }}
              onMouseLeave={() => setMethodActiveIdx(-1)}
            >
              {methodOptions.map((m, idx) => {
                const active = idx === methodActiveIdx || m === method;
                return (
                  <div
                    id={`method-opt-${idx}`}
                    key={m}
                    role="option"
                    aria-selected={m === method}
                    onMouseEnter={() => setMethodActiveIdx(idx)}
                    onClick={() => { setMethod(m); setMethodOpen(false); }}
                    style={{
                      padding: '8px 10px', cursor: 'pointer',
                      backgroundColor: active ? 'rgba(255,203,5,0.2)' : 'transparent',
                      color: active ? '#fde68a' : '#fff'
                    }}
                  >
                    {m}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Location (hidden/disabled for egg hunts) */}
        <div style={{ marginBottom: '0.5rem', display: (canonMethod === 'egg' || canonMethod === 'alpha_egg') ? 'none' : 'block' }}>
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
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
        {location && (
          <div style={{ marginBottom: '1rem' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,203,5,0.5)', color: '#fff',
              borderRadius: 999, padding: '4px 10px'
            }}>
              {location.label}
              <button type="button" aria-label="Clear location" onClick={() => { setLocation(null); setLocationQuery(''); }}
                style={{ background: 'transparent', color: '#fde68a', border: 'none', cursor: 'pointer' }}>
                ×
              </button>
            </span>
          </div>
        )}
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

        {/* Error Block */}
        {errorMsg && (
          <div style={{
            background: 'rgba(127,29,29,0.3)',
            color: '#fecaca',
            border: '1px solid rgba(248,113,113,0.5)',
            borderRadius: 8,
            padding: '8px 12px',
            marginBottom: '10px'
          }}>
            {errorMsg}
          </div>
        )}

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


