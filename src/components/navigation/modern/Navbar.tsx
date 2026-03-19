import React, { useState, useEffect } from 'react';

export const Navbar = ({ siteName = "ModernApp" }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Inicio', href: '#' },
        { name: 'Servicios', href: '#features' },
        { name: 'Proyectos', href: '#projects' },
        { name: 'Contacto', href: '#contact' },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'
        }`}>
            <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <a href="/" className="flex items-center space-x-2 group">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black group-hover:rotate-12 transition-transform shadow-lg shadow-blue-200">
                        L
                    </div>
                    <span className={`text-xl font-black tracking-tight ${scrolled ? 'text-gray-900' : 'text-gray-800'}`}>
                        {siteName}
                    </span>
                </a>

                {/* Desktop Nav */}
                <ul className="hidden md:flex items-center space-x-10">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <a 
                                href={item.href} 
                                className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors uppercase tracking-wider"
                            >
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                        aria-label="Search"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                    
                    <a 
                        href="#contact" 
                        className="hidden md:block px-6 py-2.5 bg-gray-900 text-white rounded-full font-bold text-sm hover:bg-blue-600 transition-all hover:scale-105"
                    >
                        Comenzar
                    </a>

                    {/* Mobile Toggle */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-gray-900"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-2xl animate-fade-in">
                    <div className="px-6 py-8 space-y-4">
                        {navItems.map((item) => (
                            <a 
                                key={item.name} 
                                href={item.href} 
                                onClick={() => setIsMenuOpen(false)}
                                className="block text-2xl font-black text-gray-900 hover:text-blue-600 transition-colors"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};
