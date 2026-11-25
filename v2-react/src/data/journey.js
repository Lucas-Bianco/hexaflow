// HexaFlow design journey — extracted from the original Astro site.
// Sources: src/pages/process.astro (timeline), index.astro (build story),
// prototyping.astro (iteration summary), secondary-substrates.astro,
// drop-testing.astro.
//
// Every entry: { date, tag, title, body, image, alt }
// tag is one of: 'Problem' | 'Ideation' | 'Design' | 'Build' | 'Test' | 'Iterate'
//
// NOTE: Mentions of "5.18 s" in the old site's Testing entry referred to the
// NASA Glenn facility the team was preparing to test at. Per the v2 correction,
// that facility is the NASA Glenn 2.2-Second Drop Tower (the 5.18 s Zero Gravity
// Research Facility is a separate, larger facility at NASA Glenn). The Testing
// entry below reflects that correction.

export const journey = [
  {
    date: 'Sept 2025',
    tag: 'Problem',
    title: 'Define the box we had to build inside',
    body: `NASA HUNCH gave us the rules: a 2U nanolab (20×10×10 cm), 5 V USB-A power, a $100 budget, and a water supply that has to be entirely mechanical — no pumps-for-everything. The problem was bigger than "grow a plant in space": study how fluids and plant substrates behave in microgravity, to help feed long-distance spaceflight. Condensation couldn't touch the sensors, everything had to be modular, and it needed a web interface.`,
    image: null,
    alt: null,
  },
  {
    date: 'Sept–Oct 2025',
    tag: 'Ideation',
    title: 'Read everything that came before',
    body: `We reviewed NASA Veggie, the Advanced Plant Habitat, U-Michigan's 3D-printed PLA substrate, MIT 2020 payloads, Astrobeat, and three patents. The gap was consistent: too big, not modular, water sources that drew power, not user-friendly. We pulled literature on capillary fluidics and soil-moisture sensors, and started logging everything in individual design notebooks (our "D.A.A.N.s"). We emailed Dr. Gene Giacomelli (University of Arizona, Mars-Lunar Greenhouse), Dr. Murat Kacira (University of Arizona), Robert Morrow (NASA capillary fluidics), John Wetzel (Sierra Space), and Ariel Ekblaw (MIT Space Exploration Initiative) — not all of them wrote back, but the ones who did shaped the design.`,
    image: null,
    alt: null,
  },
  {
    date: 'Oct 22, 2025',
    tag: 'Ideation',
    title: 'From hydroponics to a thorny devil',
    body: `Eight substrates went into testing in October. Nearly all of them grew mould; only pine bark produced any growth at all. On 22 October the team abandoned growing media entirely and went aeroponic. Hydroponics looked promising until we realized it might make the project's goal obsolete. Then Sabrina found the thorny devil lizard (Moloch horridus) on asknature.org — its grooved skin moves water by capillary action, no pump needed. Nate prototyped the "Moloch Horridus Water System" in SolidWorks in two sizes. It worked "miraculously well," so we renamed the core the TDC — Thorny-Devil Capillary.`,
    image: '/images/substrate-1.jpg',
    alt: 'Substrate samples under test',
  },
  {
    date: 'Nov 18–19, 2025',
    tag: 'Design',
    title: 'NASA liked the hex. Then pushed us.',
    body: `At Preliminary Design Review, NASA's reviewer called the hexagonal shape and thorny-devil method "terrific." The feedback that reshaped the build: reposition the camera to capture fluid dynamics, not plant growth (the test is too short to grow anything); use food coloring to see the water; add 1–2 containment layers; and test at least two substrates. Peer teams warned wicking doesn't work in microgravity.`,
    image: '/images/geometry-2.jpg',
    alt: 'Capillary geometry detail',
  },
  {
    date: 'Dec 15, 2025',
    tag: 'Design',
    title: 'Choosing the substrates on purpose',
    body: `We scored four substrates on system compatibility, microgravity feasibility, and modularity. Rockwool won — it screws into existing holes, its binding agent won't escape into the channels, and water moves through it better in microgravity. Clay pebbles won as the second pick (11.5 mm pebbles can't enter the 0.48 mm channels). Pine bark was rejected — fragments would clog the channels. Illite was rejected — the fine powder would escape and force a redesign.`,
    image: '/images/substrate-5.jpg',
    alt: 'Substrate decision matrix testing',
  },
  {
    date: 'Dec 2025–Feb 2026',
    tag: 'Iterate',
    title: 'Seven shells, a removable reservoir, and a lesson about resin',
    body: `We iterated the enclosure seven times: wire holes 5 mm→8 mm, walls 4 mm→2 mm, door screws M3 16 mm→4 mm, half-slotted modules that kept falling off the rails until we added supports. The reservoir became removable to stop moisture contaminating the electronics — a heat-sealed pouch in a friction-fit pocket. Then our new resin printer's VOCs shriveled the test plants overnight: a sharp lesson that emissions and biology don't share a room. The kale kept dying — the cause turned out to be the team's own new resin printer, running unventilated in the same room; both plants shrivelled before anyone connected the two. Fix: move the plants, tent them, ventilate.

Prototyping milestones:
- Substrate Testing — tested 8 materials; pine bark showed growth; all developed mold → pivoted to aeroponics.
- TDC V1 — first hexagonal capillary plate using SLA resin. Verified capillary action and inversion water retention at 10.12 mL capacity.
- TDC V2 — combined resin construction with 3D-printed framing to reduce weight and cost. Added a camera slot for pump/reservoir monitoring.
- Drop Test Iteration — refined drop test configuration; removed TDS/pH sensors, upgraded to a high-capacity pump targeting 8.63 mL (the original site sized this for a 5.18 s window; the actual NASA Glenn facility is the 2.2-Second Drop Tower).
- AI Integration — vision model trained on root moisture data. Dual-mode AI system implemented (drop test vs. long-term).
- Custom Carrier Board — consolidated electronics: RPi, 4-camera hub, direct ADC, power breakouts — simplified wiring for reliability.`,
    image: '/images/aeroponics-1.jpg',
    alt: 'Aeroponic plant growth testing',
  },
  {
    date: 'Jan–Mar 2026',
    tag: 'Test',
    title: 'Drop, measure, repeat — nine times',
    body: `We dropped the TDC from 14 feet, with dyed water, measuring the water radius before and after each drop — about 0.9 seconds of free-fall per drop, simulating NASA Glenn's 2.2-second zero-gravity window we're traveling to Ohio to test. Two suites were run: six drops first, averaging about 9.9 mm of capillary movement; then nine more after the module was revised, averaging 14.7 mm — a 48% improvement. (The "9 drops" figure cited elsewhere refers to the revised Suite B.) Mean capillary movement reached 14.7 mm across the revised suite; the spread across the nine ran from 4.28 mm to 31.79 mm. We built up in three stages: bare module → module + camera → full nanolab with pump, sensors, and a web UI recording the whole thing. We couldn't get a microgravity simulation running in software, and keeping a plant alive in physical substrates was "almost definitely user error." We stopped trusting the sim and started dropping the real thing.`,
    image: '/images/drop-test-1.jpg',
    alt: 'Drop test in progress',
  },
  {
    date: 'Feb 9, 2026',
    tag: 'Iterate',
    title: 'Roots-through-rockwool fix',
    body: `A later learning (Feb 9): clay pebbles and rockwool must stay continuously damp to wick water — impractical in microgravity, where wetting is intermittent at best. The team's fix was to thread the roots through the bottom of the rockwool so they reach the nutrient water directly, sidestepping the wicking problem entirely. Takeaway: the substrate isn't just an anchor — it's part of the water-delivery path. Routing roots through its base lets the rockwool support the stem while the roots drink straight from the reservoir.`,
    image: null,
    alt: null,
  },
  {
    date: 'Spring 2026',
    tag: 'Build',
    title: 'The vision model closes the loop',
    body: `By Critical Design Review the system was whole: TDC capillary channels, dual pumps (1 mL/min for the long term, 100 mL/min for the drop test), a Raspberry Pi Zero 2W running an AI vision model, aeroponics plus rockwool and clay pebbles, and a modular shelf enclosure. The vision model reads root moisture and waters only when the roots are dry — a continuous feedback loop that eliminates root rot. The honest open items: a custom PCB to replace the wiring, waterproofing, and a live-plant run. A geometry problem caught only at assembly: the Atlas Scientific pH probe is 153 mm; we had 47 mm of clearance — the kind of thing that only shows up when you build it.`,
    image: null,
    alt: null,
  },
];