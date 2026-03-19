import React, { useState } from 'react';

export const NavbarSaaS = () => {
  return (
    <nav className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl"></div>
              <span className="text-lg font-black text-gray-900 dark:text-white">SaaSFlow</span>
            </div>
            
            <div className="hidden lg:flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
                <a href="#" className="px-4 py-1.5 text-sm font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-full shadow-sm">Producto</a>
                <a href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Precios</a>
                <a href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Clientes</a>
            </div>

            <div className="flex items-center gap-4">
                <a href="#" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">Log In</a>
                <a href="#" className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-md shadow-primary-500/20">Try Free</a>
            </div>
        </div>
      </div>
    </nav>
  );
};
