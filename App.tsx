
import React, { useState, useMemo } from 'react';
import Layout from './components/Layout';
import ToolCard from './components/ToolCard';
import ToolWorkspace from './components/ToolWorkspace';
import { TOOLS } from './constants';
import { ToolID } from './types';

const App: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<ToolID | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const activeTool = activeToolId ? TOOLS.find(t => t.id === activeToolId) : null;

  const filteredTools = useMemo(() => {
    if (!categoryFilter) return TOOLS;
    return TOOLS.filter(tool => tool.category === categoryFilter);
  }, [categoryFilter]);

  const handleCategoryClick = (category: string | null) => {
    setCategoryFilter(category);
    setActiveToolId(null);
    // Scroll to tools if not already there
    const el = document.getElementById('popular-tools');
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleHomeClick = () => {
    setActiveToolId(null);
    setCategoryFilter(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <section className="bg-white dark:bg-slate-950 py-24 px-4 overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-10 dark:opacity-20 pointer-events-none">
                <div className="absolute top-10 left-10 w-72 h-72 bg-red-500 rounded-full blur-[120px]" />
                <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-600 rounded-full blur-[120px]" />
            </div>
            
            <div className="max-w-7xl mx-auto text-center relative z-10">
              <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold tracking-wide uppercase">
                New: AI-Powered PDF Suite
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[1.1]">
                Every tool you need to <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-indigo-500">conquer PDFs</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto mb-12 font-medium">
                Simple, reliable, and powerful document management tools for the modern creator. No installation required.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <button 
                   onClick={() => handleCategoryClick(null)}
                   className="bg-red-500 text-white px-10 py-4 rounded-2xl text-lg font-black hover:bg-red-600 transition-all shadow-xl shadow-red-500/25 active:scale-95"
                >
                  Explore Tools
                </button>
                <button className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 px-10 py-4 rounded-2xl text-lg font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                  Teen Tigdi Pro
                </button>
              </div>
            </div>
          </section>

          {/* Tools Grid */}
          <section id="popular-tools" className="max-w-7xl mx-auto px-4 py-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4 border-b border-slate-100 dark:border-slate-800 pb-8">
              <div>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
                  {categoryFilter ? (
                    <span>
                      Showing <span className="text-red-500 uppercase">{categoryFilter === 'ai' ? 'AI Suite' : categoryFilter}</span> Tools
                    </span>
                  ) : 'Most Popular Tools'}
                </h2>
                <div className="h-1.5 w-24 bg-red-500 rounded-full"></div>
              </div>
              <div className="flex gap-2">
                {categoryFilter && (
                  <button 
                    onClick={() => setCategoryFilter(null)}
                    className="text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 px-4 py-2 rounded-lg transition-colors border border-red-200 dark:border-red-900/30"
                  >
                    Clear Filter
                  </button>
                )}
                <p className="text-slate-500 dark:text-slate-400 font-medium self-center ml-4">
                  {filteredTools.length} tools available
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredTools.map((tool) => (
                <ToolCard 
                  key={tool.id} 
                  tool={tool} 
                  onClick={(id) => setActiveToolId(id as ToolID)} 
                />
              ))}
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
