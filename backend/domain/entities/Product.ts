// ============================================================================
// Domain Layer - Product Entity
// ============================================================================

export type ProductStatus = 'disponible' | 'vendido' | 'agotado';
export type ProductCategory = 'plantas' | 'macetas' | 'suplementos';

export interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    tag?: string | null;
    category: ProductCategory;
    status: ProductStatus;
    description?: string | null;
    createdAt: Date;
}

// Factory function to create a new product
export const createProduct = (
    data: Omit<Product, 'id' | 'createdAt'>
): Omit<Product, 'id' | 'createdAt'> => ({
    ...data,
});
