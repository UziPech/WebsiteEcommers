import React, { createContext, useContext, useState, ReactNode } from 'react';

// ============================================================================
// Types
// ============================================================================

export type UserRole = 'admin' | 'user' | null;

export interface User {
    id: string;
    username: string;
    role: UserRole;
    name: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

// ============================================================================
// Mock Users Database
// ============================================================================

const MOCK_USERS: { username: string; password: string; user: User }[] = [
    {
        username: 'admin',
        password: 'admin123',
        user: {
            id: '1',
            username: 'admin',
            role: 'admin',
            name: 'Administrador',
        },
    },
    {
        username: 'user',
        password: 'user123',
        user: {
            id: '2',
            username: 'user',
            role: 'user',
            name: 'Usuario',
        },
    },
];

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
    const [user, setUser] = useState<User | null>(() => {
        // Check localStorage for persisted session
        const saved = localStorage.getItem('vivero_user');
        return saved ? JSON.parse(saved) : null;
    });

    const isAuthenticated = user !== null;
    const isAdmin = user?.role === 'admin';

    const login = async (username: string, password: string): Promise<boolean> => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const found = MOCK_USERS.find(
            (u) => u.username === username && u.password === password
        );

        if (found) {
            setUser(found.user);
            localStorage.setItem('vivero_user', JSON.stringify(found.user));
            return true;
        }

        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('vivero_user');
    };

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated, isAdmin, login, logout }}
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
