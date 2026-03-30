import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts, Product } from '../backend/presentation/ProductContext';

// ============================================================================
// Search Algorithm — Relevance Scoring
// ============================================================================

interface ScoredProduct {
    product: Product;
    score: number;
    highlights: {
        name: boolean;
        description: boolean;
        category: boolean;
    };
}

function scoreProduct(product: Product, query: string): ScoredProduct {
    const q = query.trim().toLowerCase();
    const keywords = q.split(/\s+/).filter(Boolean);

    const name = product.name.toLowerCase();
    const description = (product.description || '').toLowerCase();
    const category = (product.category || '').toLowerCase();
    const tag = (product.tag || '').toLowerCase();

    let score = 0;
    const highlights = { name: false, description: false, category: false };

    if (!q) return { product, score: 0, highlights };

    // Exact full-phrase match in name → huge boost
    if (name.includes(q)) {
        score += 60;
        highlights.name = true;
    }

    // Exact full-phrase match in category / tag
    if (category.includes(q) || tag.includes(q)) {
        score += 20;
        highlights.category = true;
    }

    // Exact full-phrase match in description
    if (description.includes(q)) {
        score += 10;
        highlights.description = true;
    }

    // Per-keyword scoring
    for (const kw of keywords) {
        if (name.includes(kw)) {
            score += 15;
            highlights.name = true;
        }
        if (category.includes(kw) || tag.includes(kw)) {
            score += 8;
            highlights.category = true;
        }
        if (description.includes(kw)) {
            score += 3;
            highlights.description = true;
        }
    }

    // Boost starts-with
    if (name.startsWith(q)) score += 25;
    for (const kw of keywords) {
        if (name.startsWith(kw)) score += 10;
    }

    return { product, score, highlights };
}

function searchProducts(products: Product[], query: string): ScoredProduct[] {
    if (!query.trim()) return [];

    return products
        .map(p => scoreProduct(p, query))
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
}

// ============================================================================
// Highlight helper — bold matching text
// ============================================================================

function HighlightText({ text, query }: { text: string; query: string }) {
    if (!query.trim()) return <span>{text}</span>;

    const keywords = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    // Build a single regex alternating all keywords
    const pattern = keywords.map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${pattern})`, 'gi');
    const parts = text.split(regex);

    return (
        <span>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <mark key={i} className="bg-transparent text-amber-600 font-bold">
                        {part}
                    </mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    );
}

// ============================================================================
// Icons
// ============================================================================

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
    </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
);

// ============================================================================
// Status Pill
// ============================================================================

const StatusPill: React.FC<{ status: Product['status'] }> = ({ status }) => {
    const map = {
        disponible: { label: 'Disponible', cls: 'bg-emerald-100 text-emerald-700' },
        vendido:    { label: 'Vendido',    cls: 'bg-amber-100 text-amber-700'   },
        agotado:    { label: 'Agotado',    cls: 'bg-red-100 text-red-700'       },
    };
    const { label, cls } = map[status];
    return (
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>
            {label}
        </span>
    );
};

// ============================================================================
// Main Component
// ============================================================================

interface SearchModalProps {
    onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
    const { products } = useProducts();
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ScoredProduct[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [visible, setVisible] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const resultRefs = useRef<(HTMLButtonElement | null)[]>([]);

    // Animate in
    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
        inputRef.current?.focus();
    }, []);

    // Search on query change
    useEffect(() => {
        const found = searchProducts(products, query);
        setResults(found);
        setActiveIndex(0);
    }, [query, products]);

    // Keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleClose();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(i => Math.min(i + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && results[activeIndex]) {
            handleSelect(results[activeIndex].product);
        }
    }, [results, activeIndex]);

    // Scroll active result into view
    useEffect(() => {
        resultRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 250);
    };

    const handleSelect = (product: Product) => {
        // Navigate to the product details page and close
        navigate(`/producto/${product.id}`);
        handleClose();
    };

    return (
        <div
            className={`fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] px-4 transition-all duration-250 ${
                visible ? 'opacity-100' : 'opacity-0'
            }`}
        >
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-250 ${
                    visible ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={handleClose}
            />

            {/* Modal panel */}
            <div
                className={`relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-black/20 border border-stone-200 overflow-hidden transition-all duration-250 ${
                    visible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 -translate-y-4 opacity-0'
                }`}
            >
                {/* Search input row */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-100">
                    <SearchIcon className="w-5 h-5 text-stone-400 flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Buscar productos, categorías…"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent text-stone-900 placeholder-stone-400 text-base outline-none"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="p-1 rounded-full hover:bg-stone-100 transition-colors text-stone-400 hover:text-stone-700"
                        >
                            <CloseIcon className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={handleClose}
                        className="ml-1 text-[11px] font-medium text-stone-400 border border-stone-200 rounded-md px-1.5 py-0.5 hover:bg-stone-100 transition-colors"
                    >
                        ESC
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-[55vh] overflow-y-auto">
                    {query.trim() === '' ? (
                        /* Empty state */
                        <div className="py-12 flex flex-col items-center gap-2 text-stone-400">
                            <SearchIcon className="w-10 h-10 opacity-30" />
                            <p className="text-sm font-medium">Escribe para buscar</p>
                            <p className="text-xs opacity-70">Usa palabras clave como "maceta", "suculenta", "barro"…</p>
                        </div>
                    ) : results.length === 0 ? (
                        /* No results */
                        <div className="py-12 flex flex-col items-center gap-2 text-stone-400">
                            <p className="text-sm font-medium">Sin resultados para <span className="text-stone-600 font-semibold">"{query}"</span></p>
                            <p className="text-xs opacity-70">Intenta con otras palabras clave</p>
                        </div>
                    ) : (
                        /* Result list */
                        <ul className="py-2">
                            {results.map(({ product, highlights }, idx) => (
                                <li key={product.id}>
                                    <button
                                        ref={el => { resultRefs.current[idx] = el; }}
                                        onClick={() => handleSelect(product)}
                                        onMouseEnter={() => setActiveIndex(idx)}
                                        className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-colors ${
                                            idx === activeIndex
                                                ? 'bg-stone-50'
                                                : 'hover:bg-stone-50/60'
                                        }`}
                                    >
                                        {/* Product image */}
                                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100">
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <SearchIcon className="w-5 h-5 text-stone-300" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-stone-900 truncate">
                                                <HighlightText text={product.name} query={query} />
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                <span className="text-xs text-stone-500 capitalize">
                                                    {highlights.category
                                                        ? <HighlightText text={product.category} query={query} />
                                                        : product.category}
                                                </span>
                                                {product.tag && (
                                                    <>
                                                        <span className="text-stone-300">·</span>
                                                        <span className="text-xs text-stone-400">{product.tag}</span>
                                                    </>
                                                )}
                                            </div>
                                            {product.description && highlights.description && (
                                                <p className="text-xs text-stone-400 truncate mt-0.5">
                                                    <HighlightText text={product.description} query={query} />
                                                </p>
                                            )}
                                        </div>

                                        {/* Right side */}
                                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                            <span className="text-sm font-bold text-stone-900">
                                                ${product.price} <span className="text-xs font-normal text-stone-400">MXN</span>
                                            </span>
                                            <StatusPill status={product.status} />
                                        </div>

                                        {/* Arrow indicator on active */}
                                        {idx === activeIndex && (
                                            <ArrowIcon className="w-4 h-4 text-stone-400 flex-shrink-0 ml-1" />
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer hint */}
                {results.length > 0 && (
                    <div className="px-5 py-2.5 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[11px] text-stone-400">
                            {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
                        </span>
                        <div className="flex items-center gap-3 text-[11px] text-stone-400">
                            <span className="flex items-center gap-1">
                                <kbd className="border border-stone-200 rounded px-1 py-0.5 font-mono text-[10px]">↑↓</kbd>
                                navegar
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="border border-stone-200 rounded px-1 py-0.5 font-mono text-[10px]">↵</kbd>
                                ir
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
