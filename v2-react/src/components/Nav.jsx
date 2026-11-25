import { Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { withBase } from '../lib/withBase.js'

const LINKS = [
  { to: '/mission', label: 'Mission' },
  { to: '/journey', label: 'Journey' },
  { to: '/geometry', label: 'Geometry' },
  { to: '/aeroponics', label: 'Aeroponics' },
  { to: '/ai-control', label: 'AI Control' },
  { to: '/assembly', label: 'Assembly' },
  { to: '/drop-testing', label: 'Drop Test' },
  { to: '/gallery', label: 'Gallery' }
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [loc.pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-hex-bg/85 backdrop-blur-md border-b border-hex-line' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-lg font-bold tracking-tight text-white">
          Hexa<span className="text-hex-gold">Flow</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive ? 'text-hex-gold' : 'text-slate-300 hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <button
          aria-label="Toggle menu"
          className="text-slate-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>
      {open && (
        <div className="border-t border-hex-line bg-hex-bg/95 px-6 py-4 md:hidden">
          <div className="grid gap-3">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm ${isActive ? 'text-hex-gold' : 'text-slate-300'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}