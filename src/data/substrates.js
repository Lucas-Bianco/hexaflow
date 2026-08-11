// HexaFlow substrate data — extracted from the original Astro site.
// Sources: src/pages/secondary-substrates.astro, substrate-covers.astro.
//
// Decision matrix scores use the v2 schema keys {microgravity, containment, growth}.
// The original site's three criteria were "System Compatibility", "Feasibility in
// Microgravity (FIM)", and "Modularity". The mapping used here is:
//   microgravity  ← Feasibility in Microgravity (FIM)
//   containment   ← System Compatibility
//   growth       ← Modularity
// The original per-criterion scores AND labels are preserved in each entry's
// `notes` so no figure or criterion name is lost.

export const matrix = [
  {
    name: 'Rockwool',
    scores: { microgravity: 3, containment: 5, growth: 5 },
    total: 13,
    notes: `System Compatibility 5/5, Feasibility in Microgravity 3/5, Modularity 5/5. Screws directly into the nanolab's existing screw holes, and its binding agent stays put rather than escaping into the channels — allowing a larger plant opening. Water moves through it more effectively in microgravity. Supports: fruits, berries, herbs, melons, peppers. Limits: fails root vegetables and pH-sensitive plants; carries no inherent nutrients. Chosen (highest scoring substrate; ★).`,
  },
  {
    name: 'Clay Pebbles',
    scores: { microgravity: 4, containment: 4, growth: 4 },
    total: 12,
    notes: `System Compatibility 4/5, Feasibility in Microgravity 4/5, Modularity 4/5. ~11.5 mm pebbles are too large to enter the 0.48 mm channels, so containment is built into the geometry. The opening must stay under 11.5 mm, which limits stem size — but anything bigger wouldn't fit a 10×10×20 cm nanolab anyway. The baked ceramic retains 10–20% less water in microgravity (NASA source), keeping the root zone from waterlogging. Chosen.`,
  },
  {
    name: 'Illite (Clay)',
    scores: { microgravity: 5, containment: 3, growth: 4 },
    total: 12,
    notes: `System Compatibility 3/5, Feasibility in Microgravity 5/5, Modularity 4/5. The fine powder would escape through the plant-stem opening and clog the channels. Controlling it would require a separate suspended container with grates — a significant redesign of the nanolab. Rejected.`,
  },
  {
    name: 'Pine Bark',
    scores: { microgravity: 4, containment: 4, growth: 3 },
    total: 11,
    notes: `System Compatibility 4/5, Feasibility in Microgravity 4/5, Modularity 3/5. Fragments could lodge in the channels, the material is acidic, and sizing the screen to the smallest piece becomes a mass-production problem. Despite winning the October grow test, it failed the matrix on engineering grounds. Rejected.`,
  },
];

// Covers — one purpose-built cover per substrate (from substrate-covers.astro).
export const covers = [
  {
    name: 'Sensor-Port Cover',
    image: '/images/cover-1.jpg',
    role: 'Rockwool',
    description: `Custom cover with precision openings sized for moisture sensor probes. Holds rockwool cube firmly while allowing sensor insertion without disturbing roots.`,
  },
  {
    name: 'Mesh Grate Cover',
    image: '/images/cover-2.jpg',
    role: 'Clay Pebbles',
    description: `Mesh grate holds clay pebbles in place during microgravity — preventing pebble migration while allowing water and root penetration through the matrix.`,
  },
  {
    name: 'Sealed Bark Cover',
    image: '/images/cover-3.jpg',
    role: 'Pine Bark',
    description: `Cover designed to contain bark chips. Keeps larger particles from floating while allowing the moisture and root system to interact with the channel delivery.`,
  },
  {
    name: 'Compact Clay Cover',
    image: '/images/cover-4.jpg',
    role: 'Illite (Clay)',
    description: `Dense cover suited for the finer illite clay particles. Scored highest on Feasibility in Microgravity (FIM) in the decision matrix — naturally packs well.`,
  },
];

// October preliminary test — 8 substrate materials (secondary-substrates.astro).
// result ∈ 'pass' | 'partial' | 'fail'
export const octoberTest = {
  samples: [
    { name: 'Soil',              result: 'fail',    label: 'Failed / Mold' },
    { name: 'Bonsai Rock',       result: 'fail',    label: 'Failed / Mold' },
    { name: 'Spanish Moss',      result: 'fail',    label: 'Failed / Mold' },
    { name: 'Sponge',            result: 'fail',    label: 'Failed / Mold' },
    { name: 'Ramen Noodles',     result: 'fail',    label: 'Failed / Mold' },
    { name: 'Crushed Pine Bark', result: 'partial', label: 'Partial' },
    { name: 'Layered Pine Bark', result: 'pass',    label: 'Growth' },
    { name: 'Auger',             result: 'fail',    label: 'Failed / Mold' },
  ],
  conclusion: `Only pine bark produced substantial plant growth; mold developed rapidly across every substrate. Those results drove the pivot toward aeroponics and hydroponics over traditional soil substrates. The team adopted aeroponics as the primary growing method, using substrate only as a supplementary anchor where needed.`,
};

// Grate iteration chain — 5 attempts to contain the clay pebbles (substrate-covers.astro).
export const grateIteration = {
  attempts: [
    { attempt: 'Attempt 1', name: '3D-Printed Filament Grate', result: 'Too flexible — pebbles escaped through the gaps.' },
    { attempt: 'Attempt 2', name: 'Plexiglass Grate',          result: 'Same result — the pebbles still slipped past.' },
    { attempt: 'Attempt 3', name: 'Hard Cork',                 result: 'Broke when popped out of the mold.' },
    { attempt: 'Attempt 4', name: '"Less Grates, More Space" Wood Prototype', result: 'Worked — proving the concept needed fewer bars and a wider opening.' },
    { attempt: 'Final',     name: 'Horizontal Grate',          result: `Prompted by their advisor Mrs. Magas, the team redesigned the grate to run horizontal — the geometry that finally held.` },
  ],
  parallelNote: `In parallel, the team bought larger clay pebbles so the grate clearance could be wider — fewer bars, bigger pebbles, no escape.`,
};

// 1-minute inversion microgravity simulation test (shared by both substrate pages).
export const microgravityTest = {
  procedure: [
    'Plants inserted into substrate',
    'Substrate covers secured',
    'Assembly inverted for 1 minute',
    'Observations recorded',
  ],
  result: `Plants, covers, and substrates all stayed in place — a strong sign the assembly will hold up under actual microgravity conditions. ✓ Passed.`,
};

// Cover design tradeoff (substrate-covers.astro).
export const coverTradeoff = `The moisture-sensor cutout had to be repositioned every time the plant cutout changed — a constant distance tradeoff for stability, balancing sensor reach against a secure hold on the substrate.`;

// Substrate test photos (secondary-substrates.astro).
export const substratePhotos = [
  { src: '/images/substrate-1.jpg', caption: 'Substrate test — sample 1' },
  { src: '/images/substrate-2.jpg', caption: 'Substrate test — sample 2' },
  { src: '/images/substrate-3.jpg', caption: 'Substrate test — sample 3' },
  { src: '/images/substrate-4.jpg', caption: 'Substrate test — sample 4' },
  { src: '/images/substrate-5.jpg', caption: 'Substrate test — sample 5' },
  { src: '/images/substrate-6.jpg', caption: 'Substrate test — sample 6' },
  { src: '/images/substrate-7.jpg', caption: 'Substrate test — sample 7' },
  { src: '/images/substrate-8.jpg', caption: 'Substrate test — sample 8' },
];

// Cover photos (substrate-covers.astro).
export const coverPhotos = [
  { src: '/images/cover-1.jpg', caption: 'Rockwool cover (sensor port)' },
  { src: '/images/cover-2.jpg', caption: 'Clay pebble mesh grate' },
  { src: '/images/cover-3.jpg', caption: 'Pine bark cover' },
  { src: '/images/cover-4.jpg', caption: 'Illite clay cover' },
  { src: '/images/cover-5.jpg', caption: 'Inversion test — all covers' },
  { src: '/images/cover-6.jpg', caption: 'Cover detail — front view' },
  { src: '/images/cover-7.jpg', caption: 'Cover assembly' },
  { src: '/images/cover-8.jpg', caption: 'Installed covers' },
];