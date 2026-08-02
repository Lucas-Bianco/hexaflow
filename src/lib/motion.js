// Shared GSAP loader.
//
// Every component that wants ScrollTrigger must go through this. It exists
// because the correct Lenis <-> GSAP bridge has three parts and it is easy to
// ship only one of them:
//
//   1. lenis.on('scroll', ScrollTrigger.update)   — tell ST the page moved
//   2. gsap.ticker.add(t => lenis.raf(t * 1000))  — one clock, not two
//   3. gsap.ticker.lagSmoothing(0)                — don't clamp delta and desync
//
// With only (1), Lenis runs its own requestAnimationFrame loop while GSAP runs
// its ticker, so they advance on different frames and every scrub trails the
// page by one. That is the bug `scrub: 0.6` was quietly compensating for.
//
// Memoised: the import, the plugin registration and the bridge happen once no
// matter how many components call it.

let pending = null;

export function loadMotion() {
  if (pending) return pending;

  pending = (async () => {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    gsap.registerPlugin(ScrollTrigger);

    // Hand Lenis over to GSAP's clock and shut down our fallback loop.
    // Defined in Layout.astro, and absent under reduced motion or if the
    // Lenis CDN script failed — both fine, ScrollTrigger works on native scroll.
    if (typeof window.__hfBindLenisToGsap === 'function') {
      window.__hfBindLenisToGsap(gsap);
    }
    if (window.__lenis) {
      window.__lenis.on('scroll', ScrollTrigger.update);
    }

    return { gsap, ScrollTrigger };
  })();

  return pending;
}

/** True when the visitor has asked for less motion. */
export const prefersReducedMotion = () =>
  matchMedia('(prefers-reduced-motion: reduce)').matches;
