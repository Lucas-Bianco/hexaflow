import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'
import { model, parts, subsystemColor } from '../../data/parts.js'
import { norm } from './norm.js'
import { withBase } from '../../lib/withBase.js'
import { useReducedMotion } from '../../lib/useReducedMotion.js'

const FAST = '__fasteners__'
const HIGHLIGHT = 0xfff0c4

function matchPartByName(name) {
  const n = norm(name)
  for (const p of parts) {
    if (!p.glMatch || p.glMatch.length === 0) continue
    if (p.glMatch.some((s) => n.includes(norm(s)))) return p.id
  }
  return null
}
function isFastenerName(name) {
  const n = norm(name)
  return model.fastenerMatches.some((m) => n.includes(norm(m)))
}

// Traverse the cloned glTF scene and tag every mesh with a partId via an
// ancestor walk (fasteners checked first). Builds meshOf, partRoots (for
// explode), basePositions, and per-part label centers.
function indexScene(root) {
  const meshOf = new Map()
  const partRoots = new Map()
  const basePositions = new Map()
  root.traverse((obj) => {
    if (!obj.isMesh) return
    let partId = null
    let node = obj
    while (node) {
      if (node.name) {
        if (isFastenerName(node.name)) { partId = FAST; break }
        const id = matchPartByName(node.name)
        if (id) { partId = id; break }
      }
      node = node.parent
    }
    obj.userData.partId = partId
    if (!partId) return
    if (!meshOf.has(partId)) meshOf.set(partId, [])
    meshOf.get(partId).push(obj)
    if (partId === FAST) return
    let rn = obj
    while (rn) {
      if (rn.name && matchPartByName(rn.name) === partId) break
      rn = rn.parent
    }
    if (rn) {
      if (!partRoots.has(partId)) partRoots.set(partId, [])
      if (!partRoots.get(partId).includes(rn)) partRoots.get(partId).push(rn)
      if (!basePositions.has(rn)) basePositions.set(rn, rn.position.clone())
    }
  })
  const labels = []
  for (const [partId, meshes] of meshOf) {
    if (partId === FAST) continue
    const part = parts.find((p) => p.id === partId)
    if (!part) continue
    const box = new THREE.Box3()
    meshes.forEach((m) => box.expandByObject(m))
    const center = new THREE.Vector3()
    box.getCenter(center)
    labels.push({ partId, name: part.name, color: subsystemColor[part.subsystem] || '#d4a017', center })
  }
  return { meshOf, partRoots, basePositions, labels }
}

function AssemblyModel({ selectedId, isolate, wireframe, labelsOn, fastenersOn, explode, onSelect }) {
  const { scene } = useGLTF(withBase(model.src))
  const { camera, controls } = useThree()
  const root = useMemo(() => scene.clone(true), [scene])
  const idx = useMemo(() => indexScene(root), [root])
  const explodeDir = useRef(new Map())

  // Frame the whole assembly once it loads.
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(root)
    const center = new THREE.Vector3()
    box.getCenter(center)
    const size = box.getSize(new THREE.Vector3()).length() || 1
    if (controls) {
      controls.target.copy(center)
      controls.minDistance = size * 0.15
      controls.maxDistance = size * 6
      controls.update()
    }
    camera.position.copy(center).add(new THREE.Vector3(size * 0.9, size * 0.6, size * 1.1))
    camera.near = size * 0.01
    camera.far = size * 20
    camera.updateProjectionMatrix()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root])

  // visibility + fasteners
  useEffect(() => {
    for (const [partId, meshes] of idx.meshOf) {
      if (partId === FAST) {
        meshes.forEach((m) => (m.visible = fastenersOn))
        continue
      }
      const vis = !isolate || partId === selectedId
      meshes.forEach((m) => (m.visible = vis))
    }
  }, [idx, selectedId, isolate, fastenersOn])

  // highlight (emissive) on the selected part
  useEffect(() => {
    for (const [partId, meshes] of idx.meshOf) {
      if (partId === FAST) continue
      const on = selectedId && partId === selectedId && selectedId !== model.rootId
      meshes.forEach((m) => {
        const mats = Array.isArray(m.material) ? m.material : [m.material]
        mats.forEach((mat) => {
          if (!mat.userData) mat.userData = {}
          if (mat.userData._emi === undefined) {
            mat.userData._emi = mat.emissive.getHex()
            mat.userData._emiI = mat.emissiveIntensity
          }
          if (on) {
            mat.emissive.setHex(HIGHLIGHT)
            mat.emissiveIntensity = 0.5
          } else {
            mat.emissive.setHex(mat.userData._emi)
            mat.emissiveIntensity = mat.userData._emiI
          }
        })
      })
    }
  }, [idx, selectedId])

  // wireframe
  useEffect(() => {
    root.traverse((o) => {
      if (o.isMesh) {
        const ms = Array.isArray(o.material) ? o.material : [o.material]
        ms.forEach((m) => (m.wireframe = wireframe))
      }
    })
  }, [root, wireframe])

  // explode
  useEffect(() => {
    if (explodeDir.current.size === 0) {
      const box = new THREE.Box3().setFromObject(root)
      const center = new THREE.Vector3()
      box.getCenter(center)
      for (const [, nodes] of idx.partRoots) {
        nodes.forEach((n) => {
          const pos = new THREE.Vector3()
          n.getWorldPosition(pos)
          const dir = pos.clone().sub(center)
          if (dir.lengthSq() < 1e-6) dir.set(0, 1, 0)
          dir.normalize()
          explodeDir.current.set(n, dir)
        })
      }
    }
    const box = new THREE.Box3().setFromObject(root)
    const span = box.getSize(new THREE.Vector3()).length() || 1
    const dist = span * 0.35 * explode
    for (const [node, dir] of explodeDir.current) {
      const base = idx.basePositions.get(node) || node.position
      node.position.copy(base).addScaledVector(dir, dist)
    }
  }, [idx, root, explode])

  return (
    <group
      onClick={(e) => {
        e.stopPropagation()
        const id = e.object?.userData?.partId
        if (id && id !== FAST) onSelect(id)
      }}
    >
      <primitive object={root} />
      {labelsOn &&
        idx.labels.map((l) => {
          const show = !isolate || l.partId === selectedId
          if (!show) return null
          return (
            <Html
              key={l.partId}
              position={l.center}
              center
              distanceFactor={2.2}
              zIndexRange={[20, 0]}
              style={{ pointerEvents: 'none' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '2px 8px',
                  borderRadius: 999,
                  whiteSpace: 'nowrap',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#e2e8f0',
                  background: 'rgba(6,14,28,0.72)',
                  border: '1px solid rgba(212,160,23,0.35)',
                  backdropFilter: 'blur(4px)'
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: 999, background: l.color }} />
                {l.name}
              </div>
            </Html>
          )
        })}
    </group>
  )
}

// AssemblyViewer — whole-assembly 3D viewer with click-isolate, toolbar, parts list.
// `explode` prop (0..1) is controlled when provided (scroll-driven); otherwise an
// internal slider drives it.
export default function AssemblyViewer({
  explode: explodeProp,
  showToolbar = true,
  showPartsList = true,
  height = '78vh',
  isolateDefault = true,
  onSelect
}) {
  const prefersReduced = useReducedMotion()
  const [selectedId, setSelectedId] = useState(null)
  const [isolate, setIsolate] = useState(isolateDefault)
  const [wireframe, setWireframe] = useState(false)
  const [labelsOn, setLabelsOn] = useState(true)
  const [fastenersOn, setFastenersOn] = useState(false)
  const [internalExplode, setInternalExplode] = useState(0)
  const [interacted, setInteracted] = useState(false)

  const explode = explodeProp !== undefined ? explodeProp : internalExplode

  const select = (id) => {
    setSelectedId(id)
    setIsolate(id && id !== model.rootId ? isolate : false)
    if (id) setInteracted(true)
    onSelect?.(id)
  }
  const reset = () => {
    setSelectedId(null)
    setIsolate(false)
    onSelect?.(null)
  }

  const listable = parts.filter((p) => p.id !== model.rootId && p.glMatch && p.glMatch.length > 0)

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-hex-line bg-hex-panel"
        style={{ height }}
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [3, 2, 5], fov: 45 }}
          onPointerMissed={reset}
        >
          <color attach="background" args={['#060e1c']} />
          <fog attach="fog" args={['#060e1c', 6, 22]} />
          <hemisphereLight args={['#bcd6ff', '#0a1626', 0.9]} />
          <directionalLight position={[3, 5, 4]} intensity={1.35} color="#fff2cc" />
          <directionalLight position={[-4, 2, -3]} intensity={0.55} color="#93c5fd" />
          <directionalLight position={[0, -3, -5]} intensity={0.6} color="#d4a017" />
          <Suspense fallback={null}>
            <AssemblyModel
              selectedId={selectedId}
              isolate={isolate}
              wireframe={wireframe}
              labelsOn={labelsOn}
              fastenersOn={fastenersOn}
              explode={explode}
              onSelect={select}
            />
            <Environment preset="city" />
            <ContactShadows position={[0, -1.2, 0]} opacity={0.5} scale={12} blur={2.5} far={6} />
          </Suspense>
          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.08}
            autoRotate={!interacted && !prefersReduced}
            autoRotateSpeed={0.7}
          />
        </Canvas>

        {showToolbar && (
          <div className="pointer-events-auto absolute left-3 top-3 flex flex-wrap gap-2">
            <ToolbarBtn active={isolate} onClick={() => setIsolate((v) => !v)}>Isolate</ToolbarBtn>
            <ToolbarBtn active={wireframe} onClick={() => setWireframe((v) => !v)}>Wireframe</ToolbarBtn>
            <ToolbarBtn active={labelsOn} onClick={() => setLabelsOn((v) => !v)}>Labels</ToolbarBtn>
            <ToolbarBtn active={fastenersOn} onClick={() => setFastenersOn((v) => !v)}>Fasteners</ToolbarBtn>
            <ToolbarBtn onClick={reset}>Reset</ToolbarBtn>
            {explodeProp === undefined && (
              <label className="flex items-center gap-2 rounded-lg border border-hex-line bg-hex-bg/70 px-3 py-1.5 text-xs text-slate-300 backdrop-blur">
                Explode
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={internalExplode}
                  onChange={(e) => setInternalExplode(parseFloat(e.target.value))}
                  className="accent-hex-gold"
                />
              </label>
            )}
          </div>
        )}

        {selectedId && (
          <div className="pointer-events-none absolute bottom-3 left-3 max-w-md rounded-xl border border-hex-line bg-hex-bg/80 p-3 text-sm backdrop-blur">
            {(() => {
              const p = parts.find((x) => x.id === selectedId)
              return p ? (
                <>
                  <div className="text-xs uppercase tracking-widest text-hex-gold/80">{p.subsystem}</div>
                  <div className="font-display font-bold text-white">{p.name}</div>
                  <div className="mt-1 text-slate-300">{p.role}</div>
                </>
              ) : null
            })()}
          </div>
        )}
      </div>

      {showPartsList && (
        <div className="max-h-[78vh] overflow-y-auto rounded-2xl border border-hex-line bg-hex-panel p-3">
          <div className="mb-2 px-1 text-xs uppercase tracking-[0.2em] text-hex-muted2">
            Parts ({listable.length})
          </div>
          <div className="grid gap-1">
            {listable.map((p) => (
              <button
                key={p.id}
                onClick={() => select(p.id)}
                className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  selectedId === p.id ? 'bg-hex-gold/15 text-white' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: subsystemColor[p.subsystem] || '#d4a017' }}
                  />
                  <span className="font-medium">{p.name}</span>
                </div>
                <div className="mt-0.5 pl-4 text-xs text-hex-muted2">{p.subsystem}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ToolbarBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-xs backdrop-blur transition-colors ${
        active
          ? 'border-hex-gold/60 bg-hex-gold/20 text-white'
          : 'border-hex-line bg-hex-bg/70 text-slate-300 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}