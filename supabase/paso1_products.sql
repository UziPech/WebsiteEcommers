-- PASO 1: Crear tabla de productos
-- Copia esto y ejecuta con el botón "Correr"

CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    image_url TEXT NOT NULL,
    tag TEXT,
    category TEXT NOT NULL CHECK (category IN ('plantas', 'macetas', 'suplementos')),
    status TEXT NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'vendido', 'agotado')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
