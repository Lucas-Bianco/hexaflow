# HexaFlow — Assembly Viewer & Project Site

A modern, static documentation + interactive assembly site for **HexaFlow**, a modular
capillary-action nanolab that uses AI vision and biomimicry (thorny-devil-inspired hex channels)
to deliver water to plants.

The centerpiece is the **[Assembly Viewer](src/pages/assembly.astro)**: a labeled, interactive
explorer over every part of the nanolab, with a 3D view that unlocks automatically when exports
are added. Built with Astro 4 + Tailwind 3 + Three.js (CDN).

> Codename: *Hunch Project*. Product/brand name: **HexaFlow**.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
```

Build a static bundle:

```bash
npm run build    # → dist/
npx serve dist   # local preview
```

## What's in here

| Path | What |
|---|---|
| `src/pages/assembly.astro` | The interactive Assembly Viewer |
| `src/components/AssemblyViewer.astro` | 2D labeled explorer + 3D-ready viewer |
| `src/data/parts.js` | **Single source of truth** — every part, role, files, 3D model |
| `public/cad-files/` | The 37 native CAD files (SolidWorks / KiCad / PDF), web-downloadable |
| `public/models/` | Drop exported `.glb`/`.stl` here to enable 3D |
| `src/pages/*` | The existing HexaFlow documentation pages |

## Adding / editing parts

Open `src/data/parts.js`. Each part is one object. To turn on the 3D model for a part:

1. Export the part/assembly from SolidWorks as `.glb` (GLTF 2.0) or `.stl`.
2. Save it to `public/models/` (e.g. `public/models/plant-clip.glb`).
3. Set `modelFile: 'plant-clip.glb'` on that part in `parts.js`.

The 3D tab in the viewer will pick it up automatically — no code change.

## Enabling 3D for a part (export from SolidWorks)

1. Open the part/assembly in SolidWorks.
2. **File → Save As** → choose `*.glb` (glTF 2.0 Binary). (If your SolidWorks version lacks glTF,
   export `.stl` instead — the loader accepts it.)
3. Save into `public/models/`.
4. Set `modelFile` in `src/data/parts.js`.

## Deploy to GitHub Pages

A workflow is included at `.github/workflows/deploy.yml`. On push to `main`, it builds `dist/`
and publishes to GitHub Pages. It deploys with `HF_BASE=/hexaflow`, for a project page at
**`lucas-bianco.github.io/hexaflow/`**.

### Base paths

The base is configurable and the site is base-path clean — both targets build correctly:

| Target | Setting |
|---|---|
| `lucas-bianco.github.io/hexaflow/` (current) | `HF_BASE=/hexaflow` |
| Custom domain, root `<user>.github.io`, ngrok, local preview | `HF_BASE=/` (the default) |

**How it works.** Astro only rewrites URLs it can see statically. Every URL this site builds
at runtime — nav links, the `parts.js` image/CAD/model paths, the glTF the 3D viewer fetches —
is a plain string that Astro leaves alone, so under a subpath they would all 404. Those go
through `withBase()` from [`src/lib/base.js`](src/lib/base.js) at the point of use, which reads
`import.meta.env.BASE_URL`.

**If you add a URL,** route it through `withBase()` (or `withBaseURI()` if the filename has
spaces, as the CAD files do). Verify with:

```bash
HF_BASE=/hexaflow npm run build
# then confirm nothing root-absolute escaped the prefix:
grep -rhoE '(href|src)="/[^"]*"' dist --include=*.html | sed 's/.*="//;s/"$//' | grep -v '^/hexaflow/' | sort -u
```

That last command must print nothing.

> **Git Bash gotcha:** `HF_BASE=/hexaflow` gets mangled into `C:/Program Files/Git/hexaflow`
> by MSYS path translation. Use PowerShell (`$env:HF_BASE='/hexaflow'; npm run build`) or
> prefix with `MSYS_NO_PATHCONV=1`. CI runs on Ubuntu and is unaffected.

## Quick public share (ngrok)

```bash
npm run build
npx serve dist        # port 3000
ngrok http 3000
```

## CAD file notes

- 37 native files total (124 MB). `Resin Addin TDC.SLDPRT` is 75 MB — under GitHub's 100 MB
  per-file hard limit but above the 50 MB warning threshold. Revisit Git LFS if any file grows
  past 100 MB.
- SolidWorks `.SLDPRT`/`.SLDASM`/`.SLDDRW` and KiCad `.kicad_pro` are source files for download;
  browsers cannot render them, which is why the viewer uses rendered images + optional 3D exports.

## Tech stack

Astro 4 · Tailwind CSS 3 · Three.js (CDN, lazy) · Inter + Space Grotesk · GitHub Pages.