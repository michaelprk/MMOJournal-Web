// Adapter layer to integrate c4vv/pokemmo-damage-calc engine with MMOJournal UI
// This file defines strongly-typed inputs/outputs and lazy-loads the engine implementation.

export type Nature = string; // TODO: tighten
export type Ability = string; // TODO: tighten
export type Item = string; // TODO: tighten
export type Status = "" | "BRN" | "PAR" | "SLP" | "FRZ" | "PSN" | "TOX";

export interface StatBlock {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export interface PokemonSet {
  species: string;
  level: number;
  nature: Nature;
  ability: Ability;
  item: Item;
  status: Status;
  ivs: StatBlock;
  evs: StatBlock;
  moves?: string[];
}

export interface FieldState {
  weather?: string;
  terrain?: string;
  hazards?: { rocks?: boolean; spikes?: number; tspikes?: number };
  isCrit?: boolean;
}

export interface CalcRequest {
  attacker: PokemonSet;
  defender: PokemonSet;
  field: FieldState;
  move: string;
}

export interface CalcResult {
  minPercent: number;
  maxPercent: number;
  hitsToKOText: string;
  rawRolls: number[];
}

// Lazy engine reference to keep initial bundle small
let engine: any | null = null;

async function ensureEngineLoaded() {
  if (engine) return engine;
  // The actual engine files will be ported under this folder.
  engine = await import("./engine/index");
  return engine;
}

export async function calculateDamage(req: CalcRequest): Promise<CalcResult> {
  const eng = await ensureEngineLoaded();
  // TODO: Map our request to engine-specific structures
  const result = eng.calculate(req);
  return result as CalcResult;
}

export async function importText(input: string): Promise<{ attacker?: PokemonSet; defender?: PokemonSet }>{
  const eng = await ensureEngineLoaded();
  return eng.parseImport(input);
}

export async function exportText(state: { attacker: PokemonSet; defender: PokemonSet }): Promise<string> {
  const eng = await ensureEngineLoaded();
  return eng.serialize(state);
}


