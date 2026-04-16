import { Link } from 'react-router-dom'

export function AppFooter() {
  return (
    <footer className="appFooter">
      {/* Back to Top */}
      <div 
        className="backToTop" 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <div 
          style={{
            background: 'var(--amazon-header-2)',
            color: '#fff',
            border: 'none',
            padding: '12px 30px',
            borderRadius: 4,
            fontWeight: 600,
            fontSize: 13,
            display: 'inline-block'
          }}
        >
          ↑ Back to top
        </div>
      </div>

      {/* Main Footer */}
      <div className="footerMain">
        <div className="container" style={{ paddingTop: 40, paddingBottom: 40 }}>
          <div className="footerGrid">
            {/* Column 1: About */}
            <div className="footerColumn">
              <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: 14 }}>
                Get to Know Us
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: 12 }}>
                  <Link to="/" style={{ color: '#0066c0', fontSize: 12 }}>
                    Careers
                  </Link>
                </li>
                <li style={{ marginBottom: 12 }}>
                  <Link to="/" style={{ color: '#0066c0', fontSize: 12 }}>
                    Blog
                  </Link>
                </li>
                <li style={{ marginBottom: 12 }}>
                  <Link to="/" style={{ color: '#0066c0', fontSize: 12 }}>
                    About Amazon Clone
                  </Link>
                </li>
                <li style={{ marginBottom: 12 }}>
                  <Link to="/" style={{ color: '#0066c0', fontSize: 12 }}>
                    Investor Relations
                  </Link>
                </li>
                <li style={{ marginBottom: 12 }}>
                  <Link to="/" style={{ color: '#0066c0', fontSize: 12 }}>
                    Amazon Devices
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: For Customers */}
            <div className="footerColumn">
              <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: 14 }}>
                Make Money with Us
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: 12 }}>
                  <Link to="/" style={{ color: '#0066c0', fontSize: 12 }}>
                    Sell on Amazon Clone
                  </Link>
                </li>
                <li style={{ marginBottom: 12 }}>
                  <Link to="/" style={{ color: '#0066c0', fontSize: 12 }}>
                    Sell Your Services
                  </Link>
                </li>
                <li style={{ marginBottom: 12 }}>
                  <Link to="/" style={{ color: '#0066c0', fontSize: 12 }}>
                    Become an Affiliate
                  </Link>
                </li>
                <li style={{ marginBottom: 12 }}>
                  <Link to="/" style={{ color: '#0066c0', fontSize: 12 }}>
                    Advertise Your Products
                  </Link>
                </li>
                <li style={{ marginBottom: 12 }}>
                  <Link to="/" style={{ color: '#0066c0', fontSize: 12 }}>
                    Amazon Hub
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Amazon Business */}
            <div className="footerColumn">
              <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: 14 }}>
                Amazon Business
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: 12 }}>
                  <Link to="/" style={{ color: '#0066c0', fontSize: 12 }}>
                    Amazon Business
                  </Link>
                </li>
                <li style={{ marginBottom: 12 }}>
                  <Link to="/" style={{ color: '#0066c0', fontSize: 12 }}>
                    Business Pricing
                  </Link>
                </li>
                <li style={{ marginBottom: 12 }}>
                  <Link to="/" style={{ color: '#0066c0', fontSize: 12 }}>
                    Business Deals
                  </Link>
                </li>
                <li style={{ marginBottom: 12 }}>
                  <Link to="/" style={{ color: '#0066c0', fontSize: 12 }}>
                    Bulk Orders
                  </Link>
                </li>
                <li style={{ marginBottom: 12 }}>
                  <Link to="/" style={{ color: '#0066c0', fontSize: 12 }}>
                    B2B Solutions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Help */}
            <div className="footerColumn">
              <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: 14 }}>
                Help & Support
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: 12 }}>
                  <Link to="/" style={{ color: '#0066c0', fontSize: 12 }}>
                    Help Center
                  </Link>
                </li>
                <li style={{ marginBottom: 12 }}>
                  <Link to="/" style={{ color: '#0066c0', fontSize: 12 }}>
                    Contact Us
                  </Link>
                </li>
                <li style={{ marginBottom: 12 }}>
                  <Link to="/" style={{ color: '#0066c0', fontSize: 12 }}>
                    Your Orders
                  </Link>
                </li>
                <li style={{ marginBottom: 12 }}>
                  <Link to="/" style={{ color: '#0066c0', fontSize: 12 }}>
                    Track Package
                  </Link>
                </li>
                <li style={{ marginBottom: 12 }}>
                  <Link to="/" style={{ color: '#0066c0', fontSize: 12 }}>
                    Returns & Replacements
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '40px 0' }} />

          {/* Language & Currency */}
          <div style={{ display: 'flex', gap: 30, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            <button
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '8px 16px',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              🌐 English - India
            </button>
            <button
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '8px 16px',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              💵 INR - Indian Rupee
            </button>
            <button
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '8px 16px',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              🇮🇳 India
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footerBottom">
        <div className="container" style={{ paddingTop: 20, paddingBottom: 20 }}>
          <div style={{ display: 'grid', gap: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#999' }}>
              <Link to="/" style={{ color: '#0066c0', marginRight: 16, textDecoration: 'none' }}>
                Conditions of Use & Sale
              </Link>
              <Link to="/" style={{ color: '#0066c0', marginRight: 16, textDecoration: 'none' }}>
                Privacy Notice
              </Link>
              <Link to="/" style={{ color: '#0066c0', textDecoration: 'none' }}>
                Cookies
              </Link>
            </div>
            <div style={{ fontSize: 11, color: '#666' }}>
              © 2026, <strong>Amazon Clone</strong> - Made with ❤️ for Learning
            </div>
            <div style={{ fontSize: 11, color: '#666' }}>
              <strong>Website:</strong> amazon-clone.dev | <strong>Email:</strong> support@amazon-clone.dev
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
