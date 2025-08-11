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
  encounters?: number | null;
  notes?: string | null;
  isPhase?: boolean | null;
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
  const [placement, setPlacement] = useState<'right' | 'left'>('right');

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
    const spaceRight = window.innerWidth - wrapperRect.right;
    const willOverflowRight = spaceRight < popRect.width + 16;
    setPlacement(willOverflowRight ? 'left' : 'right');
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
        {details.isPhase ? (
          <div
            style={{
              position: 'absolute',
              top: 6,
              left: 6,
              background: 'rgba(255,215,0,0.9)',
              color: '#000',
              fontSize: 10,
              fontWeight: 800,
              padding: '2px 4px',
              borderRadius: 4,
            }}
          >
            PHASE
          </div>
        ) : null}
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
            top: 0,
            [placement === 'right' ? 'left' : 'right']: 'calc(100% + 8px)'
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
  return (
    <div
      style={{
        background: 'rgba(0, 0, 0, 0.95)',
        border: `2px solid ${colors.glowLight}`,
        borderRadius: 12,
        padding: 12,
        minWidth: 260,
        maxWidth: 320,
        zIndex: 20,
        boxShadow: `0 8px 25px ${colors.glow}`,
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
        {typeof details.encounters === 'number' ? (
          <div style={{ marginBottom: 6 }}>
            <strong style={{ color: '#ffd700' }}>Encounters:</strong> {details.encounters.toLocaleString()}
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



