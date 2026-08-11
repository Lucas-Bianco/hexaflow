import Section from '../components/Section.jsx'
import Reveal from '../components/Reveal.jsx'
import KineticText from '../components/KineticText.jsx'
import StatCounter from '../components/StatCounter.jsx'
import HorizontalTimeline from '../components/scroll/HorizontalTimeline.jsx'
import { journey } from '../data/journey.js'

// Timeline cards: one per journey entry. The fact-checked `body` from journey.js
// is the spine; entry 6 (the seven-shell iteration) carries its prototyping
// milestones as bullets so the card stays scannable. Ids are stable for the
// horizontal track.
const PROTO_BULLETS = [
  'Substrate Testing: 8 materials tested; pine bark showed growth; all developed mold, so we pivoted to aeroponics.',
  'TDC V1: first hexagonal capillary plate in SLA resin. Verified capillary action and inversion water retention at 10.12 mL capacity.',
  'TDC V2: combined resin construction with 3D-printed framing to cut weight and cost, and added a camera slot for pump and reservoir monitoring.',
  'Drop Test Iteration: removed TDS and pH sensors, upgraded to a high-capacity pump targeting 8.63 mL.',
  'AI Integration: vision model trained on root moisture data, dual-mode system for drop test and long-term operation.',
  'Custom Carrier Board: consolidated electronics onto one board (RPi, 4-camera hub, direct ADC, power breakouts) to simplify wiring.',
]

const timelineItems = journey.map((entry, i) => {
  if (i === 5) {
    return {
      id: `j${i + 1}`,
      date: entry.date,
      title: entry.title,
      tag: entry.tag,
      body: `We iterated the enclosure seven times: wire holes 5 mm to 8 mm, walls 4 mm to 2 mm, door screws M3 16 mm to 4 mm, half-slotted modules that kept falling off the rails until we added supports. The reservoir became removable to stop moisture contaminating the electronics: a heat-sealed pouch in a friction-fit pocket. Then our new resin printer's VOCs shriveled the test plants overnight, a sharp lesson that emissions and biology don't share a room.`,
      bullets: PROTO_BULLETS,
    }
  }
  return {
    id: `j${i + 1}`,
    date: entry.date,
    title: entry.title,
    tag: entry.tag,
    body: entry.body,
  }
})

// Deep-dive phase sections, ordered as the design process actually ran:
// Problem, Ideation, Design, Build, Test, Iterate. Each pulls the fuller
// narrative from process.astro and prototyping.astro that the short timeline
// cards can't hold. Every milestone and date is preserved.
const EXPERTS = [
  'Dr. Gene Giacomelli, University of Arizona, Mars-Lunar Greenhouse',
  'Dr. Murat Kacira, University of Arizona',
  'Robert Morrow, NASA capillary fluidics',
  'John Wetzel, Sierra Space',
  'Ariel Ekblaw, MIT Space Exploration Initiative',
]

const CONSTRAINTS = [
  { k: 'Volume', v: '2U nanolab, 20 x 10 x 10 cm' },
  { k: 'Power', v: '5 V USB-A' },
  { k: 'Budget', v: '$100' },
  { k: 'Water', v: 'Entirely mechanical, no pumps-for-everything' },
  { k: 'Sensors', v: 'Condensation could not touch them' },
  { k: 'Form', v: 'Modular, with a web interface' },
]

const SUBSTRATE_VERDICTS = [
  { name: 'Rockwool', verdict: 'Won. Screws into existing holes, its binding agent will not escape into the channels, and water moves through it better in microgravity.' },
  { name: 'Clay pebbles', verdict: 'Second pick. 11.5 mm pebbles cannot enter the 0.48 mm channels.' },
  { name: 'Pine bark', verdict: 'Rejected. Fragments would clog the channels.' },
  { name: 'Illite', verdict: 'Rejected. The fine powder would escape and force a redesign.' },
]

const LEARNINGS = [
  {
    title: 'Kale kept dying',
    body: 'Clay pebbles and rockwool have to stay continuously damp, which is impractical in microgravity. Fix: thread the roots through the bottom of the rockwool so they reach the nutrient water directly.',
  },
  {
    title: 'Resin printer killed the plants',
    body: 'Our new resin printer shared an unventilated room with the test plants, and its VOCs shriveled them overnight. Fix: move the plants, tent them, ventilate. Emissions and biology do not mix.',
  },
  {
    title: 'The pH probe was too long',
    body: 'The Atlas Scientific pH probe is 153 mm, and we had 47 mm of clearance. A geometry problem we caught only at assembly, the kind of thing that only shows up when you build it.',
  },
  {
    title: 'No microgravity sim in software',
    body: 'We could not get a microgravity simulation running in software, and keeping a plant alive in physical substrates was "almost definitely user error." We stopped trusting the sim and started dropping the real thing.',
  },
]

export default function Journey() {
  return (
    <main className="bg-hex-bg">
      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-32 pb-20">
        <Reveal>
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-hex-gold/80">
            Process · The Design Journey
          </div>
        </Reveal>
        <KineticText
          as="h1"
          text="How a NASA HUNCH constraint became a capillary-action nanolab"
          split="word"
          className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
        />
        <Reveal delay={2}>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
            Five students, one 2U box, a $100 budget, and a lizard that moves water
            with its skin. This is the full thought process, problem through
            research, design, build, test, and iteration. Every decision, dead
            end, and the reasoning behind it.
          </p>
        </Reveal>
      </section>

      {/* Centerpiece: pinned horizontal timeline */}
      <Section
        id="timeline"
        eyebrow="The spine of the project"
        title="Nine milestones across seven months"
      >
        <Reveal>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-hex-muted">
            Scroll right to walk the build in order. Each card is a date, a
            decision, and what it cost us. The deeper narrative for every phase
            follows below.
          </p>
        </Reveal>
        <div className="mt-10">
          <HorizontalTimeline items={timelineItems} />
        </div>
      </Section>

      {/* Deep dive: Problem */}
      <Section
        id="phase-problem"
        eyebrow="Phase 01 · Problem"
        title="Study fluids, not just grow plants"
      >
        <Reveal>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
            The real goal was understanding how fluids and plant substrates
            behave in microgravity, a step toward feeding long-distance
            spaceflight. Plants were the means; the behavior of water in
            weightlessness was the subject. That framing shaped every choice
            that followed.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-hex-muted">
            On Sept 2025, NASA HUNCH handed us the box we had to build inside.
            Condensation could not touch the sensors, everything had to be
            modular, and it needed a web interface. The water supply had to be
            entirely mechanical. No pumps-for-everything.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONSTRAINTS.map((c, i) => (
            <Reveal key={c.k} delay={(i % 3) + 1}>
              <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-5">
                <div className="font-display text-sm font-bold uppercase tracking-widest text-hex-gold">
                  {c.k}
                </div>
                <div className="mt-2 text-sm leading-relaxed text-slate-300">
                  {c.v}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Deep dive: Ideation */}
      <Section
        id="phase-ideation"
        eyebrow="Phase 02 · Ideation"
        title="Read everything, then steal from a lizard"
      >
        <Reveal>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
            Through Sept and Oct 2025 we reviewed NASA Veggie, the Advanced
            Plant Habitat, U-Michigan's 3D-printed PLA substrate, the MIT 2020
            payloads, Astrobeat, and three patents. The gap was consistent: too
            big, not modular, water sources that drew power, not user-friendly.
            We pulled literature on capillary fluidics and soil-moisture
            sensors, and started logging everything in individual design
            notebooks we called our D.A.A.N.s.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-hex-muted">
            We did not guess. We emailed the people who had done pieces of this
            before. Not all of them wrote back, but the ones who did shaped the
            design.
          </p>
        </Reveal>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {EXPERTS.map((e, i) => (
            <Reveal as="li" key={e} delay={(i % 2) + 1} className="flex gap-3">
              <span className="mt-1 text-hex-gold">&#9670;</span>
              <span className="text-sm leading-relaxed text-slate-300">{e}</span>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={2}>
          <div className="mt-12 rounded-2xl border border-hex-gold/40 bg-hex-gold/10 p-6">
            <div className="font-display text-sm font-bold uppercase tracking-widest text-hex-gold">
              Oct 22, 2025 · The pivot
            </div>
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              Eight substrates went into testing in October. Nearly all of them
              grew mould; only pine bark produced any growth at all. On 22
              October we abandoned growing media entirely and went aeroponic.
              Hydroponics looked promising until we realized it might make the
              project's goal obsolete. Then Sabrina found the thorny devil
              lizard (Moloch horridus) on asknature.org: its grooved skin moves
              water by capillary action, no pump needed. Nate prototyped the
              "Moloch Horridus Water System" in SolidWorks in two sizes. It
              worked "miraculously well," so we renamed the core the TDC,
              Thorny-Devil Capillary.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* Deep dive: Design */}
      <Section
        id="phase-design"
        eyebrow="Phase 03 · Design"
        title="NASA liked the hex. Then pushed us."
      >
        <Reveal>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
            At Preliminary Design Review on Nov 18 and 19, 2025, NASA's reviewer
            called the hexagonal shape and thorny-devil method "terrific." The
            feedback reshaped the build: reposition the camera to capture fluid
            dynamics, not plant growth, because the test is too short to grow
            anything; use food coloring to see the water; add one to two
            containment layers; and test at least two substrates. Peer teams
            warned wicking does not work in microgravity.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-hex-muted">
            On Dec 15, 2025, we scored four substrates on system compatibility,
            microgravity feasibility, and modularity. The matrix let us choose
            on purpose instead of on preference.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {SUBSTRATE_VERDICTS.map((s, i) => (
            <Reveal key={s.name} delay={(i % 2) + 1}>
              <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-5">
                <div className="font-display text-base font-bold text-white">
                  {s.name}
                </div>
                <div className="mt-2 text-sm leading-relaxed text-slate-400">
                  {s.verdict}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Deep dive: Build */}
      <Section
        id="phase-build"
        eyebrow="Phase 04 · Build"
        title="The vision model closes the loop"
      >
        <Reveal>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
            By Critical Design Review in Spring 2026 the system was whole: TDC
            capillary channels, dual pumps (1 mL/min for the long term, 100
            mL/min for the drop test), a Raspberry Pi Zero 2W running an AI
            vision model, aeroponics plus rockwool and clay pebbles, and a
            modular shelf enclosure. The vision model reads root moisture and
            waters only when the roots are dry, a continuous feedback loop that
            eliminates root rot.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-hex-muted">
            A custom carrier board consolidated the electronics onto one board:
            Raspberry Pi, a 4-camera hub, direct ADC, and power breakouts, which
            simplified wiring for reliability. The honest open items at CDR were
            a custom PCB to replace the wiring, waterproofing, and a live-plant
            run.
          </p>
        </Reveal>
        <Reveal delay={3}>
          <div className="mt-8 rounded-2xl border border-hex-line bg-hex-panel p-6">
            <div className="font-display text-sm font-bold uppercase tracking-widest text-hex-gold">
              Caught only at assembly
            </div>
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              The Atlas Scientific pH probe is 153 mm. We had 47 mm of clearance.
              A geometry problem that only shows up when you build it, not when
              you model it.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* Deep dive: Test */}
      <Section
        id="phase-test"
        eyebrow="Phase 05 · Test"
        title="Drop, measure, repeat"
      >
        <Reveal>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
            From Jan through Mar 2026 we dropped the TDC from 14 feet with dyed
            water, measuring the water radius before and after each drop. Each
            drop was about 0.9 seconds of free fall, simulating the NASA Glenn
            2.2-Second Drop Tower in Ohio we are traveling to test at.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-hex-muted">
            Two suites were run. The first six drops averaged about 9.9 mm of
            capillary movement. After the module was revised, nine more drops
            averaged 14.7 mm, a 48% improvement. The spread across the revised
            suite ran from 4.28 mm to 31.79 mm. We built up in three stages:
            bare module, then module plus camera, then the full nanolab with
            pump, sensors, and a web UI recording the whole thing. We could not
            get a microgravity simulation running in software, and keeping a
            plant alive in physical substrates was "almost definitely user
            error." We stopped trusting the sim and started dropping the real
            thing.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCounter value={14.7} dp={1} suffix=" mm" label="Mean capillary rise" note="revised Suite B" />
          <StatCounter value={9} dp={0} suffix="" label="Free-fall drops" note="Suite B" />
          <StatCounter value={48} dp={0} suffix="%" label="Improvement" note="Suite A to Suite B" />
          <StatCounter value={0.9} dp={1} suffix=" s" label="Free fall per drop" note="14 ft rig" />
        </div>
      </Section>

      {/* Deep dive: Iterate */}
      <Section
        id="phase-iterate"
        eyebrow="Phase 06 · Iterate"
        title="Seven shells and a lesson about resin"
      >
        <Reveal>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
            From Dec 2025 through Feb 2026 we iterated the enclosure seven times:
            wire holes 5 mm to 8 mm, walls 4 mm to 2 mm, door screws M3 16 mm to
            4 mm, and half-slotted modules that kept falling off the rails until
            we added supports. The reservoir became removable to stop moisture
            contaminating the electronics: a heat-sealed pouch in a
            friction-fit pocket.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-hex-muted">
            Then our new resin printer's VOCs shriveled the test plants
            overnight. The kale kept dying, and the cause turned out to be the
            team's own new resin printer running unventilated in the same room.
            Both plants shriveled before anyone connected the two. Fix: move
            the plants, tent them, ventilate. Emissions and biology don't share
            a room.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-6">
              <div className="font-display text-base font-bold text-white">
                TDC V1
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                The first hexagonal capillary plate, built in SLA resin.
                Verified capillary action and inversion water retention at 10.12
                mL capacity.
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-6">
              <div className="font-display text-base font-bold text-white">
                TDC V2
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Combined resin construction with 3D-printed framing to reduce
                weight and cost, and added a camera slot for pump and reservoir
                monitoring.
              </p>
            </div>
          </Reveal>
        </div>
        <Reveal delay={2}>
          <div className="mt-8 rounded-2xl border border-hex-gold/40 bg-hex-gold/10 p-6">
            <div className="font-display text-sm font-bold uppercase tracking-widest text-hex-gold">
              Feb 9, 2026 · Roots-through-rockwool fix
            </div>
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              Clay pebbles and rockwool must stay continuously damp to wick
              water, which is impractical in microgravity where wetting is
              intermittent at best. The fix was to thread the roots through the
              bottom of the rockwool so they reach the nutrient water directly,
              sidestepping the wicking problem entirely. The substrate is not
              just an anchor; it is part of the water-delivery path. Routing
              roots through its base lets the rockwool support the stem while
              the roots drink straight from the reservoir.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* Closing reflection: what we learned */}
      <Section
        id="learned"
        eyebrow="What we learned"
        title="Failures we kept"
      >
        <Reveal>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
            Every failure below became a design decision. That is the loop:
            build the thing, drop it, measure, and listen when the result
            disagrees with the model.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {LEARNINGS.map((l, i) => (
            <Reveal key={l.title} delay={(i % 2) + 1}>
              <div className="h-full rounded-2xl border border-hex-line bg-hex-panel p-6">
                <h3 className="font-display text-lg font-bold text-white">
                  {l.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {l.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={2}>
          <p className="mt-12 max-w-3xl text-base leading-relaxed text-hex-muted">
            The process that worked was not the one we planned. It was the one
            where we stopped trusting the simulation, built the real thing, and
            let nine drops of dyed water from 14 feet tell us what the model
            could not. Seven months, seven enclosure shells, fifteen drops, and
            one lizard. That is HexaFlow.
          </p>
        </Reveal>
      </Section>
    </main>
  )
}