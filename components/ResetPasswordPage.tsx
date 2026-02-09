// ============================================================================
// Reset Password Page - Handles password reset from email link
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useAuth } from '../backend/presentation/AuthContext';
import { SupabaseAuthRepository } from '../backend/infrastructure/supabase/AuthRepository';

const authRepo = new SupabaseAuthRepository();

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

export const ResetPasswordPage: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (newPassword.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        setIsLoading(true);

        const result = await authRepo.updatePassword(newPassword);

        if (result) {
            setSuccess(true);
            setTimeout(() => {
                window.location.href = '/';
            }, 3000);
        } else {
            setError('Error al actualizar la contraseña. El enlace podría haber expirado.');
        }

        setIsLoading(false);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-serif italic text-stone-900 mb-2">
                        Contraseña actualizada
                    </h2>
                    <p className="text-stone-600 mb-4">
                        Tu contraseña ha sido restablecida exitosamente.
                    </p>
                    <p className="text-sm text-stone-500">
                        Redirigiendo a la página principal...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-stone-800 to-stone-900 px-8 py-6 text-center">
                    <h2 className="text-2xl font-serif italic text-white">
                        Vivero Balam
                    </h2>
                    <p className="text-stone-400 text-sm mt-1">
                        Restablecer contraseña
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <p className="text-sm text-stone-600 text-center">
                        Ingresa tu nueva contraseña
                    </p>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Nueva contraseña
                        </label>
                        <div className="relative">
                            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                required
                                minLength={8}
                            />
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                            Mínimo 8 caracteres
                        </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Confirmar contraseña
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
                        className="w-full py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Actualizando...' : 'Restablecer contraseña'}
                    </button>
                </form>
            </div>
        </div>
    );
};
