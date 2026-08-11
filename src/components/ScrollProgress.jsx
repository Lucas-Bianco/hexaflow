import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Fixed gold scroll-progress bar at the top of the viewport.
export default function ScrollProgress() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => gsap.set(el, { scaleX: self.progress })
    })
    return () => st.kill()
  }, [])
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed top-0 left-0 z-[60] h-[3px] w-full origin-left bg-hex-gold"
      style={{ transform: 'scaleX(0)' }}
    />
  )
}