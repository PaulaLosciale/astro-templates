import React from 'react';

export const NavbarClean = () => {
    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-900 transition-colors duration-500">
            <div className="max-w-[1200px] mx-auto px-6 h-12 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <a href="/" className="font-bold text-lg dark:text-white"></a>
                    <div className="hidden md:flex gap-8">
                        {['Tienda', 'Mac', 'iPad', 'iPhone'].map(item => (
                            <a key={item} href="#" className="text-xs font-light text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">{item}</a>
                        ))}
                    </div>
                </div>
                <div className="flex gap-6">
                    <span className="text-xs font-light text-gray-400 cursor-pointer">🔍</span>
                    <span className="text-xs font-light text-gray-400 cursor-pointer">👜</span>
                </div>
            </div>
        </nav>
    );
};
