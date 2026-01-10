// ============================================================================
// Domain Layer - Image Storage Interface (Contract)
// ============================================================================

export interface IImageStorage {
    upload(file: File, path: string): Promise<string>; // Returns public URL
    delete(path: string): Promise<boolean>;
    getPublicUrl(path: string): string;
}
