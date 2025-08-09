import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

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
  };
  onSave: (data: { id: number; phase_count: number; total_encounters: number; meta: any }) => Promise<void>;
}

export function EditShinyModal({ isOpen, onClose, initial, onSave }: EditShinyModalProps) {
  const [mounted, setMounted] = useState(false);
  const [phaseCount, setPhaseCount] = useState<number>(initial.phase_count || 1);
  const [encounters, setEncounters] = useState<number>(initial.total_encounters || 0);
  const [ivs, setIvs] = useState<any>({
    hp: initial.meta?.ivs?.hp || 0,
    atk: initial.meta?.ivs?.atk || 0,
    def: initial.meta?.ivs?.def || 0,
    sp_atk: initial.meta?.ivs?.sp_atk || 0,
    sp_def: initial.meta?.ivs?.sp_def || 0,
    spd: initial.meta?.ivs?.spd || 0,
  });
  const [nature, setNature] = useState<string>(initial.meta?.nature || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      const meta = { ...(initial.meta || {}), ivs, nature };
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
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: 'rgba(0,0,0,0.95)', border: '2px solid #ffcb05', borderRadius: 12, padding: 16, width: '100%', maxWidth: 600, color: '#fff' }}>
        <h2 style={{ marginTop: 0, marginBottom: 12 }}>✏️ Edit {initial.pokemonName}</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label>Phases</label>
            <input type="number" value={phaseCount} min={1} onChange={(e) => setPhaseCount(parseInt(e.target.value) || 1)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid #ffcb05', borderRadius: 8, color: '#fff', padding: '8px 10px' }} />
          </div>
          <div>
            <label>Total Encounters</label>
            <input type="number" value={encounters} min={0} onChange={(e) => setEncounters(parseInt(e.target.value) || 0)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid #ffcb05', borderRadius: 8, color: '#fff', padding: '8px 10px' }} />
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Nature</label>
          <select value={nature} onChange={(e) => setNature(e.target.value)}
            style={{ width: '100%', background: 'rgba(0,0,0,0.85)', color: '#fff', border: '1px solid rgba(255,203,5,0.5)', borderRadius: 8, padding: '8px 10px' }}>
            <option value="">Select nature</option>
            {NATURES.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>IVs</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
            {(['hp','atk','def','sp_atk','sp_def','spd'] as const).map(key => (
              <input key={key} type="number" min={0} max={31} value={ivs[key]}
                onChange={(e) => setIvs({ ...ivs, [key]: parseInt(e.target.value) || 0 })}
                placeholder={key.toUpperCase()}
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid #ffcb05', borderRadius: 8, color: '#fff', padding: '8px 10px' }} />
            ))}
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(127,29,29,0.3)', border: '1px solid rgba(248,113,113,0.5)', color: '#fecaca', padding: 8, borderRadius: 8, marginBottom: 8 }}>{error}</div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '6px 10px' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ background: '#ffcb05', color: '#000', border: 'none', borderRadius: 6, padding: '6px 10px' }}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>, document.body);
}


