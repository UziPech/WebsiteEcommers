-- ============================================================
-- Trigger para crear perfil automáticamente cuando se registra
-- Ejecutar esto en Supabase SQL Editor
-- ============================================================

-- 1. Crear función que se ejecuta cuando hay nuevo usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'name', 'Usuario'),
        'user'  -- Todos empiezan como 'user', admin asigna rol manualmente
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Eliminar trigger anterior si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Crear trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Verificar que funcionó
SELECT 'Trigger creado exitosamente!' as resultado;
