import React from 'react';

// ============================================================================
// Footer — Vivero Balam® Brand & Contact Info
// ============================================================================

const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);

export const Footer: React.FC = () => {
    return (
        <footer className="bg-stone-900 text-stone-300 mt-auto">
            {/* Decorative top border */}
            <div className="h-px bg-gradient-to-r from-transparent via-stone-600 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Brand */}
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-serif italic text-white mb-2 tracking-wide">
                        Vivero Balam<span className="text-xs align-super font-sans not-italic">®</span>
                    </h2>
                    <p className="text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
                        Donde la naturaleza se convierte en arte — plantas, macetas artesanales y vida para tu hogar.
                    </p>
                </div>

                {/* Contact Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm max-w-3xl mx-auto">
                    {/* Address */}
                    <div className="flex flex-col items-center text-center gap-2">
                        <LocationIcon className="w-5 h-5 text-stone-500" />
                        <a
                            href="https://www.google.com/maps/search/Calle+61+%23809+entre+128+y+130+Xocl%C3%A1n+Canto+M%C3%A9rida+Yucat%C3%A1n"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-400 hover:text-white transition-colors leading-snug"
                        >
                            Calle 61 #809 entre 128 y 130,<br />
                            Xoclán Canto, Mérida
                        </a>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col items-center text-center gap-2">
                        <MailIcon className="w-5 h-5 text-stone-500" />
                        <a
                            href="mailto:viveroyartesanias01@gmail.com"
                            className="text-stone-400 hover:text-white transition-colors break-all"
                        >
                            viveroyartesanias01@gmail.com
                        </a>
                    </div>

                    {/* Facebook */}
                    <div className="flex flex-col items-center text-center gap-2">
                        <FacebookIcon className="w-5 h-5 text-stone-500" />
                        <a
                            href="https://www.facebook.com/share/1KXGkfcPhK/?mibextid=wwXIfr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-400 hover:text-white transition-colors"
                        >
                            Vivero Balam en Facebook
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-stone-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
                    <span>© {new Date().getFullYear()} Vivero Balam®. Todos los derechos reservados.</span>
                    <span className="hidden sm:inline">Hecho con 🌱 en Mérida, Yucatán</span>
                </div>
            </div>
        </footer>
    );
};
