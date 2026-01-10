// ============================================================================
// Favorites Page - Shows user's favorite products
// ============================================================================

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../backend/presentation/FavoritesContext';
import { useAuth } from '../backend/presentation/AuthContext';
import { Product } from '../backend/presentation/ProductContext';

// ============================================================================
// Icons
// ============================================================================

const BackIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

const HeartIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className, filled }) => (
    <svg className={className} fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

// ============================================================================
// Component
// ============================================================================

export const FavoritesPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { getFavoriteProducts, toggleFavorite, loading } = useFavorites();
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            setLoadingProducts(true);
            const favProducts = await getFavoriteProducts();
            setProducts(favProducts);
            setLoadingProducts(false);
        };

        if (isAuthenticated) {
            loadProducts();
        } else {
            setLoadingProducts(false);
        }
    }, [isAuthenticated, getFavoriteProducts]);

    const handleRemove = async (productId: string) => {
        await toggleFavorite(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
    };

    // Not logged in
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-stone-50">
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-stone-200">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-1 text-stone-600 hover:text-stone-900 transition-colors">
                            <BackIcon className="w-5 h-5" />
                            <span className="text-sm font-medium">Inicio</span>
                        </Link>
                    </div>
                </header>
                <div className="flex flex-col items-center justify-center py-32">
                    <HeartIcon className="w-24 h-24 text-stone-300 mb-6" />
                    <h2 className="text-2xl font-serif italic text-stone-900 mb-2">
                        Inicia sesión para ver tus favoritos
                    </h2>
                    <p className="text-stone-500 mb-6">
                        Guarda tus productos preferidos y encuéntralos fácilmente
                    </p>
                    <Link
                        to="/"
                        className="px-6 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-stone-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-1 text-stone-600 hover:text-stone-900 transition-colors">
                        <BackIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Inicio</span>
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <div className="bg-gradient-to-b from-white to-stone-50 py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-6xl font-serif italic text-stone-900 mb-4">
                        Mis Favoritos
                    </h1>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                        Tus productos guardados para después
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 pb-20">
                {loadingProducts || loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full mx-auto"></div>
                        <p className="text-stone-500 mt-4">Cargando favoritos...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <HeartIcon className="w-20 h-20 text-stone-300 mx-auto mb-4" />
                        <p className="text-stone-500 text-lg">No tienes favoritos aún</p>
                        <Link
                            to="/catalogo"
                            className="inline-block mt-4 px-6 py-2 bg-stone-900 text-white rounded-full hover:bg-stone-800"
                        >
                            Explorar catálogo
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                            >
                                {/* Image */}
                                <div className="aspect-square overflow-hidden">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Remove Button */}
                                    <button
                                        onClick={() => handleRemove(product.id)}
                                        className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-md hover:bg-red-50 transition-colors"
                                        title="Quitar de favoritos"
                                    >
                                        <TrashIcon className="w-5 h-5 text-red-500" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-stone-900 mb-1">{product.name}</h3>
                                    <p className="text-sm text-stone-500 mb-3 line-clamp-2">{product.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-stone-900">${product.price} MXN</span>
                                        <Link
                                            to={`/catalogo`}
                                            className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-full hover:bg-stone-800 transition-colors"
                                        >
                                            Ver detalles
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
