// HexaFlow sources — extracted from src/pages/sources.astro, plus a NASA Glenn
// 2.2-Second Drop Tower reference (added in v2).
//
// Entries: { title, url, note, category }
// `category` preserves the original grouping from sources.astro. `url` is null
// where the old site listed the work but had no verified link (pending full
// citation: author, year, DOI).

export const sources = [
  // ── Geometry & Biomimicry ──
  { title: 'Skin morphology study of Moloch horridus', url: null, category: 'Geometry & Biomimicry',
    note: 'ResearchGate — primary source for thorny devil capillary channel geometry' },
  { title: 'Capillary action in micro-scale channels', url: null, category: 'Geometry & Biomimicry',
    note: 'Fluid transport without gravity; polar adhesion properties of resin materials' },
  { title: 'Hexagonal geometry in biological systems', url: null, category: 'Geometry & Biomimicry',
    note: 'Honeycomb efficiency, channel optimization principles' },

  // ── Aeroponics ──
  { title: 'LettUs Grow', url: null, category: 'Aeroponics',
    note: 'Aeroponic growing systems and efficiency data (98% water savings)' },
  { title: 'Atlas Scientific', url: 'https://atlas-scientific.com', category: 'Aeroponics',
    note: 'Contact-free pH probe — selected over the Arduino Gravity glass-reed sensor, which cannot work in microgravity' },
  { title: 'Food Gardening Network', url: null, category: 'Aeroponics',
    note: 'Suitable and unsuitable crops for aeroponic growing' },
  { title: 'NASA Science', url: null, category: 'Aeroponics',
    note: 'Plant growth research in space environments' },
  { title: 'Agrotonomy', url: null, category: 'Aeroponics',
    note: 'Commercial aeroponics and root zone oxygen studies' },
  { title: 'NoSoilSolutions', url: null, category: 'Aeroponics',
    note: 'Hydroponic and aeroponic media comparisons' },
  { title: 'Greenhouse Canada', url: null, category: 'Aeroponics',
    note: 'Controlled environment agriculture and substrate research' },
  { title: 'NASA XROOTS Program Documentation', url: null, category: 'Aeroponics',
    note: 'Sierra Space eXposed Root On-Orbit Test System' },

  // ── Secondary Substrates ──
  { title: 'Plant nutrition in hydroponic systems', url: null, category: 'Secondary Substrates',
    note: 'Nutrient uptake in soil-free growing environments' },
  { title: 'Rockwool as a growing medium', url: null, category: 'Secondary Substrates',
    note: 'Water retention, sterility, and root penetrability' },
  { title: 'Clay pebbles in hydroponics', url: null, category: 'Secondary Substrates',
    note: 'Drainage, microgravity containment, and root support' },
  { title: 'Illite clay mineral properties', url: null, category: 'Secondary Substrates',
    note: 'Microgravity feasibility and system compatibility' },
  { title: 'Pine bark as a substrate', url: null, category: 'Secondary Substrates',
    note: 'Preliminary test results — only material showing growth' },
  { title: 'NASA space agriculture research (28 refs)', url: null, category: 'Secondary Substrates',
    note: 'Full citation list maintained in Google Sheets / project docs' },

  // ── Space Agriculture & Microgravity ──
  { title: 'China Lunar Farming Program', url: null, category: 'Space Agriculture & Microgravity',
    note: 'Integration of aeroponics into lunar surface agriculture' },
  { title: 'Sierra Space Astro Garden', url: null, category: 'Space Agriculture & Microgravity',
    note: 'XROOTS — aeroponic plant cultivation for long-duration spaceflight' },
  { title: 'ISS VEGGIE Experiment', url: null, category: 'Space Agriculture & Microgravity',
    note: 'NASA plant growth hardware aboard the International Space Station' },
  { title: 'Advanced Plant Habitat (APH)', url: null, category: 'Space Agriculture & Microgravity',
    note: 'Controlled environment chamber for plant research on ISS' },

  // ── Drop Testing ── (added in v2)
  { title: 'NASA Glenn 2.2 Second Drop Tower', url: 'https://www1.grc.nasa.gov/facilities/drop-tower/', category: 'Drop Testing',
    note: 'The 2.2-Second Drop Tower at NASA Glenn Research Center, Ohio — the facility where the HexaFlow drop tests were run. Distinct from the 5.18-second Zero Gravity Research Facility, a separate larger facility at NASA Glenn.' },

  // ── Electronics & Software ──
  { title: 'Raspberry Pi documentation', url: null, category: 'Electronics & Software',
    note: 'GPIO, USB, and carrier board integration references' },
  { title: 'OpenCV / computer vision', url: null, category: 'Electronics & Software',
    note: 'Plant root moisture detection via image analysis' },
  { title: 'GitHub — AidanForrester/TC-HUNCH-Nanolab', url: 'https://github.com/AidanForrester/TC-HUNCH-Nanolab', category: 'Electronics & Software',
    note: 'Project version control and UI development log' },

  // ── Patents & Prior Art ──
  { title: 'CN105638413A — Plant cultivation in microgravity', url: 'https://patents.google.com/patent/CN105638413A', category: 'Patents & Prior Art',
    note: 'Reviewed during the existing-solutions survey' },
  { title: 'US20220369580A1 — Plant growth system', url: 'https://patents.google.com/patent/US20220369580A1', category: 'Patents & Prior Art',
    note: 'Reviewed during the existing-solutions survey' },
  { title: 'CN108633718A — Cultivation apparatus', url: 'https://patents.google.com/patent/CN108633718A', category: 'Patents & Prior Art',
    note: 'Reviewed during the existing-solutions survey' },

  // ── Components ──
  { title: 'Adafruit 4026 — Capacitive soil moisture sensor', url: 'https://www.adafruit.com/product/4026', category: 'Components',
    note: 'Chosen over resistive probes, which oxidise in continuous contact with water' },

  // ── Media Credits ──
  { title: 'Thorny devil (Moloch horridus) photograph', url: 'https://commons.wikimedia.org/wiki/File:Thorny_dragon.jpg', category: 'Media Credits',
    note: 'Wikimedia Commons — used on the Geometry page' },

  // ── Site Colophon ──
  { title: 'Astro', url: 'https://astro.build', category: 'Site Colophon',
    note: 'Static site framework behind these 16 pages' },
  { title: 'Three.js', url: 'https://threejs.org', category: 'Site Colophon',
    note: 'WebGL renderer powering the interactive Assembly Viewer' },
  { title: 'Lenis', url: 'https://lenis.darkroom.engineering', category: 'Site Colophon',
    note: 'Smooth-scroll library driving the scroll-linked sections' },
  { title: 'Tailwind CSS', url: 'https://tailwindcss.com', category: 'Site Colophon',
    note: 'Utility layer used alongside the project design tokens' },
];

// Footer note from sources.astro, preserved verbatim.
export const sourcesNote = `Entries with a ↗ link to a verified primary source. The remaining entries name the work consulted but are pending full citation (author, year, DOI); they are listed here rather than omitted so the research trail stays visible. The secondary substrates work additionally draws on 28 academic sources held with the project documentation.`;