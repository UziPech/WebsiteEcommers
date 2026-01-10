-- PASO 4: Habilitar RLS y crear políticas de seguridad
-- Copia esto y ejecuta con el botón "Correr"

-- Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden ver productos
CREATE POLICY "Todos pueden ver productos" 
ON products FOR SELECT 
USING (true);

-- Política: Usuarios pueden ver su propio perfil
CREATE POLICY "Usuarios ven su perfil" 
ON profiles FOR SELECT 
TO authenticated
USING (auth.uid() = id);
