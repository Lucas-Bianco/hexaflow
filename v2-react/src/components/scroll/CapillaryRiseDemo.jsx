import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../../lib/useReducedMotion.js'

gsap.registerPlugin(ScrollTrigger)

// SVG hex capillary channel whose water level rises with scroll progress,
// synced to the real measured numbers (14.7 mm mean rise, 10.12 mL capacity).
export default function CapillaryRiseDemo({ maxRise = 14.7, capacity = '10.12 mL', width = 0.48 }) {
  const ref = useRef(null)
  const waterRef = useRef(null)
  const labelRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    const water = waterRef.current
    if (!el || !water) return
    if (reduced) {
      gsap.set(water, { attr: { y: 200 - 150 }, opacity: 1 })
      if (labelRef.current) labelRef.current.textContent = `${maxRise} mm`
      return
    }
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 1,
      onUpdate: (self) => {
        const rise = self.progress * 150 // svg units
        water.setAttribute('y', 200 - rise)
        if (labelRef.current) labelRef.current.textContent = `${(self.progress * maxRise).toFixed(1)} mm`
      }
    })
    return () => st.kill()
  }, [maxRise, reduced])

  return (
    <div ref={ref} className="mx-auto w-full max-w-md">
      <svg viewBox="0 0 240 240" className="w-full" aria-label="Capillary rise demo">
        <defs>
          <linearGradient id="capWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {/* hex channel outline */}
        <path
          d="M120 20 L200 60 L200 180 L120 220 L40 180 L40 60 Z"
          fill="none"
          stroke="#d4a017"
          strokeWidth="2"
          opacity="0.7"
        />
        {/* water fill (rises) */}
        <rect
          ref={waterRef}
          x="40"
          y="200"
          width="160"
          height="240"
          fill="url(#capWater)"
          style={{ clipPath: 'polygon(50% 0%, 100% 18%, 100% 82%, 50% 100%, 0% 82%, 0% 18%)' }}
        />
        {/* surface line */}
        <line ref={labelRef} x1="40" y1="200" x2="200" y2="200" stroke="#e0f2fe" strokeWidth="1.5" opacity="0.9" />
      </svg>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-hex-muted">Capillary rise</span>
        <span className="font-display font-bold text-hex-gold">
          <span ref={labelRef}>0.0 mm</span>
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between text-xs text-hex-muted2">
        <span>Channel width {width} mm</span>
        <span>Capacity {capacity}</span>
      </div>
    </div>
  )
}