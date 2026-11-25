# HexaFlow redesign: example directions (throwaway spikes, 2026-11-24)

Lucas wants the HexaFlow site (NASA HUNCH project, Tri-County RVTHS) remade: simpler, more modern, shows the
information as clearly as possible, and must NOT look AI-generated / "vibe coded". These are EXAMPLES to choose a
direction from, not the final site.

## Content (real, do not invent facts)
Source of truth: `C:\ClaudeKnowledge\hexaflow-site-v2\src\data\*.js` (team, journey, dropTests, substrates, parts,
bom, sources) and `src\pages\*.jsx` (page copy). Read what you need. Keep facts exactly; never invent numbers,
quotes, testimonials or people. Current page map (keep the same structure): Home, Mission, Design Journey,
Biomimicry & Geometry, Substrates, Aeroponics, AI Vision & Control, The Nanolab (assembly), Drop Testing at NASA
Glenn, CAD & Drawings, Gallery, Sources & Credits.
Key facts: hexagonal capillary channels inspired by the thorny devil lizard carry water to roots in microgravity;
2U nanolab; tested at the NASA Glenn 2.2-Second Drop Tower (Ohio), 3 drops (Drop 1 best, Drop 2 hexagons cleaned
out, Drop 3 "double water"); team of five (Aidan, Nate, Sabrina, Maddie, Lucas).

## Assets (real, use them; they are the strongest thing the site has)
`../assets/` : photos (home-team, cover-1..4, drop-test-1..3, geometry-1..2, substrate-1..4, cad-1..4, enclosure-1,
aeroponics-1, ai-1, project-1..3), logos, and drop-tower video frames: `../assets/drop/f-01..f-18.jpg` (Drop 1)
and `../assets/drop2/f-01..f-18.jpg` (Drop 3). Look at the images before designing around them.

## Hard rules (Lucas's "looks vibe coded" list)
- NO: purple/neon/blue-to-purple gradients, glowing orbs, radial glow backgrounds, glassmorphism, dot grids,
  uniform big rounded corners on everything, drop shadows as decoration (a shadow only if it means elevation, max
  one), icon next to every heading, emojis, Lucide/FontAwesome, Inter, Space Grotesk, default system sans stack,
  multicolour accent stripes, competing accents (ONE accent colour), centered-hero + three identical feature cards,
  bento grids, fake terminal windows, stock/placeholder art, constant fade-ins on everything, bouncy hovers,
  scroll-jacking, pill badges above the headline, "It's not X, it's Y" copy, em dashes in copy (use commas, colons
  or periods), filler marketing phrases.
- YES: real photos and real data as the hero; strong typographic hierarchy; restraint; consistent spacing scale;
  asymmetric/editorial layouts where they help reading; captions and labels like a real document; a footer with
  sources/credits; works at 375px wide (no horizontal scroll); prefers-reduced-motion respected; semantic HTML.
- Scroll animation adds personality on SOME moments only (e.g. scrubbing the real drop-tower frames, drawing a
  hexagon channel diagram, a number that counts once), never everything fading in.

## Tech
Plain HTML, CSS, vanilla JS only. No frameworks, no build step, no icon libraries. Google Fonts allowed (pick
deliberately, not Inter/Space Grotesk). Each direction is self-contained in its own folder with:
- `index.html` : the Home page (full, real content, links to the other pages may be `#`).
- `drop-testing.html` : the Drop Testing at NASA Glenn page with the signature scroll moment (scrub the 18 real
  frames as you scroll, with run selector Drop 1 / Drop 3, captions from dropTests.js).
- `style.css`, `main.js`.
- A short `NOTES.md`: the idea in 3 sentences, fonts, colours, what the scroll moments are, and why it does not
  look AI-generated.
