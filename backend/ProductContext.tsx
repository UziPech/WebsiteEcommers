import React, { createContext, useContext, useState, ReactNode } from 'react';

// ============================================================================
// Types
// ============================================================================

export type ProductStatus = 'disponible' | 'vendido' | 'agotado';
export type ProductCategory = 'plantas' | 'macetas' | 'suplementos';

export interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
    tag?: string;
    category: ProductCategory;
    status: ProductStatus;
    description?: string;
}

interface ProductContextType {
    products: Product[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (id: number, updates: Partial<Product>) => void;
    deleteProduct: (id: number) => void;
    getProductsByCategory: (category: string) => Product[];
    getProductById: (id: number) => Product | undefined;
}

// ============================================================================
// Initial Data
// ============================================================================

const INITIAL_PRODUCTS: Product[] = [
    {
        id: 1,
        name: 'Monstera Deliciosa',
        price: '$450 MXN',
        image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
        tag: 'Best Seller',
        category: 'plantas',
        status: 'disponible',
        description: 'La Monstera Deliciosa es una planta tropical perfecta para interiores.',
    },
    {
        id: 2,
        name: 'Palma Areca',
        price: '$800 MXN',
        image: 'https://images.unsplash.com/photo-1596005554384-d293674c91d7?auto=format&fit=crop&w=800&q=80',
        category: 'plantas',
        status: 'disponible',
        description: 'Palma elegante que purifica el aire de tu hogar.',
    },
    {
        id: 3,
        name: 'Maceta Negra',
        price: '$250 MXN',
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
        tag: 'Limited',
        category: 'macetas',
        status: 'disponible',
        description: 'Maceta de cerámica artesanal con acabado mate.',
    },
    {
        id: 4,
        name: 'Sustrato Premium',
        price: '$120 MXN',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',
        category: 'suplementos',
        status: 'disponible',
        description: 'Mezcla especial de tierra para plantas de interior.',
    },
    {
        id: 5,
        name: 'Orquídea Real',
        price: '$650 MXN',
        image: 'https://images.unsplash.com/photo-1566958763363-2394fbd77180?auto=format&fit=crop&w=800&q=80',
        tag: 'Rare',
        category: 'plantas',
        status: 'vendido',
        description: 'Orquídea exótica de floración prolongada.',
    },
    {
        id: 6,
        name: 'Cactus San Pedro',
        price: '$350 MXN',
        image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=800&q=80',
        category: 'plantas',
        status: 'disponible',
        description: 'Cactus resistente ideal para principiantes.',
    },
    {
        id: 7,
        name: 'Maceta Terracota Grande',
        price: '$380 MXN',
        image: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?auto=format&fit=crop&w=800&q=80',
        category: 'macetas',
        status: 'disponible',
        description: 'Maceta clásica de terracota hecha a mano.',
    },
    {
        id: 8,
        name: 'Fertilizante Orgánico',
        price: '$95 MXN',
        image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
        tag: 'Eco',
        category: 'suplementos',
        status: 'agotado',
        description: 'Fertilizante 100% orgánico para todo tipo de plantas.',
    },
];

// ============================================================================
// Context
// ============================================================================

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>(() => {
        const saved = localStorage.getItem('vivero_products');
        return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    });

    // Helper to persist to localStorage
    const persist = (newProducts: Product[]) => {
        setProducts(newProducts);
        localStorage.setItem('vivero_products', JSON.stringify(newProducts));
    };

    const addProduct = (productData: Omit<Product, 'id'>) => {
        const newId = Math.max(...products.map((p) => p.id), 0) + 1;
        const newProduct: Product = { ...productData, id: newId };
        persist([...products, newProduct]);
    };

    const updateProduct = (id: number, updates: Partial<Product>) => {
        persist(
            products.map((p) => (p.id === id ? { ...p, ...updates } : p))
        );
    };

    const deleteProduct = (id: number) => {
        persist(products.filter((p) => p.id !== id));
    };

    const getProductsByCategory = (category: string): Product[] => {
        if (category === 'all') return products;
        return products.filter((p) => p.category === category);
    };

    const getProductById = (id: number): Product | undefined => {
        return products.find((p) => p.id === id);
    };

    return (
        <ProductContext.Provider
            value={{
                products,
                addProduct,
                updateProduct,
                deleteProduct,
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
