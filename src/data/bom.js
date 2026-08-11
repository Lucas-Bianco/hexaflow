// HexaFlow Bill of Materials — extracted from src/pages/bom.astro, with
// hardware-spec context pulled from ai-control.astro and modular-enclosure.astro
// (sensor selection rationale, dual pumps, NASA HUNCH constraints, carrier board).
//
// Entries: { part, qty, material, source, note }
// `note` is included to preserve the descriptions and selection rationale from
// the old site (no fact lost). qty/material/source are null where the old site
// did not specify them.

export const bom = [
  // ── Compute ──
  { part: 'Raspberry Pi Zero 2W', qty: null, material: null, source: null,
    note: 'Runs the AI, monitoring, and UI. Chosen because it was already on hand and natively supports the Pi Camera 3.' },
  { part: '64 GB microSD', qty: null, material: null, source: null,
    note: 'Storage.' },

  // ── Imaging ──
  { part: 'InoMaker 1080p camera', qty: 1, material: null, source: null,
    note: '130° FOV main optic.' },
  { part: 'Secondary camera modules', qty: 2, material: null, source: null,
    note: 'Multi-angle coverage.' },

  // ── Sensors ──
  { part: 'BME680', qty: null, material: null, source: null,
    note: 'Temperature, humidity, VOC. Chosen over BME280 / CCS811 for simplicity.' },
  { part: 'Adafruit 4026 capacitive moisture sensor', qty: null, material: null, source: 'https://www.adafruit.com/product/4026',
    note: `Capacitive moisture probe. Chosen over resistive probes, which oxidise in continuous contact with water — the Adafruit 4026 won't oxidize over time.` },
  { part: 'Atlas Scientific pH kit', qty: null, material: null, source: null,
    note: `pH measurement. Chosen over the Arduino Gravity pH — the glass reed can't work in microgravity. (Probe is 153 mm; the nanolab had 47 mm of clearance — a geometry problem caught at assembly.)` },
  { part: 'TDS sensor', qty: null, material: null, source: null,
    note: 'Dissolved nutrient load; tracks nutrient concentration in the reservoir.' },
  { part: 'ADS1115 ADC', qty: null, material: null, source: null,
    note: 'Analog signal conditioning; more reliable connections for analog sensors.' },

  // ── Power & Switching ──
  { part: 'BS170 MOSFET', qty: null, material: null, source: null,
    note: 'Load switching.' },
  { part: 'USB-A & USB-B breakouts', qty: null, material: null, source: null,
    note: 'Power and signal breakouts.' },
  { part: 'NeoPixel strip', qty: null, material: null, source: null,
    note: 'Programmable-spectrum lighting for the grow channel.' },
  { part: '5 V USB power', qty: null, material: null, source: null,
    note: 'System powered over 5 V USB-A (500 mA cap per NASA HUNCH).' },

  // ── Drop-Test BOM ──
  { part: 'TDC V2', qty: 1, material: 'SLA resin hex dome + 3D-printed framing', source: null,
    note: 'Core capillary experiment module, second generation.' },
  { part: '50 mL reservoir pouch', qty: 1, material: 'Recycled plastic, VEX fittings, heat-sealed seams', source: null,
    note: 'Removable, friction-fit pocket; stops moisture contaminating the electronics.' },
  { part: '5000 RPM pump', qty: 1, material: null, source: null,
    note: 'High-capacity drop-test pump (~100 mL/min).' },
  { part: 'Circular substrate cover', qty: 1, material: null, source: null,
    note: 'For the drop test.' },
];

// Live BOM (Google Sheets) — the original site embeds this sheet for itemised costs.
export const bomSheetUrl = 'https://docs.google.com/spreadsheets/d/1iUetA_pYtclu0xp49hT6BQEg4P8x2cyiJwjGDd_LRHs';
export const bomSheetEmbedUrl = 'https://docs.google.com/spreadsheets/d/1iUetA_pYtclu0xp49hT6BQEg4P8x2cyiJwjGDd_LRHs/pubhtml?widget=true&headers=false';

// Dual pump configuration (ai-control.astro, modular-enclosure.astro).
// NOTE: the old site sized the 8.63 mL drop-test target for a "5.18 s" window.
// The actual NASA Glenn facility is the 2.2-Second Drop Tower (see dropTests.js).
export const pumpSpecs = {
  dropTest: {
    rate: '100 mL/min',
    rpm: '5000 RPM',
    target: '≈ 8.63 mL over the test window (original site sized this for 5.18 s; actual NASA Glenn facility is the 2.2-Second Drop Tower)',
  },
  longTerm: {
    rate: '1 mL/min',
    savings: '320 mA vs the drop-test pump',
  },
};

// Custom carrier board features (ai-control.astro).
export const carrierBoardFeatures = [
  'Raspberry Pi integration via USB Type B and a standard USB port',
  '4-camera USB hub — embedded support for up to 4 cameras at once',
  'Direct ADC embedding — more reliable connections for analog sensors',
  'Consolidated power and signal breakouts in one place for simpler wiring',
];

// NASA HUNCH design constraints (modular-enclosure.astro).
export const designConstraints = {
  envelope: '2U nanolab · 20 × 10 × 10 cm',
  power: '5 V USB-A · 500 mA',
  budget: '$100 total build',
  water: '≤ 50 mL · fully mechanical delivery',
  start: '24 V start signal',
  risk: 'Condensation isolated from sensors / electronics',
};