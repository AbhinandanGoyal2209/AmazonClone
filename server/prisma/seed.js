import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'default@amazon-clone.dev' },
    update: {},
    create: { email: 'default@amazon-clone.dev', name: 'Default User' },
  })

  await prisma.cart.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  })

  const products = [
    {
      name: 'Echo Dot (5th Gen) Smart Speaker with Alexa',
      brand: 'Amazon',
      category: 'Electronics',
      description:
        'Compact smart speaker with rich sound and Alexa. Control compatible smart home devices with your voice.',
      price: '4999.00',
      stock: 25,
      rating: 4.5,
      ratingCount: 12874,
      isPrime: true,
      images: [
        'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1512446733611-9099a758e4a2?auto=format&fit=crop&w=900&q=80',
      ],
      specs: ['Wi‑Fi + Bluetooth', 'Alexa built‑in', '1.73" speaker', 'Multi-room music'],
    },
    {
      name: 'Noise Cancelling Wireless Headphones',
      brand: 'SoundMax',
      category: 'Electronics',
      description:
        'Over-ear wireless headphones with active noise cancellation and 30-hour battery life.',
      price: '7999.00',
      stock: 14,
      rating: 4.2,
      ratingCount: 5643,
      isPrime: true,
      images: [
        'https://images.unsplash.com/photo-1518441902117-f0a1b5949f3c?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1518444300222-5a1cc9dbba6a?auto=format&fit=crop&w=900&q=80',
      ],
      specs: ['ANC', '30h battery', 'Fast charge', 'Bluetooth 5.3'],
    },
    {
      name: 'Stainless Steel Water Bottle (1L)',
      brand: 'HydroPro',
      category: 'Home & Kitchen',
      description:
        'Double-wall insulated bottle keeps drinks cold for 24h and hot for 12h.',
      price: '899.00',
      stock: 60,
      rating: 4.4,
      ratingCount: 23110,
      isPrime: true,
      images: [
        'https://images.unsplash.com/photo-1526401485004-2aa7d2c1aa6f?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1526402460708-36b58dfe4fe2?auto=format&fit=crop&w=900&q=80',
      ],
      specs: ['1L capacity', 'BPA-free', 'Vacuum insulated', 'Leakproof lid'],
    },
    {
      name: 'Non-stick Frying Pan (28cm)',
      brand: 'KitchenCraft',
      category: 'Home & Kitchen',
      description:
        'Durable non-stick frying pan with even heating and ergonomic handle.',
      price: '1299.00',
      stock: 32,
      rating: 4.1,
      ratingCount: 9102,
      isPrime: false,
      images: [
        'https://images.unsplash.com/photo-1607330289024-1535c6b4e1f4?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1607346708144-1d5d295df1c1?auto=format&fit=crop&w=900&q=80',
      ],
      specs: ['28cm', 'PFOA-free', 'Induction compatible', 'Stay-cool handle'],
    },
    {
      name: 'Running Shoes for Men',
      brand: 'Stride',
      category: 'Fashion',
      description:
        'Lightweight running shoes with breathable mesh and responsive cushioning.',
      price: '2999.00',
      stock: 18,
      rating: 4.0,
      ratingCount: 1422,
      isPrime: true,
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1528701800489-20be3c12f7df?auto=format&fit=crop&w=900&q=80',
      ],
      specs: ['Breathable mesh', 'Rubber outsole', 'Cushioned midsole', 'Everyday comfort'],
    },
    {
      name: 'Classic Cotton T‑Shirt',
      brand: 'Basics',
      category: 'Fashion',
      description:
        'Soft cotton t‑shirt with a classic fit. Great for everyday wear.',
      price: '499.00',
      stock: 100,
      rating: 4.3,
      ratingCount: 8701,
      isPrime: true,
      images: [
        'https://images.unsplash.com/photo-1520975958221-09d4dcead8de?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1520975891868-2a1a2be2a91a?auto=format&fit=crop&w=900&q=80',
      ],
      specs: ['100% cotton', 'Classic fit', 'Machine washable', 'Breathable'],
    },
    {
      name: 'The Pragmatic Programmer (Paperback)',
      brand: 'Addison-Wesley',
      category: 'Books',
      description:
        'A classic book with practical advice for software developers.',
      price: '699.00',
      stock: 45,
      rating: 4.8,
      ratingCount: 40221,
      isPrime: true,
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=900&q=80',
      ],
      specs: ['Paperback', 'Programming', 'Best practices', 'Career growth'],
    },
    {
      name: 'Ergonomic Office Chair',
      brand: 'WorkWell',
      category: 'Furniture',
      description:
        'Ergonomic chair with lumbar support and breathable back mesh.',
      price: '10999.00',
      stock: 8,
      rating: 4.1,
      ratingCount: 933,
      isPrime: false,
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1505849879898-5b8dfd2b9d84?auto=format&fit=crop&w=900&q=80',
      ],
      specs: ['Lumbar support', 'Adjustable height', 'Breathable mesh', '360° swivel'],
    },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { name: p.name },
      update: {
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
      },
      create: p,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

