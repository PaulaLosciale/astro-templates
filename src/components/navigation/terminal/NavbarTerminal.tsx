import React from 'react';

export const NavbarTerminal: React.FC = () => {
  return (
    <nav className="w-full h-20 bg-black flex items-center justify-between px-6 md:px-12 border-b border-[#1E293B]">
      <div className="flex items-center gap-3">
        <span className="text-[#00D084] font-mono text-xl font-bold tracking-tight">
          &gt;
        </span>
        <span className="text-white font-mono text-base font-medium uppercase tracking-wider">
          acme.ai
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="text-[#666666] font-mono text-xs hover:text-[#00D084] transition-colors uppercase">
          ~/overview
        </a>
        <a href="#" className="text-[#666666] font-mono text-xs hover:text-[#00D084] transition-colors uppercase">
          ~/logs
        </a>
        <a href="#" className="text-[#666666] font-mono text-xs hover:text-[#00D084] transition-colors uppercase">
          ~/docs
        </a>
        <a href="#" className="text-[#666666] font-mono text-xs hover:text-[#00D084] transition-colors uppercase">
          ~/settings
        </a>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-[#666666] font-mono text-[10px] hidden sm:block">
          m.reynolds@admin
        </span>
        <div className="h-2 w-2 rounded-full bg-[#00D084] animate-pulse shadow-[0_0_8px_#00D084]" />
      </div>
    </nav>
  );
};
