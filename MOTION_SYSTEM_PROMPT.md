# HexaFlow — Motion System Prompt

> Paste this into a fresh AI session when you want to extend the cinematic scroll
> system. It is asset-driven: it tells the model what motion primitives exist, what
> real footage is available to scrub, and the rules that keep the result 60fps,
> accessible, and legible.

---

## 1. Stack (do not change without a reason)

- **Astro 4** static output, **no framework runtime**. React/Next are unnecessary:
  every animation here is imperative GSAP, where a VDOM adds cost and no benefit.
  Astro supports React islands if genuinely stateful UI is needed later.
- **GSAP 3.15 + ScrollTrigger**, imported dynamically so the ~44 KB chunk is
  lazy and never blocks first paint.
- **Lenis** drives scrolling. **Any new ScrollTrigger MUST be bridged:**
  ```js
  if (window.__lenis) window.__lenis.on('scroll', ScrollTrigger.update);
  ```
  Without this the scrub lags a frame behind the page.
- Design tokens live in `src/layouts/Layout.astro` `:root`. Use them; do not
  hardcode colours, easings, or spacing.

## 2. Available motion primitives

Declared globally in `Layout.astro`, opt-in by class:

| primitive | effect | signal |
|---|---|---|
| `.cine` | pinned full-bleed media, scale/scrim on progress | `--cine-p` 0→1 |
| `.hs` + `.hs-rail` | vertical scroll drives a horizontal rail | `--hs-p`, `--hs-x` |
| `.scrub` + `.scrub-stage` | generic scroll-linked progress for art | `--p` 0→1 |
| `.stack` / `.stack-card` | sticky cards piling up | CSS only |
| `.vel` | skew by scroll velocity | `--scroll-vel` (±2) |
| `reveal` / `data-reveal` | staggered entrance | IntersectionObserver |
| `kinetic` + `data-kinetic` | per-word/char headline split | — |
| `depth-fig` + `data-layer` | layered parallax figure | scroll-timeline |
| `data-chapter` | MorphBackground colour worlds | IntersectionObserver |

Components: `CinematicHero.astro` (canvas image-sequence scrub),
`StackedCards.astro` (sticky stack + 3D tilt), `VideoFigure.astro`,
`PhotoGallery.astro`.

**Reuse these before inventing new ones.** One shared rAF pass in `Layout.astro`
already computes `--cine-p`, `--hs-*` and `--p`; add to `updateScrollFx()`
rather than starting a second loop.

## 3. Assets you can drive

Real project footage — **never use stock**:

| asset | shape | good for |
|---|---|---|
| `public/seq/drop/f001..f090.jpg` | 90 frames, 608×1080, 4.8 MB | scroll scrubbing. A macro pan across the TDC hex lattice with dyed water beading in the channels (drop-test t=54–63s) |
| `public/video/drop-test.mp4` | 608×1080, 90 s | ambient hero, long-form playback |
| `public/video/ai-demo.mp4` | portrait, 25 s | vision-model evidence |
| `public/video/ui-demo.mp4` | 1864×916, 118 s | dashboard walkthrough |
| `public/video/orientation-v1-v2.mp4` | 90 s | V1 vs V2 comparison |
| `public/images/` | 78 files | `substrate-*`, `drop-test-*`, `geometry-*`, `cad-*`, `project-*`, `aeroponics-*` |
| `public/images/logo-gold.png` | gold, transparent | brand mark (recoloured from the alpha of the team's black logo) |

**To cut a new sequence** (ffmpeg is installed):
```bash
ffmpeg -y -ss <START> -t <SECS> -i public/video/<clip>.mp4 \
  -vf "fps=10,scale=608:-2" -q:v 7 "public/seq/<name>/f%03d.jpg"
```
Contact-sheet first to pick the segment — do not guess:
```bash
ffmpeg -y -i <clip>.mp4 -vf "fps=1/6,scale=180:-1,tile=6x3" -frames:v 1 sheet.jpg
```

## 4. Non-negotiable rules

**Performance**
- Animate **only `transform` and `opacity`**. Never `top/left/width/height/margin`.
- Toggle `will-change` on enter, clear it on leave. Never leave it set globally —
  a permanent `will-change` on many elements is worse than none.
- Coalesce pointer/scroll work onto **one** `requestAnimationFrame`. Cache
  `getBoundingClientRect()` on enter; never call it during `pointermove`.
- Cap canvas DPR at 2. A DPR-3 phone otherwise pays for 9× the pixels.
- No unconditional infinite rAF loops. Drive from scroll events; idle cost must be zero.
- Load image sequences progressively: frame 1, then the rest with small concurrency.

**GSAP + CSS custom properties — the trap that already bit once**
> GSAP writes an **inline `transform`** on any element it tweens. If a stylesheet
> rule on that same element uses `transform: rotateX(var(--rx))`, the inline style
> wins and the variable-driven transform **silently stops working**.
>
> Put them on **separate elements**: an outer wrapper for GSAP, an inner element
> for the CSS-var transform. See `.stk-scale` vs `.stk-inner`.

**Accessibility**
- Every motion addition MUST be neutralised under `prefers-reduced-motion: reduce`,
  and the *content* must remain reachable — unpin, unstack, drop extra scroll
  length, and show scrubbed art in its **final** state, not a blank first frame.
- Progressive fallbacks must render the **true value**. A count-up that ships
  `>0<` reads "0 mm" to anyone whose JS or rAF never runs. Render the real number
  and let JS animate from zero.
- Interactive elements need real focus styles; `:focus { outline: none }` beats
  the global `:focus-visible` on specificity.

**Contrast**
- Text over moving media needs a **two-layer scrim** (linear + radial). The
  drop-test footage is shot on snow; a flat overlay fails on bright frames.
- Body copy must hit **WCAG AA 4.5:1**. `#64748b` on `--hex-card` is 3.52:1 — do
  not use it for body text.

**Base path**
- Every runtime URL goes through `withBase()`. Anything with spaces or `+`
  (all CAD filenames) goes through `withBaseURI()`.
- Verify with `HF_BASE=/hexaflow npm run build`, then confirm no unprefixed URLs:
  ```bash
  grep -rhoE '(href|src)="/[^"]*"' dist --include=*.html | grep -v '^\(href\|src\)="/hexaflow'
  ```

**Content**
- Never invent a number, a citation URL, or a test result. Facts are verified
  against the team's NASA HUNCH documents; see `AI_ONBOARDING_PROMPT.md` §4.
- Label measured values as measured and targets as targets.

## 5. Definition of done

1. `HF_BASE=/hexaflow npm run build` green at **16 pages**.
2. Zero unprefixed URLs in `dist/`.
3. Reduced-motion neutralisers present in compiled CSS for every new primitive
   (remember Astro appends `[data-astro-cid-…]` to scoped selectors).
4. Animated properties are transform/opacity only.
5. Verified in a real browser. **The Claude browser pane cannot scroll or run
   `requestAnimationFrame`** — it reports `rafTicks: 0`, `scrollY: 0`. Scroll
   effects cannot be visually confirmed there; prove the maths numerically and
   say plainly that visual confirmation is outstanding.
