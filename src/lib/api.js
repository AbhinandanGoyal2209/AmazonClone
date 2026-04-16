const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/+$/, '') || 'http://localhost:4000'

function getToken() {
  try {
    return localStorage.getItem('token')
  } catch {
    return null
  }
}

async function request(path, options = {}) {
  const token = getToken()
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : null),
      ...(options.headers || {}),
    },
    ...options,
  })
  if (!res.ok) {
    let payload = null
    try {
      payload = await res.json()
    } catch {
      // ignore
    }
    const message =
      payload?.error || payload?.message || `Request failed (${res.status})`
    const err = new Error(message)
    err.status = res.status
    err.payload = payload
    throw err
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  signup: ({ name, email, password }) =>
    request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  login: ({ email, password }) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => request('/api/me'),
  listProducts: ({ search = '', category = '' } = {}) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    const qs = params.toString()
    return request(`/api/products${qs ? `?${qs}` : ''}`)
  },
  getProduct: (id) => request(`/api/products/${id}`),
  listCategories: () => request('/api/categories'),
  getCart: () => request('/api/cart'),
  addToCart: ({ productId, quantity }) =>
    request('/api/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),
  updateCartItem: ({ itemId, quantity }) =>
    request(`/api/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    }),
  removeCartItem: ({ itemId }) =>
    request(`/api/cart/items/${itemId}`, { method: 'DELETE' }),
  placeOrder: ({ shipping }) =>
    request('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ shipping }),
    }),
  createStripeCheckoutSession: () =>
    request('/api/stripe/checkout-session', { method: 'POST' }),
  getOrder: (id) => request(`/api/orders/${id}`),
  listOrders: () => request('/api/orders'),
}

