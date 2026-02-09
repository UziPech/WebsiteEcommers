// ============================================================================
// Presentation Layer - Auth Context (using Supabase)
// ============================================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../domain';
import { SupabaseAuthRepository } from '../infrastructure/supabase/AuthRepository';
import { LoginUseCase, LogoutUseCase, GetCurrentUserUseCase } from '../application/auth';
import { supabase } from '../infrastructure/supabase/client';

// ============================================================================
// Types
// ============================================================================

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string, name: string) => Promise<boolean>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<boolean>;
    resendConfirmationEmail: (email: string) => Promise<boolean>;
}

// ============================================================================
// Repository & Use Cases (Singleton instances)
// ============================================================================

const authRepository = new SupabaseAuthRepository();
const loginUseCase = new LoginUseCase(authRepository);
const logoutUseCase = new LogoutUseCase(authRepository);
const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = user !== null;
    const isAdmin = user?.role === 'admin';

    // Check initial auth state and listen for changes
    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            try {
                const currentUser = await getCurrentUserUseCase.execute();
                setUser(currentUser);
            } catch (err) {
                console.error('Error getting current user:', err);
            } finally {
                setLoading(false);
            }
        };

        getInitialSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                // Small delay to allow trigger to create profile
                setTimeout(async () => {
                    const currentUser = await getCurrentUserUseCase.execute();
                    setUser(currentUser);
                }, 500);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const loggedInUser = await loginUseCase.execute(email, password);
            if (loggedInUser) {
                setUser(loggedInUser);
                return true;
            }
            return false;
        } catch (err) {
            console.error('Error logging in:', err);
            return false;
        }
    };

    const register = async (email: string, password: string, name: string): Promise<boolean> => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name, // This will be used by the trigger to create the profile
                    },
                },
            });

            if (error) {
                console.error('Error registering:', error);
                return false;
            }

            return !!data.user;
        } catch (err) {
            console.error('Error registering:', err);
            return false;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await logoutUseCase.execute();
            setUser(null);
        } catch (err) {
            console.error('Error logging out:', err);
        }
    };

    const resetPassword = async (email: string): Promise<boolean> => {
        try {
            return await authRepository.resetPasswordForEmail(email);
        } catch (err) {
            console.error('Error sending password reset:', err);
            return false;
        }
    };

    const resendConfirmationEmail = async (email: string): Promise<boolean> => {
        try {
            return await authRepository.resendConfirmationEmail(email);
        } catch (err) {
            console.error('Error resending confirmation:', err);
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, isAuthenticated, isAdmin, login, register, logout, resetPassword, resendConfirmationEmail }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// ============================================================================
// Hook
// ============================================================================

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Re-export types
export type { User, UserRole };
