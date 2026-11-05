# Local SEO plan: muszakiellenorborsod.hu

Goal: more people in Borsod and the neighbouring counties find Czidor Imre when they
search for a construction inspector (műszaki ellenőr) or a responsible site manager
(felelős műszaki vezető, FMV), without cluttering the main page.

Realistic expectation: a modest gain over 2 to 4 months. The town and guide pages can
bring a few extra visitors a month and a couple of extra enquiries a year. The Google
Business Profile (step 3) will likely matter more than everything else here combined.

---

## 1. Done (branch `ccr-b438c41b-mwgngb`, not live yet)

### Main page
- Title, meta description and hero mention Borsod-Abaúj-Zemplén.
- One small visible addition: a "Részletesen" link row under the FAQ (to the guide
  pages). The town links sit in a "Szolgáltatási terület" column in the footer, on
  every page. Nothing else changed: no new menu items, no new sections.

### Town pages (9)
- Generated at `/muszaki-ellenor/<town>/` by `src/pages/muszaki-ellenor/[varos].astro`
  from `src/data/towns.ts` and `src/data/projects.ts`.
- **Only towns with at least one own reference get a page:** Mezőkövesd, Tiszaújváros,
  Eger, Bogács, Berente, Szikszó, Bükkaranyos, Debrecen, Hajdúszoboszló.
- The 15 towns without references (Kazincbarcika, Ózd, Sárospatak etc.) were removed on
  purpose: with no own project they would be thin "doorway" pages.
- **Page content** comes only from real data:
  - the town's own projects
  - the nearest other projects, with distances
  - distance from Miskolc
  - links to nearby towns
  - the standard contact block
- Each page has its own title, meta description, JSON-LD (business + breadcrumb) and canonical URL.

### Guide pages (5)
- In `src/pages/tudnivalok/`, listed in `src/data/topics.ts`:
  - `/tudnivalok/mikor-kotelezo-a-muszaki-ellenor/`
  - `/tudnivalok/muszaki-ellenor-feladatai/`
  - `/tudnivalok/muszaki-ellenor-csaladi-haz/`
  - `/tudnivalok/felelos-muszaki-vezeto/`
  - `/tudnivalok/muszaki-ellenor-dija/`
- Text is mostly the site's own earlier content (recovered from git history) plus the FAQ.

### Shared parts
- Layout `src/layouts/SubPage.astro`; components `ProjectCard`, `GuideHero`,
  `GuideLinks`. `Header` and `Footer` take a `base` prop so their section links work
  from subpages. `Footer` also lists the town pages.

## 2. Go live (this week)

- [ ] **Imre verifies** these, because they are general knowledge, not his own text:
  - the FMV duties list in `src/pages/tudnivalok/felelos-muszaki-vezeto.astro`
  - the "Mikor van építési napló?" paragraph (in `mikor-kotelezo-a-muszaki-ellenor.astro`)
  - that the mandatory-cases list in
    `src/pages/tudnivalok/mikor-kotelezo-a-muszaki-ellenor.astro` still matches current rules
- [ ] Fill in the real company registration number (cégjegyzékszám) in
  `src/pages/impresszum.astro` (currently `05-09-XXXXXX`) and delete the
  "XXXX" note below it. A visible placeholder hurts trust.
- [ ] Merge the branch into `main` so Cloudflare deploys it.
- [ ] Spot-check a few live pages, e.g. `/muszaki-ellenor/mezokovesd/`,
  `/muszaki-ellenor/debrecen/` and `/tudnivalok/felelos-muszaki-vezeto/`.
- [ ] Google Search Console:
  - verify the domain
  - submit `https://muszakiellenorborsod.hu/sitemap-index.xml`
  - use URL Inspection on the main page, 3 to 4 town pages and the guide pages, and request indexing
- [ ] Bing Webmaster Tools (after Search Console is verified, about 5 minutes).
  Bing also feeds ChatGPT search and Copilot.
  - go to bing.com/webmasters and sign in with a Microsoft account
  - choose "Import from Google Search Console" and pick the muszakiellenorborsod.hu
    property; it brings over verification and the sitemap
- [ ] Cloudflare dashboard > Caching > Configuration > **Crawler Hints: On**. Cloudflare
  then notifies Bing (IndexNow) by itself whenever a page changes.

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
| Week 2 | Search Console > Pages: are the town and guide pages indexed? | Request indexing for any that aren't. |
| Month 1 | Search Console > Performance: which searches show the site? | Note the terms. Adjust the main page and guide wording toward the ones that show up. |
| Month 3 | Pages still "Crawled, not indexed" | For a guide page: improve or merge it into another. For a town page: leave it unless it stays unindexed for months. |
| Ongoing | New finished project | Add it to `src/data/projects.ts`. It appears on the main page and on the right town page automatically. If it is in a new town, see section 7. |

## 6. Rules to keep it safe

- Don't add towns just to have more pages. A town gets a page only once he has a
  finished project there. The page template does not enforce this, so check before
  adding a `t(...)` line.
- Never write invented local text. Everything on the town pages comes from the
  project list, which keeps them from being treated as spam pages.
- Guide pages carry only text Imre has approved. No invented prices, cases or quotes.
- Keep the main page focused. Town links stay in the footer and guide links in the FAQ
  row, never in the main menu.
- **Known risk:** the footer "Szolgáltatási terület" toggle is the same colour as the
  footer background (owner's decision). Google's spam policies name same-colour text and
  links. If Search Console ever shows a manual action, or the town pages drop out of
  the index, make it visible first: change `color: var(--paper-2)` on `.ftr-area summary`
  in `src/styles/global.css` to `var(--faint)`.

## 7. How to add things

- **New project:** add one entry to `projects` in `src/data/projects.ts`
  (title, town, year, role `me` or `fmv`, category, short description).
- **New town:** add its coordinates to `coords` and one `t(...)` line to `towns` in
  `src/data/towns.ts` (slug, name, locative form like "Egerben", county if not Borsod).
  Only for a town with at least one project in `projects.ts`.
- **New guide page:** add a `.astro` file in `src/pages/tudnivalok/` (copy an existing
  one) and one entry to `topics` in `src/data/topics.ts`.
