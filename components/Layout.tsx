
import React, { useEffect, useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onHomeClick: () => void;
  onCategoryClick: (category: string | null) => void;
  activeCategory: string | null;
}

const AnimatedLogo = ({ scale = 1 }: { scale?: number }) => (
  <div className="flex items-center group cursor-pointer select-none" style={{ transform: `scale(${scale})`, transformOrigin: 'left center' }}>
    <div className="relative w-12 h-10 md:w-16 md:h-12 mr-2 md:mr-3">
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

      <div className="absolute inset-0 flex items-end justify-center pb-1 space-x-[-8px] md:space-x-[-10px] z-10">
        <div className="w-6 h-6 md:w-8 md:h-8 bg-[#ffdca2] rounded-full border-[1.5px] border-slate-900 overflow-hidden relative transform -rotate-12 transition-transform group-hover:-translate-x-1">
          <div className="absolute top-2 left-1.5 md:top-2.5 md:left-2 w-1 md:w-1.5 h-1 md:h-1.5 bg-slate-900 rounded-full"></div>
          <div className="absolute top-2 right-1.5 md:top-2.5 md:right-2 w-1 md:w-1.5 h-1 md:h-1.5 bg-slate-900 rounded-full"></div>
        </div>
        <div className="w-8 h-8 md:w-10 md:h-10 bg-[#ffdca2] rounded-full border-[1.5px] border-slate-900 overflow-hidden relative z-20 transform transition-transform group-hover:-translate-y-1">
          <div className="absolute top-3 left-2 md:top-3.5 md:left-2.5 w-1 md:w-1.5 h-1 md:h-1.5 bg-slate-900 rounded-full"></div>
          <div className="absolute top-3 right-2 md:top-3.5 md:right-2.5 w-1 md:w-1.5 h-1 md:h-1.5 bg-slate-900 rounded-full"></div>
          <div className="absolute bottom-1.5 md:bottom-2 left-1/2 -translate-x-1/2 w-4 md:w-5 h-2.5 md:h-3.5 bg-red-400 rounded-b-full border-t border-slate-900"></div>
        </div>
        <div className="w-6 h-6 md:w-8 md:h-8 bg-[#ffdca2] rounded-full border-[1.5px] border-slate-900 overflow-hidden relative transform rotate-12 transition-transform group-hover:translate-x-1">
          <div className="absolute top-2 left-1.5 md:top-2.5 md:left-2 w-1 md:w-1.5 h-1 md:h-1.5 bg-slate-900 rounded-full"></div>
          <div className="absolute top-2 right-1.5 md:top-2.5 md:right-2 w-1 md:w-1.5 h-1 md:h-1.5 bg-slate-900 rounded-full"></div>
        </div>
      </div>
    </div>
    
    <div className="flex flex-col">
      <div className="flex items-baseline">
        <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">TEEN</span>
        <span className="text-xl md:text-2xl font-black text-orange-500 tracking-tighter leading-none ml-1">TIGDI</span>
      </div>
      <span className="text-[8px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-[0.3em] uppercase leading-none mt-1">THE TRIO AI</span>
    </div>
  </div>
);

const ContactModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;

  const contactItems = [
    { icon: <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>, text: "6266649445", link: "tel:6266649445" },
    { icon: <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>, text: "raghavahir371@gmail.com", link: "mailto:raghavahir371@gmail.com" },
    { icon: <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>, text: "LinkedIn", link: "https://www.linkedin.com/in/raghav-ahir-117b8b357/" },
    { icon: <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5V19.31c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.91-.62.06-.61.06-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.29.1-2.65 0 0 .84-.27 2.75 1.02a9.58 9.58 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.36.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/></svg>, text: "GitHub", link: "https://github.com/rahir19" },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#0f172a] w-full max-w-[380px] rounded-[2.5rem] md:rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-4 md:p-6 flex justify-end">
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500 group">
            <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="px-6 md:px-8 pb-10 md:pb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-8 md:mb-10 tracking-tight">About Me</h2>
          
          <div className="bg-[#1e293b]/60 rounded-3xl md:rounded-[2.5rem] p-4 md:p-6 flex items-center gap-4 md:gap-5 mb-6 md:mb-8 border border-slate-700/50 shadow-inner">
             <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-orange-500 p-1 flex-shrink-0 bg-slate-900 shadow-xl overflow-hidden">
                    <img 
                      src="raghav.jpg" 
                      alt="Raghav Ahir" 
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=Raghav+Ahir&background=f97316&color=fff&size=128`;
                      }}
                    />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 md:w-6 md:h-6 bg-green-500 border-2 md:border-4 border-[#1e293b] rounded-full shadow-lg"></div>
             </div>
             <div className="text-left">
                <p className="text-white font-black text-lg md:text-xl leading-tight">Raghav Ahir</p>
                <p className="text-orange-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-1.5 md:mt-2 bg-orange-500/10 px-2 py-0.5 rounded-md inline-block">Lead Developer</p>
             </div>
          </div>

          <div className="space-y-2.5 md:space-y-3.5">
            {contactItems.map((item, idx) => (
              <a 
                key={idx} 
                href={item.link} 
                target={item.link.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="w-full bg-slate-800/40 hover:bg-slate-800 border border-slate-700/30 rounded-xl md:rounded-2xl py-4 md:py-5 px-5 md:px-6 flex items-center gap-4 md:gap-5 transition-all group active:scale-[0.98]"
              >
                <div className="group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <span className="text-slate-200 font-bold text-sm md:text-[15px] tracking-wide">{item.text}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, onHomeClick, onCategoryClick, activeCategory }) => {
  const [isDark, setIsDark] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    document.body.classList.add('theme-changing');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
    setTimeout(() => document.body.classList.remove('theme-changing'), 600);
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
      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />

      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20 items-center">
            <div onClick={onHomeClick}>
              <AnimatedLogo />
            </div>
            
            <nav className="hidden lg:flex space-x-1">
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

            <div className="flex items-center space-x-2 md:space-x-4">
              <button 
                onClick={toggleTheme}
                className="p-2 md:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 active:scale-90 transition-transform"
              >
                {isDark ? (
                  <svg className="w-5 h-5 animate-theme-pop" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 animate-theme-pop text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              
              <button 
                onClick={() => setIsContactOpen(true)}
                className="hidden sm:block text-xs font-black text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-all uppercase tracking-widest px-4 py-2"
              >
                Creator
              </button>
              
              <button 
                onClick={() => setIsContactOpen(true)}
                className="bg-orange-500 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-black text-xs md:text-sm hover:bg-orange-600 transition-all shadow-lg active:scale-95 uppercase tracking-wider"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Quick Nav */}
        <div className="lg:hidden overflow-x-auto no-scrollbar border-t border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50">
          <div className="flex px-4 py-3 space-x-2">
            {navItems.map((item) => (
              <button 
                key={item.label} 
                onClick={() => onCategoryClick(item.filter)}
                className={`text-[10px] font-black transition-all px-4 py-2 rounded-lg whitespace-nowrap tracking-widest uppercase flex-shrink-0 ${
                  activeCategory === item.filter 
                    ? 'text-white bg-orange-500 shadow-md' 
                    : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-950 text-slate-400 py-12 md:py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
          <div className="col-span-1">
            <div className="mb-6">
               <AnimatedLogo scale={1.1} />
            </div>
            <p className="text-sm font-medium leading-relaxed max-w-[280px] text-slate-500">
              The ultimate trio of PDF management tools. Powering millions of documents with advanced Trio AI intelligence.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 col-span-1 md:col-span-2 gap-8">
            <div>
              <h3 className="text-white font-black mb-6 text-xs uppercase tracking-[0.2em]">Our Tools</h3>
              <ul className="space-y-4 text-xs font-bold">
                <li><button onClick={() => onCategoryClick('ai')} className="hover:text-orange-400 transition-colors uppercase text-left">AI Intelligence</button></li>
                <li><button onClick={() => onCategoryClick('convert')} className="hover:text-orange-400 transition-colors uppercase text-left">Fast Convert</button></li>
                <li><button onClick={() => onCategoryClick('security')} className="hover:text-orange-400 transition-colors uppercase text-left">Security</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-black mb-6 text-xs uppercase tracking-[0.2em]">Company</h3>
              <ul className="space-y-4 text-xs font-bold">
                <li><button onClick={() => setIsContactOpen(true)} className="hover:text-orange-400 transition-colors uppercase text-left">Privacy Policy</button></li>
                <li><button onClick={() => setIsContactOpen(true)} className="hover:text-orange-400 transition-colors uppercase text-left">About Developer</button></li>
                <li><button onClick={() => setIsContactOpen(true)} className="hover:text-orange-400 transition-colors uppercase text-left text-orange-500">Get Help</button></li>
              </ul>
            </div>
          </div>
          <div className="md:text-right border-t md:border-t-0 border-slate-900 pt-8 md:pt-0">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-slate-700">Project Creator</p>
            <p className="text-white font-black text-xl md:text-2xl tracking-tight">Raghav Ahir</p>
            <div className="mt-6 flex md:justify-end gap-3">
               <button 
                onClick={() => setIsContactOpen(true)}
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-orange-500 transition-colors active:scale-90"
               >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.5 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-9 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm4.5 1.5c-2.484 0-4.5-2.016-4.5-4.5h9c0 2.484-2.016 4.5-4.5 4.5z"/></svg>
               </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16 pt-8 border-t border-slate-900 text-center text-[8px] md:text-[10px] font-black text-slate-800 tracking-[0.4em] md:tracking-[0.5em] uppercase">
          <p>© 2025 TEEN TIGDI • ENGINEERED FOR PERFECTION</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
