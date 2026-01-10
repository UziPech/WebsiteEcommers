// ============================================================================
// Favorites Context - Maneja lista de favoritos del usuario
// ============================================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../infrastructure/supabase/client';
import { useAuth } from './AuthContext';
import { Product } from '../domain';

// ============================================================================
// Types
// ============================================================================

interface FavoritesContextType {
    favorites: string[]; // Array de product IDs
    loading: boolean;
    isFavorite: (productId: string) => boolean;
    toggleFavorite: (productId: string) => Promise<void>;
    getFavoriteProducts: () => Promise<Product[]>;
}

// ============================================================================
// Context
// ============================================================================

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [favorites, setFavorites] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Load favorites when user logs in
    useEffect(() => {
        if (isAuthenticated && user) {
            loadFavorites();
        } else {
            setFavorites([]);
        }
    }, [isAuthenticated, user]);

    const loadFavorites = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('favorites')
                .select('product_id')
                .eq('user_id', user.id);

            if (error) throw error;

            setFavorites(data?.map(f => f.product_id) || []);
        } catch (err) {
            console.error('Error loading favorites:', err);
        } finally {
            setLoading(false);
        }
    };

    const isFavorite = (productId: string): boolean => {
        return favorites.includes(productId);
    };

    const toggleFavorite = async (productId: string): Promise<void> => {
        if (!user) return;

        const isCurrentlyFavorite = isFavorite(productId);

        try {
            if (isCurrentlyFavorite) {
                // Remove from favorites
                const { error } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('product_id', productId);

                if (error) throw error;
                setFavorites(prev => prev.filter(id => id !== productId));
            } else {
                // Add to favorites
                const { error } = await supabase
                    .from('favorites')
                    .insert({ user_id: user.id, product_id: productId });

                if (error) throw error;
                setFavorites(prev => [...prev, productId]);
            }
        } catch (err) {
            console.error('Error toggling favorite:', err);
        }
    };

    const getFavoriteProducts = async (): Promise<Product[]> => {
        if (!user || favorites.length === 0) return [];

        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .in('id', favorites);

            if (error) throw error;

            return data?.map(p => ({
                id: p.id,
                name: p.name,
                price: p.price,
                imageUrl: p.image_url,
                category: p.category,
                status: p.status,
                description: p.description,
                tag: p.tag,
                createdAt: p.created_at,
            })) || [];
        } catch (err) {
            console.error('Error getting favorite products:', err);
            return [];
        }
    };

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                loading,
                isFavorite,
                toggleFavorite,
                getFavoriteProducts,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
};

// ============================================================================
// Hook
// ============================================================================

export const useFavorites = (): FavoritesContextType => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
