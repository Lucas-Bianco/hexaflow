import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../lib/useReducedMotion.js'

gsap.registerPlugin(ScrollTrigger)

// Lenis smooth scroll wired to GSAP ScrollTrigger. Disabled under reduced motion.
export default function SmoothScroll({ children }) {
  const prefersReduced = useReducedMotion()
  useEffect(() => {
    if (prefersReduced) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, touchMultiplier: 1.5 })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(lenis.raf)
      lenis.destroy()
    }
  }, [prefersReduced])
  return <>{children}</>
}