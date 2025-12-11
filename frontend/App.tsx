import React, { Suspense } from 'react';
import { Scene } from './3d/Scene';
import { Loader } from '../components/Loader';
import { CartProvider } from '../backend/CartContext';
import { CartButton } from '../components/CartButton';
import { Navbar } from '../components/Navbar';

export default function App() {
  return (
    <CartProvider>
      <div className="relative w-full h-screen bg-white overflow-hidden">
        {/* UI Overlay - Static Header (Logo/Date only) */}
        <header className="absolute top-0 left-0 w-full p-8 z-20 flex justify-between items-start pointer-events-none">
          <div>
            {/* Small brand mark instead of big H1 */}
            <span className="font-bold tracking-widest text-stone-900 text-sm">VB.</span>
          </div>
          <div className="hidden md:block">
            <span className="text-xs font-bold tracking-widest border border-stone-200 px-3 py-1 rounded-full text-stone-400">
              EST. 2024
            </span>
          </div>
        </header>

        {/* Floating Glassmorphism Navbar - Fixed Position */}
        <div className="absolute top-32 left-0 w-full z-20 flex justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <Navbar />
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

        {/* Floating Cart Button */}
        <CartButton />
      </div>
    </CartProvider>
  );
}