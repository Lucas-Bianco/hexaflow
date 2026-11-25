# Direction A: Field notebook / research paper

**Idea.** The site reads like a lab notebook or a NASA technical report: numbered sections, photos as "Fig. n" with captions, margin notes, a running contents list, and measured data in real tables. The real photos and the real drop-tower frames are the only imagery; everything else is type and hairlines.

**Fonts.** Newsreader (headings and body, optical-size axis) and IBM Plex Mono (data, labels, figure numbers, tables headers), both from Google Fonts.

**Colours.** Paper `#f4efe4`, ink `#1b1a17`, muted ink `#5d584b`, rule `#cdc5b0`, one accent ochre `#85590a` (derived from the team gold, darkened for contrast on paper). Used only for links, figure numbers, data values and the water line.

**Scroll moments (only these two).**
1. Home, Fig. 2: a hexagonal channel lattice draws itself line by line as you scroll, bottom to top, while an ochre water line rises through it from a supply reservoir, with a mono readout (channels drawn %, water front %).
2. Drop Testing, Fig. 1: a sticky frame scrubs the 18 real drop-tower frames with a frame counter and timestamp, a Drop 1 / Drop 3 selector, and captions (from dropTests.js) that change at setup, in free-fall and design-target stages.
Both are static when `prefers-reduced-motion` is set (Home shows the finished drawing; the scrubber still moves only when the user scrolls).

**Why it does not look AI-generated.** It follows an existing, specific genre (the engineering report) instead of a SaaS template: no cards, no shadows, no gradients, square corners, hairline rules, a serif body, one accent, and numbered sections with real tables. Hierarchy comes from type scale and rules, and the copy is the team's own facts, not marketing lines.

**Caveats.** Frame timestamps assume the 18 frames are evenly spaced across the 2.2 s window (flagged on the page). Other nav links are `#`.
