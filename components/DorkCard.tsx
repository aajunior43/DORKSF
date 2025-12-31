
import React, { useState } from 'react';
import { DorkResult } from '../types.ts';

interface DorkCardProps {
  dork: DorkResult;
}

const DorkCard: React.FC<DorkCardProps> = ({ dork }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(dork.query);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleOpenInGoogle = () => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(dork.query)}`, '_blank');
  };

  return (
    <div className="brutal-card p-8 h-full flex flex-col relative group">
      {/* Risk Indicator Ribbon */}
      <div className={`absolute top-0 right-10 transform -translate-y-1/2 brutal-tag text-[10px] 
          ${dork.riskLevel === 'High' ? 'bg-red-500 text-white' : dork.riskLevel === 'Medium' ? 'bg-orange-400' : 'bg-green-400'}`}>
        RISK: {dork.riskLevel}
      </div>

      <div className="flex justify-between items-center mb-8">
        <span className="brutal-tag bg-cyan-400">
          TYPE_{dork.category.toUpperCase()}
        </span>
        
        <div className="flex gap-4">
          <button 
            onClick={handleCopy}
            className={`brutal-button w-12 h-12 flex items-center justify-center hover:bg-black hover:text-white ${copied ? 'bg-green-400' : ''}`}
            title="COPIAR"
          >
            {copied ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
            )}
          </button>
          <button 
            onClick={handleOpenInGoogle}
            className="brutal-button w-12 h-12 flex items-center justify-center hover:bg-black hover:text-white"
            title="SEARCH"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </button>
        </div>
      </div>
      
      <div className="bg-black text-[#00FFFF] p-6 border-2 border-black mb-6 font-bold text-sm break-all leading-relaxed shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
        {dork.query}
      </div>
      
      <div className="flex-grow bg-gray-100 p-4 border-2 border-black">
        <p className="text-black text-xs font-bold uppercase leading-5">
          {dork.explanation}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2 opacity-30 text-[10px] font-black italic">
        <span className="w-2 h-2 bg-black"></span> 
        DORK_PROTO_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
      </div>
    </div>
  );
};

export default DorkCard;
