// HexaFlow Assembly Viewer — single source of truth.
// One entry per part. The 2D explorer and the 3D viewer both read from this.
//
// Adding a part = add an object. The 3D viewer links a mesh to a part by matching
// the glTF node name against `glMatch` substrings (case-sensitive `includes`).
// Node names that match no part are grouped as Fasteners (m3 screws) and hidden
// by default.

// The exported 3D assembly (SolidWorks → glTF 2.0 + .bin buffers).
export const model = {
  src: '/models/nanolab/Nanolab_Assembly.gltf',
  // The export above is SolidWorks' EXPLODED view. assembled-pose.json holds each
  // node's transform from the collapsed (assembled) re-export, in the same node
  // order, so the Explode slider blends assembled (0) → exploded (1). If it's
  // missing, the slider is hidden.
  assembledSrc: '/models/nanolab/assembled-pose.json',
  rootName: 'Nanolab Assembly',
  // Part id of the top-level assembly. Selecting it shows the whole assembly
  // (never isolates to its own stray meshes).
  rootId: 'nanolab-assembly',
  // Nodes whose name includes any of these are treated as fasteners, not parts.
  fastenerMatches: ['m3_short'],
};

export const subsystems = [
  { id: 'Enclosure',   label: 'Enclosure',    blurb: 'Outer shell, doors, and the master assemblies that hold everything else.' },
  { id: 'TDC',          label: 'TDC',          blurb: 'Thorny Devil Capillary system — the hex channels that move water by capillary action.' },
  { id: 'Camera/LED',   label: 'Camera / LED', blurb: 'Vision and lighting mounts that let the AI sense root moisture.' },
  { id: 'Water',        label: 'Water',        blurb: 'Injection and pump interface — how water enters and moves through the system.' },
  { id: 'Substrate',    label: 'Substrate',    blurb: 'Covers that hold the growing medium in place.' },
  { id: 'Electronics',  label: 'Electronics',  blurb: 'The HexaFlow PCB, the USB Type-B power port, and the soil moisture sensor.' },
];

export const parts = [
  // ── Enclosure ──────────────────────────────────────────────────────────
  {
    id: 'nanolab-assembly',
    name: 'Nanolab Assembly',
    subsystem: 'Enclosure',
    role: 'Master assembly — every other part mounts into this.',
    description: 'The full system assembled: shell, sliding shelves, electronics plates, lights, and the experiment module. This is the top-level assembly the viewer is built around.',
    image: '/images/project-1.jpg',
    drawingFile: '/cad-files/Nanolab Assembly.SLDDRW',
    nativeFiles: ['/cad-files/Nanolab Assembly.SLDASM', '/cad-files/Nanolab Assembly.SLDDRW'],
    parentAssembly: null,
    glMatch: ['Nanolab Assembly'],
  },
  {
    id: 'nanolab-shell',
    name: 'Nanolab Shell',
    subsystem: 'Enclosure',
    role: 'Outer structural shell with hollow side walls for cable management.',
    description: 'The enclosure body. Hollow side walls let cabling run protected from water while carrying the sliding shelf system for electronic plates, lights, and the experiment module.',
    image: '/images/cad-3.jpg',
    drawingFile: '/cad-files/Nanolab Shell.SLDDRW',
    nativeFiles: ['/cad-files/Nanolab Shell.SLDPRT', '/cad-files/Nanolab Shell.SLDDRW'],
    parentAssembly: 'nanolab-assembly',
    glMatch: ['Nanolab Shell'],
  },
  {
    id: 'front-door',
    name: 'Front Door Panel',
    subsystem: 'Enclosure',
    role: 'Access panel for internal components and the experiment module slot.',
    description: 'The tabbed front door, secured with M3 × 6 mm screws, for easy access to the internal components and the experiment module.',
    image: '/images/cad-19.jpg',
    drawingFile: '/cad-files/Front Door.SLDDRW',
    nativeFiles: ['/cad-files/Front Door.SLDPRT', '/cad-files/Front Door.SLDDRW'],
    parentAssembly: 'nanolab-assembly',
    glMatch: ['Front Door'],
  },
  {
    id: 'back-door',
    name: 'Back Door Panel',
    subsystem: 'Enclosure',
    role: 'Rear access panel.',
    description: 'Back access door, secured with M2.5 screws.',
    image: '/images/render-back-door.jpg',
    drawingFile: '/cad-files/Back Door.SLDDRW',
    nativeFiles: ['/cad-files/Back Door.SLDPRT', '/cad-files/Back Door.SLDDRW'],
    parentAssembly: 'nanolab-assembly',
    glMatch: ['Back Door'],
  },
  {
    id: 'side-doors',
    name: 'Side Door Panels',
    subsystem: 'Enclosure',
    role: 'Side access panels.',
    description: 'Side doors, secured with M2.5 screws, that cover the wire access in the hollow shell walls.',
    image: '/images/cad-20.jpg',
    drawingFile: '/cad-files/Side Door.SLDDRW',
    nativeFiles: ['/cad-files/Side Doors.SLDPRT', '/cad-files/Side Door.SLDDRW'],
    parentAssembly: 'nanolab-assembly',
    glMatch: ['Side Doors'],
  },

  // ── TDC (Thorny Devil Capillary) ────────────────────────────────────────
  {
    id: 'tdc-assembly-v2',
    name: 'TDC Assembly V2',
    subsystem: 'TDC',
    role: 'The core capillary experiment module — second generation.',
    description: 'The second-generation Thorny Devil Capillary module: the resin hex-dome top on a 3D-printed bottom half. Much lighter and cheaper to make than the original "brick," with room for cameras on the inside. Hexagons are spaced 0.020 in (0.51 mm) apart to form the capillary channels.',
    image: '/images/cad-7.jpg',
    drawingFile: null,
    nativeFiles: ['/cad-files/TDC Assembly V2.SLDASM'],
    parentAssembly: 'nanolab-assembly',
    glMatch: ['TDC Assembly V2'],
  },
  {
    id: 'tdc-bottom-v2',
    name: 'TDC Bottom V2',
    subsystem: 'TDC',
    role: 'Lower half of the TDC V2 — holds the water supply and pump.',
    description: 'The FDM-printed bottom half of the TDC V2. It houses the heat-sealed water reservoir pouch and the pump, which feeds the nozzle into the channels above — and leaves room for a camera to watch the pump and reservoir.',
    image: '/images/render-tdc-bottom-v2.jpg',
    drawingFile: '/cad-files/TDC V2 Bottom.SLDDRW',
    nativeFiles: ['/cad-files/TDC Bottom V2.SLDPRT', '/cad-files/TDC V2 Bottom.SLDDRW'],
    parentAssembly: 'tdc-assembly-v2',
    glMatch: ['TDC Bottom V2'],
  },
  {
    id: 'resin-addin-tdc',
    name: 'TDC V2 Top',
    subsystem: 'TDC',
    role: 'The hex-channel dome — where capillary action moves the water.',
    description: 'The top half of the TDC V2: the hemispherical dome lined with the thorny-devil hex channels, SLA-printed in clear water-washable resin. The resin is polar, so it bonds to water more strongly than water bonds to itself — driving capillary flow — and its clarity lets light pass through the dome toward the cameras inside.',
    image: '/images/cad-5.jpg',
    drawingFile: '/cad-files/TDC V2 Top.SLDDRW',
    nativeFiles: ['/cad-files/Resin Addin TDC.SLDPRT', '/cad-files/TDC V2 Top.SLDDRW'],
    parentAssembly: 'tdc-assembly-v2',
    glMatch: ['Resin Addin TDC'],
  },
  {
    id: 'substrate-grate',
    name: 'Clay Pebble Grate',
    subsystem: 'TDC',
    role: 'Grate that holds clay pebbles in place during microgravity.',
    description: 'A grate that retains clay pebble substrate during inversion/drop tests, preventing substrate migration while still allowing water and root penetration.',
    image: '/images/cad-24.jpg',
    drawingFile: '/cad-files/Clay Grate Substrate Cover.SLDDRW',
    nativeFiles: ['/cad-files/Substrate_Grate.SLDPRT', '/cad-files/Clay Grate Substrate Cover.SLDDRW'],
    parentAssembly: 'tdc-assembly-v2',
    glMatch: ['Substrate_Grate'],
  },
  {
    id: 'plant-clip-v2',
    name: 'Plant Clip V2',
    subsystem: 'TDC',
    role: 'Friction-fit holder that clamps the plant stem within the channels.',
    description: 'V2 plant clip. Inserts between hexagon gaps and friction-clamps around the stem. Tested successfully under a 1-minute inversion with kale.',
    image: '/images/cad-11.jpg',
    drawingFile: '/cad-files/Plant Clip V2.SLDDRW',
    nativeFiles: ['/cad-files/Plant Clip V2.SLDPRT', '/cad-files/Plant Clip V2.SLDDRW'],
    parentAssembly: 'tdc-assembly-v2',
    glMatch: ['Plant Clip V2'],
  },

  // ── Camera / LED ───────────────────────────────────────────────────────
  {
    id: 'camera-led-module',
    name: 'Camera + LED Module',
    subsystem: 'Camera/LED',
    role: 'Holds the camera and anti-glare lighting.',
    description: 'Holds the imaging camera and anti-glare lighting, and slides into the shell with an opening for viewing the plant — so the vision model gets a clean view of the roots.',
    image: '/images/cad-9.jpg',
    drawingFile: '/cad-files/Camera+LED Module.SLDDRW',
    nativeFiles: ['/cad-files/Camera+LED Module.SLDPRT', '/cad-files/Camera+LED Module.SLDDRW'],
    parentAssembly: 'nanolab-assembly',
    glMatch: ['Camera+LED Module'],
  },
  {
    id: 'ball-socket-camera-mount',
    name: 'Ball + Socket Camera Mount',
    subsystem: 'Camera/LED',
    role: 'Ball-and-socket clip for the USB camera that watches the pump and reservoir.',
    description: 'A ball-and-socket attachment that holds a USB camera aimed at the pump and reservoir, with a range of adjustable angles for framing the shot.',
    image: '/images/photo-ball-socket-mount.jpg',
    drawingFile: '/cad-files/Ball + Socket Camera Holder.SLDDRW',
    nativeFiles: ['/cad-files/Ball + Socket Camera Mount.SLDPRT', '/cad-files/Ball + Socket Camera Holder.SLDDRW'],
    parentAssembly: 'camera-led-module',
    glMatch: ['Ball + Socket Camera Mount'],
  },

  // ── Water ──────────────────────────────────────────────────────────────
  {
    id: 'water-injection',
    name: 'Water Injector',
    subsystem: 'Water',
    role: 'Where water enters the capillary channel network.',
    description: 'The entry point for water into the system, at the base of the TDC. The injector hole was plugged for the balcony drop tests.',
    image: '/images/photo-water-injector.jpg',
    drawingFile: '/cad-files/Water Injection Nozzle.SLDDRW',
    nativeFiles: ['/cad-files/Water Injection.SLDPRT', '/cad-files/Water Injection Nozzle.SLDDRW'],
    parentAssembly: 'nanolab-assembly',
    glMatch: ['Water Injection'],
  },
  {
    id: 'pump-adapter',
    name: 'Pump Adapter',
    subsystem: 'Water',
    role: 'Fits the drop-test pump into the long-term pump slot.',
    description: 'The enclosure was designed around the smaller long-term pump; this adapter lets the larger, faster drop-test pump clip into the same slot. Not in the exported 3D assembly.',
    image: '/images/cad-15.jpg',
    drawingFile: '/cad-files/Pump_Adapter.SLDDRW',
    nativeFiles: ['/cad-files/Pump_Adapter.SLDPRT', '/cad-files/Pump_Adapter.SLDDRW'],
    parentAssembly: 'nanolab-assembly',
    glMatch: [],
  },

  // ── Substrate ──────────────────────────────────────────────────────────
  {
    id: 'rockwool-cover',
    name: 'Rockwool Substrate Cover',
    subsystem: 'Substrate',
    role: 'Covers the rockwool tray with openings for moisture probes.',
    description: 'Custom cover for the rockwool substrate tray, with openings sized for moisture-sensor probes. Keeps substrate contained during inversion tests. Not in the exported 3D assembly.',
    image: '/images/cover-3.jpg',
    drawingFile: '/cad-files/Rockwool Substrate Cover.SLDDRW',
    nativeFiles: ['/cad-files/Rockwool Substrate Cover.SLDDRW'],
    parentAssembly: 'nanolab-assembly',
    glMatch: [],
  },
  {
    id: 'soil-moisture-sensor',
    name: 'Capacitive Soil Moisture Sensor',
    subsystem: 'Electronics',
    role: 'Tracks moisture where the camera can\'t see.',
    description: 'A capacitive moisture sensor that sits in the substrate through the cover opening. Unlike resistive two-probe sensors, it doesn\'t rust, which keeps readings reliable.',
    image: '/images/render-soil-moisture-sensor.jpg',
    drawingFile: null,
    nativeFiles: ['/cad-files/Capacitive_Soil_Moisture_Sensor.SLDPRT'],
    parentAssembly: 'rockwool-cover',
    glMatch: ['Capacitive_Soil_Moisture_Sensor'],
  },

  // ── Electronics ─────────────────────────────────────────────────────────
  {
    id: 'hexaflow-pcb',
    name: 'HexaFlow PCB',
    subsystem: 'Electronics',
    role: 'Custom control board — mounts the pump, camera, and sensor interfaces.',
    description: 'The custom HexaFlow PCB that the Raspberry Pi Zero 2W plugs into. It carries a USB hub for up to four cameras and the experiment lighting, and brings the sensors and pump onto one board. The downloads include the KiCad project, the SolidWorks model, and the schematic PDF.',
    image: '/images/ai-2.jpg',
    drawingFile: '/cad-files/C+G Module (PCB) Schematic.pdf',
    nativeFiles: [
      '/cad-files/HexaFlow_PCB.kicad_pro',
      '/cad-files/HexaFlow_PCB.SLDASM',
      '/cad-files/C+G Module (PCB) Schematic.pdf',
    ],
    parentAssembly: 'nanolab-assembly',
    glMatch: ['HexaFlow_PCB'],
  },
  {
    id: 'usb-b-camera-clip',
    name: 'USB Type-B Port',
    subsystem: 'Electronics',
    role: 'Power input to the nanolab, per the NanoRacks standard.',
    description: 'The nanolab\'s USB Type-B port, chosen to comply with the NanoRacks nanolab standard. It supplies power for standard operation — including during the drop test — and wires into the HexaFlow PCB.',
    image: '/images/render-usb-b-camera-clip.jpg',
    drawingFile: null,
    nativeFiles: [
      '/cad-files/USB-B-S-B-TH_B.sldprt',
      '/cad-files/USB-B-S-F-B-TH.sldasm',
      '/cad-files/USB-B-S-TH_P.sldprt',
      '/cad-files/USB-B-S-TH_S.sldprt',
    ],
    parentAssembly: 'nanolab-assembly',
    glMatch: ['USB-B'],
  },
];

// Subsystem color accents for callouts / tags / 3D highlights.
export const subsystemColor = {
  'Enclosure':   '#93c5fd',
  'TDC':         '#d4a017',
  'Camera/LED':  '#f0f4ff',
  'Water':       '#7dd3fc',
  'Substrate':   '#86efac',
  'Electronics': '#fda4af',
};