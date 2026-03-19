import React, { useState } from 'react';

export const NavbarModern = ({ siteName = "Modern" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-primary-500">◈</span>
            <span className="text-xl font-bold dark:text-white uppercase tracking-tighter">{siteName}</span>
          </div>
          
          <div className="hidden md:flex gap-8">
            {['Inicio', 'Funcionalidades', 'Nosotros', 'Precios'].map(item => (
              <a key={item} href="#" className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="hidden sm:block text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Entrar</a>
            <a href="#" className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-full font-bold text-sm transition-all shadow-lg shadow-primary-500/10 active:scale-95">Empezar</a>
          </div>
      </div>
    </nav>
  );
};
