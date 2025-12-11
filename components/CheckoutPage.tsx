import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../backend/CartContext';

// ============================================================================
// Icons
// ============================================================================

const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const MercadoPagoLogo = () => (
    <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#009EE3] rounded-full flex items-center justify-center text-white font-bold text-xs">
            MP
        </div>
        <span className="font-bold text-stone-700">Mercado Pago</span>
    </div>
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
            <h1 className="text-2xl font-serif italic text-stone-900 mb-2">¡Pago Exitoso!</h1>
            <p className="text-stone-600 mb-8">
                Tu pedido ha sido procesado correctamente. Recibirás un correo con los detalles de envío.
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
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zip: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        zip: '',
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validateForm = () => {
        let isValid = true;
        const newErrors = { email: '', zip: '' };

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Por favor ingresa un email válido';
            isValid = false;
        }

        // Zip validation (must be 5 digits)
        const zipRegex = /^\d{5}$/;
        if (!zipRegex.test(formData.zip)) {
            newErrors.zip = 'El código postal debe tener 5 dígitos';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Simulation of payment
    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsProcessing(true);

        // Simulate API delay
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            clearCart();
        }, 2000);
    };

    if (isSuccess) {
        return <SuccessView />;
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
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
        <div className="min-h-screen bg-stone-50 py-12 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Left Column: Form */}
                <div>
                    <header className="mb-8">
                        <Link to="/" className="text-sm text-stone-500 hover:text-stone-900 mb-4 block">
                            ← Volver
                        </Link>
                        <h1 className="text-3xl font-serif italic text-stone-900 mb-2">Checkout</h1>
                        <p className="text-stone-600">Completa tus datos para el envío</p>
                    </header>

                    <form onSubmit={handlePayment} className="space-y-6">
                        {/* Contact Info */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
                            <h2 className="text-lg font-semibold text-stone-900 mb-4">Información de Contacto</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Nombre Completo</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 outline-none"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-stone-500 outline-none ${errors.email ? 'border-red-500' : 'border-stone-200'}`}
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        onBlur={() => validateForm()}
                                    />
                                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
                            <h2 className="text-lg font-semibold text-stone-900 mb-4">Dirección de Envío</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Dirección</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 outline-none"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Ciudad</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 outline-none"
                                            value={formData.city}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Código Postal</label>
                                        <input
                                            type="text"
                                            required
                                            maxLength={5}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-stone-500 outline-none ${errors.zip ? 'border-red-500' : 'border-stone-200'}`}
                                            value={formData.zip}
                                            onChange={e => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                setFormData({ ...formData, zip: val });
                                            }}
                                            onBlur={() => validateForm()}
                                        />
                                        {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
                            <h2 className="text-lg font-semibold text-stone-900 mb-4">Método de Pago</h2>

                            <div className="border border-[#009EE3] bg-blue-50/50 rounded-xl p-4 flex items-center justify-between cursor-pointer">
                                <MercadoPagoLogo />
                                <div className="w-5 h-5 rounded-full border-2 border-[#009EE3] flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 bg-[#009EE3] rounded-full" />
                                </div>
                            </div>

                            <p className="text-xs text-stone-500 mt-3 flex items-center gap-1">
                                <LockIcon className="w-3 h-3" />
                                Pagos procesados de forma segura por Mercado Pago
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className={`
                w-full py-4 rounded-full font-medium text-white transition-all
                ${isProcessing ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-900 hover:bg-stone-800 shadow-lg hover:shadow-xl'}
              `}
                        >
                            {isProcessing ? 'Procesando...' : `Pagar $${cartTotal.toFixed(2)} MXN`}
                        </button>
                    </form>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:sticky lg:top-12 h-fit">
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-stone-100">
                        <h2 className="text-lg font-semibold text-stone-900 mb-6">Resumen del Pedido</h2>

                        <ul className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                            {cart.map((item) => (
                                <li key={item.id} className="flex gap-4">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium text-stone-900">{item.name}</h3>
                                        <p className="text-xs text-stone-500 text-stone-500">Cantidad: {item.quantity}</p>
                                    </div>
                                    <div className="text-sm font-medium text-stone-900">
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
                                <span>Gratis</span>
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
