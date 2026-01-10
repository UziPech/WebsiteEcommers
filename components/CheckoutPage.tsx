import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../backend/CartContext';

// ============================================================================
// Constants
// ============================================================================

const WHATSAPP_NUMBER = '529997827484';

// ============================================================================
// Icons
// ============================================================================

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// ============================================================================
// Success View
// ============================================================================

const SuccessView = () => (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-serif italic text-stone-900 mb-2">¡Pedido Enviado!</h1>
            <p className="text-stone-600 mb-8">
                Tu pedido ha sido enviado por WhatsApp. Nos pondremos en contacto contigo pronto para coordinar el pago y la entrega.
            </p>
            <Link
                to="/"
                className="block w-full py-3 px-6 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
            >
                Volver a la Tienda
            </Link>
        </div>
    </div>
);

// ============================================================================
// Checkout Form
// ============================================================================

export const CheckoutPage: React.FC = () => {
    const { cart, cartTotal, clearCart } = useCart();

    const [formData, setFormData] = useState({
        name: '',
    });

    const [isSuccess, setIsSuccess] = useState(false);

    // Generate WhatsApp message with cart items
    const generateWhatsAppMessage = () => {
        let message = `🌿 *Nuevo Pedido - Vivero Balam*\n\n`;
        message += `👤 *Cliente:* ${formData.name}\n\n`;
        message += `📦 *Productos:*\n`;

        cart.forEach(item => {
            message += `• ${item.name} x${item.quantity} - ${item.price}\n`;
        });

        message += `\n💰 *Total:* $${cartTotal.toFixed(2)} MXN`;

        return encodeURIComponent(message);
    };

    // Handle WhatsApp redirect
    const handleWhatsAppClick = () => {
        if (!formData.name.trim()) {
            alert('Por favor ingresa tu nombre');
            return;
        }

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${generateWhatsAppMessage()}`;
        window.open(whatsappUrl, '_blank');

        // Show success and clear cart after redirect
        setTimeout(() => {
            setIsSuccess(true);
            clearCart();
        }, 1000);
    };

    if (isSuccess) {
        return <SuccessView />;
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-stone-500 mb-4">Tu carrito está vacío</p>
                    <Link to="/" className="text-stone-900 underline">
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 py-8 px-4 md:py-12 md:px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                {/* Left Column: Form */}
                <div>
                    <header className="mb-6 md:mb-8">
                        <Link to="/" className="text-sm text-stone-500 hover:text-stone-900 mb-4 block">
                            ← Volver
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-serif italic text-stone-900 mb-2">Finalizar Pedido</h1>
                        <p className="text-stone-600 text-sm md:text-base">Ingresa tu nombre y envía el pedido por WhatsApp</p>
                    </header>

                    <div className="space-y-6">
                        {/* Customer Info */}
                        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-stone-200">
                            <h2 className="text-lg font-semibold text-stone-900 mb-4">Tu Información</h2>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="¿Cómo te llamas?"
                                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-base"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* WhatsApp Info */}
                        <div className="bg-emerald-50 rounded-2xl p-5 md:p-6 border border-emerald-200">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
                                    <WhatsAppIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-stone-900 mb-1">¿Cómo funciona?</h3>
                                    <p className="text-sm text-stone-600">
                                        Al hacer clic en el botón, se abrirá WhatsApp con tu pedido listo para enviar.
                                        Ahí coordinamos el pago y la entrega. ¡Así de fácil!
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp Button */}
                        <button
                            onClick={handleWhatsAppClick}
                            disabled={!formData.name.trim()}
                            className={`
                                w-full py-4 rounded-full font-medium text-white transition-all
                                flex items-center justify-center gap-3
                                ${!formData.name.trim()
                                    ? 'bg-stone-300 cursor-not-allowed'
                                    : 'bg-[#25D366] hover:bg-[#128C7E] shadow-lg hover:shadow-xl active:scale-[0.98]'
                                }
                            `}
                        >
                            <WhatsAppIcon className="w-6 h-6" />
                            <span>Enviar Pedido por WhatsApp</span>
                        </button>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:sticky lg:top-12 h-fit">
                    <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6 border border-stone-100">
                        <h2 className="text-lg font-semibold text-stone-900 mb-6">Resumen del Pedido</h2>

                        <ul className="space-y-4 mb-6 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2">
                            {cart.map((item) => (
                                <li key={item.id} className="flex gap-3 md:gap-4">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-medium text-stone-900 truncate">{item.name}</h3>
                                        <p className="text-xs text-stone-500">Cantidad: {item.quantity}</p>
                                    </div>
                                    <div className="text-sm font-medium text-stone-900 flex-shrink-0">
                                        {item.price}
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="border-t border-stone-100 pt-4 space-y-2">
                            <div className="flex justify-between text-sm text-stone-600">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)} MXN</span>
                            </div>
                            <div className="flex justify-between text-sm text-stone-600">
                                <span>Envío</span>
                                <span className="text-emerald-600">A coordinar</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-stone-900 pt-2 border-t border-stone-100 mt-2">
                                <span>Total</span>
                                <span>${cartTotal.toFixed(2)} MXN</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
