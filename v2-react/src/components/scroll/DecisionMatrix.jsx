import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../../lib/useReducedMotion.js'

gsap.registerPlugin(ScrollTrigger)

// Substrate candidate rows with score bars that fill on scroll. Used in the
// Substrates page to show why the chosen substrate won. `rows` = [{name, scores:{label:value}, winner}].
export default function DecisionMatrix({ rows = [], maxScore = 10 }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const bars = el.querySelectorAll('[data-bar]')
    const ctx = gsap.fromTo(
      bars,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.9,
        ease: 'power2.out',
        stagger: 0.04,
        transformOrigin: 'left center',
        scrollTrigger: { trigger: el, start: 'top 75%', once: true }
      }
    )
    return () => ctx.scrollTrigger?.kill()
  }, [reduced, rows])

  const criteria = rows.length
    ? Array.from(new Set(rows.flatMap((r) => Object.keys(r.scores || {}))))
    : []

  return (
    <div ref={ref} className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-left text-hex-muted2">
            <th className="p-3 font-medium">Substrate</th>
            {criteria.map((c) => (
              <th key={c} className="p-3 font-medium">{c}</th>
            ))}
            <th className="p-3 font-medium">Verdict</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-t border-hex-line">
              <td className={`p-3 font-medium ${r.winner ? 'text-hex-gold' : 'text-white'}`}>
                {r.name}
                {r.winner && <span className="ml-2 text-xs">★ chosen</span>}
              </td>
              {criteria.map((c) => {
                const v = (r.scores || {})[c] ?? 0
                const pct = Math.max(0, Math.min(100, (v / maxScore) * 100))
                return (
                  <td key={c} className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-hex-bg">
                        <div
                          data-bar
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background: r.winner ? '#d4a017' : '#475569',
                            transformOrigin: 'left center'
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">{v}</span>
                    </div>
                  </td>
                )
              })}
              <td className="p-3 text-xs text-slate-400">{r.verdict}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}