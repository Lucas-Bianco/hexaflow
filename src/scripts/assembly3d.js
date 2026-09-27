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
  // 'start' covers orbit/pan/zoom; pointerdown also covers plain clicks (picking
  // a part) so an isolated part doesn't keep spinning out of view.
  const stopRotate = () => { controls.autoRotate = false; };
  controls.addEventListener('start', stopRotate);
  renderer.domElement.addEventListener('pointerdown', stopRotate);

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
  const explodeLocal = new Map();   // node -> Vector3 offset in its parent's space at amount = 1 (fallback explode)
  const partWorldOff = new Map();   // partId -> Vector3 world offset at amount = 1 (for labels)
  let selectedId = null;
  let isolate = false;       // active isolation state (derived from isolateMode + selection)
  let isolateMode = false;   // user preference: should selecting a part hide the others?
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

  // The SolidWorks export is the EXPLODED view. If an assembled (collapsed)
  // export is available, read just its node transforms and blend between the
  // two: explode 0 = assembled, explode 1 = the file's exploded view.
  let poses = null;
  if (model.assembledSrc) {
    try {
      const res = await fetch(model.assembledSrc);
      if (res.ok) poses = buildPoses(gltf, await res.json());
    } catch (e) { console.warn('HexaFlow: assembled pose unavailable', e); }
  }
  if (poses) applyPose(0);

  indexScene();
  buildLabels();
  frameScene();
  if (poses) computePoseLabelOffsets();

  function buildPoses(gltf, aj) {
    const ej = gltf.parser.json, assoc = gltf.parser.associations;
    const byName = new Map();
    (aj.nodes || []).forEach((n, i) => { if (n.name && !byName.has(n.name)) byName.set(n.name, i); });
    const out = [];
    gltf.scene.traverse((obj) => {
      const a = assoc.get(obj);
      if (!a || a.nodes === undefined) return;
      const i = a.nodes, en = ej.nodes[i];
      let j;
      if (en && en.name) j = byName.get(en.name);
      else if (aj.nodes[i] && !aj.nodes[i].name) j = i;          // unnamed (inserts): same slot
      if (j === undefined) return;
      const an = aj.nodes[j], m = new THREE.Matrix4();
      if (an.matrix) m.fromArray(an.matrix);
      else m.compose(new THREE.Vector3(...(an.translation || [0, 0, 0])),
                     new THREE.Quaternion(...(an.rotation || [0, 0, 0, 1])),
                     new THREE.Vector3(...(an.scale || [1, 1, 1])));
      const pA = new THREE.Vector3(), qA = new THREE.Quaternion(), sA = new THREE.Vector3();
      m.decompose(pA, qA, sA);
      out.push({ obj, pA, qA, sA, pE: obj.position.clone(), qE: obj.quaternion.clone(), sE: obj.scale.clone() });
    });
    return out.length ? out : null;
  }
  function applyPose(t) {
    for (const p of poses) {
      p.obj.position.lerpVectors(p.pA, p.pE, t);
      p.obj.quaternion.slerpQuaternions(p.qA, p.qE, t);
      p.obj.scale.lerpVectors(p.sA, p.sE, t);
    }
    root.updateMatrixWorld(true);
  }
  function computePoseLabelOffsets() {
    const centerOf = (meshes) => { const b = new THREE.Box3(); meshes.forEach(m => b.expandByObject(m)); return b.getCenter(new THREE.Vector3()); };
    applyPose(1);
    const c1 = new Map(); for (const [id, ms] of meshOf) c1.set(id, centerOf(ms));
    applyPose(0);
    for (const [id, ms] of meshOf) partWorldOff.set(id, c1.get(id).sub(centerOf(ms)));
  }

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
      // Unnamed meshes that only resolve to the top-level assembly are loose
      // hardware (the brass heat-set inserts) — group them with the fasteners
      // so clicking one doesn't select the whole assembly.
      if (partId === model.rootId && !obj.name) partId = '__fasteners__';
      obj.userData.partId = partId;
      if (!partId) return;
      if (!meshOf.has(partId)) meshOf.set(partId, []);
      meshOf.get(partId).push(obj);
      // record the node that moves on explode. For real parts it's the TOPMOST
      // ancestor that still belongs to this part (so multi-body parts like the
      // PCB move as one piece). Fasteners/inserts move as their top-level node.
      let rn = null;
      if (partId === '__fasteners__') {
        let n = obj;
        while (n && n.parent && n.parent !== root && !(n.parent.name && matchPart(n.parent.name) === model.rootId)) n = n.parent;
        rn = n;
      } else {
        for (let n = obj; n && n !== root; n = n.parent) if (n.name && matchPart(n.name) === partId) rn = n;
        if (!rn) rn = obj;
      }
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

  function select(id, { isolate: iso = true, source = 'api' } = {}) {
    selectedId = id;
    // The root assembly is the overview — never isolate to its stray meshes.
    if (id === null || id === model.rootId) { isolate = false; setHighlight(null); }
    else { isolate = iso; setHighlight(id); }
    applyVisibility();
    onSelect(id, source);
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
      if (id && id !== '__fasteners__') { select(id, { isolate: isolateMode, source: 'pick' }); return; }
    }
    // empty space click → clear
    select(null, { source: 'pick' });
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
  // Isolate mode: when ON, selecting a part hides the others (old behavior). When
  // OFF (default), the whole assembly stays visible and the selected part is just
  // highlighted — so you keep context and can click around without losing the rest.
  function setIsolateMode(on) {
    isolateMode = on;
    if (!on) { isolate = false; applyVisibility(); }
    else if (selectedId && selectedId !== model.rootId) { isolate = true; applyVisibility(); }
  }

  // ── Explode ────────────────────────────────────────────────────────────
  // Measured ONCE with the model at rest (re-measuring the exploded model made
  // the distance feed on itself). Each piece moves away from the assembly center
  // along the line through its own bounding-box center.
  const EXPLODE_SCALE = 1.1;
  function computeExplode() {
    root.updateMatrixWorld(true);
    const rest = new THREE.Box3().setFromObject(root);
    const center = rest.getCenter(new THREE.Vector3());
    const span = rest.getSize(new THREE.Vector3()).length() || 1;
    for (const [partId, nodes] of partRoots) {
      for (const n of nodes) {
        const b = new THREE.Box3().setFromObject(n);
        if (b.isEmpty()) continue;
        const c = b.getCenter(new THREE.Vector3());
        const d = c.clone().sub(center);
        const len = d.length();
        if (len < span * 1e-3) d.set(0, 1, 0); else d.divideScalar(len);
        // distance grows with how far out the piece already sits, plus a minimum push
        const world = d.multiplyScalar((len + span * 0.12) * EXPLODE_SCALE);
        const parent = n.parent;
        const a = parent.worldToLocal(c.clone());
        const bpt = parent.worldToLocal(c.clone().add(world));
        explodeLocal.set(n, bpt.sub(a));
        if (!partWorldOff.has(partId)) partWorldOff.set(partId, world.clone());
      }
    }
  }
  // Pull the camera back as the model spreads so the pieces stay in frame.
  // The zoom the user had at 0% is remembered and restored on the way back.
  let baseDist = null;
  const EXPLODE_ZOOM = 0.75;
  function setExplode(amount) {
    if (!poses && explodeLocal.size === 0) computeExplode();
    if (explodeAmount === 0 && amount > 0) baseDist = camera.position.distanceTo(controls.target);
    if (baseDist !== null) {
      const dir = camera.position.clone().sub(controls.target).normalize();
      camera.position.copy(controls.target).addScaledVector(dir, baseDist * (1 + EXPLODE_ZOOM * amount));
      controls.update();
      if (amount === 0) baseDist = null;
    }
    explodeAmount = amount;
    if (poses) { applyPose(amount); return; }
    for (const [node, off] of explodeLocal) {
      const base = basePositions.get(node);
      if (base) node.position.copy(base).addScaledVector(off, amount);
    }
  }

  // ── Labels: project to screen each frame ───────────────────────────────
  const proj = new THREE.Vector3();
  function updateLabels() {
    for (const [partId, { el, center }] of labels) {
      if (!labelsOn || (isolate && partId !== selectedId)) { el.style.display = 'none'; continue; }
      proj.copy(center);
      const off = partWorldOff.get(partId);
      if (off && explodeAmount) proj.addScaledVector(off, explodeAmount);
      proj.project(camera);
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
    setIsolateMode,
    setExplode,
    hasAssembledPose: !!poses,
    toggleFullscreen: () => {
      const fs = host.closest('.hf3d-host') || host;
      if (!document.fullscreenElement) fs.requestFullscreen?.(); else document.exitFullscreen?.();
    },
    dispose: () => { cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); },
  };
}