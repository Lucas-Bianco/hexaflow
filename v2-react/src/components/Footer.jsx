import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-hex-line bg-hex-bg">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-display text-lg font-bold text-white">
            Hexa<span className="text-hex-gold">Flow</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-hex-muted">
            A modular capillary-action nanolab that uses AI vision and biomimicry to water plants
            in microgravity. Built for NASA HUNCH.
          </p>
        </div>
        <div>
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-hex-muted2">Explore</div>
          <ul className="grid gap-2 text-sm">
            <li><Link to="/mission" className="text-slate-300 hover:text-white">Mission</Link></li>
            <li><Link to="/journey" className="text-slate-300 hover:text-white">Design Journey</Link></li>
            <li><Link to="/assembly" className="text-slate-300 hover:text-white">The Nanolab</Link></li>
            <li><Link to="/drop-testing" className="text-slate-300 hover:text-white">Drop Testing</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-hex-muted2">Project</div>
          <ul className="grid gap-2 text-sm">
            <li><Link to="/cad" className="text-slate-300 hover:text-white">CAD &amp; Drawings</Link></li>
            <li><Link to="/gallery" className="text-slate-300 hover:text-white">Gallery</Link></li>
            <li><Link to="/sources" className="text-slate-300 hover:text-white">Sources &amp; Credits</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-hex-muted2">Team</div>
          <ul className="grid gap-1 text-sm text-slate-300">
            <li>Aidan — PM &amp; Hardware</li>
            <li>Nate — Water Movement</li>
            <li>Sabrina — Substrate</li>
            <li>Maddie — Modularity</li>
            <li>Lucas — Web Development</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-hex-line px-6 py-6 text-center text-xs text-hex-muted2">
        © {new Date().getFullYear()} HexaFlow / NASA HUNCH Nanolab team. Designed and built by the team.
      </div>
    </footer>
  )
}