// ============================================================================
// Domain Layer - Category Repository Interface (Contract)
// ============================================================================

import { Category } from '../entities/Category';

export interface ICategoryRepository {
    // Queries
    getAll(): Promise<Category[]>;
    getById(id: string): Promise<Category | null>;

    // Commands
    create(category: Omit<Category, 'id' | 'createdAt'>): Promise<Category>;
    update(id: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>): Promise<Category | null>;
    delete(id: string): Promise<boolean>;
}
