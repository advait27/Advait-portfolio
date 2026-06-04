// Animated 3D ClawbackVault pipeline (vanilla Three.js, ES module).
//
//   Inbox → Header Scan → PII-Masked Body Fetch → Signal Classification
//   (Claude Sonnet 4.6) → 4-Tier Churn Engine
//
// Data "packets" travel along the path; at the PII-mask node a packet's label
// visibly transforms into ●●●● before continuing. A HUD counts up the LLM cost
// reduction. Lazy-inits via IntersectionObserver and disposes when offscreen.
// Falls back to a static SVG diagram when WebGL is unavailable OR the visitor
// prefers reduced motion.

const mount = document.querySelector("[data-pipeline]");
// Kicked off at the bottom of the file, once all module bindings (incl.
// `hudDone`) are initialized — initPipeline can reach runHud synchronously.

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

function showFallback(mount) {
  mount.classList.add("pipeline--static");
  const fb = mount.querySelector(".pipeline-fallback");
  if (fb) fb.hidden = false;
  runHud(mount); // still animate the counter (respects reduced motion inside)
}

async function initPipeline(mount) {
  if (prefersReducedMotion() || !webglAvailable()) {
    showFallback(mount);
    return;
  }

  let THREE, OrbitControls;
  try {
    THREE = await import("three");
    ({ OrbitControls } = await import("three/addons/controls/OrbitControls.js"));
  } catch {
    showFallback(mount); // CDN blocked / import failed
    return;
  }

  const fb = mount.querySelector(".pipeline-fallback");
  if (fb) fb.hidden = true;

  const ACCENT = 0x52f6ff;
  const BLUE = 0x4f7bff;
  const LIME = 0xb8ff6a;
  const STAGES = [
    { name: "Inbox", color: ACCENT },
    { name: "Header Scan", color: ACCENT },
    { name: "PII-Mask Fetch", color: BLUE },
    { name: "Signal · Claude", color: ACCENT },
    { name: "4-Tier Churn", color: LIME },
  ];
  const PII_INDEX = 2;
  const SAMPLE = ["from: jane@acme.co", "subject: renewal?", "body: thinking of…"];
  const MASKED = "●●●●  ●●●●";

  let renderer, scene, camera, controls, raf;
  let running = false;
  let built = false;
  const disposables = [];
  const packets = [];
  const nodePositions = [];

  // ---- label sprite helper ----------------------------------------------
  function makeLabel(text, color = "#dfe9f5", scale = 1) {
    const pad = 16;
    const font = 'bold 42px "JetBrains Mono", monospace';
    const measure = document.createElement("canvas").getContext("2d");
    measure.font = font;
    const w = Math.ceil(measure.measureText(text).width) + pad * 2;
    const h = 72;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    ctx.font = font;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = color;
    ctx.fillText(text, w / 2, h / 2 + 2);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set((w / h) * 0.9 * scale, 0.9 * scale, 1);
    disposables.push(tex, mat);
    return sprite;
  }

  function build() {
    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || 340;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 13);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.domElement.classList.add("pipeline-canvas");
    mount.insertBefore(renderer.domElement, mount.firstChild);

    scene.add(new THREE.AmbientLight(0x88aaff, 0.8));
    const key = new THREE.PointLight(ACCENT, 120, 60);
    key.position.set(-6, 8, 10);
    scene.add(key);
    const fill = new THREE.PointLight(BLUE, 80, 60);
    fill.position.set(8, -4, 8);
    scene.add(fill);

    const group = new THREE.Group();
    scene.add(group);

    const N = STAGES.length;
    const spread = 11;
    const nodeGeo = new THREE.IcosahedronGeometry(0.62, 1);
    disposables.push(nodeGeo);

    for (let i = 0; i < N; i++) {
      const x = (i / (N - 1) - 0.5) * spread;
      const pos = new THREE.Vector3(x, 0, 0);
      nodePositions.push(pos);

      const mat = new THREE.MeshStandardMaterial({
        color: STAGES[i].color,
        emissive: STAGES[i].color,
        emissiveIntensity: 0.55,
        metalness: 0.4,
        roughness: 0.25,
      });
      disposables.push(mat);
      const node = new THREE.Mesh(nodeGeo, mat);
      node.position.copy(pos);
      node.userData.spin = 0.4 + i * 0.05;
      group.add(node);

      // PII node gets a translucent "shield" cage
      if (i === PII_INDEX) {
        const cageGeo = new THREE.IcosahedronGeometry(1.05, 1);
        const cageMat = new THREE.MeshBasicMaterial({
          color: BLUE,
          wireframe: true,
          transparent: true,
          opacity: 0.35,
        });
        disposables.push(cageGeo, cageMat);
        const cage = new THREE.Mesh(cageGeo, cageMat);
        cage.position.copy(pos);
        group.add(cage);
        node.userData.cage = cage;
      }

      const label = makeLabel(STAGES[i].name, "#eaf2fb", 1);
      label.position.set(x, 1.5, 0);
      group.add(label);

      // connector to previous node
      if (i > 0) {
        const a = nodePositions[i - 1];
        const b = pos;
        const len = a.distanceTo(b);
        const tubeGeo = new THREE.CylinderGeometry(0.035, 0.035, len, 8);
        const tubeMat = new THREE.MeshBasicMaterial({
          color: 0x7fd8ff,
          transparent: true,
          opacity: 0.35,
        });
        disposables.push(tubeGeo, tubeMat);
        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        tube.position.copy(a.clone().lerp(b, 0.5));
        tube.rotation.z = Math.PI / 2;
        group.add(tube);
      }
    }

    // packets
    const packetGeo = new THREE.SphereGeometry(0.16, 16, 16);
    disposables.push(packetGeo);
    for (let p = 0; p < 3; p++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: LIME,
        emissiveIntensity: 0.9,
      });
      disposables.push(mat);
      const mesh = new THREE.Mesh(packetGeo, mat);
      const label = makeLabel(SAMPLE[p % SAMPLE.length], "#bff5d0", 0.62);
      mesh.add(label);
      label.position.set(0, 0.55, 0);
      group.add(mesh);
      packets.push({
        mesh,
        label,
        text: SAMPLE[p % SAMPLE.length],
        t: (p / 3) * (N - 1), // stagger along the path
        masked: false,
      });
    }

    scene.userData.group = group;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 8;
    controls.maxDistance = 20;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    controls.target.set(0, 0, 0);
    // pause auto-rotate while the user is actively dragging
    controls.addEventListener("start", () => (controls.autoRotate = false));
    controls.addEventListener("end", () => (controls.autoRotate = true));

    built = true;
    runHud(mount);
  }

  function updatePacket(pk, dt) {
    const N = STAGES.length;
    pk.t += dt * 0.55;
    if (pk.t >= N - 1) {
      pk.t -= N - 1; // loop
      pk.masked = false;
      if (pk.label) setLabelMasked(pk, false);
    }
    const seg = Math.floor(pk.t);
    const local = pk.t - seg;
    const a = nodePositions[seg];
    const b = nodePositions[Math.min(seg + 1, N - 1)];
    pk.mesh.position.copy(a.clone().lerp(b, local));

    // signature beat: transform to masked once past the PII node
    if (!pk.masked && pk.t >= PII_INDEX) {
      pk.masked = true;
      setLabelMasked(pk, true);
    }
  }

  function setLabelMasked(pk, masked) {
    if (pk.label) {
      pk.mesh.remove(pk.label);
      const tex = pk.label.material.map;
      pk.label.material.dispose();
      if (tex) tex.dispose();
    }
    const newLabel = makeLabel(masked ? MASKED : pk.text, masked ? "#9fd0ff" : "#bff5d0", 0.62);
    newLabel.position.set(0, 0.55, 0);
    pk.mesh.add(newLabel);
    pk.label = newLabel;
    pk.mesh.material.emissive.setHex(masked ? BLUE : LIME);
  }

  let lastTime = 0;
  function loop(time) {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0.016;
    lastTime = time;

    const group = scene.userData.group;
    group.children.forEach((ch) => {
      if (ch.userData.spin) ch.rotation.y += ch.userData.spin * dt;
      if (ch.userData.cage) ch.userData.cage.rotation.y -= 0.3 * dt;
    });
    packets.forEach((pk) => updatePacket(pk, dt));
    controls.update();
    renderer.render(scene, camera);
  }

  function start() {
    if (!built) build();
    if (running) return;
    running = true;
    lastTime = 0;
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
  }

  function dispose() {
    stop();
    if (controls) controls.dispose();
    disposables.forEach((d) => d.dispose && d.dispose());
    disposables.length = 0;
    packets.length = 0;
    nodePositions.length = 0;
    if (renderer) {
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.remove();
    }
    renderer = scene = camera = controls = null;
    built = false;
  }

  function onResize() {
    if (!built || !renderer) return;
    const w = mount.clientWidth;
    const h = mount.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", onResize);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (built && isInView) start();
  });

  // Lazy-init + dispose based on visibility.
  let isInView = false;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isInView = entry.isIntersecting;
        if (entry.isIntersecting) {
          start();
        } else {
          dispose(); // free GPU memory while offscreen; rebuilds on return
        }
      });
    },
    { threshold: 0.15 }
  );
  io.observe(mount);
}

// ---- cost-reduction HUD counter (DOM, used by both 3D and fallback) -----
let hudDone = false;
function runHud(mount) {
  if (hudDone) return;
  const el = mount.querySelector("[data-hud-count]");
  if (!el) return;
  hudDone = true;
  const target = parseFloat(el.dataset.hudCount) || 0;
  const suffix = el.dataset.hudSuffix || "";
  if (prefersReducedMotion()) {
    el.textContent = target + suffix;
    return;
  }
  const duration = 1500;
  let startTime = null;
  const step = (ts) => {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Start now that every binding above is initialized.
if (mount) initPipeline(mount);
