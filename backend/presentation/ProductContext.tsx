// ============================================================================
// Presentation Layer - Product Context (using Supabase)
// ============================================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ProductCategory, ProductStatus } from '../domain';
import { SupabaseProductRepository } from '../infrastructure/supabase/ProductRepository';
import {
    GetProductsUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    CreateProductInput,
    UpdateProductInput,
} from '../application/products';

// ============================================================================
// Types
// ============================================================================

interface ProductContextType {
    products: Product[];
    loading: boolean;
    error: string | null;

    // Actions
    refreshProducts: () => Promise<void>;
    addProduct: (product: CreateProductInput) => Promise<Product | null>;
    updateProduct: (id: string, updates: UpdateProductInput) => Promise<Product | null>;
    deleteProduct: (id: string) => Promise<boolean>;
    updateProductStatus: (id: string, status: ProductStatus) => Promise<Product | null>;

    // Queries
    getProductsByCategory: (category: ProductCategory | 'all') => Product[];
    getProductById: (id: string) => Product | undefined;
}

// ============================================================================
// Repository & Use Cases (Singleton instances)
// ============================================================================

const productRepository = new SupabaseProductRepository();
const getProductsUseCase = new GetProductsUseCase(productRepository);
const createProductUseCase = new CreateProductUseCase(productRepository);
const updateProductUseCase = new UpdateProductUseCase(productRepository);
const deleteProductUseCase = new DeleteProductUseCase(productRepository);

// ============================================================================
// Context
// ============================================================================

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initial load
    useEffect(() => {
        refreshProducts();
    }, []);

    const refreshProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getProductsUseCase.execute();
            setProducts(data);
        } catch (err) {
            setError('Error al cargar productos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addProduct = async (input: CreateProductInput): Promise<Product | null> => {
        try {
            const newProduct = await createProductUseCase.execute(input);
            setProducts(prev => [newProduct, ...prev]);
            return newProduct;
        } catch (err) {
            console.error('Error creating product:', err);
            return null;
        }
    };

    const updateProduct = async (id: string, updates: UpdateProductInput): Promise<Product | null> => {
        try {
            const updated = await updateProductUseCase.execute(id, updates);
            if (updated) {
                setProducts(prev => prev.map(p => p.id === id ? updated : p));
            }
            return updated;
        } catch (err) {
            console.error('Error updating product:', err);
            return null;
        }
    };

    const deleteProduct = async (id: string): Promise<boolean> => {
        try {
            const success = await deleteProductUseCase.execute(id);
            if (success) {
                setProducts(prev => prev.filter(p => p.id !== id));
            }
            return success;
        } catch (err) {
            console.error('Error deleting product:', err);
            return false;
        }
    };

    const updateProductStatus = async (id: string, status: ProductStatus): Promise<Product | null> => {
        try {
            const updated = await updateProductUseCase.updateStatus(id, status);
            if (updated) {
                setProducts(prev => prev.map(p => p.id === id ? updated : p));
            }
            return updated;
        } catch (err) {
            console.error('Error updating product status:', err);
            return null;
        }
    };

    const getProductsByCategory = (category: ProductCategory | 'all'): Product[] => {
        if (category === 'all') return products;
        return products.filter(p => p.category === category);
    };

    const getProductById = (id: string): Product | undefined => {
        return products.find(p => p.id === id);
    };

    return (
        <ProductContext.Provider
            value={{
                products,
                loading,
                error,
                refreshProducts,
                addProduct,
                updateProduct,
                deleteProduct,
                updateProductStatus,
                getProductsByCategory,
                getProductById,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

// ============================================================================
// Hook
// ============================================================================

export const useProducts = (): ProductContextType => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};

// Re-export types for convenience
export type { Product, ProductCategory, ProductStatus };
