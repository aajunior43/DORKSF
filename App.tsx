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
  const [filterRisk, setFilterRisk] = useState<string>('All');
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
    setFilterRisk('All');
    try {
      const dorks = await generateDorks(prompt);
      setState({ loading: false, results: dorks, error: null });
    } catch (err: any) {
      setState({ loading: false, results: [], error: err.message || "SYSTEM FAILURE." });
    }
  };

  const handleClear = () => {
    setPrompt('');
    setFilterRisk('All');
    setState({ loading: false, results: [], error: null });
  };

  const filteredResults = state.results.filter(dork =>
    filterRisk === 'All' ? true : dork.riskLevel === filterRisk
  );

  const handleCopyAll = () => {
    if (filteredResults.length === 0) return;
    const textToCopy = filteredResults.map(d => `${d.query}\n// ${d.explanation}\n// Risk: ${d.riskLevel} | Category: ${d.category}`).join('\n\n');
    navigator.clipboard.writeText(textToCopy);
  };

  const handleExportTxt = () => {
    if (filteredResults.length === 0) return;
    const textToExport = filteredResults.map(d => `${d.query}\n// ${d.explanation}\n// Risk: ${d.riskLevel} | Category: ${d.category}`).join('\n\n');
    const blob = new Blob([textToExport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jrdorks_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 relative">
      <Header />

      <main className="flex-grow container mx-auto px-6 max-w-7xl relative z-10">
        <div className="max-w-4xl mx-auto mt-20 mb-12">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex flex-col md:flex-row gap-6">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="DIGITE O ALVO (ex: google.com)..."
                className="brutal-input text-xl uppercase placeholder-black/50"
                aria-label="Alvo para buscar dorks"
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleClear}
                  className="brutal-button px-8 py-4 aspect-square flex items-center justify-center hover:bg-red-500 hover:text-white"
                  title="WIPE"
                  aria-label="Limpar campo de busca"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
                <button
                  type="submit"
                  disabled={state.loading}
                  className="brutal-button flex-grow md:flex-none px-12 py-4 text-2xl"
                  aria-label="Executar busca de dorks"
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

        {!state.loading && state.results.length > 0 && (
          <div className="mb-8 flex flex-col md:flex-row justify-between items-center bg-white border-4 border-black p-4 brutal-card">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <label htmlFor="risk-filter" className="font-black uppercase text-sm">Filtrar por Risco:</label>
              <select
                id="risk-filter"
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="border-2 border-black p-2 font-bold bg-gray-100"
                aria-label="Filtrar dorks por nível de risco"
              >
                <option value="All">Todos (ALL)</option>
                <option value="High">Alto (HIGH)</option>
                <option value="Medium">Médio (MEDIUM)</option>
                <option value="Low">Baixo (LOW)</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleCopyAll}
                className="brutal-button px-4 py-2 text-sm flex items-center gap-2 hover:bg-green-400"
                aria-label="Copiar todos os dorks para área de transferência"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                COPIAR TODOS
              </button>
              <button
                onClick={handleExportTxt}
                className="brutal-button px-4 py-2 text-sm flex items-center gap-2 hover:bg-yellow-400"
                aria-label="Exportar dorks para arquivo de texto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                EXPORTAR TXT
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {!state.loading && filteredResults.map((dork, index) => (
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
