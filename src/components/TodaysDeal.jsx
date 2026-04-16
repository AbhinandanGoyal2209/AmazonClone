import { Link } from 'react-router-dom'
import { useCart } from '../state/cart.jsx'
import { useState } from 'react'

function formatINR(n) {
  return `₹${Number(n).toFixed(0)}`
}

function Stars({ rating }) {
  const r = Math.max(0, Math.min(5, Number(rating) || 0))
  const full = Math.floor(r)
  const half = r - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  const stars = [
    ...Array.from({ length: full }, () => '★'),
    ...(half ? ['⯪'] : []),
    ...Array.from({ length: empty }, () => '☆'),
  ].join('')
  return (
    <span aria-label={`${r.toFixed(1)} out of 5 stars`} style={{ color: 'var(--amazon-accent)', textShadow: '0 0 5px rgba(255,153,0,0.4)' }}>
      {stars}
    </span>
  )
}

export function TodaysDeal({ product }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const img = product.images?.[0]
  
  const discountPercent = Math.floor(Math.random() * 20) + 10

  const handleAdd = (e) => {
    e.preventDefault()
    add(product.id, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="card card-3d"
        style={{
          padding: 16,
          cursor: 'pointer',
          border: '1px solid var(--border)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'linear-gradient(135deg, #ff5252, #d50000)',
            color: '#fff',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 800,
            zIndex: 10,
            boxShadow: '0 4px 10px rgba(255,82,82,0.4)'
          }}
        >
          {discountPercent}% OFF
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.02)',
            borderRadius: 12,
            height: 180,
            display: 'grid',
            placeItems: 'center',
            overflow: 'hidden',
            marginBottom: 16,
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
          }}
        >
          {img ? (
            <img
              src={img}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400?text=No+Image' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          ) : (
             <div style={{ color: 'var(--muted)' }}>No image</div>
          )}
        </div>

        <div style={{ fontSize: 13, display: 'grid', gap: 6 }}>
          <div className="text-clamp" style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.3, color: '#fff' }}>{product.name}</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <Stars rating={product.rating} />
            <span style={{ color: 'var(--muted)' }}>({product.ratingCount})</span>
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>
            {product.brand}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
            <span className="gradient-text" style={{ fontSize: 20, fontWeight: 900 }}>
              {formatINR(product.price)}
            </span>
            {product.isPrime && (
              <span
                style={{
                  background: 'linear-gradient(135deg, #29b6f6, #0288d1)',
                  color: '#fff',
                  padding: '2px 6px',
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 800,
                }}
              >
                PRIME
              </span>
            )}
          </div>
        </div>

        <button
          className="btn"
          onClick={handleAdd}
          style={{
            width: '100%',
            marginTop: 16,
            background: added ? '#4caf50' : ''
          }}
        >
          {added ? '✓ Added' : 'Add to cart'}
        </button>
      </div>
    </Link>
  )
}
