import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, Product } from '../backend/CartContext';

// ============================================================================
// Icons
// ============================================================================

const ShoppingBagIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
    </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
        />
    </svg>
);

// ============================================================================
// Component
// ============================================================================

export const CartButton: React.FC = () => {
    const { cart, cartCount, removeFromCart, addToCart } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    // Listen for custom addToCart events from StoreInterface (which is inside Canvas)
    useEffect(() => {
        const handleAddToCartEvent = (event: CustomEvent<Product>) => {
            addToCart(event.detail);
        };

        window.addEventListener('addToCart', handleAddToCartEvent as EventListener);
        return () => {
            window.removeEventListener('addToCart', handleAddToCartEvent as EventListener);
        };
    }, [addToCart]);

    return (
        <>
            {/* Floating Cart Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="
          fixed bottom-8 right-8 z-50
          flex items-center justify-center
          w-16 h-16
          rounded-full
          bg-stone-900
          text-white
          shadow-2xl shadow-stone-900/30
          transition-all duration-300
          hover:scale-110 hover:bg-stone-800
          active:scale-95
        "
                aria-label="Ver carrito"
            >
                <ShoppingBagIcon className="w-6 h-6" />

                {/* Badge */}
                {cartCount > 0 && (
                    <span
                        className="
              absolute -top-1 -right-1
              flex items-center justify-center
              min-w-[24px] h-6
              px-2
              rounded-full
              bg-emerald-500
              text-white text-xs font-bold
              animate-pulse
            "
                    >
                        {cartCount}
                    </span>
                )}
            </button>

            {/* Cart Drawer */}
            <div
                className={`
          fixed inset-y-0 right-0 z-50
          w-full max-w-md
          bg-white/95 backdrop-blur-xl
          shadow-2xl
          transform transition-transform duration-500 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-stone-200">
                    <h2 className="text-xl font-serif italic text-stone-900">
                        Tu Carrito
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-full hover:bg-stone-100 transition-colors"
                        aria-label="Cerrar carrito"
                    >
                        <CloseIcon className="w-5 h-5 text-stone-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {cart.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingBagIcon className="w-16 h-16 mx-auto text-stone-300 mb-4" />
                            <p className="text-stone-500 font-medium">
                                Tu carrito está vacío
                            </p>
                            <p className="text-stone-400 text-sm mt-2">
                                Explora nuestra colección
                            </p>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {cart.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex gap-4 p-4 bg-stone-50 rounded-lg"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-md"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-serif italic text-stone-900">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-stone-500 mt-1">
                                            {item.price} × {item.quantity}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-stone-400 hover:text-red-500 transition-colors"
                                        aria-label={`Eliminar ${item.name}`}
                                    >
                                        <CloseIcon className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="p-6 border-t border-stone-200">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                navigate('/checkout');
                            }}
                            className="
                w-full py-4
                bg-stone-900 text-white
                font-medium tracking-wide
                rounded-full
                transition-all duration-300
                hover:bg-stone-800
              "
                        >
                            Proceder al Pago
                        </button>
                    </div>
                )}
            </div>

            {/* Backdrop */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                />
            )}
        </>
    );
};
