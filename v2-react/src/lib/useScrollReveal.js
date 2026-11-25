import { useEffect, useRef } from 'react'

// Toggles .is-in on a .reveal element when it enters the viewport.
// Returns a ref to attach to the element. Stagger via a `data-reveal` group.
export function useScrollReveal(options = {}) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px', ...options }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [options])
  return ref
}