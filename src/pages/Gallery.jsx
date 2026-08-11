import Section from '../components/Section.jsx'
import Reveal from '../components/Reveal.jsx'
import KineticText from '../components/KineticText.jsx'
import PhotoGallery from '../components/Lightbox.jsx'
import { withBase } from '../lib/withBase.js'
import { dropTests } from '../data/dropTests.js'
import { substratePhotos, coverPhotos } from '../data/substrates.js'

// Project photos from the old full-project-photos.astro, categorized by
// caption. The old site showed them as one flat grid; here they are split
// into Build / Fabrication, The Team, Substrates, and Drop Test so each
// gallery tells one part of the story. Captions are preserved verbatim.
const BUILD_PHOTOS = [
  { src: '/images/project-1.jpg',  alt: 'Full project assembly, front view' },
  { src: '/images/project-2.jpg',  alt: 'Full project assembly, side view' },
  { src: '/images/project-3.jpg',  alt: 'TDC module close-up' },
  { src: '/images/project-4.jpg',  alt: 'Hexagonal channel detail' },
  { src: '/images/project-5.jpg',  alt: 'Electronics carrier board' },
  { src: '/images/project-6.jpg',  alt: 'Camera and LED mount' },
  { src: '/images/project-7.jpg',  alt: 'Plant clips seated in the TDC' },
  { src: '/images/project-12.jpg', alt: 'Reservoir and pump assembly' },
  { src: '/images/project-14.jpg', alt: 'Project build photo 14' },
  { src: '/images/project-15.jpg', alt: 'Project build photo 15' },
]

const TEAM_PHOTOS = [
  { src: '/images/project-10.jpg', alt: 'Team at the TDC showcase' },
  { src: '/images/project-11.jpg', alt: 'TDC showcase table overview' },
]

// The kale inversion shot lives with the substrate story: it shows a plant
// held in the clips during an inversion test, the same containment check
// the substrate covers had to pass.
const SUBSTRATE_PHOTOS = [
  { src: '/images/project-13.jpg', alt: 'Kale held in plant clips during an inversion test' },
  ...substratePhotos.map((p) => ({ src: p.src, alt: p.caption })),
]

const COVER_PHOTOS = coverPhotos.map((p) => ({ src: p.src, alt: p.caption }))

const DROP_TEST_PHOTOS = [
  { src: '/images/project-8.jpg',  alt: 'Drop test rig and setup' },
  { src: '/images/project-9.jpg',  alt: 'Water dispersal, dyed, post-drop' },
  ...dropTests.photos.map((p) => ({ src: p.src, alt: p.caption })),
]

// Wrap every image path with withBase so the same build serves root and the
// /hexaflow/ project page. PhotoGallery receives {src, alt} pairs.
const wrap = (photos) => photos.map((p) => ({ src: withBase(p.src), alt: p.alt }))

const ALBUM_URL = 'https://photos.app.goo.gl/YoSgDdvfpjroUKgU9'

export default function Gallery() {
  return (
    <main className="bg-hex-bg">
      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-32 pb-20">
        <Reveal>
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-hex-gold/80">
            Gallery · Photos of Full Project and TDC
          </div>
        </Reveal>
        <KineticText
          as="h1"
          text="The build, the team, the drops, in pictures"
          split="word"
          className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
        />
        <Reveal delay={2}>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
            Project photographs of the full HexaFlow assembly, the TDC module,
            the substrate and cover tests, and the drop test runs at the NASA
            Glenn 2.2-Second Drop Tower in Ohio. Tap any photo to open the
            lightbox, then use the arrow keys to move through the set.
          </p>
        </Reveal>
      </section>

      {/* Build / Fabrication */}
      <Section
        id="build"
        eyebrow="Build / Fabrication"
        title="The assembly, piece by piece"
      >
        <Reveal>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-hex-muted">
            The full nanolab and the TDC module from every angle: the
            hexagonal capillary channels, the electronics carrier board, the
            camera and LED mount, the plant clips, and the reservoir and pump
            assembly that feeds the root zone.
          </p>
        </Reveal>
        <div className="mt-10">
          <PhotoGallery images={wrap(BUILD_PHOTOS)} columns={3} />
        </div>
      </Section>

      {/* The Team */}
      <Section
        id="team"
        eyebrow="The Team"
        title="At the TDC showcase"
      >
        <Reveal>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-hex-muted">
            Five students, one 2U box. These are the team and the showcase
            table at the Tri-County Design Challenge where the finished
            project was presented.
          </p>
        </Reveal>
        <div className="mt-10">
          <PhotoGallery images={wrap(TEAM_PHOTOS)} columns={2} />
        </div>
      </Section>

      {/* Substrates */}
      <Section
        id="substrates"
        eyebrow="Substrates"
        title="Substrate tests and the covers that hold them"
      >
        <Reveal>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-hex-muted">
            Eight substrate samples went into the October test. Only pine bark
            produced growth; the rest grew mold, which drove the pivot to
            aeroponics with rockwool and clay pebbles as anchors. The kale
            inversion shot shows a plant held in the clips under the same
            containment check the covers had to pass.
          </p>
        </Reveal>
        <Reveal delay={1}>
          <h3 className="mt-12 font-display text-xl font-bold text-white">
            Substrate test samples
          </h3>
        </Reveal>
        <div className="mt-5">
          <PhotoGallery images={wrap(SUBSTRATE_PHOTOS)} columns={4} />
        </div>
        <Reveal delay={1}>
          <h3 className="mt-12 font-display text-xl font-bold text-white">
            Substrate covers
          </h3>
        </Reveal>
        <Reveal delay={2}>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-hex-muted">
            One purpose-built cover per substrate, iterated through five grate
            attempts until a horizontal grate finally held the clay pebbles in
            place. The moisture-sensor cutout had to be repositioned every
            time the plant cutout changed, a constant tradeoff between sensor
            reach and a secure hold.
          </p>
        </Reveal>
        <div className="mt-5">
          <PhotoGallery images={wrap(COVER_PHOTOS)} columns={4} />
        </div>
      </Section>

      {/* Drop Test */}
      <Section
        id="drop-test"
        eyebrow="Drop Test"
        title="Three drops at NASA Glenn"
      >
        <Reveal>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-hex-muted">
            The drop test rig and setup, dyed water dispersal after a drop, and
            the post-drop caliper measurements from the NASA Glenn 2.2-Second
            Drop Tower. Three drops were run: Drop 1 produced the best
            capillary dispersal, Drop 2 followed the hexagons being cleaned out,
            and Drop 3 was the double-water run.
          </p>
        </Reveal>
        <div className="mt-10">
          <PhotoGallery images={wrap(DROP_TEST_PHOTOS)} columns={3} />
        </div>
        <Reveal delay={2}>
          <p className="mt-10 max-w-3xl text-base leading-relaxed text-hex-muted">
            More drop test photos live in the Google album. The full set of
            results from the NASA Glenn runs is there:{' '}
            <a
              href={ALBUM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-hex-gold underline decoration-hex-gold/40 underline-offset-4 hover:decoration-hex-gold"
            >
              photos.app.goo.gl/YoSgDdvfpjroUKgU9
            </a>
            .
          </p>
        </Reveal>
      </Section>
    </main>
  )
}