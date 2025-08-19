import React, { useEffect, useRef, useState } from "react";
import { useBackground } from "../../contexts/BackgroundContext";

export function Footer() {
  const { random, setById, setSolid, manifest } = useBackground();
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  // Close background menu on outside click / Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && openMenu) {
        setOpenMenu(false);
        menuButtonRef.current?.focus();
      }
    }
    function onClick(e: MouseEvent) {
      const t = e.target as Node;
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
  }, [openMenu]);

  // Focus return when menu closes
  useEffect(() => {
    if (!openMenu) {
      const t = setTimeout(() => menuButtonRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [openMenu]);

  // Focus trap for menu when open
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
      if (openMenu && menuRef.current) {
        trap(e, menuRef.current, menuButtonRef.current || menuRef.current);
      }
    }
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [openMenu]);

  const footerStyle: React.CSSProperties = {
    position: "relative",
    padding: "12px 16px",
    background: "transparent",
    color: "white",
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
  };

  const buttonStyle: React.CSSProperties = {
    background: "transparent",
    color: "inherit",
    border: "1px solid rgba(255,255,255,0.15)",
    padding: "8px 12px",
    borderRadius: 6,
    cursor: "pointer",
    outlineOffset: 2,
    fontSize: 12,
  };

  return (
    <div style={{ position: "relative", zIndex: 2 }}>
      <footer style={footerStyle}>
        <div style={containerStyle}>
          {/* Left: Logo + Tagline */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <img src="/images/MMOJournal_logo.svg" alt="MMOJournal" style={{ height: 40 }} />
            <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#ccc", fontSize: 12 }}>
              MMOJournal — Competitive builds, shiny tracking, and more.
            </div>
          </div>

          {/* Center: Links */}
          <nav aria-label="Legal" style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12 }}>
            <a href="/privacy" style={{ color: "#ffcb05", textDecoration: "none" }}>Privacy Policy</a>
            <a href="/tos" style={{ color: "#ffcb05", textDecoration: "none" }}>Terms of Service</a>
            <a href="mailto:support@mmojournal.app" style={{ color: "#ffcb05", textDecoration: "none" }}>Contact</a>
          </nav>

          {/* Right: Change Background button */}
          <div>
            <button
              ref={menuButtonRef}
              type="button"
              aria-haspopup="menu"
              aria-expanded={openMenu}
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu((v) => !v);
              }}
              onKeyDown={(e) => e.stopPropagation()}
              style={buttonStyle}
            >
              Change background
            </button>
          </div>
        </div>
      </footer>

      {openMenu && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Background menu"
          style={{
            position: "absolute",
            right: 16,
            bottom: "calc(100% + 8px)",
            width: 320,
            background: "rgba(0,0,0,0.9)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 8,
            padding: 8,
            color: "white",
            zIndex: 2,
          }}
        >
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


