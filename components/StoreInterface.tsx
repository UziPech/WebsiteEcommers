import React from 'react';
import { Product } from '../backend/presentation/ProductContext';

// ============================================================================
// Card Component
// ============================================================================

const Card: React.FC<{ item: Product; onAdd: (item: Product) => void }> = ({ item, onAdd }) => (
  <div className="group relative flex flex-col p-4 transition-all duration-500 hover:-translate-y-1">
    {/* Minimalist Glass Card Background - Subtle */}
    <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    {/* Image Container - Editorial Aspect Ratio (Portrait) */}
    <div className="relative aspect-[3/4] overflow-hidden mb-6 z-10">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
      />
      {item.tag && (
        <span className="absolute top-4 right-4 text-[10px] font-sans font-bold tracking-[0.2em] text-white uppercase mix-blend-difference">
          {item.tag}
        </span>
      )}
    </div>

    {/* Content - Editorial Typography */}
    <div className="flex flex-col items-center text-center z-10 space-y-3">
      <h3 className="text-2xl font-serif text-stone-900 italic group-hover:text-stone-700 transition-colors">
        {item.name}
      </h3>

      <div className="flex flex-col items-center space-y-4">
        <span className="text-xs font-sans font-medium text-stone-500 tracking-wide">
          ${item.price} pesos mexicanos
        </span>

        <button
          onClick={() => onAdd(item)}
          className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 rounded-full bg-stone-900 px-6 py-2 text-[10px] font-sans font-bold tracking-[0.2em] text-white uppercase hover:bg-stone-700"
        >
          Agregar
        </button>
      </div>
    </div>
  </div>
);

// ============================================================================
// Store Interface Component
// ============================================================================

interface StoreInterfaceProps {
  products: Product[];
  loading?: boolean;
}

export const StoreInterface: React.FC<StoreInterfaceProps> = ({ products, loading = false }) => {
  // Get featured products (first 6 or products with tags)
  const featuredProducts = products
    .filter(p => p.status === 'disponible')
    .slice(0, 6);

  // Simple add to cart handler - logs to console and triggers custom event
  const handleAddToCart = (product: Product) => {
    console.log(`Added ${product.name} to cart`);
    // Dispatch custom event for cart button to listen to
    window.dispatchEvent(new CustomEvent('addToCart', { detail: product }));
  };

  return (
    <div
      id="catalogo"
      className="absolute w-full z-20 pointer-events-auto min-h-screen flex flex-col bg-gradient-to-b from-transparent to-white/10"
      style={{ top: '100vh' }}
    >
      <div className="w-full max-w-7xl mx-auto px-6 py-32 md:px-12">
        {/* Editorial Section Title */}
        <div className="mb-24 text-center">
          <p className="font-sans text-xs font-bold tracking-[0.3em] text-stone-400 mb-4 uppercase">
            Collection 2024
          </p>
          <h2 className="text-5xl md:text-7xl font-serif text-stone-800 italic">
            Nuestra Selección
          </h2>
          <div className="w-12 h-0.5 bg-stone-300 mx-auto mt-8" />
        </div>

        {/* Luxury Grid Layout - High Gaps */}
        <div id="plantas" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 pb-40">
          {loading ? (
            <div className="col-span-full text-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full mx-auto"></div>
              <p className="text-stone-500 mt-4">Cargando productos...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-stone-500">No hay productos disponibles</p>
            </div>
          ) : (
            featuredProducts.map((product) => (
              <Card key={product.id} item={product} onAdd={handleAddToCart} />
            ))
          )}
        </div>

        {/* Footer Note */}
        <div className="text-center pb-20 opacity-50">
          <p className="font-serif italic text-stone-500">Vivero Balam &copy; Yucatan</p>
        </div>
      </div>
    </div>
  );
};