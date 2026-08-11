import Reveal from './Reveal.jsx'

// Consistent page section: max width, vertical rhythm, optional id + eyebrow.
export default function Section({ id, eyebrow, title, children, className = '' }) {
  return (
    <section id={id} className={`mx-auto w-full max-w-6xl px-6 py-24 ${className}`.trim()}>
      {eyebrow && (
        <Reveal>
          <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
            {eyebrow}
          </div>
        </Reveal>
      )}
      {title && (
        <Reveal>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">{title}</h2>
        </Reveal>
      )}
      {children}
    </section>
  )
}