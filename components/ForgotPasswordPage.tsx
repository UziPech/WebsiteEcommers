// ============================================================================
// Forgot Password Page - Separate page for password recovery
// Similar to GitHub's approach
// ============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../backend/presentation/AuthContext';

const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await resetPassword(email);

            if (result) {
                setSuccess(true);
            } else {
                setError('No pudimos enviar el email. Verifica que el correo esté registrado.');
            }
        } catch (err) {
            setError('Error al enviar email. Por favor intenta de nuevo.');
        }

        setIsLoading(false);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-serif italic text-stone-900 mb-2">
                        Email enviado
                    </h2>
                    <p className="text-stone-600 mb-4">
                        Revisa tu bandeja de entrada para el link de recuperación.
                    </p>
                    <p className="text-sm text-stone-500 mb-6">
                        El link expirará en 60 minutos.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-stone-800 to-stone-900 px-8 py-6">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        <span className="text-sm">Volver</span>
                    </button>
                    <h2 className="text-2xl font-serif italic text-white">
                        Recuperar Contraseña
                    </h2>
                    <p className="text-stone-400 text-sm mt-1">
                        Te enviaremos un código de verificación
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <p className="text-sm text-stone-600">
                        Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña.
                    </p>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Correo electrónico
                        </label>
                        <div className="relative">
                            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none transition-all"
                                placeholder="tu@email.com"
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-stone-50 text-stone-700 px-4 py-3 rounded-lg text-sm border border-stone-300">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        {isLoading ? 'Enviando...' : 'Enviar código de verificación'}
                    </button>

                    <p className="text-xs text-stone-500 text-center">
                        El link expirará en 60 minutos. Si no lo recibes, revisa tu carpeta de spam.
                    </p>
                </form>
            </div>
        </div>
    );
};
