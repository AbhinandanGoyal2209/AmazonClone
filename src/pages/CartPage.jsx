import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../state/cart.jsx'

function formatINR(n) {
  return `₹${Number(n).toFixed(0)}`
}

export function CartPage() {
  const navigate = useNavigate()
  const { loading, items, subtotal, setQty, remove } = useCart()

  return (
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        <section className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>
            Shopping Cart
          </div>

          {loading ? (
            <div style={{ color: 'var(--muted)' }}>Loading…</div>
          ) : items.length === 0 ? (
            <div style={{ color: 'var(--muted)' }}>
              Your cart is empty. <Link to="/">Continue shopping</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {items.map((it) => (
                <div
                  key={it.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr 140px',
                    gap: 12,
                    paddingTop: 12,
                    borderTop: '1px solid var(--border)',
                    alignItems: 'start',
                  }}
                >
                  <img
                    src={
                      it.product.images?.[0] || 'https://placehold.co/300x300?text=Product'
                    }
                    alt={it.product.name}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x300?text=Product' }}
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 8,
                      background: 'rgba(255, 255, 255, 0.05)',
                    }}
                  />

                  <div style={{ display: 'grid', gap: 6 }}>
                    <Link to={`/product/${it.productId}`} style={{ color: 'var(--text)' }}>
                      <div style={{ fontWeight: 800 }}>{it.product.name}</div>
                    </Link>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {it.product.stock > 0 ? 'In stock' : 'Out of stock'}
                    </div>

                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <label style={{ fontSize: 12, color: 'var(--muted)' }}>
                        Qty:{' '}
                        <select
                          value={it.quantity}
                          onChange={(e) => setQty(it.id, Number(e.target.value))}
                        >
                          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        className="btn secondary"
                        onClick={() => remove(it.id)}
                        style={{ padding: '6px 10px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div style={{ justifySelf: 'end', fontWeight: 900 }}>
                    {formatINR(Number(it.product.price) * it.quantity)}
                  </div>
                </div>
              ))}

              <div style={{ textAlign: 'right', marginTop: 8, fontWeight: 900 }}>
                Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items):{' '}
                {formatINR(subtotal)}
              </div>
            </div>
          )}
        </section>

        <aside className="card" style={{ padding: 16, alignSelf: 'start' }}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>
            Subtotal: {formatINR(subtotal)}
          </div>
          <button
            className="btn"
            onClick={() => navigate('/checkout')}
            disabled={items.length === 0}
            style={{ width: '100%' }}
          >
            Proceed to checkout
          </button>
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--muted)' }}>
            No login required. Default user is assumed.
          </div>
        </aside>
      </div>
    </div>
  )
}

