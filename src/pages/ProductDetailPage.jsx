import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useCart } from '../state/cart.jsx'
import { useWishlist } from '../state/wishlist.jsx'
import { ImageCarousel } from '../components/ImageCarousel.jsx'
import { ProductCard } from '../components/ProductCard.jsx'

export function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { add } = useCart()
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  
  const inWishlist = product ? isInWishlist(product.id) : false

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    ;(async () => {
      try {
        const data = await api.getProduct(id)
        if (!alive) return
        setProduct(data.product)

        // Fetch related products
        const relatedData = await api.listProducts({ category: data.product.category })
        if (!alive) return
        setRelated(relatedData.products.filter(p => p.id !== data.product.id).slice(0, 4))

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
      <div className="container" style={{ padding: '40px 0' }}>
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div className="spinner"></div><br/><br/>
          Loading premium details...
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '40px 0' }}>
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontWeight: 900, fontSize: 24, marginBottom: 8, color: 'var(--danger)' }}>Product not found</div>
          <div style={{ color: 'var(--muted)', marginBottom: 20 }}>{error?.message}</div>
          <Link to="/" className="btn">Back to products</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: 20, fontSize: 13 }}>
        <Link to="/">Products</Link> <span style={{ color: 'var(--amazon-accent)', margin: '0 8px' }}>›</span>{' '}
        <span style={{ color: 'var(--muted)' }}>{product.category}</span>
      </div>

      <div
        className="gridLayout"
        style={{
          gridTemplateColumns: '1.2fr 1fr 340px',
          alignItems: 'start',
        }}
      >
        <div style={{ position: 'relative' }}>
           <ImageCarousel images={product.images} />
           <button 
             className={`wishlist-btn ${inWishlist ? 'active' : ''}`} 
             style={{ top: 20, right: 20, width: 44, height: 44, fontSize: 22 }}
             onClick={() => toggleWishlist(product)}
             title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
           >
             {inWishlist ? '❤️' : '🤍'}
           </button>
        </div>

        <div className="card" style={{ padding: 24, display: 'grid', gap: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.2 }}>
            {product.name}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>
            Brand: <span style={{ color: 'var(--amazon-link)', fontWeight: 600 }}>{product.brand}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
             <span aria-hidden="true" style={{ color: 'var(--amazon-accent)', fontSize: 20, textShadow: '0 0 10px rgba(255,153,0,0.5)' }}>
              {'★'.repeat(Math.round(Number(product.rating || 0)))}
              {'☆'.repeat(5 - Math.round(Number(product.rating || 0)))}
            </span>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>
              {Number(product.rating || 0).toFixed(1)}
            </span>
            <span style={{ color: 'var(--amazon-link)' }}>
              ({Number(product.ratingCount || 0).toLocaleString()} reviews)
            </span>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <div className="gradient-text" style={{ fontSize: 36, fontWeight: 900 }}>
              ₹{Number(product.price).toFixed(0)}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 14, textDecoration: 'line-through' }}>
              M.R.P. ₹{Math.round(Number(product.price) * 1.15)}
            </div>
          </div>

          <div style={{ color: '#ccc', fontSize: 15, lineHeight: 1.6 }}>{product.description}</div>

          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>Specifications</div>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#aaa', lineHeight: 1.7 }}>
              {(product.specs || []).slice(0, 6).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="card" style={{ padding: 24, display: 'grid', gap: 16, position: 'sticky', top: 100 }}>
          <div className="gradient-text" style={{ fontSize: 28, fontWeight: 900 }}>
            ₹{Number(product.price).toFixed(0)}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>
            <span style={{ color: '#4caf50', fontWeight: 600 }}>FREE delivery Tomorrow.</span> Order within 2 hrs.
          </div>
          
          <div style={{ fontWeight: 900, fontSize: 16, color: product.stock > 0 ? '#4caf50' : '#ff5252' }}>
            {product.stock > 0 ? '✓ In stock' : '✗ Out of stock'}
          </div>
          
          <div style={{ display: 'grid', gap: 12, marginTop: 8 }}>
             <button className="btn" onClick={onAdd} disabled={product.stock <= 0} style={{ padding: '14px', fontSize: 16 }}>
               Add to Cart
             </button>
             <button className="btn secondary" onClick={onBuyNow} disabled={product.stock <= 0} style={{ padding: '14px', fontSize: 16 }}>
               Buy Now
             </button>
          </div>

          {product.isPrime ? (
            <div style={{ marginTop: 8, padding: 12, background: 'rgba(41, 182, 246, 0.1)', border: '1px solid rgba(41, 182, 246, 0.3)', borderRadius: 8, fontSize: 13, color: '#fff' }}>
              💎 <strong>Prime eligible</strong> • Free delivery & returns
            </div>
          ) : null}
          
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            Sold by <span style={{ color: 'var(--amazon-link)' }}>Amazon Clone</span> and
            Fulfilled by Amazon Clone.
          </div>
        </aside>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
         <div style={{ marginTop: 60 }}>
            <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 20 }}>
               🔥 <span className="gradient-text">Related Products</span>
            </div>
            <div className="productGrid">
               {related.map(p => (
                  <ProductCard key={p.id} product={p} />
               ))}
            </div>
         </div>
      )}
      
      <style>{`
        @media (max-width: 1024px) {
          .gridLayout { grid-template-columns: 1fr 300px !important; }
        }
        @media (max-width: 768px) {
          .gridLayout { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </div>
  )
}
