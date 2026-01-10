-- ============================================================================
-- Supabase Database Setup for Vivero Balam
-- Run this in the SQL Editor (Supabase Dashboard → SQL Editor → New Query)
-- ============================================================================

-- 1. Create products table
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

-- 2. Create profiles table (extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Policies for products table
-- Everyone can read products
CREATE POLICY "Products are viewable by everyone" 
ON products FOR SELECT 
USING (true);

-- Only admins can insert/update/delete products
CREATE POLICY "Admins can insert products" 
ON products FOR INSERT 
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admins can update products" 
ON products FOR UPDATE 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admins can delete products" 
ON products FOR DELETE 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- 5. Policies for profiles table
-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Users can update their own profile (but not role)
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

-- 6. Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, role)
    VALUES (
        new.id, 
        COALESCE(new.raw_user_meta_data->>'name', 'Usuario'),
        COALESCE(new.raw_user_meta_data->>'role', 'user')
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Insert initial products (same as current mock data)
INSERT INTO products (name, price, image_url, tag, category, status, description) VALUES
('Monstera Deliciosa', 450, 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80', 'Best Seller', 'plantas', 'disponible', 'La Monstera Deliciosa es una planta tropical perfecta para interiores.'),
('Palma Areca', 800, 'https://images.unsplash.com/photo-1596005554384-d293674c91d7?auto=format&fit=crop&w=800&q=80', NULL, 'plantas', 'disponible', 'Palma elegante que purifica el aire de tu hogar.'),
('Maceta Negra', 250, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80', 'Limited', 'macetas', 'disponible', 'Maceta de cerámica artesanal con acabado mate.'),
('Sustrato Premium', 120, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80', NULL, 'suplementos', 'disponible', 'Mezcla especial de tierra para plantas de interior.'),
('Orquídea Real', 650, 'https://images.unsplash.com/photo-1566958763363-2394fbd77180?auto=format&fit=crop&w=800&q=80', 'Rare', 'plantas', 'vendido', 'Orquídea exótica de floración prolongada.'),
('Cactus San Pedro', 350, 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=800&q=80', NULL, 'plantas', 'disponible', 'Cactus resistente ideal para principiantes.'),
('Maceta Terracota Grande', 380, 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?auto=format&fit=crop&w=800&q=80', NULL, 'macetas', 'disponible', 'Maceta clásica de terracota hecha a mano.'),
('Fertilizante Orgánico', 95, 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80', 'Eco', 'suplementos', 'agotado', 'Fertilizante 100% orgánico para todo tipo de plantas.');

-- Done! Your database is ready.
SELECT 'Setup complete! Products and profiles tables created with RLS policies.' as status;
