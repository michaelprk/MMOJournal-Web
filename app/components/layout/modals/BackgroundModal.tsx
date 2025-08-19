import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { useBackground } from "../../../contexts/BackgroundContext";

export function BackgroundModal({ onClose }: { onClose: () => void }) {
  const { manifest, state, setById, setSolidHex } = useBackground();
  const location = useLocation();
  const [index, setIndex] = useState(() => Math.max(0, manifest.findIndex(m => m.id === state.id)));
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const solidSlide = { id: '__solid__', label: 'Solid Colors' } as const;
  const slides = [solidSlide, ...manifest];
  const entry = slides[index] && slides[index] !== solidSlide ? (slides[index] as any) : null;

  const go = (delta: number) => setIndex((i) => (slides.length ? (i + delta + slides.length) % slides.length : 0));
  const apply = () => {
    if (entry) {
      setById(entry.id);
    } else {
      setSolidHex(solidSelected.hex);
    }
    onClose();
  };

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    try { document.body.classList.add('modal-open'); } catch {}
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previousFocusRef.current?.focus();
      try { document.body.classList.remove('modal-open'); } catch {}
    };
  }, [onClose]);

  const preview = useMemo(() => {
    if (!entry) return null;
    const videoFilter =
      location.pathname === "/login" || location.pathname === "/create-account"
        ? "grayscale(50%) brightness(80%) contrast(95%) blur(4px)"
        : "grayscale(70%) brightness(40%) contrast(90%) blur(1px)";
    if (entry.type === 'video') {
      return (
        <video
          key={entry.id}
          autoPlay
          muted
          loop
          playsInline
          poster={entry.poster}
          style={{ width: '100%', maxWidth: 720, borderRadius: 12, border: '2px solid #ffcb05', filter: videoFilter }}
        >
          <source src={entry.src} />
        </video>
      );
    }
    return (
      <img
        key={entry.id}
        src={entry.src}
        alt={entry.label}
        style={{ width: '100%', maxWidth: 720, borderRadius: 12, border: '2px solid #ffcb05' }}
      />
    );
  }, [entry]);

  const solidPalette: Array<{ name: string; hex: string }> = [
    { name: 'Black', hex: '#000000' },
    { name: 'Crimson', hex: '#4a0d17' },
    { name: 'Red', hex: '#3e0b0b' },
    { name: 'Orange', hex: '#3b1f08' },
    { name: 'Amber', hex: '#3a2a0a' },
    { name: 'Gold', hex: '#3a300a' },
    { name: 'Olive', hex: '#202a12' },
    { name: 'Green', hex: '#0f2a18' },
    { name: 'Teal', hex: '#0e2624' },
    { name: 'Cyan', hex: '#0b2630' },
    { name: 'Azure', hex: '#0b2238' },
    { name: 'Blue', hex: '#0b1e3e' },
    { name: 'Indigo', hex: '#161a3f' },
    { name: 'Violet', hex: '#22183e' },
    { name: 'Purple', hex: '#2a1638' },
    { name: 'Magenta', hex: '#351431' },
    { name: 'Fuchsia', hex: '#3a1330' },
    { name: 'Pink', hex: '#3a1120' },
  ];
  const [solidSelected, setSolidSelected] = useState<{ name: string; hex: string }>(solidPalette[0]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.56)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div
        ref={dialogRef}
        style={{ background: 'rgba(0,0,0,0.95)', border: '2px solid #ffcb05', borderRadius: 12, width: 'min(92vw, 960px)', padding: 16, color: '#fff', position: 'relative' }}
      >
        <button onClick={onClose} aria-label="Close" style={{ background: 'transparent', color: '#ffcb05', border: '1px solid #ffcb05', borderRadius: 999, width: 32, height: 32, cursor: 'pointer', position: 'absolute', top: 12, right: 12 }}>✕</button>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 800, color: '#ffcb05', textAlign: 'center' }}>Change Background</div>
        </div>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Left arrow */}
          <button
            onClick={() => go(-1)}
            aria-label="Previous"
            style={{
              position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
              width: 36, height: 36, borderRadius: 999,
              background: 'rgba(0,0,0,0.5)', color: '#ffcb05', border: '1px solid #ffcb05',
              boxShadow: '0 0 10px rgba(255,203,5,0.25)', cursor: 'pointer',
              display: 'grid', placeItems: 'center', transition: 'all 120ms ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#ffcb05'; e.currentTarget.style.color = '#000'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; e.currentTarget.style.color = '#ffcb05'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
          >
            ‹
          </button>

          <div style={{ flex: '0 1 auto', display: 'flex', justifyContent: 'center' }}>
            {entry ? preview : (
              <div style={{ width: '100%', maxWidth: 720, height: 400, borderRadius: 12, border: '2px solid #ffcb05', background: solidSelected.hex }} />
            )}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => go(1)}
            aria-label="Next"
            style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              width: 36, height: 36, borderRadius: 999,
              background: 'rgba(0,0,0,0.5)', color: '#ffcb05', border: '1px solid #ffcb05',
              boxShadow: '0 0 10px rgba(255,203,5,0.25)', cursor: 'pointer',
              display: 'grid', placeItems: 'center', transition: 'all 120ms ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#ffcb05'; e.currentTarget.style.color = '#000'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; e.currentTarget.style.color = '#ffcb05'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
          >
            ›
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 10, color: '#ccc' }}>{entry ? entry.label : `${solidSelected.name} ${solidSelected.hex}`}</div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 12 }}>
          {slides.map((m, i) => (
            <button
              key={(m as any).id}
              onClick={() => setIndex(i)}
              title={(m as any).label || 'Solid Colors'}
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                border: '1px solid #ffcb05',
                background: i === index ? '#ffcb05' : 'transparent',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>

        {/* Solid color swatches when Solid Colors is selected */}
        {!entry && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: 8, marginTop: 12 }}>
            {solidPalette.map(c => (
              <button
                key={c.hex}
                onClick={() => setSolidSelected(c)}
                title={`${c.name} ${c.hex}`}
                style={{
                  height: 42, borderRadius: 8, border: '1px solid rgba(255,203,5,0.3)', cursor: 'pointer',
                  outline: c.hex === solidSelected.hex ? '2px solid #ffcb05' : 'none',
                  background: c.hex
                }}
              />
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
          <button onClick={apply} style={{ background: '#ffcb05', color: '#000', border: 'none', padding: '8px 14px', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>Apply</button>
        </div>
      </div>
    </div>,
    document.body
  );
}


