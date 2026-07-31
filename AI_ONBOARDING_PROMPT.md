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

- **Channel dimension:** the docs mostly say **0.48 mm** channel / **0.51 mm** gap, but a
  pump-offset spreadsheet has a 1.524 mm figure (÷2 = 0.762). The site was corrected to
  0.48 mm. Confirm the canonical value with Lucas before locking it.
- **Team role labels** ("Project Manager & Hardware Lead", etc.) aren't written as those
  exact titles in the docs (activities match). They're Lucas's framing; left as-is.
- **GitHub Pages deploy** needs the **base-path refactor** for a project page at
  `lucas-bianco.github.io/hexaflow/` — set `HF_BASE=/hexaflow` + prefix root-absolute URLs
  in `Nav.astro`, page templates, `parts.js`, and the 3D loader. The README's "Deploy"
  section documents this. For a root `<user>.github.io` repo or custom domain, it works
  as-is with `base: '/'`.

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