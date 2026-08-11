# HexaFlow v2 — Design Spec

**Date:** 2026-08-10
**Status:** Approved (with per-part viewer sections added)
**Author:** Lucas Bianco (project lead) + Claude

## 1. Goal

Redo the HexaFlow ("Hunch") project website as a **multi-page React site where every page is a scroll-animation scene**, telling the full engineering design process end to end. The audience is teammates who need to present it and college admissions readers who need to see the engineering journey. End goal: host it (Vercel/Netlify + GitHub Pages + future custom domain).

Hard constraint from Lucas: **no information from the old site may be lost.** Information may be reorganized, but only in ways that improve the experience. Everything should have impressive, fully custom scroll animations.

## 2. Corrected fact (important)

The old site says the NASA Glenn target is the 5.18-second Zero Gravity Research Facility. The new drop test is the **NASA Glenn 2.2-Second Drop Tower** in Ohio, with **three drops**:

- **Drop 1** was the best result.
- **Drop 2**: the hexagons were cleaned out before the drop.
- **Drop 3**: water was left in the system ("double water") because the code could not be changed, so leaving water in was the only way to get more water into the system for the final drop.

The new Drop Testing page is written around this. If "2.21" turns out to mean something else, this section is the single place to update.

## 3. Tech stack

- **Vite + React 18** (fresh project, no carry-over of the old Astro code)
- **GSAP 3 + ScrollTrigger** for scroll animations (free ScrollTrigger; no paid ScrollSmoother)
- **Lenis** for smooth scroll, paired with GSAP
- **react-three-fiber + drei** for all 3D (loads GLB / glTF / STL, reusable components)
- **Tailwind CSS** keeping the brand: dark `#060e1c`, gold `#d4a017`, Inter + Space Grotesk
- **react-router** for multi-page navigation
- Full `prefers-reduced-motion` support and no-JS fallbacks on every animation

## 4. Hosting and base path

One codebase serves all targets via a build-time base path:

- Vite `base` from env `HF_BASE` (`/` for Vercel/Netlify/custom domain, `/hexaflow/` for the GitHub project page)
- react-router `basename` reads the same value
- Every asset and model URL goes through a `withBase()` helper
- GitHub Actions workflow builds for both targets; `main` (or a `v2` branch) deploys to GitHub Pages

## 5. Page structure (old 16 pages → new 12, nothing lost)

| New page | Route | Scroll animation | Absorbs old content |
|---|---|---|---|
| Home | `/` | Scroll-scrubbed 3D assembly rotate + explode; stat count-ups; team reveal | index (hero, stats, team, journey teaser) |
| The Mission | `/mission` | Pinned problem statement; constraints animate in (microgravity, no pump, no media); NASA HUNCH context | process (intro) + part of index |
| Design Journey | `/journey` | Horizontal-pinned EDP timeline: substrate pivot → thorny devil → PDR → decision matrix → prototyping → kale/resin-printer incident | process, prototyping, index journey deck |
| Biomimicry & Geometry | `/geometry` | Scroll-driven capillary-rise demo (water climbs a hex channel as you scroll); ConicSection STL viewer; thorny-devil → hex lattice morph | geometry |
| Substrates | `/substrates` | Decision matrix scores itself as you scroll; substrate cover cards | secondary-substrates, substrate-covers |
| Aeroponics | `/aeroponics` | Aeroponic Module STL viewer, scroll-sticky; how plants grow in air | aeroponics |
| AI Vision & Control | `/ai-control` | Animated feedback loop (root moisture → vision → pump); PCB glTF viewer; UI screens | ai-control, user-interface |
| The Nanolab (Assembly) | `/assembly` | Full 3D assembly viewer, scroll-driven explode, click-to-isolate, two configurations (drop-test vs long-term), BOM inline, **per-part viewer sections** | assembly, modular-enclosure, bom |
| Drop Testing at NASA Glenn | `/drop-testing` | 2.2s tower story, three drops, high-speed photo scrubber (scroll plays each run's frames), side-by-side run comparison (dry / Drop 1 / Drop 2 / double-water Drop 3), dispersal before/after | drop-testing (expanded) |
| CAD & Drawings | `/cad` | Scroll gallery of CAD images + SolidWorks drawings + BOM table | cad-drawings, bom detail |
| Project Gallery | `/gallery` | Lightbox scroll gallery of full build photos | full-project-photos |
| Sources & Credits | `/sources` | References, NASA docs, team, acknowledgements | sources |

Every old page is accounted for. Map verified against the old site's 16 pages.

## 6. 3D viewers (whole thing + individual parts)

- **Whole-assembly viewer** on `/assembly`. Uses the single-file `Nanolab_Assembly.glb` (one file, faster, CDN-friendly). Keeps the proven node-name normalization so all 19 parts stay clickable. Click a part to isolate it; Reset shows all. Toolbar: wireframe / labels / fasteners / explode slider / fullscreen. Gentle auto-rotate until first interaction.
- **Click-to-isolate** gives individual-part views inside that same viewer (no extra files needed for parts without standalone models).
- **Dedicated part viewers** where clean models already exist: `ConicSection.stl` (geometry), `Aeroponic Module.STL` (aeroponics), `HexaFlow_PCB.gltf` (AI/electronics).
- **Per-part viewer sections** (added per Lucas's request): the Assembly page includes a dedicated scroll section for each **big part**, each with its own 3D viewer slot already built. The slot loads the part's model file if present, otherwise shows a styled "model file coming" placeholder with the part's name, subsystem, specs, and the SolidWorks drawing image. Lucas will provide per-part GLB exports later; the sections are ready to receive them.
- Big parts to get sections: Nanolab Shell, TDC Bottom V2, Resin Addin TDC, Camera+LED Module, Water Injection, Substrate Grate, Side Doors, Front Door, Back Door, Plant Clip V2, Ball+Socket Camera Mount, Pump Adapter, Capacitive Soil Moisture Sensor, HexaFlow PCB, Rockwool Substrate Cover, Clay Grate Substrate Cover.

## 7. Custom scroll animation ideas (the signature of the site)

- **Scroll-scrubbed 3D**: GSAP ScrollTrigger drives the assembly's rotation and explode distance as you scroll.
- **High-speed photo scrubber** for drop tests: each of the 4 runs becomes a "video you scroll," with a shared scrubber so a reader can compare the same instant across runs.
- **Capillary-rise scroll demo**: SVG/canvas water column that climbs as you scroll, synced to real measured numbers (14.7 mm mean rise, 10.12 mL channel capacity, 0.48 mm channel width).
- **Self-scoring decision matrix** on Substrates.
- **Horizontal EDP timeline** on Design Journey (pinned; scroll advances time).
- **Pinned sticky 3D** with a scrolling text column on Aeroponics and AI Vision.
- Lenis smooth scroll + GSAP, with reduced-motion and no-JS fallbacks.

## 8. Content sources of truth

- Parts data: `src/data/parts.js` carried over from the old site (19 parts, 6 subsystems, glMatch mappings), adapted for the new viewer.
- 3D models: `Nanolab_Assembly.glb`, `ConicSection.stl`, `Aeroponic Module.STL`, `HexaFlow_PCB.gltf`, plus per-part GLB slots.
- Existing 77 photos: copied from old `public/images` into new `public/images`.
- New drop-test photos: the 4 run folders from `Downloads/Results_Photos-…/Results_Photos` (Dry Runs, First Run, Second Run, Third Run "double water"), copied into `public/images/drop/`.
- Reference imagery (not project artifacts, e.g. a thorny devil photo for biomimicry): sourced from the web with fact-checking, used only to illustrate, never presented as a project measurement.

## 9. Fact-checking rule

Anything stated as a fact about the project (measurements, NASA facility names, dates, the three-drop story, capillary numbers) must be checked against the old site's verified content or Lucas's records before publishing. Reference images (thorny devil, etc.) are illustrative only and are not project facts.

## 10. Folder and cleanup

- New site: `C:\ClaudeKnowledge\hexaflow-site-v2`
- Old web dirs (`hexaflow/` Astro, `site/` Next.js, `frontend/` Vite) are **moved into `_archive/` inside the new project, not deleted**, until Lucas confirms v2 is live. Nothing is deleted without explicit go-ahead.

## 11. GitHub

- v2 is its own git repo at `C:\ClaudeKnowledge\hexaflow-site-v2`.
- Pushed to a `v2` branch on the existing `github.com/Lucas-Bianco/hexaflow` remote (preserves old `main`). GitHub Actions deploys the built site to GitHub Pages. Nothing on the old `main` is destroyed.

## 12. Verification before handoff

Before showing Lucas, run: `npm run build` succeeds; dev server boots; headless check that the 3D canvas renders and parts are clickable on `/assembly`; smoke check that each page's scroll animations fire; reduced-motion path works.