import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { BackgroundManifestEntry } from "../assets/backgrounds";
import { BACKGROUND_MANIFEST } from "../assets/backgrounds";

type BackgroundKind = "image" | "video" | "solid";
type SolidColor =
  | "black"
  | "white"
  | "crimson"
  | "red"
  | "orange"
  | "amber"
  | "gold"
  | "olive"
  | "green"
  | "teal"
  | "cyan"
  | "azure"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "magenta"
  | "fuchsia"
  | "pink";

export type BackgroundState = {
  kind: BackgroundKind;
  id: string | null;
  solidColor: SolidColor;
  dim: boolean;
  blur: boolean;
  solidHex?: string;
};

type BackgroundContextValue = {
  state: BackgroundState;
  setKind: (kind: BackgroundKind) => void;
  setById: (id: string) => void;
  setSolid: (color: SolidColor) => void;
  setSolidHex: (hex: string) => void;
  reset: () => void;
  next: () => void;
  random: () => void;
  manifest: BackgroundManifestEntry[];
};

const STORAGE_KEY = "mmojournal:bg:v1";

const defaultState: BackgroundState = {
  kind: "video",
  id: BACKGROUND_MANIFEST[0]?.id ?? null,
  solidColor: "black",
  dim: false,
  blur: false,
};

const BackgroundContext = createContext<BackgroundContextValue | undefined>(undefined);

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BackgroundState>(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as BackgroundState;
        if (parsed.kind === "solid" && parsed.solidColor === "white") {
          // Migrate away from deprecated white solid to black
          return { ...parsed, solidColor: "black" };
        }
        return parsed;
      }
    } catch {}
    return defaultState;
  });

  const lastAppliedTheme = useRef<null | "light" | "dark">(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}

    const root = document.documentElement;
    if (state.kind === "solid" && state.solidColor === "white") {
      root.classList.add("theme-light");
      lastAppliedTheme.current = "light";
    } else {
      root.classList.remove("theme-light");
      lastAppliedTheme.current = "dark";
    }
  }, [state]);

  const setKind = (kind: BackgroundKind) => setState((s) => ({ ...s, kind }));

  const setById = (id: string) => {
    const entry = BACKGROUND_MANIFEST.find((m) => m.id === id);
    if (!entry) return;
    setState((s) => ({ ...s, kind: entry.type, id: entry.id }));
  };

  const setSolid = (color: SolidColor) => {
    // Preserve backward compatibility for deprecated white (map to black)
    const resolved: SolidColor = color === "white" ? "black" : color;
    const nameToHex: Record<string, string> = {
      black: "#000000", white: "#000000", // white maps to black
      crimson: "#4a0d17", red: "#3e0b0b", orange: "#3b1f08", amber: "#3a2a0a",
      gold: "#3a300a", olive: "#202a12", green: "#0f2a18", teal: "#0e2624",
      cyan: "#0b2630", azure: "#0b2238", blue: "#0b1e3e", indigo: "#161a3f",
      violet: "#22183e", purple: "#2a1638", magenta: "#351431", fuchsia: "#3a1330", pink: "#3a1120",
    };
    setState((s) => ({ ...s, kind: "solid", solidColor: resolved, solidHex: nameToHex[resolved] || "#000000" }));
  };

  const setSolidHex = (hex: string) => {
    setState((s) => ({ ...s, kind: "solid", solidColor: "black", solidHex: hex }));
  };

  const next = () => {
    if (BACKGROUND_MANIFEST.length === 0) return;
    const currentIndex = BACKGROUND_MANIFEST.findIndex((m) => m.id === state.id);
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % BACKGROUND_MANIFEST.length : 0;
    const entry = BACKGROUND_MANIFEST[nextIndex];
    setState((s) => ({ ...s, kind: entry.type, id: entry.id }));
  };

  const random = () => {
    if (BACKGROUND_MANIFEST.length === 0) return;
    const idx = Math.floor(Math.random() * BACKGROUND_MANIFEST.length);
    const entry = BACKGROUND_MANIFEST[idx];
    setState((s) => ({ ...s, kind: entry.type, id: entry.id }));
  };

  const value = useMemo<BackgroundContextValue>(
    () => ({
      state,
      setKind,
      setById,
      setSolid,
      setSolidHex,
      reset: () => setState(defaultState),
      next,
      random,
      manifest: BACKGROUND_MANIFEST,
    }),
    [state]
  );

  return <BackgroundContext.Provider value={value}>{children}</BackgroundContext.Provider>;
}

export function useBackground() {
  const ctx = useContext(BackgroundContext);
  if (!ctx) throw new Error("useBackground must be used within BackgroundProvider");
  return ctx;
}


