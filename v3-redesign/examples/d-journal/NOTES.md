# d-journal: round 2 merge (C's photo-led story + A's notebook clarity)

## The idea
The site reads like the team's build log. Chapters that carry photographs are warm dark and photo-led (C); the
information-dense parts (tables, figures, captions, numbered sections) sit on a paper "notebook page" that lifts over
the photo (A). The handmade layer sits on top: a handwriting font used sparingly, ochre pen marks that draw
themselves on real photos, a highlighter sweep, and clearly marked note slots where each team member will write in
their own voice. Every section credits who led it, by role. No names are tied to faces in the group photo.

## Fonts
- Instrument Serif: headlines, big numbers (from C).
- Newsreader: body text on paper and on dark (from A).
- IBM Plex Mono: labels, captions, tables, credits ("Led by ...") (from A).
- Reenie Beanie: handwriting only: chapter dates, hand-drawn labels, note slots, scrub numerals.

## Colours (one accent)
- Paper `#f2ebdd`, ink `#211b14` for reading sections. Warm dark `#17120e`, text `#efe6d4` for photo chapters.
- Single accent, ochre: `#94560a` on paper, `#e8a52e` on dark (same hue, tuned for contrast). Water in the figures,
  pen marks, highlighter, links, "Led by" names all use it. Nothing else is coloured.
- The paper-to-dark transitions are deliberate: Home photo opening -> paper sheet overlapping it (the one shadow, it
  means elevation); paper -> "The Assembly" dark band; Journey photo opening -> dark story with paper slips tipped in;
  story -> paper closing page; Drop hero -> paper -> dark scrub -> paper.

## Animations (all disabled or shown finished under prefers-reduced-motion; no libraries, no scroll-jacking)
1. **Pen marks**: circles, arrows, underlines drawn on photos/text with SVG `stroke-dashoffset`, pen-like easing
   (slow start, quick middle, soft stop), each part timed by its length, handwritten label fades in after the stroke.
   Draw once when 30% in view. Stage photos on Journey draw when their chapter's photo wipes in. The scrub frame mark
   draws once, when the water has started to spread (frame 8).
2. **Capillary hexagon figure (Home)**: sticky, scroll-synced. Walls draw in from the bottom, then water (cell fills +
   edges) rises from the supply with a concave meniscus (higher at each wall, lower mid-channel) whose phase drifts with
   scroll; a hand-written "water front" label with leader rides the surface; three notes light up in sequence.
3. **Chapter story (Journey)**: nine chapters, sticky photo that changes with a `clip-path` wipe (up when scrolling
   down, from the top when scrolling back), a hand-drawn margin line that draws as you read with a node at each chapter
   date, dates in the handwriting font, chapter counter and date above the photo. On phones the photo pins at the top.
4. **Frame scrub (Drop Testing)**: pinned full-viewport stage; scroll scrubs 18 real frames of Drop 1 or Drop 3
   (buttons). A 0 to 2.2 s ruler with a tick every 0.1 s, a dot per frame and a playhead. Times are labelled nominal
   (frames assumed evenly spaced), in the HUD, under the ruler, and in the caption. Four caption beats from dropTests.js.
   Frame shown at most 1.5x its 640x480 size inside a dark surround.
5. **Capillary rise (Drop Testing)**: one channel with a mm scale, water climbs to the measured mean (14.7 mm) with a
   meniscus and a hand-written value that follows the surface, synced to scroll.
6. **Ladder rail (Drop Testing)**: a hand-drawn line connecting the four rungs, drawn as you read.
7. **Counters**: 2.2 s, 14.7 mm, 0.48 mm, 10.12 mL, 9 drops (and the other result numbers) count up once on entering view.
8. **Photo develop**: photos start slightly desaturated and warm, settle to full colour once (CSS filter transition).
9. **Highlighter sweep**: a marker sweep behind three Home phrases ("Water that climbs in free-fall.", "capillary action,
   no pump required", "holds water even when inverted"), plus one on Drop Testing and one on Journey.

## Process, voices, credits
- Planning/process: the substrate-tray photo with sticky notes (dated on the photo itself), the scoring-matrix
  screenshot, printed shells and parts shown beside the finished nanolab. Anything without a date in journey.js or
  the photo is captioned "Undated".
- Voices: real team text is labelled "in the team's words" and never attributed to one person. First-person slots are
  placeholders like "[Sabrina: 1 to 2 sentences, in your words, about choosing the substrates]".
- "Led by" credits are assigned from the role titles (e.g. substrates = Sabrina, Substrate Lead). They are my
  mapping, not the team's: Lucas should confirm.

## Why it does not look AI-generated
Real photos and real numbers lead; the layout is a document (numbered sections, captions, tables) rather than cards;
one warm palette with one accent; handwriting only where a person would write; no gradient decoration, glow, glass,
icons, pills or bounce; motion only where it shows the water or the drop.
