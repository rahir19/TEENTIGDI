
import React, { useState, useMemo } from 'react';
import Layout from './components/Layout';
import ToolCard from './components/ToolCard';
import ToolWorkspace from './components/ToolWorkspace';
import { TOOLS } from './constants';
import { ToolID } from './types';

const App: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<ToolID | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState('');

  const activeTool = activeToolId ? TOOLS.find(t => t.id === activeToolId) : null;

  const filteredTools = useMemo(() => {
    if (!categoryFilter) return TOOLS;
    return TOOLS.filter(tool => tool.category === categoryFilter);
  }, [categoryFilter]);

  const handleCategoryClick = (category: string | null) => {
    setCategoryFilter(category);
    setActiveToolId(null);
    const el = document.getElementById('popular-tools');
    if (el) {
      setTimeout(() => {
        const headerOffset = 140;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleHomeClick = () => {
    setActiveToolId(null);
    setCategoryFilter(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendSuggestion = () => {
    if (!suggestion.trim()) return;
    const subject = encodeURIComponent("Suggestion for Teen Tigdi");
    const body = encodeURIComponent(suggestion);
    window.location.href = `mailto:raghavahir371@gmail.com?subject=${subject}&body=${body}`;
    setSuggestion('');
  };

  return (
    <Layout 
      onHomeClick={handleHomeClick} 
      onCategoryClick={handleCategoryClick}
      activeCategory={categoryFilter}
    >
      {!activeToolId ? (
        <div className="transition-colors duration-300">
          {/* Hero Section */}
          <section className="bg-white dark:bg-slate-950 py-16 md:py-24 px-4 overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-10 dark:opacity-20 pointer-events-none">
                <div className="absolute top-10 left-10 w-48 md:w-72 h-48 md:h-72 bg-red-500 rounded-full blur-[80px] md:blur-[120px]" />
                <div className="absolute bottom-10 right-10 w-48 md:w-72 h-48 md:h-72 bg-indigo-600 rounded-full blur-[80px] md:blur-[120px]" />
            </div>
            
            <div className="max-w-7xl mx-auto text-center relative z-10">
              <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] md:text-sm font-bold tracking-widest uppercase">
                New: AI-Powered PDF Suite
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 md:mb-8 tracking-tighter leading-tight">
                Tools to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Conquer PDFs</span>
              </h1>
              <p className="text-base md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto mb-10 md:mb-12 font-medium px-4">
                The most intuitive Trio AI document suite. Simple, reliable, and incredibly fast.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 px-6 sm:px-0">
                <button 
                   onClick={() => handleCategoryClick(null)}
                   className="bg-orange-500 text-white px-10 py-4 rounded-2xl text-base md:text-lg font-black hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/25 active:scale-95 uppercase tracking-widest"
                >
                  Explore Tools
                </button>
                <button 
                  onClick={() => handleCategoryClick('ai')}
                  className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 px-10 py-4 rounded-2xl text-base md:text-lg font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-lg active:scale-95 uppercase tracking-widest"
                >
                  AI Features
                </button>
              </div>
            </div>
          </section>

          {/* Tools Grid */}
          <section id="popular-tools" className="max-w-7xl mx-auto px-4 py-16 md:py-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4 border-b border-slate-100 dark:border-slate-800 pb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                  {categoryFilter ? (
                    <span>
                      <span className="text-orange-500 uppercase">{categoryFilter === 'ai' ? 'AI Suite' : categoryFilter}</span> Tools
                    </span>
                  ) : 'Popular Tools'}
                </h2>
                <div className="h-1.5 w-16 md:w-24 bg-orange-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-4">
                {categoryFilter && (
                  <button 
                    onClick={() => setCategoryFilter(null)}
                    className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 px-4 py-2 rounded-lg transition-colors border border-orange-200 dark:border-orange-900/30"
                  >
                    All Tools
                  </button>
                )}
                <p className="text-xs md:text-sm text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
                  {filteredTools.length} total
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {filteredTools.map((tool) => (
                <ToolCard 
                  key={tool.id} 
                  tool={tool} 
                  onClick={(id) => setActiveToolId(id as ToolID)} 
                />
              ))}
            </div>
          </section>

          {/* Suggestions Section */}
          <section className="bg-slate-100 dark:bg-slate-900/50 py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <div className="inline-block p-4 bg-orange-100 dark:bg-orange-900/20 rounded-2xl mb-6">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Got a suggestion?</h2>
              <p className="text-sm md:text-lg text-slate-500 dark:text-slate-400 mb-8 md:mb-10 font-bold px-4">Help us improve the Trio Suite. Your feedback goes directly to our lead developer.</p>
              
              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800">
                <textarea 
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Share your ideas with the Trio team..."
                  className="w-full h-32 md:h-40 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-orange-500 outline-none text-slate-800 dark:text-white font-medium transition-all mb-6 resize-none"
                />
                <button 
                  onClick={handleSendSuggestion}
                  disabled={!suggestion.trim()}
                  className="w-full py-4 md:py-5 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-2xl font-black text-sm md:text-lg shadow-xl shadow-orange-500/20 transition-all active:scale-[0.98] uppercase tracking-widest flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send to Developer
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
          {activeTool && <ToolWorkspace tool={activeTool} />}
        </div>
      )}
    </Layout>
  );
};

export default App;
