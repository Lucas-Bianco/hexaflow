import Section from '../components/Section.jsx'
import Reveal from '../components/Reveal.jsx'
import KineticText from '../components/KineticText.jsx'
import StatCounter from '../components/StatCounter.jsx'
import PhotoGallery from '../components/Lightbox.jsx'
import PartViewerSlot from '../components/threed/PartViewerSlot.jsx'
import { withBase } from '../lib/withBase.js'
import { carrierBoardFeatures, pumpSpecs } from '../data/bom.js'
import { parts } from '../data/parts.js'

// Sensor selection rationale. Pulled from bom.js notes so every fact is
// preserved (BME680 over BME280/CCS811, capacitive over resistive, Atlas
// over Arduino Gravity, the 153 mm vs 47 mm geometry problem, TDS, ADS1115,
// BS170, NeoPixel).
const sensorCards = [
  {
    pick: 'BME680',
    role: 'Temperature, humidity, VOC',
    over: 'BME280 / CCS811',
    why: 'Chosen for simplicity.',
  },
  {
    pick: 'Adafruit 4026',
    role: 'Capacitive moisture probe',
    over: 'Resistive probes',
    why: "Resistive probes oxidize in continuous contact with water. The Adafruit 4026 is capacitive, so it won't oxidize over time.",
    source: 'https://www.adafruit.com/product/4026',
  },
  {
    pick: 'Atlas Scientific pH kit',
    role: 'pH measurement',
    over: 'Arduino Gravity pH',
    why: "The Arduino Gravity pH uses a glass reed that can't work in microgravity. The probe is 153 mm long, but the nanolab had only 47 mm of clearance, a geometry problem caught at assembly.",
  },
  {
    pick: 'TDS sensor',
    role: 'Dissolved nutrient load',
    over: null,
    why: 'Tracks nutrient concentration in the reservoir.',
  },
  {
    pick: 'ADS1115 ADC',
    role: 'Analog signal conditioning',
    over: null,
    why: 'More reliable connections for analog sensors.',
  },
  {
    pick: 'BS170 MOSFET',
    role: 'Load switching',
    over: null,
    why: 'Switches the pump and lighting loads on command from the Pi.',
  },
  {
    pick: 'NeoPixel strip',
    role: 'Programmable-spectrum lighting',
    over: null,
    why: 'Drives the grow channel with a tunable light spectrum.',
  },
]

// Core UI capabilities (user-interface.astro).
const uiFeatures = [
  {
    title: 'Live Camera Feed',
    desc: 'Real-time monitoring with sensor and AI readouts alongside the camera view, plus support for swappable camera sources.',
  },
  {
    title: 'Real-Time Graphing',
    desc: 'Live-updating graphs with comparison views. Export data as JSON or PNG.',
  },
  {
    title: 'Photo Galleries',
    desc: 'Automatic capture every 6 hours during plant growth, with rapid burst captures during drop tests.',
  },
  {
    title: 'Quick-Access Buttons',
    desc: 'One-click controls for lighting modes, on-demand photo capture, and test initiation.',
  },
  {
    title: 'Configurable Settings',
    desc: 'Substrate type, photo frequency, light brightness, and sensor parameters, all adjustable from the interface.',
  },
  {
    title: 'All Aspect Ratios',
    desc: "Astronaut hardware specs were unknown at build time, so the interface was built to work on any screen size.",
  },
]

// Feedback loop diagram, rebuilt from ai-control.astro as a page-local
// component so it scrolls in with the control-loop section.
function FeedbackLoop() {
  const steps = [
    { x: 30, label: 'Camera', sub: 'Images roots' },
    { x: 140, label: 'AI Model', sub: 'Moisture check' },
    { x: 250, label: 'Decision', sub: 'Below threshold?' },
    { x: 360, label: 'Pump', sub: 'Water delivered' },
  ]
  return (
    <svg
      width="100%"
      viewBox="0 0 440 120"
      className="max-w-[520px]"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Closed feedback loop: camera to AI model to decision to pump, looping back to the camera."
    >
      {steps.map((s) => (
        <g key={s.label}>
          <rect
            x={s.x - 30}
            y="30"
            width="80"
            height="52"
            rx="6"
            fill="rgba(212,160,23,0.08)"
            stroke="rgba(212,160,23,0.3)"
            strokeWidth="1.5"
          />
          <text
            x={s.x + 10}
            y="58"
            textAnchor="middle"
            fill="#fff"
            fontSize="10"
            fontFamily="Space Grotesk, sans-serif"
            fontWeight="600"
          >
            {s.label}
          </text>
          <text
            x={s.x + 10}
            y="73"
            textAnchor="middle"
            fill="#64748b"
            fontSize="8"
            fontFamily="Inter, sans-serif"
          >
            {s.sub}
          </text>
        </g>
      ))}
      <line x1="60" y1="56" x2="110" y2="56" stroke="#d4a017" strokeWidth="1.5" markerEnd="url(#hf-arrow)" />
      <line x1="170" y1="56" x2="220" y2="56" stroke="#d4a017" strokeWidth="1.5" markerEnd="url(#hf-arrow)" />
      <line x1="280" y1="56" x2="330" y2="56" stroke="#d4a017" strokeWidth="1.5" markerEnd="url(#hf-arrow)" />
      <path
        d="M 390 82 Q 390 110 220 110 Q 50 110 50 82"
        fill="none"
        stroke="rgba(212,160,23,0.4)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        markerEnd="url(#hf-arrow2)"
      />
      <text x="220" y="108" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="Inter, sans-serif">
        continuous feedback loop
      </text>
      <defs>
        <marker id="hf-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#d4a017" />
        </marker>
        <marker id="hf-arrow2" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto">
          <path d="M6,0 L0,3 L6,6 Z" fill="rgba(212,160,23,0.6)" />
        </marker>
      </defs>
    </svg>
  )
}

export default function AiControl() {
  // Electronics-subsystem parts from parts.js, one PartViewerSlot each.
  const electronicsParts = parts.filter((p) => p.subsystem === 'Electronics')

  return (
    <>
      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-24 pb-12">
        <Reveal>
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
            Automation
          </div>
        </Reveal>
        <KineticText
          text="AI Vision & Control"
          split="word"
          as="h1"
          className="font-display text-4xl font-bold text-white sm:text-6xl"
        />
        <Reveal delay={1}>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
            A locally-running vision model watches the roots and drives the pump in a closed
            loop. HexaFlow waters plants only when they actually need it.
          </p>
        </Reveal>
      </section>

      {/* Key numbers */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Reveal delay={1}>
            <StatCounter value={1080} suffix="p" label="Main camera" note="InoMaker optic" />
          </Reveal>
          <Reveal delay={2}>
            <StatCounter value={130} suffix="°" label="Field of view" note="Wide root-zone framing" />
          </Reveal>
          <Reveal delay={3}>
            <StatCounter value={153} suffix=" mm" label="pH probe length" note="Atlas Scientific kit" />
          </Reveal>
          <Reveal delay={4}>
            <StatCounter value={47} suffix=" mm" label="Nanolab clearance" note="Geometry caught at assembly" />
          </Reveal>
        </div>
      </section>

      {/* Vision */}
      <Section id="vision" eyebrow="Vision" title="The cameras, and what they watch for">
        <Reveal>
          <p className="max-w-3xl leading-relaxed text-slate-300">
            The locally-running AI model observes plant roots through a camera and dispenses
            water incrementally, verifying adequate hydration before it stops the pump. The
            result is a closed-loop system that responds to actual plant conditions rather than
            a fixed timer.
          </p>
        </Reveal>
        <Reveal delay={1}>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-300">
            The vision model reads moisture straight from the camera feed and drives the pump
            accordingly, closing a <span className="font-semibold text-white">continuous feedback
            loop</span> that prevents both overwatering and underwatering. Its job is to detect
            dry roots and trigger the pump only when needed.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Reveal delay={1}>
            <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-6">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
                Compute
              </div>
              <h3 className="mt-2 font-display text-lg font-bold text-white">Raspberry Pi Zero 2W</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Runs the AI, monitoring, and UI. Chosen because it was already on hand and
                natively supports the Pi Camera 3.
              </p>
            </div>
          </Reveal>
          <Reveal delay={2}>
            <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-6">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
                Main optic
              </div>
              <h3 className="mt-2 font-display text-lg font-bold text-white">InoMaker 1080p</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                130° field of view for wide coverage of the root zone, paired with the Pi Zero 2W.
              </p>
            </div>
          </Reveal>
          <Reveal delay={3}>
            <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-6">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
                Secondary cameras
              </div>
              <h3 className="mt-2 font-display text-lg font-bold text-white">Two extra modules</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Multi-angle coverage, including a USB-B camera clipped to watch the pump and
                reservoir.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={1}>
          <figure className="mt-10 overflow-hidden rounded-2xl border border-hex-line bg-hex-panel">
            <img
              src={withBase('/images/ai-2.jpg')}
              alt="AI control electronics with the Raspberry Pi and cameras"
              loading="lazy"
              className="w-full object-cover"
            />
            <figcaption className="bg-hex-panel px-4 py-2 text-xs text-hex-muted2">
              AI control electronics: the Raspberry Pi Zero 2W, InoMaker 1080p camera, and secondary modules.
            </figcaption>
          </figure>
        </Reveal>
      </Section>

      {/* Sensors */}
      <Section id="sensors" eyebrow="Sensors" title="Every sensor chosen for a reason">
        <Reveal>
          <p className="max-w-3xl leading-relaxed text-slate-300">
            Every sensor was chosen for a concrete reason, and against a documented
            alternative. The notes below come straight from the bill of materials.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sensorCards.map((s, i) => (
            <Reveal key={s.pick} delay={(i % 6) + 1}>
              <div className="flex h-full flex-col rounded-2xl border border-hex-line bg-hex-panel p-6">
                <h3 className="font-display text-base font-bold text-hex-gold">{s.pick}</h3>
                <p className="mt-1 text-sm font-medium text-white">{s.role}</p>
                {s.over && (
                  <p className="mt-3 text-xs text-hex-muted2">
                    Over <span className="text-hex-muted">{s.over}</span>
                  </p>
                )}
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{s.why}</p>
                {s.source && (
                  <a
                    href={s.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 self-start text-xs text-hex-gold/80 underline-offset-2 hover:underline"
                  >
                    Source listing
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* The control loop */}
      <Section id="control-loop" eyebrow="The control loop" title="Sense, decide, actuate">
        <Reveal>
          <p className="max-w-3xl leading-relaxed text-slate-300">
            The loop runs on a Raspberry Pi Zero 2W. The camera images the roots, the vision model
            checks moisture against a threshold, and the pump delivers water only when the
            decision says to. Then it loops back and looks again.
          </p>
        </Reveal>

        {/* Scroll-staged steps */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Reveal delay={1}>
            <div className="h-full rounded-2xl border border-hex-gold/40 bg-hex-gold/5 p-6">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
                01 · Sense
              </div>
              <h3 className="mt-2 font-display text-lg font-bold text-white">Camera images roots</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                The InoMaker 1080p camera frames the root zone. The vision model reads moisture
                straight from the feed, with the capacitive soil moisture sensor as a fallback
                cross-check.
              </p>
            </div>
          </Reveal>
          <Reveal delay={2}>
            <div className="h-full rounded-2xl border border-hex-gold/40 bg-hex-gold/5 p-6">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
                02 · Decide
              </div>
              <h3 className="mt-2 font-display text-lg font-bold text-white">Below threshold?</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                The AI model compares root moisture against a threshold. If roots are dry, it
                commands the pump. If not, it keeps watching. This prevents both overwatering and
                underwatering.
              </p>
            </div>
          </Reveal>
          <Reveal delay={3}>
            <div className="h-full rounded-2xl border border-hex-gold/40 bg-hex-gold/5 p-6">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
                03 · Actuate
              </div>
              <h3 className="mt-2 font-display text-lg font-bold text-white">Pump delivers water</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                A BS170 MOSFET switches the pump on. Water is delivered incrementally, and the
                model verifies adequate hydration before stopping. Then the loop restarts.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Feedback loop diagram */}
        <Reveal delay={1}>
          <div className="mt-10 flex justify-center rounded-2xl border border-hex-line bg-hex-panel p-8">
            <FeedbackLoop />
          </div>
        </Reveal>

        {/* Dual configuration modes */}
        <Reveal>
          <h3 className="mt-14 font-display text-2xl font-bold text-white">
            Dual configuration modes
          </h3>
        </Reveal>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Reveal delay={1}>
            <div className="h-full rounded-2xl border border-hex-gold/30 bg-hex-panel p-6">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
                Drop test mode
              </div>
              <h4 className="mt-2 font-display text-lg font-bold text-white">
                Drop testing configuration
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>AI disengages during the drop window.</li>
                <li>Constant pumping for a user-defined duration.</li>
                <li>
                  Driven by a <span className="font-semibold text-white">100 mL/min (5000 RPM)</span> pump.
                </li>
                <li>
                  Targets <span className="font-semibold text-white">~8.63 mL</span> over the test
                  window. The original site sized this for 5.18 s; the actual NASA Glenn facility is
                  the 2.2-Second Drop Tower.
                </li>
                <li>Maximizes channel fill during the microgravity event.</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={2}>
            <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-6">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
                Long-term mode
              </div>
              <h4 className="mt-2 font-display text-lg font-bold text-white">
                Long-term growing configuration
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>AI vision actively monitors root moisture.</li>
                <li>
                  Driven by a <span className="font-semibold text-white">1 mL/min</span> pump for
                  long-term operation.
                </li>
                <li>
                  Saves <span className="font-semibold text-white">320 mA</span> versus the
                  drop-test pump.
                </li>
                <li>Fine-grained control over water delivery.</li>
                <li>Adaptive data collection and imaging protocols.</li>
                <li>TDS and pH sensors active.</li>
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Pump specs strip */}
        <Reveal delay={1}>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-hex-line bg-hex-panel p-6">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
                Drop-test pump
              </div>
              <p className="mt-2 font-display text-lg font-bold text-white">{pumpSpecs.dropTest.rate}</p>
              <p className="mt-1 text-xs text-hex-muted2">{pumpSpecs.dropTest.rpm}</p>
            </div>
            <div className="rounded-2xl border border-hex-line bg-hex-panel p-6">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
                Long-term pump
              </div>
              <p className="mt-2 font-display text-lg font-bold text-white">{pumpSpecs.longTerm.rate}</p>
              <p className="mt-1 text-xs text-hex-muted2">{pumpSpecs.longTerm.savings}</p>
            </div>
            <div className="rounded-2xl border border-hex-line bg-hex-panel p-6">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
                Drop-test target
              </div>
              <p className="mt-2 font-display text-lg font-bold text-white">~8.63 mL</p>
              <p className="mt-1 text-xs text-hex-muted2">Over the test window</p>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Carrier board */}
      <Section id="carrier-board" eyebrow="Carrier board" title="One board, every connection">
        <Reveal>
          <p className="max-w-3xl leading-relaxed text-slate-300">
            A custom carrier board consolidates every electronics connection into one board.
            Simpler wiring, fewer failure points.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {carrierBoardFeatures.map((feature, i) => (
            <Reveal key={feature} delay={(i % 6) + 1}>
              <div className="flex h-full items-start gap-4 rounded-2xl border border-hex-line bg-hex-panel p-6">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-hex-gold/40 bg-hex-gold/10 font-display text-sm font-bold text-hex-gold">
                  {i + 1}
                </div>
                <p className="text-sm leading-relaxed text-slate-300">{feature}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={1}>
          <figure className="mt-10 overflow-hidden rounded-2xl border border-hex-line bg-hex-panel">
            <img
              src={withBase('/images/ai-1.jpg')}
              alt="Custom carrier board consolidating every electronics connection"
              loading="lazy"
              className="w-full object-cover"
            />
            <figcaption className="bg-hex-panel px-4 py-2 text-xs text-hex-muted2">
              Custom carrier board.
            </figcaption>
          </figure>
        </Reveal>
      </Section>

      {/* Web interface */}
      <Section id="web-interface" eyebrow="Web interface" title="A dashboard over local network">
        <Reveal>
          <p className="max-w-3xl leading-relaxed text-slate-300">
            A locally-networked dashboard delivers real-time monitoring, graphing, photo
            galleries, and full system control, built to run on any device aspect ratio.
          </p>
        </Reveal>

        <Reveal delay={1}>
          <div className="mt-8 rounded-2xl border border-hex-line bg-hex-panel p-6">
            <h3 className="font-display text-lg font-bold text-white">
              Development &amp; version control
            </h3>
            <p className="mt-3 max-w-3xl leading-relaxed text-slate-300">
              Version control was a day-one decision, not an afterthought. With major revisions
              expected across the build, the team standardized on GitHub from the start.
              Incremental commits paired with explanatory messages kept UI development organized
              and every change traceable.
            </p>
            <a
              href="https://github.com/AidanForrester/TC-HUNCH-Nanolab"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-hex-gold/30 bg-hex-bg px-5 py-2 text-sm font-semibold text-white transition-colors hover:border-hex-gold/60"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#94a3b8" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              AidanForrester/TC-HUNCH-Nanolab
            </a>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {uiFeatures.map((f, i) => (
            <Reveal key={f.title} delay={(i % 6) + 1}>
              <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-6">
                <h4 className="font-display text-sm font-bold text-white">{f.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-hex-muted2">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={1}>
          <figure className="mt-10 overflow-hidden rounded-2xl border border-hex-line bg-hex-panel">
            <img
              src={withBase('/images/ui-1.jpg')}
              alt="HexaFlow user interface dashboard screenshot"
              loading="lazy"
              className="w-full object-cover"
            />
            <figcaption className="bg-hex-panel px-4 py-2 text-xs text-hex-muted2">
              HexaFlow UI dashboard: live camera feed, graphing, and controls.
            </figcaption>
          </figure>
        </Reveal>
      </Section>

      {/* Hardware photos */}
      <Section id="hardware-photos" eyebrow="Hardware" title="The electronics, in hand">
        <Reveal>
          <p className="max-w-3xl leading-relaxed text-slate-300">
            The carrier board, the AI control electronics, and the Raspberry Pi and pump wiring.
          </p>
        </Reveal>
        <Reveal delay={1} className="mt-8">
          <PhotoGallery
            images={[
              { src: withBase('/images/ai-1.jpg'), alt: 'Custom carrier board' },
              { src: withBase('/images/ai-2.jpg'), alt: 'AI control electronics' },
              { src: withBase('/images/ai-3.jpg'), alt: 'Raspberry Pi and pump wiring' },
            ]}
            columns={3}
          />
        </Reveal>
      </Section>

      {/* Per-part viewer slots: Electronics subsystem */}
      <Section id="electronics-parts" eyebrow="Electronics" title="The electronics subsystem, part by part">
        <Reveal>
          <p className="max-w-3xl leading-relaxed text-slate-300">
            Each Electronics-subsystem part from the CAD assembly, with its own viewer slot. When a
            standalone 3D model file is dropped in, the viewer lights up automatically.
          </p>
        </Reveal>

        <div className="mt-12 space-y-16">
          {electronicsParts.map((part, i) => (
            <Reveal key={part.id} delay={1}>
              <PartViewerSlot part={part} />
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  )
}