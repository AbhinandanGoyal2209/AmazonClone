import { z } from 'zod'

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const addToCartSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(1).max(10).default(1),
})

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().min(1).max(10),
})

export const shippingSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(6),
  addressLine1: z.string().min(3),
  addressLine2: z.string().optional().default(''),
  city: z.string().min(2),
  state: z.string().min(1),
  postalCode: z.string().min(3),
  country: z.string().min(2),
})

