// Towns that get their own page under /muszaki-ellenor/<slug>/.
// Each page lists the town's own references (if any) plus the nearest ones,
// so the content comes from real projects, not from swapping the town name.

import { allProjects, type Project } from './projects';

export interface Town {
  slug: string;
  name: string;
  /** Locative form for headings: "Mezőkövesden", "Egerben". */
  loc: string;
  county: string;
  lat: number;
  lon: number;
}

const BAZ = 'Borsod-Abaúj-Zemplén';

// Approximate town-centre coordinates; only used for "kb. X km" distances.
export const OFFICE = { name: 'Miskolc', lat: 48.1035, lon: 20.7784 };

const coords: Record<string, [number, number]> = {
  Miskolc: [OFFICE.lat, OFFICE.lon],
  'Mezőkövesd': [47.8097, 20.5697],
  'Tiszaújváros': [47.9228, 21.0647],
  Eger: [47.9025, 20.3772],
  'Bogács': [47.9036, 20.5306],
  Berente: [48.2386, 20.6703],
  'Szikszó': [48.1958, 20.9306],
  'Bükkaranyos': [47.987, 20.78],
  Debrecen: [47.53, 21.6392],
  'Hajdúszoboszló': [47.4436, 21.3925],
  Kazincbarcika: [48.2531, 20.6456],
  'Ózd': [48.2192, 20.2867],
  'Sajószentpéter': [48.2183, 20.7167],
  Szerencs: [48.1597, 21.2047],
  'Edelény': [48.2964, 20.7361],
  Encs: [48.3306, 21.1217],
  'Sárospatak': [48.3189, 21.5717],
  'Sátoraljaújhely': [48.3953, 21.6553],
  Putnok: [48.2944, 20.4364],
  'Felsőzsolca': [48.1067, 20.8597],
  'Nyékládháza': [47.9939, 20.8378],
  'Emőd': [47.9389, 20.8131],
  'Mezőcsát': [47.8183, 20.9056],
  Tokaj: [48.1214, 21.4103],
  'Füzesabony': [47.75, 20.4097],
};

const t = (slug: string, name: string, loc: string, county = BAZ): Town => {
  const c = coords[name];
  if (!c) throw new Error(`No coordinates for ${name}`);
  return { slug, name, loc, county, lat: c[0], lon: c[1] };
};

// Miskolc has no page of its own: the main page already covers it.
export const towns: Town[] = [
  // Towns with own references
  t('mezokovesd', 'Mezőkövesd', 'Mezőkövesden'),
  t('tiszaujvaros', 'Tiszaújváros', 'Tiszaújvárosban'),
  t('eger', 'Eger', 'Egerben', 'Heves'),
  t('bogacs', 'Bogács', 'Bogácson'),
  t('berente', 'Berente', 'Berentén'),
  t('szikszo', 'Szikszó', 'Szikszón'),
  t('bukkaranyos', 'Bükkaranyos', 'Bükkaranyoson'),
  t('debrecen', 'Debrecen', 'Debrecenben', 'Hajdú-Bihar'),
  t('hajduszoboszlo', 'Hajdúszoboszló', 'Hajdúszoboszlón', 'Hajdú-Bihar'),
  // Larger towns of the county and its edge
  t('kazincbarcika', 'Kazincbarcika', 'Kazincbarcikán'),
  t('ozd', 'Ózd', 'Ózdon'),
  t('sajoszentpeter', 'Sajószentpéter', 'Sajószentpéteren'),
  t('felsozsolca', 'Felsőzsolca', 'Felsőzsolcán'),
  t('nyekladhaza', 'Nyékládháza', 'Nyékládházán'),
  t('emod', 'Emőd', 'Emődön'),
  t('edeleny', 'Edelény', 'Edelényben'),
  t('putnok', 'Putnok', 'Putnokon'),
  t('szerencs', 'Szerencs', 'Szerencsen'),
  t('encs', 'Encs', 'Encsen'),
  t('mezocsat', 'Mezőcsát', 'Mezőcsáton'),
  t('tokaj', 'Tokaj', 'Tokajban'),
  t('sarospatak', 'Sárospatak', 'Sárospatakon'),
  t('satoraljaujhely', 'Sátoraljaújhely', 'Sátoraljaújhelyen'),
  t('fuzesabony', 'Füzesabony', 'Füzesabonyban', 'Heves'),
];

/** Straight-line distance in km, rounded. */
export function km(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(bLat - aLat);
  const dLon = rad(bLon - aLon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

export const kmFromOffice = (town: Town) => km(OFFICE.lat, OFFICE.lon, town.lat, town.lon);

export interface NearbyProject extends Project {
  km: number;
}

export const projectsIn = (town: Town) => allProjects.filter((p) => p.town === town.name);

/**
 * Closest references outside the town, nearest first. At most `perTown` from
 * any single place, so the Miskolc projects don't crowd out everything else.
 */
export function nearbyProjects(town: Town, limit = 6, perTown = 3): NearbyProject[] {
  const used: Record<string, number> = {};
  return allProjects
    .filter((p) => p.town !== town.name)
    .map((p) => {
      const c = coords[p.town];
      return { ...p, km: km(town.lat, town.lon, c[0], c[1]) };
    })
    .sort((a, b) => a.km - b.km)
    .filter((p) => {
      used[p.town] = (used[p.town] ?? 0) + 1;
      return used[p.town] <= perTown;
    })
    .slice(0, limit);
}

/** The closest other towns that have a page, for cross-links. */
export function nearbyTowns(town: Town, limit = 6): (Town & { km: number })[] {
  return towns
    .filter((o) => o.slug !== town.slug)
    .map((o) => ({ ...o, km: km(town.lat, town.lon, o.lat, o.lon) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, limit);
}
