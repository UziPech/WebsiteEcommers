// ============================================================================
// AuthModal Component - Login + Registro SOLAMENTE
// El "olvidé contraseña" redirige a otra página (como GitHub)
// ============================================================================

import React, { useState } from 'react';
import { useAuth } from '../backend/presentation/AuthContext';
import { useNavigate } from 'react-router-dom';

// ============================================================================
// Icons
// ============================================================================

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// ============================================================================
// Component
// ============================================================================

interface AuthModalProps {
    onClose: () => void;
}

type AuthMode = 'login' | 'register';

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState<AuthMode>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess('');
    };

    const handleModeSwitch = (newMode: AuthMode) => {
        setMode(newMode);
        resetForm();
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const success = await login(email, password);

            if (success) {
                setSuccess('Inicio de sesión exitoso');
                setTimeout(() => {
                    onClose();
                }, 500);
            } else {
                setError('Email o contraseña incorrectos. Si registraste una cuenta, verifica tu email de confirmación.');
            }
        } catch (err) {
            setError('Error al iniciar sesión. Por favor intenta de nuevo.');
        }

        setIsLoading(false);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validations
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            return;
        }
        if (!name.trim()) {
            setError('El nombre es requerido');
            return;
        }

        setIsLoading(true);

        try {
            const result = await register(email, password, name);

            if (result) {
                setSuccess('Cuenta creada exitosamente. Revisa tu email para confirmar tu cuenta.');
                setTimeout(() => {
                    handleModeSwitch('login');
                }, 4000);
            } else {
                setError('No se pudo crear la cuenta. El email podría ya estar registrado.');
            }
        } catch (err) {
            setError('Error al registrar. Por favor intenta de nuevo.');
        }

        setIsLoading(false);
    };

    const handleForgotPassword = () => {
        onClose();
        navigate('/forgot-password');
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 transition-colors z-10"
                >
                    <CloseIcon className="w-5 h-5 text-stone-400" />
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-stone-800 to-stone-900 px-8 py-6 text-center">
                    <h2 className="text-2xl font-serif italic text-white">
                        Vivero Balam
                    </h2>
                    <p className="text-stone-400 text-sm mt-1">
                        {mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-stone-200">
                    <button
                        type="button"
                        onClick={() => handleModeSwitch('login')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'login'
                            ? 'text-stone-900 border-b-2 border-stone-900'
                            : 'text-stone-500 hover:text-stone-700'
                            }`}
                    >
                        Iniciar sesión
                    </button>
                    <button
                        type="button"
                        onClick={() => handleModeSwitch('register')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'register'
                            ? 'text-stone-900 border-b-2 border-stone-900'
                            : 'text-stone-500 hover:text-stone-700'
                            }`}
                    >
                        Registrarse
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={mode === 'login' ? handleLogin : handleRegister}
                    className="p-8 space-y-5"
                >
                    {/* Name (only for register) */}
                    {mode === 'register' && (
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                Nombre
                            </label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Tu nombre"
                                    required
                                    autoComplete="name"
                                />
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Email
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

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Contraseña
                        </label>
                        <div className="relative">
                            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                required
                                minLength={mode === 'register' ? 8 : 6}
                                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                            />
                        </div>
                    </div>

                    {/* Confirm Password (only for register) */}
                    {mode === 'register' && (
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                Confirmar Contraseña
                            </label>
                            <div className="relative">
                                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>
                    )}

                    {/* Forgot password link (only for login) */}
                    {mode === 'login' && (
                        <div className="text-right">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-sm text-stone-600 hover:text-stone-900 transition-colors underline underline-offset-2"
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-stone-50 text-stone-700 px-4 py-3 rounded-lg text-sm border border-stone-300">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="bg-stone-50 text-stone-700 px-4 py-3 rounded-lg text-sm border border-stone-300">
                            {success}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        {isLoading
                            ? 'Cargando...'
                            : mode === 'login'
                                ? 'Iniciar sesión'
                                : 'Crear cuenta'}
                    </button>

                    {/* Helper text for register */}
                    {mode === 'register' && !success && (
                        <p className="text-xs text-stone-500 text-center">
                            Recibirás un email de confirmación después del registro
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};
