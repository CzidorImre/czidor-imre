# Czidor Imre — Építési műszaki ellenőr · weboldal

Egyoldalas marketing weboldal **Czidor Imre** (GÉP-M 2001 Kft., Miskolc) építési
műszaki ellenőri és felelős műszaki vezetői szolgáltatásaihoz. A főoldal
látványeleme egy **görgetésre felépülő 3D családi ház** (Three.js r128).
Astro 5 · TypeScript · vanilla JS island-ök. A teljes szöveg magyar, `lang="hu"`.

## Gyorsindítás

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # statikus build → ./dist
npm run preview   # build előnézet
```

## Struktúra

```
public/
  scene.js        # Three.js r128 jelenet — window.HouseScene.setProgress(0..1)
  site.js         # minden interakció + a listák (referenciák, GYIK, feladatok…) renderelése
  og-image.png    # 1200×630 OG kártya
  robots.txt
src/
  layouts/BaseLayout.astro   # közös <head>: meta, OG/Twitter, fontok, favicon
  components/                # szekciónkénti komponensek (Header, Hero, Services …)
  pages/
    index.astro              # főoldal — összerakja a komponenseket + betölti a scripteket
    impresszum.astro
    adatvedelem.astro
    szakmai-profil.astro     # önálló, A4-re nyomtatható szakmai profil
  styles/global.css          # a teljes dizájn (CSS custom property tokenek)
```

A 3D jelenet és az összes interakció a `public/scene.js` és `public/site.js`
fájlokban él (a prototípusból átemelt vanilla JS). A komponensek a statikus
markupot adják; a dinamikus listákat (`#proj-grid`, `#tasks-acc`, `#faq-acc`,
`#mand-grid`, `#build-steps`) a `site.js` tölti fel a benne lévő adattömbökből.

## ⚠️ Élesítés előtt kitöltendő valós adatok

1. **Formspree végpont** — `public/site.js`, a `FORMSPREE` konstans
   (`https://formspree.io/f/your-id`). Amíg `your-id`-t tartalmaz, az űrlap
   **demó módban** fut (nem küld, csak sikert mutat). Cserélje valós végpontra,
   vagy kösse a projekt saját backendjére.
2. **Cégadatok** — `src/pages/impresszum.astro`: cégjegyzékszám és adószám
   (jelenleg `XXXX` placeholder), valamint a tárhelyszolgáltató adatai.
3. **Domain** — `astro.config.mjs` (`site`), `public/robots.txt`. Jelenleg
   `czidor-imre.hu` placeholder.
4. **MMK jogosultsági számok**, telefon, e-mail, térkép-cím megerősítése
   (jelenleg `…05-50111`).
5. A **megbízói lista** és néhány referenciasor reprezentatív — publikálás előtt
   egyeztetendő a valós ügyféllistával / engedélyekkel.

## Akadálymentesség

- WCAG 2.2 AA kontraszt, szemantikus landmarkok, skip-link, látható fókusz-ring
- `prefers-reduced-motion`: a hero pin összecsukódik, a ház azonnal kész állapotban jelenik meg
- Billentyűzet-navigáció a mobil menüben (Esc zár), `aria-expanded` az akkordionokon és a hamburgeren

## Deployment

A `dist/` mappa bármelyik statikus hosztra tölthető (Netlify, Vercel,
Cloudflare Pages, nginx). A Three.js r128 + OrbitControls jelenleg CDN-ről
(`unpkg.com`) töltődik — zárt környezethez érdemes lokálisan kiszolgálni.
