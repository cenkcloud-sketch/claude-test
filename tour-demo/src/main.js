import * as THREE from 'three';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.35;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x14100d);
scene.fog = new THREE.Fog(0x14100d, 9, 30);
const camera = new THREE.PerspectiveCamera(62, 1, 0.05, 60);

// ---------- space: four rooms in a row, doorways on the z=0 axis ----------
const H = 2.8, D = 6, STEP = 7, R = STEP / 2;
const mat = (c, r = 0.85, extra = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: 0, ...extra });
const wallM = mat(0xe9dfd2), floorM = mat(0x8a6a4c, 0.6), ceilM = mat(0xf4efe8);
const box = (w, h, d, m, x, y, z, parent = scene) => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  mesh.position.set(x, y, z); parent.add(mesh); return mesh;
};
const rooms = ['Living room', 'Kitchen', 'Bedroom', 'Studio'];
rooms.forEach((_, i) => {
  const cx = i * STEP;
  box(STEP + 0.2, 0.1, D + 0.2, floorM, cx, -0.05, 0);
  box(STEP + 0.2, 0.1, D + 0.2, ceilM, cx, H + 0.05, 0);
  box(STEP + 0.2, H, 0.1, wallM, cx, H / 2, -D / 2);
  box(STEP + 0.2, H, 0.1, wallM, cx, H / 2, D / 2);
  // partition wall on the right with a 1.6 m doorway; last room gets a window wall
  const wx = cx + R;
  if (i < rooms.length - 1) {
    const seg = (D - 1.6) / 2;
    box(0.2, H, seg, wallM, wx, H / 2, -(0.8 + seg / 2));
    box(0.2, H, seg, wallM, wx, H / 2, 0.8 + seg / 2);
    box(0.2, H - 2.2, 1.6, wallM, wx, 2.2 + (H - 2.2) / 2, 0);
  }
  if (i === 0) box(0.2, H, D, wallM, cx - R, H / 2, 0);
});
// window wall in the studio (glowing sky)
const sky = new THREE.Mesh(new THREE.PlaneGeometry(D - 0.6, 2.1), new THREE.MeshBasicMaterial({ color: 0xbfd8ff }));
sky.rotation.y = -Math.PI / 2; sky.position.set(3 * STEP + R - 0.02, 1.55, 0); scene.add(sky);
box(0.2, H, D, wallM, 3 * STEP + R + 0.1, H / 2, 0);
[[0.42, 0.5], [2.65, 0.15]].forEach(([y, h]) => box(0.12, h, D - 0.4, wallM, 3 * STEP + R - 0.06, y + h / 2, 0));

// living room
const fabric = mat(0x4b5d6b, 0.95), wood = mat(0x5a3d28, 0.5), cream = mat(0xd8cdbd, 0.9);
box(2.4, 0.45, 0.95, fabric, -1.2, 0.25, -2.3); box(2.4, 0.5, 0.25, fabric, -1.2, 0.65, -2.7);
box(1.3, 0.05, 0.7, wood, 0.3, 0.38, -0.9); [[-0.3, -1.2], [0.9, -1.2], [-0.3, -0.6], [0.9, -0.6]].forEach(([x, z]) => box(0.05, 0.36, 0.05, wood, x, 0.18, z));
box(3, 0.02, 2, mat(0xb86f4a, 1), 0.2, 0.01, -1.1);
box(0.9, 0.9, 0.04, mat(0x2a2623, 0.9), 2.2, 1.6, -2.92); // art
// kitchen
const cab = mat(0x2f4a44, 0.6), top = mat(0xcfcac2, 0.35);
box(5.2, 0.85, 0.65, cab, STEP, 0.43, -2.65); box(5.2, 0.05, 0.7, top, STEP, 0.88, -2.65);
box(4.6, 0.7, 0.35, cab, STEP, 1.95, -2.8);
box(2.2, 0.85, 0.9, cab, STEP + 0.6, 0.43, 1.6); box(2.3, 0.05, 1, top, STEP + 0.6, 0.88, 1.6);
[-0.4, 0.5, 1.4].forEach(x => { box(0.35, 0.05, 0.35, mat(0x1c1c1c), STEP + x + 0.6, 0.62, 2.45); box(0.35, 0.6, 0.05, mat(0x1c1c1c), STEP + x + 0.6, 0.9, 2.7); });
// bedroom
const linen = mat(0xe8e4dc, 0.95), dark = mat(0x3a2b3d, 0.9);
box(2.1, 0.35, 2.3, wood, 2 * STEP + 0.6, 0.2, -1.8); box(2.0, 0.28, 2.1, linen, 2 * STEP + 0.6, 0.5, -1.75);
box(2.2, 1.0, 0.12, dark, 2 * STEP + 0.6, 0.8, -2.9);
[[-0.4, 0], [0.4, 0]].forEach(([dx]) => box(0.7, 0.14, 0.45, mat(0xf4f1ec), 2 * STEP + 0.6 + dx * 1.2, 0.7, -2.45));
box(0.5, 0.5, 0.45, wood, 2 * STEP - 0.8, 0.25, -2.65); box(0.5, 0.5, 0.45, wood, 2 * STEP + 2.0, 0.25, -2.65);
box(1.6, 2.2, 0.55, mat(0x6a5546, 0.7), 2 * STEP - 1.8, 1.1, -2.65);
box(3, 0.02, 2.4, mat(0x7b8c7a, 1), 2 * STEP + 0.6, 0.01, -1.4);
// studio
box(1.6, 0.05, 0.75, wood, 3 * STEP + 1.5, 0.75, 1.8); [[-0.75, -0.3], [0.75, -0.3], [-0.75, 0.3], [0.75, 0.3]].forEach(([x, z]) => box(0.05, 0.75, 0.05, wood, 3 * STEP + 1.5 + x, 0.37, 1.8 + z));
box(0.5, 0.05, 0.5, mat(0x222222), 3 * STEP + 1.5, 0.5, 1.1); box(0.5, 0.45, 0.05, mat(0x222222), 3 * STEP + 1.5, 0.75, 0.85);
[[3 * STEP - 2.8, -2.6], [3 * STEP + 2.5, -2.3], [3 * STEP + 2.5, 2.6]].forEach(([x, z]) => {
  const p = new THREE.Group(); scene.add(p);
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.17, 0.4, 16), mat(0xb36a4b)); pot.position.y = 0.2; p.add(pot);
  const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 1), mat(0x4f8a4a, 0.8)); leaf.position.y = 0.85; p.add(leaf);
  p.position.set(x, 0, z);
});
box(2.6, 0.3, 1, mat(0x8f7f6f, 0.95), 3 * STEP - 1.2, 0.2, 2.4);

// lights
scene.add(new THREE.HemisphereLight(0xfff1de, 0x3a2a1c, 0.8));
const warm = [0xffd7a0, 0xffe6c4, 0xffc88e, 0xcfe2ff];
rooms.forEach((_, i) => {
  const l = new THREE.PointLight(warm[i], 14, 11, 1.6); l.position.set(i * STEP, 2.5, 0); scene.add(l);
});

// ---------- camera route ----------
// pos / look pairs. Stops sit on keys 0, 3, 6, 9.
const keys = [
  [[-1.8, 1.6, 1.6], [1.5, 1.2, -1.6]],
  [[0.8, 1.6, 0.9], [3.2, 1.4, 0]],
  [[3.5, 1.6, 0], [6.5, 1.4, 0]],
  [[5.0, 1.6, -0.2], [7.4, 1.1, -2.4]],
  [[7.4, 1.6, 0.4], [9.6, 1.4, 0]],
  [[10.5, 1.6, 0], [13.5, 1.4, 0]],
  [[12.1, 1.6, 0.8], [14.6, 1.0, -1.8]],
  [[14.6, 1.6, 1.5], [16.8, 1.4, 0]],
  [[17.5, 1.6, 0], [20.5, 1.4, 0]],
  [[20.2, 1.6, 0.2], [24.5, 1.6, 0.4]],
];
const posCurve = new THREE.CatmullRomCurve3(keys.map(k => new THREE.Vector3(...k[0])), false, 'centripetal');
const lookCurve = new THREE.CatmullRomCurve3(keys.map(k => new THREE.Vector3(...k[1])), false, 'centripetal');
const stopKeys = [0, 3, 6, 9];
const stopP = stopKeys.map(k => k / (keys.length - 1));
const copy = [
  ['Living room', 'A calm start. Scroll to walk forward, or jump to any room.'],
  ['Kitchen', 'Open plan, warm light. The camera passes through the real doorway.'],
  ['Bedroom', 'Slower here, on purpose. The route pauses before each turn.'],
  ['Studio', 'Daylight at the end of the route. Your real 360° tour continues below.'],
];

// ---------- scroll state ----------
const track = document.getElementById('tour');
const maxScroll = () => track.offsetHeight - innerHeight;
let target = 0, current = 0;
const progressFromScroll = () => {
  const r = track.getBoundingClientRect();
  return Math.min(1, Math.max(0, -r.top / Math.max(1, maxScroll())));
};
addEventListener('scroll', () => { target = progressFromScroll(); }, { passive: true });

const buttons = [...document.querySelectorAll('[data-room]')];
const titleEl = document.getElementById('room-title'), textEl = document.getElementById('room-text');
const bar = document.getElementById('bar');
let active = -1;
const setActive = i => {
  if (i === active) return; active = i;
  buttons.forEach((b, j) => b.setAttribute('aria-current', j === i ? 'true' : 'false'));
  titleEl.textContent = copy[i][0]; textEl.textContent = copy[i][1];
};
buttons.forEach((b, i) => b.addEventListener('click', () => {
  const top = track.getBoundingClientRect().top + scrollY + stopP[i] * maxScroll();
  scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
}));

// room under the camera, with hysteresis around the midpoints
const roomFor = p => {
  let i = active < 0 ? 0 : active;
  const edge = (a, b) => (stopP[a] + stopP[b]) / 2;
  while (i < 3 && p > edge(i, i + 1) + 0.03) i++;
  while (i > 0 && p < edge(i - 1, i) - 0.03) i--;
  return i;
};

const resize = () => {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.fov = w / h < 0.8 ? 78 : 62;
  camera.updateProjectionMatrix();
  target = progressFromScroll();
};
addEventListener('resize', resize); resize();
current = target;

const p3 = new THREE.Vector3(), l3 = new THREE.Vector3();
let last = performance.now();
const frame = now => {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  current = reduced ? target : current + (target - current) * (1 - Math.exp(-dt * 6));
  posCurve.getPoint(current, p3); lookCurve.getPoint(current, l3);
  p3.y += Math.sin(current * 120) * 0.012 * (reduced ? 0 : 1); // faint walking sway
  camera.position.copy(p3); camera.lookAt(l3);
  setActive(roomFor(current));
  bar.style.transform = `scaleX(${current})`;
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
};
setActive(0);
requestAnimationFrame(frame);
window.__tour = { setProgress: p => { target = current = p; }, get p() { return current; } };

// ---------- real 360 tour embed ----------
const form = document.getElementById('embed-form'), input = document.getElementById('embed-url');
const holder = document.getElementById('embed-holder'), err = document.getElementById('embed-err');
const load = url => {
  let u; try { u = new URL(url); } catch { u = null; }
  if (!u || u.protocol !== 'https:') { err.textContent = 'Please paste a full https:// link.'; return; }
  err.textContent = '';
  if (window.__LINKOUT) { const a = document.createElement('a'); a.href = u.href; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Open this tour in a new tab'; a.className = 'open-tour'; holder.replaceChildren(a); return; }
  const f = document.createElement('iframe');
  f.src = u.href; f.title = '360° virtual tour'; f.loading = 'lazy';
  f.allow = 'fullscreen; xr-spatial-tracking; gyroscope; accelerometer';
  f.setAttribute('allowfullscreen', '');
  holder.replaceChildren(f);
};
form.addEventListener('submit', e => { e.preventDefault(); load(input.value.trim()); });
