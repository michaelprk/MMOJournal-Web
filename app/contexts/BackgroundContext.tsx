import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { BackgroundManifestEntry } from "../assets/backgrounds";
import { BACKGROUND_MANIFEST } from "../assets/backgrounds";

type BackgroundKind = "image" | "video" | "solid";
type SolidColor = "black" | "white";

export type BackgroundState = {
  kind: BackgroundKind;
  id: string | null;
  solidColor: SolidColor;
  dim: boolean;
  blur: boolean;
};

type BackgroundContextValue = {
  state: BackgroundState;
  setKind: (kind: BackgroundKind) => void;
  setById: (id: string) => void;
  setSolid: (color: SolidColor) => void;
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
    // Only allow black; map white -> black for backward compatibility
    const resolved: SolidColor = color === "white" ? "black" : color;
    setState((s) => ({ ...s, kind: "solid", solidColor: resolved }));
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


