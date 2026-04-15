import { Link } from 'react-router-dom'
import { useCart } from '../state/cart.jsx'

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
    <span aria-label={`${r.toFixed(1)} out of 5 stars`} style={{ color: '#f08804' }}>
      {stars}
    </span>
  )
}

export function ProductCard({ product }) {
  const { add } = useCart()
  const img = product.images?.[0]

  return (
    <div
      className="card"
      style={{
        padding: 12,
        display: 'grid',
        gap: 10,
        borderRadius: 10,
        boxShadow: 'rgba(15, 17, 17, 0.1) 0 2px 5px 0',
      }}
    >
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
        <div
          style={{
            background: '#f7f7f7',
            borderRadius: 8,
            height: 180,
            display: 'grid',
            placeItems: 'center',
            overflow: 'hidden',
          }}
        >
          <img
            src={img || 'https://placehold.co/600x600?text=Product'}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/600x600?text=No+Image'
            }}
          />
        </div>
        <div style={{ color: 'var(--text)', fontSize: 14, lineHeight: '18px' }}>
          {product.name}
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
        <Stars rating={product.rating} />
        <span style={{ color: 'var(--amazon-link)' }}>
          {Number(product.ratingCount || 0).toLocaleString()}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 20, fontWeight: 900 }}>{formatINR(product.price)}</span>
        <span style={{ color: 'var(--muted)', fontSize: 12 }}>
          M.R.P. <s>{formatINR(Math.round(Number(product.price) * 1.15))}</s>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {product.isPrime ? (
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: '#0f1111',
              background: '#dbefff',
              border: '1px solid #b7dfff',
              padding: '2px 6px',
              borderRadius: 999,
            }}
          >
            Prime
          </span>
        ) : null}
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>FREE Delivery</span>
      </div>

      <button className="btn" onClick={() => add(product.id, 1)}>
        Add to Cart
      </button>
    </div>
  )
}

