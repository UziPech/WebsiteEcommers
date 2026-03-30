import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../backend/presentation/AuthContext';
import { useCategories } from '../backend/presentation/CategoryContext';
import { toSlug } from './CategoryView';
import { AuthModal } from './AuthModal';

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

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
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

interface NavbarProps {
    onAdminClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAdminClick }) => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { categories } = useCategories();
    const [showLogin, setShowLogin] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Build dynamic nav links: Catálogo first, then each category from DB
    const navLinks = [
        { label: 'Catálogo', href: '/catalogo' },
        ...categories.map(cat => ({
            label: cat.name,
            href: `/categoria/${toSlug(cat.name)}`,
        })),
    ];

    const handleNavClick = () => {
        setShowMobileMenu(false);
    };

    return (
        <>
            {/* Hide scrollbar utility (injected once) */}
            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* Desktop Navbar */}
            <nav className="
                hidden md:inline-flex items-center justify-center gap-6
                px-6 py-3
                mt-8
                rounded-full
                bg-white/20
                backdrop-blur-xl
                border border-white/30
                shadow-lg shadow-black/5
                transition-all duration-500
                hover:bg-white/30 hover:shadow-xl hover:shadow-black/10
                max-w-[90vw]
            ">
                {/* Navigation Links — scrollable horizontally */}
                <ul className="flex items-center gap-6 overflow-x-auto scrollbar-hide max-w-[60vw]">
                    {navLinks.map((link) => (
                        <li key={link.href} className="flex-shrink-0">
                            <Link
                                to={link.href}
                                className="
                                    relative
                                    pb-1
                                    text-sm font-medium tracking-wide
                                    text-stone-700
                                    transition-all duration-300
                                    hover:text-stone-900
                                    after:absolute after:bottom-0 after:left-0 after:right-0
                                    after:h-[2px] after:bg-stone-900
                                    after:scale-x-0 after:origin-center
                                    after:transition-transform after:duration-300
                                    hover:after:scale-x-100
                                    whitespace-nowrap
                                "
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Divider */}
                <div className="w-px h-5 bg-stone-300 flex-shrink-0" />

                {/* Auth Section */}
                {isAuthenticated ? (
                    <div className="relative flex-shrink-0">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
                        >
                            <span className="w-7 h-7 rounded-full bg-stone-800 text-white flex items-center justify-center text-xs font-bold">
                                {user?.name.charAt(0)}
                            </span>
                            <span>{user?.name}</span>
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

                                <Link
                                    to="/favoritos"
                                    onClick={() => setShowMenu(false)}
                                    className="w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                                >
                                    <HeartIcon className="w-4 h-4" />
                                    Mis Favoritos
                                </Link>

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
                        className="flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors flex-shrink-0"
                    >
                        <UserIcon className="w-5 h-5" />
                        <span>Iniciar Sesión</span>
                    </button>
                )}
            </nav>

            {/* Mobile Navbar */}
            <nav className="
                md:hidden inline-flex items-center justify-center gap-4
                px-4 py-2.5
                mt-4
                rounded-full
                bg-white/20
                backdrop-blur-xl
                border border-white/30
                shadow-lg shadow-black/5
            ">
                {/* Menu Button */}
                <button
                    onClick={() => setShowMobileMenu(true)}
                    className="p-1 text-stone-700"
                >
                    <MenuIcon className="w-6 h-6" />
                </button>

                {/* User Button */}
                {isAuthenticated ? (
                    <button
                        onClick={() => setShowMobileMenu(true)}
                        className="w-7 h-7 rounded-full bg-stone-800 text-white flex items-center justify-center text-xs font-bold"
                    >
                        {user?.name.charAt(0)}
                    </button>
                ) : (
                    <button
                        onClick={() => setShowLogin(true)}
                        className="p-1 text-stone-700"
                    >
                        <UserIcon className="w-6 h-6" />
                    </button>
                )}
            </nav>

            {/* Mobile Full Screen Menu */}
            {showMobileMenu && (
                <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl md:hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-stone-100">
                        <h2 className="text-lg font-serif italic text-stone-900">Menú</h2>
                        <button
                            onClick={() => setShowMobileMenu(false)}
                            className="p-2 hover:bg-stone-100 rounded-full"
                        >
                            <CloseIcon className="w-6 h-6 text-stone-700" />
                        </button>
                    </div>

                    {/* Navigation Links — scrollable vertically */}
                    <div className="p-6 overflow-y-auto max-h-[calc(100vh-80px)]">
                        <ul className="space-y-4">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        to={link.href}
                                        onClick={handleNavClick}
                                        className="block text-2xl font-medium text-stone-900 py-2 hover:text-stone-600 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Divider */}
                        <div className="my-6 border-t border-stone-200" />

                        {/* User Section */}
                        {isAuthenticated ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 py-2">
                                    <span className="w-10 h-10 rounded-full bg-stone-800 text-white flex items-center justify-center text-lg font-bold">
                                        {user?.name.charAt(0)}
                                    </span>
                                    <div>
                                        <p className="font-medium text-stone-900">{user?.name}</p>
                                        <p className="text-sm text-stone-500 capitalize">{user?.role}</p>
                                    </div>
                                </div>

                                {isAdmin && (
                                    <button
                                        onClick={() => {
                                            setShowMobileMenu(false);
                                            onAdminClick?.();
                                        }}
                                        className="flex items-center gap-3 text-lg text-stone-700 py-2"
                                    >
                                        <AdminIcon className="w-5 h-5" />
                                        Panel Admin
                                    </button>
                                )}

                                <Link
                                    to="/favoritos"
                                    onClick={handleNavClick}
                                    className="flex items-center gap-3 text-lg text-stone-700 py-2"
                                >
                                    <HeartIcon className="w-5 h-5" />
                                    Mis Favoritos
                                </Link>

                                <button
                                    onClick={() => {
                                        setShowMobileMenu(false);
                                        logout();
                                    }}
                                    className="flex items-center gap-3 text-lg text-red-600 py-2"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => {
                                    setShowMobileMenu(false);
                                    setShowLogin(true);
                                }}
                                className="flex items-center gap-3 text-lg text-stone-700 py-2"
                            >
                                <UserIcon className="w-5 h-5" />
                                Iniciar Sesión
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Auth Modal */}
            {showLogin && <AuthModal onClose={() => setShowLogin(false)} />}
        </>
    );
};
