import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts, Product } from '../backend/ProductContext';

// ============================================================================
// Icons
// ============================================================================

const BackIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

// ============================================================================
// Status Badge Component
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
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
            {labels[status]}
        </span>
    );
};

// ============================================================================
// Product Card Component (App Store Style)
// ============================================================================

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
        {/* Image */}
        <div className="aspect-square overflow-hidden">
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Tag */}
            {product.tag && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-stone-900 text-white text-xs font-bold tracking-wider rounded-full">
                    {product.tag}
                </span>
            )}
            {/* Status */}
            <div className="absolute top-4 right-4">
                <StatusBadge status={product.status} />
            </div>
        </div>

        {/* Content */}
        <div className="p-5">
            <h3 className="text-lg font-semibold text-stone-900 mb-1">{product.name}</h3>
            <p className="text-sm text-stone-500 mb-3 line-clamp-2">{product.description}</p>

            <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-stone-900">{product.price}</span>

                {product.status === 'disponible' ? (
                    <button
                        onClick={() => onAddToCart(product)}
                        className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-full hover:bg-stone-800 transition-colors"
                    >
                        Agregar
                    </button>
                ) : (
                    <span className="text-sm text-stone-400">No disponible</span>
                )}
            </div>
        </div>
    </div>
);

// ============================================================================
// Category View Component
// ============================================================================

interface CategoryViewProps {
    title: string;
    subtitle: string;
    category: string;
}

export const CategoryView: React.FC<CategoryViewProps> = ({ title, subtitle, category }) => {
    const { getProductsByCategory } = useProducts();
    const products = getProductsByCategory(category);

    const handleAddToCart = (product: Product) => {
        console.log(`Added ${product.name} to cart`);
        window.dispatchEvent(new CustomEvent('addToCart', { detail: product }));
    };

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-stone-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link
                        to="/"
                        className="flex items-center gap-1 text-stone-600 hover:text-stone-900 transition-colors"
                    >
                        <BackIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Inicio</span>
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <div className="bg-gradient-to-b from-white to-stone-50 py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-6xl font-serif italic text-stone-900 mb-4">
                        {title}
                    </h1>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-20">
                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-stone-500">No hay productos en esta categoría.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// Pre-configured Category Pages
// ============================================================================

export const PlantasPage: React.FC = () => (
    <CategoryView
        title="Plantas"
        subtitle="Transforma tu espacio con nuestra selección de plantas tropicales y exóticas"
        category="plantas"
    />
);

export const MacetasPage: React.FC = () => (
    <CategoryView
        title="Macetas"
        subtitle="Macetas artesanales que complementan la belleza de tus plantas"
        category="macetas"
    />
);

export const SuplementosPage: React.FC = () => (
    <CategoryView
        title="Suplementos"
        subtitle="Todo lo que necesitas para el cuidado perfecto de tus plantas"
        category="suplementos"
    />
);

export const CatalogoPage: React.FC = () => (
    <CategoryView
        title="Catálogo"
        subtitle="Explora toda nuestra colección de plantas, macetas y suplementos"
        category="all"
    />
);
