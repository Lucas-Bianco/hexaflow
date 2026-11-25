import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../../lib/useReducedMotion.js'
import { withBase } from '../../lib/withBase.js'

gsap.registerPlugin(ScrollTrigger)

// The signature scroll piece for the drop test. Multiple drop runs are shown
// side by side; one scroll progress drives the visible frame index across all
// runs simultaneously so you can scrub through the 3 drops in sync and compare.
// Frames are not required at build time: when a run has no frames, a styled
// placeholder ("frames coming soon") is shown so the section still works.
export default function DropRunScrubber({ runs = [], height = '70vh' }) {
  const ref = useRef(null)
  const [frame, setFrame] = useState(0)
  const reduced = useReducedMotion()
  const maxFrames = runs.reduce((m, r) => Math.max(m, (r.frames || []).length), 0)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced || maxFrames < 2) return
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: 1,
      onUpdate: (self) => setFrame(Math.round(self.progress * (maxFrames - 1)))
    })
    return () => st.kill()
  }, [maxFrames, reduced])

  return (
    <div ref={ref} className="w-full">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" style={{ minHeight: height }}>
        {runs.map((run) => {
          const frames = run.frames || []
          const active = Math.min(frame, frames.length - 1)
          return (
            <div key={run.id} className="flex flex-col rounded-2xl border border-hex-line bg-hex-panel">
              <div className="border-b border-hex-line p-3">
                <div className="font-display text-sm font-bold text-white">{run.label}</div>
                {run.note && <div className="mt-0.5 text-xs text-hex-muted2">{run.note}</div>}
              </div>
              <div className="relative flex-1 overflow-hidden">
                {frames.length === 0 ? (
                  <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-2 p-6 text-center">
                    <div className="rounded-full border border-hex-gold/40 bg-hex-gold/10 px-3 py-1 text-xs text-hex-gold">
                      Frames coming soon
                    </div>
                    <div className="text-xs text-hex-muted2">
                      {run.placeholder || 'Drop run frame strip will be added here.'}
                    </div>
                  </div>
                ) : (
                  <img
                    src={withBase(frames[active])}
                    alt={`${run.label} frame ${active + 1}`}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="border-t border-hex-line px-3 py-2 text-xs text-hex-muted2">
                {frames.length > 0
                  ? `Frame ${active + 1} / ${frames.length}`
                  : 'Awaiting frame ingest'}
              </div>
            </div>
          )
        })}
      </div>
      {maxFrames > 1 && !reduced && (
        <div className="mt-3 text-center text-xs text-hex-muted2">
          Scroll to scrub through the drops — frame {frame + 1} / {maxFrames}
        </div>
      )}
    </div>
  )
}