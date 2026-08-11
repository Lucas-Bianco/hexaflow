import { Suspense } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, useGLTF, Bounds, Html } from '@react-three/drei'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { withBase } from '../../lib/withBase.js'
import { useReducedMotion } from '../../lib/useReducedMotion.js'

const isSTL = (src) => /\.stl$/i.test(src)

function GltfModel({ src, wireframe }) {
  const { scene } = useGLTF(withBase(src))
  const cloned = scene.clone(true)
  if (wireframe) {
    cloned.traverse((o) => {
      if (o.isMesh) {
        const ms = Array.isArray(o.material) ? o.material : [o.material]
        ms.forEach((m) => (m.wireframe = true))
      }
    })
  }
  return <primitive object={cloned} />
}

function StlModel({ src, wireframe }) {
  const geometry = useLoader(STLLoader, withBase(src))
  return (
    <mesh geometry={geometry} castShadow receiveShadow rotation={[0, 0, 0]}>
      <meshStandardMaterial color="#c8a24a" metalness={0.25} roughness={0.55} wireframe={wireframe} />
    </mesh>
  )
}

function Loader() {
  return (
    <Html center>
      <div className="rounded-full bg-hex-bg/80 px-4 py-2 text-xs text-hex-gold/90 backdrop-blur">
        Loading 3D…
      </div>
    </Html>
  )
}

// Generic 3D viewer for a single GLB/glTF/STL. Used on subsystem pages.
export default function ModelViewer({ src, autoRotate = true, wireframe = false, className = '', caption }) {
  const prefersReduced = useReducedMotion()
  return (
    <div
      className={`relative h-[60vh] min-h-[420px] w-full overflow-hidden rounded-2xl border border-hex-line bg-hex-panel ${className}`}
    >
      <Canvas shadows dpr={[1, 2]} camera={{ position: [3, 2, 5], fov: 45 }}>
        <color attach="background" args={['#060e1c']} />
        <hemisphereLight args={['#bcd6ff', '#0a1626', 0.9]} />
        <directionalLight position={[4, 6, 4]} intensity={1.3} castShadow />
        <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#93c5fd" />
        <Suspense fallback={<Loader />}>
          <Bounds fit clip margin={1.25}>
            {isSTL(src) ? (
              <StlModel src={src} wireframe={wireframe} />
            ) : (
              <GltfModel src={src} wireframe={wireframe} />
            )}
          </Bounds>
          <Environment preset="city" />
          <ContactShadows position={[0, -1.2, 0]} opacity={0.5} scale={12} blur={2.5} far={6} />
        </Suspense>
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          autoRotate={autoRotate && !prefersReduced}
          autoRotateSpeed={0.7}
          minDistance={0.6}
          maxDistance={14}
        />
      </Canvas>
      {caption && (
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-hex-line bg-hex-bg/70 px-3 py-1 text-xs text-slate-300 backdrop-blur">
          {caption}
        </div>
      )}
    </div>
  )
}