import { isMethodValidForLocation } from '../app/lib/pokedex';

function log(speciesId: number, method: string, region: string | null, area: string | null, label: string) {
  const ok = isMethodValidForLocation(speciesId, region, area, method);
  console.log(`${label}: ${ok ? 'VALID' : 'INVALID'}`);
}

// Beldum — Hoenn — METEOR FALLS (Single/Lures)
log(374, 'Single/Lures', 'Hoenn', 'METEOR FALLS', 'Beldum/Hoenn/Meteor Falls Single/Lures');

// Larvesta — Unova — Relic Castle (Single/Lures)
log(636, 'Single/Lures', 'Unova', 'Relic Castle', 'Larvesta/Unova/Relic Castle Single/Lures');

// Bagon Single/Lures spots (example: Hoenn METEOR FALLS as well?)
log(371, 'Single/Lures', 'Hoenn', 'METEOR FALLS', 'Bagon/Hoenn/Meteor Falls Single/Lures');



