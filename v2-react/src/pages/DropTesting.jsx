import Section from '../components/Section.jsx'
import Reveal from '../components/Reveal.jsx'
import KineticText from '../components/KineticText.jsx'
import StatCounter from '../components/StatCounter.jsx'
import PhotoGallery from '../components/Lightbox.jsx'
import DropRunScrubber from '../components/scroll/DropRunScrubber.jsx'
import CapillaryRiseDemo from '../components/scroll/CapillaryRiseDemo.jsx'
import { withBase } from '../lib/withBase.js'
import { dropTests } from '../data/dropTests.js'

// Rich narrative for each of the three NASA Glenn drops, keyed by run id.
// The terse `narrative` field in dropTests.js is preserved in the data file;
// these blocks expand it into the engineering story the portfolio needs.
const DROP_NARRATIVES = {
  'first-run': {
    tag: 'Drop 1',
    title: 'Full system, best dispersal',
    body: `The whole HexaFlow assembly ran as designed: sealed module, dyed water in the TDC center, hex lattice in place. This first drop produced the best capillary dispersal of the three. It is the run every other drop is compared against, and the closest the geometry came to behaving the way the models predict.`,
  },
  'second-run': {
    tag: 'Drop 2',
    title: 'Hexagons cleaned out',
    body: `Before this drop the hexagons were cleaned out, so the channels started dry and empty. Removing the residue left by the first run isolated how the bare geometry moves water when nothing is left behind to help or hinder it. The dispersal here is the clean-lattice baseline.`,
  },
  'third-run-double-water': {
    tag: 'Drop 3',
    title: 'Double water',
    body: `Water was left in the system because the code that sequences the drops could not be changed between runs. Leaving the water in was the only way to get more water into the module for the final drop. It is a constraint of the test sequence, not a design choice, and it shows up as a different dispersal signature than the first two.`,
  },
}

// Comprehensive results table. Pulls every figure from dropTests.stats plus the
// spread and improvement figures called out in microgravityLadder and footnote.
const RESULTS_TABLE = [
  { label: 'Mean capillary rise', value: dropTests.stats.meanRise, note: 'Suite B, 9-drop baseline, 14-ft local rig' },
  { label: 'Suite A mean (pre-revision)', value: '9.9 mm', note: 'First 6-drop suite, before the module was revised' },
  { label: 'Minimum rise observed', value: '4.28 mm', note: 'Low end of the Suite B spread' },
  { label: 'Maximum rise observed', value: '31.79 mm', note: 'High end of the Suite B spread' },
  { label: 'Improvement between revisions', value: '~48%', note: 'Suite A to Suite B, mean rise' },
  { label: 'Saturated channel capacity', value: dropTests.stats.capacity, note: 'Fully saturated lattice' },
  { label: 'Channel width', value: dropTests.stats.channelWidth, note: '0.020 in gap' },
  { label: 'Local drop height', value: dropTests.stats.dropHeight, note: dropTests.stats.dropHeightMeters },
  { label: 'Local free-fall per drop', value: dropTests.stats.freeFall, note: '14-ft classroom rig' },
  { label: 'NASA Glenn window', value: dropTests.stats.glennWindow, note: dropTests.facility },
  { label: 'Dyed water per drop', value: dropTests.stats.waterVolume, note: 'Added to the TDC center, injector sealed' },
  { label: 'Local baseline drops', value: dropTests.stats.drops, note: 'Across two suites' },
  { label: 'Expected result', value: dropTests.stats.expectedResult, note: 'Design target in microgravity' },
]

function LadderStep({ step, title, body, index }) {
  // Rising gold accent per rung, like the old site: later steps read as closer to flight.
  const accentOpacity = [0.25, 0.45, 0.7, 1][index] ?? 1
  return (
    <Reveal
      as="li"
      delay={Math.min(index + 1, 6)}
      className="relative grid grid-cols-[auto_1fr] gap-4 rounded-xl border border-hex-line bg-hex-panel p-5 sm:gap-6 sm:p-6"
    >
      <span
        className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-hex-gold"
        style={{ opacity: accentOpacity }}
        aria-hidden="true"
      />
      <span className="pt-0.5 font-display text-sm font-bold text-hex-gold/60">{step}</span>
      <div>
        <h3 className="font-display text-base font-bold text-white sm:text-lg">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-hex-muted">{body}</p>
      </div>
    </Reveal>
  )
}

export default function DropTesting() {
  const methodologyParagraphs = dropTests.methodology.split('\n\n').filter(Boolean)

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 text-center">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 35%, rgba(212,160,23,0.12), transparent 70%), radial-gradient(50% 40% at 50% 80%, rgba(56,189,248,0.08), transparent 70%)',
          }}
          aria-hidden="true"
        />
        <Reveal>
          <div className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-hex-gold/80">
            {dropTests.location}
          </div>
        </Reveal>
        <KineticText
          as="h1"
          text="2.2 Seconds at NASA Glenn"
          split="word"
          className="font-display text-4xl font-bold leading-tight text-white sm:text-6xl"
        />
        <Reveal delay={2}>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-hex-muted sm:text-lg">
            Three drops at the {dropTests.facility} in Ohio. This is the test that turns
            HexaFlow's bench-top capillary data into a real microgravity result, and the
            engineering centerpiece of the project.
          </p>
        </Reveal>
        <Reveal delay={3}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs text-hex-muted2">
            <span className="rounded-full border border-hex-gold/40 bg-hex-gold/10 px-3 py-1 text-hex-gold">
              {dropTests.drops} drops
            </span>
            <span className="rounded-full border border-hex-line bg-hex-panel px-3 py-1">
              {dropTests.heightSeconds} s microgravity per drop
            </span>
            <span className="rounded-full border border-hex-line bg-hex-panel px-3 py-1">
              14 ft local rig, ~0.9 s free-fall
            </span>
          </div>
        </Reveal>
      </section>

      {/* ── The facility ───────────────────────────────────────────────── */}
      <Section
        id="facility"
        eyebrow="The facility"
        title="The 2.2-Second Drop Tower"
      >
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <Reveal>
              <p className="text-base leading-relaxed text-hex-muted">
                The {dropTests.facility} is a NASA Glenn Research Center test facility in
                Ohio that produces about{' '}
                <span className="text-white">{dropTests.heightSeconds} seconds of microgravity</span>{' '}
                per drop. A sealed experiment package is released down a vertical chamber and
                falls freely for the full window while cameras and sensors record what happens
                inside. For HexaFlow, that window is long enough to watch dyed water move
                through the hex lattice the way it would in orbit, not the way it moves on a
                lab bench.
              </p>
            </Reveal>
            <Reveal delay={1}>
              <p className="text-base leading-relaxed text-hex-muted">
                HexaFlow ran {dropTests.drops} drops at the 2.2-Second Drop Tower. The results
                on this page come from those runs, plus the local 14-foot classroom rig that
                prepared the team to go to Ohio.
              </p>
            </Reveal>

            {/* Distinction callout: keep the two Glenn facilities separate. */}
            <Reveal delay={2}>
              <div className="rounded-xl border border-hex-gold/30 bg-hex-gold/5 p-5">
                <div className="font-display text-sm font-bold text-hex-gold">
                  Not the 5.18 s Zero Gravity Research Facility
                </div>
                <p className="mt-2 text-sm leading-relaxed text-hex-muted">
                  NASA Glenn also operates the 5.18-second Zero Gravity Research Facility
                  (ZGRF), a separate and larger drop tower at the same center. HexaFlow did
                  <span className="text-white"> not </span>
                  test at the ZGRF. Every reference on this page to a Glenn drop means the
                  2.2-Second Drop Tower. The two facilities are kept distinct everywhere in
                  this project.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Facility at a glance */}
          <Reveal delay={1}>
            <div className="grid h-full grid-cols-2 gap-4 rounded-2xl border border-hex-line bg-hex-panel p-6">
              {[
                { k: 'Facility', v: dropTests.facility },
                { k: 'Location', v: 'NASA Glenn Research Center, Ohio' },
                { k: 'Microgravity window', v: `${dropTests.heightSeconds} s` },
                { k: 'Drops run', v: `${dropTests.drops}` },
                { k: 'Local rig height', v: dropTests.stats.dropHeight },
                { k: 'Local rig free-fall', v: dropTests.stats.freeFall },
              ].map((row) => (
                <div key={row.k}>
                  <div className="text-[0.7rem] uppercase tracking-[0.12em] text-hex-muted2">
                    {row.k}
                  </div>
                  <div className="mt-1 font-display text-sm font-bold text-white">{row.v}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* The ladder of approximations leading to NASA Glenn. */}
        <Reveal>
          <h3 className="mt-16 font-display text-xl font-bold text-white sm:text-2xl">
            A ladder of approximations
          </h3>
        </Reveal>
        <Reveal delay={1}>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-hex-muted">
            At Preliminary Design Review, peer teams raised the objection that has shaped
            every test since: wicking may not behave in microgravity the way it behaves in a
            classroom. There is no way around that from a school workshop, so the team built
            a ladder of approximations. Each rung can falsify a different assumption. None of
            them can prove flight readiness.
          </p>
        </Reveal>
        <ol className="mt-8 grid gap-4">
          {dropTests.microgravityLadder.map((step, i) => (
            <LadderStep
              key={step.step}
              step={step.step}
              title={step.title}
              body={step.body}
              index={i}
            />
          ))}
        </ol>
      </Section>

      {/* ── The three drops ────────────────────────────────────────────── */}
      <Section
        id="three-drops"
        eyebrow="The three drops"
        title="Scrubbing through the Glenn drops"
      >
        <Reveal>
          <p className="mt-8 max-w-3xl text-base leading-relaxed text-hex-muted">
            The runs below are the three drops HexaFlow ran at the {dropTests.facility}, plus
            the dry-run baseline. Scroll to scrub through the frames of every run in sync.
            Frames are ingested separately, so each card shows a styled placeholder until the
            high-speed footage is loaded.
          </p>
        </Reveal>

        <Reveal delay={1} className="mt-10">
          <DropRunScrubber runs={dropTests.runs} height="70vh" />
        </Reveal>

        {/* Per-drop narratives */}
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {dropTests.runs
            .filter((r) => !r.isBaseline)
            .map((run, i) => {
              const n = DROP_NARRATIVES[run.id]
              if (!n) return null
              return (
                <Reveal
                  key={run.id}
                  delay={Math.min(i + 1, 6)}
                  className="flex flex-col rounded-2xl border border-hex-line bg-hex-panel p-6"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-hex-gold/40 bg-hex-gold/10 px-3 py-1 text-xs font-bold text-hex-gold">
                      {n.tag}
                    </span>
                    <span className="text-xs text-hex-muted2">{run.label}</span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-white">{n.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-hex-muted">{n.body}</p>
                </Reveal>
              )
            })}
        </div>

        <Reveal delay={1}>
          <p className="mt-6 text-sm text-hex-muted2">
            Baseline: {dropTests.runs[0].label} — {dropTests.runs[0].narrative.toLowerCase()}
          </p>
        </Reveal>
      </Section>

      {/* ── Results ────────────────────────────────────────────────────── */}
      <Section
        id="results"
        eyebrow="Results"
        title="What the drops measured"
      >
        <Reveal>
          <p className="mt-8 max-w-3xl text-base leading-relaxed text-hex-muted">
            The headline numbers come from the local 14-foot rig, where the team could run
            enough drops to build a statistical baseline. The Glenn drops validate the
            geometry in real microgravity. Mean capillary movement rose from roughly 9.9 mm
            in the first suite to 14.7 mm after the module was revised, an improvement of
            about 48%.
          </p>
        </Reveal>

        {/* Marquee stat counters */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal>
            <StatCounter
              value={14.7}
              dp={1}
              suffix=" mm"
              label="Mean capillary rise"
              note="Suite B, 9-drop baseline, 14-ft local rig"
            />
          </Reveal>
          <Reveal delay={1}>
            <StatCounter
              value={48}
              dp={0}
              suffix="%"
              label="Improvement between revisions"
              note="Suite A to Suite B, mean rise"
            />
          </Reveal>
          <Reveal delay={2}>
            <StatCounter
              value={2.2}
              dp={1}
              suffix=" s"
              label="NASA Glenn microgravity window"
              note={dropTests.facility}
            />
          </Reveal>
          <Reveal>
            <StatCounter
              value={9.9}
              dp={1}
              suffix=" mm"
              label="Suite A mean, pre-revision"
              note="First 6-drop suite"
            />
          </Reveal>
          <Reveal delay={1}>
            <StatCounter
              value={4.28}
              dp={2}
              suffix=" mm"
              label="Minimum rise observed"
              note="Low end of the Suite B spread"
            />
          </Reveal>
          <Reveal delay={2}>
            <StatCounter
              value={31.79}
              dp={2}
              suffix=" mm"
              label="Maximum rise observed"
              note="High end of the Suite B spread"
            />
          </Reveal>
        </div>

        {/* Capillary rise demo + full results table */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal>
            <div className="rounded-2xl border border-hex-line bg-hex-panel p-6">
              <div className="font-display text-sm font-bold text-white">
                Capillary rise, driven by scroll
              </div>
              <p className="mt-1 text-xs text-hex-muted2">
                The water level below climbs as you scroll, synced to the measured mean rise.
              </p>
              <div className="mt-6">
                <CapillaryRiseDemo
                  maxRise={14.7}
                  capacity={dropTests.stats.capacity}
                  width={0.48}
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="overflow-hidden rounded-2xl border border-hex-line bg-hex-panel">
              <div className="border-b border-hex-line px-5 py-3 font-display text-sm font-bold text-white">
                Full results
              </div>
              <dl className="divide-y divide-hex-line">
                {RESULTS_TABLE.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[1fr_auto] gap-4 px-5 py-3 sm:grid-cols-[1.4fr_1fr_auto]"
                  >
                    <dt className="text-sm text-hex-muted">{row.label}</dt>
                    <dd className="text-right font-display text-sm font-bold text-white sm:order-last sm:text-left">
                      {row.value}
                    </dd>
                    {row.note && (
                      <dd className="hidden text-xs text-hex-muted2 sm:block sm:text-right">
                        {row.note}
                      </dd>
                    )}
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── How we tested ──────────────────────────────────────────────── */}
      <Section
        id="how-we-tested"
        eyebrow="How we tested"
        title="The local drop rig"
      >
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-5">
            {methodologyParagraphs.map((p, i) => (
              <Reveal key={i} delay={Math.min(i + 1, 6)}>
                <p className="text-base leading-relaxed text-hex-muted">{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={1}>
            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-hex-line bg-hex-panel p-6">
              {[
                { k: 'Drop height', v: dropTests.stats.dropHeight, note: dropTests.stats.dropHeightMeters },
                { k: 'Free-fall', v: dropTests.stats.freeFall, note: 'per local drop' },
                { k: 'Water volume', v: dropTests.stats.waterVolume, note: 'dyed, per drop' },
                { k: 'Channel width', v: dropTests.stats.channelWidth, note: '0.020 in gap' },
                { k: 'Baseline suites', v: dropTests.stats.drops, note: '6 drops, then 9' },
                { k: 'Glenn window', v: dropTests.stats.glennWindow, note: dropTests.facility },
              ].map((row) => (
                <div key={row.k}>
                  <div className="text-[0.7rem] uppercase tracking-[0.12em] text-hex-muted2">
                    {row.k}
                  </div>
                  <div className="mt-1 font-display text-sm font-bold text-hex-gold">{row.v}</div>
                  {row.note && <div className="mt-0.5 text-xs text-hex-muted2">{row.note}</div>}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Footage + photos ───────────────────────────────────────────── */}
      <Section
        id="footage"
        eyebrow="Footage"
        title="Drop test footage and photos"
      >
        <Reveal>
          <p className="mt-8 max-w-3xl text-base leading-relaxed text-hex-muted">
            {dropTests.video.caption}
          </p>
        </Reveal>
        <Reveal delay={1} className="mt-8">
          <div className="overflow-hidden rounded-2xl border border-hex-line bg-hex-panel">
            <video
              src={withBase(dropTests.video.src)}
              poster={withBase(dropTests.video.poster)}
              controls
              preload="metadata"
              className="w-full"
            />
          </div>
        </Reveal>

        <Reveal delay={1} className="mt-10">
          <PhotoGallery
            images={dropTests.photos.map((p) => ({
              src: withBase(p.src),
              alt: p.caption,
            }))}
            columns={3}
          />
        </Reveal>
        <Reveal delay={2}>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {dropTests.photos.map((p) => (
              <div key={p.src} className="text-xs text-hex-muted2">
                {p.caption}
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ── Footnote + data note ───────────────────────────────────────── */}
      <Section id="notes" eyebrow="Notes" title="What we can and cannot say">
        <Reveal>
          <div className="mt-8 rounded-2xl border border-hex-gold/20 bg-hex-gold/5 p-6">
            <p className="text-base leading-relaxed text-hex-muted">{dropTests.footnote}</p>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <div className="mt-5 rounded-2xl border border-hex-line bg-hex-panel p-6">
            <div className="font-display text-sm font-bold text-white">Data note</div>
            <p className="mt-2 text-sm leading-relaxed text-hex-muted">{dropTests.dataNote}</p>
          </div>
        </Reveal>
      </Section>
    </>
  )
}