import React, { Suspense, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Scene } from './3d/Scene';
import { Loader } from '../components/Loader';
import { CartProvider } from '../backend/CartContext';
// Using new Supabase-connected contexts from presentation layer
import { AuthProvider } from '../backend/presentation/AuthContext';
import { ProductProvider } from '../backend/presentation/ProductContext';
import { CategoryProvider } from '../backend/presentation/CategoryContext';
import { FavoritesProvider } from '../backend/presentation/FavoritesContext';
import { CartButton } from '../components/CartButton';
import { Navbar } from '../components/Navbar';
import { CatalogoPage, DynamicCategoryPage } from '../components/CategoryView';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { CheckoutPage } from '../components/CheckoutPage';
import { FavoritesPage } from '../components/FavoritesPage';
import { ResetPasswordPage } from '../components/ResetPasswordPage';
import { ForgotPasswordPage } from '../components/ForgotPasswordPage';
import { Footer } from '../components/Footer';

// ============================================================================
// Home Page (3D Landing)
// ============================================================================

const HomePage: React.FC<{ onAdminClick: () => void }> = ({ onAdminClick }) => (
  /* HomePage keeps overflow-hidden to contain the 3D scene within the viewport */
  <div className="relative w-full h-screen bg-white overflow-hidden">
    {/* UI Overlay - Static Header (Logo/Date only) */}
    <header className="absolute top-0 left-0 w-full p-8 z-20 flex justify-between items-start pointer-events-none">
      <div>
        <span className="font-bold tracking-widest text-stone-900 text-sm">VB.</span>
      </div>
      <div className="hidden md:block">
        <span className="text-xs font-bold tracking-widest border border-stone-200 px-3 py-1 rounded-full text-stone-400">
          EST. 2026
        </span>
      </div>
    </header>

    {/* Floating Glassmorphism Navbar */}
    <div className="absolute top-32 left-0 w-full z-20 flex justify-center pointer-events-none">
      <div className="pointer-events-auto">
        <Navbar onAdminClick={onAdminClick} />
      </div>
    </div>

    {/* 3D Scene */}
    <div className="w-full h-full absolute top-0 left-0">
      <Suspense fallback={<Loader />}>
        <Scene />
      </Suspense>
    </div>

    {/* Footer/CTA */}
    <div className="absolute bottom-8 left-0 w-full text-center z-10 pointer-events-none mix-blend-difference">
      <p className="text-stone-500 text-xs tracking-widest animate-pulse">
        SCROLL TO ENTER
      </p>
    </div>
  </div>
);

// ============================================================================
// Layout Wrapper for Category Pages
// ============================================================================

const CategoryLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-stone-50">
    <div className="flex-1">{children}</div>
    <Footer />
    <CartButton />
  </div>
);

const ScrollLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-stone-50">
    <div className="flex-1">{children}</div>
    <Footer />
  </div>
);

// ============================================================================
// Main App
// ============================================================================

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <AuthProvider>
      <ProductProvider>
        <CategoryProvider>
        <FavoritesProvider>
          <CartProvider>
            {/* Routes */}
            <Routes>
              <Route path="/" element={<HomePage onAdminClick={() => setShowAdmin(true)} />} />
              <Route path="/catalogo" element={<CategoryLayout><CatalogoPage /></CategoryLayout>} />
              <Route path="/categoria/:slug" element={<CategoryLayout><DynamicCategoryPage /></CategoryLayout>} />
              <Route path="/favoritos" element={<CategoryLayout><FavoritesPage /></CategoryLayout>} />
              <Route path="/checkout" element={<ScrollLayout><CheckoutPage /></ScrollLayout>} />
              <Route path="/forgot-password" element={<ScrollLayout><ForgotPasswordPage /></ScrollLayout>} />
              <Route path="/reset-password" element={<ScrollLayout><ResetPasswordPage /></ScrollLayout>} />
            </Routes>

            {/* Cart Button (only on home) */}
            {isHomePage && <CartButton />}

            {/* Admin Dashboard */}
            {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
          </CartProvider>
        </FavoritesProvider>
        </CategoryProvider>
      </ProductProvider>
    </AuthProvider>
  );
}