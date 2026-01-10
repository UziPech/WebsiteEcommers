// ============================================================================
// Infrastructure Layer - Supabase Image Storage
// ============================================================================

import { supabase } from './client';
import { IImageStorage } from '../../domain';

export class SupabaseImageStorage implements IImageStorage {
    private readonly bucketName = 'product-images';

    async upload(file: File, path: string): Promise<string> {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${path}/${Date.now()}.${fileExt}`;

        const { error } = await supabase.storage
            .from(this.bucketName)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            throw new Error(`Error uploading image: ${error.message}`);
        }

        return this.getPublicUrl(fileName);
    }

    async delete(path: string): Promise<boolean> {
        const { error } = await supabase.storage
            .from(this.bucketName)
            .remove([path]);

        if (error) {
            console.error('Error deleting image:', error);
            return false;
        }

        return true;
    }

    getPublicUrl(path: string): string {
        const { data } = supabase.storage
            .from(this.bucketName)
            .getPublicUrl(path);

        return data.publicUrl;
    }
}
