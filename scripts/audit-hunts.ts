import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { supabase } from '../app/services/supabase';
import { getSpeciesList, getValidLocations, getMethodsForSpecies, isMethodValidForLocation, canonicalizeMethod, getRawLocationsForSpecies } from '../app/lib/pokedex';

// Utility: ensure dir
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function normalizeString(v: string | null | undefined): string {
  return (v || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // accents
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, '-') // dashes
    .replace(/[^a-z0-9\-\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function catalogueAudit() {
  const species = getSpeciesList();
  const perMethodFailures: Record<string, any[]> = {};
  const failures: any[] = [];
  let combosChecked = 0;

  for (const s of species) {
    const rawLocs = getRawLocationsForSpecies(s.id);
    const methods = Array.from(new Set([
      ...getMethodsForSpecies(s.id),
      '5x Horde', '3x Horde', 'Single/Lures', 'Fishing', 'Egg Hunt', 'Fossil', 'Safari', 'Honey'
    ]));

    // Build unique region/area pairs from raw locations
    const pairs = Array.from(new Map(rawLocs.map(l => {
      const key = `${l.region ?? ''}|${l.area ?? ''}`;
      return [key, { region: l.region, area: l.area }];
    })).values());

    for (const pair of pairs) {
      for (const displayMethod of methods) {
        const canon = canonicalizeMethod(displayMethod);
        if (canon === 'unknown') continue;
        combosChecked++;
        const ok = isMethodValidForLocation(s.id, pair.region, pair.area, displayMethod);
        if (!ok) {
          const item = {
            speciesId: s.id,
            speciesName: s.name,
            methodDisplay: displayMethod,
            methodCanonical: canon,
            region: pair.region,
            area: pair.area,
            norm: {
              region: normalizeString(pair.region),
              area: normalizeString(pair.area),
            }
          };
          failures.push(item);
          if (!perMethodFailures[canon]) perMethodFailures[canon] = [];
          perMethodFailures[canon].push(item);
        }
      }
    }
  }

  return { combosChecked, failures, perMethodFailures };
}

async function databaseAudit() {
  const results: any[] = [];
  let rowsChecked = 0;

  // Try to scope to user if env provided; otherwise, rely on RLS to filter
  const userId = process.env.AUDIT_USER_ID;
  let query = supabase.from('shiny_hunts').select('id,pokemon_id,pokemon_name,method,region,area,location,rarity,phase_count,total_encounters,is_completed,is_phase,parent_hunt_id,start_date,found_at,created_at,user_id');
  if (userId) query = query.eq('user_id', userId);
  const { data, error } = await query;
  if (error) {
    return { rowsChecked: 0, failures: [{ error: error.message }] };
  }

  for (const r of (data || [])) {
    rowsChecked++;
    const methodDisplay: string = r.method || '';
    const ok = isMethodValidForLocation(r.pokemon_id, r.region ?? null, r.area ?? null, methodDisplay);
    if (!ok) {
      const canon = canonicalizeMethod(methodDisplay);
      results.push({
        id: r.id,
        pokemon_id: r.pokemon_id,
        pokemon_name: r.pokemon_name,
        methodDisplay,
        methodCanonical: canon,
        region: r.region,
        area: r.area,
        location: r.location,
        note: canon === 'unknown' ? 'Unknown method label; consider normalizing method to a supported key' : 'Validator mismatch for dataset/labels',
        suggestion: canon === 'unknown' ? 'Use one of: Single/Lures, 5x Horde, 3x Horde, Fishing, Safari, Egg Hunt, Fossil, Honey' : undefined,
      });
    }
  }

  return { rowsChecked, failures: results };
}

(async () => {
  const started = Date.now();
  const reportsDir = path.resolve('reports');
  ensureDir(reportsDir);

  const cat = await catalogueAudit();
  const db = await databaseAudit();

  const summary = {
    durationMs: Date.now() - started,
    combosChecked: cat.combosChecked,
    catalogueFailures: cat.failures.length,
    dbRowsChecked: db.rowsChecked,
    dbFailures: db.failures.length,
  };

  const out = {
    summary,
    top10CatalogueFailures: cat.failures.slice(0, 10),
    perMethodCatalogueFailureCounts: Object.fromEntries(Object.entries(cat.perMethodFailures).map(([k, v]) => [k, v.length])),
    databaseFailures: db.failures,
  };

  const outPath = path.join(reportsDir, 'hunt-validation.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf-8');

  // Console summary
  console.log('Hunt validation audit');
  console.log(`- Combos checked: ${summary.combosChecked}`);
  console.log(`- Catalogue failures: ${summary.catalogueFailures}`);
  console.log(`- DB rows checked: ${summary.dbRowsChecked}`);
  console.log(`- DB failures: ${summary.dbFailures}`);
  console.log(`- Report: ${outPath}`);

  if (cat.failures.length > 0 || db.failures.length > 0) {
    process.exitCode = 1;
  }
})();


