import { Link } from 'react-router-dom'
import { useCart } from '../state/cart.jsx'
import { useWishlist } from '../state/wishlist.jsx'
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

export function ProductCard({ product }) {
  const { add } = useCart()
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist()
  const [isAdded, setIsAdded] = useState(false)
  const img = product.images?.[0]
  
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    add(product.id, 1)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <button 
        className={`wishlist-btn ${inWishlist ? 'active' : ''}`} 
        onClick={handleWishlist}
        title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        {inWishlist ? '❤️' : '🤍'}
      </button>

      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', display: 'flex', flex: 1 }}>
        <div
          className="card card-3d"
          style={{
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            cursor: 'pointer',
            flex: 1
          }}
        >
          {/* Image Container */}
          <div
            style={{
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 12,
              height: 220,
              display: 'grid',
              placeItems: 'center',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
            }}
          >
            <img
              src={img || 'https://placehold.co/600x600?text=Product'}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
              loading="lazy"
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/600x600?text=No+Image'
              }}
            />
            {product.isPrime && (
              <div
                style={{
                  position: 'absolute', top: 10, left: 10,
                  background: 'linear-gradient(135deg, #29b6f6, #0288d1)',
                  color: '#fff', padding: '4px 10px',
                  borderRadius: 6, fontSize: 11, fontWeight: 800,
                  boxShadow: '0 4px 10px rgba(41, 182, 246, 0.4)'
                }}
              >
                PRIME
              </div>
            )}
          </div>

          <div className="flex-col justify-between" style={{ flex: 1, gap: 10 }}>
            <div>
               <div className="text-clamp" style={{ fontSize: 15, fontWeight: 600, color: '#fff', minHeight: 44, lineHeight: 1.4 }}>
                 {product.name}
               </div>

               <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginTop: 8 }}>
                 <Stars rating={product.rating} />
                 <span style={{ color: 'var(--amazon-link)' }}>
                   {Number(product.ratingCount || 0).toLocaleString()}
                 </span>
               </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span className="gradient-text" style={{ fontSize: 22, fontWeight: 900 }}>
                {formatINR(product.price)}
              </span>
              <span style={{ color: 'var(--muted)', fontSize: 13, textDecoration: 'line-through' }}>
                {formatINR(Math.round(Number(product.price) * 1.15))}
              </span>
            </div>

            <button
              className="btn flex justify-center items-center"
              onClick={handleAddToCart}
              style={{ width: '100%', marginTop: 'auto', background: isAdded ? '#4caf50' : '' }}
            >
              {isAdded ? '✓ Added' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}
