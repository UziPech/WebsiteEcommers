import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from './infrastructure/supabase/client';

// ============================================================================
// Types
// ============================================================================

export interface Product {
  id: string | number;
  name: string;
  price: number | string;
  image?: string;
  imageUrl?: string;
  tag?: string | null;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  loading: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
}

// ============================================================================
// Context
// ============================================================================

const CartContext = createContext<CartContextType | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

interface CartProviderProps {
  children: ReactNode;
  userId?: string | null;
  isAuthenticated?: boolean;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Helper to parse price (handles both number and string format)
  const parsePrice = (price: number | string): number => {
    if (typeof price === 'number') return price;
    const numeric = price.replace(/[^0-9.]/g, '');
    return parseFloat(numeric) || 0;
  };

  // Get current user session
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load cart from Supabase when user logs in
  const loadCartFromSupabase = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          product_id,
          products (
            id,
            name,
            price,
            image_url,
            tag
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      const items: CartItem[] = (data || []).map((item: any) => ({
        id: item.products.id,
        name: item.products.name,
        price: item.products.price,
        imageUrl: item.products.image_url,
        tag: item.products.tag,
        quantity: item.quantity,
      }));

      setCart(items);
    } catch (err) {
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load cart when user changes
  useEffect(() => {
    if (userId) {
      loadCartFromSupabase();
    } else {
      // Clear cart when user logs out (or load from localStorage if you want)
      setCart([]);
    }
  }, [userId, loadCartFromSupabase]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce((total, item) => {
    return total + parsePrice(item.price) * item.quantity;
  }, 0);

  const addToCart = async (product: Product) => {
    const productId = String(product.id);

    // Optimistic update
    setCart((prev) => {
      const existingItem = prev.find((item) => String(item.id) === productId);
      if (existingItem) {
        return prev.map((item) =>
          String(item.id) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    // Sync with Supabase if logged in
    if (userId) {
      try {
        const existingItem = cart.find((item) => String(item.id) === productId);

        if (existingItem) {
          // Update quantity
          await supabase
            .from('cart_items')
            .update({ quantity: existingItem.quantity + 1, updated_at: new Date().toISOString() })
            .eq('user_id', userId)
            .eq('product_id', productId);
        } else {
          // Insert new item
          await supabase
            .from('cart_items')
            .insert({ user_id: userId, product_id: productId, quantity: 1 });
        }
      } catch (err) {
        console.error('Error syncing cart:', err);
      }
    }
  };

  const updateQuantity = async (productId: string | number, quantity: number) => {
    const pid = String(productId);

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        String(item.id) === pid ? { ...item, quantity } : item
      )
    );

    if (userId) {
      try {
        await supabase
          .from('cart_items')
          .update({ quantity, updated_at: new Date().toISOString() })
          .eq('user_id', userId)
          .eq('product_id', pid);
      } catch (err) {
        console.error('Error updating quantity:', err);
      }
    }
  };

  const removeFromCart = async (productId: string | number) => {
    const pid = String(productId);

    setCart((prev) => prev.filter((item) => String(item.id) !== pid));

    if (userId) {
      try {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', pid);
      } catch (err) {
        console.error('Error removing from cart:', err);
      }
    }
  };

  const clearCart = async () => {
    setCart([]);

    if (userId) {
      try {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', userId);
      } catch (err) {
        console.error('Error clearing cart:', err);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, cartCount, cartTotal, loading, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ============================================================================
// Hook
// ============================================================================

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
