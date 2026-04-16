import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../state/cart.jsx'
import { api } from '../lib/api.js'
import { useAuth } from '../state/auth.jsx'

function formatINR(n) {
  return `₹${Number(n).toFixed(0)}`
}

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const validatePhone = (phone) => {
  return /^\d{10}$/.test(phone.replace(/\D/g, ''))
}

const validatePostal = (postal) => {
  return /^\d{5,6}$/.test(postal.replace(/\D/g, ''))
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, subtotal, refresh } = useCart()
  const { user } = useAuth()
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

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

  const validateForm = () => {
    const errors = {}

    if (!shipping.fullName.trim()) errors.fullName = 'Full name is required'
    if (!shipping.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!validatePhone(shipping.phone)) {
      errors.phone = 'Phone number must be 10 digits'
    }
    if (!shipping.addressLine1.trim()) errors.addressLine1 = 'Address line 1 is required'
    if (!shipping.city.trim()) errors.city = 'City is required'
    if (!shipping.state.trim()) errors.state = 'State is required'
    if (!shipping.postalCode.trim()) {
      errors.postalCode = 'Postal code is required'
    } else if (!validatePostal(shipping.postalCode)) {
      errors.postalCode = 'Postal code must be 5-6 digits'
    }
    if (!shipping.country.trim()) errors.country = 'Country is required'

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function placeOrder() {
    if (!validateForm()) {
      setError(new Error('Please fill in all required fields correctly'))
      return
    }

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
    if (!validateForm()) {
      setError(new Error('Please fill in all required fields correctly'))
      return
    }

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

  const handleInputChange = (field, value) => {
    setShipping((s) => ({ ...s, [field]: value }))
    // Clear error for this field when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="container">
      {!user ? (
        <div className="card" style={{ padding: 16, marginBottom: 12, background: 'rgba(255, 153, 0, 0.1)', border: '1px solid rgba(255, 153, 0, 0.2)' }}>
          Please <b style={{ color: 'var(--amazon-accent)' }}>sign in</b> to checkout.{' '}
          <a href={`/login?next=${encodeURIComponent('/checkout')}`}>Sign in</a>
        </div>
      ) : null}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
        <section className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>Checkout</div>

          {error ? (
            <div className="alert error" style={{ marginBottom: 16 }}>
              {error.message}
            </div>
          ) : null}

          <div style={{ fontWeight: 900, marginBottom: 12 }}>Shipping address</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div className="form-group">
              <label style={{ fontSize: 13 }}>Full name *</label>
              <input
                value={shipping.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                className={fieldErrors.fullName ? 'error' : ''}
                style={{ height: 38, padding: '0 10px' }}
              />
              {fieldErrors.fullName && <div className="error-text">{fieldErrors.fullName}</div>}
            </div>
            <div className="form-group">
              <label style={{ fontSize: 13 }}>Phone *</label>
              <input
                value={shipping.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="10-digit phone number"
                className={fieldErrors.phone ? 'error' : ''}
                style={{ height: 38, padding: '0 10px' }}
              />
              {fieldErrors.phone && <div className="error-text">{fieldErrors.phone}</div>}
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 13 }}>Address line 1 *</label>
              <input
                value={shipping.addressLine1}
                onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                placeholder="Enter your address"
                className={fieldErrors.addressLine1 ? 'error' : ''}
                style={{ height: 38, padding: '0 10px' }}
              />
              {fieldErrors.addressLine1 && <div className="error-text">{fieldErrors.addressLine1}</div>}
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 13 }}>Address line 2 (optional)</label>
              <input
                value={shipping.addressLine2}
                onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                placeholder="Apartment, floor, etc."
                style={{ height: 38, padding: '0 10px' }}
              />
            </div>
            <div className="form-group">
              <label style={{ fontSize: 13 }}>City *</label>
              <input
                value={shipping.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Enter city"
                className={fieldErrors.city ? 'error' : ''}
                style={{ height: 38, padding: '0 10px' }}
              />
              {fieldErrors.city && <div className="error-text">{fieldErrors.city}</div>}
            </div>
            <div className="form-group">
              <label style={{ fontSize: 13 }}>State *</label>
              <input
                value={shipping.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="Enter state"
                className={fieldErrors.state ? 'error' : ''}
                style={{ height: 38, padding: '0 10px' }}
              />
              {fieldErrors.state && <div className="error-text">{fieldErrors.state}</div>}
            </div>
            <div className="form-group">
              <label style={{ fontSize: 13 }}>Postal code *</label>
              <input
                value={shipping.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                placeholder="5-6 digit postal code"
                className={fieldErrors.postalCode ? 'error' : ''}
                style={{ height: 38, padding: '0 10px' }}
              />
              {fieldErrors.postalCode && <div className="error-text">{fieldErrors.postalCode}</div>}
            </div>
            <div className="form-group">
              <label style={{ fontSize: 13 }}>Country *</label>
              <input
                value={shipping.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="Enter country"
                className={fieldErrors.country ? 'error' : ''}
                style={{ height: 38, padding: '0 10px' }}
              />
              {fieldErrors.country && <div className="error-text">{fieldErrors.country}</div>}
            </div>
          </div>

          <div style={{ marginTop: 20, fontWeight: 900, marginBottom: 12 }}>
            Review items ({items.length})
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {items.map((it) => (
              <div
                key={it.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr auto',
                  gap: 12,
                  alignItems: 'flex-start',
                  padding: 12,
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 8,
                }}
              >
                <img
                  src={
                    it.product.images?.[0] ||
                    'https://placehold.co/200x200?text=Product'
                  }
                  alt=""
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x200?text=Product' }}
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }}
                />
                <div style={{ fontSize: 13 }}>
                  <div style={{ fontWeight: 800, marginBottom: 4 }}>{it.product.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 12 }}>Qty: {it.quantity}</div>
                  {it.product.isPrime && (
                    <div style={{ color: '#0066c0', fontSize: 11, fontWeight: 600, marginTop: 4 }}>
                      ✓ Prime
                    </div>
                  )}
                </div>
                <div style={{ fontWeight: 900, textAlign: 'right' }}>
                  {formatINR(Number(it.product.price) * it.quantity)}
                </div>
              </div>
            ))}
            {items.length === 0 ? (
              <div style={{ color: 'var(--muted)', padding: 16, textAlign: 'center' }}>
                Your cart is empty.
              </div>
            ) : null}
          </div>
        </section>

        <aside className="card" style={{ padding: 16, alignSelf: 'start' }}>
          <div style={{ fontWeight: 900, marginBottom: 12, fontSize: 16 }}>Order Summary</div>
          <div style={{ display: 'grid', gap: 8, fontSize: 14, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 600 }}>{formatINR(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Delivery</span>
              <span style={{ color: '#008000', fontWeight: 600 }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tax</span>
              <span style={{ fontWeight: 600 }}>₹0</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 8 }} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 900,
                fontSize: 16,
                color: '#c60',
              }}
            >
              <span>Order total</span>
              <span>{formatINR(subtotal)}</span>
            </div>
          </div>

          <button
            className="btn"
            onClick={placeOrder}
            disabled={items.length === 0 || placing || !user}
            style={{ width: '100%', marginBottom: 10 }}
          >
            {placing ? 'Placing order…' : 'Place your order'}
          </button>

          <button
            className="btn secondary"
            onClick={payWithStripe}
            disabled={items.length === 0 || placing || !user}
            style={{ width: '100%' }}
          >
            Pay with Stripe
          </button>
        </aside>
      </div>
    </div>
  )
}

