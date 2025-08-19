import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { useBackground } from "../../../contexts/BackgroundContext";

export function BackgroundModal({ onClose }: { onClose: () => void }) {
  const { manifest, state, setById } = useBackground();
  const location = useLocation();
  const [index, setIndex] = useState(() => Math.max(0, manifest.findIndex(m => m.id === state.id)));
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const entry = manifest[index] || null;

  const go = (delta: number) => setIndex((i) => (manifest.length ? (i + delta + manifest.length) % manifest.length : 0));
  const apply = () => {
    if (entry) {
      setById(entry.id);
      onClose();
    }
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => go(-1)} aria-label="Previous" style={{ background: 'transparent', color: '#ffcb05', border: '1px solid #ffcb05', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>←</button>
          <div style={{ flex: '0 1 auto', display: 'flex', justifyContent: 'center' }}>
            {preview}
          </div>
          <button onClick={() => go(1)} aria-label="Next" style={{ background: 'transparent', color: '#ffcb05', border: '1px solid #ffcb05', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>→</button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 10, color: '#ccc' }}>{entry?.label}</div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 12 }}>
          {manifest.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setIndex(i)}
              title={m.label}
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

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
          <button onClick={apply} style={{ background: '#ffcb05', color: '#000', border: 'none', padding: '8px 14px', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>Apply</button>
        </div>
      </div>
    </div>,
    document.body
  );
}


