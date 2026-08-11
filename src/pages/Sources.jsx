import Section from '../components/Section.jsx'
import Reveal from '../components/Reveal.jsx'
import KineticText from '../components/KineticText.jsx'
import { sources, sourcesNote } from '../data/sources.js'
import { team, teamMeta } from '../data/team.js'

// Preserve the category order from sources.js (the order the old site presented
// them in). Group once at module load so the component body stays declarative.
const categoryOrder = []
const byCategory = new Map()
for (const s of sources) {
  if (!byCategory.has(s.category)) {
    byCategory.set(s.category, [])
    categoryOrder.push(s.category)
  }
  byCategory.get(s.category).push(s)
}

// One reference entry. Linked when a verified url exists; otherwise an honest
// "citation pending" tag, because the data really does flag those.
function RefEntry({ entry, index }) {
  const hasUrl = Boolean(entry.url)
  const Inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-sm font-semibold leading-snug text-slate-100">
          {entry.title}
          {hasUrl && (
            <span aria-hidden="true" className="ml-1 text-hex-gold">
              ↗
            </span>
          )}
        </h3>
        {!hasUrl && (
          <span className="mt-0.5 shrink-0 rounded border border-hex-line bg-hex-bg px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-hex-muted">
            citation pending
          </span>
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-hex-muted">{entry.note}</p>
      {hasUrl && (
        <p className="mt-3 break-all text-xs text-hex-gold/80">
          {entry.url.replace(/^https?:\/\//, '')}
        </p>
      )}
    </>
  )

  if (hasUrl) {
    return (
      <Reveal as="a" delay={Math.min(index + 1, 6)} href={entry.url} target="_blank" rel="noopener noreferrer" className="refcard group block h-full rounded-2xl border border-hex-line bg-hex-panel p-5 transition duration-300 hover:-translate-y-1 hover:border-hex-gold/40 focus-visible:-translate-y-1 focus-visible:border-hex-gold/40">
        {Inner}
      </Reveal>
    )
  }
  return (
    <Reveal delay={Math.min(index + 1, 6)} className="refcard block h-full rounded-2xl border border-hex-line bg-hex-panel p-5">
      {Inner}
    </Reveal>
  )
}

function CategoryBlock({ category, entries, index }) {
  return (
    <div>
      <Reveal>
        <h3 className="flex items-center gap-3 font-display text-lg font-bold text-white">
          <span aria-hidden="true" className="inline-block h-5 w-1 rounded bg-hex-gold" />
          {category}
        </h3>
      </Reveal>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {entries.map((entry, i) => (
          <RefEntry key={`${category}-${i}`} entry={entry} index={i} />
        ))}
      </div>
    </div>
  )
}

function TeamMember({ member, index }) {
  return (
    <Reveal as="article" delay={Math.min(index + 1, 6)} className="refcard flex h-full flex-col rounded-2xl border border-hex-line bg-hex-panel p-5">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-hex-gold/40 bg-hex-gold/10 font-display text-hex-gold">
        {member.name.charAt(0)}
      </div>
      <h4 className="font-display text-base font-bold text-white">{member.name}</h4>
      <p className="mt-1 text-sm leading-relaxed text-hex-muted">{member.role}</p>
    </Reveal>
  )
}

export default function Sources() {
  return (
    <main className="min-h-screen bg-hex-bg text-white">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-6xl px-6 pt-36 pb-20 sm:pt-44">
        <Reveal>
          <span className="inline-block rounded-full border border-hex-line bg-hex-gold/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-hex-gold">
            References
          </span>
        </Reveal>

        <KineticText
          as="h1"
          text="Sources & Credits"
          split="word"
          className="mt-6 block font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
        />

        <Reveal as="p" delay={1} className="mt-6 text-xl font-semibold text-hex-gold">
          Research references, programs, and documentation cited across every HexaFlow section.
        </Reveal>

        <Reveal as="p" delay={2} className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
          Good engineering shows its work. This page names the works consulted, links the ones with verified primary sources, and flags the ones still pending full citation.
        </Reveal>
      </section>

      {/* ── Citation status note ──────────────────────────────────────────── */}
      <Section id="citation-status" eyebrow="How to read this page" title="Citation status">
        <Reveal>
          <div className="rounded-2xl border border-hex-gold/20 bg-hex-gold/5 p-6">
            <p className="text-sm leading-relaxed text-slate-300">
              {sourcesNote}
            </p>
          </div>
        </Reveal>
      </Section>

      {/* ── Sources by category ───────────────────────────────────────────── */}
      <Section
        id="sources"
        eyebrow="Research Trail"
        title="Sources by category"
      >
        <Reveal as="p" className="max-w-3xl text-base leading-relaxed text-slate-400">
          Grouped by the section of work they informed. Entries with a gold arrow link to a verified primary source. Entries tagged "citation pending" name the work consulted but are awaiting full citation details.
        </Reveal>

        <div className="mt-14 flex flex-col gap-14">
          {categoryOrder.map((cat, i) => (
            <CategoryBlock key={cat} category={cat} entries={byCategory.get(cat)} index={i} />
          ))}
        </div>
      </Section>

      {/* ── Team & credits ───────────────────────────────────────────────── */}
      <Section
        id="team"
        eyebrow="Team & Credits"
        title="The HexaFlow team"
      >
        <Reveal as="p" className="max-w-3xl text-base leading-relaxed text-slate-400">
          HexaFlow was built by a five-member student team from {teamMeta.school} in {teamMeta.location}, through the {teamMeta.program} program.
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, i) => (
            <TeamMember key={member.name} member={member} index={i} />
          ))}
        </div>

        <Reveal as="p" delay={1} className="mt-8 text-sm text-hex-muted">
          {teamMeta.subtitle}
        </Reveal>
      </Section>

      {/* ── NASA HUNCH credit ─────────────────────────────────────────────── */}
      <Section id="nasa-hunch" eyebrow="Program Credit" title="NASA HUNCH">
        <Reveal>
          <div className="rounded-2xl border border-hex-line bg-hex-panel p-6">
            <p className="text-base leading-relaxed text-slate-300">
              HexaFlow was developed as part of <strong className="text-white">NASA HUNCH</strong> (High School Students United with NASA to Create Hardware), a program that pairs student teams with NASA engineers to build flight-grade hardware and experiments. The team tested at the NASA Glenn 2.2-Second Drop Tower in Ohio.
            </p>
          </div>
        </Reveal>
      </Section>
    </main>
  )
}