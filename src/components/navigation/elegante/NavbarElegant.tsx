import React from 'react';

export const NavbarElegant = () => {
    return (
        <nav className="fixed top-0 w-full z-50 bg-white/60 dark:bg-black/60 backdrop-blur-3xl transition-all duration-700">
            <div className="max-w-[1440px] mx-auto px-[60px] h-[100px] flex items-center justify-between">
                <a href="/" className="text-[60px] font-bold tracking-tighter text-black dark:text-white uppercase leading-none">Zara</a>
                <div className="flex gap-12 font-bold tracking-widest text-[10px] uppercase text-black dark:text-white">
                    <span className="cursor-pointer hover:underline underline-offset-8">Colección</span>
                    <span className="cursor-pointer hover:underline underline-offset-8">Info</span>
                    <span className="cursor-pointer hover:underline underline-offset-8">Cesta (0)</span>
                </div>
            </div>
        </nav>
    );
};
