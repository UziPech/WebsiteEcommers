import React, { Suspense, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Scene } from './3d/Scene';
import { Loader } from '../components/Loader';
import { CartProvider } from '../backend/CartContext';
import { AuthProvider } from '../backend/AuthContext';
import { CartButton } from '../components/CartButton';
import { Navbar } from '../components/Navbar';
import { CatalogoPage, PlantasPage, MacetasPage, SuplementosPage } from '../components/CategoryView';

// ============================================================================
// Home Page (3D Landing)
// ============================================================================

const HomePage: React.FC<{ onAdminClick: () => void }> = ({ onAdminClick }) => (
  <div className="relative w-full h-screen bg-white overflow-hidden">
    {/* UI Overlay - Static Header (Logo/Date only) */}
    <header className="absolute top-0 left-0 w-full p-8 z-20 flex justify-between items-start pointer-events-none">
      <div>
        <span className="font-bold tracking-widest text-stone-900 text-sm">VB.</span>
      </div>
      <div className="hidden md:block">
        <span className="text-xs font-bold tracking-widest border border-stone-200 px-3 py-1 rounded-full text-stone-400">
          EST. 2024
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
// Admin Panel (Placeholder for Phase 3)
// ============================================================================

const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 bg-white">
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif italic text-stone-900">Panel de Administración</h1>
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 border border-stone-200 rounded-full"
        >
          Volver a la Tienda
        </button>
      </div>
      <p className="text-stone-500">El panel de administración se implementará en la Fase 3.</p>
    </div>
  </div>
);

// ============================================================================
// Layout Wrapper for Category Pages
// ============================================================================

const CategoryLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    {children}
    <CartButton />
  </>
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
      <CartProvider>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage onAdminClick={() => setShowAdmin(true)} />} />
          <Route path="/catalogo" element={<CategoryLayout><CatalogoPage /></CategoryLayout>} />
          <Route path="/plantas" element={<CategoryLayout><PlantasPage /></CategoryLayout>} />
          <Route path="/macetas" element={<CategoryLayout><MacetasPage /></CategoryLayout>} />
          <Route path="/suplementos" element={<CategoryLayout><SuplementosPage /></CategoryLayout>} />
        </Routes>

        {/* Cart Button (only on home) */}
        {isHomePage && <CartButton />}

        {/* Admin Panel */}
        {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
      </CartProvider>
    </AuthProvider>
  );
}