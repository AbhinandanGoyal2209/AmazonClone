import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/auth.jsx'

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function SignupPage() {
  const { signup } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const next = new URLSearchParams(loc.search).get('next') || '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const errors = {}
    if (!name.trim()) {
      errors.name = 'Name is required'
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }
    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email'
    }
    if (!password.trim()) {
      errors.password = 'Password is required'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (!validateForm()) {
      setError(new Error('Please fill in all required fields correctly'))
      return
    }
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

  const handleFieldChange = (field, value) => {
    if (field === 'name') setName(value)
    else if (field === 'email') setEmail(value)
    else setPassword(value)
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="container" style={{ display: 'grid', placeItems: 'center', minHeight: '80vh' }}>
      <div className="card" style={{ padding: 24, width: 380, maxWidth: '100%' }}>
        <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>
          Create account
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Sign up for your free Amazon Clone account
        </div>

        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          {error ? (
            <div className="alert error">
              {error.message}
            </div>
          ) : null}

          <div className="form-group">
            <label style={{ fontSize: 13, fontWeight: 500 }}>Your name *</label>
            <input
              value={name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="First and last name"
              className={fieldErrors.name ? 'error' : ''}
              style={{ height: 38, padding: '0 10px' }}
            />
            {fieldErrors.name && <div className="error-text">{fieldErrors.name}</div>}
          </div>

          <div className="form-group">
            <label style={{ fontSize: 13, fontWeight: 500 }}>Email or mobile number *</label>
            <input
              value={email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              placeholder="you@example.com"
              className={fieldErrors.email ? 'error' : ''}
              style={{ height: 38, padding: '0 10px' }}
            />
            {fieldErrors.email && <div className="error-text">{fieldErrors.email}</div>}
          </div>

          <div className="form-group">
            <label style={{ fontSize: 13, fontWeight: 500 }}>Password *</label>
            <input
              value={password}
              onChange={(e) => handleFieldChange('password', e.target.value)}
              type="password"
              placeholder="At least 6 characters"
              className={fieldErrors.password ? 'error' : ''}
              style={{ height: 38, padding: '0 10px' }}
            />
            {fieldErrors.password && <div className="error-text">{fieldErrors.password}</div>}
          </div>

          <button className="btn" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create your Amazon Clone account'}
          </button>

          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
            By creating an account, you agree to our privacy notice and conditions of use.
          </div>
        </form>

        <div style={{ marginTop: 16, fontSize: 13, textAlign: 'center', color: 'var(--muted)' }}>
          Already have an account?{' '}
          <Link to={`/login?next=${encodeURIComponent(next)}`} style={{ fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

