// ============================================================================
// Infrastructure Layer - Supabase Product Repository
// ============================================================================

import { supabase } from './client';
import { Product, ProductCategory, ProductStatus, IProductRepository } from '../../domain';

// Database row type (what Supabase returns)
interface ProductRow {
    id: string;
    name: string;
    price: number;
    image_url: string;
    tag: string | null;
    category: string;
    status: string;
    description: string | null;
    created_at: string;
}

// Map database row to domain entity
const mapRowToProduct = (row: ProductRow): Product => ({
    id: row.id,
    name: row.name,
    price: row.price,
    imageUrl: row.image_url,
    tag: row.tag,
    category: row.category as ProductCategory,
    status: row.status as ProductStatus,
    description: row.description,
    createdAt: new Date(row.created_at),
});

// Map domain entity to database row for insert/update
const mapProductToRow = (product: Partial<Product>): Partial<ProductRow> => {
    const row: Partial<ProductRow> = {};
    if (product.name !== undefined) row.name = product.name;
    if (product.price !== undefined) row.price = product.price;
    if (product.imageUrl !== undefined) row.image_url = product.imageUrl;
    if (product.tag !== undefined) row.tag = product.tag;
    if (product.category !== undefined) row.category = product.category;
    if (product.status !== undefined) row.status = product.status;
    if (product.description !== undefined) row.description = product.description;
    return row;
};

export class SupabaseProductRepository implements IProductRepository {
    private readonly tableName = 'products';

    async getAll(): Promise<Product[]> {
        const { data, error } = await supabase
            .from(this.tableName)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching products:', error);
            return [];
        }

        return (data || []).map(mapRowToProduct);
    }

    async getById(id: string): Promise<Product | null> {
        const { data, error } = await supabase
            .from(this.tableName)
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return null;
        }

        return mapRowToProduct(data);
    }

    async getByCategory(category: ProductCategory): Promise<Product[]> {
        const { data, error } = await supabase
            .from(this.tableName)
            .select('*')
            .eq('category', category)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching products by category:', error);
            return [];
        }

        return (data || []).map(mapRowToProduct);
    }

    async create(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
        const row = mapProductToRow(product);

        const { data, error } = await supabase
            .from(this.tableName)
            .insert(row)
            .select()
            .single();

        if (error || !data) {
            throw new Error(`Error creating product: ${error?.message}`);
        }

        return mapRowToProduct(data);
    }

    async update(id: string, updates: Partial<Product>): Promise<Product | null> {
        const row = mapProductToRow(updates);

        const { data, error } = await supabase
            .from(this.tableName)
            .update(row)
            .eq('id', id)
            .select()
            .single();

        if (error || !data) {
            console.error('Error updating product:', error);
            return null;
        }

        return mapRowToProduct(data);
    }

    async delete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from(this.tableName)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting product:', error);
            return false;
        }

        return true;
    }

    async updateStatus(id: string, status: ProductStatus): Promise<Product | null> {
        return this.update(id, { status });
    }
}
