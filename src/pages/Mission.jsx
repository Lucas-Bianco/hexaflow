import { Link } from 'react-router-dom'
import Section from '../components/Section.jsx'
import Reveal from '../components/Reveal.jsx'
import KineticText from '../components/KineticText.jsx'
import StatCounter from '../components/StatCounter.jsx'
import { designConstraints } from '../data/bom.js'

// NASA HUNCH constraints, sourced from designConstraints in bom.js (which
// itself mirrors modular-enclosure.astro). Numeric ones render as StatCounter
// cards; qualitative ones render as Reveal cards. Nothing here is invented.
const numericConstraints = [
  {
    value: 2,
    suffix: 'U',
    label: 'Nanolab envelope',
    note: designConstraints.envelope.replace('2U nanolab · ', ''),
  },
  {
    value: 5,
    suffix: 'V',
    label: 'USB-A power',
    note: designConstraints.power.replace('5 V USB-A · ', ''),
  },
  {
    value: 100,
    suffix: '',
    label: '$100 total build',
    note: 'NASA HUNCH budget cap',
  },
  {
    value: 50,
    suffix: ' mL',
    label: 'Water budget',
    note: designConstraints.water.replace('≤ 50 mL · ', ''),
  },
  {
    value: 24,
    suffix: 'V',
    label: 'Start signal',
    note: 'NASA HUNCH trigger',
  },
]

const qualitativeConstraints = [
  {
    title: 'Condensation isolated from sensors',
    body: 'Water and sensing had to stay separated. Condensation could not touch the sensors or electronics, or the data would be noise.',
  },
  {
    title: 'Modular',
    body: 'Everything had to be modular, with interchangeable experiments on a sliding shelf system that swaps without tools.',
  },
  {
    title: 'Web interface',
    body: 'It needed a web interface for control and data collection, so the nanolab could run and record without being opened.',
  },
]

function QualitativeCard({ title, body }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-hex-line bg-hex-panel p-6">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-hex-gold/40 bg-hex-gold/10 font-display text-hex-gold">
        ◆
      </div>
      <h3 className="font-display text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-hex-muted">{body}</p>
    </div>
  )
}

export default function Mission() {
  return (
    <main className="min-h-screen bg-hex-bg text-white">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-6xl px-6 pt-36 pb-20 sm:pt-44">
        <Reveal>
          <span className="inline-block rounded-full border border-hex-line bg-hex-gold/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-hex-gold">
            Mission · The Why
          </span>
        </Reveal>

        <KineticText
          as="h1"
          text="Why we built HexaFlow"
          split="word"
          className="mt-6 block font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
        />

        <Reveal as="p" delay={1} className="mt-6 text-xl font-semibold text-hex-gold">
          An engineering design problem, not just a plant grower.
        </Reveal>

        <Reveal as="p" delay={2} className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
          HexaFlow is a modular capillary-action nanolab. The real goal was
          understanding how fluids and plant substrates behave in microgravity,
          a step toward feeding long-distance spaceflight.
        </Reveal>

        <Reveal delay={3} className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/journey"
            className="rounded-lg bg-hex-gold px-5 py-2.5 text-sm font-semibold text-hex-bg transition hover:bg-[#e4b125]"
          >
            Read the design journey →
          </Link>
          <Link
            to="/geometry"
            className="rounded-lg border border-hex-gold/40 px-5 py-2.5 text-sm font-semibold text-hex-gold transition hover:bg-hex-gold/10"
          >
            Explore the geometry
          </Link>
        </Reveal>
      </section>

      {/* ── The Problem ───────────────────────────────────────────────────── */}
      <Section id="problem" eyebrow="The Problem" title="Study fluids, not just grow plants">
        <Reveal as="p" className="max-w-3xl text-lg leading-relaxed text-slate-300">
          The real goal was understanding how fluids and plant substrates behave
          in microgravity, a step toward feeding long-distance spaceflight.
          Plants were the means. The behavior of water in weightlessness was the
          subject.
        </Reveal>

        <Reveal as="p" delay={1} className="mt-6 max-w-3xl text-base leading-relaxed text-slate-400">
          That framing shaped every choice that followed. Long-distance
          spaceflight needs a way to feed crews, but growing plants in
          microgravity is hard because water does not behave the way it does on
          Earth. It floats in blobs, clings to surfaces, and refuses to flow
          downhill.
        </Reveal>

        <Reveal as="p" delay={2} className="mt-6 max-w-3xl text-base leading-relaxed text-slate-400">
          Before you can farm in orbit, you have to understand how water moves
          when gravity stops helping. HexaFlow is built to study that movement,
          inside a 2U nanolab, in the seconds of free-fall a drop tower gives
          you.
        </Reveal>

        <Reveal as="p" delay={3} className="mt-6 max-w-3xl text-base leading-relaxed text-slate-400">
          NASA HUNCH handed the team a box of constraints and asked them to build
          inside it. The constraints section below is that box.
        </Reveal>
      </Section>

      {/* ── The Constraints ───────────────────────────────────────────────── */}
      <Section
        id="constraints"
        eyebrow="The Constraints"
        title="The box we had to build inside"
      >
        <Reveal as="p" className="max-w-3xl text-base leading-relaxed text-slate-400">
          NASA HUNCH gave the rules. The nanolab had to fit a 2U envelope, run on
          5 V USB-A power, cost under $100, and deliver water mechanically.
          Condensation could not touch the sensors. Everything had to be
          modular, with a web interface.
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {numericConstraints.map((c) => (
            <Reveal key={c.label} delay={1}>
              <StatCounter
                value={c.value}
                suffix={c.suffix}
                label={c.label}
                note={c.note}
              />
            </Reveal>
          ))}

          {qualitativeConstraints.map((c, i) => (
            <Reveal key={c.title} delay={(i % 3) + 1}>
              <QualitativeCard title={c.title} body={c.body} />
            </Reveal>
          ))}
        </div>

        <Reveal as="p" delay={2} className="mt-8 max-w-3xl text-sm italic leading-relaxed text-hex-muted">
          The constraints above mirror the design constraints documented in the
          bill of materials. The mechanical water delivery cap is what pushed
          the design toward capillary action in the first place.
        </Reveal>
      </Section>

      {/* ── Our Approach ─────────────────────────────────────────────────── */}
      <Section
        id="approach"
        eyebrow="Our Approach"
        title="Capillary action, aeroponics, and AI vision"
      >
        <Reveal as="p" className="max-w-3xl text-lg leading-relaxed text-slate-300">
          HexaFlow meets the constraints with three ideas working together. The
          hexagonal channels take their cue from the thorny devil lizard
          (<em>Moloch horridus</em>), which transports water through grooved skin
          by capillary action, with no pump. SLA resin prints those channels.
          Resin&apos;s polar bonds grip water more tightly than water grips
          itself, driving capillary transport strong enough that the system
          holds water even when inverted.
        </Reveal>

        <Reveal as="p" delay={1} className="mt-6 max-w-3xl text-base leading-relaxed text-slate-400">
          Plants hang in air and draw water straight from the channels,
          aeroponic, with no growing medium to rot. A vision model reads root
          moisture from the camera and drives the pump only when the roots are
          dry, closing a continuous feedback loop that prevents overwatering and
          root rot.
        </Reveal>

        <Reveal as="p" delay={2} className="mt-6 max-w-3xl text-base leading-relaxed text-slate-400">
          Three systems, one closed-loop nanolab: a biomimetic capillary
          substrate, an aeroponic grow channel, and an AI vision model that
          decides when to water. Each one solves a piece of the problem the
          constraints created.
        </Reveal>

        <Reveal delay={3} className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/journey"
            className="rounded-lg bg-hex-gold px-5 py-2.5 text-sm font-semibold text-hex-bg transition hover:bg-[#e4b125]"
          >
            Read the design journey →
          </Link>
          <Link
            to="/geometry"
            className="rounded-lg border border-hex-gold/40 px-5 py-2.5 text-sm font-semibold text-hex-gold transition hover:bg-hex-gold/10"
          >
            Explore the geometry →
          </Link>
        </Reveal>
      </Section>
    </main>
  )
}