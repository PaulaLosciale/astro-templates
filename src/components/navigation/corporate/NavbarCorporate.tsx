import React, { useState } from 'react';

export const NavbarCorporate = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-sm"></div>
              <span className="text-2xl font-serif font-bold text-gray-900 dark:text-white uppercase tracking-wider">CorpLink</span>
            </div>
            <div className="hidden md:ml-12 md:flex md:space-x-8">
              <a href="#" className="border-primary-500 text-gray-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold uppercase tracking-widest">Soluciones</a>
              <a href="#" className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all">Industrias</a>
              <a href="#" className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all">Empresa</a>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-500 dark:text-gray-400 font-bold hover:text-primary-600 transition-colors">Portal Cliente</button>
            <button className="bg-primary-600 text-white px-8 py-3 rounded-sm font-bold shadow-lg shadow-primary-500/10 hover:bg-primary-700 transition-all uppercase tracking-widest text-xs">Agendar Demo</button>
          </div>
        </div>
      </div>
    </nav>
  );
};
