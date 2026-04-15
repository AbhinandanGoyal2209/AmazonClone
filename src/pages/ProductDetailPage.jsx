import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useCart } from '../state/cart.jsx'
import { ImageCarousel } from '../components/ImageCarousel.jsx'

export function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { add } = useCart()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [product, setProduct] = useState(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    ;(async () => {
      try {
        const data = await api.getProduct(id)
        if (!alive) return
        setProduct(data.product)
      } catch (e) {
        if (!alive) return
        setError(e)
      } finally {
        if (!alive) return
        setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [id])

  async function onAdd() {
    await add(product.id, 1)
  }

  async function onBuyNow() {
    await onAdd()
    navigate('/checkout')
  }

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ padding: 16 }}>
          Loading…
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container">
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Product not found</div>
          <div style={{ color: 'var(--muted)' }}>{error?.message}</div>
          <div style={{ marginTop: 12 }}>
            <Link to="/">Back to products</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ marginBottom: 10, fontSize: 13 }}>
        <Link to="/">Products</Link> <span style={{ color: 'var(--muted)' }}>›</span>{' '}
        <span style={{ color: 'var(--muted)' }}>{product.category}</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 320px',
          gap: 16,
          alignItems: 'start',
        }}
      >
        <ImageCarousel images={product.images} />

        <div className="card" style={{ padding: 16, display: 'grid', gap: 10 }}>
          <div style={{ fontSize: 20, fontWeight: 900, lineHeight: '26px' }}>
            {product.name}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>
            Brand: <span style={{ color: 'var(--amazon-link)' }}>{product.brand}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <span style={{ color: '#f08804', fontWeight: 900 }}>
              {Number(product.rating || 0).toFixed(1)}
            </span>
            <span style={{ color: '#f08804' }} aria-hidden="true">
              {'★'.repeat(Math.round(Number(product.rating || 0)))}
            </span>
            <span style={{ color: 'var(--amazon-link)' }}>
              {Number(product.ratingCount || 0).toLocaleString()} ratings
            </span>
          </div>

          <div style={{ borderTop: '1px solid var(--border)' }} />

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <div style={{ fontSize: 26, fontWeight: 900 }}>
              ₹{Number(product.price).toFixed(0)}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>
              M.R.P. <s>₹{Math.round(Number(product.price) * 1.15)}</s>
            </div>
          </div>

          <div style={{ color: 'var(--muted)', fontSize: 14 }}>{product.description}</div>

          <div style={{ display: 'grid', gap: 6 }}>
            <div style={{ fontWeight: 800 }}>Specifications</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--muted)' }}>
              {(product.specs || []).slice(0, 6).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="card" style={{ padding: 16, display: 'grid', gap: 10 }}>
          <div style={{ fontSize: 18, fontWeight: 900 }}>
            ₹{Number(product.price).toFixed(0)}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>
            FREE delivery Tomorrow. Order within 2 hrs.
          </div>
          <div style={{ fontWeight: 800, color: product.stock > 0 ? '#007600' : '#b12704' }}>
            {product.stock > 0 ? 'In stock' : 'Out of stock'}
          </div>
          <button className="btn" onClick={onAdd} disabled={product.stock <= 0}>
            Add to Cart
          </button>
          <button className="btn secondary" onClick={onBuyNow} disabled={product.stock <= 0}>
            Buy Now
          </button>
          {product.isPrime ? (
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              Prime eligible • Free delivery
            </div>
          ) : null}
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            Sold by <span style={{ color: 'var(--amazon-link)' }}>Amazon Clone</span> and
            Fulfilled by Amazon Clone.
          </div>
        </aside>
      </div>
    </div>
  )
}

