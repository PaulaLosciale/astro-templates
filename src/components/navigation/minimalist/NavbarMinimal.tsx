import React from 'react';

export const NavbarMinimal = () => {
  return (
    <nav className="py-12 bg-white dark:bg-gray-950 transition-colors">
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center gap-8">
          <div className="w-12 h-1 bg-gray-900 dark:bg-white"></div>
          <div className="flex gap-12">
            {['About', 'Projects', 'Writings', 'Contact'].map(i => (
              <a key={i} href="#" className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium transition-colors text-sm underline underline-offset-8 decoration-transparent hover:decoration-primary-500">{i}</a>
            ))}
          </div>
      </div>
    </nav>
  );
};
