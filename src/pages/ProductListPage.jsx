import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import { ProductCard } from '../components/ProductCard.jsx'
import { TodaysDeal } from '../components/TodaysDeal.jsx'

export function ProductListPage() {
  const [params, setParams] = useSearchParams()
  const search = params.get('search') || ''
  const category = params.get('category') || ''

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const title = useMemo(() => {
    if (category) return category
    if (search) return `Results for "${search}"`
    return 'Featured products'
  }, [category, search])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const cats = await api.listCategories()
        if (!alive) return
        setCategories(cats.categories || [])
      } catch {
        // categories are optional; ignore
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    ;(async () => {
      try {
        const data = await api.listProducts({ search, category })
        if (!alive) return
        setProducts(data.products || [])
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
  }, [search, category])

  function setCategory(next) {
    const p = new URLSearchParams(params)
    if (next) p.set('category', next)
    else p.delete('category')
    setParams(p, { replace: true })
  }

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 24 }}>
      {/* Hero Banner */}
      <div className="promo-banner">
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="promo-title" style={{ color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{title}</div>
          <div className="promo-desc">
            {loading
              ? '⏳ Fetching the best products...'
              : `Discovered ${products.length} premium product${products.length === 1 ? '' : 's'} just for you.`}
            {error ? ` • ⚠️ ${error.message}` : ''}
          </div>
        </div>
        {/* Decorative 3D elements in banner */}
        <div style={{ position: 'absolute', right: '-5%', top: '-20%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(255,153,0,0.4) 0%, transparent 60%)', filter: 'blur(30px)', opacity: 0.8 }} />
      </div>

      <div className="gridLayout">
        {/* Sidebar */}
        <aside className="card" style={{ padding: 20, alignSelf: 'start', position: 'sticky', top: 100 }}>
          <div style={{ fontWeight: 800, marginBottom: 16, fontSize: 18, color: 'var(--text)' }}>
            🏷️ Departments
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            <button
              className={`btn ${!category ? '' : 'secondary'}`}
              style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              onClick={() => setCategory('')}
            >
              <span>All Premium</span>
              {!category && <span>✨</span>}
            </button>
            {categories.map((c) => (
              <button
                key={c}
                className={`btn ${c === category ? '' : 'secondary'}`}
                style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => setCategory(c)}
              >
                <span>{c}</span>
                {c === category && <span>✨</span>}
              </button>
            ))}
          </div>
        </aside>

        <section style={{ display: 'grid', gap: 24 }}>
          {/* Today's Deals Block */}
          {!search && !category && products.length > 0 ? (
            <div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  marginBottom: 16,
                  color: 'var(--text)',
                }}
              >
                ⚡ <span className="gradient-text">Today's Deals</span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 16,
                  marginBottom: 32,
                }}
              >
                {products.slice(0, 4).map((p) => (
                  <TodaysDeal key={p.id} product={p} />
                ))}
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: 32 }} />
            </div>
          ) : null}

          {/* Main Product Grid */}
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 16 }}>
              📦 <span className="gradient-text">Featured Selection</span>
            </div>
            <div className="productGrid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          {!loading && products.length === 0 ? (
            <div className="card" style={{ padding: 32, textAlign: 'center', fontSize: 18 }}>
              No products found.
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}

