# CZIDOR & Partners — Projekt terv

Kollaboratív AEC csapat weboldala (Építész · Tartószerkezet · Kivitelezés).

## 1. Kontextus

A megrendelő **Czidor Imre** (GÉP-M 2001 Kft.) — 1984 óta az építőiparban dolgozó felelős műszaki vezető és építési műszaki ellenőr. A brief ugyanakkor egy háromtagú, multidiszciplináris csapatot ír le (Építész, Tartószerkezeti tervező, Kivitelezés-vezető). A megoldás: **Czidor Imre valós adatai** (jogosultságok, referenciák, elérhetőség, céges háttér) töltik fel a **Kivitelezés / Műszaki ellenőrzés** pillért, a másik két szerep pedig **jelölt placeholder-profilként** jelenik meg — egyértelműen jelölve, hogy ezek később tényleges csapattagokkal cserélendők.

## 2. Célközönség

- **Magánmegrendelők** (családi ház, társasház építtetők, felújítók)
- **Ingatlanfejlesztők** (OTP Ingatlan–jellegű beruházók)
- **Közintézmények és közbeszerzők** (Kbt. hatálya alatti projektek)
- **Ipari beruházók** (csarnokok, technológiai alapozások)

## 3. Tartalmi stratégia

Egyetlen landing oldal, szekcionált scroll-narratívával. A felhasználó érkezik → három perc alatt látja a **differenciátort**, a **szolgáltatásokat**, a **referenciákat**, a **hitelességet**, és el tud indítani egy **ajánlatkérést**.

## 4. Technológiai stack

| Réteg | Választás | Indok |
|---|---|---|
| Keretrendszer | Astro 5 | Island Architecture → minimális JS, magas Lighthouse |
| Stílus | Tailwind CSS v4 (via `@tailwindcss/vite`) | Design-token alapú, utility-first, gyors iteráció |
| Nyelv | TypeScript strict | Típusbiztos komponensek és adatok |
| Fontok | Inter + Space Grotesk (Google Fonts) | Geometriai sans-serif, technikai karakter |
| Ikonok | Astroicon / inline SVG | Nincs runtime dependency |

## 5. Fájlstruktúra

```
apa-weboldal/
├── plan.md                          # ez a dokumentum
├── package.json
├── astro.config.mjs
├── tsconfig.json
├── tailwind.config.ts               # (v4-ben opcionális, tokenekhez)
├── public/
│   ├── favicon.svg
│   └── og-image.svg
└── src/
    ├── layouts/
    │   └── BaseLayout.astro         # <html>, meta, fontbetöltés, <slot/>
    ├── components/
    │   ├── Header.astro             # sticky nav, mobil menü island
    │   ├── Footer.astro
    │   ├── Hero.astro               # differenciátor + CTA
    │   ├── Services.astro           # 3 pillér (Építészet / Mérnöki / Kivitelezés)
    │   ├── Portfolio.astro          # szűrhető grid (Lakó / Közép / Ipari)
    │   ├── BeforeAfter.astro        # kliens island — csúszka
    │   ├── Trust.astro              # jogosultságok + referencia számok + testimonials
    │   ├── Team.astro               # 3 profil kártya
    │   ├── Contact.astro            # űrlap + térkép placeholder
    │   └── MobileNav.tsx            # React/Preact island (hamburger)
    ├── data/
    │   ├── services.ts
    │   ├── projects.ts              # Czidor Imre valós referenciái
    │   ├── credentials.ts
    │   └── team.ts
    ├── pages/
    │   └── index.astro
    └── styles/
        └── global.css               # @import "tailwindcss" + tokenek
```

## 6. Design rendszer

### Színek (blueprint-ihlette paletta)

| Token | Hex | Használat |
|---|---|---|
| `ink` | `#0B0F14` | Elsődleges szöveg, dark surface |
| `slate-900` | `#11202E` | Hero háttér |
| `slate-700` | `#1E3A5F` | Blueprint kék, másodlagos UI |
| `slate-300` | `#8AA6BF` | Segédszöveg |
| `paper` | `#F6F5F1` | Alap háttér (meleg off-white) |
| `paper-2` | `#ECEAE3` | Kártya háttér |
| `line` | `#D8D3C8` | Vonalak, rács |
| `safety` | `#EA580C` | Akcent (CTA, hangsúly) |
| `safety-ink` | `#7A2E06` | Akcent hover / dark |

Kontrasztok: a fő szöveg `ink` on `paper` → ~18:1, a `safety` on `paper` → ~4.9:1 (WCAG AA ✓). A `safety`-t **csak** hangsúly-elemekre használjuk (max. 3 előfordulás / screen).

### Tipográfia

- **Headings:** Space Grotesk, 600 — `clamp(2rem, 5vw, 4.5rem)` skála
- **Body:** Inter, 400/500 — 16/18px alap, `1.6` sorhatár
- **Labels/mono:** Space Grotesk uppercase 11px, `tracking-[0.2em]` (blueprint-os „TECHNICAL DRAWING" feeling)

### Rács és térközök

- Konténer: `max-w-[1280px]`, oldal-padding `clamp(1.25rem, 4vw, 3rem)`
- 12-oszlopos CSS grid szekciónként (blueprint rács)
- Szekció spacing: `py-24 md:py-32`
- Vékony `1px solid line` elválasztók szekciók közt — blueprint „tervlap" vizuál

### Motion

- Csak `prefers-reduced-motion: no-preference` esetén
- Finom fade-up szekció-belépéskor (IntersectionObserver), 300 ms, `cubic-bezier(0.2, 0.8, 0.2, 1)`
- Hover: vonal-animációk (underline expand), nem scale/shadow

## 7. Szekció-tervek

### 7.1 Hero
- **H1**: „A tervezéstől a kulcsrakész átadásig — mérnöki precizitás, építészeti látásmód."
- **Sub**: 1984 óta az építőiparban · Több mint 25 kiemelt referencia · MÉK / MMK jogosultság
- **CTA**: „Ajánlatkérés" (primary, safety) + „Referenciáink" (ghost)
- Blueprint rács háttér (SVG, `opacity-[0.06]`)
- Jobb oldalon: „műszaki adatlap" panel, amely a cég jogosultság-számait mutatja

### 7.2 Services — három pillér
1. **Építészet** — koncepció, engedélyezési és kiviteli tervdokumentáció, építészeti látványtervek
2. **Mérnöki megoldások** — tartószerkezeti tervezés, épületgépészet-koordináció, statikai szakvélemény
3. **Kivitelezés** — generálkivitelezés, felelős műszaki vezetés, építési műszaki ellenőrzés, költségvetés-felülvizsgálat, elektronikus építési napló

Minden pillér: ikon + 2 mondatos leírás + 3-4 aljegyzetes szolgáltatáslista + „Részletek" link.

### 7.3 Portfolio
- 3 szűrő: **Lakóépületek** / **Középületek** / **Ipari létesítmények**
- Responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Minden kártyán: év, helyszín, szerepkör (pl. „Műszaki ellenőrzés"), kategória-tag
- **Kiemelt projekt**: „Előtte / Utána" csúszka (island, `client:visible`) — 2 placeholder projekten
- Adatok: `data/projects.ts` — Czidor Imre valós referenciáiból (Miskolc Perczel Mór 54, Hajdúszoboszló Isonzó 12–14, Debrecen Piac u., Mezőkövesd Ipari Park, Tiszaújváros Birla Carbon, stb.)

### 7.4 Trust & Credentials
- **Jogosultságok:**
  - Építési műszaki ellenőrzés — ME-É-I 05-50111
  - Felelős műszaki vezető magasépítés — MV-Ép/A 05-50111
  - Felelős műszaki vezető mélyépítés — MV-M 05-50111
  - MÉK / MMK kamarai tagság (placeholder a másik két szerephez)
- **Számok:** 40+ év tapasztalat, 25+ kiemelt projekt, 0 komoly munkavédelmi incidens
- **Testimonials:** 3 anonimizált kliens-idézet (placeholder, később cserélendő)

### 7.5 Team
- 3 profil-kártya:
  1. **[Placeholder] Építész** — MÉK 01-0000
  2. **[Placeholder] Tartószerkezeti tervező** — MMK T 00-0000
  3. **Czidor Imre** — Felelős műszaki vezető, Építési műszaki ellenőr
- Minden kártyán: név, szerepkör, jogosultság-szám, rövid bio, LinkedIn-placeholder

### 7.6 Contact
- Form (Astro Actions vagy egyszerű `<form method="POST">` Netlify/Formspree-kompatibilis):
  - Név *, E-mail *, Telefon, Projekt típusa (select: Lakó/Közép/Ipari), Becsült kezdés, Üzenet *
  - Honeypot mező + `aria-live` státusz
- Elérhetőségek: cím, telefon, e-mail (Czidor Imre valós adataival)
- Térkép placeholder: statikus `<iframe>` Google Maps embed, Miskolc — Tömörkény I. u. 21.

## 8. Akadálymentesség (WCAG 2.2 AA)

- [x] Szemantikus landmarkok: `header`, `nav`, `main`, `section` + `aria-labelledby`, `footer`
- [x] Skip-link a fő tartalomhoz
- [x] Minden interaktív elem fókuszolható, látható fókusz-ring (`focus-visible:outline-2 outline-safety`)
- [x] `alt` szöveg minden képen (dekoratív → `alt=""`)
- [x] Form-label kapcsolatok (`<label for>`), hibakezelés `aria-invalid` + `aria-describedby`
- [x] Kontraszt ≥ 4.5:1 body-ra, ≥ 3:1 large textre
- [x] `prefers-reduced-motion` tiszteletben tartva
- [x] `lang="hu"` a `<html>`-en
- [x] Billentyűzet-navigáció: mobil menü Esc-re zár, focus-trap nyitáskor

## 9. Teljesítmény

- Astro SSG (statikus build) — 0 szerveres renderelés
- Island-ek csak ott, ahol muszáj (MobileNav, BeforeAfter, Portfolio-szűrő) — `client:visible` vagy `client:idle`
- Fontok: `font-display: swap` + preload a két subset-re (latin, latin-ext)
- Képek: Astro `<Image>` → AVIF + WebP fallback, méret-attribútum kötelező
- Cél Lighthouse: Performance ≥ 95, Accessibility ≥ 100, SEO ≥ 95

## 10. SEO

- `<title>`: „CZIDOR & Partners · Építészet, Mérnöki tervezés, Generálkivitelezés · Miskolc"
- Meta description (150 karakter)
- OpenGraph + Twitter Card (`og-image.svg`)
- JSON-LD `LocalBusiness` + `ProfessionalService` séma — valós címmel, telefonnal, nyitvatartással
- `robots.txt`, `sitemap.xml` (Astro auto)
- `hreflang="hu"`

## 11. Kiszállítás

A projekt lokálisan futtatható:
```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # ./dist statikus kimenet
npm run preview
```

A `dist/` bármelyik statikus hosztra (Netlify, Vercel, Cloudflare Pages, egyszerű nginx) deployolható.
