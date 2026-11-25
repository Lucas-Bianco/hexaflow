import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Run a GSAP setup function inside a gsap.context scoped to a root ref,
// with automatic cleanup and refresh on route changes. Pass a setup fn.
export function useGsapContext(setup, deps = []) {
  const root = useRef(null)
  useEffect(() => {
    if (!root.current) return
    const ctx = gsap.context(() => setup(root.current), root)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return root
}