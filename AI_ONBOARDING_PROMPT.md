# HexaFlow — Starting Prompt (hand this to an AI or a new contributor)

> Paste this whole file into a fresh AI session (or hand it to a new teammate) to bring
> them up to speed on the HexaFlow site in one read. It's the current state of the project,
> what's been verified, and how to improve it without breaking anything.

---

## 1. What this is

**HexaFlow** is a modular capillary-action **nanolab** built by a 5-student team from
Tri-County RVTHS (Franklin, MA) for **NASA HUNCH**. It uses AI vision and thorny-devil-
inspired hex capillary channels to water plants in microgravity. This repo is the
**project website**: a static Astro 4 + Tailwind 3 site whose centerpiece is an
interactive **3D Assembly Viewer** (Three.js) and a scroll-driven "Design Journey."

- **Location:** `C:\ClaudeKnowledge\hexaflow` (its own git repo, separate from the
  Pokémon platform at `C:\ClaudeKnowledge`).
- **GitHub:** `https://github.com/Lucas-Bianco/hexaflow` — work is on branch
  `redesign/scroll-driven-ui` (draft PR #1 → `main`). Merging to `main` triggers the
  GitHub Pages deploy workflow (`.github/workflows/deploy.yml`).
- **Stack:** Astro 4 · Tailwind 3 · Three.js (CDN, lazy) · Lenis smooth scroll (CDN) ·
  Inter + Space Grotesk. No backend, no CMS, static only.

## 2. How to run it

```bash
cd C:\ClaudeKnowledge\hexaflow
npm install
npm run dev        # http://localhost:4321 (next free port if taken)
npm run build      # → dist/   (must stay green: 16 pages, 0 errors)
```

## 3. Architecture (what to touch and what not to break)

- **`src/data/parts.js`** is the **single source of truth** for the Assembly Viewer — one
  array of part objects (`id, name, subsystem, role, description, image, drawingFile,
  nativeFiles, parentAssembly, glMatch`). The 3D viewer links meshes to parts by
  matching glTF node names against `glMatch` (normalized). **Never change `id` or
  `glMatch`** — parts will stop linking to the 3D model. Editing `role`/`description`
  copy is safe.
- **`src/layouts/Layout.astro`** holds the design tokens (`:root` CSS vars: depth tiers,
  gold ramp, chapter worlds, type scale, motion easings, parallax depths), the scroll
  framework (Lenis + scroll-velocity signal + kinetic-headline splitter + scroll-aware
  nav + MorphBackground observer), and the global `@supports (animation-timeline)`
  parallax/progress CSS. Everything is gated behind `prefers-reduced-motion`.
- **`src/components/AssemblyViewer.astro`** — pinned 3D viewer + scroll-driven part
  highlighting (scroll the parts list → the 3D model highlights each part as it crosses
  center). **Mesh/click selection never calls `scrollIntoView`** (the isolate fix: clicking
  the 3D model to isolate must not yank the page). Per-part downloads are collapsed behind
  a `⬇ Files (N)` disclosure. Isolate is a toolbar toggle respected by clicks + scroll.
- **`src/lib/base.js`** — `withBase()` / `withBaseURI()` / `stripBase()`. The site deploys to a
  **subpath** (`lucas-bianco.github.io/hexaflow/`), and Astro only rewrites URLs it sees
  statically. **Any URL built at runtime — nav hrefs, `parts.js` image/CAD/model paths, the glTF
  the 3D viewer fetches — must go through `withBase()`, or it 404s in production.** Use
  `withBaseURI()` when the filename has spaces (the CAD files do). `parts.js` deliberately keeps
  bare `/images/...` literals; prefixing happens at consumption. Verify with the grep in README
  "Deploy" — it must print nothing.
- **`src/components/PhotoGallery.astro`** — reusable **slideshow scroller + click-to-
  fullscreen lightbox** (prev/next, dots, counter, caption, ESC/arrow keys). Used on
  Secondary Substrates, Substrate Covers, Full Project Photos. To add a gallery:
  `<PhotoGallery photos={[{ src, caption }]} />`.
- **`src/scripts/assembly3d.js`** — the Three.js viewer module. API: `select,
  resetView, setWireframe, setLabels, setFastenersVisible, setIsolateMode, setExplode,
  toggleFullscreen`.
- **Reusable scroll patterns** (defined globally in Layout, opt-in via classes): `reveal`/
  `data-reveal` (+ `reveal-1..6` stagger), `kinetic` + `data-kinetic="word|char"`,
  `depth-fig` (with `df-glow`/`df-img`/`df-hex` + `data-layer`), `pin`/`pin-head`/`pin-body`
  (PinnedReveal), `data-chapter` (MorphBackground color worlds), `card`, `section-label`,
  `font-display`.
- **Pages (16):** `index` (home), `assembly`, `process` (Design Journey), `geometry`,
  `aeroponics`, `ai-control`, `drop-testing`, `modular-enclosure`, `secondary-substrates`,
  `substrate-covers`, `cad-drawings`, `full-project-photos`, `bom`, `prototyping`,
  `user-interface`, `sources`.

## 4. Voice & content rules

- **Voice: "compelling showcase"** — confident, active, polished, strong headlines. But
  **every fact and number must be accurate** — do NOT invent stats, team members, or
  features. Improve phrasing, not the truth.
- **Preserve all image `src`/`alt`** (an audit confirmed every path resolves), all
  `nativeFiles`/`drawingFile` paths, and all behavior-driving classes/attrs (listed above).
- The site was **fact-checked against the team's NASA HUNCH document dump** (in
  `C:\Users\Downloads\NASA HUNCH-20260731T155526Z-1-001` — 348 files; 64 readable docs).
  Documented facts that are safe to use: 5.18 s NASA Glenn zero-g window; ~0.9 s / 14 ft
  local drop; 5 mL dyed water/drop; 9 drops; 14.7 mm mean capillary movement; 10.12 mL
  channel capacity (10.1155 mL); 0.48 mm channel width / 0.51 mm gap (0.020 in); 2U
  20×10×10 cm envelope; 5 V USB-A / 500 mA; $100 budget; ≤50 mL water; 24 V start signal;
  Pi Zero 2W, BME680, Adafruit 4026 capacitive moisture, Atlas Scientific pH, TDS, NeoPixels;
  100 mL/min drop pump + 1 mL/min long-term pump; SLA resin for the hex dome only, FDM body;
  team: Aidan Forrester, Nate Hatami, Sabrina Gaul, Madison Gouck, Lucas Bianco; advisor
  Mrs. Kristen Magas.

## 5. Open items that need a human decision (don't guess)

- ~~**Channel dimension**~~ — **RESOLVED 2026-08-01, do not re-litigate.** 0.48 mm is correct.
  The 1.524 mm figure in `HexaFlow_Pump_Offsets.xlsx` is the **bore of the 3/32" barbed pipe
  fitting** (1.524 mm = 0.060 in exactly), not a channel. Proof: the sheet computes
  66.675 mm × π × (0.762 mm)² = 121.62 mm³, matching its own `D8` — so 0.762 is just half of
  1.524 used as a radius in πr²L. Its purpose is pump lead-time (dead volume in the line →
  0.665 s, validated against 51 measured pump starts averaging 0.755 s). Channel geometry of
  record is `Capilary Tests\Hexagon capillary dimesions.docx` (0.167 in side-to-side, 0.100 in
  side length, 0.050 in depth, **0.020 in gap**) plus "the water channels are 0.48mm across"
  in `Commentary Chart For Desision Matrix Document.docx`.
  **Caveat:** no document ever writes "0.51 mm" — that is the site's own conversion of
  0.020 in. Presenting 0.48 mm width *and* 0.51 mm gap as two independently measured
  quantities is an inference, not a documented fact. They are two near-identical numbers
  from two documents describing the same fine feature.
- **Team role labels** ("Project Manager & Hardware Lead", etc.) aren't written as those
  exact titles in the docs (activities match). They're Lucas's framing; left as-is.
- ~~**GitHub Pages deploy** needs the base-path refactor~~ — **DONE (2026-07-31).** Lucas
  chose `lucas-bianco.github.io/hexaflow/`. `src/lib/base.js` now handles it, the workflow
  builds with `HF_BASE=/hexaflow`, and both the subpath and root builds verify clean (946
  URLs prefixed, 0 missed). See §3 and README "Deploy" for the rule when adding URLs.

## 6. Suggested improvements (good next steps)

- Polish the 17 part descriptions in `parts.js` (already clear/accurate; could be punchier
  in the showcase voice) — keep `glMatch`/`id` intact.
- Add the team's full names + advisor + experts-contacted (Giacomelli, Kacira, Morrow,
  Wetzel, Ekblaw) to a Team section (the Design Journey page already lists experts).
- Wire up the remaining exported `.glb` parts in `public/models/` (only the assembly is
  there now) — set `modelFile` on each part in `parts.js`.
- More real phone photos of the drop tests / plant-growth test for the galleries.
- The `cad-drawings.astro` captions for `cad-15`..`cad-26` are still placeholders — match
  them to real parts when the subjects are confirmed.

## 7. Working agreement

- Run `npm run build` after any change — it must stay green (16 pages).
- Keep changes in the scroll-driven design system; reuse the patterns in §3 before
  adding new ones.
- `prefers-reduced-motion` must disable every motion addition.
- Match the surrounding code style (scoped `<style>` per component/page, tokens over
  hardcoded values).
- Commit to a feature branch, never push directly to `main`/`master`; open a PR.