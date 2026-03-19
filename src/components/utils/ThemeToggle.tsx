import React, { useState, useEffect } from 'react';

export const ThemeToggle = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <button 
            onClick={toggleTheme}
            className="fixed bottom-8 right-8 w-14 h-14 bg-white dark:bg-gray-800 rounded-full shadow-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-90 z-50"
        >
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
};
