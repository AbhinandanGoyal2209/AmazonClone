import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useCart } from '../state/cart.jsx'
import { useAuth } from '../state/auth.jsx'
import { useWishlist } from '../state/wishlist.jsx'
import { DeliveryLocationSearch } from './DeliveryLocationSearch.jsx'

function useInitialSearch() {
  const [params] = useSearchParams()
  return useMemo(() => params.get('search') || '', [params])
}

export function AppHeader() {
  const navigate = useNavigate()
  const initial = useInitialSearch()
  const [q, setQ] = useState(initial)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const { count } = useCart()
  const { wishlist } = useWishlist()
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
    setMenuOpen(false)
  }

  return (
    <header className="header-glass">
      <div className="container" style={{ padding: '12px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-only" 
            style={{ 
              background: 'transparent', border: 'none', color: '#fff', 
              fontSize: 24, cursor: 'pointer', display: 'none' 
            }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          <Link to="/" style={{ color: '#fff', fontSize: 22, fontWeight: 900, flexShrink: 0, letterSpacing: -0.5 }}>
            amazon<span style={{ color: 'var(--amazon-accent)' }}>.</span>clone
          </Link>

          <div style={{ display: 'flex', width: '200px' }} className="desktop-only border-box">
             <DeliveryLocationSearch onSelect={setSelectedLocation} />
          </div>

          <form onSubmit={onSubmit} style={{ display: 'flex', flex: 1, position: 'relative' }}>
             <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search premium products..."
              style={{
                width: '100%', padding: '10px 16px', paddingRight: '48px',
                borderRadius: 24, border: '2px solid rgba(255,153,0,0.5)',
                background: 'rgba(255,255,255,0.1)', color: '#fff',
                fontSize: 15, outline: 'none', backdropFilter: 'blur(5px)',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
              onBlur={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
             />
             <button type="submit" style={{ 
                position: 'absolute', right: 4, top: 4, bottom: 4, 
                borderRadius: 20, background: 'var(--amazon-accent)', 
                color: '#fff', border: 'none', width: 44, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
             }}>
                🔍
             </button>
          </form>

          <div className="desktop-only" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {user ? (
              <button
                type="button"
                onClick={logout}
                style={{ background: 'transparent', border: 'none', color: '#fff', textAlign: 'left', cursor: 'pointer' }}
              >
                <div style={{ fontSize: 11, opacity: 0.7 }}>Hello, {user.name.split(' ')[0]}</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Sign out</div>
              </button>
            ) : (
              <Link to="/login" style={{ color: '#fff', textAlign: 'left' }}>
                <div style={{ fontSize: 11, opacity: 0.7 }}>Hello</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Sign in</div>
              </Link>
            )}

            <Link to="/orders" style={{ color: '#fff', textAlign: 'left' }}>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Returns</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>& Orders</div>
            </Link>

            <Link to="/cart" style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
              <span style={{ fontSize: 24 }}>🛒</span>
              {count > 0 && (
                <span style={{ position: 'absolute', top: -5, left: 16, background: 'var(--amazon-accent)', color: '#000', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 10 }}>
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu & Sub Nav */}
        <div className="subNav" style={{ 
          marginTop: 12, display: 'flex', gap: 12, overflowX: 'auto', 
          paddingBottom: 4, scrollbarWidth: 'none' 
        }}>
           <NavLink to="/" end style={({isActive}) => ({ color: isActive ? 'var(--amazon-accent)' : '#fff', fontWeight: isActive?700:500, fontSize: 14 })}>All</NavLink>
           <NavLink to="/?category=Electronics" style={({isActive}) => ({ color: isActive ? 'var(--amazon-accent)' : '#fff', fontWeight: isActive?700:500, fontSize: 14 })}>Electronics</NavLink>
           <NavLink to="/?category=Fashion" style={({isActive}) => ({ color: isActive ? 'var(--amazon-accent)' : '#fff', fontWeight: isActive?700:500, fontSize: 14 })}>Fashion</NavLink>
           <NavLink to="/?category=Home & Kitchen" style={({isActive}) => ({ color: isActive ? 'var(--amazon-accent)' : '#fff', fontWeight: isActive?700:500, fontSize: 14, whiteSpace: 'nowrap' })}>Home & Kitchen</NavLink>
           <div style={{ flex: 1 }}></div>
           <Link to="/wishlist" style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#fff', fontSize: 13 }}>
             ❤️ <span style={{ fontWeight: 700, color: 'var(--amazon-accent)' }}>{wishlist.length}</span>
           </Link>
        </div>
      </div>
      <style>{`
        ::-webkit-scrollbar { display: none; }
        .desktop-only { display: flex; }
        .mobile-only { display: none !important; }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: block !important; }
        }
      `}</style>
    </header>
  )
}
