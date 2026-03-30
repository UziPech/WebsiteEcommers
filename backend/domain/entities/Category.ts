// ============================================================================
// Domain Layer - Category Entity
// ============================================================================

export interface Category {
    id: string;
    name: string;
    description?: string | null;
    createdAt: Date;
}

// Factory function to create a new category
export const createCategory = (
    data: Omit<Category, 'id' | 'createdAt'>
): Omit<Category, 'id' | 'createdAt'> => ({
    ...data,
});
