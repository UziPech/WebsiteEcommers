// ============================================================================
// Presentation Layer - Category Context (using Supabase)
// ============================================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category } from '../domain';
import { SupabaseCategoryRepository } from '../infrastructure/supabase/CategoryRepository';
import {
    GetCategoriesUseCase,
    CreateCategoryUseCase,
    CreateCategoryInput,
    UpdateCategoryUseCase,
    UpdateCategoryInput,
    DeleteCategoryUseCase,
} from '../application/categories';

// ============================================================================
// Types
// ============================================================================

interface CategoryContextType {
    categories: Category[];
    loading: boolean;
    error: string | null;

    // Actions
    refreshCategories: () => Promise<void>;
    addCategory: (category: CreateCategoryInput) => Promise<Category | null>;
    updateCategory: (id: string, updates: UpdateCategoryInput) => Promise<Category | null>;
    deleteCategory: (id: string) => Promise<boolean>;

    // Queries
    getCategoryByName: (name: string) => Category | undefined;
}

// ============================================================================
// Repository & Use Cases (Singleton instances)
// ============================================================================

const categoryRepository = new SupabaseCategoryRepository();
const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepository);
const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);

// ============================================================================
// Context
// ============================================================================

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initial load
    useEffect(() => {
        refreshCategories();
    }, []);

    const refreshCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getCategoriesUseCase.execute();
            setCategories(data);
        } catch (err) {
            setError('Error al cargar categorías');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addCategory = async (input: CreateCategoryInput): Promise<Category | null> => {
        try {
            const newCategory = await createCategoryUseCase.execute(input);
            setCategories(prev => [...prev, newCategory]);
            return newCategory;
        } catch (err) {
            console.error('Error creating category:', err);
            return null;
        }
    };

    const updateCategory = async (id: string, updates: UpdateCategoryInput): Promise<Category | null> => {
        try {
            const updated = await updateCategoryUseCase.execute(id, updates);
            if (updated) {
                setCategories(prev => prev.map(c => c.id === id ? updated : c));
            }
            return updated;
        } catch (err) {
            console.error('Error updating category:', err);
            return null;
        }
    };

    const deleteCategory = async (id: string): Promise<boolean> => {
        try {
            const success = await deleteCategoryUseCase.execute(id);
            if (success) {
                setCategories(prev => prev.filter(c => c.id !== id));
            }
            return success;
        } catch (err) {
            console.error('Error deleting category:', err);
            return false;
        }
    };

    const getCategoryByName = (name: string): Category | undefined => {
        return categories.find(c => c.name.toLowerCase() === name.toLowerCase());
    };

    return (
        <CategoryContext.Provider
            value={{
                categories,
                loading,
                error,
                refreshCategories,
                addCategory,
                updateCategory,
                deleteCategory,
                getCategoryByName,
            }}
        >
            {children}
        </CategoryContext.Provider>
    );
};

// ============================================================================
// Hook
// ============================================================================

export const useCategories = (): CategoryContextType => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategories must be used within a CategoryProvider');
    }
    return context;
};

// Re-export types for convenience
export type { Category };
