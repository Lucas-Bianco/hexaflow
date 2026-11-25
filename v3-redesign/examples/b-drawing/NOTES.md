# Direction B: Engineering drawing / spec sheet

**Idea.** The site is a drawing set. Each page is a numbered sheet, sections are sheets with zone references, data sits in ruled tables with units, and every page ends in a title block (project, title, sheet, rev, date, material). The team's own SolidWorks drawing (G0000) is the hero image, with leader-line callouts to real part names from `parts.js`.

**Fonts.** Archivo (headings and body, 400/600/700/800) and IBM Plex Mono (dimensions, part numbers, labels). Google Fonts.

**Colours.** Paper `#f4f3ee`, panel `#ebeae4`, ink `#121212`, grey text `#4a4a46`, soft hairline `#b9b8b0`, one accent signal orange `#d9480f`. The accent is used only for dimensions and values, callouts and leader lines, the time-ruler marker, and the current-sheet marker in the nav.

**Scroll moments (only two).**
1. Home, Sheet 02: a sticky section where six leader lines draw in one by one (SVG stroke-dashoffset) from the assembly drawing to numbered tags; the matching row in the parts list lights up. Each tag and row links to its part.
2. Drop Testing, Sheet 09-B: a sticky measurement view that scrubs the 18 real frames, with a vertical 0 to 2.2 s ruler whose marker moves with the frame, a Drop 1 / Drop 3 selector, and captions from `dropTests.js`. Frame times are nominal (18 frames spread evenly over 2.2 s), and the page says so.

Reduced motion: everything is shown drawn, frame 1 is shown, no smooth scroll.

**Why it does not look AI-generated.** It copies a real document type with real rules: square corners, hairlines, no shadows, no cards, a strict 12-column grid, one accent, mono for numbers. The content is the team's own drawings and data rather than decoration, and the layout is asymmetric because tables and drawings need it, not for effect.

**Not done.** Only Home and Drop Testing exist; other links are `#`. Callout leader targets were placed by eye on the G0000 drawing.
