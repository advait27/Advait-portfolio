/* Architecture is the content. WebGL is an optional, local enhancement. */
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = false;
try { paused = localStorage.getItem('advait-motion') === 'paused'; } catch { /* storage is optional */ }

const projects = {
  eadip: {
    label: 'EADIP / GOVERNED DECISION INTELLIGENCE',
    url: 'https://github.com/advait27/EADIP', link: 'View project source ↗',
    stages: [
      ['Plan', 'Plan the investigation', 'Translate a business question into an explicit investigation plan, with bounded actions and an auditable path through the system.', 'Start with the decision, then choose the tools.'],
      ['Retrieve', 'Bring the right context', 'Retrieve enterprise context using vector search and graph-based metric lineage, grounding the investigation in the data behind the question.', 'Context must be relevant and attributable.'],
      ['Query', 'Query within boundaries', 'Use a safety-gated natural-language-to-SQL layer and tenant-isolated data access. Side-effecting actions wait for human approval.', 'Permission and tenant boundaries are part of the architecture.'],
      ['Verify', 'Independently verify claims', 'A separate Verification Agent re-derives numeric claims before they can enter a report. Accuracy, safety and reliability are guarded by CI tests.', 'A confident answer still needs independent evidence.'],
      ['Report', 'Return a grounded decision', 'Assemble the findings into a report with verified numeric claims and metric lineage, keeping the route from question to conclusion inspectable.', 'The output should help someone make a better decision.']
    ]
  },
  veritas: {
    label: 'VERITAS / HYPOTHESIS-DRIVEN INVESTIGATION',
    url: 'https://github.com/advait27/Veritas', link: 'View project source ↗',
    stages: [
      ['Hypothesis', 'Make the question testable', 'Build a hypothesis tree that turns a broad business question into alternatives that can be tested and falsified.', 'Ask what would prove the hypothesis wrong.'],
      ['Data', 'Work with local data', 'Connect CSV, Parquet and Excel data through DuckDB, exposed through a self-hosted Model Context Protocol server.', 'Keep the investigation close to the underlying data.'],
      ['Query', 'Execute the investigation', 'Run queries that test the competing explanations, producing executed artifacts rather than unsupported narrative.', 'An analytical claim needs an executed calculation.'],
      ['Evidence', 'Trace each numeric claim', 'Deterministic verification requires numeric claims to trace to executed artifacts. Evidence is a requirement for the answer.', 'Receipts before conclusions.'],
      ['Findings', 'Separate signal from noise', 'Opportunity and risk discovery applies false-discovery-rate control and is evaluated against planted-cause datasets.', 'More discoveries are useful only when they are reliable.']
    ]
  },
  compliance: {
    label: 'CLAWBACKVAULT / PREVIOUS ROLE AT FRENSEI',
    url: '#resume', link: 'View previous-role experience ↗',
    stages: [
      ['Inbox', 'Integrate enterprise email', 'At Frensei, November 2025–September 2026, I built Gmail API and Microsoft Graph integrations with OAuth 2.0, incremental synchronization and secure consent flows.', 'Enterprise integration starts with trust and consent.'],
      ['Target', 'Target the relevant signals', 'A targeted email intelligence pipeline replaced full-inbox scanning and reduced LLM inference costs by 80–90% per broker.', 'Use model capacity where it adds decision value.'],
      ['Mask', 'Protect information first', 'PII masking happens before model calls, alongside encryption, prompt-injection protection and row-level tenant isolation.', 'Privacy is enforced before inference.'],
      ['Classify', 'Classify behavioural risk', 'Signal detection covered more than 15 behavioural categories, combining structured evidence, confidence scores and explainable outputs.', 'Risk signals need evidence and calibrated confidence.'],
      ['Review', 'Keep decisions auditable', 'Structured-output validation, regression tests, confidence thresholds and audit trails supported review in a regulated environment.', 'Oversight needs inspectable evidence, not just logs.']
    ]
  }
};

let projectKey = 'eadip';
let stageIndex = 0;
let labVisual = null;
const $ = (s) => document.querySelector(s);
const stageButtons = [...document.querySelectorAll('[data-lab-stage]')];
const projectButtons = [...document.querySelectorAll('[data-lab-project]')];
const motionButtons = [...document.querySelectorAll('[data-motion-toggle]')];
const visuals = new Set();
let frame = null;
let previousTime = 0;
let destroyed = false;

function updateStory(project = projectKey, stage = stageIndex) {
  projectKey = project;
  stageIndex = (stage + 5) % 5;
  const p = projects[projectKey];
  const entry = p.stages[stageIndex];
  $('[data-lab-label]').textContent = p.label;
  $('[data-story-number]').textContent = `${String(stageIndex + 1).padStart(2, '0')} / 05`;
  $('[data-story-title]').textContent = entry[1];
  $('[data-story-description]').textContent = entry[2];
  $('[data-story-principle]').textContent = entry[3];
  $('[data-story-progress]').textContent = `${String(stageIndex + 1).padStart(2, '0')} — 05`;
  const link = $('[data-story-link]');
  link.textContent = p.link;
  link.href = p.url;
  if (p.url.startsWith('https:')) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
  else { link.removeAttribute('target'); link.removeAttribute('rel'); }
  projectButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.labProject === projectKey)));
  stageButtons.forEach((b, i) => {
    b.setAttribute('aria-pressed', String(i === stageIndex));
    b.replaceChildren(Object.assign(document.createElement('span'), { textContent: String(i + 1).padStart(2, '0') }), document.createTextNode(p.stages[i][0]));
  });
  if (labVisual) labVisual.select(stageIndex, p.stages.map(s => s[0]));
}

projectButtons.forEach(b => b.addEventListener('click', () => updateStory(b.dataset.labProject, 0)));
stageButtons.forEach(b => b.addEventListener('click', () => updateStory(projectKey, Number(b.dataset.labStage))));
$('[data-story-prev]').addEventListener('click', () => updateStory(projectKey, stageIndex - 1));
$('[data-story-next]').addEventListener('click', () => updateStory(projectKey, stageIndex + 1));
$('[data-reset-view]').addEventListener('click', () => labVisual?.reset());
updateStory();

function updateMotionUI() {
  motionButtons.forEach(b => {
    b.textContent = reduced.matches ? 'Reduced motion' : paused ? 'Resume motion' : 'Pause motion';
    b.setAttribute('aria-pressed', String(paused || reduced.matches));
    b.disabled = reduced.matches;
  });
}
motionButtons.forEach(b => b.addEventListener('click', () => {
  paused = !paused;
  try { localStorage.setItem('advait-motion', paused ? 'paused' : 'on'); } catch { /* optional */ }
  for (const v of visuals) v.controls.enableDamping = !paused;
  updateMotionUI();
  syncLoop();
}));
updateMotionUI();

function updateClock() {
  const node = $('[data-dublin-clock]');
  if (node) node.textContent = new Intl.DateTimeFormat('en-IE', { timeZone: 'Europe/Dublin', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
}
updateClock();
const clockTimer = setInterval(updateClock, 60_000);

// A single RAF scheduler serves only visible scenes, capped at about 30 fps.
function tick(time) {
  frame = null;
  const delta = Math.min((time - previousTime) / 1000, .08);
  if (time - previousTime >= 32) {
    previousTime = time;
    for (const v of visuals) if (v.visible) v.animate(delta, time / 1000);
  }
  syncLoop();
}
function syncLoop() {
  const shouldRun = !destroyed && !paused && !reduced.matches && !document.hidden && [...visuals].some(v => v.visible);
  if (shouldRun && frame === null) frame = requestAnimationFrame(tick);
  else if (!shouldRun && frame !== null) { cancelAnimationFrame(frame); frame = null; }
}
document.addEventListener('visibilitychange', syncLoop);
document.addEventListener('pagechange', () => { for (const v of visuals) v.resize(); syncLoop(); });

function makeVisual(THREE, OrbitControls, mount, kind) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(kind === 'hero' ? 36 : 39, 1, .1, 80);
  const initial = kind === 'hero' ? new THREE.Vector3(0, .45, 7.8) : new THREE.Vector3(0, 4.3, 8.2);
  camera.position.copy(initial);
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.tabIndex = -1;
  mount.appendChild(canvas);
  const controls = new OrbitControls(camera, canvas);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = !paused;
  controls.dampingFactor = .06;
  controls.minPolarAngle = .35;
  controls.maxPolarAngle = Math.PI * .74;
  controls.rotateSpeed = .5;
  controls.target.set(0, kind === 'hero' ? .1 : 0, 0);
  controls.update();
  const group = new THREE.Group();
  scene.add(group);
  scene.add(new THREE.HemisphereLight(0xd9f3cf, 0x092017, 2));
  const key = new THREE.DirectionalLight(0xd7ffa8, 3.5);
  key.position.set(3, 5, 4); scene.add(key);
  const rim = new THREE.PointLight(0x55c8b6, 16, 15);
  rim.position.set(-3, 0, 2); scene.add(rim);
  const geometries = new Set();
  const materials = new Set();
  const ownGeometry = g => { geometries.add(g); return g; };
  const ownMaterial = m => { materials.add(m); return m; };
  const nodes = [];
  const labels = [];
  const satellites = [];
  let picked = 0;
  let down = null;
  const lineMaterial = ownMaterial(new THREE.LineBasicMaterial({ color: 0x7fac66, transparent: true, opacity: .3 }));
  const outlineMaterial = ownMaterial(new THREE.LineBasicMaterial({ color: 0xbfee91, transparent: true, opacity: .62 }));
  let core = null;
  if (kind === 'hero') {
    const geometry = ownGeometry(new THREE.IcosahedronGeometry(.9, 1));
    core = new THREE.Mesh(geometry, ownMaterial(new THREE.MeshStandardMaterial({ color: 0x214c35, roughness: .24, metalness: .65, emissive: 0x153b20, emissiveIntensity: .4, flatShading: true })));
    group.add(core);
    const wire = new THREE.LineSegments(ownGeometry(new THREE.EdgesGeometry(geometry)), outlineMaterial);
    core.add(wire);
    const fine = new THREE.LineSegments(ownGeometry(new THREE.WireframeGeometry(ownGeometry(new THREE.IcosahedronGeometry(1.02, 2)))), lineMaterial);
    core.add(fine);
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(ownGeometry(new THREE.TorusGeometry(1.63 + i * .13, .009, 5, 100)), ownMaterial(new THREE.MeshBasicMaterial({ color: i === 1 ? 0x71c8b3 : 0xbfee91, transparent: true, opacity: i === 2 ? .3 : .7 })));
      ring.rotation.set(i * .8 + .3, i * .75, -.45 + i * .3);
      group.add(ring);
      satellites.push({ ring, phase: i * 2, radius: 1.63 + i * .13,
        point: new THREE.Mesh(ownGeometry(new THREE.SphereGeometry(.045, 12, 8)), ownMaterial(new THREE.MeshBasicMaterial({ color: i === 1 ? 0x7fe4ce : 0xd2f4a1 }))) });
      ring.add(satellites[i].point);
    }
    const halo = new THREE.Points(ownGeometry(new THREE.SphereGeometry(2.08, 38, 20)), ownMaterial(new THREE.PointsMaterial({ color: 0x8cba78, size: .012, transparent: true, opacity: .35 })));
    group.add(halo);
    group.rotation.z = -.18;
  } else {
    const positions = [new THREE.Vector3(-2.6, 0, .5), new THREE.Vector3(-1.3, .12, -.5), new THREE.Vector3(0, .3, -.8), new THREE.Vector3(1.3, .12, -.5), new THREE.Vector3(2.6, 0, .5)];
    const geometry = ownGeometry(new THREE.IcosahedronGeometry(.35, 0));
    positions.forEach((position, i) => {
      const material = ownMaterial(new THREE.MeshStandardMaterial({ color: 0x456a3f, emissive: 0x183321, emissiveIntensity: .3, roughness: .2, metalness: .5, flatShading: true }));
      const node = new THREE.Mesh(geometry, material);
      node.position.copy(position); node.userData.index = i;
      const edge = new THREE.LineSegments(ownGeometry(new THREE.EdgesGeometry(geometry)), ownMaterial(new THREE.LineBasicMaterial({ color: 0xbfee91, transparent: true, opacity: .6 })));
      node.add(edge); group.add(node); nodes.push(node);
      const base = new THREE.Mesh(ownGeometry(new THREE.CylinderGeometry(.42, .42, .07, 32)), ownMaterial(new THREE.MeshStandardMaterial({ color: 0x183a24, roughness: .5, metalness: .5 })));
      base.position.copy(position).add(new THREE.Vector3(0, -.62, 0));group.add(base);
      const label = document.createElement('span'); label.className = 'lab-node-label'; label.setAttribute('aria-hidden', 'true');mount.appendChild(label);labels.push(label);
      if (i) {
        const from = positions[i - 1];
        const path = new THREE.CatmullRomCurve3([from, from.clone().lerp(position, .5).add(new THREE.Vector3(0, .12, 0)), position]);
        group.add(new THREE.Mesh(ownGeometry(new THREE.TubeGeometry(path, 24, .015, 5, false)), ownMaterial(new THREE.MeshBasicMaterial({ color: 0x6c9c58, transparent: true, opacity: .7 }))));
        const dot = new THREE.Mesh(ownGeometry(new THREE.SphereGeometry(.035, 8, 6)), ownMaterial(new THREE.MeshBasicMaterial({ color: 0xd2f4a1 })));
        scene.add(dot);satellites.push({ point: dot, path, phase: i * .18 });
      }
    });
    const grid = new THREE.GridHelper(9, 22, 0x2b5136, 0x1a3022);
    grid.position.y = -.75;scene.add(grid);geometries.add(grid.geometry);materials.add(grid.material);
    const ray = new THREE.Raycaster();
    canvas.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; });
    canvas.addEventListener('pointerup', e => {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 7) return;
      const b = canvas.getBoundingClientRect();
      ray.setFromCamera(new THREE.Vector2((e.clientX - b.left) / b.width * 2 - 1, -(e.clientY - b.top) / b.height * 2 + 1), camera);
      const hit = ray.intersectObjects(nodes, false)[0];
      if (hit) updateStory(projectKey, hit.object.userData.index);
      down = null;
    });
  }
  function render() {
    if (destroyed || !mount.clientWidth) return;
    renderer.render(scene, camera);
    if (kind === 'lab') {
      nodes.forEach((node, i) => {
        const point = node.position.clone().add(new THREE.Vector3(0, .65, 0)).project(camera);
        labels[i].style.left = `${(point.x * .5 + .5) * mount.clientWidth}px`;
        labels[i].style.top = `${(-point.y * .5 + .5) * mount.clientHeight}px`;
        labels[i].hidden = point.z > 1;
      });
    }
  }
  const v = {
    controls, visible: false,
    resize() {
      const w = mount.clientWidth, h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.fov = kind === 'hero' ? 36 : 39;
      labels.forEach((label, i) => { label.textContent = w < 420 ? String(i + 1).padStart(2, '0') : label.dataset.title || ''; });
      camera.updateProjectionMatrix();renderer.setSize(w, h, false);render();
    },
    animate(delta, time) {
      if (core) { core.rotation.y += delta * .12;core.rotation.x = Math.sin(time * .18) * .1; }
      satellites.forEach(s => {
        if (s.path) s.point.position.copy(s.path.getPoint((time * .2 + s.phase) % 1));
        else { const angle = time * .17 + s.phase;s.point.position.set(Math.cos(angle) * s.radius, Math.sin(angle) * s.radius, 0); }
      });
      controls.update(delta); render();
    },
    select(index, names) {
      picked = index;
      nodes.forEach((n, i) => { n.material.color.set(i === picked ? 0xb8e38b : 0x456a3f);n.material.emissiveIntensity = i === picked ? .7 : .2;n.scale.setScalar(i === picked ? 1.25 : 1); });
      labels.forEach((l, i) => { l.dataset.title = `${String(i + 1).padStart(2, '0')} / ${names[i].toUpperCase()}`;l.textContent = mount.clientWidth < 420 ? String(i + 1).padStart(2, '0') : l.dataset.title;l.classList.toggle('is-selected', i === picked); });
      render();
    },
    reset() { camera.position.copy(initial);controls.target.set(0, kind === 'hero' ? .1 : 0, 0);controls.update();render(); },
    dispose() { intersection.disconnect();resizeObserver.disconnect();controls.dispose();renderer.dispose();for (const g of geometries) g.dispose();for (const m of materials) m.dispose();canvas.remove();labels.forEach(l => l.remove());mount.classList.remove('is-rendered');visuals.delete(v); }
  };
  controls.addEventListener('change', render);
  const resizeObserver = new ResizeObserver(() => v.resize());resizeObserver.observe(mount);
  const intersection = new IntersectionObserver(entries => { v.visible = entries[0].isIntersecting;syncLoop(); }, { threshold: .05 });intersection.observe(mount);
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault();v.dispose();if (kind === 'lab') { labVisual = null;setSceneStatus('Static architecture'); }syncLoop(); }, { once: true });
  visuals.add(v);v.resize();mount.classList.add('is-rendered');
  return v;
}

function setSceneStatus(text) {
  $('[data-scene-mode]').textContent = text;
  $('.scene-toolbar>span').textContent = text === 'Interactive 3D' ? 'Drag to orbit / select a node' : 'Select a stage below';
  $('[data-reset-view]').disabled = text !== 'Interactive 3D';
}
let initializing = false;
async function init3D() {
  if (initializing || reduced.matches || destroyed || visuals.size) return;
  initializing = true;
  try {
    const [THREE, { OrbitControls }] = await Promise.all([import('three'), import('three/addons/controls/OrbitControls.js')]);
    if (reduced.matches || destroyed) return;
    // Either scene can fail independently; readable static illustrations remain.
    try { makeVisual(THREE, OrbitControls, $('[data-core-scene]'), 'hero'); } catch { /* static core */ }
    try { labVisual = makeVisual(THREE, OrbitControls, $('[data-lab-scene]'), 'lab');labVisual.select(stageIndex, projects[projectKey].stages.map(s => s[0]));setSceneStatus('Interactive 3D'); } catch { setSceneStatus('Static architecture'); }
    syncLoop();
  } catch { setSceneStatus('Static architecture'); }
  finally { initializing = false; }
}
reduced.addEventListener('change', () => {
  if (reduced.matches) { for (const v of [...visuals]) v.dispose();labVisual = null;setSceneStatus('Reduced-motion architecture'); }
  else init3D();
  updateMotionUI();syncLoop();
});
if (reduced.matches) setSceneStatus('Reduced-motion architecture');
else init3D();
window.addEventListener('pagehide', () => { destroyed = true;if (frame !== null) cancelAnimationFrame(frame);clearInterval(clockTimer);for (const v of [...visuals]) v.dispose(); });
// BFCache restores the same document. Recreate visuals and clock scheduling.
window.addEventListener('pageshow', event => { if (event.persisted) location.reload(); });
