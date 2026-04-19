import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    const productCount = await prisma.product.count()
    console.log('Total products in database: ' + productCount)
    
    if (productCount > 0) {
      const products = await prisma.product.findMany({ take: 3 })
      console.log('First 3 products:')
      products.forEach((p, i) => {
        console.log((i+1) + '. ' + p.name + ' - Price: ' + p.price + ', Stock: ' + p.stock)
      })
    }
  } catch (error) {
    console.error('Database connection error:', error.message)
  } finally {
    process.exit(0)
  }
}

checkDatabase()
