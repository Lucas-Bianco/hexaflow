import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../../lib/useReducedMotion.js'

gsap.registerPlugin(ScrollTrigger)

// Pinned horizontal scroll through `items`. The section pins and the track
// translates left as you scroll vertically. Reduced motion: vertical stack.
export default function HorizontalTimeline({ items = [], className = '' }) {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return
    const getDist = () => Math.max(0, track.scrollWidth - window.innerWidth)
    let st
    const build = () => {
      st?.kill()
      const dist = getDist()
      if (dist <= 0) return
      st = gsap.to(track, {
        x: -dist,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${dist}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true
        }
      })
    }
    build()
    const onResize = () => {
      build()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      st?.scrollTrigger?.kill()
    }
  }, [reduced, items])

  if (reduced) {
    return (
      <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {items.map((it) => (
          <TimelineCard key={it.id} item={it} />
        ))}
      </div>
    )
  }

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      <div ref={trackRef} className="flex h-full items-center gap-6 px-6 will-change-transform">
        {items.map((it) => (
          <div key={it.id} className="shrink-0" style={{ width: 'min(80vw, 520px)' }}>
            <TimelineCard item={it} />
          </div>
        ))}
      </div>
    </section>
  )
}

function TimelineCard({ item }) {
  return (
    <div className="h-[60vh] overflow-y-auto rounded-2xl border border-hex-line bg-hex-panel p-6">
      <div className="font-display text-sm font-bold uppercase tracking-widest text-hex-gold">
        {item.date}
      </div>
      <h3 className="mt-2 font-display text-2xl font-bold text-white">{item.title}</h3>
      {item.tag && (
        <span className="mt-3 inline-block rounded-full border border-hex-gold/40 bg-hex-gold/10 px-3 py-1 text-xs text-hex-gold">
          {item.tag}
        </span>
      )}
      <p className="mt-4 text-sm leading-relaxed text-slate-300">{item.body}</p>
      {item.bullets && (
        <ul className="mt-4 space-y-1.5 text-sm text-slate-400">
          {item.bullets.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-hex-gold">·</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}