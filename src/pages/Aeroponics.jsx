import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Section from '../components/Section.jsx'
import Reveal from '../components/Reveal.jsx'
import KineticText from '../components/KineticText.jsx'
import StatCounter from '../components/StatCounter.jsx'
import PartViewerSlot from '../components/threed/PartViewerSlot.jsx'
import PhotoGallery from '../components/Lightbox.jsx'
import { useReducedMotion } from '../lib/useReducedMotion.js'
import { pumpSpecs } from '../data/bom.js'
import { parts } from '../data/parts.js'

gsap.registerPlugin(ScrollTrigger)

const alternatives = [
  {
    name: 'Ebb-and-Flow',
    spec: 'Flood 15 min every 2 to 3 h, dual reservoir',
    why: 'Rejected for added complexity versus medium-free aeroponics.',
  },
  {
    name: 'Wick System (CapMat II)',
    spec: '1.0 mm mat, 8.0 cm capillary lift, the Apogee dwarf-wheat ISS approach',
    why: 'Rejected because the retained medium stays wet and invites root rot.',
  },
  {
    name: 'Arcillite / Illite',
    spec: 'Granular substrate media',
    why: 'Rejected because the medium holds moisture against the roots.',
  },
  {
    name: 'Hex System w/ Plant Hook',
    spec: 'Hex-channel mechanical support',
    why: 'Rejected because aeroponics won on simplicity.',
  },
]

const benefits = [
  {
    stat: 'Dry Roots',
    label: 'Triggered Watering',
    desc: 'AI vision waters only when roots are dry, minimizing water loss and eliminating root rot.',
  },
  {
    stat: 'Suspended',
    label: 'Root System',
    desc: 'Roots hang in air with maximum oxygen exposure.',
  },
  {
    stat: 'Accelerated',
    label: 'Growth Rate',
    desc: 'Enhanced atmospheric gas exposure to O2 and CO2.',
  },
  {
    stat: 'None',
    label: 'Gravity Required',
    desc: 'The system works in microgravity environments.',
  },
]

const spacePrograms = [
  {
    org: 'China',
    program: 'Lunar Farming Program',
    desc: 'Integrated aeroponics into lunar agriculture experiments, demonstrating the method viability in space environments.',
  },
  {
    org: 'Sierra Space',
    program: 'Astro Garden (XROOTS)',
    desc: 'eXposed Root On-Orbit Test System, developing aeroponic cultivation for long-duration spaceflight.',
  },
]

const aeroponicsPhotos = [
  { src: '/images/aeroponics-1.jpg', alt: 'Plant clips securing kale in the TDC' },
  { src: '/images/aeroponics-2.jpg', alt: 'Aeroponic root system' },
  { src: '/images/aeroponics-3.jpg', alt: 'Reservoir and VEX fittings' },
  { src: '/images/aeroponics-4.jpg', alt: 'Inversion test with kale fully retained' },
]

const waterParts = parts.filter((p) => p.subsystem === 'Water')

// Scroll-scrubbed SVG diagram of the aeroponic water delivery path:
// Reservoir -> Pump -> Injector nozzle -> TDC hex channels -> Root zone.
function WaterPathDiagram() {
  const wrapRef = useRef(null)
  const tubeRef = useRef(null)
  const hexWaterRef = useRef(null)
  const mistRef = useRef(null)
  const stageLabelRef = useRef(null)
  const reduced = useReducedMotion()

  const stages = [
    'Reservoir',
    'Pump active',
    'Injector nozzle',
    'TDC capillary channels',
    'Root zone misted',
  ]

  useEffect(() => {
    const wrap = wrapRef.current
    const tube = tubeRef.current
    const hexWater = hexWaterRef.current
    const mist = mistRef.current
    const stageLabel = stageLabelRef.current
    if (!wrap || !tube) return

    if (reduced) {
      tube.style.strokeDashoffset = '0'
      if (hexWater) hexWater.setAttribute('y', '115')
      if (mist) mist.style.opacity = '1'
      if (stageLabel) stageLabel.textContent = stages[4]
      return
    }

    const tubeLen = tube.getTotalLength()
    tube.style.strokeDasharray = String(tubeLen)
    tube.style.strokeDashoffset = String(tubeLen)

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress
        // Tube water flows upward: 0.05 to 0.45
        const tubeP = Math.max(0, Math.min(1, (p - 0.05) / 0.4))
        tube.style.strokeDashoffset = String(tubeLen * (1 - tubeP))
        // Hex channels fill via capillary action: 0.30 to 0.70
        const hexP = Math.max(0, Math.min(1, (p - 0.3) / 0.4))
        if (hexWater) hexWater.setAttribute('y', String(265 - hexP * 150))
        // Mist appears at roots: 0.65 to 1.0
        const mistP = Math.max(0, Math.min(1, (p - 0.6) / 0.35))
        if (mist) mist.style.opacity = String(mistP)
        // Stage label
        const idx = p < 0.15 ? 0 : p < 0.4 ? 1 : p < 0.6 ? 2 : p < 0.82 ? 3 : 4
        if (stageLabel) stageLabel.textContent = stages[idx]
      },
    })
    return () => st.kill()
  }, [reduced])

  return (
    <div ref={wrapRef} className="relative" style={{ minHeight: '180vh' }}>
      <div className="sticky top-20 flex h-[calc(100vh-5rem)] flex-col items-center justify-center">
        <svg
          viewBox="0 0 340 560"
          className="h-auto w-auto"
          style={{ maxHeight: '72vh' }}
          aria-label="Aeroponic water delivery path from reservoir through pump and injector into TDC hex channels to the root zone"
        >
          <defs>
            <linearGradient id="apWater" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="apRes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.75" />
            </linearGradient>
            <clipPath id="apHex">
              <path d="M 170 115 L 240 150 L 240 230 L 170 265 L 100 230 L 100 150 Z" />
            </clipPath>
          </defs>

          {/* Root zone */}
          <g>
            <text
              x="170"
              y="14"
              textAnchor="middle"
              fill="#86efac"
              fontSize="9"
              fontFamily="Inter, sans-serif"
              fontWeight="600"
              letterSpacing="1"
            >
              ROOT ZONE
            </text>
            <path d="M 140 24 Q 135 50 138 80 Q 140 100 135 110" fill="none" stroke="#86efac" strokeWidth="2" opacity="0.6" />
            <path d="M 170 24 Q 175 45 168 70 Q 165 95 172 110" fill="none" stroke="#86efac" strokeWidth="2" opacity="0.6" />
            <path d="M 200 24 Q 195 50 202 80 Q 205 100 198 110" fill="none" stroke="#86efac" strokeWidth="2" opacity="0.6" />
            <g ref={mistRef} style={{ opacity: 0 }}>
              <circle cx="148" cy="55" r="3" fill="#7dd3fc" opacity="0.8" />
              <circle cx="178" cy="72" r="2.5" fill="#7dd3fc" opacity="0.7" />
              <circle cx="162" cy="88" r="2" fill="#7dd3fc" opacity="0.6" />
              <circle cx="195" cy="60" r="2" fill="#7dd3fc" opacity="0.7" />
              <circle cx="155" cy="100" r="2.5" fill="#7dd3fc" opacity="0.6" />
              <circle cx="188" cy="92" r="1.8" fill="#7dd3fc" opacity="0.5" />
            </g>
          </g>

          {/* TDC hex channels */}
          <g>
            <path
              d="M 170 115 L 240 150 L 240 230 L 170 265 L 100 230 L 100 150 Z"
              fill="rgba(212,160,23,0.04)"
              stroke="#d4a017"
              strokeWidth="2"
              opacity="0.65"
            />
            <g stroke="#d4a017" strokeWidth="0.5" opacity="0.25">
              <line x1="100" y1="180" x2="240" y2="180" />
              <line x1="100" y1="210" x2="240" y2="210" />
              <line x1="130" y1="150" x2="130" y2="265" />
              <line x1="170" y1="150" x2="170" y2="265" />
              <line x1="210" y1="150" x2="210" y2="265" />
            </g>
            <g clipPath="url(#apHex)">
              <rect ref={hexWaterRef} x="95" y="265" width="150" height="160" fill="url(#apWater)" opacity="0.7" />
            </g>
            <text x="170" y="194" textAnchor="middle" fill="#e2e8f0" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="500">
              TDC Hex Channels
            </text>
            <text x="170" y="206" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="Inter, sans-serif">
              0.48 mm capillary
            </text>
          </g>

          {/* Injector nozzle */}
          <g>
            <path d="M 158 268 L 182 268 L 174 300 L 166 300 Z" fill="rgba(212,160,23,0.1)" stroke="#d4a017" strokeWidth="1.5" />
            <rect x="164" y="300" width="12" height="18" rx="2" fill="rgba(212,160,23,0.06)" stroke="#d4a017" strokeWidth="1" />
            <text x="228" y="293" fill="#94a3b8" fontSize="8" fontFamily="Inter, sans-serif">
              Injector
            </text>
          </g>

          {/* Tube (injector to pump) static outline */}
          <rect x="165" y="318" width="10" height="70" rx="5" fill="rgba(212,160,23,0.04)" stroke="#d4a017" strokeWidth="1" opacity="0.35" />

          {/* Animated water path (reservoir up through pump to injector) */}
          <path
            ref={tubeRef}
            d="M 170 460 L 170 320"
            fill="none"
            stroke="url(#apWater)"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Pump */}
          <g>
            <circle cx="170" cy="405" r="26" fill="rgba(212,160,23,0.08)" stroke="#d4a017" strokeWidth="1.5" />
            <circle cx="170" cy="405" r="14" fill="none" stroke="#d4a017" strokeWidth="1" opacity="0.4" />
            <text x="170" y="410" textAnchor="middle" fill="#d4a017" fontSize="13" fontFamily="'Space Grotesk', sans-serif" fontWeight="700">
              P
            </text>
            <text x="228" y="408" fill="#94a3b8" fontSize="8" fontFamily="Inter, sans-serif">
              Pump
            </text>
          </g>

          {/* Tube (pump to reservoir) static outline */}
          <rect x="165" y="431" width="10" height="30" rx="5" fill="rgba(212,160,23,0.04)" stroke="#d4a017" strokeWidth="1" opacity="0.35" />

          {/* Reservoir */}
          <g>
            <rect x="108" y="461" width="124" height="72" rx="14" fill="rgba(212,160,23,0.06)" stroke="#d4a017" strokeWidth="1.5" />
            <rect x="114" y="478" width="112" height="48" rx="10" fill="url(#apRes)" opacity="0.65" />
            <text x="170" y="506" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="600">
              50 mL Reservoir
            </text>
            <text x="170" y="518" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="Inter, sans-serif">
              VEX fittings, heat-sealed
            </text>
          </g>

          {/* Flow direction indicator */}
          <g opacity="0.4">
            <path d="M 268 400 L 268 325 M 263 330 L 268 325 L 273 330" fill="none" stroke="#d4a017" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <text x="278" y="365" fill="#64748b" fontSize="7" fontFamily="Inter, sans-serif" transform="rotate(-90 278 365)">
              flow
            </text>
          </g>
        </svg>

        <div className="mt-6 text-center">
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-hex-muted">Water delivery stage</div>
          <div ref={stageLabelRef} className="mt-1 font-display text-lg font-bold text-hex-gold">
            Reservoir
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Aeroponics() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-20 pb-12 sm:pt-28">
        <Reveal>
          <div className="mb-4 inline-block rounded-full border border-hex-gold/40 bg-hex-gold/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-hex-gold">
            Biology
          </div>
        </Reveal>
        <KineticText
          as="h1"
          text="Aeroponics"
          split="word"
          className="font-display text-5xl font-bold text-white sm:text-7xl"
        />
        <Reveal delay={1}>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
            Plants suspended in air, roots drinking directly from the hexagonal channel system. Aeroponics is the Nanolab's primary growing method, chosen because there is no growing medium to stay wet, so no root rot.
          </p>
        </Reveal>
      </section>

      {/* Why Aeroponic */}
      <Section id="why-aeroponic" eyebrow="The Pivot" title="Why Aeroponic Over Hydroponic">
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <Reveal>
              <p className="leading-relaxed text-slate-300">
                The team tested eight substrate materials in October. Nearly all of them grew mould; only pine bark produced any growth at all. On 22 October the team abandoned growing media entirely and went aeroponic. The pivot was driven by a simple insight: with no growing medium, there is nothing to stay wet, and with nothing staying wet, there is no root rot.
              </p>
            </Reveal>
            <Reveal delay={1}>
              <p className="leading-relaxed text-slate-300">
                In microgravity, plants grow on the TDC Delivery System with roots absorbing water directly from the channel system, sidestepping the complications of substrate-water interaction in zero gravity. The AI vision model reads root moisture from the camera feed and waters only when the roots are dry, a continuous feedback loop that <strong className="text-white">completely eliminates root rot</strong>.
              </p>
            </Reveal>
            <Reveal delay={2}>
              <p className="leading-relaxed text-slate-300">
                The root-zone oxygen rationale is straightforward. In aeroponics, roots hang suspended in air rather than buried in a wet medium. That gives them maximum atmospheric gas exposure to both O2 and CO2, accelerating growth compared to roots starved of oxygen in waterlogged substrate.
              </p>
            </Reveal>
          </div>

          <div className="space-y-6">
            <Reveal delay={1}>
              <StatCounter
                value={98}
                suffix="%"
                label="Water savings vs. traditional growing"
                note="LettUs Grow aeroponic efficiency data"
              />
            </Reveal>
            <Reveal delay={2}>
              <div className="rounded-2xl border border-hex-line bg-hex-panel p-6">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-hex-gold">
                  Root-Zone Oxygen
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Roots hang in air with maximum oxygen exposure. Enhanced atmospheric gas exchange (O2 and CO2) drives accelerated growth compared to medium-bound roots that are starved of oxygen in waterlogged substrate.
                </p>
              </div>
            </Reveal>
            <Reveal delay={3}>
              <div className="rounded-2xl border border-hex-line bg-hex-panel p-6">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-hex-gold">
                  Modular Reservoir
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  The customizable water and nutrient reservoir is built from recycled plastic, VEX fittings, and heat-sealed seams. A modular design that scales across HexaFlow configurations and future expansion.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Alternatives considered */}
        <Reveal>
          <h3 className="mt-16 mb-6 font-display text-xl font-bold text-white">
            Alternatives Considered, and Rejected
          </h3>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {alternatives.map((a, i) => (
            <Reveal key={a.name} delay={i + 1}>
              <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-5">
                <h4 className="font-display text-sm font-bold text-hex-gold">{a.name}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{a.spec}</p>
                <p className="mt-3 text-xs leading-relaxed text-hex-muted2">{a.why}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* How It Mists */}
      <Section id="how-it-mists" eyebrow="Water Delivery" title="How It Mists">
        <Reveal>
          <p className="mt-8 max-w-3xl leading-relaxed text-slate-300">
            Water travels a precise path from the reservoir, through the pump, into the injector nozzle, and up through the TDC hex channels by capillary action. Roots drink directly from the channel walls. Scroll through the diagram to follow the water from reservoir to root zone.
          </p>
        </Reveal>

        <WaterPathDiagram />

        {/* Benefits */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <Reveal key={b.label} delay={i + 1}>
              <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-5">
                <div className="font-display text-2xl font-bold text-hex-gold">{b.stat}</div>
                <div className="mt-1 text-sm font-semibold text-white">{b.label}</div>
                <p className="mt-2 text-xs leading-relaxed text-hex-muted2">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* AI vision + plant clips */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-hex-gold/30 bg-hex-gold/5 p-6">
              <h3 className="font-display text-lg font-bold text-white">AI-Driven Watering</h3>
              <p className="mt-3 leading-relaxed text-slate-300">
                The locally-running AI model observes plant roots via camera and dispenses water incrementally, verifying adequate hydration before stopping the pump. The vision model reads moisture straight from the camera feed and drives the pump accordingly, closing a continuous feedback loop that prevents both overwatering and underwatering.
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-6">
              <h3 className="font-display text-lg font-bold text-white">Plant Clips and the Inversion Test</h3>
              <p className="mt-3 leading-relaxed text-slate-300">
                Plant clips secure vegetation both on Earth and in space. Inserted into TDC holes, they grip the stem firmly enough that the team verified retention by inverting the TDC with kale threaded through both clips for one full minute. The plants stayed put.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Pump Specs */}
      <Section id="pump-specs" eyebrow="Dual Configuration" title="Pump Specifications">
        <Reveal>
          <p className="mt-8 max-w-3xl leading-relaxed text-slate-300">
            One enclosure supports two pump configurations. The drop-test build runs a high-capacity pump to flood the channels during the microgravity window. The long-term build swaps in a precision pump that saves power and fine-tunes delivery under AI control.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Drop-test pump */}
          <Reveal>
            <div className="h-full rounded-2xl border border-hex-gold/30 bg-hex-panel p-6">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
                Drop Test Mode
              </div>
              <h3 className="mt-2 font-display text-xl font-bold text-white">High-Capacity Pump</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
                <li>
                  Rate: <strong className="text-white">{pumpSpecs.dropTest.rate}</strong>
                </li>
                <li>
                  Speed: <strong className="text-white">{pumpSpecs.dropTest.rpm}</strong>
                </li>
                <li>
                  Target: <strong className="text-white">approximately 8.63 mL</strong> over the test window
                  <span className="mt-1 block text-xs text-hex-muted2">
                    Originally sized for 5.18 s. Actual facility is the NASA Glenn 2.2-Second Drop Tower.
                  </span>
                </li>
                <li>AI disengages during the drop window for constant pumping over a user-defined duration.</li>
                <li>Maximizes channel fill during the microgravity event.</li>
              </ul>
            </div>
          </Reveal>

          {/* Long-term pump */}
          <Reveal delay={1}>
            <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-6">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
                Long-Term Mode
              </div>
              <h3 className="mt-2 font-display text-xl font-bold text-white">Precision Pump</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
                <li>
                  Rate: <strong className="text-white">{pumpSpecs.longTerm.rate}</strong>
                </li>
                <li>
                  Power savings: <strong className="text-white">{pumpSpecs.longTerm.savings}</strong>
                </li>
                <li>AI vision actively monitors root moisture.</li>
                <li>Fine-grained control over water delivery.</li>
                <li>Adaptive data collection and imaging protocols.</li>
                <li>TDS and pH sensors active.</li>
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={2}>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-hex-muted">
            The pump sizing target of approximately 8.63 mL was originally calculated for a 5.18-second drop window. The actual NASA Glenn facility HexaFlow tested at is the 2.2-Second Drop Tower in Ohio, a separate and smaller facility from the 5.18-second Zero Gravity Research Facility. The 8.63 mL figure is retained as the designed pump target; the drop window correction is noted here for accuracy.
          </p>
        </Reveal>
      </Section>

      {/* Water-Subsystem Parts */}
      <Section id="water-parts" eyebrow="Hardware" title="Water-Subsystem Parts">
        <Reveal>
          <p className="mt-8 max-w-3xl leading-relaxed text-slate-300">
            Two parts make up the water subsystem: the Water Injector, which provides precise water entry into the capillary channel network at the system base, and the Pump Adapter, which lets one enclosure accept both the drop-test and long-term pumps.
          </p>
        </Reveal>

        <div className="mt-12 space-y-20">
          {waterParts.map((part) => (
            <Reveal key={part.id}>
              <PartViewerSlot part={part} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Build & Verification */}
      <Section id="build-verification" eyebrow="Testing" title="Build and Verification">
        <Reveal>
          <p className="mt-8 max-w-3xl leading-relaxed text-slate-300">
            The aeroponic system was verified through plant-clip retention trials and root inspection. Kale secured in the TDC withstood a full-minute inversion. The customizable water and nutrient reservoir is built from recycled plastic, VEX fittings, and heat-sealed seams, a modular design that scales across HexaFlow configurations.
          </p>
        </Reveal>
        <Reveal delay={1}>
          <div className="mt-8">
            <PhotoGallery images={aeroponicsPhotos} columns={4} />
          </div>
        </Reveal>
      </Section>

      {/* Suitable Crops */}
      <Section id="crops" eyebrow="Biology" title="Suitable Crops">
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-6">
              <h3 className="font-display text-lg font-bold text-hex-gold">Suitable</h3>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-300">
                <li>Leafy greens</li>
                <li>Vegetables</li>
                <li>Small flowering plants</li>
                <li>Kale, verified in plant-clip retention trials</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="h-full rounded-2xl border border-red-400/20 bg-hex-panel p-6">
              <h3 className="font-display text-lg font-bold text-red-400">Not Suitable</h3>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-300">
                <li>Root vegetables, which grow deformed without soil pressure</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Space Programs */}
      <Section id="space-programs" eyebrow="Precedent" title="Space Aeroponics Programs">
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {spacePrograms.map((p, i) => (
            <Reveal key={p.program} delay={i + 1}>
              <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-6">
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
                  {p.org}
                </div>
                <h3 className="mt-2 font-display text-lg font-bold text-white">{p.program}</h3>
                <p className="mt-3 text-sm leading-relaxed text-hex-muted2">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Works Cited */}
      <Section id="works-cited" eyebrow="References" title="Works Cited">
        <Reveal>
          <div className="mt-8 rounded-2xl border border-hex-gold/15 bg-hex-gold/5 p-6">
            <p className="text-sm leading-relaxed text-hex-muted">
              LettUs Grow · Atlas Scientific · Food Gardening Network · NASA Science · Agrotonomy · NoSoilSolutions · Greenhouse Canada · NASA XROOTS Program Documentation
            </p>
          </div>
        </Reveal>
      </Section>
    </>
  )
}