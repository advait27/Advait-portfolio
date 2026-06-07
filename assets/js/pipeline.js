// Animated 3D ClawbackVault pipeline (vanilla Three.js, ES module).
//
//   Inbox → Header Scan → PII-Masked Body Fetch → Signal Classification
//   (Claude Sonnet 4.6) → 4-Tier Churn Engine
//
// Labelled data "packets" travel along the path; at the PII-mask node a packet's
// label visibly transforms into ●●●● before continuing. A continuous stream of
// flow dots, breathing nodes, a drifting particle field and a cinematic sway keep
// the scene alive without the messy full-spin overlap. A HUD counts up the LLM
// cost reduction. Lazy-inits via IntersectionObserver and disposes when offscreen.
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
  let isDragging = false;
  let tSec = 0; // accumulated seconds, drives all idle motion
  const disposables = [];
  const packets = [];
  const flowDots = [];
  const nodes = []; // { mesh, phase, baseEmissive }
  const tubes = []; // connector meshes (pulsing)
  const nodePositions = [];

  // ---- label sprite helper ----------------------------------------------
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // Labels get a translucent rounded plate + always-on-top draw so they stay
  // legible against the spheres and one another.
  function makeLabel(text, color = "#dfe9f5", scale = 1, stroke = "rgba(127,216,255,0.3)") {
    const pad = 20;
    const font = '600 42px "JetBrains Mono", monospace';
    const measure = document.createElement("canvas").getContext("2d");
    measure.font = font;
    const tw = Math.ceil(measure.measureText(text).width);
    const w = tw + pad * 2;
    const h = 88;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");

    ctx.fillStyle = "rgba(7, 11, 20, 0.74)";
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    roundRect(ctx, 3, 16, w - 6, h - 32, 24);
    ctx.fill();
    ctx.stroke();

    ctx.font = font;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = color;
    ctx.fillText(text, w / 2, h / 2 + 1);

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
      depthTest: false, // draw over geometry so labels never get buried
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set((w / h) * 1.05 * scale, 1.05 * scale, 1);
    sprite.renderOrder = 10;
    disposables.push(tex, mat);
    return sprite;
  }

  function build() {
    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || 340;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 2.6, 13);

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
      node.userData.spin = 0.3 + i * 0.04;
      group.add(node);
      nodes.push({ mesh: node, phase: i * 0.9, baseEmissive: 0.55 });

      // soft glow halo behind each node
      const haloMat = new THREE.SpriteMaterial({
        map: makeGlowTexture(),
        color: STAGES[i].color,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      disposables.push(haloMat, haloMat.map);
      const halo = new THREE.Sprite(haloMat);
      halo.scale.set(3.2, 3.2, 1);
      halo.position.copy(pos);
      node.userData.halo = halo;
      group.add(halo);

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

      const isFinal = i === N - 1;
      const labelColor = isFinal ? "#d8ffb0" : i === PII_INDEX ? "#bcd4ff" : "#eaf2fb";
      const labelStroke = isFinal
        ? "rgba(184,255,106,0.45)"
        : i === PII_INDEX
        ? "rgba(79,123,255,0.5)"
        : "rgba(127,216,255,0.3)";
      const label = makeLabel(STAGES[i].name, labelColor, 0.92, labelStroke);
      label.position.set(x, 1.85, 0);
      label.userData.baseY = 1.85;
      label.userData.phase = i * 0.7;
      node.userData.label = label;
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
          opacity: 0.32,
        });
        disposables.push(tubeGeo, tubeMat);
        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        tube.position.copy(a.clone().lerp(b, 0.5));
        tube.rotation.z = Math.PI / 2;
        group.add(tube);
        tubes.push(tube);
      }
    }

    // continuous "data stream" — many small dots flowing the whole path
    const flowGeo = new THREE.SphereGeometry(0.07, 8, 8);
    const flowMat = new THREE.MeshBasicMaterial({ color: 0xaef0ff });
    disposables.push(flowGeo, flowMat);
    const FLOW_COUNT = 16;
    for (let d = 0; d < FLOW_COUNT; d++) {
      const dot = new THREE.Mesh(flowGeo, flowMat);
      group.add(dot);
      flowDots.push({
        mesh: dot,
        t: (d / FLOW_COUNT) * (N - 1),
        speed: 0.75 + (d % 4) * 0.12,
      });
    }

    // labelled packets (carry the PII-masking story)
    const packetGeo = new THREE.SphereGeometry(0.18, 16, 16);
    disposables.push(packetGeo);
    for (let p = 0; p < 3; p++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: LIME,
        emissiveIntensity: 0.95,
      });
      disposables.push(mat);
      const mesh = new THREE.Mesh(packetGeo, mat);
      const label = makeLabel(SAMPLE[p % SAMPLE.length], "#c7ffd6", 0.6, "rgba(184,255,106,0.4)");
      mesh.add(label);
      label.position.set(0, 0.62, 0);
      group.add(mesh);
      packets.push({
        mesh,
        label,
        text: SAMPLE[p % SAMPLE.length],
        t: (p / 3) * (N - 1), // stagger along the path
        speed: 0.5 + p * 0.06,
        masked: false,
      });
    }

    // drifting particle field for depth
    const PARTICLES = 150;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(PARTICLES * 3);
    for (let i = 0; i < PARTICLES; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 16;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x7fd8ff,
      size: 0.05,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(pGeo, pMat);
    const particles = new THREE.Points(pGeo, pMat);
    group.add(particles);
    scene.userData.particles = particles;

    scene.userData.group = group;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 8;
    controls.maxDistance = 20;
    controls.autoRotate = false; // idle motion is the gentle group sway instead
    controls.target.set(0, 0, 0);
    controls.addEventListener("start", () => (isDragging = true));
    controls.addEventListener("end", () => (isDragging = false));

    built = true;
    runHud(mount);
  }

  // radial glow sprite texture (shared helper)
  function makeGlowTexture() {
    const s = 128;
    const c = document.createElement("canvas");
    c.width = c.height = s;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(255,255,255,0.9)");
    g.addColorStop(0.25, "rgba(255,255,255,0.35)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    return new THREE.CanvasTexture(c);
  }

  function pathPos(t) {
    const N = STAGES.length;
    const seg = Math.floor(t);
    const local = t - seg;
    const a = nodePositions[Math.min(seg, N - 1)];
    const b = nodePositions[Math.min(seg + 1, N - 1)];
    return a.clone().lerp(b, local);
  }

  function updatePacket(pk, dt) {
    const N = STAGES.length;
    pk.t += dt * pk.speed;
    if (pk.t >= N - 1) {
      pk.t -= N - 1; // loop
      pk.masked = false;
      if (pk.label) setLabelMasked(pk, false);
    }
    pk.mesh.position.copy(pathPos(pk.t));

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
    const newLabel = masked
      ? makeLabel(MASKED, "#a9d4ff", 0.6, "rgba(79,123,255,0.5)")
      : makeLabel(pk.text, "#c7ffd6", 0.6, "rgba(184,255,106,0.4)");
    newLabel.position.set(0, 0.62, 0);
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
    tSec += dt;

    const group = scene.userData.group;

    // breathing nodes: emissive pulse + subtle scale + spinning + bobbing halo
    nodes.forEach((n) => {
      const pulse = 0.5 + 0.5 * Math.sin(tSec * 2 + n.phase);
      n.mesh.material.emissiveIntensity = n.baseEmissive + pulse * 0.5;
      const s = 1 + pulse * 0.06;
      n.mesh.scale.setScalar(s);
      n.mesh.rotation.y += n.mesh.userData.spin * dt;
      if (n.mesh.userData.halo) n.mesh.userData.halo.material.opacity = 0.3 + pulse * 0.35;
      if (n.mesh.userData.cage) n.mesh.userData.cage.rotation.y -= 0.35 * dt;
      if (n.mesh.userData.label) {
        const lb = n.mesh.userData.label;
        lb.position.y = lb.userData.baseY + Math.sin(tSec * 1.4 + lb.userData.phase) * 0.06;
      }
    });

    // pulsing connectors
    tubes.forEach((tube, i) => {
      tube.material.opacity = 0.22 + 0.16 * (0.5 + 0.5 * Math.sin(tSec * 3 - i * 0.8));
    });

    // continuous data stream
    const N = STAGES.length;
    flowDots.forEach((fd) => {
      fd.t += dt * fd.speed;
      if (fd.t >= N - 1) fd.t -= N - 1;
      fd.mesh.position.copy(pathPos(fd.t));
    });

    packets.forEach((pk) => updatePacket(pk, dt));

    // drifting particles
    if (scene.userData.particles) scene.userData.particles.rotation.y += dt * 0.04;

    // cinematic idle motion: gentle pendulum sway + tilt + bob (paused while dragging)
    if (!isDragging) {
      const targetY = Math.sin(tSec * 0.32) * 0.34;
      group.rotation.y += (targetY - group.rotation.y) * 0.04;
      group.rotation.x = Math.sin(tSec * 0.24) * 0.07;
      group.position.y = Math.sin(tSec * 0.6) * 0.12;
    }

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
    flowDots.length = 0;
    nodes.length = 0;
    tubes.length = 0;
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
