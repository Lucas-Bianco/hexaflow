import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../lib/useReducedMotion.js'

gsap.registerPlugin(ScrollTrigger)

// Splits text into words or chars and animates them in on scroll.
export default function KineticText({ text, split = 'word', className = '', as: Tag = 'span' }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const tokens = split === 'word' ? text.split(' ') : Array.from(text)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const targets = el.querySelectorAll('[data-tok]')
    const ctx = gsap.fromTo(
      targets,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        stagger: split === 'word' ? 0.06 : 0.018,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    )
    return () => ctx.scrollTrigger?.kill()
  }, [text, split, reduced])

  return (
    <Tag ref={ref} className={className}>
      {tokens.map((t, i) => (
        <span
          key={i}
          data-tok
          style={{ display: 'inline-block', marginRight: split === 'word' ? '0.28em' : 0, willChange: 'transform, opacity' }}
        >
          {t}
        </span>
      ))}
    </Tag>
  )
}