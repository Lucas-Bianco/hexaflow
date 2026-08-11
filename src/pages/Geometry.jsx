import KineticText from '../components/KineticText.jsx'
import Reveal from '../components/Reveal.jsx'
import Section from '../components/Section.jsx'
import StatCounter from '../components/StatCounter.jsx'
import PhotoGallery from '../components/Lightbox.jsx'
import CapillaryRiseDemo from '../components/scroll/CapillaryRiseDemo.jsx'
import PartViewerSlot from '../components/threed/PartViewerSlot.jsx'
import { withBase } from '../lib/withBase.js'
import { parts } from '../data/parts.js'

// The core Thorny Devil Capillary assembly. modelFile is null, so PartViewerSlot
// renders the styled "model file coming soon" placeholder with its CAD image.
const tdcPart = parts.find((p) => p.id === 'tdc-assembly-v2')

// Real public photo (Wikimedia Commons) of the thorny devil lizard. withBase
// passes http URLs through untouched.
const thornyDevilPhoto =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Thorny_dragon.jpg/640px-Thorny_dragon.jpg'

const channelSpecs = [
  { label: 'Side-to-side', value: '0.167 in / 4.24 mm' },
  { label: 'Side length', value: '0.100 in / 2.54 mm' },
  { label: 'Channel depth', value: '0.050 in / 1.27 mm' },
  { label: 'Channel width', value: '0.48 mm' },
  { label: 'Gap between channels', value: '0.51 mm / 0.020 in' },
]

const techSpecs = [
  {
    label: 'Channel Capacity',
    value: '10.12 mL',
    desc: 'Precisely 10.1155 mL when fully saturated. About 10 min at the 1 mL/min long-term pump rate to saturate.',
  },
  {
    label: 'Hex Spacing',
    value: '0.51 mm',
    desc: '0.020 in gap between channels with a 0.48 mm channel width for optimal capillary distribution.',
  },
  {
    label: 'Side-to-Side',
    value: '0.167 in',
    desc: '4.24 mm hex span with a 0.100 in (2.54 mm) side length.',
  },
  {
    label: 'Channel Depth',
    value: '0.050 in',
    desc: '1.27 mm etched channel depth across the dome.',
  },
  {
    label: 'Manufacturing',
    value: 'SLA Resin Dome',
    desc: 'Polar resin hex dome on an FDM body. Only the critical dome is SLA-printed.',
  },
  {
    label: 'Surface Property',
    value: 'Polar Resin',
    desc: 'Stronger water adhesion than water-to-water cohesion is what drives the capillary flow.',
  },
  {
    label: 'Gravity Required',
    value: 'None',
    desc: 'Capillary action works in microgravity environments, which is the whole point.',
  },
  {
    label: 'Inversion Test',
    value: 'Passes',
    desc: 'The system retains water at proper scale even when fully inverted.',
  },
]

const hexRationale = [
  {
    k: '01',
    title: 'Tessellation with no gaps',
    body: 'Hexagons tile a plane completely, unlike circles or squares packed on a grid. Every wall is a shared channel, so no resin is wasted on dead material between cells.',
  },
  {
    k: '02',
    title: 'Shortest wall per area',
    body: 'Of all shapes that tessellate, the hexagon has the least perimeter for a given area. Less channel wall means more water contact per unit of resin, maximizing capillary force for a fixed print volume.',
  },
  {
    k: '03',
    title: 'Isotropic distribution',
    body: 'A hex lattice spreads water equally in six directions across the dome. A square grid would favor two axes and leave corners dry. The hex matches the radial symmetry of a water droplet hitting the center.',
  },
  {
    k: '04',
    title: 'Matched to the biology',
    body: 'The thorny devil itself uses honeycomb-scale geometry, so the capillary physics transfer directly from lizard skin to the printed dome. The copy is literal, not metaphorical.',
  },
]

function SpecCard({ label, value, desc }) {
  return (
    <Reveal>
      <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-5">
        <div className="text-xs uppercase tracking-[0.08em] text-hex-muted2">{label}</div>
        <div className="mt-1 font-display text-xl font-bold text-hex-gold">{value}</div>
        {desc && <p className="mt-2 text-sm leading-relaxed text-hex-muted2">{desc}</p>}
      </div>
    </Reveal>
  )
}

export default function Geometry() {
  return (
    <div className="bg-hex-bg">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-32 pb-16">
        <Reveal>
          <div className="mb-4 inline-block rounded-full border border-hex-line bg-hex-gold/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-hex-gold/80">
            Design
          </div>
        </Reveal>
        <KineticText
          text="Biomimicry & Geometry"
          as="h1"
          className="font-display text-4xl font-bold leading-[1.05] text-white sm:text-6xl"
        />
        <Reveal delay={2}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-hex-muted">
            The unique geometry of our water delivery system efficiently utilizes capillary action
            and its amplified uses in microgravity. The channels take their cue from a lizard that
            moves water across its skin with no pump at all.
          </p>
        </Reveal>
      </section>

      {/* ── Biomimicry: the thorny devil story ───────────────────────────── */}
      <Section id="biomimicry" eyebrow="Biomimicry" title="Inspired by the Thorny Devil Lizard">
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-2">
          <div className="space-y-5 leading-relaxed text-slate-300">
            <Reveal>
              <p>
                The HexaFlow water delivery system draws from the <em className="text-white">Moloch
                horridus</em>, the thorny devil lizard, which uses capillary action to transport
                water through microscopic grooved patterns on its skin. The honeycomb-like
                geometry of its scales passively moves water from any surface contact point
                directly to its mouth, with no muscular effort.
              </p>
            </Reveal>
            <Reveal delay={1}>
              <p>
                The discovery came from Sabrina, who found the thorny devil on{' '}
                <span className="text-white">asknature.org</span> while the team was reconsidering
                hydroponics. Its grooved skin moves water by capillary action, against gravity, with
                no pump. That single observation rerouted the whole project toward a passive hex
                channel lattice.
              </p>
            </Reveal>
            <Reveal delay={2}>
              <p>
                HexaFlow replicates this hexagonal channel geometry at a functional scale using SLA
                3D printing with resin. Resin is a polar material, so it bonds to water more
                strongly than water bonds to itself. That stronger adhesion is what drives
                efficient capillary transport through the hex network, and it lets the system hold
                water even when fully inverted.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <p>
                Only the critical hex dome is SLA-printed in resin. The body is FDM, keeping cost and
                weight down where the polar adhesion is not load-bearing.
              </p>
            </Reveal>
          </div>

          {/* Thorny devil photo + caption */}
          <Reveal delay={2}>
            <figure className="overflow-hidden rounded-2xl border border-hex-gold/15 bg-hex-panel">
              <img
                src={thornyDevilPhoto}
                alt="Thorny devil lizard (Moloch horridus), the biological inspiration for HexaFlow's hex channel geometry"
                loading="lazy"
                className="w-full object-cover"
              />
              <figcaption className="bg-hex-panel px-4 py-3 text-sm text-hex-muted2">
                <em className="text-hex-muted">Moloch horridus</em>, the thorny devil lizard. Its
                skin channels passively transport water via capillary action.
                <span className="text-hex-muted2"> (Image: Wikimedia Commons)</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Section>

      {/* ── Capillary rise: live scroll-driven demo ──────────────────────── */}
      <Section
        id="capillary-rise"
        eyebrow="Capillary Physics"
        title="Water That Climbs in Free Fall"
      >
        <Reveal>
          <p className="mt-6 max-w-2xl leading-relaxed text-slate-300">
            Scroll the page and the water rises. The demo below is scrubbed by your scroll
            position, synced to the real measured numbers from the test rig: a 14.7 mm mean rise
            across nine free-fall drops, a 10.12 mL saturated channel capacity, and a 0.48 mm
            channel width. No pump, no gravity required.
          </p>
        </Reveal>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
          <Reveal delay={1}>
            <CapillaryRiseDemo maxRise={14.7} capacity="10.12 mL" width={0.48} />
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            <Reveal delay={1}>
              <StatCounter
                value={14.7}
                dp={1}
                suffix=" mm"
                label="Mean Capillary Rise"
                note="measured, 9 drops"
              />
            </Reveal>
            <Reveal delay={2}>
              <StatCounter
                value={10.12}
                dp={2}
                suffix=" mL"
                label="Channel Capacity"
                note="fully saturated"
              />
            </Reveal>
            <Reveal delay={3}>
              <StatCounter
                value={0.48}
                dp={2}
                suffix=" mm"
                label="Channel Width"
                note="0.020 in gap"
              />
            </Reveal>
            <Reveal delay={4}>
              <StatCounter value={9} dp={0} suffix="" label="Free-Fall Drop Tests" note="Suite B" />
            </Reveal>
          </div>
        </div>

        <Reveal>
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-hex-muted2">
            Total channel capacity is 10.12 mL (precisely 10.1155 mL) when fully saturated, roughly
            10 minutes of constant flow at the 1 mL/min long-term pump rate to saturate. The
            drop-test pump runs at about 100 mL/min, moving 8.63 mL through the 5.18 s test window.
          </p>
        </Reveal>
      </Section>

      {/* ── Hex geometry: why hexagons ──────────────────────────────────── */}
      <Section id="hex-geometry" eyebrow="Hex Geometry" title="Why Hexagons">
        <Reveal>
          <p className="mt-6 max-w-2xl leading-relaxed text-slate-300">
            The thorny devil's scales are a honeycomb, and the team copied that geometry literally.
            Hexagons are not an aesthetic choice. They are the shape that tiles a surface with the
            least wall for the most interior, which is exactly what a capillary channel wants. At
            NASA's Preliminary Design Review the reviewer called the hexagonal shape and
            thorny-devil method "terrific." Peer teams warned that wicking may not behave the same
            way in microgravity, a note that shaped the next six months of testing.
          </p>
        </Reveal>

        {/* Scroll-revealed rationale cards */}
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {hexRationale.map((r) => (
            <Reveal key={r.k} delay={Math.min(Number(r.k), 6)}>
              <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-6">
                <div className="font-display text-sm font-bold text-hex-gold/60">{r.k}</div>
                <h3 className="mt-2 font-display text-lg font-bold text-white">{r.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-hex-muted">{r.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Channel geometry spec block */}
        <Reveal>
          <div className="mt-12 rounded-2xl border border-hex-line bg-hex-panel p-6">
            <div className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
              Channel Geometry
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {channelSpecs.map((s) => (
                <div key={s.label}>
                  <div className="text-[0.7rem] uppercase tracking-[0.08em] text-hex-muted2">
                    {s.label}
                  </div>
                  <div className="mt-1 font-display text-base font-bold text-hex-gold">
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-hex-muted">
              The channels space hexagons 0.51 mm (0.020 in) apart with a channel width of 0.48 mm
              to optimize capillary distribution. The polar adhesion of the resin, stronger than
              water-to-water cohesion, is what holds the water in the channels when the dome is
              inverted.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* ── The TDC: from lizard to printed part ─────────────────────────── */}
      <Section id="the-tdc" eyebrow="The TDC" title="From a Lizard to a Printed Part">
        <Reveal>
          <p className="mt-6 max-w-2xl leading-relaxed text-slate-300">
            After the pivot on 22 October 2025, Nate prototyped the{' '}
            <span className="text-white">"Moloch Horridus Water System"</span> in SolidWorks in two
            sizes. It worked, in his words, "miraculously well," so the team renamed the core the
            TDC, short for Thorny-Devil Capillary. The two-size prototype became the V2 assembly
            that now sits inside the nanolab: a resin hex dome on a 3D-printed frame, with channels
            0.48 mm across and spaced 0.51 mm apart.
          </p>
        </Reveal>

        <div className="mt-14">
          <PartViewerSlot part={tdcPart} />
        </div>

        {/* TDC photos */}
        <Reveal>
          <div className="mt-12">
            <div className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
              The Channels in Print
            </div>
            <PhotoGallery
              images={[
                {
                  src: withBase('/images/geometry-1.jpg'),
                  alt: 'TDC hex channel top-down view',
                },
                {
                  src: withBase('/images/geometry-2.jpg'),
                  alt: 'TDC capillary channel close-up',
                },
              ]}
              columns={2}
            />
          </div>
        </Reveal>

        {/* Technical specifications grid */}
        <div className="mt-16">
          <Reveal>
            <h3 className="font-display text-2xl font-bold text-white">Technical Specifications</h3>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {techSpecs.map((s) => (
              <SpecCard key={s.label} label={s.label} value={s.value} desc={s.desc} />
            ))}
          </div>
        </div>

        {/* Source */}
        <Reveal>
          <div className="mt-12 rounded-xl border border-hex-gold/12 bg-hex-gold/[0.04] p-5">
            <p className="text-sm leading-relaxed text-hex-muted2">
              <span className="font-medium text-hex-muted">Source:</span> Skin morphology study of{' '}
              <em className="text-hex-muted">Moloch horridus</em> via ResearchGate, and capillary
              channel geometry and polar adhesion principles adapted for SLA resin fabrication.
              Additional reference from asknature.org, where the thorny devil was first identified
              as a biomimicry candidate.
            </p>
          </div>
        </Reveal>
      </Section>
    </div>
  )
}