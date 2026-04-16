import { Link } from 'react-router-dom'
import { useWishlist } from '../state/wishlist.jsx'
import { ProductCard } from '../components/ProductCard.jsx'

export function WishlistPage() {
  const { wishlist } = useWishlist()

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <h1 className="gradient-text" style={{ fontSize: 32, fontWeight: 900, marginBottom: 24 }}>Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>❤️</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Your wishlist is empty</div>
          <div style={{ color: 'var(--muted)', marginBottom: 24 }}>Explore our premium collection and save your favorites!</div>
          <Link to="/" className="btn">Continue Shopping</Link>
        </div>
      ) : (
        <div className="productGrid">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
