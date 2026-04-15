import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import { prisma } from './db.js'
import {
  addToCartSchema,
  loginSchema,
  shippingSchema,
  signupSchema,
  updateCartItemSchema,
} from './validators.js'
import { getBearerToken, signToken, verifyToken } from './auth.js'
import { sendOrderConfirmationEmail } from './mailer.js'
import { getStripe } from './stripe.js'

const app = express()

app.use(express.json())
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true)
      if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return cb(null, true)
      if (allowedOrigins.includes(origin)) return cb(null, true)
      return cb(new Error(`CORS blocked for origin: ${origin}`))
    },
  }),
)

const DEFAULT_USER_EMAIL = 'default@amazon-clone.dev'

async function getDefaultUser() {
  const user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } })
  if (!user) {
    return prisma.user.create({
      data: { email: DEFAULT_USER_EMAIL, name: 'Default User', cart: { create: {} } },
    })
  }
  const cart = await prisma.cart.findUnique({ where: { userId: user.id } })
  if (!cart) await prisma.cart.create({ data: { userId: user.id } })
  return user
}

async function getUserFromReq(req) {
  const token = getBearerToken(req)
  if (token) {
    try {
      const payload = verifyToken(token)
      const userId = Number(payload?.sub)
      if (Number.isFinite(userId)) {
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (user) {
          const cart = await prisma.cart.findUnique({ where: { userId: user.id } })
          if (!cart) await prisma.cart.create({ data: { userId: user.id } })
          return user
        }
      }
    } catch {
      // fall through
    }
  }
  return getDefaultUser()
}

function toProductDTO(p) {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    description: p.description,
    price: p.price,
    stock: p.stock,
    rating: p.rating,
    ratingCount: p.ratingCount,
    isPrime: p.isPrime,
    images: p.images,
    specs: p.specs,
  }
}

app.get('/health', (_, res) => res.json({ ok: true }))

app.post('/api/auth/signup', async (req, res) => {
  const parsed = signupSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message })
  const { email, name, password } = parsed.data
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return res.status(400).json({ error: 'Email already in use' })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email, name, passwordHash, cart: { create: {} } },
  })
  const token = signToken(user)
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
})

app.post('/api/auth/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message })
  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user?.passwordHash) return res.status(400).json({ error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' })
  const token = signToken(user)
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
})

app.get('/api/me', async (req, res) => {
  const token = getBearerToken(req)
  if (!token) return res.json({ user: null })
  try {
    const payload = verifyToken(token)
    const userId = Number(payload?.sub)
    if (!Number.isFinite(userId)) return res.json({ user: null })
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return res.json({ user: null })
    res.json({ user: { id: user.id, email: user.email, name: user.name } })
  } catch {
    res.json({ user: null })
  }
})

app.get('/api/categories', async (_, res) => {
  const rows = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category'],
    orderBy: { category: 'asc' },
  })
  res.json({ categories: rows.map((r) => r.category) })
})

app.get('/api/products', async (req, res) => {
  const search = (req.query.search || '').toString().trim()
  const category = (req.query.category || '').toString().trim()

  const where = {
    ...(category ? { category } : null),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { brand: { contains: search, mode: 'insensitive' } },
          ],
        }
      : null),
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
  res.json({ products: products.map(toProductDTO) })
})

app.get('/api/products/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' })
  const p = await prisma.product.findUnique({ where: { id } })
  if (!p) return res.status(404).json({ error: 'Not found' })
  res.json({ product: toProductDTO(p) })
})

app.get('/api/cart', async (_req, res) => {
  const user = await getUserFromReq(_req)
  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: { product: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  })
  res.json({
    cartId: cart.id,
    items: cart.items.map((it) => ({
      id: it.id,
      productId: it.productId,
      quantity: it.quantity,
      product: toProductDTO(it.product),
    })),
  })
})

app.post('/api/cart/items', async (req, res) => {
  const user = await getUserFromReq(req)
  const parsed = addToCartSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message })

  const cart = await prisma.cart.findUnique({ where: { userId: user.id } })
  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } })
  if (!product) return res.status(404).json({ error: 'Product not found' })
  if (product.stock <= 0) return res.status(400).json({ error: 'Product out of stock' })

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId: product.id } },
  })
  if (existing) {
    const next = Math.min(existing.quantity + parsed.data.quantity, 10)
    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: next } })
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId: product.id, quantity: parsed.data.quantity },
    })
  }

  res.status(204).send()
})

app.patch('/api/cart/items/:itemId', async (req, res) => {
  const user = await getUserFromReq(req)
  const itemId = Number(req.params.itemId)
  if (!Number.isFinite(itemId)) return res.status(400).json({ error: 'Invalid item id' })
  const parsed = updateCartItemSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message })

  const cart = await prisma.cart.findUnique({ where: { userId: user.id } })
  const item = await prisma.cartItem.findUnique({ where: { id: itemId } })
  if (!item || item.cartId !== cart.id) return res.status(404).json({ error: 'Not found' })

  await prisma.cartItem.update({ where: { id: itemId }, data: { quantity: parsed.data.quantity } })
  res.status(204).send()
})

app.delete('/api/cart/items/:itemId', async (req, res) => {
  const user = await getUserFromReq(req)
  const itemId = Number(req.params.itemId)
  if (!Number.isFinite(itemId)) return res.status(400).json({ error: 'Invalid item id' })

  const cart = await prisma.cart.findUnique({ where: { userId: user.id } })
  const item = await prisma.cartItem.findUnique({ where: { id: itemId } })
  if (!item || item.cartId !== cart.id) return res.status(404).json({ error: 'Not found' })

  await prisma.cartItem.delete({ where: { id: itemId } })
  res.status(204).send()
})

app.post('/api/orders', async (req, res) => {
  const user = await getUserFromReq(req)
  const parsedShipping = shippingSchema.safeParse(req.body?.shipping)
  if (!parsedShipping.success) {
    return res.status(400).json({ error: parsedShipping.error.message })
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
  })
  if (!cart.items.length) return res.status(400).json({ error: 'Cart is empty' })

  const subtotal = cart.items.reduce(
    (sum, it) => sum + Number(it.product.price) * it.quantity,
    0,
  )

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      subtotal: subtotal.toFixed(2),
      shippingFullName: parsedShipping.data.fullName,
      shippingPhone: parsedShipping.data.phone,
      shippingLine1: parsedShipping.data.addressLine1,
      shippingLine2: parsedShipping.data.addressLine2 || '',
      shippingCity: parsedShipping.data.city,
      shippingState: parsedShipping.data.state,
      shippingPostal: parsedShipping.data.postalCode,
      shippingCountry: parsedShipping.data.country,
      items: {
        create: cart.items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
          unitPrice: it.product.price,
        })),
      },
    },
    select: { id: true },
  })

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })

  // Fire-and-forget email. In real apps you'd do this via a queue.
  if (user.email && user.passwordHash) {
    sendOrderConfirmationEmail({
      to: user.email,
      orderId: order.id,
      items: cart.items.map((it) => ({ product: it.product, quantity: it.quantity })),
      subtotal,
    }).catch((e) => console.error('Email error', e))
  }

  res.json({ orderId: order.id })
})

app.get('/api/orders/:id', async (req, res) => {
  const user = await getUserFromReq(req)
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' })
  const order = await prisma.order.findFirst({
    where: { id, userId: user.id },
    include: { items: { include: { product: true } } },
  })
  if (!order) return res.status(404).json({ error: 'Not found' })
  res.json({
    order: {
      id: order.id,
      subtotal: order.subtotal,
      createdAt: order.createdAt,
      shipping: {
        fullName: order.shippingFullName,
        phone: order.shippingPhone,
        addressLine1: order.shippingLine1,
        addressLine2: order.shippingLine2,
        city: order.shippingCity,
        state: order.shippingState,
        postalCode: order.shippingPostal,
        country: order.shippingCountry,
      },
      items: order.items.map((it) => ({
        id: it.id,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        product: toProductDTO(it.product),
      })),
    },
  })
})

app.post('/api/stripe/checkout-session', async (req, res) => {
  const user = await getUserFromReq(req)
  const stripe = getStripe()
  if (!stripe) return res.status(400).json({ error: 'Stripe is not configured' })

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
  })
  if (!cart.items.length) return res.status(400).json({ error: 'Cart is empty' })

  const successUrl =
    process.env.STRIPE_SUCCESS_URL ||
    'http://localhost:5174/checkout/success?session_id={CHECKOUT_SESSION_ID}'
  const cancelUrl = process.env.STRIPE_CANCEL_URL || 'http://localhost:5174/checkout'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: String(user.id),
    metadata: { userId: String(user.id) },
    line_items: cart.items.map((it) => ({
      quantity: it.quantity,
      price_data: {
        currency: 'inr',
        unit_amount: Math.round(Number(it.product.price) * 100),
        product_data: {
          name: it.product.name,
          images: it.product.images?.length ? [it.product.images[0]] : undefined,
        },
      },
    })),
  })

  res.json({ id: session.id, url: session.url })
})

const port = Number(process.env.PORT || 4000)
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`)
})

