import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from './AuthContext';

// ── Types ─────────────────────────────────────────────────────────

export interface CartItem {
  id:             string;
  book_id:        string;
  title:          string;
  author:         string;
  price_snapshot: number;
  quantity:       number;
  subtotal:       number;
  bookstore_id:   string;
  bookstore_name: string;
  cover_emoji:    string | null;
  cover_color:    string | null;
  cover_url:      string | null;
}

export interface Cart {
  id:         string;
  status:     string;
  items:      CartItem[];
  total:      number;
  item_count: number;
}

export interface CartGroup {
  bookstore_id:   string;
  bookstore_name: string;
  items:          CartItem[];
  subtotal:       number;
}

export interface PlaceOrderPayload {
  bookstore_id:  string;
  cart_item_ids: string[];
  address:       string;
  notes?:        string;
}

interface CartContextType {
  cart:           Cart | null;
  cartGroups:     CartGroup[];
  loading:        boolean;
  error:          string | null;
  fetchCart:      () => Promise<void>;
  addItem:        (book_id: string, quantity: number) => Promise<void>;
  updateQuantity: (item_id: string, quantity: number) => Promise<void>;
  removeItem:     (item_id: string) => Promise<void>;
  clearCart:      () => Promise<void>;
  placeOrder:     (payload: PlaceOrderPayload) => Promise<any>;
}

// ── Context ───────────────────────────────────────────────────────

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart,    setCart]    = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const { user }              = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get('/cart');
      setCart(res.data);
      setError(null);
    } catch {
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchCart();
    else setCart(null);
  }, [user, fetchCart]);

  // ── Group items by bookstore ──────────────────────────────────────
  const cartGroups: CartGroup[] = cart
    ? Object.values(
        cart.items.reduce<Record<string, CartGroup>>((acc, item) => {
          const key = item.bookstore_id;
          if (!acc[key]) {
            acc[key] = {
              bookstore_id:   item.bookstore_id,
              bookstore_name: item.bookstore_name,
              items:          [],
              subtotal:       0,
            };
          }
          acc[key].items.push(item);
          acc[key].subtotal += item.subtotal;
          return acc;
        }, {})
      )
    : [];

  const addItem = async (book_id: string, quantity: number) => {
    try {
      const res = await axiosInstance.post('/cart/items', { book_id, quantity });
      setCart(res.data);
    } catch {
      setError('Failed to add item');
    }
  };

  const updateQuantity = async (item_id: string, quantity: number) => {
    try {
      const res = await axiosInstance.patch(`/cart/items/${item_id}`, { quantity });
      setCart(res.data);
    } catch {
      setError('Failed to update quantity');
    }
  };

  const removeItem = async (item_id: string) => {
    try {
      const res = await axiosInstance.delete(`/cart/items/${item_id}`);
      setCart(res.data);
    } catch {
      setError('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await axiosInstance.delete('/cart');
      setCart(prev => prev ? { ...prev, items: [], total: 0, item_count: 0 } : null);
    } catch {
      setError('Failed to clear cart');
    }
  };

  const placeOrder = async (payload: PlaceOrderPayload) => {
    const res = await axiosInstance.post('/orders', payload);
    await fetchCart();
    return res.data;
  };

  return (
    <CartContext.Provider value={{
      cart, cartGroups, loading, error,
      fetchCart, addItem, updateQuantity, removeItem, clearCart, placeOrder,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be used within CartProvider');
  return ctx;
};