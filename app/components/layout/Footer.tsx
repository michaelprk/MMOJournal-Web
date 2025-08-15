import React, { useEffect, useRef, useState } from "react";
import { useBackground } from "../../contexts/BackgroundContext";

export function Footer() {
  // TEMP DIAGNOSTIC (to be removed after verification)
  // console.log('[FOOTER] mounted');
  const { random, setById, setSolid, manifest } = useBackground();
  const [openLegal, setOpenLegal] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const legalRef = useRef<HTMLDivElement | null>(null);
  const legalButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  // Close on outside click / Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (openLegal) {
          setOpenLegal(false);
          legalButtonRef.current?.focus();
        }
        if (openMenu) {
          setOpenMenu(false);
          menuButtonRef.current?.focus();
        }
      }
    }
    function onClick(e: MouseEvent) {
      const t = e.target as Node;
      if (openLegal && legalRef.current && !legalRef.current.contains(t) && !legalButtonRef.current?.contains(t)) {
        setOpenLegal(false);
      }
      if (openMenu && menuRef.current && !menuRef.current.contains(t) && !menuButtonRef.current?.contains(t)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [openLegal, openMenu]);

  // Return focus to trigger when closing via outside click
  useEffect(() => {
    if (!openLegal) {
      const t = setTimeout(() => legalButtonRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [openLegal]);
  useEffect(() => {
    if (!openMenu) {
      const t = setTimeout(() => menuButtonRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [openMenu]);

  // Focus trap for legal panel and menu when open
  useEffect(() => {
    function trap(e: KeyboardEvent, container: HTMLElement, fallback: HTMLElement) {
      if (e.key !== "Tab") return;
      const focusables = container.querySelectorAll<HTMLElement>(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) {
        e.preventDefault();
        fallback.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const shift = e.shiftKey;
      if (!shift && active === last) {
        e.preventDefault();
        first.focus();
      } else if (shift && active === first) {
        e.preventDefault();
        last.focus();
      }
    }
    function onKey(e: KeyboardEvent) {
      if (openLegal && legalRef.current) {
        trap(e, legalRef.current, legalButtonRef.current || legalRef.current);
      } else if (openMenu && menuRef.current) {
        trap(e, menuRef.current, menuButtonRef.current || menuRef.current);
      }
    }
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [openLegal, openMenu]);

  const footerStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: openLegal ? "8px" : "0",
    padding: "6px 12px",
    fontSize: 12,
    color: "white",
    background: "transparent",
    minHeight: openLegal ? "60px" : "38px",
    transition: "min-height 150ms ease",
  };

  const legalPanelStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    bottom: "100%",
    width: 560,
    maxWidth: "calc(100vw - 24px)",
    background: "rgba(0,0,0,0.85)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderBottom: "none",
    color: "white",
    padding: openLegal ? "10px 12px" : "0 12px",
    boxSizing: "border-box",
    overflow: "hidden",
    transition: "height 150ms ease, opacity 150ms ease, padding 150ms ease",
    height: openLegal ? 84 : 0,
    opacity: openLegal ? 1 : 0,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    zIndex: 2,
  };

  const popoverStyle: React.CSSProperties = {
    position: "absolute",
    right: 0,
    bottom: "calc(100% + 8px)",
    width: 320,
    background: "rgba(0,0,0,0.9)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 8,
    padding: 8,
    color: "white",
    zIndex: 2,
  };

  const buttonStyle: React.CSSProperties = {
    background: "transparent",
    color: "inherit",
    border: "none",
    padding: 6,
    cursor: "pointer",
    outlineOffset: 2,
    outline: "none", // Remove focus outline
  };

  return (
    <div style={{ position: "relative", zIndex: 2 }}>
      <footer style={footerStyle}>
        {/* Top row with buttons */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
          <button
            ref={legalButtonRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenLegal((v) => !v);
              setOpenMenu(false);
            }}
            onKeyDown={(e) => e.stopPropagation()}
            aria-expanded={openLegal}
            aria-controls="legal-content"
            style={buttonStyle}
          >
            Copyright © 2025 All rights reserved.
          </button>

          <button
            ref={menuButtonRef}
            type="button"
            aria-haspopup="menu"
            aria-expanded={openMenu}
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenu((v) => !v);
              setOpenLegal(false);
            }}
            onKeyDown={(e) => e.stopPropagation()}
            style={buttonStyle}
          >
            Change background
          </button>
        </div>

        {/* Legal text that expands below */}
        {openLegal && (
          <div 
            id="legal-content" 
            ref={legalRef} 
            role="region" 
            aria-live="polite"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "11px",
              lineHeight: 1.4,
              paddingLeft: "6px",
              animation: "fadeIn 150ms ease-out"
            }}
          >
            MMOJournal is not affiliated or associated with Nintendo, PokéMMO or any other company. All logos, images etc. here are the property of their respective owners
          </div>
        )}
      </footer>

      {openMenu && (
        <div ref={menuRef} role="menu" aria-label="Background menu" style={popoverStyle}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button style={buttonStyle} role="menuitem" onClick={() => { random(); setOpenMenu(false); }}>Random</button>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }} />
            <div style={{ fontSize: 11, color: "#bbb", padding: "2px 2px" }}>Animated</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {manifest.filter((m) => m.type === "video").map((m) => (
                <button
                  key={m.id}
                  style={{
                    ...buttonStyle,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 6,
                    padding: 6,
                  }}
                  onClick={() => { setById(m.id); setOpenMenu(false); }}
                >
                  <div style={{ width: 56, height: 36, background: "#111", borderRadius: 4, display: "grid", placeItems: "center" }}>
                    <span style={{ fontSize: 10, opacity: 0.8 }}>video</span>
                  </div>
                  <span style={{ fontSize: 12, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{m.label}</span>
                </button>
              ))}
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }} />
            <div style={{ fontSize: 11, color: "#bbb", padding: "2px 2px" }}>Solid</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={buttonStyle} role="menuitem" onClick={() => { setSolid("black"); setOpenMenu(false); }}>Black</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


