import { BrowserRouter } from 'react-router-dom'
import { ROUTE_BASE } from './lib/withBase.js'
import Routes from './Routes.jsx'

export default function App() {
  return (
    <BrowserRouter basename={ROUTE_BASE || undefined}>
      <Routes />
    </BrowserRouter>
  )
}