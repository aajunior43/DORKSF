
import React from 'react';

export default function Header() {
  return (
    <header className="w-full pt-16 pb-8 relative z-10">
      <div className="container mx-auto px-6 flex justify-center items-center max-w-7xl">
        <div className="brutal-card px-10 py-6 bg-white flex flex-col items-center gap-2 transform -rotate-1 hover:rotate-0 transition-transform">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-black flex items-center justify-center border-2 border-white">
                <span className="text-white font-black text-2xl">JR</span>
             </div>
             <h1 className="font-black text-5xl tracking-tighter">DORKS.AI</h1>
          </div>
          <div className="bg-black text-[#FFDE59] px-4 py-1 font-bold text-xs tracking-widest uppercase">
            Advanced Reconnaissance Protocol
          </div>
        </div>
      </div>
    </header>
  );
}
