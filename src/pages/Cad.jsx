import { Link } from 'react-router-dom'
import Section from '../components/Section.jsx'
import Reveal from '../components/Reveal.jsx'
import KineticText from '../components/KineticText.jsx'
import ModelViewer from '../components/threed/ModelViewer.jsx'
import PartViewerSlot from '../components/threed/PartViewerSlot.jsx'
import { withBase } from '../lib/withBase.js'
import { model, parts, subsystems, subsystemColor } from '../data/parts.js'

// ── helpers ──────────────────────────────────────────────────────────────
const baseName = (p) => p.split('/').pop()
const fileExt = (p) => {
  const m = baseName(p).match(/\.([a-z0-9]+)$/i)
  return m ? m[1].toUpperCase() : 'FILE'
}
const extKind = (ext) => {
  if (ext === 'SLDDRW') return 'Drawing'
  if (ext === 'SLDPRT') return 'Part'
  if (ext === 'SLDASM') return 'Assembly'
  if (ext === 'PDF') return 'Schematic'
  if (ext === 'KICAD_PRO') return 'KiCad project'
  return ext
}

// Curated subset that spans every subsystem, shown as per-part 3D slots.
// Every part's modelFile is currently null, so each slot renders a styled
// placeholder with the part's image until a standalone GLB is dropped in.
const featuredPartIds = [
  'nanolab-shell',
  'tdc-assembly-v2',
  'tdc-bottom-v2',
  'camera-led-module',
  'water-injection',
  'pump-adapter',
  'rockwool-cover',
  'usb-b-camera-clip',
]
const featuredParts = featuredPartIds
  .map((id) => parts.find((p) => p.id === id))
  .filter(Boolean)

// All parts that carry a 2D engineering drawing.
const drawingParts = parts.filter((p) => p.drawingFile)

// All parts grouped by subsystem, for the native files library.
const partsBySubsystem = subsystems
  .map((s) => ({
    ...s,
    items: parts.filter((p) => p.subsystem === s.id && p.nativeFiles?.length),
  }))
  .filter((s) => s.items.length > 0)

// ── small local subcomponents ─────────────────────────────────────────────
function DrawingCard({ part, delay }) {
  const ext = fileExt(part.drawingFile)
  const color = subsystemColor[part.subsystem] || '#d4a017'
  return (
    <Reveal delay={delay} className="h-full">
      <a
        href={withBase(part.drawingFile)}
        target="_blank"
        rel="noreferrer"
        className="group flex h-full flex-col rounded-2xl border border-hex-line bg-hex-panel p-5 transition-colors hover:border-hex-gold/50"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: color }}
              aria-hidden="true"
            />
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-hex-muted">
              {part.subsystem}
            </span>
          </div>
          <span className="rounded-md border border-hex-line bg-hex-bg/60 px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide text-hex-gold/90">
            {ext}
          </span>
        </div>

        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-white">
          {part.name}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-hex-muted">{part.role}</p>

        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="text-xs text-hex-muted2">{extKind(ext)}</span>
          <span className="text-sm font-semibold text-hex-gold transition-colors group-hover:text-white">
            Open drawing →
          </span>
        </div>
      </a>
    </Reveal>
  )
}

function NativeFileRow({ file }) {
  const ext = fileExt(file)
  return (
    <li>
      <a
        href={withBase(file)}
        download
        className="group flex items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2 text-sm transition-colors hover:border-hex-line hover:bg-white/5"
      >
        <span className="truncate font-mono text-xs text-slate-300 group-hover:text-white">
          {baseName(file)}
        </span>
        <span className="shrink-0 rounded border border-hex-line bg-hex-bg/60 px-1.5 py-0.5 text-[0.6rem] font-semibold tracking-wide text-hex-gold/90">
          {ext}
        </span>
      </a>
    </li>
  )
}

export default function Cad() {
  const drawingCount = drawingParts.length
  const nativeCount = parts.reduce(
    (n, p) => n + (p.nativeFiles?.length || 0),
    0
  )

  return (
    <main className="min-h-screen bg-hex-bg text-white">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-6xl px-6 pt-36 pb-16 sm:pt-44">
        <Reveal>
          <span className="inline-block rounded-full border border-hex-line bg-hex-gold/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-hex-gold">
            CAD &amp; Drawings
          </span>
        </Reveal>

        <KineticText
          as="h1"
          text="A browsable library of every part"
          split="word"
          className="mt-6 block font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
        />

        <Reveal as="p" delay={1} className="mt-6 text-xl font-semibold text-hex-gold">
          SolidWorks drawings, native CAD files, and 3D models, all in one place.
        </Reveal>

        <Reveal as="p" delay={2} className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
          Every custom component was modeled in SolidWorks and documented with
          its own engineering drawing. The full nanolab assembly is viewable in
          3D below, with per-part model slots ready to receive standalone
          GLB files. Drawings and native CAD files are linked for every part
          that has them.
        </Reveal>

        <Reveal delay={3} className="mt-10 flex flex-wrap gap-3">
          <a
            href="#cad-models"
            className="rounded-lg bg-hex-gold px-5 py-2.5 text-sm font-semibold text-hex-bg transition hover:bg-[#e4b125]"
          >
            View the 3D assembly
          </a>
          <a
            href="#drawings"
            className="rounded-lg border border-hex-gold/40 px-5 py-2.5 text-sm font-semibold text-hex-gold transition hover:bg-hex-gold/10"
          >
            Browse {drawingCount} engineering drawings
          </a>
        </Reveal>
      </section>

      {/* ── CAD models ──────────────────────────────────────────────────── */}
      <Section
        id="cad-models"
        eyebrow="CAD Models"
        title="The whole assembly, then each part"
      >
        <Reveal as="p" className="max-w-3xl text-base leading-relaxed text-slate-300">
          The complete nanolab was exported from SolidWorks to glTF 2.0. The
          viewer below loads that full assembly, {parts.length} parts and
          fasteners included, so you can orbit, zoom, and inspect how every
          piece fits together. Below it, a slot per part stands ready for a
          standalone model file. Those files are not yet exported, so each
          slot shows the part image as a placeholder until a GLB is dropped
          in.
        </Reveal>

        <Reveal delay={1} className="mt-10">
          <ModelViewer
            src={withBase(model.src)}
            caption="Nanolab Assembly — full SolidWorks export (glTF 2.0)"
          />
        </Reveal>

        <Reveal as="p" delay={2} className="mt-12 max-w-3xl text-base leading-relaxed text-slate-400">
          These per-part slots cover one representative part from each
          subsystem. The drawings and native files further down the page
          cover every part exhaustively.
        </Reveal>

        <div className="mt-8 grid gap-12">
          {featuredParts.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) + 1}>
              <PartViewerSlot part={p} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Engineering drawings ────────────────────────────────────────── */}
      <Section
        id="drawings"
        eyebrow="Engineering Drawings"
        title="Every documented part, drawn out"
      >
        <Reveal as="p" className="max-w-3xl text-base leading-relaxed text-slate-300">
          Each SolidWorks part and assembly was given a dimensioned engineering
          drawing (.SLDDRW). The HexaFlow PCB is documented with its C+G Module
          schematic PDF instead. {drawingCount} drawings are linked below,
          grouped by subsystem, each opening the source file directly.
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {drawingParts.map((p, i) => (
            <DrawingCard key={p.id} part={p} delay={(i % 3) + 1} />
          ))}
        </div>

        <Reveal as="p" delay={2} className="mt-8 max-w-3xl text-sm italic leading-relaxed text-hex-muted">
          Parts without a drawing file, such as the Rockwool Window, the TDC
          Assembly V2, the Resin Addin TDC, the Capacitive Soil Moisture
          Sensor, and the USB-B Camera Clip, are listed in the native files
          library below.
        </Reveal>
      </Section>

      {/* ── Native CAD files ───────────────────────────────────────────── */}
      <Section
        id="native-files"
        eyebrow="Native CAD Files"
        title="Download the source models"
      >
        <Reveal as="p" className="max-w-3xl text-base leading-relaxed text-slate-300">
          The native source files for every part are available here, grouped
          by subsystem. SolidWorks part (.SLDPRT), assembly (.SLDASM), and
          drawing (.SLDDRW) files are listed alongside the KiCad project for
          the HexaFlow PCB. {nativeCount} native files in total, each a
          direct download.
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {partsBySubsystem.map((s, si) => {
            const color = subsystemColor[s.id] || '#d4a017'
            return (
              <Reveal key={s.id} delay={(si % 2) + 1}>
                <div className="rounded-2xl border border-hex-line bg-hex-panel p-5">
                  <div className="flex items-center gap-2.5 border-b border-hex-line pb-3">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ background: color }}
                      aria-hidden="true"
                    />
                    <h3 className="font-display text-lg font-bold text-white">
                      {s.label}
                    </h3>
                    <span className="ml-auto text-xs text-hex-muted2">
                      {s.items.length} part{s.items.length === 1 ? '' : 's'}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-hex-muted">
                    {s.blurb}
                  </p>

                  <div className="mt-4 grid gap-4">
                    {s.items.map((p) => (
                      <div key={p.id}>
                        <div className="flex items-baseline justify-between gap-3 px-1">
                          <span className="font-display text-sm font-semibold text-slate-200">
                            {p.name}
                          </span>
                          <span className="text-[0.65rem] text-hex-muted2">
                            {p.nativeFiles.length} file{p.nativeFiles.length === 1 ? '' : 's'}
                          </span>
                        </div>
                        <ul className="mt-1.5 grid gap-1">
                          {p.nativeFiles.map((f) => (
                            <NativeFileRow key={f} file={f} />
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </Section>

      {/* ── Software ──────────────────────────────────────────────────── */}
      <Section id="software" eyebrow="Software" title="Built in SolidWorks and KiCad">
        <Reveal as="p" className="max-w-3xl text-base leading-relaxed text-slate-300">
          The mechanical design is SolidWorks throughout. Parts are modeled as
          .SLDPRT files, assembled into .SLDASM files, and documented with
          dimensioned .SLDDRW engineering drawings. The full nanolab assembly
          was exported from SolidWorks to glTF 2.0 for the web viewer on this
          page.
        </Reveal>

        <Reveal as="p" delay={1} className="mt-6 max-w-3xl text-base leading-relaxed text-slate-400">
          The HexaFlow PCB is the one exception. It was designed in KiCad, with
          the board itself modeled in SolidWorks so it appears in the assembly
          viewer. The C+G Module schematic is published as a PDF and linked in
          the drawings and native files sections above.
        </Reveal>

        <Reveal delay={2} className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/assembly"
            className="rounded-lg bg-hex-gold px-5 py-2.5 text-sm font-semibold text-hex-bg transition hover:bg-[#e4b125]"
          >
            Explore the assembled nanolab →
          </Link>
          <Link
            to="/ai-control"
            className="rounded-lg border border-hex-gold/40 px-5 py-2.5 text-sm font-semibold text-hex-gold transition hover:bg-hex-gold/10"
          >
            See the bill of materials
          </Link>
        </Reveal>
      </Section>
    </main>
  )
}