import Section from '../components/Section.jsx'
import Reveal from '../components/Reveal.jsx'
import KineticText from '../components/KineticText.jsx'
import PhotoGallery from '../components/Lightbox.jsx'
import DecisionMatrix from '../components/scroll/DecisionMatrix.jsx'
import {
  matrix,
  covers,
  octoberTest,
  grateIteration,
  microgravityTest,
  coverTradeoff,
  substratePhotos,
  coverPhotos,
} from '../data/substrates.js'

// One-line verdict per substrate, derived from each entry's `notes` field.
const VERDICTS = {
  Rockwool:
    'Screws into existing holes; its binding agent stays put; water moves through it better in microgravity.',
  'Clay Pebbles':
    '11.5 mm pebbles cannot enter the 0.48 mm channels, so containment is built into the geometry.',
  'Illite (Clay)':
    'The fine powder would escape the stem opening and clog the channels.',
  'Pine Bark':
    'Fragments lodge in the channels, the material is acidic, and screen sizing becomes a mass-production problem.',
}

// Map the data matrix into the shape <DecisionMatrix> expects: winner is true
// when the notes mark the substrate "Chosen" or with a star. maxScore is 5.
const matrixRows = matrix
  .slice()
  .sort((a, b) => b.total - a.total)
  .map((row) => ({
    name: row.name,
    scores: row.scores,
    winner: /Chosen|★/.test(row.notes),
    verdict: VERDICTS[row.name] || row.notes,
  }))

// October test sample card colors by outcome.
const RESULT_STYLE = {
  pass: { dot: '#4ade80', text: '#4ade80' },
  partial: { dot: '#facc15', text: '#facc15' },
  fail: { dot: '#f87171', text: '#f87171' },
}

export default function Substrates() {
  return (
    <main className="bg-hex-bg">
      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-32 pb-20">
        <Reveal>
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-hex-gold/80">
            Materials · Substrate Selection
          </div>
        </Reveal>
        <KineticText
          as="h1"
          text="Choosing a substrate that holds up in microgravity"
          split="word"
          className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
        />
        <Reveal delay={2}>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
            Eight substrates went into a preliminary grow test. Four made it to
            a scored decision matrix. Two survived. This is the engineering
            reasoning behind rockwool and clay pebbles, and what was rejected
            and why.
          </p>
        </Reveal>
      </section>

      {/* October preliminary grow test */}
      <Section
        id="october-test"
        eyebrow="October 2025 · Preliminary grow test"
        title="Eight substrates, one survivor"
      >
        <Reveal>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
            The team tested eight substrate materials. Only pine bark produced
            substantial plant growth; mold developed rapidly across every
            substrate. Those results drove the pivot toward aeroponics and
            hydroponics over traditional soil substrates.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {octoberTest.samples.map((s, i) => {
            const style = RESULT_STYLE[s.result]
            return (
              <Reveal key={s.name} delay={(i % 4) + 1}>
                <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-5 text-center">
                  <div
                    className="mx-auto mb-3 h-2 w-2 rounded-full"
                    style={{ background: style.dot }}
                  />
                  <div className="font-display text-sm font-semibold text-white">
                    {s.name}
                  </div>
                  <div
                    className="mt-1 text-xs"
                    style={{ color: style.text }}
                  >
                    {s.label}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={2}>
          <div className="mt-8 rounded-2xl border border-hex-gold/40 bg-hex-gold/10 p-6">
            <div className="font-display text-sm font-bold uppercase tracking-widest text-hex-gold">
              Conclusion
            </div>
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              {octoberTest.conclusion}
            </p>
          </div>
        </Reveal>
      </Section>

      {/* Decision matrix */}
      <Section
        id="decision-matrix"
        eyebrow="December 2025 · Scored decision"
        title="Four substrates, three criteria, on a 1 to 5 scale"
      >
        <Reveal>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-hex-muted">
            Four substrates were evaluated using three criteria on a 1 to 5
            scale: System Compatibility, Feasibility in Microgravity, and
            Modularity. The data keys here are microgravity, containment, and
            growth, mapped from those original criteria. The matrix let the
            team choose on purpose instead of on preference.
          </p>
        </Reveal>

        <Reveal delay={2}>
          <div className="mt-10 rounded-2xl border border-hex-line bg-hex-panel p-6">
            <DecisionMatrix rows={matrixRows} maxScore={5} />
            <p className="mt-4 text-xs text-hex-muted2">
              The star marks the highest scoring substrate. All four were
              selected for further testing.
            </p>
          </div>
        </Reveal>

        {/* Chosen rationale cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {matrix
            .filter((row) => /Chosen|★/.test(row.notes))
            .map((row, i) => (
              <Reveal key={row.name} delay={(i % 2) + 1}>
                <div className="h-full rounded-2xl border border-emerald-400/30 bg-hex-panel p-6">
                  <div className="font-display text-sm font-bold uppercase tracking-widest text-emerald-400">
                    {row.name} — Chosen
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {row.notes}
                  </p>
                </div>
              </Reveal>
            ))}
        </div>
      </Section>

      {/* Rejected and why */}
      <Section
        id="rejected"
        eyebrow="What failed the matrix"
        title="Rejected, on engineering grounds"
      >
        <Reveal>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-hex-muted">
            Both rejected substrates had real horticultural promise. Both lost
            on containment: powder escaping, fragments lodging, screens that
            cannot be mass-produced. The quotes below come straight from the
            decision matrix notes.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {matrix
            .filter((row) => /Rejected/.test(row.notes))
            .map((row, i) => (
              <Reveal key={row.name} delay={(i % 2) + 1}>
                <div className="h-full rounded-2xl border border-red-400/25 bg-hex-panel p-6">
                  <div className="font-display text-sm font-bold uppercase tracking-widest text-red-400">
                    {row.name} — Rejected
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {row.notes}
                  </p>
                </div>
              </Reveal>
            ))}
        </div>
      </Section>

      {/* The grate iteration */}
      <Section
        id="grate-iteration"
        eyebrow="Iteration · Containing the clay pebbles"
        title="Five attempts at a grate that holds"
      >
        <Reveal>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
            Containing the clay pebbles took five tries. Each material was
            tested, failed, and fed the next prototype, until the team landed
            on a geometry that held.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grateIteration.attempts.map((a, i) => {
            const isFinal = a.attempt === 'Final'
            return (
              <Reveal key={a.attempt} delay={(i % 3) + 1}>
                <div
                  className={`h-full rounded-2xl border bg-hex-panel p-6 ${
                    isFinal ? 'border-emerald-400/35' : 'border-hex-line'
                  }`}
                >
                  <div className="font-display text-xs font-bold uppercase tracking-widest text-hex-gold">
                    {a.attempt}
                  </div>
                  <h3
                    className={`mt-2 font-display text-base font-bold ${
                      isFinal ? 'text-emerald-400' : 'text-white'
                    }`}
                  >
                    {a.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {a.result}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={2}>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-hex-muted">
            {grateIteration.parallelNote}
          </p>
        </Reveal>
      </Section>

      {/* February 9 roots-through-rockwool fix */}
      <Section
        id="roots-fix"
        eyebrow="February 9, 2026 · A later learning"
        title="Roots through the bottom of the rockwool"
      >
        <Reveal>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
            Clay pebbles and rockwool must stay continuously damp to wick water,
            which is impractical in microgravity, where wetting is intermittent
            at best. The team's fix was to thread the roots through the bottom
            of the rockwool so they reach the nutrient water directly,
            sidestepping the wicking problem entirely.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <div className="mt-8 rounded-2xl border border-hex-gold/40 bg-hex-gold/10 p-6">
            <div className="font-display text-sm font-bold uppercase tracking-widest text-hex-gold">
              Takeaway
            </div>
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              The substrate is not just an anchor. It is part of the
              water-delivery path. Routing roots through its base lets the
              rockwool support the stem while the roots drink straight from the
              reservoir.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* Microgravity simulation test */}
      <Section
        id="microgravity-test"
        eyebrow="Test · 1-minute inversion"
        title="A stand-in for weightlessness"
      >
        <Reveal>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
            Planted substrates were inverted with their covers for one minute to
            simulate weightlessness, a stand-in for the free-fall conditions the
            hardware will see in flight.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-6">
              <div className="font-display text-sm font-bold uppercase tracking-widest text-hex-gold">
                Procedure
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-400">
                {microgravityTest.procedure.map((step) => (
                  <li key={step} className="flex gap-3">
                    <span className="mt-1 text-hex-gold">&#9670;</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="h-full rounded-2xl border border-emerald-400/25 bg-hex-panel p-6">
              <div className="font-display text-sm font-bold uppercase tracking-widest text-emerald-400">
                Result
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {microgravityTest.result}
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Covers */}
      <Section
        id="covers"
        eyebrow="Containment · One cover per substrate"
        title="Purpose-built covers for microgravity"
      >
        <Reveal>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
            In microgravity, loose substrate would float free. Each substrate
            needs a purpose-built cover that stops migration, holds the plant in
            place, and lets the hex channels reach the roots. In the 1-minute
            inversion test, every cover and substrate stayed put, a strong sign
            the designs will hold in actual microgravity.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {covers.map((c, i) => (
            <Reveal key={c.name} delay={(i % 4) + 1}>
              <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-5">
                <div className="font-display text-xs font-bold uppercase tracking-widest text-hex-gold">
                  {c.role}
                </div>
                <h3 className="mt-2 font-display text-base font-bold text-white">
                  {c.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {c.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={2}>
          <div className="mt-8 rounded-2xl border border-hex-line bg-hex-panel p-6">
            <div className="font-display text-sm font-bold uppercase tracking-widest text-hex-gold">
              Sensor cutout tradeoff
            </div>
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              {coverTradeoff}
            </p>
          </div>
        </Reveal>

        <Reveal delay={2}>
          <div className="mt-12">
            <h3 className="font-display text-xl font-bold text-white">
              Cover photos
            </h3>
            <div className="mt-4">
              <PhotoGallery
                images={coverPhotos.map((p) => ({ src: p.src, alt: p.caption }))}
                columns={4}
              />
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Substrate test photos */}
      <Section
        id="substrate-photos"
        eyebrow="Gallery · October test samples"
        title="Substrate test photos"
      >
        <Reveal>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-hex-muted">
            The eight substrate samples from the October preliminary grow test,
            in the order they were planted.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <div className="mt-8">
            <PhotoGallery
              images={substratePhotos.map((p) => ({
                src: p.src,
                alt: p.caption,
              }))}
              columns={4}
            />
          </div>
        </Reveal>
      </Section>
    </main>
  )
}