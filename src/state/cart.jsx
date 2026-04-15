import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api.js'
import { useToast } from './toast.jsx'

const CartContext = createContext(null)

function calcSubtotal(items) {
  return items.reduce((sum, it) => sum + Number(it.product.price) * it.quantity, 0)
}

export function CartProvider({ children }) {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getCart()
      setItems(data.items || [])
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function add(productId, quantity = 1) {
    await api.addToCart({ productId, quantity })
    await refresh()
    const justAdded = (await api.getProduct(productId)).product
    toast.push(justAdded?.name || 'Item')
  }

  async function setQty(itemId, quantity) {
    await api.updateCartItem({ itemId, quantity })
    await refresh()
  }

  async function remove(itemId) {
    await api.removeCartItem({ itemId })
    await refresh()
  }

  const subtotal = useMemo(() => calcSubtotal(items), [items])
  const count = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity, 0),
    [items],
  )

  const value = useMemo(
    () => ({
      loading,
      error,
      items,
      subtotal,
      count,
      refresh,
      add,
      setQty,
      remove,
    }),
    [loading, error, items, subtotal, count],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

