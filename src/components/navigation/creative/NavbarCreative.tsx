import React from 'react';

export const NavbarCreative = () => {
  return (
    <nav className="p-6 fixed top-0 w-full z-50 pointer-events-none">
      <div className="max-w-7xl mx-auto bg-gray-900 dark:bg-black rounded-3xl p-4 flex items-center justify-between shadow-2xl pointer-events-auto border-t border-white/10">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary-500 to-indigo-600 rounded-full group-hover:rotate-180 transition-transform duration-700"></div>
            <span className="text-white font-black italic text-2xl tracking-tighter">CREATIVE</span>
          </div>

          <div className="hidden lg:flex gap-12 text-white/50 font-black text-xs uppercase tracking-widest">
            {['Work', 'About', 'Contact', 'Journal'].map(item => (
              <a key={item} href="#" className="hover:text-primary-500 transition-colors">{item}</a>
            ))}
          </div>

          <button className="bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all shadow-xl shadow-white/5">
             Say Hello
          </button>
      </div>
    </nav>
  );
};
