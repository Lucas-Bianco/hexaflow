import { Routes as RR, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Mission from './pages/Mission.jsx'
import Journey from './pages/Journey.jsx'
import Geometry from './pages/Geometry.jsx'
import Substrates from './pages/Substrates.jsx'
import Aeroponics from './pages/Aeroponics.jsx'
import AiControl from './pages/AiControl.jsx'
import Assembly from './pages/Assembly.jsx'
import DropTesting from './pages/DropTesting.jsx'
import Cad from './pages/Cad.jsx'
import Gallery from './pages/Gallery.jsx'
import Sources from './pages/Sources.jsx'

export default function Routes() {
  return (
    <Layout>
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
    </Layout>
  )
}