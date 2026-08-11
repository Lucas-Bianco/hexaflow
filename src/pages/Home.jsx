import { Link } from 'react-router-dom'
import Section from '../components/Section.jsx'
import Reveal from '../components/Reveal.jsx'
import KineticText from '../components/KineticText.jsx'
import StatCounter from '../components/StatCounter.jsx'
import AssemblyViewer from '../components/threed/AssemblyViewer.jsx'
import { useScrollProgress } from '../lib/useScrollProgress.js'
import { withBase } from '../lib/withBase.js'
import { team, teamMeta } from '../data/team.js'
import { journey } from '../data/journey.js'

// Three strongest journey beats for the teaser. Each links to /journey.
const journeyHighlights = [
  journey.find((j) => j.title === 'From hydroponics to a thorny devil'),
  journey.find((j) => j.title === 'NASA liked the hex. Then pushed us.'),
  journey.find((j) => j.title === 'Drop, measure, repeat — nine times'),
]

function ScrollCue() {
  return (
    <div
      className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      aria-hidden="true"
    >
      <span className="text-[0.6rem] uppercase tracking-[0.25em] text-hex-muted">Scroll</span>
      <span className="h-8 w-px origin-top animate-pulse bg-gradient-to-b from-hex-gold to-transparent" />
    </div>
  )
}

function CtaLink({ to, children, variant = 'ghost' }) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5'
  const styles =
    variant === 'primary'
      ? `${base} bg-hex-gold text-hex-bg shadow-[0_12px_28px_-12px_rgba(212,160,23,0.75)] hover:bg-[#e4b125]`
      : `${base} border border-hex-gold/40 text-hex-gold hover:bg-hex-gold/10`
  return (
    <Link to={to} className={styles}>
      {children}
    </Link>
  )
}

export default function Home() {
  const [assemblyRef, explode] = useScrollProgress({ start: 'top top', end: 'bottom bottom', scrub: 1 })

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-32 text-center">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 35%, rgba(212,160,23,0.12), transparent 70%)',
          }}
        />

        <Reveal>
          <span className="mb-6 inline-block rounded-full border border-hex-line bg-hex-gold/5 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-hex-gold">
            {teamMeta.school} · {teamMeta.program}
          </span>
        </Reveal>

        <KineticText
          as="h1"
          split="word"
          text="Growing plants in microgravity, the way a thorny devil drinks"
          className="font-display mx-auto max-w-4xl text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl"
        />

        <Reveal as="p" delay={2} className="mt-7 max-w-2xl text-lg font-semibold text-hex-gold">
          Water that climbs in free-fall.
        </Reveal>

        <Reveal as="p" delay={3} className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
          Hexagonal capillary channels copied from the thorny devil lizard, carrying water to plant
          roots where gravity can&rsquo;t help. Nine free-fall drops, 14.7&nbsp;mm of measured
          capillary movement, inside a 2U nanolab.
        </Reveal>

        <Reveal as="div" delay={4} className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <CtaLink to="/mission" variant="primary">
            Read the mission
          </CtaLink>
          <CtaLink to="/drop-testing">See the drop tests</CtaLink>
        </Reveal>

        <ScrollCue />
      </section>

      {/* ── Scroll-driven hero assembly: the nanolab explodes apart ──────── */}
      <section ref={assemblyRef} className="relative h-[260vh]">
        <div className="sticky top-16 flex h-screen flex-col items-center justify-center px-6">
          <Reveal className="mb-4 text-center">
            <span className="text-xs uppercase tracking-[0.25em] text-hex-muted">
              The Assembly
            </span>
          </Reveal>
          <div className="mx-auto w-full max-w-4xl">
            <AssemblyViewer
              explode={explode}
              showToolbar={false}
              showPartsList={false}
              height="70vh"
            />
          </div>
          <Reveal as="p" className="mt-5 max-w-xl text-center text-sm text-hex-muted">
            Scroll to take the nanolab apart. Every channel is SLA-printed resin, 0.48&nbsp;mm wide,
            holding 10.12&nbsp;mL when saturated.
          </Reveal>
        </div>
      </section>

      {/* ── What is HexaFlow ─────────────────────────────────────────────── */}
      <Section id="about" eyebrow="About the Project" title="What is HexaFlow?">
        <Reveal as="div" className="mt-8 grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5 text-base leading-relaxed text-slate-300">
            <p>
              HexaFlow is a modular capillary action nanolab that uses AI vision and biomimicry to
              deliver water to plants. A five-member team from {teamMeta.school} built it inside a 2U
              enclosure, on a $100 budget, to prevent root rot while enabling interchangeable
              experiments and rapid data collection. The system was tested in a 2.2-second free-fall
              window at NASA Glenn&rsquo;s 2.2-Second Drop Tower in Ohio.
            </p>
            <p>
              The hexagonal channels take their cue from the <strong className="text-slate-100">thorny devil lizard</strong>{' '}
              (<em>Moloch horridus</em>), which transports water through grooved skin by capillary
              action, no pump required. A vision model reads root moisture from the camera and drives
              the pump, closing a continuous feedback loop that prevents overwatering and root rot.
            </p>
            <p>
              Manufacturing relies on SLA 3D printing in resin. Resin&rsquo;s polar bonds grip water
              more tightly than water molecules grip each other, driving efficient capillary
              transport, strong enough that the system holds water even when inverted.
            </p>
          </div>

          <Reveal as="aside" delay={2} className="rounded-2xl border border-hex-line bg-hex-panel p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-hex-gold/80">The constraints</div>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>
                <span className="font-display text-white">2U nanolab</span> — 20×10×10&nbsp;cm
                envelope
              </li>
              <li>
                <span className="font-display text-white">5 V USB-A</span> power,{' '}
                <span className="font-display text-white">$100</span> budget
              </li>
              <li>
                <span className="font-display text-white">Mechanical</span> water supply, no
                pumps-for-everything
              </li>
              <li>
                <span className="font-display text-white">Modular</span> for interchangeable
                experiments
              </li>
            </ul>
          </Reveal>
        </Reveal>

        <Reveal as="div" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCounter
            value={2.2}
            dp={1}
            suffix=" s"
            label="NASA Glenn drop window"
            note="2.2-Second Drop Tower, Ohio"
          />
          <StatCounter
            value={14.7}
            dp={1}
            suffix=" mm"
            label="Mean capillary rise"
            note="9-drop Suite B, 14-ft rig"
          />
          <StatCounter
            value={0.48}
            dp={2}
            suffix=" mm"
            label="Channel width"
            note="0.020 in gap"
          />
          <StatCounter
            value={10.12}
            dp={2}
            suffix=" mL"
            label="Channel capacity"
            note="fully saturated"
          />
        </Reveal>
      </Section>

      {/* ── Team snapshot ───────────────────────────────────────────────── */}
      <Section id="team" eyebrow="The People" title="Our Team">
        <Reveal as="p" className="mt-3 text-hex-muted">
          {teamMeta.subtitle}
        </Reveal>

        <Reveal as="figure" className="mt-10 overflow-hidden rounded-2xl border border-hex-line">
          <img
            src={withBase(teamMeta.photo)}
            alt={teamMeta.photoAlt}
            loading="lazy"
            decoding="async"
            className="block w-full"
          />
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {team.map((m, i) => (
            <Reveal
              as="div"
              key={m.name}
              delay={Math.min(i + 1, 6)}
              className="rounded-2xl border border-hex-line bg-hex-panel p-6 text-center transition-colors hover:border-hex-gold/40"
            >
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full border border-hex-gold/40 bg-hex-gold/10 font-display text-xl font-bold text-hex-gold">
                {m.name[0]}
              </div>
              <div className="font-display font-bold text-white">{m.name}</div>
              <div className="mt-1 text-xs leading-relaxed text-hex-muted">{m.role}</div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Journey teaser ──────────────────────────────────────────────── */}
      <Section id="journey-teaser" eyebrow="The Build" title="From a lizard to a nanolab">
        <Reveal as="p" className="mt-3 max-w-2xl text-hex-muted">
          Nine months, eight substrates, fifteen drops, and one biomimetic breakthrough. Three
          moments that shaped the build.
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {journeyHighlights.map((j, i) => (
            <Reveal
              as="article"
              key={j.title}
              delay={Math.min(i + 1, 6)}
              className="group flex h-full flex-col rounded-2xl border border-hex-line bg-hex-panel p-6 transition-colors hover:border-hex-gold/40"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium uppercase tracking-[0.18em] text-hex-gold/80">
                  {j.tag}
                </span>
                <span className="text-hex-muted2">{j.date}</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-white">{j.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">
                {j.body.length > 200
                  ? `${j.body.slice(0, 197).replace(/\s+\S*$/, '')}…`
                  : j.body}
              </p>
              <Link
                to="/journey"
                className="mt-5 inline-flex items-center text-sm font-semibold text-hex-gold transition-colors group-hover:text-[#e4b125]"
              >
                Read the full journey
                <span className="ml-1.5 transition-transform group-hover:translate-x-0.5">&rarr;</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Final CTA band ──────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-6xl px-6 py-28 text-center">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-70"
          style={{
            background:
              'radial-gradient(50% 60% at 50% 50%, rgba(212,160,23,0.12), transparent 70%)',
          }}
        />
        <KineticText
          as="h2"
          split="word"
          text="Watch water climb where gravity can't."
          className="font-display mx-auto max-w-3xl text-balance text-3xl font-bold leading-tight text-white sm:text-4xl"
        />
        <Reveal as="p" delay={2} className="mx-auto mt-5 max-w-xl text-base text-slate-300">
          Walk through every part of the nanolab in 3D, or open the source list behind every claim on
          this site.
        </Reveal>
        <Reveal as="div" delay={3} className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <CtaLink to="/assembly" variant="primary">
            Explore the assembly
          </CtaLink>
          <CtaLink to="/sources">Read the sources</CtaLink>
        </Reveal>
      </section>
    </div>
  )
}