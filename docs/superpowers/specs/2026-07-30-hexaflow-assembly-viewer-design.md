# HexaFlow Assembly Viewer — Design Spec

**Date:** 2026-07-30
**Owner:** Lucas
**Status:** Design approved — next: implementation plan

## Goal

Combine the existing `hexaflow-site` (Astro 4 + Tailwind 3 documentation site) with the
HexaFlow native CAD file set into **one self-contained, server-hostable project** that lets anyone
browse the full design and read what every part does. The new centerpiece is an interactive,
labeled **Assembly Viewer** — built today as a 2D labeled explorer, with a 3D viewer that
auto-activates later when GLB/STL exports are dropped in.

The combined project lives at `C:\ClaudeKnowledge\hexaflow\` as its **own git repository** deployed
to **GitHub Pages** (its own page, separate from the existing Pokémon card platform repo already in
`C:\ClaudeKnowledge`). Branding stays **HexaFlow**.

## Context (verified 2026-07-30)

- **hexaflow-site** (`C:\Users\Lucas\Claude Skills\hexaflow-site`): Astro 4 + Tailwind 3, 13 pages,
  dark theme `#060e1c` with gold `#d4a017` accents, Inter + Space Grotesk. Hosted via ngrok today;
  `npm run build` → static `dist/`. Already has a `cad-drawings.astro` page with 26 rendered CAD
  images + a 11-item component description list. `SETUP.md` documents ngrok hosting.
- **CAD files** (`C:\Users\Lucas\Downloads\HexaFlow_CAD_Files SAVED\HexaFlow_CAD_Files`): 37 files —
  `.SLDPRT` (parts), `.SLDASM` (assemblies), `.SLDDRW` (drawings), one `HexaFlow_PCB.kicad_pro`
  + `HexaFlow_PCB.SLDASM` (electronics), and one `C+G Module (PCB) Schematic.pdf`. Total **124 MB**;
  largest is `Resin Addin TDC.SLDPRT` at **75 MB** (under GitHub's 100 MB per-file hard limit, over
  the 50 MB warning threshold).
- **Browser constraint:** SolidWorks `.SLDPRT`/`.SLDASM`/`.SLDDRW` are proprietary binary formats
  browsers cannot render. A true 3D viewer therefore needs web formats (GLB/glTF/STL/OBJ) exported
  from SolidWorks. The existing 26 rendered JPGs are the immediate visual source.

## Decisions (locked)

1. **Viewer = hybrid 2D-now + 3D-ready.** Ship a labeled 2D explorer immediately from existing
   renders; include a Three.js 3D viewer that activates only when model files are added.
2. **Project location = `C:\ClaudeKnowledge\hexaflow\`**, its own git repo → its own GitHub Pages site.
3. **Branding = HexaFlow** (unchanged). "Hunch" is noted as a codename/alias only.
4. **Native CAD files live in `public/cad-files/`** so they are web-accessible and downloadable
   directly from the viewer. Regular git (no LFS) — all files <100 MB; the single 75 MB file will
   trigger a GitHub warning, documented as acceptable.

## Architecture

```
hexaflow/
├─ README.md                       # overview + deploy (GitHub Pages + ngrok)
├─ .gitignore                      # node_modules, dist, .astro, .env
├─ .github/workflows/deploy.yml    # build dist/ → publish to GH Pages on push
├─ astro.config.mjs                # site + base for GH Pages (base configurable)
├─ package.json, tailwind.config.mjs, tsconfig.json
├─ public/
│  ├─ favicon.svg
│  ├─ images/                      # existing 80+ project/cad/aero photos (moved)
│  ├─ cad-files/                   # ← 37 native CAD files (moved here, downloadable)
│  └─ models/                      # ← 3D-ready: drop .glb/.stl here later
│     └─ .gitkeep
└─ src/
   ├─ data/parts.js                # single source of truth for all parts
   ├─ layouts/Layout.astro         # existing
   ├─ components/
   │  ├─ Nav.astro, Footer.astro, PageShell.astro   # existing
   │  ├─ AssemblyViewer.astro     # orchestrates 2D + 3D modes
   │  ├─ PartDetail.astro         # right panel: name/role/desc/image/drawing/download
   │  └─ Model3D.astro            # Three.js canvas (graceful no-model state)
   └─ pages/
      ├─ index.astro, geometry.astro, … (all existing pages)
      └─ assembly.astro            # NEW: /assembly — the hybrid viewer
```

### Why this shape

- **Single source of truth (`src/data/parts.js`)** is the load-bearing decision. One array describes
  every part; both the 2D explorer and the 3D manifest read from it. Adding a part, a drawing, or a
  future 3D model is a one-line data edit, not a code change.
- **Native files in `public/cad-files/`** satisfies "move CAD files to C:\ClaudeKnowledge" *and*
  "anyone can download the real source" without a separate download server.
- **3D-ready, not 3D-blocked.** The viewer ships working today from images and degrades gracefully
  when no GLB exists — so the hosting/launch goal is not gated on Lucas exporting ~30 files from
  SolidWorks. Exporting becomes an optional, incremental upgrade.

## The Assembly Viewer (`/assembly`)

Two modes on one page, sharing one parts data source:

### Labeled Explorer (2D — works on day one)

- **Master view:** the full Nanolab Assembly render with numbered callout hotspots overlaid on it.
- **Parts panel (left):** every component grouped by subsystem — Enclosure · TDC · Camera/LED ·
  Water · Substrate · Electronics. Each entry shows index number, name, and a one-line role.
- **Detail panel (right):** selecting a part shows name, **role (what it does)**, description, its
  rendered image(s), a thumbnail of its engineering drawing, and a **Download** button linking to
  the native `.SLDPRT`/`.SLDDRW`/`.pdf` in `/cad-files/`.
- **Assembly hierarchy breadcrumb:** e.g. `Nanolab Assembly → TDC Assembly V2 → Plant Clip V2`,
  derived from `parentAssembly` fields.

### 3D Viewer (Three.js — activates when models exist)

- 3D canvas with OrbitControls, an **explode slider**, **isolate-on-click**, and a **label toggle**.
- Reads `modelFile` from each part in `parts.js`. Loads files from `/models/`.
- **No models present → graceful state:** "3D models not yet exported — viewing 2D labeled view"
  with a short "How to export from SolidWorks" card. Nothing is broken; the page is fully usable.
- When Lucas drops `plant-clip.glb` into `/models` and adds `modelFile: 'plant-clip.glb'` to that
  part, the 3D viewer picks it up automatically — no code change, no rebuild of the data layer.

## Single source of truth — `src/data/parts.js`

One array of part objects:

```js
{
  id: 'plant-clip-v2',
  name: 'Plant Clip V2',
  subsystem: 'TDC',                 // Enclosure | TDC | Camera/LED | Water | Substrate | Electronics
  role: 'Holds the plant stem in place within the capillary channels.',
  description: 'Friction-fit holder that inserts between hexagon gaps and clamps around the stem. Tested under 1-minute inversion with kale.',
  image: '/images/cad-4.jpg',       // existing render
  drawingFile: '/cad-files/Plant Clip V2.SLDDRW',
  nativeFiles: ['/cad-files/Plant Clip V2.SLDPRT', '/cad-files/Plant Clip V2.SLDDRW'],
  parentAssembly: 'tdc-assembly-v2',
  modelFile: null,                  // → 'plant-clip.glb' when exported
}
```

### Part-to-file mapping (37 native files)

Subsystems and the files that belong to each (drawings `.SLDDRW` paired with parts/assemblies):

- **Enclosure** — Nanolab Shell (.SLDPRT/.SLDDRW), Nanolab Assembly (.SLDASM/.SLDDRW), Back Door,
  Front Door, Side Doors (.SLDPRT/.SLDDRW), Rockwoll Window (.SLDPRT).
- **TDC** — TDC Bottom V2 (.SLDPRT) + TDC V2 Bottom/TDC V2 Top (.SLDDRW), TDC Assembly V2 (.SLDASM),
  Resin Addin TDC (.SLDPRT), Substrate_Grate (.SLDPRT), Clay Grate Substrate Cover (.SLDDRW),
  Plant Clip V2 (.SLDPRT/.SLDDRW).
- **Camera/LED** — Camera+LED Module (.SLDPRT/.SLDDRW), Ball + Socket Camera Mount (.SLDPRT) +
  Ball + Socket Camera Holder (.SLDDRW).
- **Water** — Water Injection (.SLDPRT) + Water Injection Nozzle (.SLDDRW), Pump_Adapter
  (.SLDPRT/.SLDDRW).
- **Substrate** — Rockwool Substrate Cover (.SLDDRW), Capacitive_Soil_Moisture_Sensor (.SLDPRT).
- **Electronics** — HexaFlow_PCB (.kicad_pro, .SLDASM), C+G Module (PCB) Schematic.pdf,
  USB-B-S-TH parts/assembly (4 files).

Exact file-name → part mapping is finalized during implementation; mismatches are resolved against
the existing `cad-drawings.astro` component list. The two unpaired images (cad-15…cad-26 placeholders
in the current site) are reconciled to real parts during the move.

## Design language

Reuse the existing hexaflow-site tokens — dark `#060e1c` / surface `#091829` / card `#0d1e35` / gold
`#d4a017`, Inter + Space Grotesk, shared `.card` and `.section-label` classes. The viewer is a new
page within the same nav, not a separate app. Modern, professional, not complicated.

## Hosting / deploy

- `npm run build` → static `dist/`.
- GitHub Actions: on push to `main`, install, build, publish `dist/` to Pages. `astro.config.mjs`
  sets `site` and a configurable `base` (`/hexaflow` when served under a project page).
- README retains the ngrok quick-share path from the existing `SETUP.md` for ad-hoc demos.

## File operations (implementation phase)

1. Create `C:\ClaudeKnowledge\hexaflow\` structure.
2. **Move** `hexaflow-site` project files (src, public, config, package.json, tailwind.config.mjs,
   tsconfig.json, SETUP.md) into it. Skip `node_modules/`, `dist/`, `.astro/` — fresh `npm install`.
3. **Move** the 37 CAD files → `public/cad-files/`.
4. Add `src/data/parts.js`, the new components, and `src/pages/assembly.astro`; update Nav to link it.
5. Init git repo, write README, add `.github/workflows/deploy.yml`, commit.
6. `npm install && npm run build` to verify it builds; smoke-check the viewer locally.

## Out of scope (YAGNI)

- No backend, no database, no CMS — static only.
- No automatic SolidWorks→GLB conversion (requires SolidWorks; out of reach of this build).
- No Git LFS (files are under the 100 MB hard limit; revisit only if a file exceeds it).
- No multi-language, no auth, no analytics.
- No replacement of the existing 13 content pages — they move over as-is.