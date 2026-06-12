/* ───────────────────────────────────────────────────────────
   CZIDOR IMRE — Scroll-built modern family house (Three.js r170+)
   Bundled ESM module. API: window.HouseScene.setProgress(p)  (0 → 1)
   ─────────────────────────────────────────────────────────── */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function boot() {
  const mount = document.getElementById('scene');
  if (!mount) return;

  const W = () => mount.clientWidth || window.innerWidth;
  const H = () => mount.clientHeight || window.innerHeight;
  const small = () => window.innerWidth < 1040;

  // ── Renderer ──
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W(), H());
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  // r152+: outputColorSpace replaces outputEncoding
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  mount.appendChild(renderer.domElement);
  renderer.domElement.style.display = 'block';

  // ── Scene + fog ──
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xF7F5F0, 30, 72);

  // ── Sky gradient environment (PMREM) ──
  (function () {
    try {
      const cnv = document.createElement('canvas'); cnv.width = 16; cnv.height = 256;
      const g = cnv.getContext('2d');
      const grd = g.createLinearGradient(0, 0, 0, 256);
      grd.addColorStop(0.00, '#cfe6f5');
      grd.addColorStop(0.45, '#bcd6ea');
      grd.addColorStop(0.70, '#ede6d8');
      grd.addColorStop(0.86, '#e7dccb');
      grd.addColorStop(1.00, '#d8cdba');
      g.fillStyle = grd; g.fillRect(0, 0, 16, 256);
      const tex = new THREE.CanvasTexture(cnv);
      // r152+: colorSpace replaces encoding
      tex.colorSpace = THREE.SRGBColorSpace;
      const envScene = new THREE.Scene();
      const sky = new THREE.Mesh(
        new THREE.SphereGeometry(60, 24, 16),
        new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide })
      );
      envScene.add(sky);
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(envScene, 0.04).texture;
      tex.dispose(); sky.geometry.dispose(); sky.material.dispose(); pmrem.dispose();
    } catch (e) { /* environment is optional */ }
  })();

  // ── Camera ──
  const camera = new THREE.PerspectiveCamera(38, W() / H(), 0.1, 200);

  // ── Controls ──
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enablePan = false;
  controls.minDistance = 15;
  controls.maxDistance = 34;
  controls.minPolarAngle = 0.5;
  controls.maxPolarAngle = Math.PI / 2.12;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.4;
  controls.target.set(0, 2.7, 0);
  controls.enabled = false;

  // ── Lighting ──
  // Intensities divided by π vs. r128 legacy values to match the same
  // visual brightness under Three.js r155+ physically-correct lighting.
  scene.add(new THREE.HemisphereLight(0xfdfbf6, 0x6b6256, 0.16));
  const sun = new THREE.DirectionalLight(0xfff4e6, 0.64);
  sun.position.set(13, 18, 9);
  sun.castShadow = true;
  const sm = small() ? 1024 : 2048;
  sun.shadow.mapSize.set(sm, sm);
  sun.shadow.camera.near = 1; sun.shadow.camera.far = 70;
  sun.shadow.camera.left = -20; sun.shadow.camera.right = 20;
  sun.shadow.camera.top = 20; sun.shadow.camera.bottom = -20;
  sun.shadow.bias = -0.0004; sun.shadow.radius = 5;
  scene.add(sun);
  const moon = new THREE.DirectionalLight(0x7aa7d6, 0.13);
  moon.position.set(-11, 8, -7); scene.add(moon);
  const warm = new THREE.PointLight(0xffb061, 0, 18, 2);
  warm.position.set(1.2, 2.4, 3.0); scene.add(warm);

  // ── Procedural textures ──
  function bumpTex(size, contrast, rx, ry) {
    const c = document.createElement('canvas'); c.width = c.height = size;
    const x = c.getContext('2d'); const img = x.createImageData(size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 128 + (Math.random() * contrast - contrast / 2);
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
    }
    x.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx || 2, ry || 2);
    return t;
  }
  function lawnTex() {
    const s = 256, c = document.createElement('canvas'); c.width = c.height = s;
    const x = c.getContext('2d');
    x.fillStyle = '#DED8CC'; x.fillRect(0, 0, s, s);
    for (let i = 0; i < 12000; i++) {
      x.fillStyle = Math.random() < 0.5 ? 'rgba(120,132,96,0.18)' : 'rgba(150,150,120,0.16)';
      x.fillRect(Math.random() * s, Math.random() * s, 1.7, 1.7);
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 5);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  const plasterBump = bumpTex(128, 26, 3, 3);
  const concreteBump = bumpTex(128, 46, 2, 2);
  const woodBump = bumpTex(128, 30, 1, 7);

  // ── Materials ──
  const M = {
    wall:    new THREE.MeshStandardMaterial({ color: 0xeae4d8, roughness: 0.92, bumpMap: plasterBump, bumpScale: 0.012, envMapIntensity: 0.6 }),
    dark:    new THREE.MeshStandardMaterial({ color: 0x2b2d31, roughness: 0.55, metalness: 0.25, envMapIntensity: 0.9 }),
    wood:    new THREE.MeshStandardMaterial({ color: 0xa9743e, roughness: 0.7, bumpMap: woodBump, bumpScale: 0.02, envMapIntensity: 0.4 }),
    concrete:new THREE.MeshStandardMaterial({ color: 0xc7c1b3, roughness: 0.95, bumpMap: concreteBump, bumpScale: 0.03, envMapIntensity: 0.4 }),
    rebar:   new THREE.MeshStandardMaterial({ color: 0x8a8f97, roughness: 0.4, metalness: 0.75, envMapIntensity: 1.0 }),
    glass:   new THREE.MeshStandardMaterial({ color: 0xafd0de, roughness: 0.04, metalness: 0.0, transparent: true, opacity: 0.32, envMapIntensity: 1.5 }),
    glassWarm:new THREE.MeshStandardMaterial({ color: 0x33373d, roughness: 0.08, metalness: 0.2, emissive: 0x3E8A95, emissiveIntensity: 0.12, envMapIntensity: 1.0 }),
    water:   new THREE.MeshStandardMaterial({ color: 0x3a8f97, roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.86, emissive: 0x16494e, emissiveIntensity: 0.3, envMapIntensity: 1.2 }),
    deck:    new THREE.MeshStandardMaterial({ color: 0x8c6239, roughness: 0.82, bumpMap: woodBump, bumpScale: 0.025, envMapIntensity: 0.4 }),
    accent:  new THREE.MeshStandardMaterial({ color: 0x3E8A95, roughness: 0.4, metalness: 0.1, emissive: 0x3E8A95, emissiveIntensity: 0.12, envMapIntensity: 0.7 }),
    trunk:   new THREE.MeshStandardMaterial({ color: 0x5a4632, roughness: 0.95, envMapIntensity: 0.3 }),
    leaf:    new THREE.MeshStandardMaterial({ color: 0x6f7d56, roughness: 0.9, flatShading: true, envMapIntensity: 0.3 }),
    leaf2:   new THREE.MeshStandardMaterial({ color: 0x5d6b48, roughness: 0.9, flatShading: true, envMapIntensity: 0.3 }),
    grass:   new THREE.MeshStandardMaterial({ color: 0xDED8CC, roughness: 1, map: lawnTex(), bumpMap: bumpTex(128, 18, 6, 5), bumpScale: 0.02, envMapIntensity: 0.35 }),
    soil:    new THREE.MeshStandardMaterial({ color: 0xC9C1B1, roughness: 1, bumpMap: concreteBump, bumpScale: 0.02, envMapIntensity: 0.3 }),
  };

  const box = (w, h, d, mat) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  const cyl = (rt, rb, h, s, mat) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, s), mat);
  function at(m, x, y, z, cast = true, rec = true) { m.position.set(x, y, z); m.castShadow = cast; m.receiveShadow = rec; return m; }

  const villa = new THREE.Group();
  scene.add(villa);

  // ── Build registry (crane-placed: settle + fade) ──
  const builders = [];
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const easeBack = t => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

  function reg(obj, start, end, mode) {
    mode = mode || 'place';
    const mats = [];
    obj.traverse(o => {
      if (o.isMesh) {
        o.material = o.material.clone();
        o.material.transparent = true;
        mats.push({ mat: o.material, op: o.material.opacity });
      }
    });
    builders.push({ obj, start, end, mode, mats, targetY: obj.position.y, drop: mode === 'pop' ? 0 : 1.5 });
    if (obj.isMesh && obj.parent !== villa) villa.add(obj);
    return obj;
  }
  function seq(list, start, end, mode) {
    const n = list.length, span = end - start;
    list.forEach((m, i) => {
      const a = start + span * (i / n) * 0.55;
      const b = start + span * ((i + 1) / n);
      reg(m, a, Math.min(b, end), mode);
    });
  }
  function applyBuild(p) {
    for (const b of builders) {
      let t = (p - b.start) / Math.max(b.end - b.start, 0.0001);
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const vis = t > 0.001;
      b.obj.visible = vis;
      if (!vis) continue;
      if (b.mode === 'pop') {
        b.obj.scale.setScalar(Math.max(easeBack(t), 0.0001));
      } else {
        const e = easeOut(t);
        b.obj.position.y = b.targetY + (1 - e) * b.drop;
        const s = 0.97 + 0.03 * e;
        b.obj.scale.set(s, s, s);
      }
      const fade = Math.min(1, t * 1.5);
      for (const m of b.mats) {
        m.mat.opacity = m.op * fade;
        m.mat.transparent = (t < 1) ? true : (m.op < 1);
      }
    }
    warm.intensity = Math.max(0, Math.min(1, (p - 0.26) / 0.12)) * 0.14;
  }

  // ════════ SITE (static plot) ════════
  villa.add(at(box(26, 0.4, 22, M.grass), 0, -0.2, 0, false, true));
  villa.add(at(box(11.4, 0.3, 7.9, M.soil), -0.1, -0.05, 0, false, true));

  // ════════ 0 · ALAPOZÁS ════════
  const s0 = [];
  s0.push(at(box(11, 0.5, 7.5, M.concrete), 0, 0.25, 0));
  [-4.5, -1.5, 1.5, 4.5].forEach(x => { [-3, 3].forEach(z => { s0.push(at(cyl(0.05, 0.05, 0.9, 5, M.rebar), x, 0.8, z)); }); });
  seq(s0, 0.0, 0.10, 'place');

  // ════════ 1 · FÖLDSZINT ════════
  const s1 = [];
  s1.push(at(box(9.2, 3.2, 6, M.wall), -0.3, 2.1, 0));
  s1.push(at(box(2.6, 3.0, 0.15, M.wood), -3.0, 2.05, 3.05));
  s1.push(at(box(1.3, 2.4, 0.2, M.dark), -3.0, 1.75, 3.06));
  s1.push(at(box(0.08, 0.5, 0.12, M.accent), -2.55, 1.7, 3.16));
  seq(s1, 0.10, 0.24, 'place');

  // ════════ 2 · ÜVEGEZÉS ════════
  const s2 = [];
  s2.push(at(box(4.4, 2.5, 0.12, M.glass), 1.4, 1.95, 3.04));
  for (let i = -1; i <= 1; i++) s2.push(at(box(0.08, 2.5, 0.16, M.dark), 1.4 + i * 1.45, 1.95, 3.06));
  s2.push(at(box(4.6, 0.1, 0.18, M.dark), 1.4, 3.2, 3.06));
  s2.push(at(box(4.6, 0.1, 0.18, M.dark), 1.4, 0.7, 3.06));
  s2.push(at(box(0.12, 2.2, 3.4, M.glassWarm), 4.35, 1.95, 0.4));
  s2.push(at(box(4.85, 0.14, 0.4, M.concrete), 1.4, 0.62, 3.16));
  seq(s2, 0.24, 0.36, 'place');

  // ════════ 3 · FÖDÉM ════════
  reg(at(box(10, 0.45, 7, M.concrete), 0.2, 3.85, 0), 0.36, 0.46, 'place');

  // ════════ 4 · EMELET ════════
  const s4 = [];
  s4.push(at(box(6.4, 2.9, 5.4, M.wall), 1.2, 5.55, -0.1));
  s4.push(at(box(3.0, 2.9, 5.6, M.dark), -1.4, 5.55, -0.1));
  s4.push(at(box(5.6, 1.5, 0.12, M.glass), 1.4, 5.7, 2.66));
  for (let i = -2; i <= 2; i++) s4.push(at(box(0.07, 1.5, 0.16, M.dark), 1.4 + i * 1.1, 5.7, 2.68));
  s4.push(at(box(1.6, 1.4, 0.12, M.glassWarm), -1.4, 5.75, 2.6));
  s4.push(at(box(5.9, 0.12, 0.34, M.concrete), 1.4, 4.93, 2.72));
  seq(s4, 0.46, 0.62, 'place');

  // ════════ 5 · TETŐSZERKEZET ════════
  const s5 = [];
  s5.push(at(box(7.0, 0.4, 6.0, M.concrete), 1.2, 7.2, -0.1));
  s5.push(at(box(7.0, 0.5, 0.12, M.wall), 1.2, 7.5, 2.8));
  s5.push(at(box(7.0, 0.12, 0.14, M.accent), 1.2, 7.62, 2.86));
  s5.push(at(box(0.7, 1.2, 0.7, M.dark), 3.0, 8.0, -1.5));
  s5.push(at(box(0.92, 0.16, 0.92, M.dark), 3.0, 8.68, -1.5));
  seq(s5, 0.62, 0.74, 'place');

  // ════════ 6 · KÜLSŐ MUNKÁK ════════
  const s6 = [];
  s6.push(at(box(5.5, 0.2, 3.1, M.concrete), -4.5, 0.2, -3.2, false, true));
  s6.push(at(box(5.0, 0.4, 2.6, M.water), -4.5, 0.35, -3.2));
  s6.push(at(box(6.5, 0.18, 2.2, M.deck), -4.0, 0.42, 0.4, false, true));
  s6.push(at(box(3.2, 0.35, 1.2, M.concrete), -0.3, 0.42, 4.0, false, true));
  s6.push(at(box(0.9, 0.7, 0.9, M.wall), 5.0, 0.55, 3.4));
  s6.push(at(box(0.9, 0.7, 0.9, M.wall), 5.0, 0.55, 1.8));
  for (let i = -5; i <= 5; i++) { if (Math.abs(i) < 2) continue; s6.push(at(box(1.6, 0.6, 0.5, M.leaf2), i * 2.0, 0.5, 9.5)); }
  s6.push(at(box(6.4, 0.6, 0.05, M.glass), -4.0, 0.82, 1.45));
  s6.push(at(box(6.62, 0.06, 0.1, M.dark), -4.0, 1.14, 1.45));
  s6.push(at(box(0.07, 0.62, 0.1, M.dark), -7.17, 0.82, 1.45));
  s6.push(at(box(0.07, 0.62, 0.1, M.dark), -0.83, 0.82, 1.45));
  s6.push(at(box(1.1, 0.08, 0.7, M.concrete), -0.55, 0.06, 5.2, false, true));
  s6.push(at(box(1.1, 0.08, 0.7, M.concrete), -0.85, 0.06, 6.25, false, true));
  s6.push(at(box(1.1, 0.08, 0.7, M.concrete), -1.15, 0.06, 7.3, false, true));
  seq(s6, 0.74, 0.86, 'place');

  // ════════ 7 · KULCSRAKÉSZ ════════
  function tree(x, z, s) {
    const g = new THREE.Group();
    const tr = cyl(0.12 * s, 0.16 * s, 1.4 * s, 6, M.trunk); tr.position.y = 0.7 * s; tr.castShadow = true; g.add(tr);
    const f1 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.95 * s, 0), M.leaf); f1.position.y = 1.7 * s; f1.castShadow = true; g.add(f1);
    const f2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7 * s, 0), M.leaf2); f2.position.set(0.4 * s, 2.3 * s, 0.1 * s); f2.castShadow = true; g.add(f2);
    const f3 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.6 * s, 0), M.leaf); f3.position.set(-0.35 * s, 2.2 * s, -0.2 * s); f3.castShadow = true; g.add(f3);
    g.position.set(x, 0.3, z);
    return g;
  }
  const trees = [tree(6.7, -4.6, 1.25), tree(-8.6, 3.6, 1.0), tree(8.1, 4.1, 0.85), tree(-8.1, -5.6, 0.9)];
  trees.forEach(t => villa.add(t));
  seq(trees, 0.86, 1.0, 'pop');

  applyBuild(0);

  // ── Camera path ──
  const tmpTarget = new THREE.Vector3();
  function applyCamera(p) {
    const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    tmpTarget.set(0, 1.0 + 1.7 * e, 0);
    const radius = 15.5 + 7.0 * e;
    const phi = 1.2 - 0.2 * e;
    const theta = -0.78 + 1.05 * e;
    camera.position.setFromSphericalCoords(radius, phi, theta).add(tmpTarget);
    camera.lookAt(tmpTarget);
  }

  // ── State / API ──
  let targetP = 0, curP = 0, built = false;
  window.HouseScene = {
    ready: true,
    setProgress(p) { targetP = Math.max(0, Math.min(1, p)); },
    get progress() { return curP; }
  };

  // ── Resize ──
  function resize() { renderer.setSize(W(), H()); camera.aspect = W() / H(); camera.updateProjectionMatrix(); }
  window.addEventListener('resize', resize);
  if (window.ResizeObserver) new ResizeObserver(resize).observe(mount);

  // ── Animate ──
  const timer = new THREE.Timer();
  let raf = null;
  function animate() {
    raf = requestAnimationFrame(animate);
    timer.update();
    const t = timer.getElapsed();
    curP += (targetP - curP) * 0.14;
    if (Math.abs(targetP - curP) < 0.0005) curP = targetP;
    applyBuild(curP);
    villa.position.y = (0.025 + 0.025 * curP) * Math.sin(t * 0.55);
    if (curP > 0.992) {
      if (!built) { built = true; controls.enabled = true; controls.autoRotate = true; applyCamera(1); controls.update(); }
      controls.update();
    } else {
      if (built) { built = false; controls.enabled = false; controls.autoRotate = false; }
      applyCamera(curP);
    }
    renderer.render(scene, camera);
  }
  applyCamera(0);
  animate();

  // ── Pause when scene is off-screen (IntersectionObserver) ──
  const obs = new IntersectionObserver((ents) => {
    ents.forEach(e => {
      if (e.isIntersecting) { if (!raf) animate(); }
      else { cancelAnimationFrame(raf); raf = null; }
    });
  }, { threshold: 0.01 });
  obs.observe(mount);

  // ── Pause when browser tab is hidden (item 7) ──
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
    else if (!raf) animate();
  });

  mount.classList.add('scene-ready');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
