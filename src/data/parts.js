// HexaFlow Assembly — single source of truth for parts + the 3D viewer.
//
// One entry per part. The assembly viewer links a mesh to a part by matching the
// glTF node name against `glMatch` substrings (via norm() — see threed/norm.js —
// because three.js GLTFLoader rewrites node names: space→_, strips "." and "/").
// Node names that match no part are grouped as Fasteners (m3 screws) and hidden
// by default.
//
// `modelFile` is the per-part standalone 3D file slot. null = no standalone model
// yet; the PartViewerSlot shows a styled placeholder with the part's image.
// Lucas will drop per-part .glb files into public/models/parts/ and set the path
// here (e.g. '/models/parts/Shell.glb') to light up that part's own viewer.

export const model = {
  src: '/models/Nanolab_Assembly.glb',
  rootName: 'Nanolab Assembly',
  rootId: 'nanolab-assembly',
  fastenerMatches: ['m3_short']
}

export const subsystems = [
  { id: 'Enclosure', label: 'Enclosure', blurb: 'Outer shell, doors, and the master assemblies that hold everything else.' },
  { id: 'TDC', label: 'TDC', blurb: 'Thorny Devil Capillary system — the hex channels that move water by capillary action.' },
  { id: 'Camera/LED', label: 'Camera / LED', blurb: 'Vision and lighting mounts that let the AI sense root moisture.' },
  { id: 'Water', label: 'Water', blurb: 'Injection and pump interface — how water enters and moves through the system.' },
  { id: 'Substrate', label: 'Substrate', blurb: 'Covers and sensors that hold and monitor the growing medium.' },
  { id: 'Electronics', label: 'Electronics', blurb: 'PCB, schematic, and USB camera clip for the reservoir.' }
]

export const parts = [
  // ── Enclosure ──────────────────────────────────────────────────────────
  {
    id: 'nanolab-assembly',
    name: 'Nanolab Assembly',
    subsystem: 'Enclosure',
    role: 'Master assembly — every other part mounts into this.',
    description:
      'The full system assembled: shell, sliding shelves, electronics plates, lights, and the experiment module. This is the top-level assembly the viewer is built around.',
    image: '/images/cad-7.jpg',
    drawingFile: '/cad-files/Nanolab Assembly.SLDDRW',
    nativeFiles: ['/cad-files/Nanolab Assembly.SLDASM', '/cad-files/Nanolab Assembly.SLDDRW'],
    parentAssembly: null,
    glMatch: ['Nanolab Assembly'],
    modelFile: null
  },
  {
    id: 'nanolab-shell',
    name: 'Nanolab Shell',
    subsystem: 'Enclosure',
    role: 'Outer structural shell with hollow side walls for cable management.',
    description:
      'The enclosure body. Hollow side walls let cabling run protected from water while carrying the sliding shelf system for electronic plates, lights, and the experiment module.',
    image: '/images/cad-1.jpg',
    drawingFile: '/cad-files/Nanolab Shell.SLDDRW',
    nativeFiles: ['/cad-files/Nanolab Shell.SLDPRT', '/cad-files/Nanolab Shell.SLDDRW'],
    parentAssembly: 'nanolab-assembly',
    glMatch: ['Nanolab Shell'],
    modelFile: null
  },
  {
    id: 'front-door',
    name: 'Front Door Panel',
    subsystem: 'Enclosure',
    role: 'Access panel for internal components and the experiment module slot.',
    description:
      'Front access door allowing rapid swap of experiment modules without full disassembly.',
    image: '/images/cad-10.jpg',
    drawingFile: '/cad-files/Front Door.SLDDRW',
    nativeFiles: ['/cad-files/Front Door.SLDPRT', '/cad-files/Front Door.SLDDRW'],
    parentAssembly: 'nanolab-assembly',
    glMatch: ['Front Door'],
    modelFile: null
  },
  {
    id: 'back-door',
    name: 'Back Door Panel',
    subsystem: 'Enclosure',
    role: 'Rear access panel.',
    description: 'Back access door for rear-facing components and routing.',
    image: null,
    drawingFile: '/cad-files/Back Door.SLDDRW',
    nativeFiles: ['/cad-files/Back Door.SLDPRT', '/cad-files/Back Door.SLDDRW'],
    parentAssembly: 'nanolab-assembly',
    glMatch: ['Back Door'],
    modelFile: null
  },
  {
    id: 'side-doors',
    name: 'Side Door Panels',
    subsystem: 'Enclosure',
    role: 'Side access panels.',
    description:
      'Side doors for access to the cable-management cavities in the hollow walls.',
    image: '/images/cad-11.jpg',
    drawingFile: '/cad-files/Side Door.SLDDRW',
    nativeFiles: ['/cad-files/Side Doors.SLDPRT', '/cad-files/Side Door.SLDDRW'],
    parentAssembly: 'nanolab-assembly',
    glMatch: ['Side Doors'],
    modelFile: null
  },
  {
    id: 'rockwool-window',
    name: 'Rockwool Window',
    subsystem: 'Enclosure',
    role: 'Viewing window for the rockwool substrate region.',
    description:
      'A window panel that allows visual inspection of the rockwool substrate without opening the enclosure. Not present in the exported 3D assembly.',
    image: null,
    drawingFile: null,
    nativeFiles: ['/cad-files/Rockwoll Window.SLDPRT'],
    parentAssembly: 'nanolab-assembly',
    glMatch: [],
    modelFile: null
  },

  // ── TDC (Thorny Devil Capillary) ────────────────────────────────────────
  {
    id: 'tdc-assembly-v2',
    name: 'TDC Assembly V2',
    subsystem: 'TDC',
    role: 'The core capillary experiment module — second generation.',
    description:
      'The improved Thorny Devil Capillary assembly. Combines a resin hex dome (SLA-printed for polar capillary adhesion) with 3D-printed framing to cut weight and cost, and allows camera placement to monitor the pump and reservoir. Hex channels are 0.48 mm across, spaced 0.51 mm apart (0.020 in) for optimal capillary distribution.',
    image: '/images/cad-3.jpg',
    drawingFile: null,
    nativeFiles: ['/cad-files/TDC Assembly V2.SLDASM'],
    parentAssembly: 'nanolab-assembly',
    glMatch: ['TDC Assembly V2'],
    modelFile: null
  },
  {
    id: 'tdc-bottom-v2',
    name: 'TDC Bottom V2',
    subsystem: 'TDC',
    role: 'Base of the TDC V2 capillary module.',
    description:
      'The bottom piece of the TDC V2 assembly — forms the lower half of the hex-channel capillary network and connects to the water injector.',
    image: '/images/cad-2.jpg',
    drawingFile: '/cad-files/TDC V2 Bottom.SLDDRW',
    nativeFiles: ['/cad-files/TDC Bottom V2.SLDPRT', '/cad-files/TDC V2 Bottom.SLDDRW', '/cad-files/TDC V2 Top.SLDDRW'],
    parentAssembly: 'tdc-assembly-v2',
    glMatch: ['TDC Bottom V2'],
    modelFile: null
  },
  {
    id: 'resin-addin-tdc',
    name: 'Resin Addin TDC',
    subsystem: 'TDC',
    role: 'Resin insert that exploits polar adhesion for stronger capillary transport.',
    description:
      "A resin addin for the TDC. Resin's polar properties create stronger adhesion bonds with water than water molecules share with each other, enabling efficient capillary transport — the system can even retain water when inverted.",
    image: null,
    drawingFile: null,
    nativeFiles: ['/cad-files/Resin Addin TDC.SLDPRT'],
    parentAssembly: 'tdc-assembly-v2',
    glMatch: ['Resin Addin TDC'],
    modelFile: null
  },
  {
    id: 'substrate-grate',
    name: 'Clay Pebble Grate',
    subsystem: 'TDC',
    role: 'Mesh grate that holds clay pebbles in place during microgravity.',
    description:
      'A grate that retains clay pebble substrate during inversion/drop tests, preventing substrate migration while still allowing water and root penetration.',
    image: '/images/cad-12.jpg',
    drawingFile: '/cad-files/Clay Grate Substrate Cover.SLDDRW',
    nativeFiles: ['/cad-files/Substrate_Grate.SLDPRT', '/cad-files/Clay Grate Substrate Cover.SLDDRW'],
    parentAssembly: 'tdc-assembly-v2',
    glMatch: ['Substrate_Grate'],
    modelFile: null
  },
  {
    id: 'plant-clip-v2',
    name: 'Plant Clip V2',
    subsystem: 'TDC',
    role: 'Friction-fit holder that clamps the plant stem within the channels.',
    description:
      'V2 plant clip. Inserts between hexagon gaps and friction-clamps around the stem. Tested successfully under a 1-minute inversion with kale.',
    image: '/images/cad-4.jpg',
    drawingFile: '/cad-files/Plant Clip V2.SLDDRW',
    nativeFiles: ['/cad-files/Plant Clip V2.SLDPRT', '/cad-files/Plant Clip V2.SLDDRW'],
    parentAssembly: 'tdc-assembly-v2',
    glMatch: ['Plant Clip V2'],
    modelFile: null
  },

  // ── Camera / LED ───────────────────────────────────────────────────────
  {
    id: 'camera-led-module',
    name: 'Camera + LED Module',
    subsystem: 'Camera/LED',
    role: 'Mounts the camera and LED lighting above the root zone.',
    description:
      'Holds the root-zone camera and LED lighting. Includes an anti-glare strip to prevent lens flare during imaging so the vision model gets a clean read on root moisture.',
    image: '/images/cad-8.jpg',
    drawingFile: '/cad-files/Camera+LED Module.SLDDRW',
    nativeFiles: ['/cad-files/Camera+LED Module.SLDPRT', '/cad-files/Camera+LED Module.SLDDRW'],
    parentAssembly: 'nanolab-assembly',
    glMatch: ['Camera+LED Module'],
    modelFile: null
  },
  {
    id: 'ball-socket-camera-mount',
    name: 'Ball + Socket Camera Mount',
    subsystem: 'Camera/LED',
    role: 'Adjustable ball-and-socket mount for the camera.',
    description:
      'A ball-and-socket mount giving the camera a range of adjustable angles for framing the root zone. Pair with the Ball + Socket Camera Holder.',
    image: null,
    drawingFile: '/cad-files/Ball + Socket Camera Holder.SLDDRW',
    nativeFiles: ['/cad-files/Ball + Socket Camera Mount.SLDPRT', '/cad-files/Ball + Socket Camera Holder.SLDDRW'],
    parentAssembly: 'camera-led-module',
    glMatch: ['Ball + Socket Camera Mount'],
    modelFile: null
  },

  // ── Water ──────────────────────────────────────────────────────────────
  {
    id: 'water-injection',
    name: 'Water Injector',
    subsystem: 'Water',
    role: 'Precise water entry into the capillary channel network.',
    description:
      'Located at the system base for hemisphere entry. Allows precise water introduction into the channel network. The injector hole can be sealed during drop tests.',
    image: '/images/cad-9.jpg',
    drawingFile: '/cad-files/Water Injection Nozzle.SLDDRW',
    nativeFiles: ['/cad-files/Water Injection.SLDPRT', '/cad-files/Water Injection Nozzle.SLDDRW'],
    parentAssembly: 'nanolab-assembly',
    glMatch: ['Water Injection'],
    modelFile: null
  },
  {
    id: 'pump-adapter',
    name: 'Pump Adapter',
    subsystem: 'Water',
    role: 'Interface for both the drop-test and long-term pumps.',
    description:
      'An adapter compatible with both the drop-test high-capacity pump and the long-term precision pump — letting one enclosure support both configurations. Not in the exported 3D assembly.',
    image: '/images/cad-5.jpg',
    drawingFile: '/cad-files/Pump_Adapter.SLDDRW',
    nativeFiles: ['/cad-files/Pump_Adapter.SLDPRT', '/cad-files/Pump_Adapter.SLDDRW'],
    parentAssembly: 'nanolab-assembly',
    glMatch: [],
    modelFile: null
  },

  // ── Substrate ──────────────────────────────────────────────────────────
  {
    id: 'rockwool-cover',
    name: 'Rockwool Substrate Cover',
    subsystem: 'Substrate',
    role: 'Covers the rockwool tray with openings for moisture probes.',
    description:
      'Custom cover for the rockwool substrate tray, with openings sized for moisture-sensor probes. Keeps substrate contained during inversion tests. Not in the exported 3D assembly.',
    image: '/images/cad-6.jpg',
    drawingFile: '/cad-files/Rockwool Substrate Cover.SLDDRW',
    nativeFiles: ['/cad-files/Rockwool Substrate Cover.SLDDRW'],
    parentAssembly: 'nanolab-assembly',
    glMatch: [],
    modelFile: null
  },
  {
    id: 'soil-moisture-sensor',
    name: 'Capacitive Soil Moisture Sensor',
    subsystem: 'Substrate',
    role: 'Measures substrate moisture as a fallback/cross-check to the vision model.',
    description:
      'A capacitive soil-moisture sensor probe that sits in the substrate through the cover opening and reports moisture directly.',
    image: null,
    drawingFile: null,
    nativeFiles: ['/cad-files/Capacitive_Soil_Moisture_Sensor.SLDPRT'],
    parentAssembly: 'rockwool-cover',
    glMatch: ['Capacitive_Soil_Moisture_Sensor'],
    modelFile: null
  },

  // ── Electronics ────────────────────────────────────────────────────────
  {
    id: 'hexaflow-pcb',
    name: 'HexaFlow PCB',
    subsystem: 'Electronics',
    role: 'Custom control board — mounts the pump, camera, and sensor interfaces.',
    description:
      'The HexaFlow printed circuit board. KiCad project plus the SolidWorks assembly model and the C+G module schematic PDF that documents the circuit. In 3D this includes the board, pin headers, USB-A port, and TO-92 sensor.',
    image: null,
    drawingFile: '/cad-files/C+G Module (PCB) Schematic.pdf',
    nativeFiles: ['/cad-files/HexaFlow_PCB.kicad_pro', '/cad-files/HexaFlow_PCB.SLDASM', '/cad-files/C+G Module (PCB) Schematic.pdf'],
    parentAssembly: 'nanolab-assembly',
    glMatch: ['HexaFlow_PCB'],
    modelFile: null
  },
  {
    id: 'usb-b-camera-clip',
    name: 'USB-B Camera Clip (Reservoir)',
    subsystem: 'Electronics',
    role: 'Mounts a USB camera to observe the pump and reservoir.',
    description:
      'A clip (and its USB-B connector parts) that mounts a secondary USB camera to observe the pump and reservoir, separate from the primary root-zone camera.',
    image: '/images/cad-13.jpg',
    drawingFile: null,
    nativeFiles: ['/cad-files/USB-B-S-B-TH_B.sldprt', '/cad-files/USB-B-S-F-B-TH.sldasm', '/cad-files/USB-B-S-TH_P.sldprt', '/cad-files/USB-B-S-TH_S.sldprt'],
    parentAssembly: 'nanolab-assembly',
    glMatch: ['USB-B'],
    modelFile: null
  }
]

// Subsystem color accents for callouts / tags / 3D highlights.
export const subsystemColor = {
  Enclosure: '#93c5fd',
  TDC: '#d4a017',
  'Camera/LED': '#f0f4ff',
  Water: '#7dd3fc',
  Substrate: '#86efac',
  Electronics: '#fda4af'
}