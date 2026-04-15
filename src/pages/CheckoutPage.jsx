import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../state/cart.jsx'
import { api } from '../lib/api.js'
import { useAuth } from '../state/auth.jsx'

function formatINR(n) {
  return `₹${Number(n).toFixed(0)}`
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, subtotal, refresh } = useCart()
  const { user } = useAuth()
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState(null)

  const [shipping, setShipping] = useState({
    fullName: 'Default User',
    phone: '9999999999',
    addressLine1: '221B Baker Street',
    addressLine2: '',
    city: 'Mumbai',
    state: 'MH',
    postalCode: '400001',
    country: 'India',
  })

  async function placeOrder() {
    setPlacing(true)
    setError(null)
    try {
      const res = await api.placeOrder({ shipping })
      await refresh()
      navigate(`/order/${res.orderId}`)
    } catch (e) {
      setError(e)
    } finally {
      setPlacing(false)
    }
  }

  async function payWithStripe() {
    setPlacing(true)
    setError(null)
    try {
      const s = await api.createStripeCheckoutSession()
      if (s.url) window.location.href = s.url
      else setError(new Error('Stripe session missing URL'))
    } catch (e) {
      setError(e)
      setPlacing(false)
    }
  }

  return (
    <div className="container">
      {!user ? (
        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          Please <b>sign in</b> to checkout.{' '}
          <a href={`/login?next=${encodeURIComponent('/checkout')}`}>Sign in</a>
        </div>
      ) : null}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
        <section className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>Checkout</div>

          <div style={{ fontWeight: 900, marginBottom: 8 }}>Shipping address</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <input
              value={shipping.fullName}
              onChange={(e) => setShipping((s) => ({ ...s, fullName: e.target.value }))}
              placeholder="Full name"
              style={{ height: 38, padding: '0 10px' }}
            />
            <input
              value={shipping.phone}
              onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
              placeholder="Phone"
              style={{ height: 38, padding: '0 10px' }}
            />
            <input
              value={shipping.addressLine1}
              onChange={(e) =>
                setShipping((s) => ({ ...s, addressLine1: e.target.value }))
              }
              placeholder="Address line 1"
              style={{ height: 38, padding: '0 10px', gridColumn: '1 / -1' }}
            />
            <input
              value={shipping.addressLine2}
              onChange={(e) =>
                setShipping((s) => ({ ...s, addressLine2: e.target.value }))
              }
              placeholder="Address line 2 (optional)"
              style={{ height: 38, padding: '0 10px', gridColumn: '1 / -1' }}
            />
            <input
              value={shipping.city}
              onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
              placeholder="City"
              style={{ height: 38, padding: '0 10px' }}
            />
            <input
              value={shipping.state}
              onChange={(e) => setShipping((s) => ({ ...s, state: e.target.value }))}
              placeholder="State"
              style={{ height: 38, padding: '0 10px' }}
            />
            <input
              value={shipping.postalCode}
              onChange={(e) =>
                setShipping((s) => ({ ...s, postalCode: e.target.value }))
              }
              placeholder="Postal code"
              style={{ height: 38, padding: '0 10px' }}
            />
            <input
              value={shipping.country}
              onChange={(e) => setShipping((s) => ({ ...s, country: e.target.value }))}
              placeholder="Country"
              style={{ height: 38, padding: '0 10px' }}
            />
          </div>

          <div style={{ marginTop: 16, fontWeight: 900, marginBottom: 8 }}>
            Review items
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {items.map((it) => (
              <div
                key={it.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr auto',
                  gap: 10,
                  alignItems: 'center',
                }}
              >
                <img
                  src={
                    it.product.images?.[0] ||
                    'https://placehold.co/200x200?text=Product'
                  }
                  alt=""
                  style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
                />
                <div style={{ fontSize: 13 }}>
                  <div style={{ fontWeight: 800 }}>{it.product.name}</div>
                  <div style={{ color: 'var(--muted)' }}>Qty: {it.quantity}</div>
                </div>
                <div style={{ fontWeight: 900 }}>
                  {formatINR(Number(it.product.price) * it.quantity)}
                </div>
              </div>
            ))}
            {items.length === 0 ? (
              <div style={{ color: 'var(--muted)' }}>Your cart is empty.</div>
            ) : null}
          </div>
        </section>

        <aside className="card" style={{ padding: 16, alignSelf: 'start' }}>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>Order Summary</div>
          <div style={{ display: 'grid', gap: 6, fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Items</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Delivery</span>
              <span>₹0</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tax</span>
              <span>₹0</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 6 }} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 900,
              }}
            >
              <span>Order total</span>
              <span>{formatINR(subtotal)}</span>
            </div>
          </div>

          {error ? (
            <div style={{ marginTop: 10, color: '#b12704', fontSize: 13 }}>
              {error.message}
            </div>
          ) : null}

          <button
            className="btn"
            onClick={placeOrder}
            disabled={items.length === 0 || placing || !user}
            style={{ width: '100%', marginTop: 12 }}
          >
            {placing ? 'Placing order…' : 'Place your order'}
          </button>

          <button
            className="btn secondary"
            onClick={payWithStripe}
            disabled={items.length === 0 || placing || !user}
            style={{ width: '100%', marginTop: 10 }}
          >
            Pay with Stripe
          </button>
        </aside>
      </div>
    </div>
  )
}

