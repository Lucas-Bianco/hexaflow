import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Returns a ref to attach to a tall section and a 0..1 progress value that scrubs
// with scroll across that section (start/end configurable). Used to drive
// scroll-explode and other scroll-scrubbed animations on pages.
export function useScrollProgress({ start = 'top top', end = 'bottom bottom', scrub = 1 } = {}) {
  const ref = useRef(null)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const st = ScrollTrigger.create({
      trigger: el,
      start,
      end,
      scrub,
      onUpdate: (self) => setProgress(self.progress)
    })
    return () => st.kill()
  }, [start, end, scrub])
  return [ref, progress]
}