// HexaFlow drop-test data — extracted from src/pages/drop-testing.astro.
//
// CRITICAL CORRECTION from the old site: the old site repeatedly names NASA
// Glenn's "5.18-second zero-gravity drop tower" as the facility the team was
// preparing to test at. The v2 site corrects this: the facility they actually
// tested at (and will document here) is the NASA Glenn 2.2-Second Drop Tower
// in Ohio. The 5.18-second Zero Gravity Research Facility (ZGRF) is a separate,
// larger facility at NASA Glenn — it is NOT the one HexaFlow tested at.
//
// Two distinct test platforms must stay separate:
//   1. Local rig: 14 ft / ~0.9 s free-fall, 9-drop Suite B baseline (14.7 mm mean).
//   2. NASA Glenn 2.2-Second Drop Tower, Ohio: 3 drops (+ dry-run baseline) —
//      documented in `runs` below.

export const dropTests = {
  facility: 'NASA Glenn 2.2-Second Drop Tower',
  heightSeconds: 2.2,
  location: 'NASA Glenn Research Center, Ohio',
  drops: 3,

  runs: [
    {
      id: 'dry-runs',
      label: 'Dry Runs (baseline)',
      dir: 'images/drop/dry-runs',
      isBaseline: true,
      narrative: 'Baseline setup with no drop.',
      frameCount: null,
      frames: null,
    },
    {
      id: 'first-run',
      label: 'Drop 1 (best)',
      dir: 'images/drop/first-run',
      narrative: 'First drop produced the best capillary dispersal.',
      frameCount: null,
      frames: null,
    },
    {
      id: 'second-run',
      label: 'Drop 2 (hexagons cleaned out)',
      dir: 'images/drop/second-run',
      narrative: 'The hexagons were cleaned out before this drop.',
      frameCount: null,
      frames: null,
    },
    {
      id: 'third-run-double-water',
      label: 'Drop 3 (double water)',
      dir: 'images/drop/third-run-double-water',
      narrative: 'Water was left in the system because the code could not be changed; leaving water in was the only way to get more water into the system for the final drop.',
      frameCount: null,
      frames: null,
    },
  ],

  // Measured / design figures. Local rig (14 ft / ~0.9 s) and the NASA Glenn
  // 2.2 s facility are kept distinct.
  stats: {
    meanRise: '14.7 mm',          // local 14-ft rig, Suite B (9 drops)
    drops: '9 (baseline suites)', // local rig; Glenn drops are tracked in `drops` above
    capacity: '10.12 mL',         // fully saturated channel capacity
    channelWidth: '0.48 mm',     // 0.020 in gap
    dropHeight: '14 ft',         // local rig
    freeFall: '~0.9 s',           // local rig free-fall per drop
    glennWindow: '2.2 s',         // NASA Glenn 2.2-Second Drop Tower
    waterVolume: '≈ 5 mL',        // dyed water per drop (local rig)
    dropHeightMeters: '4.267 m', // 14 ft in meters
    expectedResult: 'No free droplets — water climbs into the channels by capillary action',
  },

  methodology: `We drop the TDC module from 14 feet — about 0.9 seconds of free-fall per drop, a stand-in for NASA Glenn's 2.2-second zero-gravity drop tower, which we tested in Ohio. (The 5.18-second Zero Gravity Research Facility is a separate, larger facility at NASA Glenn.) Even in that short window we can watch how water actually moves through the channels.

Before each drop we add about 5 mL of dyed water to the TDC center and seal the injector hole. Calipers measure the dispersal pattern before and after, so every run is compared against its own baseline.

Between runs, compressed air clears the channels so each test starts clean. In weightlessness, water should climb upward into the channels by capillary action — reaching and hydrating the roots.`,

  // The "you cannot test microgravity on Earth" ladder (drop-testing.astro),
  // preserved with the 5.18 s → 2.2 s correction applied to step 4.
  microgravityLadder: [
    {
      step: '01',
      title: 'Inversion — static retention',
      body: `The module was turned upside down and shaken with substrate, covers and a planted stem in place. Nothing fell out. This tests whether the channels can hold water against gravity, and whether containment survives an arbitrary orientation. It says nothing about how water moves in free-fall.`,
    },
    {
      step: '02',
      title: 'The first flow test — where 1 g wins',
      body: `Water was run into the dome and tracked as it climbed. It travelled roughly halfway up the sides before gravity overpowered the capillary forces and it stopped. That halfway mark is a 1 g result, not a failure: it is the point the team expects to exceed once gravity is removed.`,
    },
    {
      step: '03',
      title: 'Free-fall — 14 feet, about 0.9 seconds',
      body: `Dropping the sealed module produces real, if brief, weightlessness. Two suites were run: six drops first, then nine more after the module was revised. Mean capillary movement rose from roughly 9.9 mm to 14.7 mm. Short, noisy, and genuinely free-fall — the spread across the nine ran from 4.28 mm to 31.79 mm.`,
    },
    {
      step: '04',
      title: 'NASA Glenn — 2.2 seconds',
      body: `The NASA Glenn 2.2-Second Drop Tower gives a longer free-fall window than the 14-foot drop, under instrumented conditions. Three drops were run at the NASA Glenn Research Center in Ohio (documented in the runs above). The 5.18-second Zero Gravity Research Facility is a separate, larger facility at NASA Glenn.`,
    },
  ],

  footnote: `What the team can say today: the geometry holds water when inverted, moves it measurably in free-fall, and improved by about 48% between revisions. The 2.2-second NASA Glenn drops are documented in the runs above; the 5.18-second Zero Gravity Research Facility remains a separate, larger facility.`,

  // Data note (drop-testing.astro).
  dataNote: `Per-drop before/after channel measurements were recorded for all nine runs. The full dataset and analysis are held with the CDR test documentation.`,

  // Drop-test footage + photo gallery (drop-testing.astro). Paths kept as-is.
  video: { src: '/video/drop-test.mp4', poster: '/video/drop-test-poster.jpg', caption: `Dyed water on the TDC hex lattice during outdoor drop testing. The blue bead shows the water held on the hexagonal channels rather than dispersing.` },
  photos: [
    { src: '/images/drop-test-1.jpg', caption: 'Drop test — filtered dispersal' },
    { src: '/images/drop-test-2.jpg', caption: 'Drop test — channels filling' },
    { src: '/images/drop-test-3.jpg', caption: 'Post-drop caliper measurement' },
  ],
};