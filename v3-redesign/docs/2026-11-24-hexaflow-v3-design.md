# HexaFlow v3: design spec (DRAFT for Lucas, 2026-11-24)

Status: draft. Every idea below is a proposal until Lucas says yes. Open questions are in section 9.
Examples to look at while reading: `v3-redesign/examples/d-journal/` (Home, Design Journey, Drop Testing).

## 1. Why we are redoing it

The v2 site (React, dark navy and gold, Inter and Space Grotesk, glows, fade-ins everywhere) works, but it looks
like many AI-made sites. Lucas wants a full redesign that is simpler, shows the information as clearly as
possible, feels personal to the five people who built HexaFlow, and has animations with personality where they
help. Round 2 of the examples ("d-journal") is the agreed starting point: C's photo-led storytelling plus A's
lab-notebook clarity, with handwriting, pen marks, "Led by" credits and first-person note slots.

## 2. Goals, non-goals, anti-goals

Goals
- Every piece of information on the v2 site survives (a CONTENT-CHECK file per page proves it).
- A visitor understands the project in 30 seconds on Home, and can go deep on any subsystem.
- The site feels made by Aidan, Nate, Sabrina, Maddie and Lucas: their words, their process, their credits.
- The Nanolab page becomes the best part of the site: real renders of every part, and how they connect.
- Works on a phone at 375 px, fast on school Wi-Fi, readable with motion turned off.

Non-goals
- No accounts, comments, CMS or backend. No analytics or tracking.
- Not a general NASA HUNCH site; it is this team's project.

Anti-goals (fails even if it "works"): anything on Lucas's vibe-coded list (BRIEF.md): purple or neon gradients,
glows, glass panels, dot grids, rounded-everything, decorative shadows, an icon by every heading, emojis, Inter or
Space Grotesk, three identical cards, bento grids, fake terminals, stock art, fade-ins on everything, bouncy
hovers, scroll-jacking, em dashes and "isn't X, it's Y" copy, invented quotes or testimonials.

## 3. Constraints

- Plain HTML, CSS and JavaScript. No React, no Tailwind. One exception proposed: three.js (loaded as an ES
  module) only on The Nanolab page for the live 3D model. (Question 3.)
- Facts only from v2's `src/data/*.js` and page copy, the team, or the CAD files. Never invent.
- Hosted on GitHub Pages at `lucas-bianco.github.io/hexaflow/`: every link relative, so the same files also work
  on a custom domain later.
- `prefers-reduced-motion`: every animation shows its finished state. Keyboard and screen-reader friendly.

## 4. Look and feel (from d-journal)

- Two surfaces: warm dark `#17120e` for photo chapters and paper `#f2ebdd` for reading. One accent, ochre
  (`#94560a` on paper, `#e8a52e` on dark).
- Fonts: Instrument Serif (headlines), Newsreader (body), IBM Plex Mono (captions, data, labels), Reenie Beanie
  (handwriting: dates, pen labels, note slots; sparingly).
- Recurring pieces: Figure (photo + "Fig. n" caption + credit), Sidenote (margin on desktop, inline on phone),
  Data table, Pen mark (self-drawing circle, arrow or underline with a handwritten label), Note slot
  ("[Sabrina: in your words...]" until the person writes it), "Led by" credit line, Build-log date stamp.
- Motion rules: at most two or three moving moments per page, each one explaining something. Nothing loops.

## 5. Navigation: tabs

Lucas wants tabs kept. Proposal:
- A top tab bar on every page. The current tab is marked with a hand-drawn underline that draws in.
- 13 tabs is a lot for one row, so the tabs are grouped (Idea A, Question 1):
  Story (Home, Mission, Design Journey) | Science (Biomimicry & Geometry, Substrates, Aeroponics, AI Vision &
  Control) | Hardware (The Nanolab, CAD & Drawings, Drop Testing) | People (Meet the Team, Gallery, Sources).
  On desktop the four group names are tabs and each opens its pages as a second row of tabs. On a phone, one
  scrollable tab strip with the current tab centred, plus a "All pages" sheet.
- Alternative (Idea B): one flat row of 13 tabs that scrolls sideways on smaller screens.
- Every page ends with "Previous / Next" so the site can be read start to finish like a notebook.

## 6. Pages

Each page lists: what v2 has (all of it stays), what is new, and its moving moments.

### 6.1 Home
Keeps: hero line, "Water that climbs in free-fall", the key numbers, What is HexaFlow, team, "From a lizard to a
nanolab" teaser, 3D teaser link.
New: d-journal's opening (team photo full-bleed, paper sheet lifts over it), the hexagon water figure, a
"Start here" path of three links (the 30-second version, the science, the hardware).
Moving: hexagon channels draw and water rises; key numbers count once; highlighter on three phrases.

### 6.2 Mission
Keeps: the problem (study fluids, not just grow plants), the constraints box, the approach (capillary action,
aeroponics, AI vision).
New: the constraints drawn as an actual box to scale (20 x 10 x 10 cm, 5 V, $100) with each constraint as a pen
label that points at what it limited in the design.
Moving: the constraint box draws itself and labels appear one by one.

### 6.3 Design Journey (more interactive, better organised)
Keeps: all nine milestones and their text, phases, dates, images, the "Nine milestones across seven months"
framing (see Question 6 about seven vs nine months).
New, interactive:
- A horizontal timeline strip at the top (Sep to Aug) with every milestone as a dot. Filter chips: by phase
  (Problem, Ideation, Design, Build, Test), by subsystem (water, substrate, enclosure, electronics, vision) and by
  person (who led it). Clicking a dot jumps to that chapter.
- Each chapter is a card-free "notebook spread": left page = what happened, decision, what went wrong; right page =
  the photo with pen marks. A small "Decision" box shows the options considered and why one won (from journey
  text and the substrate matrix).
- Version history from the CAD "Previous Versions" folder: a before/after slider between dated versions of the
  same part (for example Aeroponic Module 12-5, 12-10, 12-14), rendered in Blender (section 7).
- "Failures" are marked with a red-pen strike and what was learned, because the process is the personal part.
Example (desktop):
```
 Sep   Oct    Nov    Dec    Jan    Feb    Mar   ...  Aug      [Phase v] [Subsystem v] [Person v]
  o-----o------o--*---o------o------o------o--------o
                  ^ you are here: 04 "NASA liked the hex. Then pushed us."
 +-----------------------------+  +-------------------------------+
 | Dec 2025 (handwritten)      |  |  [photo, pen circle on hex]   |
 | Led by Nate, Water Movement |  |                               |
 | What happened ...           |  |  v1 12-5  <==slider==>  12-14 |
 | Decision: hex vs square     |  |  Fig. 4  caption              |
 | [Nate: in your words ...]   |  |                               |
 +-----------------------------+  +-------------------------------+
```

### 6.4 Biomimicry & Geometry
Keeps: thorny devil, capillary physics, why hexagons, from lizard to printed part.
New, interactive:
- "Why hexagons" toy: the same area tiled with circles, squares and hexagons, showing gaps and wall length.
- Capillary rise explorer: a channel width slider (0.3 to 1.0 mm, marking the real 0.48 mm) and a gravity slider
  (1 g to 0 g) showing how high water climbs, with the formula shown and clearly labelled as the textbook model,
  not a measurement.
Moving: the lizard skin photo with pen marks tracing the channels, then morphing into the printed hex pattern.

### 6.5 Substrates
Keeps: the eight-substrate grow test, the scored matrix (four substrates, three criteria, 1 to 5), the rejects,
the five grate attempts.
New, interactive:
- The decision matrix with weight sliders: change how much "microgravity", "containment" and "growth" matter and
  watch the ranking re-sort. The team's real scores never change, only the weights; the team's own weighting is
  marked "our choice".
- Grate iterations as a stepper: attempt 1 to 5 with photo, what failed, what changed.

### 6.6 Aeroponics
Keeps: why aeroponic over hydroponic, how it mists, dual configuration, pump specifications, water-subsystem
parts.
New: an animated cutaway of the water path (reservoir, pump, nozzle, mist, roots) where each stage is a pen label;
a toggle between the two configurations.

### 6.7 AI Vision & Control
Keeps: cameras and what they watch for, every sensor and why, sense/decide/actuate loop, the carrier board.
New: the board photo (or its Blender render) with hover/tap hotspots on each connector and sensor; the control
loop as a small diagram that steps through one real cycle.

### 6.8 The Nanolab (assembly viewer, the centrepiece)
Keeps: the whole-assembly 3D model, per-part deep dive, how it goes together, modular enclosure and two
missions, all 19 parts and their data.
New, three layers (Question 2 asks what "everything dependent" means; this is Claude's reading):
1. Whole assembly, live 3D (three.js): rotate, explode slider, click a part to isolate it. Same model as v2
   (`Nanolab_Assembly.gltf`), improved lighting and materials.
2. "How it connects" view: an assembly tree / dependency map. Each part shows what it mounts to, what mounts to
   it, and which fasteners join them (M2, M3, M4 heat-set inserts). Click a part and everything that depends on
   it highlights in the 3D model and in the tree. Example:
```
 Nanolab Shell
  |-- Front Door (tabbed)          [M3 x 4]
  |-- Side Doors x2                [M3 heat-set x 16]
  |-- Back Door
  |-- Electronics Plate --> HexaFlow PCB --> USB-B connector
  |-- TDC Assembly V2 (Top + Bottom) --> Water Injection Nozzle
  |                                   --> Substrate Grate --> Plant Clips x2
  '-- Camera + Anti-Glare LED module --> Ball + Socket Camera Mount
```
3. Part studio: every part individually, from high-quality Blender renders: a hero render, a 360 degree
   turntable you drag to rotate (36 frames, no 3D engine needed, so it is smooth on phones), and where it sits in
   the assembly. Next to it a spec card: name, material (PETG, PLA, resin), quantity, size, who designed it,
   version history (links to Design Journey), downloads (native CAD and drawing).

### 6.9 CAD & Drawings
Keeps: CAD models (whole then each part), engineering drawings, native CAD downloads, software (SolidWorks,
KiCad).
New: drawings open in a zoomable viewer; the downloads list grouped by subsystem with file type and size; a
"Previous versions" section from the CAD history.

### 6.10 Drop Testing at NASA Glenn
Keeps everything (facility, the three drops, results, local drop rig) as built in d-journal.
Moving: full-screen scrub of the real frames with the nominal time ruler; capillary rise to 14.7 mm.

### 6.11 Gallery
Keeps every photo and its caption, categories (build, team at the TDC showcase, substrates, drop test).
New: filter by category, person and month; a lightbox with captions and dates; a "process" filter for sketches,
whiteboards and failed prints.

### 6.12 Meet the Team (NEW tab)
One section per person, a "mini resume" each person writes for themselves. Proposed template (Question 4):
- Photo (individual, chosen by them), first name, role on HexaFlow.
- "What I built": links into the parts and pages they led (from the "Led by" credits).
- Skills and tools they used (SolidWorks, KiCad, 3D printing, Python, sensors, writing, scheduling...).
- A few lines in their own words: why they joined, the hardest moment, what they are proudest of.
- Optional: what is next for them (college plans, interests), and a link they choose (LinkedIn, portfolio). No
  emails, last names or school schedules unless that person asks.
Example (desktop):
```
 +------------------------------+--------------------------------------------+
 | [photo]                      |  Sabrina                                   |
 |                              |  Note Taker & Substrate Lead               |
 |  "handwritten signature"     |  What I built: Substrate matrix, grates    |
 |                              |  Tools: ...                                |
 |                              |  In my words: [Sabrina writes this]        |
 |                              |  Next: [optional]                          |
 +------------------------------+--------------------------------------------+
```
Moving: each person's handwritten name signs itself when their section scrolls in.

### 6.13 Sources & Credits
Keeps: citation status explanation, sources by category, team and credits, NASA HUNCH credit.
New: a plain privacy note (no tracking, no cookies) and an accessibility note, which also closes Lucas's
"unfinished launch details" point.

## 7. Blender render pipeline (for 6.3, 6.8, 6.9)

- Input: one mesh file per part. Blender cannot open SolidWorks files (.SLDPRT), so each part needs exporting from
  SolidWorks as STEP or high-resolution STL/OBJ (Question 5). Fallback: split the existing assembly glTF by node
  in Blender (works today, lower mesh quality).
- One Blender scene for every part, so they match: same camera, studio light, soft floor, materials by real
  material and colour (Question 5), true scale.
- A Python script runs Blender headless (Blender 5.0 is installed on Lucas's PC) and renders, per part: a hero
  image (2000 px), a 36-frame turntable (1200 px each, WebP), and an in-assembly highlight shot. Re-running the
  script after a CAD change re-renders everything.
- Version renders: the same setup applied to the dated files in "Previous Versions" for the Journey sliders.
- Size budget: about 1.5 to 3 MB per part turntable, loaded only when that part is opened.

## 8. Build and data

- Data: v2's `src/data/*.js` converted once to JSON (`data/*.json`) and used by the pages.
- Shared header, tabs and footer: a tiny build script stamps them into every page, so the output is still plain
  HTML files that work without JavaScript (Question 7). Alternative: copy the header by hand into all 13 pages.
- Every page gets a CONTENT-CHECK section proving nothing from v2 was lost.
- Checks before launch: no horizontal scroll at 375 px, no console errors, every link and image works, reduced
  motion pass, Lighthouse accessibility, and a screenshot of every page as proof.
- Launch: GitHub Pages switches from the `v2` branch to `v3` only when Lucas says so.

## 9. Open questions for Lucas

1. Tabs: grouped tabs (Story, Science, Hardware, People) or one flat row of 13?
2. "View everything dependent" on The Nanolab: is it the "how it connects" tree (what mounts to what), or
   something else, like a list of everything each part needs (power, data, water)?
3. three.js on The Nanolab only, for the live 3D model, is that OK, or should the page use only Blender renders?
4. Meet the Team: is the template right? Who collects everyone's text and photos, and what are the privacy rules
   (first names only, links optional)?
5. Renders: can you export each part from SolidWorks as STEP (or STL at fine resolution)? What are the real
   colours and materials of each printed part (filament colours, resin)?
6. Facts that disagree in v2: "nine months" (Home) vs "seven months" (Journey); "nine drops" means the local rig,
   three at Glenn. Which wording do you want?
7. A tiny build script for the shared header, or hand-copied HTML?
8. The "Led by" credits in d-journal are Claude's guesses from your roles; the team should confirm each one.
9. Missing assets: Drop 2 and dry-run frames, the drop-test video, dates for undated photos, and individual
   photos for Meet the Team.

## 10. Build order (after answers)

1. Shared system: tokens, fonts, figure, sidenote, pen mark, tabs, footer, data JSON.
2. Pages that already exist as examples (Home, Journey, Drop Testing) brought up to spec.
3. Blender pipeline and The Nanolab.
4. Science pages (Geometry, Substrates, Aeroponics, AI).
5. Meet the Team, Gallery, CAD, Mission, Sources.
6. Full content check, phone pass, launch.
