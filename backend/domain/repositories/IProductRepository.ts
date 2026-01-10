// ============================================================================
// Domain Layer - Product Repository Interface (Contract)
// ============================================================================

import { Product, ProductCategory, ProductStatus } from '../entities/Product';

export interface IProductRepository {
    // Queries
    getAll(): Promise<Product[]>;
    getById(id: string): Promise<Product | null>;
    getByCategory(category: ProductCategory): Promise<Product[]>;

    // Commands
    create(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product>;
    update(id: string, updates: Partial<Product>): Promise<Product | null>;
    delete(id: string): Promise<boolean>;
    updateStatus(id: string, status: ProductStatus): Promise<Product | null>;
}
