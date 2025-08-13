import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getPokemonColors, getShinySpritePath } from '../../types/pokemon';

export type ShinyHoverDetails = {
  id: number;
  pokemonId: number;
  pokemonName: string;
  method?: string | null;
  date?: string | null; // found/start
  region?: string | null;
  area?: string | null;
  rarity?: string | null;
  nature?: string | null;
  gender?: string | null;
  encounters?: number | null;
  notes?: string | null;
  isPhase?: boolean | null;
  ivs?: Partial<{
    hp: number;
    attack: number;
    defense: number;
    sp_attack: number;
    sp_defense: number;
    speed: number;
  }> | null;
};

type ShinyTileProps = {
  details: ShinyHoverDetails;
  size?: number; // sprite size px
  showName?: boolean;
  onEdit?: (details: ShinyHoverDetails) => void;
  onDelete?: (id: number) => void;
};

export function ShinyTile({ details, size = 56, showName = true, onEdit, onDelete }: ShinyTileProps) {
  const colors = useMemo(() => getPokemonColors(details.pokemonId), [details.pokemonId]);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);
  const [placement, setPlacement] = useState<'above' | 'below'>('below');

  const clearCloseTimer = () => {
    if (closing) {
      clearTimeout(closing);
    }
  };

  const requestClose = useCallback(() => {
    clearCloseTimer();
    const t = setTimeout(() => setOpen(false), 120);
    setClosing(t);
  }, [closing]);

  const openHover = () => {
    clearCloseTimer();
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const wrapper = wrapperRef.current;
    const pop = popRef.current;
    if (!wrapper || !pop) return;
    const wrapperRect = wrapper.getBoundingClientRect();
    const popRect = pop.getBoundingClientRect();
    const spaceBelow = window.innerHeight - wrapperRect.bottom;
    setPlacement(spaceBelow < popRect.height + 16 ? 'above' : 'below');
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      onMouseEnter={openHover}
      onMouseLeave={requestClose}
    >
      <div
        onClick={() => onEdit?.(details)}
        style={{
          position: 'relative',
          background: 'rgba(0,0,0,0.3)',
          border: `1px solid ${colors.glowLight}`,
          borderRadius: 12,
          padding: 8,
          cursor: 'pointer',
          transition: 'box-shadow 120ms ease, transform 120ms ease',
        }}
      >
        {/* Phase badge removed per design: keep data, no visual label */}
        <img
          src={getShinySpritePath(details.pokemonId, details.pokemonName)}
          alt={`Shiny ${details.pokemonName}`}
          style={{
            width: size,
            height: size,
            display: 'block',
            filter: `drop-shadow(0 0 10px ${colors.glow}) drop-shadow(0 0 20px ${colors.glowLight})`,
          }}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/images/shiny-sprites/001_Bulbasaur.gif';
          }}
        />
        {showName && (
          <div
            style={{
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 700,
              textAlign: 'center',
              marginTop: 6,
            }}
          >
            {details.pokemonName}
          </div>
        )}
      </div>

      {open && (
        <div
          ref={popRef}
          onMouseEnter={openHover}
          onMouseLeave={requestClose}
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            [placement === 'below' ? 'top' : 'bottom']: 'calc(100% + 8px)'
          } as React.CSSProperties}
        >
          <ShinyHoverCard details={details} onEdit={onEdit} onDelete={onDelete} />
        </div>
      )}
    </div>
  );
}

export function ShinyHoverCard({ details, onEdit, onDelete }: { details: ShinyHoverDetails; onEdit?: (d: ShinyHoverDetails) => void; onDelete?: (id: number) => void }) {
  const colors = getPokemonColors(details.pokemonId);
  const ivsLine = details.ivs
    ? [
        details.ivs.hp,
        details.ivs.attack,
        details.ivs.defense,
        details.ivs.sp_attack,
        details.ivs.sp_defense,
        details.ivs.speed,
      ]
        .map((v) => (typeof v === 'number' ? String(v) : '—'))
        .join(', ')
    : null;
  return (
    <div
      style={{
        background: 'rgba(0, 0, 0, 0.82)',
        border: `2px solid ${colors.glowLight}`,
        borderRadius: 12,
        padding: 12,
        minWidth: 260,
        maxWidth: 360,
        zIndex: 20,
        boxShadow: `0 8px 25px ${colors.glow}`,
        animation: 'fadeInScale 160ms ease-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <img
          src={getShinySpritePath(details.pokemonId, details.pokemonName)}
          alt={`Shiny ${details.pokemonName}`}
          style={{ width: 48, height: 48, filter: `drop-shadow(0 0 10px ${colors.glow})` }}
        />
        <div>
          <div style={{ color: '#fff', fontWeight: 800 }}>{details.pokemonName}</div>
          <div style={{ color: colors.glowLight, fontSize: '0.8rem' }}>#{String(details.pokemonId).padStart(3, '0')}</div>
        </div>
      </div>
      <div style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: 1.4 }}>
        {details.method ? (
          <div style={{ marginBottom: 6 }}>
            <strong style={{ color: '#ffd700' }}>Method:</strong> {details.method}
          </div>
        ) : null}
        {details.region && (
          <div style={{ marginBottom: 6 }}>
            <strong style={{ color: '#ffd700' }}>Location:</strong> {details.region}
            {details.area ? ` — ${String(details.area).toUpperCase?.() || details.area}` : ''}
          </div>
        )}
        {details.rarity ? (
          <div style={{ marginBottom: 6 }}>
            <strong style={{ color: '#ffd700' }}>Rarity:</strong> {details.rarity}
          </div>
        ) : null}
        {details.date ? (
          <div style={{ marginBottom: 6 }}>
            <strong style={{ color: '#ffd700' }}>Date:</strong> {new Date(details.date).toLocaleDateString()}
          </div>
        ) : null}
        {details.nature ? (
          <div style={{ marginBottom: 6 }}>
            <strong style={{ color: '#ffd700' }}>Nature:</strong> {details.nature}
          </div>
        ) : null}
        {details.gender ? (
          <div style={{ marginBottom: 6 }}>
            <strong style={{ color: '#ffd700' }}>Gender:</strong> {details.gender}
          </div>
        ) : null}
        {typeof details.encounters === 'number' ? (
          <div style={{ marginBottom: 6 }}>
            <strong style={{ color: '#ffd700' }}>Encounters:</strong> {details.encounters.toLocaleString()}
          </div>
        ) : null}
        {ivsLine ? (
          <div style={{ marginBottom: 6 }}>
            <strong style={{ color: '#ffd700' }}>IVs:</strong> {ivsLine}
          </div>
        ) : null}
        {details.notes ? (
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <strong style={{ color: '#ffd700' }}>Notes:</strong>
            <div style={{ color: '#aaa' }}>{details.notes}</div>
          </div>
        ) : null}
      </div>
      {(onEdit || onDelete) && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
          {onDelete && (
            <button
              onClick={() => onDelete(details.id)}
              style={{
                background: 'transparent',
                color: '#ff6b6b',
                border: '1px solid rgba(255, 107, 107, 0.6)',
                borderRadius: 6,
                padding: '6px 10px',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(details)}
              style={{
                background: 'transparent',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 6,
                padding: '6px 10px',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              ✏️ Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ShinyTile;



