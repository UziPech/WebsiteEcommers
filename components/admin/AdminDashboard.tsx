import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts, Product, ProductStatus, ProductCategory } from '../../backend/presentation/ProductContext';
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
// Product Form Modal
// ============================================================================

interface ProductFormProps {
    product?: Product;
    onClose: () => void;
    onSave: (data: Omit<Product, 'id'>) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        price: product?.price?.toString() || '',
        imageUrl: product?.imageUrl || '',
        tag: product?.tag || '',
        category: product?.category || 'plantas' as ProductCategory,
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
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 outline-none"
                            >
                                <option value="plantas">Plantas</option>
                                <option value="macetas">Macetas</option>
                                <option value="suplementos">Suplementos</option>
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
    productName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteConfirm: React.FC<DeleteConfirmProps> = ({ productName, onConfirm, onCancel }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-stone-900 mb-2">¿Eliminar producto?</h3>
            <p className="text-stone-600 mb-6">
                ¿Estás seguro de que quieres eliminar <strong>{productName}</strong>? Esta acción no se puede deshacer.
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

interface AdminDashboardProps {
    onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
    const { user } = useAuth();
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>();
    const [deletingProduct, setDeletingProduct] = useState<Product | undefined>();
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredProducts = products.filter((p) => {
        const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
        const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
        return matchesCategory && matchesStatus;
    });

    const handleSave = (data: Omit<Product, 'id'>) => {
        if (editingProduct) {
            updateProduct(editingProduct.id, data);
        } else {
            addProduct(data);
        }
        setEditingProduct(undefined);
    };

    const handleDelete = () => {
        if (deletingProduct) {
            deleteProduct(deletingProduct.id);
            setDeletingProduct(undefined);
        }
    };

    const handleStatusChange = (product: Product, newStatus: ProductStatus) => {
        updateProduct(product.id, { status: newStatus });
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
                            <button
                                onClick={() => { setEditingProduct(undefined); setShowForm(true); }}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors text-sm sm:text-base"
                            >
                                <PlusIcon className="w-5 h-5" />
                                <span>Nuevo</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 sm:flex-none px-4 py-2 border border-stone-200 text-stone-600 rounded-full hover:bg-stone-50 text-sm sm:text-base"
                            >
                                Volver
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
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

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2 border border-stone-200 rounded-lg bg-white text-sm"
                    >
                        <option value="all">Todas las categorías</option>
                        <option value="plantas">Plantas</option>
                        <option value="macetas">Macetas</option>
                        <option value="suplementos">Suplementos</option>
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
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-stone-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-stone-900">{product.name}</p>
                                                {product.tag && (
                                                    <span className="text-xs text-stone-500">{product.tag}</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 capitalize text-stone-600">{product.category}</td>
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
                                                onClick={() => { setEditingProduct(product); setShowForm(true); }}
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
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onEdit={() => { setEditingProduct(product); setShowForm(true); }}
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
            </div>

            {/* Modals */}
            {showForm && (
                <ProductForm
                    product={editingProduct}
                    onClose={() => { setShowForm(false); setEditingProduct(undefined); }}
                    onSave={handleSave}
                />
            )}

            {deletingProduct && (
                <DeleteConfirm
                    productName={deletingProduct.name}
                    onConfirm={handleDelete}
                    onCancel={() => setDeletingProduct(undefined)}
                />
            )}
        </div>
    );
};
