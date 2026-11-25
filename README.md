# HexaFlow website (NASA HUNCH, Tri-County RVTHS)

All HexaFlow website work in one branch, `v3` (combined 2026-11-24).

| Folder | What it is | Status |
|---|---|---|
| `v1-astro/` | The first site: Astro + Tailwind + a Three.js assembly viewer. History from the `main`, `redesign/scroll-driven-ui` and `ui-v2` branches. | Archived |
| `v2-react/` | The current site: React + GSAP + react-three-fiber. History from the `v2` branch. | Live at https://lucas-bianco.github.io/hexaflow/ (deployed from the `v2` branch) |
| `v3-redesign/` | The remake in plain HTML, CSS and JavaScript: example directions and, later, the full site. | In design |

The live website still deploys from the `v2` branch. Nothing on this branch deploys until v3 is ready and
Pages is switched to it.

Rules for v3: no information from v2 may be lost; nothing that looks AI-generated (see
`v3-redesign/examples/BRIEF.md`); real photos and data first; facts only from `v2-react/src/data/`.
