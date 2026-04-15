import { useMemo, useState } from 'react'

export function ImageCarousel({ images }) {
  const items = useMemo(() => (images || []).filter(Boolean), [images])
  const [idx, setIdx] = useState(0)

  const safeIdx = Math.min(idx, Math.max(items.length - 1, 0))
  const active = items[safeIdx] || 'https://placehold.co/900x600?text=Product'

  function prev() {
    setIdx((i) => (items.length ? (i - 1 + items.length) % items.length : 0))
  }
  function next() {
    setIdx((i) => (items.length ? (i + 1) % items.length : 0))
  }

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div
        className="card"
        style={{
          padding: 10,
          display: 'grid',
          placeItems: 'center',
          height: 420,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          src={active}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/900x600?text=No+Image'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 10,
            pointerEvents: 'none',
          }}
        >
          <button
            type="button"
            className="btn secondary"
            onClick={prev}
            style={{ pointerEvents: 'auto' }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            className="btn secondary"
            onClick={next}
            style={{ pointerEvents: 'auto' }}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      </div>

      {items.length > 1 ? (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {items.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setIdx(i)}
              className="card"
              style={{
                width: 64,
                height: 64,
                padding: 0,
                overflow: 'hidden',
                border: i === safeIdx ? '2px solid var(--amazon-link)' : undefined,
                cursor: 'pointer',
              }}
              aria-label={`Select image ${i + 1}`}
            >
              <img
                src={src}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/200x200?text=No+Image'
                }}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

