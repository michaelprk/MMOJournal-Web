import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getShinySpritePath } from '../../types/pokemon';

const NATURES = [
  'Hardy','Lonely','Brave','Adamant','Naughty',
  'Bold','Docile','Relaxed','Impish','Lax',
  'Timid','Hasty','Serious','Jolly','Naive',
  'Modest','Mild','Quiet','Bashful','Rash',
  'Calm','Gentle','Sassy','Careful','Quirky'
];

interface EditShinyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initial: {
    id: number;
    phase_count?: number;
    total_encounters?: number;
    meta?: any;
    pokemonName: string;
    pokemonId?: number;
  };
  onSave: (data: { id: number; phase_count: number; total_encounters: number; meta: any }) => Promise<void>;
}

export function EditShinyModal({ isOpen, onClose, initial, onSave }: EditShinyModalProps) {
  const [mounted, setMounted] = useState(false);
  const [phaseCount, setPhaseCount] = useState<number>(initial.phase_count || 1);
  const [encounters, setEncounters] = useState<number>(initial.total_encounters || 0);
  const [ivs, setIvs] = useState<any>({
    hp: initial.meta?.ivs?.hp ?? 0,
    attack: (initial.meta?.ivs?.attack ?? initial.meta?.ivs?.atk) ?? 0,
    defense: (initial.meta?.ivs?.defense ?? initial.meta?.ivs?.def) ?? 0,
    sp_attack: (initial.meta?.ivs?.sp_attack ?? initial.meta?.ivs?.sp_atk) ?? 0,
    sp_defense: (initial.meta?.ivs?.sp_defense ?? initial.meta?.ivs?.sp_def) ?? 0,
    speed: (initial.meta?.ivs?.speed ?? initial.meta?.ivs?.spd) ?? 0,
  });
  const [nature, setNature] = useState<string>(initial.meta?.nature || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secret, setSecret] = useState<boolean>(!!initial.meta?.secret_shiny || !!initial.meta?.is_secret_shiny);
  const [alpha, setAlpha] = useState<boolean>(!!initial.meta?.alpha || !!initial.meta?.is_alpha);

  useEffect(() => { setMounted(true); }, []);
  // Sync when a different shiny is opened
  useEffect(() => {
    setPhaseCount(initial.phase_count || 1);
    setEncounters(initial.total_encounters || 0);
    setIvs({
      hp: initial.meta?.ivs?.hp ?? 0,
      attack: (initial.meta?.ivs?.attack ?? initial.meta?.ivs?.atk) ?? 0,
      defense: (initial.meta?.ivs?.defense ?? initial.meta?.ivs?.def) ?? 0,
      sp_attack: (initial.meta?.ivs?.sp_attack ?? initial.meta?.ivs?.sp_atk) ?? 0,
      sp_defense: (initial.meta?.ivs?.sp_defense ?? initial.meta?.ivs?.sp_def) ?? 0,
      speed: (initial.meta?.ivs?.speed ?? initial.meta?.ivs?.spd) ?? 0,
    });
    setNature(initial.meta?.nature || '');
    setSecret(!!initial.meta?.secret_shiny || !!initial.meta?.is_secret_shiny);
    setAlpha(!!initial.meta?.alpha || !!initial.meta?.is_alpha);
  }, [initial.id]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      const meta = { ...(initial.meta || {}), ivs, nature, secret_shiny: secret, alpha };
      await onSave({ id: initial.id, phase_count: phaseCount, total_encounters: encounters, meta });
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !mounted || typeof document === 'undefined') return null;
  return createPortal(
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: 'rgba(0,0,0,0.95)',
          border: '2px solid #ffcb05',
          borderRadius: 12,
          width: 'min(92vw, 560px)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh'
        }}
      >
        <div style={{ padding: 12, borderBottom: '1px solid rgba(255,203,5,0.2)' }}>
          <h2 style={{ margin: 0, textAlign: 'center' }}>✏️ Edit {initial.pokemonName}</h2>
        </div>

        <div
          style={{
            padding: 12,
            overflowY: 'auto',
            overflowX: 'hidden',
            flex: '1 1 auto'
          }}
        >
          {/* Compact header with sprite + name */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            {typeof initial.pokemonId === 'number' && (
              <img
                src={getShinySpritePath(initial.pokemonId, initial.pokemonName)}
                alt={`Shiny ${initial.pokemonName}`}
                style={{ width: 72, height: 72, filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.4))' }}
              />
            )}
            <div style={{ fontWeight: 800, color: '#fff', textAlign: 'center' }}>{initial.pokemonName}</div>
          </div>

          <div style={{ marginBottom: 12, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
            <label style={{ display: 'block', textAlign: 'center', marginBottom: 6 }}>Nature</label>
            <select value={nature} onChange={(e) => setNature(e.target.value)}
              style={{ width: '100%', background: 'rgba(0,0,0,0.85)', color: '#fff', border: '1px solid rgba(255,203,5,0.5)', borderRadius: 8, padding: '8px 10px' }}>
              <option value="">Select nature</option>
              {NATURES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {/* Secret / Alpha flags (respect method rules outside this modal) */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 12 }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={secret} onChange={(e) => setSecret(e.target.checked)} aria-label="Secret Shiny" />
              <span style={{ color: '#ffd700', fontWeight: 700 }}>Secret Shiny</span>
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={alpha} onChange={(e) => setAlpha(e.target.checked)} aria-label="Alpha" />
              <span style={{ color: '#ffd700', fontWeight: 700 }}>Alpha</span>
            </label>
          </div>

          <div style={{ marginBottom: 12, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            <label style={{ display: 'block', textAlign: 'center', marginBottom: 6 }}>IVs</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
              {([
                ['hp','HP'],
                ['attack','Atk'],
                ['defense','Def'],
                ['sp_attack','SpA'],
                ['sp_defense','SpD'],
                ['speed','Spe']
              ] as const).map(([key, label]) => (
                <div key={key} style={{ position: 'relative', minWidth: 0 }}>
                  <span
                    style={{
                      position: 'absolute',
                      top: -8,
                      left: 10,
                      fontSize: 10,
                      color: '#ffd700',
                      background: 'rgba(0,0,0,0.95)',
                      padding: '0 4px',
                      lineHeight: 1
                    }}
                  >{label}</span>
                  <input
                    type="number"
                    min={0}
                    max={31}
                    value={ivs[key]}
                    onChange={(e) => setIvs({ ...ivs, [key]: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid #ffcb05', borderRadius: 8, color: '#fff', padding: '10px 10px 8px' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(127,29,29,0.3)', border: '1px solid rgba(248,113,113,0.5)', color: '#fecaca', padding: 8, borderRadius: 8, marginBottom: 8 }}>{error}</div>
          )}
        </div>

        <div style={{ padding: 12, borderTop: '1px solid rgba(255,203,5,0.2)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '6px 10px' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ background: '#ffcb05', color: '#000', border: 'none', borderRadius: 6, padding: '6px 10px' }}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>, document.body);
}


