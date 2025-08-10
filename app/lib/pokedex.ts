import monstersData from '../../data/pokedex/monsters.json';

type RawLocation = {
  type?: string; // method
  region_name?: string | null;
  location?: string | null; // area
  rarity?: string | null;
  // other fields ignored
};

type RawMonster = {
  id: number;
  name: string;
  types?: string[]; // optional
  locations?: RawLocation[]; // optional
};

const monsters: RawMonster[] = (monstersData as unknown as RawMonster[]) || [];

function findMonsterById(speciesId: number): RawMonster | undefined {
  if (!Number.isFinite(speciesId)) return undefined;
  return monsters.find((m) => m && typeof m.id === 'number' && m.id === speciesId);
}

export function getSpeciesList(): Array<{ id: number; name: string }> {
  return monsters
    .filter((m) => m && typeof m.id === 'number' && typeof m.name === 'string')
    .map((m) => ({ id: m.id, name: m.name }));
}

export function getTypesForSpecies(speciesId: number): string[] {
  const monster = findMonsterById(speciesId);
  if (!monster || !Array.isArray(monster.types)) return [];
  return Array.from(new Set(monster.types.filter(Boolean)));
}

export function getMethodsForSpecies(speciesId: number): string[] {
  const monster = findMonsterById(speciesId);
  if (!monster || !Array.isArray(monster.locations)) return [];
  const methods = monster.locations
    .map((loc) => (loc?.type || '').trim())
    .filter((m) => m);
  return Array.from(new Set(methods));
}

export function getValidLocations(
  speciesId: number
): Array<{ label: string; value: string; region: string | null; area: string | null; method: string; rarity: string | null }> {
  const monster = findMonsterById(speciesId);
  if (!monster || !Array.isArray(monster.locations)) return [];

  const dedupe = new Set<string>();
  const results: Array<{ label: string; value: string; region: string | null; area: string | null; method: string; rarity: string | null }> = [];

  for (const loc of monster.locations) {
    if (!loc) continue;
    const method = (loc.type || '').trim();
    if (!method) continue;
    const region = loc.region_name ?? null;
    const area = loc.location ?? null;
    const rarity = loc.rarity ?? null;

    const key = `${region ?? ''}|${area ?? ''}|${method}|${rarity ?? ''}`;
    if (dedupe.has(key)) continue;
    dedupe.add(key);

    const areaLabel = area ? String(area).toUpperCase() : 'UNKNOWN AREA';
    const regionLabel = region ? region : 'Unknown Region';
    const label = `${regionLabel} — ${areaLabel}`;
    const value = JSON.stringify({ region, area });

    results.push({ label, value, region, area, method, rarity });
  }

  return results;
}

// De-dup location options by (region, area) only
export function getDedupedLocationsForSpecies(
  speciesId: number
): Array<{ label: string; value: string; region: string | null; area: string | null }> {
  const monster = findMonsterById(speciesId);
  if (!monster || !Array.isArray(monster.locations)) return [];

  const dedupe = new Set<string>();
  const results: Array<{ label: string; value: string; region: string | null; area: string | null }> = [];

  for (const loc of monster.locations) {
    if (!loc) continue;
    const region = loc.region_name ?? null;
    const area = loc.location ?? null;
    const key = `${region ?? ''}|${area ?? ''}`;
    if (dedupe.has(key)) continue;
    dedupe.add(key);

    const areaLabel = area ? String(area).toUpperCase() : 'UNKNOWN AREA';
    const regionLabel = region ? region : 'Unknown Region';
    const label = `${regionLabel} — ${areaLabel}`;
    const value = JSON.stringify({ region, area });
    results.push({ label, value, region, area });
  }

  return results;
}

// Validate species×method×location compatibility (loosely grouped by encounter types)
export function isMethodValidForLocation(
  speciesId: number,
  region: string | null,
  area: string | null,
  method: string
): boolean {
  const monster = findMonsterById(speciesId);
  if (!monster || !Array.isArray(monster.locations)) return false;
  const m = (method || '').toLowerCase();

  const methodMatchesType = (locTypeRaw?: string) => {
    const t = (locTypeRaw || '').toLowerCase();
    if (!t) return false;
    if (m.includes('horde')) return t.includes('horde');
    if (m.includes('lure') || m.includes('single')) return t.includes('grass') || t.includes('lure') || t.includes('single');
    if (m.includes('safari')) return t.includes('safari');
    if (m.includes('fishing') || m.includes('rod')) return t.includes('rod') || t.includes('fishing');
    if (m.includes('egg')) return true; // allow anywhere
    if (m.includes('fossil')) return t.includes('fossil');
    if (m.includes('honey')) return t.includes('honey') || t.includes('headbutt');
    return true; // fallback permissive
  };

  return monster.locations.some((loc) => {
    const r = loc.region_name ?? null;
    const a = loc.location ?? null;
    if (r !== region || a !== area) return false;
    return methodMatchesType(loc.type);
  });
}

export function getSpeciesAtLocation(region: string | null, area: string | null): Array<{ id: number; name: string }> {
  const seen = new Set<number>();
  const species: Array<{ id: number; name: string }> = [];
  for (const monster of monsters) {
    if (!monster?.id || !monster?.name || !Array.isArray(monster.locations)) continue;
    if (monster.locations.some((l) => (l?.region_name ?? null) === region && (l?.location ?? null) === area)) {
      if (!seen.has(monster.id)) {
        seen.add(monster.id);
        species.push({ id: monster.id, name: monster.name });
      }
    }
  }
  return species;
}

export function validateEncounter(
  speciesId: number,
  params: { region?: string | null; area?: string | null; method: string }
): boolean {
  const monster = findMonsterById(speciesId);
  if (!monster || !Array.isArray(monster.locations)) return false;
  const targetMethod = (params.method || '').trim();
  if (!targetMethod) return false;
  const targetRegion = params.region ?? null;
  const targetArea = params.area ?? null;

  return monster.locations.some((loc) => {
    if (!loc) return false;
    const method = (loc.type || '').trim();
    const region = loc.region_name ?? null;
    const area = loc.location ?? null;
    if (method !== targetMethod) return false;
    const regionMatches = region === targetRegion;
    const areaMatches = area === targetArea;
    return regionMatches && areaMatches;
  });
}


