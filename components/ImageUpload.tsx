// ============================================================================
// ImageUpload Component - Upload images to Supabase Storage
// ============================================================================

import React, { useState, useRef } from 'react';
import { supabase } from '../backend/infrastructure/supabase/client';

// ============================================================================
// Types
// ============================================================================

interface ImageUploadProps {
    currentImageUrl?: string;
    onImageUploaded: (url: string) => void;
    bucket?: string;
    folder?: string;
}

// ============================================================================
// Icons
// ============================================================================

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

// ============================================================================
// Component
// ============================================================================

export const ImageUpload: React.FC<ImageUploadProps> = ({
    currentImageUrl,
    onImageUploaded,
    bucket = 'products',
    folder = 'images',
}) => {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Por favor selecciona una imagen');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('La imagen debe ser menor a 5MB');
            return;
        }

        setError(null);
        setUploading(true);

        try {
            // Create unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            // Upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(data.path);

            setPreviewUrl(publicUrl);
            onImageUploaded(publicUrl);
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'Error al subir la imagen');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreviewUrl(null);
        onImageUploaded('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-2">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {previewUrl ? (
                <div className="relative group">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-stone-200"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={handleClick}
                            className="p-2 bg-white rounded-full hover:bg-stone-100 transition-colors"
                            title="Cambiar imagen"
                        >
                            <UploadIcon className="w-5 h-5 text-stone-700" />
                        </button>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                            title="Eliminar imagen"
                        >
                            <TrashIcon className="w-5 h-5 text-red-500" />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={handleClick}
                    disabled={uploading}
                    className={`
                        w-full h-48 border-2 border-dashed rounded-lg
                        flex flex-col items-center justify-center gap-2
                        transition-colors cursor-pointer
                        ${uploading
                            ? 'border-stone-300 bg-stone-50 cursor-wait'
                            : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
                        }
                    `}
                >
                    {uploading ? (
                        <>
                            <SpinnerIcon className="w-8 h-8 text-stone-400" />
                            <span className="text-sm text-stone-500">Subiendo...</span>
                        </>
                    ) : (
                        <>
                            <UploadIcon className="w-8 h-8 text-stone-400" />
                            <span className="text-sm font-medium text-stone-600">
                                Click para subir imagen
                            </span>
                            <span className="text-xs text-stone-400">
                                PNG, JPG, WEBP (max 5MB)
                            </span>
                        </>
                    )}
                </button>
            )}

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};
