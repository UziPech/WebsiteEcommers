-- ============================================================
-- Fix: Agregar políticas RLS para INSERT/UPDATE/DELETE de productos
-- Ejecutar en SQL Editor de Supabase
-- ============================================================

-- Política: Usuarios autenticados pueden crear productos
-- (En producción, podrías limitarlo solo a admins)
CREATE POLICY "Usuarios autenticados pueden crear productos"
ON products FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política: Usuarios autenticados pueden actualizar productos
CREATE POLICY "Usuarios autenticados pueden actualizar productos"
ON products FOR UPDATE
TO authenticated
USING (true);

-- Política: Usuarios autenticados pueden eliminar productos
CREATE POLICY "Usuarios autenticados pueden eliminar productos"
ON products FOR DELETE
TO authenticated
USING (true);

SELECT 'Políticas INSERT/UPDATE/DELETE agregadas!' as resultado;
