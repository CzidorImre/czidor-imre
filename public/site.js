/* ═══════════════════════════════════════════════════════════
   CZIDOR IMRE — site interactions
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ── header scroll state ── */
  const hdr = $('#hdr');
  const onScroll = () => hdr.classList.toggle('scrolled', window.scrollY > 24);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* ── mobile menu ── */
  const burger = $('#burger'), mnav = $('#mnav');
  const mnavLinks = () => $$('a, button', mnav);
  const setMenu = o => {
    mnav.classList.toggle('open', o);
    mnav.setAttribute('aria-hidden', !o);
    if (o) { mnav.removeAttribute('inert'); } else { mnav.setAttribute('inert', ''); }
    burger.setAttribute('aria-expanded', o);
    burger.setAttribute('aria-label', o ? 'Menü bezárása' : 'Menü megnyitása');
    document.body.style.overflow = o ? 'hidden' : '';
    if (o) { const first = mnavLinks()[0]; if (first) first.focus(); }
  };
  burger.addEventListener('click', () => setMenu(!mnav.classList.contains('open')));
  $$('[data-ml]').forEach(a => a.addEventListener('click', () => { setMenu(false); burger.focus(); }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mnav.classList.contains('open')) { setMenu(false); burger.focus(); return; }
    if (e.key !== 'Tab' || !mnav.classList.contains('open')) return;
    const links = mnavLinks();
    const first = links[0], last = links[links.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ── reveal on scroll ── */
  const io = new IntersectionObserver((ents) => {
    ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  const observeReveal = () => $$('.rv:not(.in)').forEach(el => io.observe(el));

  /* ── AUTO-BUILT HOUSE: builds once on load, no scroll involvement ── */
  (function () {
    const track = $('#hero-track');
    if (!track) return;
    const stepsEl = $('#build-steps');
    const barI = $('#build-bar-i');
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
      }
      showReplay(p);
    }

    function showReplay(p) { if (replayBtn) replayBtn.classList.toggle('show', p > 0.985 && !autoPlaying); }

    if (reduced) {
      document.documentElement.classList.add('reduced');
      paint(1);
      return;
    }

    function playBuild() {
      autoPlaying = true;
      if (replayBtn) replayBtn.classList.remove('show');
      const dur = 3600, t0 = performance.now();
      (function step(now) {
        const k = Math.min(1, (now - t0) / dur);
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        paint(e);
        if (k < 1) requestAnimationFrame(step);
        else { autoPlaying = false; showReplay(1); }
      })(t0);
    }

    if (replayBtn) {
      replayBtn.addEventListener('click', () => { if (!autoPlaying) playBuild(); });
    }

    playBuild();
  })();

  /* ── (minimal theme: no cursor-glow / tilt) ── */
  function bindTilt() {}

  /* ── (content for Mandatory / Tasks / FAQ / Portfolio is now rendered
        server-side in their respective Astro components) ── */

  /* ── accordion behaviour (delegated) ── */
  document.addEventListener('click', (e) => {
    const h = e.target.closest('.acc-h');
    if (!h) return;
    const item = h.closest('.acc-item');
    const open = item.classList.toggle('open');
    h.setAttribute('aria-expanded', open);
  });

  /* ── PORTFOLIO filter ── */
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
