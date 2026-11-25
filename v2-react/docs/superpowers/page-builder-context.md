# Page Builder Context (HexaFlow v2)

Read this before building your page. It is the shared contract every page uses.

## Stack
React 18 + Vite. Tailwind 3. GSAP 3 + ScrollTrigger. react-three-fiber + drei + three 0.170.
react-router-dom 6 (`Link`, `NavLink`, `useLocation`). All assets are base-path-agnostic via `withBase`.

## Tailwind tokens (use these, do not hardcode colors)
- bg: `hex-bg` = #060e1c, panel `hex-panel`, line `hex-line` = #1e293b
- gold: `hex-gold` = #d4a017 (use `text-hex-gold`, `border-hex-gold/40`, `bg-hex-gold/10`)
- muted: `hex-muted` (slate-400ish), `hex-muted2` (darker)
- fonts: `font-display` (Space Grotesk, headings), default sans (Inter)
- text: white, slate-300, slate-400

## Shared components (import paths)
- `../components/Section.jsx` — `<Section id eyebrow title>{children}</Section>` (max-w-6xl, padded, eyebrow + title Reveal in). Use as the main section wrapper.
- `../components/Reveal.jsx` — `<Reveal as delay={0..6}>` wraps anything for scroll-reveal (CSS-driven via IntersectionObserver, no JS needed).
- `../components/KineticText.jsx` — `<KineticText text split="word|char" as className>` animates text in on scroll. Use for hero/section headings.
- `../components/StatCounter.jsx` — `<StatCounter value dp={0} suffix label note>` counts up in view. suffix stays static.
- `../components/Lightbox.jsx` — default export is `PhotoGallery`: `<PhotoGallery images={[src|{src,alt}]} columns={3}>` grid + lightbox with keyboard nav.
- `../components/scroll/CapillaryRiseDemo.jsx` — SVG hex channel, water rises with scroll. `<CapillaryRiseDemo maxRise={14.7} capacity="10.12 mL" width={0.48}/>`
- `../components/scroll/HorizontalTimeline.jsx` — `<HorizontalTimeline items={[{id,date,title,tag,body,bullets}]}/>` pinned horizontal scroll (auto vertical stack under reduced motion).
- `../components/scroll/DropRunScrubber.jsx` — `<DropRunScrubber runs={[{id,label,note,frames:[...]}]} height="70vh"/>` syncs frame index across all runs via scroll. Frames may be `null`/empty — show the styled placeholder (component handles it).
- `../components/scroll/DecisionMatrix.jsx` — `<DecisionMatrix rows={[{name,scores:{k:v},winner,verdict}]} maxScore={10}/>` score bars fill on scroll. criteria auto-derived from `Object.keys(scores)`.
- `../components/threed/AssemblyViewer.jsx` — `<AssemblyViewer explode height showToolbar showPartsList isolateDefault onSelect/>`. `explode` prop (0..1) makes it scroll-driven when passed; omit it for the internal slider. Pass `showPartsList={false}` when embedding in a tight spot.
- `../components/threed/PartViewerSlot.jsx` — `<PartViewerSlot part={part}/>` renders ModelViewer if `part.modelFile` is set, else a styled placeholder ("3D model file coming soon" + part.image + source files). Use one PER big part.
- `../components/threed/ModelViewer.jsx` — `<ModelViewer src caption autoRotate wireframe/>` generic GLB/glTF/STL.
- `../lib/withBase.js` — `import { withBase } from '../lib/withBase.js'` then `src={withBase('/images/x.jpg')}`. ALWAYS wrap root-absolute asset URLs (images, models) with `withBase`. Skip for http/data/blob.
- `../lib/useScrollProgress.js` — `const [ref, progress] = useScrollProgress({start,end,scrub})` for custom scroll-scrubbed animations (e.g. drive `explode={progress}` on AssemblyViewer).
- `../lib/useReducedMotion.js` — `const reduced = useReducedMotion()` if you add custom motion (primitives already handle it; prefer using primitives).

## Data files (import from `../data/...`)
- `journey.js` → `export const journey` (9 entries: {date, tag, title, body, image, alt})
- `substrates.js` → `export const matrix` (4, {name, scores:{microgravity,containment,growth}, total, notes}), `covers`, `octoberTest`, `grateIteration`, `microgravityTest`, `coverTradeoff`, `substratePhotos`, `coverPhotos`
- `dropTests.js` → `export const dropTests` = {facility:'NASA Glenn 2.2-Second Drop Tower', heightSeconds:2.2, location:'NASA Glenn Research Center, Ohio', drops:3, runs:[{id,label,dir,isBaseline,narrative,frameCount,frames}], stats, methodology, microgravityLadder, footnote, dataNote, video, photos}
- `bom.js` → `export const bom` (17, {part, qty, material, source, note}), plus `bomSheetUrl`, `bomSheetEmbedUrl`, `pumpSpecs`, `carrierBoardFeatures`, `designConstraints`
- `team.js` → `export const team` (5), `export const teamMeta`
- `sources.js` → `export const sources` (34, {title, url, note, category}), `export const sourcesNote`
- `parts.js` → `export const model, subsystems, parts, subsystemColor` (parts have {id, name, subsystem, role, glMatch, image, drawingFile, nativeFiles, modelFile:null})

## OLD SITE = SOURCE OF TRUTH for facts
Old Astro pages live at `C:\ClaudeKnowledge\hexaflow\src\pages\*.astro` (index, process, prototyping, geometry, aeroponics, ai-control, assembly, modular-enclosure, user-interface, secondary-substrates, substrate-covers, drop-testing, cad-drawings, bom, sources, full-project-photos).
**READ the relevant old Astro page(s) for your section and preserve EVERY fact.** No information may be lost. You may reorganize and reformat, but do not drop facts. Quote real numbers, names, dates, and rationale verbatim where the old site states them.

## CRITICAL FACT CORRECTION
The old site says the drop facility is "NASA Glenn 5.18-second zero-gravity drop tower." That is WRONG for what HexaFlow tested. HexaFlow tested at the **NASA Glenn 2.2-Second Drop Tower** in Ohio (3 drops). The 5.18 s Zero Gravity Research Facility is a separate, larger facility at NASA Glenn that HexaFlow did NOT test at. Keep these two facilities distinct everywhere. The 3-drop story: Drop 1 = best (full system); Drop 2 = hexagons cleaned out; Drop 3 = "double water" (water left in because code couldn't be changed). Local test rig = 14 ft / ~0.9 s free-fall, 9-drop Suite B baseline (14.7 mm mean rise).

## Rules
1. Every page MUST be rich with scroll animations — use the primitives above. Don't ship static walls of text. Pin, scrub, reveal, count, kinetic-text, scroll-driven 3D.
2. Respect reduced motion (the primitives already do; if you hand-roll GSAP, guard with `useReducedMotion`).
3. Do NOT create images. Reference image paths from the old site (e.g. `/images/substrate-1.jpg`) via `withBase`. The thorny devil is an illustrative reference image — OK to reference a real photo URL if one is known, otherwise describe it. If a referenced image doesn't exist yet, still reference the path (assets get ingested later).
4. Do NOT run `npm install`, `npm run build`, or any git command. Only write your page file. The controller does build + commit.
5. Your page default-exports a React component named exactly for the route (e.g. `export default function Geometry()`).
6. Wrap with `<Section>` for content blocks. Use `KineticText` for at least the page hero heading.
7. Use semantic, descriptive copy — this site is a portfolio piece for college; show engineering design process (problem → research → design → build → test → iterate).
8. Don't overuse dashes in prose. Prefer periods/commas.
9. Keep file focused; one page file. If you need a small page-local subcomponent, define it in the same file.
10. Image refs: many old-site images are at `/images/...`. Pass them to PhotoGallery as `{src: withBase('/images/x.jpg'), alt: '...'}`.