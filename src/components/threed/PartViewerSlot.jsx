import ModelViewer from './ModelViewer.jsx'
import { withBase } from '../../lib/withBase.js'

// Per-part section with a 3D viewer slot already built. If the part has a
// standalone model file (part.modelFile), it loads in ModelViewer. Otherwise it
// shows a styled "model file coming soon" placeholder with the part's image —
// so the section exists now and is ready to receive a dropped-in GLB later.
export default function PartViewerSlot({ part }) {
  const hasModel = !!part.modelFile
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2">
      <div>
        <div className="text-xs font-medium uppercase tracking-[0.2em] text-hex-gold/80">
          {part.subsystem}
        </div>
        <h3 className="mt-2 font-display text-2xl font-bold text-white">{part.name}</h3>
        <p className="mt-1 text-sm text-hex-gold/90">{part.role}</p>
        <p className="mt-4 leading-relaxed text-slate-300">{part.description}</p>
        {part.nativeFiles && part.nativeFiles.length > 0 && (
          <p className="mt-4 text-xs text-hex-muted2">
            Source files: {part.nativeFiles.map((f) => f.split('/').pop()).join(', ')}
          </p>
        )}
      </div>
      <div>
        {hasModel ? (
          <ModelViewer src={part.modelFile} caption={part.name} />
        ) : (
          <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden rounded-2xl border border-hex-line bg-hex-panel">
            {part.image ? (
              <img
                src={withBase(part.image)}
                alt={part.name}
                loading="lazy"
                className="h-full w-full object-cover opacity-80"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-hex-muted2">
                No preview available
              </div>
            )}
            <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-hex-bg/80 to-transparent p-4">
              <div className="rounded-full border border-hex-gold/40 bg-hex-bg/70 px-4 py-2 text-xs text-hex-gold/90 backdrop-blur">
                3D model file coming soon
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}