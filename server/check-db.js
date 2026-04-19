import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const count = await prisma.product.count()
  console.log('Total products in DB:', count)
  const products = await prisma.product.findMany({ select: { id: true, name: true } })
  console.log('Sample products:', products.slice(0, 3))
  await prisma.$disconnect()
}

main().catch(e => console.error(e))
