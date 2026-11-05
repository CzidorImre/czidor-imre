# Local SEO plan: muszakiellenorborsod.hu

Goal: more people in Borsod and the neighbouring counties find Czidor Imre when they
search for a construction inspector (műszaki ellenőr) or a responsible site manager
(felelős műszaki vezető, FMV), without cluttering the main page.

Realistic expectation: a modest gain over 2 to 4 months. The town pages can bring a
few extra visitors a month and a couple of extra enquiries a year. The Google
Business Profile (step 3) will likely matter more than everything else here combined.

---

## 1. Done: town pages (branch `ccr-b438c41b-mwgngb`)

- 24 generated pages at `/muszaki-ellenor/<town>/`, from `src/pages/muszaki-ellenor/[varos].astro`.
- **9 towns where he has his own references:** Mezőkövesd, Tiszaújváros, Eger, Bogács,
  Berente, Szikszó, Bükkaranyos, Debrecen, Hajdúszoboszló.
- **15 larger towns with no own references yet:** Kazincbarcika, Ózd, Sajószentpéter,
  Felsőzsolca, Nyékládháza, Emőd, Edelény, Putnok, Szerencs, Encs, Mezőcsát, Tokaj,
  Sárospatak, Sátoraljaújhely, Füzesabony.
- **Page content** comes only from real data:
  - the town's own projects
  - the 6 nearest other projects, with distances
  - distance from Miskolc
  - links to nearby towns
  - the standard contact block
- Each page has its own title, meta description, JSON-LD (business + breadcrumb) and canonical URL.
- **Main page:** the only visible change is a compact "Szolgáltatási terület" strip
  linking to the town pages. Everything else is unchanged.
- Project data now lives in `src/data/projects.ts`, and the list of towns with their
  coordinates in `src/data/towns.ts`.

## 2. Go live (this week)

- [ ] Merge the branch into `main` so Cloudflare deploys it.
- [ ] Spot-check a few live pages, e.g. `/muszaki-ellenor/mezokovesd/` and `/muszaki-ellenor/sarospatak/`.
- [ ] Fill in the real company registration number (cégjegyzékszám) in
  `src/pages/impresszum.astro` (currently `05-09-XXXXXX`) and delete the
  "XXXX" note below it. A visible placeholder hurts trust.
- [ ] Google Search Console:
  - verify the domain
  - submit `https://muszakiellenorborsod.hu/sitemap-index.xml`
  - use URL Inspection on the main page and 3 to 4 town pages, and request indexing

## 3. Google Business Profile (this week, biggest lever)

- [ ] Create or claim the profile for GÉP-M 2001 Kft. / Czidor Imre.
- [ ] Primary category: construction inspector or the closest match available.
  Add "building consultant" or similar as a secondary category.
- [ ] Service area: Borsod-Abaúj-Zemplén plus the bordering parts of Heves and
  Hajdú-Bihar. Hide the street address if clients don't visit the office.
- [ ] Website link to the main page. Phone number and opening hours identical to the site.
- [ ] Add 5 to 10 real photos from projects (sites, finished buildings).
- [ ] Ask 5 to 10 past clients for a Google review. Send them the direct review link.
  This is the single most useful thing on this list.

## 4. Listings and links (next 2 to 4 weeks)

The domain is new and has almost no sites linking to it. Each of these helps:

- [ ] MMK (Hungarian Chamber of Engineers) register: make sure his entry is correct and,
  if the register allows it, links to the website.
- [ ] BOKIK (Borsod chamber of commerce) member directory, if he is a member.
- [ ] Free business directories: Cylex, Arany Oldalak, Firmania and similar. Name,
  address and phone must match the website exactly everywhere.
- [ ] Past clients, architects and contractors he works with: ask for a mention or link
  on their reference pages where it fits.

## 5. Monitor and adjust

| When | Check | Action |
|---|---|---|
| Week 2 | Search Console > Pages: are the town pages indexed? | Request indexing for any that aren't. |
| Month 1 | Search Console > Performance: which searches show the site? | Note the terms. Adjust the main page wording toward the ones that show up. |
| Month 3 | Index status of the 15 towns without own references | If most are still "Crawled, not indexed", remove them (one line each in `src/data/towns.ts`) and keep only the 9 with real projects. |
| Ongoing | New finished project | Add it to `src/data/projects.ts`. It appears on the main page and on the right town page automatically. |

## 6. Rules to keep it safe

- Don't add towns just to have more pages. A new town page is worth it when he has a
  project there or is actively bidding for work there.
- Never write invented local text. Everything on the town pages comes from the
  project list, which keeps them from being treated as spam pages.
- Keep the main page focused. Town links stay in the single strip, never in the main menu.

## 7. How to add things

- **New project:** add one entry to `projects` in `src/data/projects.ts`
  (title, town, year, role `me` or `fmv`, category, short description).
- **New town:** add its coordinates to `coords` and one `t(...)` line to `towns` in
  `src/data/towns.ts` (slug, name, locative form like "Egerben", county if not Borsod).
