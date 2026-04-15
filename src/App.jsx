import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AppHeader } from './components/AppHeader.jsx'
import { CartProvider } from './state/cart.jsx'
import { ToastProvider } from './state/toast.jsx'
import { AuthProvider } from './state/auth.jsx'
import { ProductListPage } from './pages/ProductListPage.jsx'
import { ProductDetailPage } from './pages/ProductDetailPage.jsx'
import { CartPage } from './pages/CartPage.jsx'
import { CheckoutPage } from './pages/CheckoutPage.jsx'
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { SignupPage } from './pages/SignupPage.jsx'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <div className="appShell">
            <AppHeader />
            <main className="main">
              <Routes>
                <Route path="/" element={<ProductListPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order/:id" element={<OrderConfirmationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
