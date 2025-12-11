import React from 'react';

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
    { label: 'Catálogo', href: '#catalogo' },
    { label: 'Plantas', href: '#plantas' },
    { label: 'Macetas', href: '#macetas' },
    { label: 'Suplementos', href: '#suplementos' },
];

// ============================================================================
// Component
// ============================================================================

export const Navbar: React.FC = () => {
    return (
        <nav
            className="
        inline-flex items-center justify-center
        px-8 py-3
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
            <ul className="flex items-center gap-8">
                {NAV_LINKS.map((link, index) => (
                    <li key={link.href}>
                        <a
                            href={link.href}
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
                        </a>
                        {/* Separator dot (except last item) */}
                        {index < NAV_LINKS.length - 1 && (
                            <span className="sr-only">·</span>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};
