import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../lib/useReducedMotion.js'

gsap.registerPlugin(ScrollTrigger)

const fmt = (v, dp) => Number(v).toFixed(dp)

// Counts up to `value` when scrolled into view. `suffix` stays static so units
// never animate.
export default function StatCounter({ value, dp = 0, suffix = '', label, note }) {
  const numRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = numRef.current
    if (!el) return
    if (reduced) {
      el.textContent = fmt(value, dp)
      return
    }
    el.textContent = fmt(0, dp)
    const obj = { v: 0 }
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: value,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = fmt(obj.v, dp)
          }
        })
      }
    })
    return () => st.kill()
  }, [value, dp, reduced])

  return (
    <div className="rounded-2xl border border-hex-line bg-hex-panel p-6">
      <div className="flex items-baseline">
        <span ref={numRef} className="font-display text-4xl font-bold text-hex-gold sm:text-5xl">
          {fmt(value, dp)}
        </span>
        <span className="font-display text-2xl font-bold text-hex-gold">{suffix}</span>
      </div>
      {label && <div className="mt-2 text-sm font-medium text-white">{label}</div>}
      {note && <div className="mt-1 text-xs text-hex-muted">{note}</div>}
    </div>
  )
}