import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../backend/AuthContext';
import { LoginPage } from './LoginPage';

// ============================================================================
// Types
// ============================================================================

interface NavLink {
    label: string;
    href: string;
}

// ============================================================================
// Constants
// ============================================================================

const NAV_LINKS: NavLink[] = [
    { label: 'Catálogo', href: '/catalogo' },
    { label: 'Plantas', href: '/plantas' },
    { label: 'Macetas', href: '/macetas' },
    { label: 'Suplementos', href: '/suplementos' },
];

// ============================================================================
// Icons
// ============================================================================

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const AdminIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

// ============================================================================
// Component
// ============================================================================

interface NavbarProps {
    onAdminClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAdminClick }) => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    return (
        <>
            <nav
                className="
          inline-flex items-center justify-center gap-6
          px-6 py-3
          mt-8
          rounded-full
          bg-white/20
          backdrop-blur-xl
          border border-white/30
          shadow-lg shadow-black/5
          transition-all duration-500
          hover:bg-white/30 hover:shadow-xl hover:shadow-black/10
        "
            >
                {/* Navigation Links */}
                <ul className="flex items-center gap-6">
                    {NAV_LINKS.map((link) => (
                        <li key={link.href}>
                            <Link
                                to={link.href}
                                className="
                  relative
                  text-sm font-medium tracking-wide
                  text-stone-700
                  transition-all duration-300
                  hover:text-stone-900
                  after:absolute after:bottom-[-4px] after:left-0 after:right-0
                  after:h-[1px] after:bg-stone-900
                  after:scale-x-0 after:origin-center
                  after:transition-transform after:duration-300
                  hover:after:scale-x-100
                "
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Divider */}
                <div className="w-px h-5 bg-stone-300" />

                {/* Auth Section */}
                {isAuthenticated ? (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
                        >
                            <span className="w-7 h-7 rounded-full bg-stone-800 text-white flex items-center justify-center text-xs font-bold">
                                {user?.name.charAt(0)}
                            </span>
                            <span className="hidden md:block">{user?.name}</span>
                        </button>

                        {/* Dropdown Menu */}
                        {showMenu && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-stone-100 py-2 z-50">
                                <div className="px-4 py-2 border-b border-stone-100">
                                    <p className="text-sm font-medium text-stone-900">{user?.name}</p>
                                    <p className="text-xs text-stone-500 capitalize">{user?.role}</p>
                                </div>

                                {isAdmin && (
                                    <button
                                        onClick={() => {
                                            setShowMenu(false);
                                            onAdminClick?.();
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                                    >
                                        <AdminIcon className="w-4 h-4" />
                                        Panel Admin
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        logout();
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => setShowLogin(true)}
                        className="flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
                    >
                        <UserIcon className="w-5 h-5" />
                        <span className="hidden md:block">Iniciar Sesión</span>
                    </button>
                )}
            </nav>

            {/* Login Modal */}
            {showLogin && <LoginPage onClose={() => setShowLogin(false)} />}
        </>
    );
};
