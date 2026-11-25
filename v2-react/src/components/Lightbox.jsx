import { useEffect, useState } from 'react'
import { withBase } from '../lib/withBase.js'

// Responsive photo grid + lightbox with keyboard nav.
export default function PhotoGallery({ images = [], columns = 3, className = '' }) {
  const [index, setIndex] = useState(null)
  const open = index !== null

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setIndex(null)
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % images.length)
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, images.length])

  return (
    <>
      <div
        className={`grid gap-3 ${className}`}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="group overflow-hidden rounded-xl border border-hex-line bg-hex-panel"
          >
            <img
              src={withBase(typeof img === 'string' ? img : img.src)}
              alt={typeof img === 'string' ? '' : img.alt || ''}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-6"
          onClick={() => setIndex(null)}
        >
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-hex-line bg-hex-bg/70 p-3 text-white hover:bg-hex-panel"
            onClick={(e) => { e.stopPropagation(); setIndex((i) => (i - 1 + images.length) % images.length) }}
          >
            ‹
          </button>
          <img
            src={withBase(typeof images[index] === 'string' ? images[index] : images[index].src)}
            alt=""
            className="max-h-[85vh] max-w-[85vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-hex-line bg-hex-bg/70 p-3 text-white hover:bg-hex-panel"
            onClick={(e) => { e.stopPropagation(); setIndex((i) => (i + 1) % images.length) }}
          >
            ›
          </button>
          <div className="absolute right-6 top-6 text-sm text-hex-muted">
            {index + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}