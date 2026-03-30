// ============================================================================
// Infrastructure Layer - Supabase Category Repository
// ============================================================================

import { supabase } from './client';
import { Category, ICategoryRepository } from '../../domain';

// Database row type (what Supabase returns)
interface CategoryRow {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
}

// Map database row to domain entity
const mapRowToCategory = (row: CategoryRow): Category => ({
    id: row.id,
    name: row.name,
    description: row.description,
    createdAt: new Date(row.created_at),
});

// Map domain entity to database row for insert/update
const mapCategoryToRow = (category: Partial<Omit<Category, 'id' | 'createdAt'>>): Partial<CategoryRow> => {
    const row: Partial<CategoryRow> = {};
    if (category.name !== undefined) row.name = category.name;
    if (category.description !== undefined) row.description = category.description;
    return row;
};

export class SupabaseCategoryRepository implements ICategoryRepository {
    private readonly tableName = 'categories';

    async getAll(): Promise<Category[]> {
        const { data, error } = await supabase
            .from(this.tableName)
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching categories:', error);
            return [];
        }

        return (data || []).map(mapRowToCategory);
    }

    async getById(id: string): Promise<Category | null> {
        const { data, error } = await supabase
            .from(this.tableName)
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return null;
        }

        return mapRowToCategory(data);
    }

    async create(category: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
        const row = mapCategoryToRow(category);

        const { data, error } = await supabase
            .from(this.tableName)
            .insert(row)
            .select()
            .single();

        if (error || !data) {
            throw new Error(`Error creating category: ${error?.message}`);
        }

        return mapRowToCategory(data);
    }

    async update(id: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>): Promise<Category | null> {
        const row = mapCategoryToRow(updates);

        const { data, error } = await supabase
            .from(this.tableName)
            .update(row)
            .eq('id', id)
            .select()
            .single();

        if (error || !data) {
            console.error('Error updating category:', error);
            return null;
        }

        return mapRowToCategory(data);
    }

    async delete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from(this.tableName)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting category:', error);
            return false;
        }

        return true;
    }
}
