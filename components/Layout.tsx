
import React, { useEffect, useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onHomeClick: () => void;
  onCategoryClick: (category: string | null) => void;
  activeCategory: string | null;
}

const AnimatedLogo = ({ scale = 1 }: { scale?: number }) => (
  <div className="flex items-center group cursor-pointer select-none" style={{ transform: `scale(${scale})`, transformOrigin: 'left center' }}>
    <div className="relative w-16 h-12 mr-3">
      {/* Orange Headphone Band */}
      <svg className="absolute inset-0 w-full h-full -top-1 z-0" viewBox="0 0 100 60" fill="none">
        <path 
          d="M15 42 C 15 5, 85 5, 85 42" 
          stroke="#f97316" 
          strokeWidth="7" 
          strokeLinecap="round"
        />
        <rect x="6" y="34" width="12" height="20" rx="4" fill="#f97316" />
        <rect x="82" y="34" width="12" height="20" rx="4" fill="#f97316" />
      </svg>

      {/* The Trio Faces */}
      <div className="absolute inset-0 flex items-end justify-center pb-1 space-x-[-10px] z-10">
        {/* Left Face */}
        <div className="w-8 h-8 bg-[#ffdca2] rounded-full border-[1.5px] border-slate-900 overflow-hidden relative transform -rotate-12 transition-transform group-hover:-translate-x-1">
          <div className="absolute top-2.5 left-2 w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
          <div className="absolute top-2.5 right-2 w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
          <div className="absolute top-1.5 left-1.5 w-2 h-0.5 bg-slate-900 rotate-12"></div>
          <div className="absolute top-1.5 right-1.5 w-2 h-0.5 bg-slate-900 -rotate-12"></div>
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-2 border-t-2 border-slate-900 rounded-[50%]"></div>
        </div>

        {/* Center Face */}
        <div className="w-10 h-10 bg-[#ffdca2] rounded-full border-[1.5px] border-slate-900 overflow-hidden relative z-20 transform transition-transform group-hover:-translate-y-1">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex space-x-[-3px]">
             <div className="w-3.5 h-5 bg-[#5d4037] rounded-full rotate-12"></div>
             <div className="w-3.5 h-6 bg-[#5d4037] rounded-full -rotate-12"></div>
          </div>
          <div className="absolute top-3.5 left-2.5 w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
          <div className="absolute top-3.5 right-2.5 w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-5 h-3.5 bg-red-400 rounded-b-full border-t border-slate-900 shadow-inner"></div>
        </div>

        {/* Right Face */}
        <div className="w-8 h-8 bg-[#ffdca2] rounded-full border-[1.5px] border-slate-900 overflow-hidden relative transform rotate-12 transition-transform group-hover:translate-x-1">
          <div className="absolute top-2.5 left-2 w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
          <div className="absolute top-2.5 right-2 w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
          <div className="absolute top-1.5 left-1.5 w-2 h-0.5 bg-slate-900 rotate-12"></div>
          <div className="absolute top-1.5 right-1.5 w-2 h-0.5 bg-slate-900 -rotate-12"></div>
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-2 border-t-2 border-slate-900 rounded-[50%]"></div>
        </div>
      </div>
    </div>
    
    <div className="flex flex-col">
      <div className="flex items-baseline">
        <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">TEEN</span>
        <span className="text-2xl font-black text-orange-500 tracking-tighter leading-none ml-1">TIGDI</span>
      </div>
      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-[0.3em] uppercase leading-none mt-1">THE TRIO AI</span>
    </div>
  </div>
);

const Layout: React.FC<LayoutProps> = ({ children, onHomeClick, onCategoryClick, activeCategory }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const navItems = [
    { label: 'All Tools', filter: null },
    { label: 'Organize', filter: 'organize' },
    { label: 'Optimize', filter: 'optimize' },
    { label: 'Convert', filter: 'convert' },
    { label: 'Edit', filter: 'edit' },
    { label: 'Security', filter: 'security' },
    { label: 'AI Suite', filter: 'ai' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div onClick={onHomeClick}>
              <AnimatedLogo />
            </div>
            
            <nav className="hidden lg:flex space-x-2">
              {navItems.map((item) => (
                <button 
                  key={item.label} 
                  onClick={() => onCategoryClick(item.filter)}
                  className={`text-sm font-black transition-all px-4 py-2 rounded-xl whitespace-nowrap tracking-wide uppercase ${
                    activeCategory === item.filter 
                      ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {isDark ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              
              <button className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-black text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 active:scale-95 uppercase tracking-wider">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-950 text-slate-400 py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1">
            <div className="mb-6">
               <AnimatedLogo scale={1.2} />
            </div>
            <p className="text-sm font-medium leading-relaxed max-w-[280px] text-slate-500">
              The ultimate trio of PDF management tools. Powering millions of documents with Gemini AI intelligence.
            </p>
          </div>
          <div>
            <h3 className="text-white font-black mb-6 text-sm uppercase tracking-[0.2em]">Our Tools</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li><button onClick={() => onCategoryClick('ai')} className="hover:text-orange-400 transition-colors uppercase">AI Intelligence</button></li>
              <li><button onClick={() => onCategoryClick('convert')} className="hover:text-orange-400 transition-colors uppercase">Fast Convert</button></li>
              <li><button onClick={() => onCategoryClick('security')} className="hover:text-orange-400 transition-colors uppercase">Deep Security</button></li>
              <li><button onClick={() => onCategoryClick('organize')} className="hover:text-orange-400 transition-colors uppercase">Page Organize</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-black mb-6 text-sm uppercase tracking-[0.2em]">Information</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li><a href="#" className="hover:text-orange-400 transition-colors uppercase">About the Trio</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors uppercase">Privacy & Safety</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors uppercase">Legal Terms</a></li>
            </ul>
          </div>
          <div className="md:text-right">
            <p className="text-xs font-black uppercase tracking-[0.3em] mb-3 text-slate-700">Project Owner</p>
            <p className="text-white font-black text-2xl tracking-tight">Raghav Ahir</p>
            <div className="mt-8 flex md:justify-end gap-4">
               {/* Social placeholders */}
               <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-orange-500 cursor-pointer transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
               </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-900 text-center text-[10px] font-black text-slate-800 tracking-[0.5em] uppercase">
          <p>© 2025 TEEN TIGDI • ENGINEERED FOR PERSFECTION</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
