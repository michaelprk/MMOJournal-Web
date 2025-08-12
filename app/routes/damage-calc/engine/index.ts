// Adapter over c4vv/pokemmo-damage-calc compiled JS in third_party.
import type { CalcRequest, CalcResult } from "../engine-adapter";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const calc = require("../../../../third_party/pokemmo-damage-calc/calc/index.js");

export function calculate(req: CalcRequest): CalcResult {
  const gen = calc.Generations.get(5); // PokeMMO base (BW mechanics)
  const atk = new calc.Pokemon(gen, req.attacker.species || "Bulbasaur", {
    level: req.attacker.level,
    nature: req.attacker.nature || "Serious",
    ability: req.attacker.ability || undefined,
    item: req.attacker.item || undefined,
    status: req.attacker.status || "",
    ivs: req.attacker.ivs,
    evs: req.attacker.evs,
    moves: (req.attacker.moves || []).map((m) => ({ name: m || "Tackle" })),
  });
  const def = new calc.Pokemon(gen, req.defender.species || "Squirtle", {
    level: req.defender.level,
    nature: req.defender.nature || "Serious",
    ability: req.defender.ability || undefined,
    item: req.defender.item || undefined,
    status: req.defender.status || "",
    ivs: req.defender.ivs,
    evs: req.defender.evs,
  });
  const move = new calc.Move(gen, req.move || "Tackle", {});
  const field = new calc.Field({
    weather: req.field.weather || undefined,
    terrain: req.field.terrain || undefined,
  });
  const result = calc.calculate(gen, atk, def, move, field);
  // result is a complex object; map to our simplified shape
  const desc = result.range();
  const rolls = result.rawDesc ? result.rawDesc().rolls : undefined;
  const min = Math.round((desc[0] / def.maxHP()) * 100);
  const max = Math.round((desc[1] / def.maxHP()) * 100);
  return {
    minPercent: min,
    maxPercent: max,
    hitsToKOText: result.kochance ? result.kochance().text : "",
    rawRolls: Array.isArray(rolls) ? rolls : [],
  } as CalcResult;
}

export function parseImport(_input: string) {
  // TODO: wire to c4vv import once identified. Placeholder for now.
  return {};
}

export function serialize(_state: any) {
  // TODO: implement Showdown-like export compatible with c4vv if available.
  return "";
}


