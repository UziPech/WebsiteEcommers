-- ============================================================
-- Configuración de Supabase Storage para imágenes de productos
-- Ejecutar en SQL Editor de Supabase
-- ============================================================

-- 1. Crear bucket para productos (si no existe, crearlo desde el dashboard)
-- Nota: Los buckets se crean mejor desde Storage > New bucket
-- Nombre: products
-- Public: SI (para que las imágenes sean accesibles)

-- 2. Políticas de Storage para el bucket 'products'

-- Permitir a todos ver imágenes (son públicas)
CREATE POLICY "Public read access for products"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- Permitir a usuarios autenticados subir imágenes
CREATE POLICY "Authenticated users can upload products"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'products' 
    AND auth.role() = 'authenticated'
);

-- Permitir a usuarios autenticados actualizar sus imágenes
CREATE POLICY "Authenticated users can update products"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'products' 
    AND auth.role() = 'authenticated'
);

-- Permitir a usuarios autenticados eliminar imágenes
CREATE POLICY "Authenticated users can delete products"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'products' 
    AND auth.role() = 'authenticated'
);

SELECT 'Políticas de Storage configuradas!' as resultado;
