import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '../types'
import { buyerService } from '../services/buyerService'
import toast from 'react-hot-toast'

interface CartState {
  items: CartItem[]
  isLoading: boolean
  fetchCart: (buyerId: number) => Promise<void>
  addToCart: (buyerId: number, productId: number, quantity?: number) => Promise<boolean>
  updateQuantity: (cartItemId: number, quantity: number) => Promise<boolean>
  removeItem: (cartItemId: number) => Promise<boolean>
  clearCart: () => void
  getCartCount: () => number
  getCartTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchCart: async (buyerId: number) => {
        set({ isLoading: true })
        try {
          const items = await buyerService.getCart(buyerId)
          set({ items, isLoading: false })
        } catch (error) {
          console.error('Error fetching cart:', error)
          set({ isLoading: false })
        }
      },

      addToCart: async (buyerId: number, productId: number, quantity = 1) => {
        set({ isLoading: true })
        try {
          const newItem = await buyerService.addToCart(buyerId, productId, quantity)
          // Refresh full cart from server to avoid stale state issues
          const freshCart = await buyerService.getCart(buyerId)
          set({ items: Array.isArray(freshCart) ? freshCart : [], isLoading: false })
          toast.success('Added to cart!')
          return true
        } catch (error: any) {
          console.error('Error adding to cart:', error)
          const message = error.response?.data || 'Failed to add to cart'
          toast.error(typeof message === 'string' ? message : 'Failed to add to cart')
          set({ isLoading: false })
          return false
        }
      },

      updateQuantity: async (cartItemId: number, quantity: number) => {
        set({ isLoading: true })
        try {
          const updatedItem = await buyerService.updateCartItem(cartItemId, quantity)
          const items = get().items.map(item =>
            item.id === cartItemId ? updatedItem : item
          )
          set({ items, isLoading: false })
          toast.success('Cart updated!')
          return true
        } catch (error: any) {
          console.error('Error updating cart:', error)
          const message = error.response?.data || 'Failed to update cart'
          toast.error(message)
          set({ isLoading: false })
          return false
        }
      },

      removeItem: async (cartItemId: number) => {
        set({ isLoading: true })
        try {
          await buyerService.removeCartItem(cartItemId)
          const items = get().items.filter(item => item.id !== cartItemId)
          set({ items, isLoading: false })
          toast.success('Removed from cart')
          return true
        } catch (error: any) {
          console.error('Error removing from cart:', error)
          const message = error.response?.data || 'Failed to remove item'
          toast.error(message)
          set({ isLoading: false })
          return false
        }
      },

      clearCart: () => {
        set({ items: [] })
      },

      getCartCount: () => {
        const items = get().items
        if (!items || !Array.isArray(items)) return 0
        return items.reduce((total, item) => total + item.quantity, 0)
      },

      getCartTotal: () => {
        const items = get().items
        if (!items || !Array.isArray(items)) return 0
        return items.reduce((total, item) => 
          total + (item.product.price * item.quantity), 0
        )
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items })
    }
  )
)
