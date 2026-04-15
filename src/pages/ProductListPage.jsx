import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import { ProductCard } from '../components/ProductCard.jsx'

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
    <div className="container">
      <div
        className="card"
        style={{
          padding: 18,
          marginBottom: 14,
          background:
            'linear-gradient(90deg, rgba(254,189,105,0.35) 0%, rgba(255,255,255,0.92) 55%, rgba(255,255,255,0.92) 100%)',
          border: '1px solid rgba(213,217,217,0.9)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.2 }}>
              {title}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>
              {loading
                ? 'Loading products...'
                : `${products.length} product${products.length === 1 ? '' : 's'}`}
              {error ? ` • ${error.message}` : ''}
            </div>
          </div>
          <div style={{ alignSelf: 'center', color: 'var(--muted)', fontSize: 12 }}>
            Prime-style delivery, great deals, fast checkout
          </div>
        </div>
      </div>

      <div className="gridLayout">
        <aside className="card" style={{ padding: 12, alignSelf: 'start' }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Department</div>
          <div style={{ display: 'grid', gap: 8 }}>
            <button
              className="btn secondary"
              style={{ textAlign: 'left' }}
              onClick={() => setCategory('')}
            >
              All categories
            </button>
            {categories.map((c) => (
              <button
                key={c}
                className={`btn ${c === category ? '' : 'secondary'}`}
                style={{ textAlign: 'left' }}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </aside>

        <section style={{ display: 'grid', gap: 12 }}>

          <div
            className="productGrid"
          >
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {!loading && products.length === 0 ? (
            <div className="card" style={{ padding: 16 }}>
              No products found.
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}

