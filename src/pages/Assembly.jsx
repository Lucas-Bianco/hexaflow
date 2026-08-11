import Section from '../components/Section.jsx'
import Reveal from '../components/Reveal.jsx'
import KineticText from '../components/KineticText.jsx'
import AssemblyViewer from '../components/threed/AssemblyViewer.jsx'
import PartViewerSlot from '../components/threed/PartViewerSlot.jsx'
import { useScrollProgress } from '../lib/useScrollProgress.js'
import { withBase } from '../lib/withBase.js'
import { model, subsystems, parts, subsystemColor } from '../data/parts.js'
import { pumpSpecs, designConstraints } from '../data/bom.js'

// Page-local section that mirrors <Section> but animates the title with
// KineticText. Kept here so the shared Section.jsx stays untouched.
function KSection({ id, eyebrow, title, children, className = '' }) {
  return (
    <section id={id} className={`mx-auto w-full max-w-6xl px-6 py-24 ${className}`.trim()}>
      {eyebrow && (
        <Reveal>
          <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
            {eyebrow}
          </div>
        </Reveal>
      )}
      {title && (
        <KineticText
          as="h2"
          text={title}
          split="word"
          className="block font-display text-3xl font-bold text-white sm:text-4xl"
        />
      )}
      {children}
    </section>
  )
}

// Facts from modular-enclosure.astro, preserved verbatim in wording.
const twoConfigs = [
  {
    tag: 'Configuration A',
    title: 'Drop Test Setup',
    accent: 'border-hex-gold/40',
    dot: 'bg-hex-gold',
    bullets: [
      'TDS and pH sensors removed to save weight and space',
      'Larger, high-capacity pump installed',
      'Target: approximately 8.63 mL channel fill',
      'Fills channels as much as possible within the short drop window (the original site sized this for 5.18 s; HexaFlow actually tested at the NASA Glenn 2.2-Second Drop Tower)',
      'Optimized for short-duration data collection',
    ],
  },
  {
    tag: 'Configuration B',
    title: 'Long-Term Growing Setup',
    accent: 'border-sky-400/40',
    dot: 'bg-sky-400',
    bullets: [
      'TDS (Total Dissolved Solids) sensor included',
      'pH sensor included',
      'Larger reservoir for extended growing sessions',
      'Smaller, precise pump (320 mA savings over the drop-test pump)',
      'Fine-grain water delivery tuning',
      'AI actively monitors and controls watering',
    ],
  },
]

const enclosureDesign = [
  {
    title: 'Sliding Shelf System',
    desc: 'Electronics, lights, and the experiment module all mount to a sliding rail, hot-swappable without tools.',
  },
  {
    title: 'Hollow Side Walls',
    desc: 'Cable management routes through hollow walls, keeping electronics clear of water exposure.',
  },
  {
    title: 'Front & Side Doors',
    desc: 'Panel doors open onto the internal components and the experiment module for quick access.',
  },
  {
    title: 'Modular Slots',
    desc: 'The experiment module slot accepts the TDC (capillary plate), substrate tray, or future experiment types.',
  },
]

const hardwareIterations = [
  {
    title: 'Door Screws',
    desc: 'M3 16 mm to M3 4 mm, seated in M3 thread inserts for a cleaner, lower-profile door.',
  },
  {
    title: 'Walls',
    desc: '4 mm to 2 mm walls, freeing internal volume without losing rigidity.',
  },
  {
    title: 'Wire Holes',
    desc: '5 mm to 8 mm wire holes, so cable routing no longer binds.',
  },
  {
    title: 'Substrate Modules',
    desc: 'M4 x 6 mm screws with M4 thread inserts, a stronger, repeatable mount for the substrate modules.',
  },
]

const manufacturing = [
  {
    tag: 'FDM Body',
    accent: 'border-hex-gold/40',
    desc: 'The enclosure body prints in FDM: economical, tough, and good enough for every non-critical surface.',
  },
  {
    tag: 'SLA Hex Dome',
    accent: 'border-sky-400/40',
    desc: 'Only the critical hex dome is SLA-printed in resin, a polar material chosen specifically to drive capillary adhesion in the channels.',
  },
  {
    tag: 'VOC Lesson',
    accent: 'border-rose-400/40',
    desc: "The team's new resin printer emitted VOCs that shriveled the test plants overnight. Emissions and biology don't share a room.",
  },
]

const constraintCards = [
  { k: 'Envelope', v: designConstraints.envelope },
  { k: 'Power', v: designConstraints.power },
  { k: 'Budget', v: designConstraints.budget },
  { k: 'Water', v: designConstraints.water },
  { k: 'Start', v: designConstraints.start },
  { k: 'Risk', v: designConstraints.risk },
]

// Group parts by subsystem for the per-part deep dive. Skip the root assembly.
const rootId = model.rootId
const partsBySubsystem = subsystems.map((s) => ({
  ...s,
  color: subsystemColor[s.id] || '#d4a017',
  items: parts.filter((p) => p.subsystem === s.id && p.id !== rootId),
}))

// Static labelled enclosure schematic, reproduced from modular-enclosure.astro.
function EnclosureDiagram() {
  const muted = '#64748b'
  const gold = '#d4a017'
  return (
    <div className="flex justify-center p-8">
      <svg
        width="100%"
        viewBox="0 0 380 260"
        style={{ maxWidth: 480 }}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Enclosure diagram showing shelf rails, hollow cable-management walls, electronics bay, and experiment module position"
      >
        {/* Outer enclosure */}
        <rect x="20" y="20" width="340" height="220" rx="8"
          fill="rgba(212,160,23,0.05)" stroke={gold} strokeWidth="2" />
        {/* Hollow side walls */}
        <rect x="20" y="20" width="28" height="220" rx="8"
          fill="rgba(212,160,23,0.08)" stroke="rgba(212,160,23,0.3)" strokeWidth="1" />
        <rect x="332" y="20" width="28" height="220" rx="8"
          fill="rgba(212,160,23,0.08)" stroke="rgba(212,160,23,0.3)" strokeWidth="1" />
        <text x="34" y="135" fill={muted} fontSize="8" fontFamily="Inter, sans-serif"
          transform="rotate(-90,34,135)">Cable</text>
        <text x="346" y="135" fill={muted} fontSize="8" fontFamily="Inter, sans-serif"
          transform="rotate(90,346,135)">Cable</text>
        {/* Sliding shelf rails */}
        <line x1="48" y1="90" x2="332" y2="90" stroke="rgba(212,160,23,0.4)" strokeWidth="1.5"
          strokeDasharray="4 3" />
        <line x1="48" y1="160" x2="332" y2="160" stroke="rgba(212,160,23,0.4)" strokeWidth="1.5"
          strokeDasharray="4 3" />
        <text x="190" y="86" textAnchor="middle" fill={muted} fontSize="8"
          fontFamily="Inter, sans-serif">shelf rail</text>
        <text x="190" y="156" textAnchor="middle" fill={muted} fontSize="8"
          fontFamily="Inter, sans-serif">shelf rail</text>
        {/* Electronics shelf */}
        <rect x="60" y="95" width="260" height="55" rx="4"
          fill="rgba(212,160,23,0.08)" stroke="rgba(212,160,23,0.3)" strokeWidth="1" />
        <text x="190" y="119" textAnchor="middle" fill="#94a3b8" fontSize="10"
          fontFamily="Space Grotesk, sans-serif" fontWeight="600">Electronics + Carrier Board</text>
        <text x="190" y="134" textAnchor="middle" fill={muted} fontSize="8"
          fontFamily="Inter, sans-serif">RPi · USB hub · pump</text>
        {/* Experiment module */}
        <rect x="60" y="168" width="260" height="55" rx="4"
          fill="rgba(212,160,23,0.12)" stroke={gold} strokeWidth="1.5" />
        <text x="190" y="192" textAnchor="middle" fill="#fff" fontSize="10"
          fontFamily="Space Grotesk, sans-serif" fontWeight="600">Experiment Module (TDC)</text>
        <text x="190" y="207" textAnchor="middle" fill={muted} fontSize="8"
          fontFamily="Inter, sans-serif">hex channels · plant clips · substrate</text>
        {/* Camera / LED */}
        <rect x="60" y="30" width="120" height="48" rx="4"
          fill="rgba(103,232,249,0.06)" stroke="rgba(103,232,249,0.3)" strokeWidth="1" />
        <text x="120" y="50" textAnchor="middle" fill="#93c5fd" fontSize="9"
          fontFamily="Space Grotesk, sans-serif" fontWeight="600">Camera/LED</text>
        <text x="120" y="65" textAnchor="middle" fill={muted} fontSize="8"
          fontFamily="Inter, sans-serif">anti-glare strip</text>
        {/* Reservoir */}
        <rect x="200" y="30" width="120" height="48" rx="4"
          fill="rgba(212,160,23,0.06)" stroke="rgba(212,160,23,0.25)" strokeWidth="1" />
        <text x="260" y="50" textAnchor="middle" fill="#94a3b8" fontSize="9"
          fontFamily="Space Grotesk, sans-serif" fontWeight="600">Reservoir</text>
        <text x="260" y="65" textAnchor="middle" fill={muted} fontSize="8"
          fontFamily="Inter, sans-serif">VEX fittings · heat seal</text>
        {/* Sliding direction */}
        <text x="190" y="252" textAnchor="middle" fill={muted} fontSize="9"
          fontFamily="Inter, sans-serif">{'< sliding shelf direction >'}</text>
      </svg>
    </div>
  )
}

export default function Assembly() {
  // Scroll-driven explode for the whole-nanolab viewer. The tall wrapper gives
  // the sticky viewer scroll travel; progress (0..1) drives explode={progress}.
  const [explodeRef, explodeProgress] = useScrollProgress({ scrub: 1 })

  return (
    <>
      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-24 pb-12">
        <Reveal>
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
            Interactive · 3D
          </div>
        </Reveal>
        <KineticText
          as="h1"
          text="Assembly"
          split="char"
          className="block font-display text-5xl font-bold text-white sm:text-6xl"
        />
        <Reveal delay={1}>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
            Every part of the HexaFlow nanolab in one interactive 3D model. Click any
            part on the model or in the list to read what it does, then keep scrolling
            to explode the whole assembly apart and dive into each component.
          </p>
        </Reveal>
      </section>

      {/* The whole nanolab — scroll-driven explode */}
      <KSection
        id="whole-nanolab"
        eyebrow="The whole nanolab"
        title="One model, every subsystem"
      >
        <Reveal>
          <p className="mt-6 max-w-3xl text-slate-300">
            This is the full HexaFlow nanolab, a 2U (20 x 10 x 10 cm) assembly that
            carries the enclosure, sliding shelves, electronics, lighting, and the
            capillary experiment module. Scroll to pull it apart, then click a part
            to isolate it.
          </p>
        </Reveal>

        <div ref={explodeRef} className="relative mt-12 h-[150vh]">
          <div className="sticky top-16">
            <AssemblyViewer
              explode={explodeProgress}
              showToolbar={true}
              showPartsList={true}
              height="72vh"
            />
            <p className="mt-3 text-center text-sm text-hex-muted2">
              Scroll to explode • click a part to isolate
            </p>
          </div>
        </div>
      </KSection>

      {/* Per-part deep dive, grouped by subsystem */}
      <KSection
        id="deep-dive"
        eyebrow="Per-part deep dive"
        title="Every part, in its own context"
      >
        <Reveal>
          <p className="mt-6 max-w-3xl text-slate-300">
            Each subsystem below breaks into its parts. Every part has a dedicated
            3D viewer slot ready for a standalone model file, alongside its role,
            subsystem, and source files. Slots without a model yet show a preview and
            a note that the file is coming soon.
          </p>
        </Reveal>

        <div className="mt-16 space-y-20">
          {partsBySubsystem.map((group) => (
            <div key={group.id} id={`subsystem-${group.id}`}>
              {/* Subsystem header with color accent */}
              <Reveal>
                <div className="flex items-center gap-3">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ background: group.color }}
                    aria-hidden="true"
                  />
                  <div className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: group.color }}>
                    {group.label}
                  </div>
                </div>
              </Reveal>
              <Reveal delay={1}>
                <h3 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
                  {group.label} subsystem
                </h3>
              </Reveal>
              <Reveal delay={2}>
                <p className="mt-3 max-w-3xl text-slate-400">{group.blurb}</p>
              </Reveal>

              {/* Parts in this subsystem */}
              <div className="mt-10 space-y-12">
                {group.items.map((part, i) => (
                  <Reveal key={part.id} delay={Math.min((i % 3) + 1, 6)}>
                    <div
                      id={part.id}
                      className="border-t border-hex-line pt-10"
                      style={{ borderColor: `${group.color}33` }}
                    >
                      <PartViewerSlot part={part} />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </KSection>

      {/* How it goes together — the modular enclosure story */}
      <KSection
        id="how-it-goes-together"
        eyebrow="How it goes together"
        title="A modular enclosure, two missions"
      >
        <Reveal>
          <p className="mt-6 max-w-3xl text-slate-300">
            A sliding shelf system carries the electronics, lights, and experiment
            module. The same enclosure is built in two distinct configurations, one
            for drop testing and one for long-term plant growth, so a single body
            serves both missions.
          </p>
        </Reveal>

        {/* Two configurations */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {twoConfigs.map((c, i) => (
            <Reveal key={c.title} delay={Math.min(i + 1, 6)}>
              <div className={`h-full rounded-2xl border ${c.accent} bg-hex-panel p-6`}>
                <div className="mb-3 flex items-center gap-2">
                  <span className={`inline-block h-2 w-2 rounded-full ${c.dot}`} aria-hidden="true" />
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
                    {c.tag}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-white">{c.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-400">
                  {c.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2 leading-relaxed">
                      <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-hex-gold/60" aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Enclosure design features */}
        <Reveal>
          <h3 className="mt-20 font-display text-xl font-bold text-white">Enclosure design</h3>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {enclosureDesign.map((f, i) => (
            <Reveal key={f.title} delay={Math.min(i + 1, 6)}>
              <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-5">
                <h4 className="font-display text-sm font-bold text-hex-gold">{f.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-hex-muted2">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Enclosure diagram */}
        <Reveal>
          <div className="mt-12 rounded-2xl border border-hex-line bg-hex-panel">
            <EnclosureDiagram />
            <p className="px-6 pb-5 text-center text-xs text-hex-muted2">
              Enclosure diagram showing the shelf rails, hollow cable-management
              walls, electronics bay, and experiment module position.
            </p>
          </div>
        </Reveal>

        {/* Enclosure photo */}
        <Reveal>
          <figure className="mt-8 overflow-hidden rounded-2xl border border-hex-gold/15">
            <img
              src={withBase('/images/enclosure-1.jpg')}
              alt="HexaFlow modular enclosure, full assembly"
              loading="lazy"
              className="w-full object-cover"
            />
            <figcaption className="bg-[#0d1e35] px-4 py-2 text-xs text-hex-muted2">
              Modular enclosure: the sliding shelf system carrying electronics,
              lights, and the experiment module.
            </figcaption>
          </figure>
        </Reveal>

        {/* NASA HUNCH design space */}
        <Reveal>
          <h3 className="mt-20 font-display text-xl font-bold text-white">
            The NASA HUNCH design space
          </h3>
        </Reveal>
        <Reveal delay={1}>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-400">
            Every dimension of the enclosure answers to a NASA HUNCH constraint. The
            envelope is a <span className="text-slate-200">2U nanolab (20 x 10 x 10 cm)</span>,
            power is capped at <span className="text-slate-200">5 V USB-A / 500 mA</span>, and
            the build has to come in under a <span className="text-slate-200">$100 budget</span>.
            Water supply must be <span className="text-slate-200">entirely mechanical</span> with
            no more than <span className="text-slate-200">50 mL of water</span> on board, started
            by a <span className="text-slate-200">24 V start signal</span>, and condensation can
            never reach the sensors or electronics.
          </p>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {constraintCards.map((c, i) => (
            <Reveal key={c.k} delay={Math.min(i + 1, 6)}>
              <div className="rounded-2xl border border-hex-line bg-hex-panel p-5">
                <div className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
                  {c.k}
                </div>
                <div className="text-sm font-semibold leading-relaxed text-slate-200">{c.v}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* One enclosure, two missions — dual pumps */}
        <Reveal>
          <h3 className="mt-20 font-display text-xl font-bold text-white">
            One enclosure, two missions
          </h3>
        </Reveal>
        <Reveal delay={1}>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-400">
            The sliding shelf system lets a single enclosure serve both missions. The
            drop-test build runs a high-capacity{' '}
            <span className="text-slate-200">{pumpSpecs.dropTest.rate}</span> pump
            ({pumpSpecs.dropTest.rpm}) to flood the channels inside the short drop
            window; the long-term build swaps in a precision{' '}
            <span className="text-slate-200">{pumpSpecs.longTerm.rate}</span> pump
            ({pumpSpecs.longTerm.savings}) alongside the TDS and pH sensors for
            sustained, fine-grain watering under AI control.
          </p>
        </Reveal>

        {/* Iterating the hardware */}
        <Reveal>
          <h3 className="mt-20 font-display text-xl font-bold text-white">
            Iterating the hardware
          </h3>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {hardwareIterations.map((h, i) => (
            <Reveal key={h.title} delay={Math.min(i + 1, 6)}>
              <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-5">
                <h4 className="font-display text-sm font-bold text-hex-gold">{h.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-hex-muted2">{h.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={1}>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-slate-400">
            Wiring went solderless and swappable: pin headers plus side and back clips
            mean boards can be swapped without soldering, so the enclosure is
            serviceable in minutes instead of rebuilt.
          </p>
        </Reveal>

        {/* Manufacturing split & VOC lesson */}
        <Reveal>
          <h3 className="mt-20 font-display text-xl font-bold text-white">
            Manufacturing split and a lesson learned
          </h3>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {manufacturing.map((m, i) => (
            <Reveal key={m.tag} delay={Math.min(i + 1, 6)}>
              <div className={`h-full rounded-2xl border ${m.accent} bg-hex-panel p-5`}>
                <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
                  {m.tag}
                </div>
                <p className="text-sm leading-relaxed text-hex-muted2">{m.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </KSection>
    </>
  )
}