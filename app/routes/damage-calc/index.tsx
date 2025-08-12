import React from "react";
import type { Route } from "../../+types/root";
import type { CalcResult, PokemonSet, FieldState } from "./engine-adapter";
import { calculateDamage, importText as adapterImport, exportText as adapterExport } from "./engine-adapter";
import { AutocompleteInput } from "../../components/AutocompleteInput";
import { getSpeciesList } from "../../lib/pokedex";

export const meta: Route.MetaFunction = () => [
  { title: "MMOJournal - Damage Calculator" },
  { name: "description", content: "Damage Calculator for PokeMMO in MMOJournal style" },
];

function usePersistentToggle(key: string, defaultValue: boolean) {
  const [value, setValue] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return defaultValue;
    const stored = window.localStorage.getItem(key);
    return stored == null ? defaultValue : stored === "true";
  });
  React.useEffect(() => {
    try {
      window.localStorage.setItem(key, String(value));
    } catch {}
  }, [key, value]);
  return [value, setValue] as const;
}

function useDebounced<T>(value: T, delayMs: number): T {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return v;
}

export default function DamageCalcPage() {
  const [plainBackground, setPlainBackground] = usePersistentToggle(
    "damageCalcPlainBg",
    false
  );
  React.useEffect(() => {
    // Notify root to hide/show bg video immediately
    try {
      window.dispatchEvent(new CustomEvent("damageCalc:bg", { detail: { plain: plainBackground } }));
    } catch {}
  }, [plainBackground]);

  // Centralized page state
  const [attacker, setAttacker] = React.useState<PokemonSet>({
    species: "",
    level: 50,
    nature: "",
    ability: "",
    item: "",
    status: "",
    ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
    evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    moves: [""],
  });
  const [defender, setDefender] = React.useState<PokemonSet>({
    species: "",
    level: 50,
    nature: "",
    ability: "",
    item: "",
    status: "",
    ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
    evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    moves: [""],
  });
  const [field, setField] = React.useState<FieldState>({ weather: "", terrain: "", hazards: { rocks: false, spikes: 0, tspikes: 0 }, isCrit: false });
  const [selectedMove, setSelectedMove] = React.useState<string>("");
  const [result, setResult] = React.useState<CalcResult | null>(null);

  const debouncedState = useDebounced({ attacker, defender, field, selectedMove }, 150);

  React.useEffect(() => {
    let cancelled = false;
    const { attacker: a, defender: d, field: f, selectedMove: m } = debouncedState;
    if (!m || !a.species || !d.species) {
      setResult(null);
      return;
    }
    calculateDamage({ attacker: a, defender: d, field: f, move: m })
      .then((res) => { if (!cancelled) setResult(res); })
      .catch(() => { if (!cancelled) setResult(null); });
    return () => { cancelled = true; };
  }, [debouncedState]);

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "1rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#ffcb05" }}>Damage Calculator</h1>
        <div>
          <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
            <span style={{ opacity: 0.85 }}>Background</span>
            <div
              role="group"
              aria-label="Background toggle"
              style={{
                display: "inline-flex",
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid rgba(255, 203, 5, 0.3)",
                background: "rgba(0,0,0,0.4)",
              }}
            >
              <button
                type="button"
                aria-pressed={!plainBackground}
                onClick={() => setPlainBackground(false)}
                style={{
                  padding: "0.35rem 0.75rem",
                  background: !plainBackground ? "rgba(255, 203, 5, 0.15)" : "transparent",
                  color: !plainBackground ? "#ffcb05" : "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                MMOJ
              </button>
              <button
                type="button"
                aria-pressed={plainBackground}
                onClick={() => setPlainBackground(true)}
                style={{
                  padding: "0.35rem 0.75rem",
                  background: plainBackground ? "rgba(255, 203, 5, 0.15)" : "transparent",
                  color: plainBackground ? "#ffcb05" : "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Plain
              </button>
            </div>
          </label>
        </div>
      </div>

      <div
        style={{
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.12)",
          background: plainBackground ? "#0d0f12" : "rgba(0,0,0,0.35)",
          backdropFilter: plainBackground ? undefined : "blur(6px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
          padding: "1rem",
        }}
      >
        {/* Responsive grid: 3 cols desktop, 2 tablet, 1 mobile */}
        <div
          style={{
            display: "grid",
            gap: "0.75rem",
            gridTemplateColumns: "1fr 1fr 1fr",
          }}
        >
          {/* Attacker Panel */}
          <section aria-labelledby="attacker-heading" style={panelStyle}>
            <h2 id="attacker-heading" style={panelTitleStyle}>Attacker</h2>
            <CalcSidePanel
              side="attacker"
              value={attacker}
              onChange={(next) => setAttacker((prev) => ({ ...prev, ...next }))}
              onMovesChange={(moves) => setAttacker((prev) => ({ ...prev, moves }))}
              onSelectMove={setSelectedMove}
              selectedMove={selectedMove}
            />
          </section>
          {/* Field Panel */}
          <section aria-labelledby="field-heading" style={panelStyle}>
            <h2 id="field-heading" style={panelTitleStyle}>Field</h2>
            <FieldPanel value={field} onChange={setField} />
          </section>
          {/* Defender Panel */}
          <section aria-labelledby="defender-heading" style={panelStyle}>
            <h2 id="defender-heading" style={panelTitleStyle}>Defender</h2>
            <CalcSidePanel
              side="defender"
              value={defender}
              onChange={(next) => setDefender((prev) => ({ ...prev, ...next }))}
            />
          </section>
        </div>

        {/* Results + Import/Export */}
        <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.75rem", gridTemplateColumns: "2fr 1fr" }}>
          <ResultsBar result={result} />
          <ImportExport
            attacker={attacker}
            defender={defender}
            onImported={(data) => {
              if (data.attacker) setAttacker((prev) => ({ ...prev, ...data.attacker }));
              if (data.defender) setDefender((prev) => ({ ...prev, ...data.defender }));
            }}
          />
        </div>

        {/* Attribution */}
        <div style={{ marginTop: "0.75rem", fontSize: "0.8rem", opacity: 0.8 }}>
          Damage engine and data adapted from <a href="https://github.com/c4vv/pokemmo-damage-calc" target="_blank" rel="noreferrer noopener" style={{ color: "#ffcb05" }}>c4vv/pokemmo-damage-calc</a>.
        </div>
      </div>

      <style>{responsiveCss}</style>
    </div>
  );
}

const panelStyle: React.CSSProperties = {
  borderRadius: 12,
  border: "1px solid rgba(255, 203, 5, 0.25)",
  background: "linear-gradient(135deg, rgba(10,10,10,0.7), rgba(20,20,20,0.7))",
  padding: "0.75rem",
};

const panelTitleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "0.5rem",
  fontSize: "0.95rem",
  color: "#ffcb05",
};

function LabeledInput(props: {
  id: string;
  label: string;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  title?: string;
}) {
  const { id, label, type = "text", value, onChange, min, max, step, title } = props;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label htmlFor={id} style={{ fontSize: 12, opacity: 0.85 }}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        title={title}
        style={inputStyle}
      />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  height: 32,
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(0,0,0,0.35)",
  color: "#fff",
  padding: "0 0.5rem",
  outline: "none",
  boxShadow: "0 0 0 0 rgba(0,0,0,0)",
};

function CalcSidePanel({
  side,
  value,
  onChange,
  onMovesChange,
  onSelectMove,
  selectedMove,
}: {
  side: "attacker" | "defender";
  value: PokemonSet;
  onChange: (partial: Partial<PokemonSet>) => void;
  onMovesChange?: (moves: string[]) => void;
  onSelectMove?: (move: string) => void;
  selectedMove?: string;
}) {
  const prefix = side === "attacker" ? "atk" : "def";
  const speciesNames = React.useMemo(() => getSpeciesList().map((s) => s.name), []);
  const [speciesSuggestions, setSpeciesSuggestions] = React.useState<string[]>([]);
  return (
    <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr" }}>
      <div style={{ gridColumn: "1 / -1" }}>
        <label htmlFor={`${prefix}-species`} style={{ fontSize: 12, opacity: 0.85 }}>Species</label>
        <AutocompleteInput
          value={value.species}
          onChange={(val) => onChange({ species: val })}
          placeholder="Search species..."
          suggestions={speciesSuggestions}
          onSearch={(q) => {
            const query = (q || "").toLowerCase();
            if (!query) { setSpeciesSuggestions([]); return; }
            const next = speciesNames.filter((n) => n.toLowerCase().includes(query)).slice(0, 12);
            setSpeciesSuggestions(next);
          }}
          style={{ height: 32 }}
        />
      </div>
      <LabeledInput id={`${prefix}-level`} label="Level" type="number" min={1} max={100} value={value.level} onChange={(e) => onChange({ level: Number(e.target.value) })} />
      <LabeledInput id={`${prefix}-nature`} label="Nature" value={value.nature} onChange={(e) => onChange({ nature: e.target.value })} />
      <LabeledInput id={`${prefix}-item`} label="Item" value={value.item} onChange={(e) => onChange({ item: e.target.value })} />
      <LabeledInput id={`${prefix}-ability`} label="Ability" value={value.ability} onChange={(e) => onChange({ ability: e.target.value })} />
      <LabeledInput id={`${prefix}-status`} label="Status" value={value.status} onChange={(e) => onChange({ status: e.target.value })} />

      {(["hp", "atk", "def", "spa", "spd", "spe"] as const).map((stat) => (
        <LabeledInput
          key={`${prefix}-iv-${stat}`}
          id={`${prefix}-iv-${stat}`}
          label={`IV ${stat.toUpperCase()}`}
          type="number"
          min={0}
          max={31}
          value={value.ivs[stat]}
          onChange={(e) => onChange({ ivs: { ...value.ivs, [stat]: Number(e.target.value) } })}
        />
      ))}

      {(["hp", "atk", "def", "spa", "spd", "spe"] as const).map((stat) => (
        <LabeledInput
          key={`${prefix}-ev-${stat}`}
          id={`${prefix}-ev-${stat}`}
          label={`EV ${stat.toUpperCase()}`}
          type="number"
          min={0}
          max={252}
          step={4}
          value={value.evs[stat]}
          onChange={(e) => onChange({ evs: { ...value.evs, [stat]: Number(e.target.value) } })}
        />
      ))}

      {side === "attacker" && onMovesChange && (
        <div style={{ gridColumn: "1 / -1", display: "grid", gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ fontSize: 12, opacity: 0.85 }}>Moves</label>
            <div style={{ display: "flex", gap: 6 }}>
              {value.moves?.map((m, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectMove && onSelectMove(m)}
                  style={{
                    padding: "0.3rem 0.6rem",
                    borderRadius: 8,
                    border: selectedMove === m ? "1px solid rgba(255, 203, 5, 0.6)" : "1px solid rgba(255,255,255,0.2)",
                    background: selectedMove === m ? "rgba(255, 203, 5, 0.15)" : "rgba(0,0,0,0.3)",
                    color: selectedMove === m ? "#ffcb05" : "#fff",
                    cursor: "pointer",
                  }}
                >
                  {m || "(move)"}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gap: 6, gridTemplateColumns: "1fr 1fr" }}>
            {(value.moves || [""]).slice(0, 4).map((m, idx) => (
              <input
                key={idx}
                value={m}
                onChange={(e) => {
                  const next = [...(value.moves || [])];
                  next[idx] = e.target.value;
                  onMovesChange(next);
                }}
                placeholder={`Move ${idx + 1}`}
                style={inputStyle}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FieldPanel({ value, onChange }: { value: FieldState; onChange: (f: FieldState) => void }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <LabeledInput id="weather" label="Weather" value={value.weather || ""} onChange={(e) => onChange({ ...value, weather: e.target.value })} title="Rain, Sun, Sand, Hail, etc." />
      <LabeledInput id="terrain" label="Terrain" value={value.terrain || ""} onChange={(e) => onChange({ ...value, terrain: e.target.value })} title="Electric, Grassy, Misty, Psychic" />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 12 }}>
          <input type="checkbox" checked={!!value.hazards?.rocks} onChange={(e) => onChange({ ...value, hazards: { ...(value.hazards || {}), rocks: e.target.checked } })} /> Stealth Rock
        </label>
        <label style={{ fontSize: 12 }}>
          Spikes
          <input
            type="number"
            min={0}
            max={3}
            value={value.hazards?.spikes || 0}
            onChange={(e) => onChange({ ...value, hazards: { ...(value.hazards || {}), spikes: Number(e.target.value) } })}
            style={{ ...inputStyle, width: 64, height: 28, marginLeft: 6 }}
          />
        </label>
        <label style={{ fontSize: 12 }}>
          Toxic Spikes
          <input
            type="number"
            min={0}
            max={2}
            value={value.hazards?.tspikes || 0}
            onChange={(e) => onChange({ ...value, hazards: { ...(value.hazards || {}), tspikes: Number(e.target.value) } })}
            style={{ ...inputStyle, width: 64, height: 28, marginLeft: 6 }}
          />
        </label>
      </div>
      <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12 }} title="Ignores some boosts, higher damage rolls">
        <input type="checkbox" checked={!!value.isCrit} onChange={(e) => onChange({ ...value, isCrit: e.target.checked })} /> Critical Hit
      </label>
    </div>
  );
}

function ResultsBar({ result }: { result: CalcResult | null }) {
  const text = result ? `${result.minPercent} - ${result.maxPercent}%` : "—%";
  const ko = result ? result.hitsToKOText : "—";
  return (
    <div
      aria-live="polite"
      style={{
        borderRadius: 10,
        padding: "0.75rem",
        background: "linear-gradient(135deg, rgba(15,15,15,0.8), rgba(30,30,30,0.8))",
        border: "1px solid rgba(255, 203, 5, 0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div>
        <div style={{ fontSize: 14, color: "#ffcb05" }}>Result</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{text}</div>
      </div>
      <div style={{ opacity: 0.85 }}>KO chance: {ko}</div>
    </div>
  );
}

function ImportExport({
  attacker,
  defender,
  onImported,
}: {
  attacker: PokemonSet;
  defender: PokemonSet;
  onImported: (d: { attacker?: PokemonSet; defender?: PokemonSet }) => void;
}) {
  const [text, setText] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const doImport = async () => {
    setBusy(true);
    try {
      const parsed = await adapterImport(text);
      onImported(parsed || {});
    } finally {
      setBusy(false);
    }
  };
  const doExport = async () => {
    setBusy(true);
    try {
      const blob = await adapterExport({ attacker, defender });
      await navigator.clipboard.writeText(blob || "");
    } catch {
      // ignore
    } finally {
      setBusy(false);
    }
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label htmlFor="ie" style={{ fontSize: 12, opacity: 0.85 }}>Import/Export (compatible with c4vv)</label>
      <textarea
        id="ie"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        style={{
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(0,0,0,0.35)",
          color: "#fff",
          padding: "0.5rem",
          resize: "vertical",
        }}
        placeholder={"Paste set/moves here..."}
      />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button type="button" style={buttonSecondary} onClick={doImport} disabled={busy}>Import</button>
        <button type="button" style={buttonPrimary} onClick={doExport} disabled={busy}>Copy Result</button>
      </div>
    </div>
  );
}

const buttonPrimary: React.CSSProperties = {
  background: "linear-gradient(45deg, #ffd700, #ffed4a)",
  color: "#000",
  border: "none",
  padding: "0.5rem 0.9rem",
  borderRadius: 8,
  fontWeight: 700,
  cursor: "pointer",
};

const buttonSecondary: React.CSSProperties = {
  background: "rgba(255,255,255,0.1)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.2)",
  padding: "0.5rem 0.9rem",
  borderRadius: 8,
  fontWeight: 600,
  cursor: "pointer",
};

const responsiveCss = `
@media (max-width: 1100px) {
  div[style*="grid-template-columns: 1fr 1fr 1fr"] { grid-template-columns: 1fr 1fr !important; }
}
@media (max-width: 700px) {
  div[style*="grid-template-columns: 1fr 1fr 1fr"],
  div[style*="grid-template-columns: 1fr 1fr "] { grid-template-columns: 1fr !important; }
}
`;


