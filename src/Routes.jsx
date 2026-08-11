import { lazy, Suspense } from 'react'
import { Routes as RR, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'

// Route-level code splitting: 3D-heavy pages (Assembly, Geometry, Cad) and the
// Gallery lightbox load on demand, keeping the initial bundle small.
const Home = lazy(() => import('./pages/Home.jsx'))
const Mission = lazy(() => import('./pages/Mission.jsx'))
const Journey = lazy(() => import('./pages/Journey.jsx'))
const Geometry = lazy(() => import('./pages/Geometry.jsx'))
const Substrates = lazy(() => import('./pages/Substrates.jsx'))
const Aeroponics = lazy(() => import('./pages/Aeroponics.jsx'))
const AiControl = lazy(() => import('./pages/AiControl.jsx'))
const Assembly = lazy(() => import('./pages/Assembly.jsx'))
const DropTesting = lazy(() => import('./pages/DropTesting.jsx'))
const Cad = lazy(() => import('./pages/Cad.jsx'))
const Gallery = lazy(() => import('./pages/Gallery.jsx'))
const Sources = lazy(() => import('./pages/Sources.jsx'))

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="rounded-full border border-hex-line bg-hex-panel px-4 py-2 text-sm text-hex-gold/80">
        Loading…
      </div>
    </div>
  )
}

export default function Routes() {
  return (
    <Layout>
      <Suspense fallback={<PageFallback />}>
        <RR>
          <Route path="/" element={<Home />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/geometry" element={<Geometry />} />
          <Route path="/substrates" element={<Substrates />} />
          <Route path="/aeroponics" element={<Aeroponics />} />
          <Route path="/ai-control" element={<AiControl />} />
          <Route path="/assembly" element={<Assembly />} />
          <Route path="/drop-testing" element={<DropTesting />} />
          <Route path="/cad" element={<Cad />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/sources" element={<Sources />} />
          <Route path="*" element={<Home />} />
        </RR>
      </Suspense>
    </Layout>
  )
}