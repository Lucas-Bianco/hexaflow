# CONTENT-CHECK: nothing from the current site is lost

Sources: `hexaflow-site-v2/src/pages/Home.jsx`, `Journey.jsx`, `DropTesting.jsx` and the data they import
(`team.js`, `journey.js`, `dropTests.js`). Locations: H = `index.html`, J = `journey.html`, D = `drop-testing.html`.
"[~]" = present, wording lightly changed (reason in the last section). "[x]" = present verbatim apart from dashes.

## Home.jsx -> index.html

| Source item | Where now |
|---|---|
| Hero tag: Tri-County RVTHS, NASA HUNCH (teamMeta.school/program) | [x] H opening label "Tri-County RVTHS · NASA HUNCH · Franklin, Massachusetts" |
| H1 "Growing plants in microgravity, the way a thorny devil drinks" | [x] H opening h1 |
| "Water that climbs in free-fall." | [x] H opening tagline (highlighter sweep) |
| Hero paragraph: capillary channels from the thorny devil lizard, 9 free-fall drops, 14.7 mm, 2U nanolab | [x] H opening dek |
| CTAs "Read the mission", "See the drop tests" | [x] H opening buttons (mission = `#`) |
| "The Assembly" label + caption "Every channel is SLA-printed resin, 0.48 mm wide, holding 10.12 mL when saturated" | [~] H section 4, caption is the section headline. The interactive 3D exploded viewer (Three.js) is not rebuilt here; the exploded CAD diagram `enclosure-1.jpg` stands in, with a pointer to The Nanolab page. "Scroll to take the nanolab apart" was a hint for the 3D viewer, so it is dropped |
| About: eyebrow "About the Project", title "What is HexaFlow?" | [x] H section 1 |
| About paragraph 1 (modular capillary action nanolab, AI vision, biomimicry, five-member team, 2U, $100, root rot, interchangeable experiments, rapid data collection, 2.2-second window, NASA Glenn 2.2-Second Drop Tower, Ohio) | [x] H section 1 |
| About paragraph 2 (thorny devil, Moloch horridus, grooved skin, capillary action no pump, vision model, feedback loop, overwatering, root rot) | [x] H section 1 |
| About paragraph 3 (SLA resin, polar bonds, holds water inverted) | [x] H section 1 |
| Constraints aside: 2U nanolab 20x10x10 cm envelope; 5 V USB-A; $100; mechanical water supply no pumps-for-everything; modular for interchangeable experiments | [x] H Table 1 (five rows) |
| Stat 2.2 s "NASA Glenn drop window", "2.2-Second Drop Tower, Ohio" | [x] H section 3 (counts up) |
| Stat 14.7 mm "Mean capillary rise", "9-drop Suite B, 14-ft rig" | [x] H section 3 (counts up, hand-drawn circle) |
| Stat 0.48 mm "Channel width", "0.020 in gap" | [x] H section 3 (counts up) |
| Stat 10.12 mL "Channel capacity", "fully saturated" | [x] H section 3 (counts up) |
| Team: "The People" / "Our Team", subtitle "Tri-County RVTHS · Franklin, Massachusetts" | [x] H section 5 |
| Team photo `home-team.jpg` + alt text | [x] H opening and H section 5 |
| Five members and roles (Aidan, Nate, Sabrina, Maddie, Lucas) | [x] H section 5 roster, also H section 1/2/4/6 credits |
| Journey teaser: "The Build", "From a lizard to a nanolab", "Nine months, eight substrates, fifteen drops, and one biomimetic breakthrough. Three moments that shaped the build." | [x] H section 6 |
| Teaser card 1 "From hydroponics to a thorny devil" (Ideation, Oct 22, 2025) | [~] H section 6 (first four sentences; full text in J chapter 3) |
| Teaser card 2 "NASA liked the hex. Then pushed us." (Design, Nov 18-19, 2025) | [~] H section 6 (full journey.js sentence list up to "test at least two substrates"; rest in J chapter 4) |
| Teaser card 3 "Drop, measure, repeat, nine times" (Test, Jan-Mar 2026) | [~] H section 6 (opening two sentences; full text in J chapter 7) |
| "Read the full journey" links | [x] H section 6, each links to its journey.html chapter |
| Final CTA: "Watch water climb where gravity can't." + paragraph + "Explore the assembly" + "Read the sources" | [x] H closing band |

## Journey.jsx -> journey.html

| Source item | Where now |
|---|---|
| Hero eyebrow "Process · The Design Journey"; H1 "How a NASA HUNCH constraint became a capillary-action nanolab"; intro paragraph (five students, one 2U box, $100, lizard, full thought process...) | [x] J opening |
| Timeline section "The spine of the project" / "Nine milestones across seven months" + intro | [x] J story intro (wording "card" became "chapter") |
| Timeline entry 1 Sept 2025 Problem, body | [x] J chapter 1 |
| Entry 2 Sept-Oct 2025 Ideation, body (reviewed list, gap, D.A.A.N.s, five emailed experts) | [x] J chapter 2 (affiliations in the tipped-in list) |
| Entry 3 Oct 22, 2025 body (8 substrates, mould, pine bark, aeroponic, hydroponics obsolete, Sabrina, asknature.org, Nate SolidWorks two sizes, "miraculously well", TDC) | [x] J chapter 3 |
| Entry 4 Nov 18-19, 2025 body (terrific, camera, food coloring, 1-2 containment layers, two substrates, peer teams wicking) | [x] J chapter 4 |
| Entry 5 Dec 15, 2025 body (rockwool won, clay pebbles 11.5 mm vs 0.48 mm, pine bark, illite) | [x] J chapter 5 |
| Entry 6 Dec 2025-Feb 2026 (seven shells, wire holes 5-8 mm, walls 4-2 mm, M3 16-4 mm, rails, removable reservoir, heat-sealed pouch, VOCs, kale, fix) | [x] J chapter 6 |
| Entry 6 six prototyping bullets (Substrate Testing, TDC V1, TDC V2, Drop Test Iteration 8.63 mL, AI Integration, Custom Carrier Board) | [x] J chapter 6 tipped-in list |
| Entry 7 Jan-Mar 2026 (14 ft, 0.9 s, Suite A 9.9 mm, Suite B 14.7 mm, 48%, "9 drops" note, 4.28 to 31.79 mm, three stages, no software sim, "almost definitely user error", "stopped trusting the sim") | [x] J chapter 7 (pull quote = last sentence) |
| Entry 8 Feb 9, 2026 roots-through-rockwool | [x] J chapter 8 |
| Entry 9 Spring 2026 (CDR, dual pumps 1 and 100 mL/min, Pi Zero 2W, aeroponics + rockwool + clay pebbles, modular shelf, vision model, open items, pH probe 153 mm vs 47 mm) | [x] J chapter 9 |
| Phase 01 Problem: "Study fluids, not just grow plants", two paragraphs | [x] J chapter 1 tipped-in slip |
| Constraints cards (Volume, Power, Budget, Water, Sensors, Form) | [x] J chapter 1, Table 1 |
| Phase 02 Ideation: "Read everything, then steal from a lizard"; "We did not guess..." | [x] J chapter 2 slip |
| Phase 02 expert list (5, with affiliations) | [x] J chapter 2 slip |
| Phase 02 paragraph (Veggie, APH, PLA substrate, MIT 2020, Astrobeat, three patents, D.A.A.N.s) | [x] same facts as chapter 2 body (identical list, no second copy) |
| "Oct 22, 2025 · The pivot" callout | [x] same text as chapter 3 (the journey.js body is word-for-word the same facts) |
| Phase 03 Design: "NASA liked the hex. Then pushed us." paragraph | [x] same facts as chapter 4 |
| Dec 15 matrix paragraph ("scored four substrates... choose on purpose instead of on preference") | [x] J chapter 5 slip |
| Substrate verdicts (Rockwool, Clay pebbles, Pine bark, Illite) | [x] J chapter 5 slip, Table 2 |
| Phase 04 Build: "The vision model closes the loop" (dual pumps, Pi Zero 2W, feedback loop) | [x] J chapter 9 body |
| Carrier board paragraph (RPi, 4-camera hub, direct ADC, power breakouts) | [x] J chapter 9 slip |
| Open items at CDR (custom PCB, waterproofing, live-plant run) | [x] J chapter 9 body |
| "Caught only at assembly" (153 mm / 47 mm) | [x] J chapter 9 body and slip |
| Phase 05 Test: "Drop, measure, repeat", Jan-Mar 2026 paragraph | [x] same facts as chapter 7 |
| Suite paragraph (6 drops 9.9 mm, 9 drops 14.7 mm, 48%, 4.28-31.79 mm, three stages, sim, user error) | [x] J chapter 7 |
| Four counters (14.7 mm, 9 drops, 48%, 0.9 s with notes) | [x] J chapter 7 slip (count up) |
| Phase 06 Iterate: "Seven shells and a lesson about resin" paragraphs | [x] J chapter 6 (same facts, "Both plants shriveled before anyone connected the two" kept) |
| TDC V1 and TDC V2 cards | [x] J chapter 6 bullets (same wording as the cards) |
| "Feb 9, 2026 · Roots-through-rockwool fix" callout | [x] J chapter 8 |
| "What we learned" / "Failures we kept" + intro | [x] J closing page |
| Four learnings (Kale kept dying, Resin printer killed the plants, The pH probe was too long, No microgravity sim in software) | [x] J closing page |
| Closing paragraph ("Seven months, seven enclosure shells, fifteen drops, and one lizard. That is HexaFlow.") | [~] J closing page, first sentence reworded (see below) |
| journey.js image `substrate-1.jpg` ("Substrate samples under test") | not used: it is a gradient placeholder. Replaced by `substrate-7.jpg` (real photo of the substrate trays) |
| journey.js image `geometry-2.jpg` | [x] J stage 4, H section 6 |
| journey.js image `substrate-5.jpg` | [x] J stage 5 |
| journey.js image `aeroponics-1.jpg` | not used: HEIF, browsers cannot show it. Replaced by `project-3.jpg` and `cad-5.jpg` (printed parts) |
| journey.js image `drop-test-1.jpg` | [x] J stage 7, H section 6, D |
| Horizontal scrolling timeline component | replaced by the chapter story (same nine entries) |

## DropTesting.jsx and dropTests.js -> drop-testing.html

| Source item | Where now |
|---|---|
| location "NASA Glenn Research Center, Ohio" | [x] D hero label, facts |
| H1 "2.2 Seconds at NASA Glenn" + hero paragraph | [x] D hero |
| Chips: 3 drops, 2.2 s microgravity per drop, 14 ft local rig ~0.9 s free-fall | [x] D hero (3 and 2.2 count up) |
| Facility section "The 2.2-Second Drop Tower": two paragraphs | [x] D section 1 |
| Callout "Not the 5.18 s Zero Gravity Research Facility" (ZGRF) | [x] D section 1 |
| Facility at a glance (6 items) | [x] D section 1 facts list |
| "A ladder of approximations" + intro + four steps (01 Inversion, 02 first flow test, 03 Free-fall, 04 NASA Glenn) | [x] D section 1 (hand-drawn rail) |
| "The three drops" / "Scrubbing through the Glenn drops" + intro (three drops plus dry-run baseline) | [~] D section 2 (frames sentence changed, see below) |
| Run scrubber with frames, run labels, narratives | [x] D scrub (Drop 1 and Drop 3, 18 real frames each) |
| Runs: Dry Runs (baseline), Drop 1 (best), Drop 2 (hexagons cleaned out), Drop 3 (double water) + narratives | [x] D scrub captions and section 2.1 (frames for Drop 2 and dry runs are not in the assets folder, flagged on the page) |
| Three drop narratives (Drop 1 "Full system, best dispersal", Drop 2 "Hexagons cleaned out", Drop 3 "Double water") | [x] D section 2.1 |
| "Baseline: Dry Runs (baseline), baseline setup with no drop." | [x] D section 2.1 caption |
| Results: "What the drops measured" + paragraph | [x] D section 3 |
| Six counters (14.7, 48, 2.2, 9.9, 4.28, 31.79 with labels and notes) | [x] D section 3 (count up) |
| Capillary rise demo (scroll-driven, 14.7 mm, width 0.48, capacity 10.12 mL) with title and subtitle | [x] D section 3 Fig. 4 |
| Full results table (13 rows with notes) | [x] D section 3 Table 1 |
| "How we tested" / "The local drop rig": three methodology paragraphs | [x] D section 4 |
| Six-item facts grid (drop height 4.267 m, free-fall, water volume, channel width, baseline suites, Glenn window) | [x] D section 4 |
| Footage section: caption text | [x] D section 5 |
| Video `/video/drop-test.mp4` + poster | not included: the file does not exist in the assets folder or in the v2 repo. Open item on the page. `drop-test-3.jpg` shows the blue bead the caption describes |
| Three photos with captions (filtered dispersal, channels filling, post-drop caliper measurement) | [x] D section 5 |
| Notes: footnote, "Data note" | [x] D section 6 |
| dropTests.stats: meanRise, drops, capacity, channelWidth, dropHeight, freeFall, glennWindow, waterVolume, dropHeightMeters, expectedResult | [x] D tables and facts |
| dropTests.methodology (3 paragraphs) | [x] D section 4 |
| dropTests.microgravityLadder (4 steps) | [x] D section 1 |
| dropTests.footnote, dropTests.dataNote | [x] D section 6 |

## team.js
Names and roles: [x] H section 5. School, program, location, subtitle, photo, alt: [x] H opening and section 5.

## Wording changes (all deliberate, facts unchanged)
- Em dashes became commas, colons or periods everywhere.
- Journey "the substrate isn't just an anchor; it's part of the water-delivery path" now "the substrate anchors the plant and is part of the water-delivery path" (avoids the banned pattern).
- Drop ladder step 02 "a 1 g result, not a failure" now "a 1 g result rather than a failure".
- Closing paragraph first sentence "The process that worked was not the one we planned. It was the one where we stopped trusting..." now "The process that worked differed from the one we planned: we stopped trusting..." (same meaning).
- Drop Testing intro "Frames are ingested separately, so each card shows a styled placeholder until the high-speed footage is loaded" is replaced by what is true in this example: only Drop 1 and Drop 3 frames exist.

## Source oddities carried over, not fixed (ask Lucas)
- Home says "Nine months" and Journey says "seven months".
- Home hero says "Nine free-fall drops" while the NASA Glenn page says three drops (nine = local 14-ft rig Suite B). Both are kept, with the basis labelled.
