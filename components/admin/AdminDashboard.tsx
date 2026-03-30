import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts, Product, ProductStatus } from '../../backend/presentation/ProductContext';
import { useCategories, Category } from '../../backend/presentation/CategoryContext';
import { useAuth } from '../../backend/presentation/AuthContext';
import { ImageUpload } from '../ImageUpload';

// ============================================================================
// Icons
// ============================================================================

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

const TagIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
    </svg>
);

// ============================================================================
// Fuzzy Search Helpers
// ============================================================================

function scoreProductSearch(product: Product, query: string): number {
    const q = query.trim().toLowerCase();
    if (!q) return 1; // no query = show all with neutral score
    const keywords = q.split(/\s+/).filter(Boolean);

    const name = product.name.toLowerCase();
    const description = (product.description || '').toLowerCase();
    const category = (product.category || '').toLowerCase();
    const tag = (product.tag || '').toLowerCase();

    let score = 0;

    // Exact full-phrase match in name → huge boost
    if (name.includes(q)) score += 60;
    if (name.startsWith(q)) score += 25;

    // Full-phrase in category / tag
    if (category.includes(q) || tag.includes(q)) score += 20;

    // Full-phrase in description
    if (description.includes(q)) score += 10;

    // Per-keyword scoring
    for (const kw of keywords) {
        if (name.includes(kw)) score += 15;
        if (name.startsWith(kw)) score += 10;
        if (category.includes(kw) || tag.includes(kw)) score += 8;
        if (description.includes(kw)) score += 3;
    }

    return score;
}

function scoreCategorySearch(category: Category, products: Product[], query: string): number {
    const q = query.trim().toLowerCase();
    if (!q) return 1;
    const keywords = q.split(/\s+/).filter(Boolean);

    const name = category.name.toLowerCase();
    const description = (category.description || '').toLowerCase();

    let score = 0;

    if (name.includes(q)) score += 60;
    if (name.startsWith(q)) score += 25;
    if (description.includes(q)) score += 10;

    for (const kw of keywords) {
        if (name.includes(kw)) score += 15;
        if (name.startsWith(kw)) score += 10;
        if (description.includes(kw)) score += 3;
    }

    // Bonus: number of products in this category
    const productCount = products.filter(p => p.category.toLowerCase() === name).length;
    if (score > 0 && productCount > 0) score += Math.min(productCount, 5);

    return score;
}

/** Highlight matching keywords in text */
const HighlightMatch: React.FC<{ text: string; query: string }> = ({ text, query }) => {
    if (!query.trim()) return <>{text}</>;
    const keywords = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const pattern = keywords.map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${pattern})`, 'gi');
    const parts = text.split(regex);
    return (
        <>
            {parts.map((part, i) =>
                regex.test(part)
                    ? <mark key={i} className="bg-amber-100 text-amber-800 rounded px-0.5">{part}</mark>
                    : <span key={i}>{part}</span>
            )}
        </>
    );
};

// ============================================================================
// Status Badge
// ============================================================================

const StatusBadge: React.FC<{ status: ProductStatus }> = ({ status }) => {
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
// Pagination Controls
// ============================================================================

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 px-2">
            <p className="text-sm text-stone-500">
                Mostrando <span className="font-medium text-stone-700">{startItem}-{endItem}</span> de <span className="font-medium text-stone-700">{totalItems}</span> productos
            </p>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Página anterior"
                >
                    <ChevronLeftIcon className="w-4 h-4 text-stone-600" />
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                            // Show first, last, current, and adjacent pages
                            if (page === 1 || page === totalPages) return true;
                            if (Math.abs(page - currentPage) <= 1) return true;
                            return false;
                        })
                        .map((page, idx, arr) => {
                            const elements = [];
                            // Add ellipsis if there's a gap
                            if (idx > 0 && page - arr[idx - 1] > 1) {
                                elements.push(
                                    <span key={`ellipsis-${page}`} className="px-1 text-stone-400 text-sm">…</span>
                                );
                            }
                            elements.push(
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                                        page === currentPage
                                            ? 'bg-stone-900 text-white'
                                            : 'text-stone-600 hover:bg-stone-100'
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                            return elements;
                        })
                    }
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Página siguiente"
                >
                    <ChevronRightIcon className="w-4 h-4 text-stone-600" />
                </button>
            </div>
        </div>
    );
};

// ============================================================================
// Product Form Modal
// ============================================================================

interface ProductFormProps {
    product?: Product;
    categories: Category[];
    onClose: () => void;
    onSave: (data: Omit<Product, 'id'>) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, categories, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        price: product?.price?.toString() || '',
        imageUrl: product?.imageUrl || '',
        tag: product?.tag || '',
        category: product?.category || (categories.length > 0 ? categories[0].name.toLowerCase() : ''),
        status: product?.status || 'disponible' as ProductStatus,
        description: product?.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formattedData = {
            ...formData,
            price: parseFloat(formData.price) || 0,
        };
        onSave(formattedData as any);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-stone-200">
                    <h2 className="text-xl font-semibold text-stone-900">
                        {product ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full">
                        <CloseIcon className="w-5 h-5 text-stone-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Nombre</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Precio</label>
                            <div className="relative">
                                <span className="absolute left-4 top-2 text-stone-500">$</span>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full pl-8 pr-12 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 outline-none"
                                    placeholder="000"
                                    required
                                    min="0"
                                />
                                <span className="absolute right-4 top-2 text-stone-500 text-sm font-medium">MXN</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Etiqueta</label>
                            <input
                                type="text"
                                value={formData.tag}
                                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 outline-none"
                                placeholder="Best Seller, Rare, etc."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Imagen del Producto</label>
                        <ImageUpload
                            currentImageUrl={formData.imageUrl}
                            onImageUploaded={(url) => setFormData({ ...formData, imageUrl: url })}
                        />
                        {/* Also allow URL input as fallback */}
                        <div className="mt-2">
                            <label className="block text-xs text-stone-500 mb-1">O ingresa URL directamente:</label>
                            <input
                                type="url"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                className="w-full px-3 py-1.5 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 outline-none"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Categoría</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 outline-none"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name.toLowerCase()}>
                                        {cat.name}
                                    </option>
                                ))}
                                {categories.length === 0 && (
                                    <option value="">Sin categorías</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Estado</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductStatus })}
                                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 outline-none"
                            >
                                <option value="disponible">Disponible</option>
                                <option value="vendido">Vendido</option>
                                <option value="agotado">Agotado</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Descripción</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 outline-none resize-none"
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                        >
                            {product ? 'Guardar Cambios' : 'Crear Producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ============================================================================
// Category Form Modal
// ============================================================================

interface CategoryFormProps {
    category?: Category;
    onClose: () => void;
    onSave: (data: { name: string; description?: string }) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: category?.name || '',
        description: category?.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name: formData.name.trim(),
            description: formData.description.trim() || undefined,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-stone-200">
                    <h2 className="text-xl font-semibold text-stone-900">
                        {category ? 'Editar Categoría' : 'Nueva Categoría'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full">
                        <CloseIcon className="w-5 h-5 text-stone-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Nombre de la Categoría</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 outline-none"
                            placeholder="Ej: Suculentas, Herramientas..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Descripción (opcional)</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 outline-none resize-none"
                            rows={3}
                            placeholder="Describe brevemente esta categoría..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                        >
                            {category ? 'Guardar Cambios' : 'Crear Categoría'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ============================================================================
// Product Card (Mobile View)
// ============================================================================

interface ProductCardProps {
    product: Product;
    onEdit: () => void;
    onDelete: () => void;
    onStatusChange: (status: ProductStatus) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete, onStatusChange }) => (
    <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3">
        {/* Image and Title */}
        <div className="flex items-start gap-3">
            <img
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-stone-900 truncate">{product.name}</h3>
                {product.tag && (
                    <span className="text-xs text-stone-500 block">{product.tag}</span>
                )}
                <p className="text-sm text-stone-600 mt-1 capitalize">{product.category}</p>
            </div>
        </div>

        {/* Price and Status */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
                <p className="text-xs text-stone-500">Precio</p>
                <p className="text-lg font-semibold text-stone-900">${product.price} MXN</p>
            </div>
            <div className="flex flex-col items-end gap-1">
                <p className="text-xs text-stone-500">Estado</p>
                <select
                    value={product.status}
                    onChange={(e) => onStatusChange(e.target.value as ProductStatus)}
                    className="px-3 py-1.5 text-sm border border-stone-200 rounded-lg bg-white"
                >
                    <option value="disponible">Disponible</option>
                    <option value="vendido">Vendido</option>
                    <option value="agotado">Agotado</option>
                </select>
            </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
            <button
                onClick={onEdit}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50"
            >
                <PencilIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Editar</span>
            </button>
            <button
                onClick={onDelete}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-200"
            >
                <TrashIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Eliminar</span>
            </button>
        </div>
    </div>
);

// ============================================================================
// Delete Confirmation Modal
// ============================================================================

interface DeleteConfirmProps {
    itemName: string;
    itemType?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteConfirm: React.FC<DeleteConfirmProps> = ({ itemName, itemType = 'producto', onConfirm, onCancel }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-stone-900 mb-2">¿Eliminar {itemType}?</h3>
            <p className="text-stone-600 mb-6">
                ¿Estás seguro de que quieres eliminar <strong>{itemName}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50"
                >
                    Cancelar
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    Eliminar
                </button>
            </div>
        </div>
    </div>
);

// ============================================================================
// Admin Dashboard
// ============================================================================

type AdminTab = 'productos' | 'categorias';

interface AdminDashboardProps {
    onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
    const { user } = useAuth();
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    const { categories, addCategory, updateCategory, deleteCategory } = useCategories();

    // Tab state
    const [activeTab, setActiveTab] = useState<AdminTab>('productos');

    // Product states
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>();
    const [deletingProduct, setDeletingProduct] = useState<Product | undefined>();
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [productSearch, setProductSearch] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Category states
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | undefined>();
    const [deletingCategory, setDeletingCategory] = useState<Category | undefined>();
    const [categorySearch, setCategorySearch] = useState('');

    // Reset page when filters or search change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterCategory, filterStatus, productSearch]);

    // Filter & search products
    const filteredProducts = products
        .map(p => ({ product: p, score: scoreProductSearch(p, productSearch) }))
        .filter(({ product: p, score }) => {
            const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
            const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
            const matchesSearch = !productSearch.trim() || score > 0;
            return matchesCategory && matchesStatus && matchesSearch;
        })
        .sort((a, b) => b.score - a.score)
        .map(({ product }) => product);

    // Paginate
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Product handlers
    const handleSaveProduct = (data: Omit<Product, 'id'>) => {
        if (editingProduct) {
            updateProduct(editingProduct.id, data);
        } else {
            addProduct(data);
        }
        setEditingProduct(undefined);
    };

    const handleDeleteProduct = () => {
        if (deletingProduct) {
            deleteProduct(deletingProduct.id);
            setDeletingProduct(undefined);
        }
    };

    const handleStatusChange = (product: Product, newStatus: ProductStatus) => {
        updateProduct(product.id, { status: newStatus });
    };

    // Category handlers
    const handleSaveCategory = (data: { name: string; description?: string }) => {
        if (editingCategory) {
            updateCategory(editingCategory.id, data);
        } else {
            addCategory(data);
        }
        setEditingCategory(undefined);
    };

    const handleDeleteCategory = () => {
        if (deletingCategory) {
            deleteCategory(deletingCategory.id);
            setDeletingCategory(undefined);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-stone-50 overflow-y-auto">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-serif italic text-stone-900">Panel de Administración</h1>
                            <p className="text-sm text-stone-500">Bienvenido, {user?.name}</p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            {activeTab === 'productos' && (
                                <button
                                    onClick={() => { setEditingProduct(undefined); setShowProductForm(true); }}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors text-sm sm:text-base"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    <span>Nuevo Producto</span>
                                </button>
                            )}
                            {activeTab === 'categorias' && (
                                <button
                                    onClick={() => { setEditingCategory(undefined); setShowCategoryForm(true); }}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors text-sm sm:text-base"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    <span>Nueva Categoría</span>
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="flex-1 sm:flex-none px-4 py-2 border border-stone-200 text-stone-600 rounded-full hover:bg-stone-50 text-sm sm:text-base"
                            >
                                Volver
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mt-4 bg-stone-100 rounded-lg p-1 w-fit">
                        <button
                            onClick={() => setActiveTab('productos')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                activeTab === 'productos'
                                    ? 'bg-white text-stone-900 shadow-sm'
                                    : 'text-stone-500 hover:text-stone-700'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                            Productos
                        </button>
                        <button
                            onClick={() => setActiveTab('categorias')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                activeTab === 'categorias'
                                    ? 'bg-white text-stone-900 shadow-sm'
                                    : 'text-stone-500 hover:text-stone-700'
                            }`}
                        >
                            <TagIcon className="w-4 h-4" />
                            Categorías
                        </button>
                    </div>
                </div>
            </header>

            {/* ================================================================ */}
            {/* PRODUCTOS TAB                                                    */}
            {/* ================================================================ */}
            {activeTab === 'productos' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <div className="bg-white rounded-xl p-4 sm:p-6 border border-stone-200">
                            <p className="text-xs sm:text-sm text-stone-500">Total Productos</p>
                            <p className="text-2xl sm:text-3xl font-bold text-stone-900">{products.length}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 sm:p-6 border border-stone-200">
                            <p className="text-xs sm:text-sm text-stone-500">Disponibles</p>
                            <p className="text-2xl sm:text-3xl font-bold text-emerald-600">
                                {products.filter((p) => p.status === 'disponible').length}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-4 sm:p-6 border border-stone-200">
                            <p className="text-xs sm:text-sm text-stone-500">Vendidos</p>
                            <p className="text-2xl sm:text-3xl font-bold text-amber-600">
                                {products.filter((p) => p.status === 'vendido').length}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-4 sm:p-6 border border-stone-200">
                            <p className="text-xs sm:text-sm text-stone-500">Agotados</p>
                            <p className="text-2xl sm:text-3xl font-bold text-red-600">
                                {products.filter((p) => p.status === 'agotado').length}
                            </p>
                        </div>
                    </div>

                    {/* Search + Filters */}
                    <div className="flex flex-col gap-3 mb-4 sm:mb-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                                type="text"
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                                placeholder="Buscar por nombre, categoría, etiqueta, descripción…"
                                className="w-full pl-10 pr-10 py-2.5 border border-stone-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-stone-400 focus:border-stone-400 outline-none transition-all placeholder-stone-400"
                            />
                            {productSearch && (
                                <button
                                    onClick={() => setProductSearch('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
                                >
                                    <CloseIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        {/* Dropdown Filters */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="w-full sm:w-auto px-4 py-2 border border-stone-200 rounded-lg bg-white text-sm"
                            >
                                <option value="all">Todas las categorías</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name.toLowerCase()}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full sm:w-auto px-4 py-2 border border-stone-200 rounded-lg bg-white text-sm"
                            >
                                <option value="all">Todos los estados</option>
                                <option value="disponible">Disponible</option>
                                <option value="vendido">Vendido</option>
                                <option value="agotado">Agotado</option>
                            </select>
                            {productSearch.trim() && (
                                <span className="inline-flex items-center text-xs text-stone-500 sm:ml-auto">
                                    {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Product Table - Desktop */}
                    <div className="hidden md:block bg-white rounded-xl border border-stone-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-stone-50 border-b border-stone-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Producto</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Categoría</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Precio</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Estado</th>
                                    <th className="text-right px-6 py-4 text-sm font-medium text-stone-500">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {paginatedProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-stone-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <div>
                                                    <p className="font-medium text-stone-900">
                                                        <HighlightMatch text={product.name} query={productSearch} />
                                                    </p>
                                                    {product.tag && (
                                                        <span className="text-xs text-stone-500">
                                                            <HighlightMatch text={product.tag} query={productSearch} />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 capitalize text-stone-600">
                                            <HighlightMatch text={product.category} query={productSearch} />
                                        </td>
                                        <td className="px-6 py-4 text-stone-900">${product.price} MXN</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={product.status}
                                                onChange={(e) => handleStatusChange(product, e.target.value as ProductStatus)}
                                                className="px-3 py-1 text-sm border border-stone-200 rounded-lg bg-white"
                                            >
                                                <option value="disponible">Disponible</option>
                                                <option value="vendido">Vendido</option>
                                                <option value="agotado">Agotado</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => { setEditingProduct(product); setShowProductForm(true); }}
                                                    className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                                                    title="Editar"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingProduct(product)}
                                                    className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                    title="Eliminar"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-12 text-stone-500">
                                No hay productos que coincidan con los filtros.
                            </div>
                        )}
                    </div>

                    {/* Product Cards - Mobile */}
                    <div className="md:hidden space-y-4">
                        {paginatedProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onEdit={() => { setEditingProduct(product); setShowProductForm(true); }}
                                onDelete={() => setDeletingProduct(product)}
                                onStatusChange={(status) => handleStatusChange(product, status)}
                            />
                        ))}

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-12 text-stone-500 bg-white rounded-xl border border-stone-200">
                                No hay productos que coincidan con los filtros.
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredProducts.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* ================================================================ */}
            {/* CATEGORÍAS TAB                                                   */}
            {/* ================================================================ */}
            {activeTab === 'categorias' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <div className="bg-white rounded-xl p-4 sm:p-6 border border-stone-200">
                            <p className="text-xs sm:text-sm text-stone-500">Total Categorías</p>
                            <p className="text-2xl sm:text-3xl font-bold text-stone-900">{categories.length}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 sm:p-6 border border-stone-200">
                            <p className="text-xs sm:text-sm text-stone-500">Productos Categorizados</p>
                            <p className="text-2xl sm:text-3xl font-bold text-stone-900">{products.length}</p>
                        </div>
                    </div>

                    {/* Search Bar — Categories */}
                    <div className="relative mb-5">
                        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                            type="text"
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            placeholder="Buscar categorías por nombre o descripción…"
                            className="w-full pl-10 pr-10 py-2.5 border border-stone-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-stone-400 focus:border-stone-400 outline-none transition-all placeholder-stone-400"
                        />
                        {categorySearch && (
                            <button
                                onClick={() => setCategorySearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
                            >
                                <CloseIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Categories Table - Desktop */}
                    <div className="hidden md:block bg-white rounded-xl border border-stone-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-stone-50 border-b border-stone-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Nombre</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Descripción</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Productos</th>
                                    <th className="text-right px-6 py-4 text-sm font-medium text-stone-500">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {categories
                                    .map(cat => ({ category: cat, score: scoreCategorySearch(cat, products, categorySearch) }))
                                    .filter(({ score }) => !categorySearch.trim() || score > 0)
                                    .sort((a, b) => b.score - a.score)
                                    .map(({ category }) => {
                                    const productCount = products.filter(
                                        (p) => p.category.toLowerCase() === category.name.toLowerCase()
                                    ).length;
                                    return (
                                        <tr key={category.id} className="hover:bg-stone-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center">
                                                        <TagIcon className="w-5 h-5 text-stone-500" />
                                                    </div>
                                                    <span className="font-medium text-stone-900">
                                                        <HighlightMatch text={category.name} query={categorySearch} />
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-stone-600 text-sm">
                                                {category.description
                                                    ? <HighlightMatch text={category.description} query={categorySearch} />
                                                    : <span className="text-stone-400 italic">Sin descripción</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 bg-stone-100 text-stone-700 text-xs font-medium rounded-full">
                                                    {productCount} producto{productCount !== 1 ? 's' : ''}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => { setEditingCategory(category); setShowCategoryForm(true); }}
                                                        className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                                                        title="Editar"
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeletingCategory(category)}
                                                        className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                        title="Eliminar"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {categories.length === 0 && !categorySearch.trim() && (
                            <div className="text-center py-12 text-stone-500">
                                No hay categorías. ¡Crea la primera!
                            </div>
                        )}
                        {categorySearch.trim() && categories.filter(c => scoreCategorySearch(c, products, categorySearch) > 0).length === 0 && (
                            <div className="text-center py-12 text-stone-500">
                                No se encontraron categorías para "{categorySearch}"
                            </div>
                        )}
                    </div>

                    {/* Categories Cards - Mobile */}
                    <div className="md:hidden space-y-4">
                        {categories
                            .map(cat => ({ category: cat, score: scoreCategorySearch(cat, products, categorySearch) }))
                            .filter(({ score }) => !categorySearch.trim() || score > 0)
                            .sort((a, b) => b.score - a.score)
                            .map(({ category }) => {
                            const productCount = products.filter(
                                (p) => p.category.toLowerCase() === category.name.toLowerCase()
                            ).length;
                            return (
                                <div key={category.id} className="bg-white rounded-xl border border-stone-200 p-4 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0">
                                            <TagIcon className="w-6 h-6 text-stone-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-stone-900">
                                                <HighlightMatch text={category.name} query={categorySearch} />
                                            </h3>
                                            <p className="text-sm text-stone-500 mt-0.5">
                                                {category.description
                                                    ? <HighlightMatch text={category.description} query={categorySearch} />
                                                    : 'Sin descripción'}
                                            </p>
                                            <span className="inline-block mt-2 px-2.5 py-1 bg-stone-100 text-stone-700 text-xs font-medium rounded-full">
                                                {productCount} producto{productCount !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2 border-t border-stone-100">
                                        <button
                                            onClick={() => { setEditingCategory(category); setShowCategoryForm(true); }}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                            <span className="text-sm font-medium">Editar</span>
                                        </button>
                                        <button
                                            onClick={() => setDeletingCategory(category)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-200"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                            <span className="text-sm font-medium">Eliminar</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {categories.length === 0 && !categorySearch.trim() && (
                            <div className="text-center py-12 text-stone-500 bg-white rounded-xl border border-stone-200">
                                No hay categorías. ¡Crea la primera!
                            </div>
                        )}
                        {categorySearch.trim() && categories.filter(c => scoreCategorySearch(c, products, categorySearch) > 0).length === 0 && (
                            <div className="text-center py-12 text-stone-500 bg-white rounded-xl border border-stone-200">
                                No se encontraron categorías para "{categorySearch}"
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ================================================================ */}
            {/* Modals                                                           */}
            {/* ================================================================ */}

            {/* Product Form */}
            {showProductForm && (
                <ProductForm
                    product={editingProduct}
                    categories={categories}
                    onClose={() => { setShowProductForm(false); setEditingProduct(undefined); }}
                    onSave={handleSaveProduct}
                />
            )}

            {/* Product Delete Confirm */}
            {deletingProduct && (
                <DeleteConfirm
                    itemName={deletingProduct.name}
                    itemType="producto"
                    onConfirm={handleDeleteProduct}
                    onCancel={() => setDeletingProduct(undefined)}
                />
            )}

            {/* Category Form */}
            {showCategoryForm && (
                <CategoryForm
                    category={editingCategory}
                    onClose={() => { setShowCategoryForm(false); setEditingCategory(undefined); }}
                    onSave={handleSaveCategory}
                />
            )}

            {/* Category Delete Confirm */}
            {deletingCategory && (
                <DeleteConfirm
                    itemName={deletingCategory.name}
                    itemType="categoría"
                    onConfirm={handleDeleteCategory}
                    onCancel={() => setDeletingCategory(undefined)}
                />
            )}
        </div>
    );
};
