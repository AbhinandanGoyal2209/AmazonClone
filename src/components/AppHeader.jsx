import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useCart } from '../state/cart.jsx'
import { useAuth } from '../state/auth.jsx'

function useInitialSearch() {
  const [params] = useSearchParams()
  return useMemo(() => params.get('search') || '', [params])
}

export function AppHeader() {
  const navigate = useNavigate()
  const initial = useInitialSearch()
  const [q, setQ] = useState(initial)
  const { count } = useCart()
  const { user, logout } = useAuth()

  useEffect(() => {
    setQ(initial)
  }, [initial])

  function onSubmit(e) {
    e.preventDefault()
    const search = q.trim()
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    navigate(`/?${params.toString()}`)
  }

  return (
    <header className="headerSticky">
      <div className="headerTop">
        <div className="container headerTopGrid">
          <Link to="/" className="brand" aria-label="Amazon Clone home">
            amazon<span className="brandDot">.</span>clone
          </Link>

          <div className="deliver" role="button" tabIndex={0}>
            <div className="deliverSmall">Deliver to Default</div>
            <div className="deliverBig">
              <span aria-hidden="true">📍</span> Mumbai 400001
            </div>
          </div>

          <form onSubmit={onSubmit} className="searchForm">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Amazon Clone"
              aria-label="Search products"
              className="searchInput"
            />
            <button type="submit" aria-label="Search" className="searchBtn">
              🔍
            </button>
          </form>

          <div className="navRight">
            {user ? (
              <button
                type="button"
                className="navPill"
                onClick={logout}
                style={{ background: 'transparent', cursor: 'pointer' }}
                aria-label="Logout"
              >
                <span className="navPillSmall">Hello, {user.name}</span>
                <span className="navPillBig">Sign out</span>
              </button>
            ) : (
              <Link to="/login" className="navPill" aria-label="Login">
                <span className="navPillSmall">Hello</span>
                <span className="navPillBig">Sign in</span>
              </Link>
            )}

            <Link to="/" className="navPill" aria-label="Orders">
              <span className="navPillSmall">Returns</span>
              <span className="navPillBig">& Orders</span>
            </Link>

            <Link to="/cart" className="cartLink" aria-label="Cart">
              <span aria-hidden="true">🛒</span>
              <span style={{ fontWeight: 800 }}>
                Cart <span style={{ color: 'var(--amazon-accent)' }}>{count}</span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="headerSub">
        <div className="container subNav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `subNavLink ${isActive ? 'subNavLinkActive' : ''}`
            }
          >
            All
          </NavLink>
          <span style={{ opacity: 0.9, whiteSpace: 'nowrap' }}>Today&apos;s Deals</span>
          <span style={{ opacity: 0.9, whiteSpace: 'nowrap' }}>Customer Service</span>
          <span style={{ opacity: 0.9, whiteSpace: 'nowrap' }}>Registry</span>
          <span style={{ opacity: 0.9, whiteSpace: 'nowrap' }}>Gift Cards</span>
          <span style={{ opacity: 0.9, whiteSpace: 'nowrap' }}>Sell</span>
        </div>
      </div>
    </header>
  )
}

