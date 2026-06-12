/* ═══════════════════════════════════════════════════════════
   CZIDOR IMRE — site interactions
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const pad = n => String(n).padStart(2, '0');

  /* ── header scroll state ── */
  const hdr = $('#hdr');
  const onScroll = () => hdr.classList.toggle('scrolled', window.scrollY > 24);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* ── mobile menu ── */
  const burger = $('#burger'), mnav = $('#mnav');
  const setMenu = o => { mnav.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Menü bezárása' : 'Menü megnyitása'); document.body.style.overflow = o ? 'hidden' : ''; };
  burger.addEventListener('click', () => setMenu(!mnav.classList.contains('open')));
  $$('[data-ml]').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ── reveal on scroll ── */
  const io = new IntersectionObserver((ents) => {
    ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  const observeReveal = () => $$('.rv:not(.in)').forEach(el => io.observe(el));

  /* ── SCROLL-BUILT HOUSE: drive 3D build + phase HUD ── */
  (function () {
    const track = $('#hero-track');
    if (!track) return;
    const stepsEl = $('#build-steps');
    const pillPh = $('.build-pill .ph'), pillLb = $('.build-pill .lb');
    const barI = $('#build-bar-i');
    const hint = $('#drag-hint'), hintT = $('#drag-hint-t');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let autoPlaying = false;
    const replayBtn = document.getElementById('replay-btn');

    // 8 construction phases (must roughly mirror scene.js stage ranges)
    const phases = [
      ['Alapozás', 'Foundation', 0.00],
      ['Földszint', 'Ground floor', 0.10],
      ['Üvegezés', 'Glazing', 0.24],
      ['Födém', 'Floor slab', 0.36],
      ['Emelet', 'Upper floor', 0.46],
      ['Tetőszerkezet', 'Roof', 0.62],
      ['Külső munkák', 'Exterior works', 0.74],
      ['Kulcsrakész', 'Handover', 0.86],
    ];
    // build stepper (optional — desktop side dots may be absent)
    if (stepsEl) {
      stepsEl.innerHTML = phases.map((p, i) => `
        <li class="bstep" data-i="${i}">
          <span class="meta"><span class="bn">0${i + 1} / 08</span><span class="lbl">${p[0]}</span></span>
          <span class="pip" aria-hidden="true"></span>
        </li>`).join('');
    }
    const stepEls = stepsEl ? $$('.bstep', stepsEl) : [];

    function activeIndex(p) {
      let idx = 0;
      for (let i = 0; i < phases.length; i++) if (p >= phases[i][2] - 0.001) idx = i;
      return idx;
    }

    let last = -1;
    function paint(p) {
      if (window.HouseScene && window.HouseScene.ready) window.HouseScene.setProgress(p);
      const pct = Math.round(p * 100);
      if (barI) barI.style.width = pct + '%';
      const ai = activeIndex(p);
      if (ai !== last) {
        last = ai;
        stepEls.forEach((el, i) => {
          el.classList.toggle('active', i === ai);
          el.classList.toggle('done', i < ai);
        });
        if (pillPh) pillPh.textContent = `Fázis 0${ai + 1} / 08`;
        if (pillLb) pillLb.textContent = phases[ai][0];
      }
      // hint fades out once the build is under way
      if (hint) {
        hint.style.opacity = p > 0.06 ? '0' : '';
      }
      showReplay(p);
    }

    if (reduced) {
      document.documentElement.classList.add('reduced');
      paint(1);
      return;
    }

    let ticking = false;
    function update() {
      if (autoPlaying) return;
      ticking = false;
      const rect = track.getBoundingClientRect();
      const travel = track.offsetHeight - window.innerHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      paint(p);
    }
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);

    // ── replay: re-watch the build from zero ──
    function showReplay(p) { if (replayBtn) replayBtn.classList.toggle('show', p > 0.985 && !autoPlaying); }
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        if (autoPlaying) return;
        autoPlaying = true;
        replayBtn.classList.remove('show');
        window.scrollTo(0, 0);
        const dur = 3600, t0 = performance.now();
        (function step(now) {
          const k = Math.min(1, (now - t0) / dur);
          const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
          paint(e);
          if (k < 1) requestAnimationFrame(step);
          else { autoPlaying = false; window.scrollTo(0, Math.max(0, track.offsetHeight - window.innerHeight)); }
        })(t0);
      });
    }

    update();
  })();

  /* ── (minimal theme: no cursor-glow / tilt) ── */
  function bindTilt() {}

  /* ── MANDATORY ── */
  const mandates = [
    ['Építési naplóhoz kötött tevékenység', 'Minden olyan kivitelezési tevékenység esetén, amelyhez építési napló vezetése kötelező.'],
    ['Több fővállalkozó kivitelező', 'Ha az építőipari kivitelezést több fővállalkozó kivitelező végzi.'],
    ['Műemléki védelem alatt álló építmény', 'Ha a kivitelezési tevékenység műemléki védelem alatt álló építményt érint.'],
    ['Közbeszerzési (Kbt.) hatály', 'Ha az építési beruházás a Kbt. hatálya alá tartozik.'],
    ['Nemzetgazdasági szempontból kiemelt beruházás', 'Ha a tevékenység ilyen kiemelt ügy tárgyát képezi.'],
    ['Építtetői fedezetkezelő közreműködése', 'Amikor építtetői fedezetkezelő működik közre a beruházásban.'],
    ['Hitelfolyósítási feltétel', 'Ha a pénzintézet a hitelfolyósítás feltételeként írja elő.'],
  ];
  $('#mand-grid').innerHTML = mandates.map((m, i) => `
    <div class="mand rv${i % 2 ? ' rv-d1' : ''}"><div class="n">${pad(i + 1)}</div><div><h3>${m[0]}</h3><p>${m[1]}</p></div></div>`).join('');

  /* ── TASKS accordion ── */
  const taskGroups = [
    ['Folyamatos helyszíni kontroll', ['A kivitelezési tevékenység teljes folyamatának figyelemmel kísérése és ellenőrzése.', 'A munkák szakszerű és biztonságos elvégeztetése.', 'A szakszerűség ellenőrzése a jogerős építési engedély és a jóváhagyott tervdokumentáció alapján.', 'Az engedélyekben és tervdokumentációkban foglaltak betartatása.', 'Műemlék esetén az örökségvédelmi engedélynek való megfelelés ellenőrzése.']],
    ['Kitűzés, felmérések, járulékos munkák', ['Az építmény kitűzése helyességének ellenőrzése.', 'A talajmechanikai, környezetvédelmi és egyéb felmérések megtörténtének ellenőrzése.', 'A biztonságos használathoz szükséges járulékos munkálatok megkövetelése.']],
    ['Építési napló (E-napló és papír alapú)', ['Az elektronikus és papír alapú építési napló(k) ellenőrzése.', 'A bejegyzések és jegyzőkönyvek ellenjegyzése, észrevételezése.', 'A napló hatósági eljárásra való rendelkezésre állásának biztosítása.', 'A hibák, hiányosságok és eltérések feltüntetése a naplóban.']],
    ['Terv- és tervváltoztatási döntések előkészítése', ['Műszaki vagy gazdasági szükségességből indokolt tervváltoztatási javaslatok megtétele.', 'Műszaki kérdésekben az építtető döntéseinek előkészítése.', 'Javaslattétel pl. szakértő bevonására.']],
    ['Minőségi és mennyiségi ellenőrzés', ['Az eltakarásra kerülő szerkezetek mennyiségi és minőségi ellenőrzése.', 'A műszakilag indokolt további vizsgálatok meghatározása.', 'A beépített anyagok, késztermékek megfelelőség-igazolásainak ellenőrzése.', 'A technológiai biztonsági előírások betartásának ellenőrzése.']],
    ['Pénzügyi kontroll, teljesítésigazolás', ['A pénzügyi elszámolások és felmérések ellenőrzése.', 'Teljesítésigazolás kiállítása a fővállalkozó részére.', 'Az átadás-átvételi és birtokbaadási eljárásban való részvétel.']],
    ['Dokumentáció', ['A műszaki ellenőri feladatok elvégzésének dokumentálása az építési naplóban.']],
  ];
  $('#tasks-acc').innerHTML = taskGroups.map((g, i) => `
    <div class="acc-item rv${i === 0 ? ' open' : ''}">
      <button class="acc-h" aria-expanded="${i === 0}">
        <span class="sn">${pad(i + 1)}</span><span class="tt">${g[0]}</span>
        <span class="pm" aria-hidden="true"><svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 2v10M2 7h10" stroke-linecap="round"/></svg></span>
      </button>
      <div class="acc-body"><div class="acc-body-in"><ul class="acc-list">${g[1].map(t => `<li><span class="b"></span><span>${t}</span></li>`).join('')}</ul></div></div>
    </div>`).join('');

  /* ── FAQ ── */
  const faqs = [
    ['Mi a különbség a műszaki ellenőr és a felelős műszaki vezető között?', 'Az építési műszaki ellenőr az építtetőt (a megrendelőt) képviseli, és a kivitelezővel szemben ellenőrzi a minőséget, határidőt és költséget. A felelős műszaki vezető (FMV) ezzel szemben a kivitelező oldalán felel a megvalósítás szakszerűségéért. A két szerep ugyanazon a projekten összeférhetetlen — én bármelyik szerepkört vállalom, de egy projekten csak az egyiket.'],
    ['Mikor kötelező műszaki ellenőrt megbízni?', 'Többek között akkor, ha a kivitelezéshez építési napló kötelező, ha több fővállalkozó dolgozik, műemlék érintett, a beruházás közbeszerzés (Kbt.) hatálya alá esik, nemzetgazdasági szempontból kiemelt, építtetői fedezetkezelő működik közre, vagy ha a hitelt nyújtó pénzintézet előírja.'],
    ['Mennyibe kerül a műszaki ellenőrzés?', 'A díj a projekt léptékétől, időtartamától és összetettségétől függ — általában a kivitelezési költség arányában vagy havi átalánydíjban kerül meghatározásra. Az első konzultáció minden esetben díjmentes, és pontos ajánlatot a projekt alapadatainak ismeretében adok.'],
    ['Mikor érdemes bevonni a munkába?', 'A legjobb már a tervek és a kivitelezői szerződés véglegesítése előtt — így a szerződéses kockázatok és a költségvetés is felülvizsgálhatók a munka megkezdése előtt. Megkezdett kivitelezésnél is be lehet kapcsolódni, de minél korábban, annál nagyobb a megtakarítási és kockázatcsökkentési lehetőség.'],
    ['Milyen területen és léptékben vállal munkát?', 'Elsősorban Miskolc és Borsod-Abaúj-Zemplén, valamint az észak-magyarországi régió. Lakóépülettől és felújítástól a középületeken át az ipari, technológiai beruházásokig — a referenciák között társasházak, bankfiókok, ipari park és nehézipari alapozás is szerepel.'],
    ['Vállal közbeszerzési (Kbt.) projekteket?', 'Igen. A közbeszerzés hatálya alá tartozó beruházásoknál a műszaki ellenőr alkalmazása kötelező, és több ilyen projektben — köztük a Mezőkövesd Ipari Park fejlesztésében — vettem részt.'],
  ];
  $('#faq-acc').innerHTML = faqs.map((f, i) => `
    <div class="acc-item rv">
      <button class="acc-h" aria-expanded="false">
        <span class="q">${f[0]}</span>
        <span class="pm" aria-hidden="true"><svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 2v10M2 7h10" stroke-linecap="round"/></svg></span>
      </button>
      <div class="acc-body"><div class="acc-body-in"><div class="acc-list"><p>${f[1]}</p></div></div></div>
    </div>`).join('');

  /* ── accordion behaviour (delegated) ── */
  document.addEventListener('click', (e) => {
    const h = e.target.closest('.acc-h');
    if (!h) return;
    const item = h.closest('.acc-item');
    const open = item.classList.toggle('open');
    h.setAttribute('aria-expanded', open);
  });

  /* ── PORTFOLIO ── */
  const catLabel = { lakoepuletek: 'Lakóépületek', kozepuletek: 'Középületek', ipari: 'Ipari', bank: 'Bank · iroda' };
  const roleLabel = { me: 'Műszaki ellenőrzés', fmv: 'Felelős műsz. vezetés' };
  const ICON = `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M6 42V20l18-12 18 12v22" stroke-linejoin="round"/><path d="M6 42h36M18 42V28h12v14" stroke-linejoin="round"/></svg>`;
  const projects = [
    ['Birla Carbon Hungary — 4. gyártósor technológiai alapozása', 'Tiszaújváros', '2024–25', 'fmv', 'ipari', 'Nehézipari technológiai alapozás, feszített ütemterv, kritikus geometriai tűréshatárok.'],
    ['Családi ház kivitelezése — Vass Albert u.', 'Bükkaranyos', '2024', 'me', 'lakoepuletek', 'Új építésű családi ház teljes kivitelezésének műszaki ellenőrzése.'],
    ['Gabonatároló építése — Eper út', 'Mezőkövesd', '2023', 'fmv', 'ipari', 'Mezőgazdasági gabonatároló létesítmény építése.'],
    ['Mezőkövesd Ipari Park fejlesztése — I–III. ütem', 'Mezőkövesd', '2020–23', 'fmv', 'ipari', 'Háromütemű ipari park infrastruktúra- és csarnokfejlesztés, közbeszerzés keretében.'],
    ['Rózsa Étterem bővítése konferenciateremmel', 'Mezőkövesd', '2022', 'fmv', 'kozepuletek', 'Meglévő étterem bővítése akusztikailag optimalizált teremmel.'],
    ['JET Transzport — logisztikai csarnokbővítés', 'Miskolc', '2022', 'me', 'ipari', 'Csarnokbővítés meglévő üzem mellett, folyamatos forgalomban.'],
    ['Zsóry gyógy- és egészségpark fejlesztése', 'Mezőkövesd', '2020', 'fmv', 'kozepuletek', 'Gyógy- és egészségpark kivitelezési munkái.'],
    ['Lakóépület — Pöltenberg E. u. 25.', 'Miskolc', '2020', 'me', 'lakoepuletek', ''],
    ['Mezőkövesdi Járási Kormányhivatal épülete', 'Mezőkövesd', '2019', 'fmv', 'kozepuletek', 'Közigazgatási épület, akadálymentes megközelítéssel.'],
    ['Bogács — Gyógy- és Strandfürdő, öltöző és bejárat', 'Bogács', '2018', 'fmv', 'kozepuletek', 'Öltöző és bejárati épületrész működő fürdő mellett.'],
    ['Berente — volt bányaépület felújítása, átalakítása', 'Berente', '2016', 'fmv', 'ipari', 'Komplex felújítás és belső átalakítás, funkcióváltással.'],
    ['Miskolci Állatkert — farkas- és hiúzkifutó', 'Miskolc', '2015', 'me', 'kozepuletek', 'Ragadozó kifutók, speciális biztonsági és állatjóléti követelményekkel.'],
    ['Szikszói görögkatolikus templom — szerkezetépítés', 'Szikszó', '2015', 'me', 'kozepuletek', ''],
    ['Társasház energetikai felújítása — Szilvás út 1–7.', 'Miskolc', '2014', 'me', 'lakoepuletek', 'Paneles társasház komplex korszerűsítése, homlokzati hőszigeteléssel.'],
    ['OTP bankfiók — Győri kapu 51.', 'Miskolc', '2013', 'me', 'bank', ''],
    ['OTP bankfiók — Agria park', 'Eger', '2012', 'me', 'bank', ''],
    ['Miskolc Mechatronikai Park — VIZI & Co Kft.', 'Miskolc', '2011', 'me', 'ipari', 'Műhely és irodaépület mechatronikai park területén.'],
    ['Piac u. – Hatvan u. — 70 lakásos társasház', 'Debrecen', '2007', 'me', 'lakoepuletek', '70 lakás, 9 üzlet, OTP fiók és 89 állásos teremgarázs.'],
    ['Andor u. – Miklós u. — 68 lakásos társasház', 'Miskolc', '2007', 'me', 'lakoepuletek', '30+38 lakásos együttes teremgarázzsal és irodaegységgel.'],
    ['OTP Régióközpont — szerkezetépítés', 'Miskolc', '2007', 'me', 'bank', ''],
    ['Isonzó u. — 22 lakásos társasház', 'Hajdúszoboszló', '2005', 'me', 'lakoepuletek', 'Társasház teremgarázzsal, üdülőövezeti kontextusban.'],
    ['Perczel Mór u. 54. — 12 lakásos társasház', 'Miskolc', '2003', 'me', 'lakoepuletek', 'Az első önálló műszaki ellenőri referencia.'],
  ];
  const pg = $('#proj-grid');
  pg.innerHTML = projects.map((p, i) => `
    <article class="card proj" data-cat="${p[4]}">
      <div class="proj-head"><span class="yr">${p[2]}</span><span class="cat">${catLabel[p[4]]}</span></div>
      <h3>${p[0]}</h3>
      <div class="loc">${p[1]}</div>
      ${p[5] ? `<p>${p[5]}</p>` : ''}
      <div class="foot"><span class="role-t">${roleLabel[p[3]]}</span><span class="idx">N° ${pad(projects.length - i)}</span></div>
    </article>`).join('');

  /* filter */
  $$('.fbtn').forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.f;
    $$('.fbtn').forEach(b => { const on = b === btn; b.classList.toggle('act', on); b.setAttribute('aria-pressed', on); });
    $$('#proj-grid .proj').forEach(c => {
      const show = f === 'all' || c.dataset.cat === f;
      c.style.display = show ? '' : 'none';
    });
  }));

  /* ── bind tilt + observe reveals (after dynamic injection) ── */
  $$('.tilt').forEach(bindTilt);
  observeReveal();

  /* ── contact form (FormSubmit → e-mail) ── */
  const FORM_EMAIL = 'gepm.kft@gmail.com';
  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/' + FORM_EMAIL;
  const form = $('#con-form');
  if (form) {
    const showErr = (id, msg) => { const s = $(`.err[data-for="${id}"]`); if (s) s.textContent = msg || ''; };
    const finish = () => { form.style.display = 'none'; $('#form-done').classList.add('show'); };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let ok = true;
      const name = $('#fn'), email = $('#fe'), msg = $('#fm'), consent = $('#fc');
      ['fn', 'fe', 'fm', 'fc'].forEach(id => showErr(id, ''));
      if (!name.value.trim()) { showErr('fn', 'Kérem, adja meg a nevét.'); ok = false; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) { showErr('fe', 'Érvényes e-mail címet adjon meg.'); ok = false; }
      if (!msg.value.trim()) { showErr('fm', 'Írjon néhány szót a projektről.'); ok = false; }
      if (!consent.checked) { showErr('fc', 'Az adatkezelés elfogadása kötelező.'); ok = false; }
      if (!ok) return;
      const btn = form.querySelector('button[type=submit]');
      const orig = btn.innerHTML; btn.disabled = true; btn.textContent = 'Küldés…';
      const data = new FormData(form);
      data.append('_subject', 'Új ajánlatkérés — czidor-imre.hu');
      data.append('_template', 'table');
      data.append('_captcha', 'false');
      try {
        const res = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: data });
        if (res.ok) finish();
        else { showErr('fm', 'Hiba történt a küldés során. Kérem, próbálja újra, vagy írjon e-mailt.'); btn.disabled = false; btn.innerHTML = orig; }
      } catch (err) {
        showErr('fm', 'Nem sikerült elküldeni. Írjon e-mailt: gepm.kft@gmail.com'); btn.disabled = false; btn.innerHTML = orig;
      }
    });
  }

  /* ── active-section nav highlight ── */
  (function () {
    const links = $$('.nav a');
    const map = {};
    links.forEach(a => { map[a.getAttribute('href').slice(1)] = a; });
    const secs = Object.keys(map).map(id => document.getElementById(id)).filter(Boolean);
    if (!secs.length) return;
    const spy = new IntersectionObserver((ents) => {
      ents.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const a = map[e.target.id]; if (a) a.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    secs.forEach(s => spy.observe(s));
  })();

  /* ── back to top ── */
  (function () {
    const btn = $('#totop'); if (!btn) return;
    const onScroll = () => btn.classList.toggle('show', window.scrollY > 700);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  })();

  /* ── cookie / consent note ── */
  (function () {
    const bar = $('#cookie'), ok = $('#cookie-ok'); if (!bar || !ok) return;
    let seen = false;
    try { seen = localStorage.getItem('ci_cookie_ok') === '1'; } catch (e) {}
    if (!seen) {
      bar.hidden = false;
      setTimeout(() => bar.classList.add('show'), 1600);
    }
    ok.addEventListener('click', () => {
      bar.classList.remove('show');
      try { localStorage.setItem('ci_cookie_ok', '1'); } catch (e) {}
      setTimeout(() => { bar.hidden = true; }, 500);
    });
  })();
})();
