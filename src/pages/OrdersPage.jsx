import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'

export function OrdersPage() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    api.listOrders()
      .then((data) => {
        if (alive) {
          setOrders(data.orders || [])
          setLoading(false)
        }
      })
      .catch((e) => {
        if (alive) {
          setError(e)
          setLoading(false)
        }
      })
    return () => {
      alive = false
    }
  }, [])

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <div className="spinner"></div><br /><br />
        Loading your orders...
      </div>
    )
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <div className="alert error">Failed to load orders: {error.message}</div>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <h1 className="gradient-text" style={{ fontSize: 32, fontWeight: 900, marginBottom: 24 }}>Your Orders</h1>
      {orders.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📦</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No orders yet</div>
          <div style={{ color: 'var(--muted)', marginBottom: 24 }}>Looks like you haven't placed any orders.</div>
          <Link to="/" className="btn">Continue Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 20 }}>
          {orders.map((order) => (
            <div key={order.id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>ORDER PLACED</div>
                  <div style={{ fontWeight: 600 }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>TOTAL</div>
                  <div style={{ fontWeight: 600 }}>₹{order.subtotal}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>ORDER # {order.id}</div>
                  <Link to={`/order/${order.id}`} style={{ fontSize: 13, fontWeight: 600 }}>View Order Details</Link>
                </div>
              </div>
              <div style={{ display: 'grid', gap: 16 }}>
                {order.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.05)', borderRadius: 8, overflow: 'hidden', padding: 8 }}>
                      <img src={item.product?.images?.[0] || 'https://placehold.co/100x100?text=Item'} alt={item.product?.name} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100?text=Item' }} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Link to={`/product/${item.product?.id}`} style={{ color: '#fff', fontWeight: 600, fontSize: 16, display: 'block', marginBottom: 4 }}>
                        {item.product?.name}
                      </Link>
                      <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                        Qty: {item.quantity} | ₹{item.unitPrice}
                      </div>
                    </div>
                    <div>
                      <Link to={`/product/${item.product?.id}`} className="btn secondary" style={{ fontSize: 13, padding: '6px 12px' }}>Buy it again</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
