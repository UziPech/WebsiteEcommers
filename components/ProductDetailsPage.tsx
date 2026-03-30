import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useProducts, Product } from '../backend/presentation/ProductContext';
import { useFavorites } from '../backend/presentation/FavoritesContext';
import { useAuth } from '../backend/presentation/AuthContext';
import { toSlug } from './CategoryView';

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

const CartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);

// ============================================================================
// Status Badge
// ============================================================================

const StatusBadge: React.FC<{ status: Product['status'] }> = ({ status }) => {
    const styles = {
        disponible: 'bg-emerald-100 text-emerald-700',
        vendido: 'bg-amber-100 text-amber-700',
        agotado: 'bg-red-100 text-red-700',
    };

    const labels = {
        disponible: 'Disponible',
        vendido: 'Vendido',
        agotado: 'Agotado',
    };

    return (
        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${styles[status]}`}>
            {labels[status]}
        </span>
    );
};

// ============================================================================
// Product Details Page
// ============================================================================

export const ProductDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getProductById } = useProducts();
    const { isFavorite, toggleFavorite } = useFavorites();
    const { isAuthenticated } = useAuth();

    const [showImageModal, setShowImageModal] = useState(false);

    const product = id ? getProductById(id) : undefined;

    // ── Not found state ──────────────────────────────────────────────────
    if (!product) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-serif italic text-stone-900 mb-2">
                        Producto no encontrado
                    </h1>
                    <p className="text-stone-500 mb-6">
                        El producto que buscas no existe o fue eliminado.
                    </p>
                    <Link
                        to="/"
                        className="px-6 py-2 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    // ── Handlers ──────────────────────────────────────────────────────────
    const handleAddToCart = () => {
        window.dispatchEvent(new CustomEvent('addToCart', { detail: product }));
    };

    const handleToggleFavorite = () => {
        if (!isAuthenticated) {
            alert('Inicia sesión para guardar favoritos');
            return;
        }
        toggleFavorite(product.id);
    };

    const categorySlug = toSlug(product.category);

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-stone-50">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-stone-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-stone-600 hover:text-stone-900 transition-colors"
                    >
                        <BackIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Atrás</span>
                    </button>

                    <span className="text-stone-300">|</span>

                    <Link
                        to={`/categoria/${categorySlug}`}
                        className="text-sm text-stone-500 hover:text-stone-900 transition-colors capitalize"
                    >
                        {product.category}
                    </Link>
                </div>
            </header>

            {/* Main content */}
            <div className="max-w-6xl mx-auto px-6 py-10 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">

                    {/* ── Image Column ─────────────────────────────── */}
                    <div className="relative group">
                        <div
                            className="aspect-square rounded-2xl overflow-hidden bg-stone-100 cursor-pointer shadow-lg"
                            onClick={() => setShowImageModal(true)}
                        >
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                loading="eager"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-2xl">
                                <span className="bg-white/90 backdrop-blur-sm text-stone-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                    Ver imagen completa
                                </span>
                            </div>
                        </div>

                        {/* Tag floating badge */}
                        {product.tag && (
                            <span className="absolute top-4 left-4 px-3 py-1 bg-stone-900 text-white text-xs font-bold tracking-wider rounded-full z-10">
                                {product.tag}
                            </span>
                        )}
                    </div>

                    {/* ── Details Column ────────────────────────────── */}
                    <div className="flex flex-col gap-6 md:sticky md:top-28">
                        {/* Category breadcrumb */}
                        <Link
                            to={`/categoria/${categorySlug}`}
                            className="text-xs font-semibold tracking-widest text-stone-400 uppercase hover:text-stone-600 transition-colors w-fit"
                        >
                            {product.category}
                        </Link>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-serif italic text-stone-900 leading-tight">
                            {product.name}
                        </h1>

                        {/* Price & Status */}
                        <div className="flex items-center gap-4 flex-wrap">
                            <span className="text-2xl font-bold text-stone-900">
                                ${product.price}{' '}
                                <span className="text-sm font-normal text-stone-400">MXN</span>
                            </span>
                            <StatusBadge status={product.status} />
                        </div>

                        {/* Description */}
                        {product.description && (
                            <p className="text-stone-600 leading-relaxed text-base">
                                {product.description}
                            </p>
                        )}

                        {/* Divider */}
                        <div className="w-full h-px bg-stone-200" />

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {product.status === 'disponible' ? (
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-stone-900 text-white text-sm font-semibold rounded-full hover:bg-stone-800 active:scale-[0.98] transition-all"
                                >
                                    <CartIcon className="w-5 h-5" />
                                    Agregar al carrito
                                </button>
                            ) : (
                                <div className="flex-1 flex items-center justify-center px-6 py-3.5 bg-stone-100 text-stone-400 text-sm font-semibold rounded-full cursor-not-allowed">
                                    No disponible
                                </div>
                            )}

                            <button
                                onClick={handleToggleFavorite}
                                className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold transition-all active:scale-[0.98] ${
                                    isFavorite(product.id)
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'border border-stone-200 text-stone-700 hover:bg-stone-50'
                                }`}
                                title={
                                    isAuthenticated
                                        ? isFavorite(product.id)
                                            ? 'Quitar de favoritos'
                                            : 'Agregar a favoritos'
                                        : 'Inicia sesión para guardar favoritos'
                                }
                            >
                                <HeartIcon className="w-5 h-5" filled={isFavorite(product.id)} />
                                {isFavorite(product.id) ? 'Guardado' : 'Favorito'}
                            </button>
                        </div>

                        {/* Extra info */}
                        {product.tag && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-stone-400">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-stone-300" />
                                Etiqueta: <span className="text-stone-600 font-medium">{product.tag}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Fullscreen Image Modal ──────────────────────────────── */}
            {showImageModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                    onClick={() => setShowImageModal(false)}
                >
                    <button
                        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                        onClick={(e) => { e.stopPropagation(); setShowImageModal(false); }}
                        title="Cerrar imagen"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="max-w-[95vw] max-h-[95vh] object-contain rounded-xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};
