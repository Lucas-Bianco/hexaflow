// HexaFlow 3D Assembly Viewer — clean, organized module.
// Loads the exported SolidWorks glTF of the Nanolab assembly, links each mesh to
// a part in src/data/parts.js (by matching node names to part.glMatch), and exposes
// a small API the page can drive: select/isolate, wireframe, labels, explode, reset.
//
// Replaces the original 4,129-line bundled viewer.html with structured code.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const ACCENT = 0xd4a017;
const HIGHLIGHT = 0xfff0c4;

/**
 * Build the viewer inside `host`.
 * @param {HTMLElement} host container element
 * @param {object}   opts
 * @param {Array}    opts.parts          from src/data/parts.js
 * @param {object}   opts.subsystemColor subsystem -> hex color
 * @param {object}   opts.model          { src, rootName, fastenerMatches }
 * @param {(id:string|null)=>void} opts.onSelect called when the user picks a mesh
 * @returns {Promise<object>} viewer API
 */
export async function initViewer(host, opts) {
  const { parts, subsystemColor, model, onSelect = () => {} } = opts;

  // ── Scene ──────────────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x060e1c);
  scene.fog = new THREE.Fog(0x060e1c, 6, 22);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 200);
  camera.position.set(2.6, 1.8, 3.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);
  renderer.domElement.style.display = 'block';

  // Soft three-point-ish lighting on a dark stage.
  scene.add(new THREE.HemisphereLight(0xbcd6ff, 0x0a1626, 0.9));
  const key = new THREE.DirectionalLight(0xfff2cc, 1.35); key.position.set(3, 5, 4); scene.add(key);
  const fill = new THREE.DirectionalLight(0x93c5fd, 0.55); fill.position.set(-4, 2, -3); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xd4a017, 0.6);  rim.position.set(0, -3, -5); scene.add(rim);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 0.6;
  controls.maxDistance = 14;

  // Gentle auto-rotation until the user first interacts, then it stops for good.
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.7;
  controls.addEventListener('start', () => { controls.autoRotate = false; });

  // ── Label overlays (HTML, projected each frame) ─────────────────────────
  const labelLayer = document.createElement('div');
  labelLayer.className = 'hf3d-labels';
  host.appendChild(labelLayer);
  const labels = new Map(); // partId -> { el, node, pos }

  // ── State ──────────────────────────────────────────────────────────────
  let root = null;                  // glTF scene root
  const meshOf = new Map();         // partId -> Mesh[]
  const partRoots = new Map();      // partId -> Object3D[] (nodes to move on explode)
  const basePositions = new Map();  // Object3D -> Vector3 (original position)
  let selectedId = null;
  let isolate = false;
  let wireframe = false;
  let labelsOn = true;
  let explodeAmount = 0;
  let assemblyCenter = new THREE.Vector3();

  // ── Mesh <-> part mapping ───────────────────────────────────────────────
  // three.js GLTFLoader rewrites node names (space→_, strips "." and "/"), so
  // normalize both sides before substring-matching. Declared before indexScene()
  // is called because the hoisted matchPart/isFastener reference it.
  const norm = (s) => s.replace(/\s+/g, '_').replace(/[./]+/g, '');
  function matchPart(name) {
    const n = norm(name);
    for (const p of parts) {
      if (!p.glMatch || p.glMatch.length === 0) continue;
      if (p.glMatch.some(s => n.includes(norm(s)))) return p.id;
    }
    return null;
  }
  function isFastener(name) {
    const n = norm(name);
    return model.fastenerMatches.some(m => n.includes(norm(m)));
  }

  // ── Load glTF ───────────────────────────────────────────────────────────
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(model.src);
  root = gltf.scene;
  scene.add(root);

  indexScene();
  buildLabels();
  frameScene();

  function indexScene() {
    root.traverse((obj) => {
      if (!obj.isMesh) return;
      // Walk up; the closest named ancestor wins. Fasteners are checked at
      // every level so an m3-short parent is caught before the root assembly.
      let partId = null, node = obj;
      while (node) {
        if (node.name) {
          if (isFastener(node.name)) { partId = '__fasteners__'; break; }
          const id = matchPart(node.name);
          if (id) { partId = id; break; }
        }
        node = node.parent;
      }
      obj.userData.partId = partId;
      if (!partId) return;
      if (!meshOf.has(partId)) meshOf.set(partId, []);
      meshOf.get(partId).push(obj);
      // record the matched node as a part root (for explode)
      if (partId === '__fasteners__') return;
      let rn = obj;
      while (rn) { if (rn.name && matchPart(rn.name) === partId) break; rn = rn.parent; }
      if (rn) {
        if (!partRoots.has(partId)) partRoots.set(partId, []);
        if (!partRoots.get(partId).includes(rn)) partRoots.get(partId).push(rn);
        if (!basePositions.has(rn)) basePositions.set(rn, rn.position.clone());
      }
    });
    // hide fasteners by default
    const fast = meshOf.get('__fasteners__') || [];
    fast.forEach(m => (m.visible = false));
  }

  function buildLabels() {
    for (const [partId, meshes] of meshOf) {
      if (partId === '__fasteners__' || partId === null) continue;
      const part = parts.find(p => p.id === partId);
      if (!part) continue;
      const box = new THREE.Box3();
      meshes.forEach(m => box.expandByObject(m));
      const center = new THREE.Vector3();
      box.getCenter(center);
      const el = document.createElement('div');
      el.className = 'hf3d-label';
      el.dataset.part = partId;
      el.innerHTML = `<span class="hf3d-label-dot" style="background:${subsystemColor[part.subsystem] || ACCENT}"></span>${part.name}`;
      labelLayer.appendChild(el);
      labels.set(partId, { el, center });
    }
  }

  // ── Camera framing ──────────────────────────────────────────────────────
  function frameScene() {
    const box = new THREE.Box3().setFromObject(root);
    box.getCenter(assemblyCenter);
    const size = box.getSize(new THREE.Vector3()).length() || 1;
    controls.target.copy(assemblyCenter);
    camera.position.copy(assemblyCenter).add(new THREE.Vector3(size * 0.9, size * 0.6, size * 1.1));
    controls.minDistance = size * 0.15;
    controls.maxDistance = size * 6;
    controls.update();
  }

  // ── Selection / isolate ────────────────────────────────────────────────
  function applyVisibility() {
    for (const [partId, meshes] of meshOf) {
      if (partId === '__fasteners__' || partId === null) continue;
      const visible = !isolate || partId === selectedId;
      meshes.forEach(m => (m.visible = visible));
    }
  }

  function setHighlight(id) {
    for (const [partId, meshes] of meshOf) {
      if (partId === '__fasteners__' || partId === null) continue;
      const on = id && partId === id;
      meshes.forEach(m => {
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        mats.forEach(mat => {
          if (!mat.userData) mat.userData = {};
          if (mat.userData._emi === undefined) { mat.userData._emi = mat.emissive.getHex(); mat.userData._emiI = mat.emissiveIntensity; }
          if (on) { mat.emissive.setHex(HIGHLIGHT); mat.emissiveIntensity = 0.5; }
          else { mat.emissive.setHex(mat.userData._emi); mat.emissiveIntensity = mat.userData._emiI; }
        });
      });
    }
  }

  function select(id, { isolate: iso = true } = {}) {
    selectedId = id;
    // The root assembly is the overview — never isolate to its stray meshes.
    if (id === null || id === model.rootId) { isolate = false; setHighlight(null); }
    else { isolate = iso; setHighlight(id); }
    applyVisibility();
    onSelect(id);
  }

  // ── Picking ────────────────────────────────────────────────────────────
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let down = { x: 0, y: 0 };
  renderer.domElement.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY }; });
  renderer.domElement.addEventListener('pointerup', (e) => {
    // ignore drags
    if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) return;
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const targets = [];
    for (const meshes of meshOf.values()) for (const m of meshes) if (m.visible) targets.push(m);
    const hits = raycaster.intersectObjects(targets, false);
    if (hits.length) {
      const id = hits[0].object.userData.partId;
      if (id && id !== '__fasteners__') { select(id, { isolate: true }); return; }
    }
    // empty space click → clear
    select(null);
  });

  // ── Toggles ────────────────────────────────────────────────────────────
  function setWireframe(on) {
    wireframe = on;
    root.traverse((o) => { if (o.isMesh) { const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach(m => (m.wireframe = on)); } });
  }
  function setLabels(on) { labelsOn = on; }
  function setFastenersVisible(on) {
    (meshOf.get('__fasteners__') || []).forEach(m => (m.visible = on));
  }

  // ── Explode ────────────────────────────────────────────────────────────
  const explodeDir = new Map(); // partRoot node -> Vector3 direction (normalized) * unit
  function computeExplodeDirs() {
    for (const [partId, nodes] of partRoots) {
      nodes.forEach(n => {
        const pos = new THREE.Vector3();
        n.getWorldPosition(pos);
        const dir = pos.clone().sub(assemblyCenter);
        if (dir.lengthSq() < 1e-6) dir.set(0, 1, 0);
        dir.normalize();
        explodeDir.set(n, dir);
      });
    }
  }
  function setExplode(amount) {
    if (explodeDir.size === 0) computeExplodeDirs();
    explodeAmount = amount;
    const box = new THREE.Box3().setFromObject(root);
    const span = box.getSize(new THREE.Vector3()).length() || 1;
    const dist = span * 0.35 * amount;
    for (const [node, dir] of explodeDir) {
      const base = basePositions.get(node) || node.position;
      node.position.copy(base).addScaledVector(dir, dist);
    }
  }

  // ── Labels: project to screen each frame ───────────────────────────────
  const proj = new THREE.Vector3();
  function updateLabels() {
    for (const [partId, { el, center }] of labels) {
      if (!labelsOn || (isolate && partId !== selectedId)) { el.style.display = 'none'; continue; }
      proj.copy(center).project(camera);
      const inFront = proj.z < 1;
      if (!inFront) { el.style.display = 'none'; continue; }
      const x = (proj.x * 0.5 + 0.5) * host.clientWidth;
      const y = (-proj.y * 0.5 + 0.5) * host.clientHeight;
      el.style.display = 'flex';
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -120%)`;
    }
  }

  // ── Render loop + resize ───────────────────────────────────────────────
  function resize() {
    const w = host.clientWidth || 1, h = host.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  let raf = 0;
  function tick() {
    raf = requestAnimationFrame(tick);
    controls.update();
    updateLabels();
    renderer.render(scene, camera);
  }
  tick();

  // ── Public API ─────────────────────────────────────────────────────────
  return {
    select: (id, opts2) => select(id, opts2),
    resetView: () => { isolate = false; selectedId = null; applyVisibility(); setHighlight(null); frameScene(); onSelect(null); },
    setWireframe,
    setLabels,
    setFastenersVisible,
    setExplode,
    toggleFullscreen: () => {
      const fs = host.closest('.hf3d-host') || host;
      if (!document.fullscreenElement) fs.requestFullscreen?.(); else document.exitFullscreen?.();
    },
    dispose: () => { cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); },
  };
}