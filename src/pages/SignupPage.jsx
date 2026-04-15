import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/auth.jsx'

export function SignupPage() {
  const { signup } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const next = new URLSearchParams(loc.search).get('next') || '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signup(name, email, password)
      nav(next)
    } catch (e2) {
      setError(e2)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ display: 'grid', placeItems: 'center' }}>
      <div className="card" style={{ padding: 18, width: 380, maxWidth: '100%' }}>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>
          Create account
        </div>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
          <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>
            Your name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              style={{ height: 38, padding: '0 10px' }}
            />
          </label>
          <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ height: 38, padding: '0 10px' }}
            />
          </label>
          <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="At least 6 characters"
              style={{ height: 38, padding: '0 10px' }}
            />
          </label>
          {error ? <div style={{ color: '#b12704', fontSize: 13 }}>{error.message}</div> : null}
          <button className="btn" disabled={loading}>
            {loading ? 'Creating…' : 'Create your Amazon Clone account'}
          </button>
        </form>

        <div style={{ marginTop: 12, fontSize: 13, color: 'var(--muted)' }}>
          Already have an account? <Link to={`/login?next=${encodeURIComponent(next)}`}>Sign in</Link>
        </div>
      </div>
    </div>
  )
}

