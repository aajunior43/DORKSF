
import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import DorkCard from './components/DorkCard.tsx';
import { generateDorks } from './geminiService.ts';
import { GenerationState } from './types.ts';

const LOADING_STEPS = [
  "OVERRIDING FILTERS...",
  "DORKING TARGET...",
  "BYPASSING INDEX...",
  "SENSITIVE DATA FOUND...",
  "FINALIZING REPORT..."
];

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);
  const [state, setState] = useState<GenerationState>({
    loading: false,
    results: [],
    error: null
  });

  useEffect(() => {
    let interval: number;
    if (state.loading) {
      interval = window.setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 800);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [state.loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setState(prev => ({ ...prev, loading: true, error: null, results: [] }));
    try {
      const dorks = await generateDorks(prompt);
      setState({ loading: false, results: dorks, error: null });
    } catch (err: any) {
      setState({ loading: false, results: [], error: err.message || "SYSTEM FAILURE." });
    }
  };

  const handleClear = () => {
    setPrompt('');
    setState({ loading: false, results: [], error: null });
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 relative">
      <Header />

      <main className="flex-grow container mx-auto px-6 max-w-7xl relative z-10">
        <div className="max-w-4xl mx-auto mt-20 mb-24">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex flex-col md:flex-row gap-6">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="DIGITE O ALVO (ex: google.com)..."
                aria-label="Digite o alvo"
                className="brutal-input text-xl uppercase placeholder-black/50 focus-visible:ring-4 focus-visible:ring-black focus-visible:outline-none"
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Limpar"
                  className="brutal-button px-8 py-4 aspect-square flex items-center justify-center hover:bg-red-500 hover:text-white focus-visible:ring-4 focus-visible:ring-black focus-visible:outline-none"
                  title="WIPE"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
                <button
                  type="submit"
                  disabled={state.loading}
                  className="brutal-button flex-grow md:flex-none px-12 py-4 text-2xl focus-visible:ring-4 focus-visible:ring-black focus-visible:outline-none"
                >
                  {state.loading ? '...' : 'EXECUTAR'}
                </button>
              </div>
            </div>
          </form>
          
          {state.loading && (
            <div className="mt-20 flex flex-col items-center">
              <div className="loading-glitch mb-10 flex items-center justify-center">
                 <span className="font-black text-2xl">?</span>
              </div>
              <div className="bg-black text-white px-6 py-2 font-bold tracking-[0.2em]">
                {LOADING_STEPS[loadingStep]}
              </div>
            </div>
          )}
        </div>

        {state.error && (
          <div className="max-w-lg mx-auto mb-16 p-8 brutal-card bg-red-500 text-white font-black text-center animate-fade-in">
            [ERROR_LOG]: {state.error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {!state.loading && state.results.map((dork, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
              <DorkCard dork={dork} />
            </div>
          ))}
        </div>

        {!state.loading && state.results.length === 0 && !state.error && (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <div className="brutal-card p-12 mb-8 bg-transparent">
               <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <p className="font-black text-xl tracking-[0.5em] uppercase">SYSTEM IDLE</p>
          </div>
        )}
      </main>
      
      {/* Footer Info Strip */}
      <footer className="fixed bottom-0 w-full bg-black text-[#FFDE59] py-2 px-6 overflow-hidden whitespace-nowrap z-50">
        <div className="animate-[marquee_20s_linear_infinite] inline-block font-black text-xs">
          JR.DORKS AI OSINT TERMINAL v3.0 // HIGH RISK SEARCH OPERATORS ENABLED // DATA BREACH ANALYSIS // SYSTEM READY // TARGET ACQUIRED // 
          JR.DORKS AI OSINT TERMINAL v3.0 // HIGH RISK SEARCH OPERATORS ENABLED // DATA BREACH ANALYSIS // SYSTEM READY // TARGET ACQUIRED // 
        </div>
      </footer>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
