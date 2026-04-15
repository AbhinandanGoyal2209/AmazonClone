import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../lib/api.js'

export function OrderConfirmationPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [order, setOrder] = useState(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    ;(async () => {
      try {
        const data = await api.getOrder(id)
        if (!alive) return
        setOrder(data.order)
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

  return (
    <div className="container">
      <div className="card" style={{ padding: 16 }}>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>
          Order placed, thank you!
        </div>
        {loading ? (
          <div style={{ color: 'var(--muted)' }}>Loading order…</div>
        ) : error ? (
          <div style={{ color: '#b12704' }}>{error.message}</div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            <div>
              Your order ID is <b>{order.id}</b>
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>
              We&apos;ve sent (not really) a confirmation email. This is a demo per
              assignment.
            </div>
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <Link to="/">Continue shopping</Link>
        </div>
      </div>
    </div>
  )
}

