-- PASO 3: Insertar productos iniciales
-- Copia esto y ejecuta con el botón "Correr"

INSERT INTO products (name, price, image_url, tag, category, status, description) VALUES
('Monstera Deliciosa', 450, 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80', 'Best Seller', 'plantas', 'disponible', 'La Monstera Deliciosa es una planta tropical perfecta para interiores.'),
('Palma Areca', 800, 'https://images.unsplash.com/photo-1596005554384-d293674c91d7?auto=format&fit=crop&w=800&q=80', NULL, 'plantas', 'disponible', 'Palma elegante que purifica el aire de tu hogar.'),
('Maceta Negra', 250, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80', 'Limited', 'macetas', 'disponible', 'Maceta de cerámica artesanal con acabado mate.'),
('Sustrato Premium', 120, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80', NULL, 'suplementos', 'disponible', 'Mezcla especial de tierra para plantas de interior.'),
('Orquídea Real', 650, 'https://images.unsplash.com/photo-1566958763363-2394fbd77180?auto=format&fit=crop&w=800&q=80', 'Rare', 'plantas', 'vendido', 'Orquídea exótica de floración prolongada.'),
('Cactus San Pedro', 350, 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=800&q=80', NULL, 'plantas', 'disponible', 'Cactus resistente ideal para principiantes.'),
('Maceta Terracota Grande', 380, 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?auto=format&fit=crop&w=800&q=80', NULL, 'macetas', 'disponible', 'Maceta clásica de terracota hecha a mano.'),
('Fertilizante Orgánico', 95, 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80', 'Eco', 'suplementos', 'agotado', 'Fertilizante 100% orgánico para todo tipo de plantas.');