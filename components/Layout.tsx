
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

      <div className="absolute inset-0 flex items-end justify-center pb-1 space-x-[-10px] z-10">
        <div className="w-8 h-8 bg-[#ffdca2] rounded-full border-[1.5px] border-slate-900 overflow-hidden relative transform -rotate-12 transition-transform group-hover:-translate-x-1">
          <div className="absolute top-2.5 left-2 w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
          <div className="absolute top-2.5 right-2 w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-2 border-t-2 border-slate-900 rounded-[50%]"></div>
        </div>
        <div className="w-10 h-10 bg-[#ffdca2] rounded-full border-[1.5px] border-slate-900 overflow-hidden relative z-20 transform transition-transform group-hover:-translate-y-1">
          <div className="absolute top-3.5 left-2.5 w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
          <div className="absolute top-3.5 right-2.5 w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-5 h-3.5 bg-red-400 rounded-b-full border-t border-slate-900 shadow-inner"></div>
        </div>
        <div className="w-8 h-8 bg-[#ffdca2] rounded-full border-[1.5px] border-slate-900 overflow-hidden relative transform rotate-12 transition-transform group-hover:translate-x-1">
          <div className="absolute top-2.5 left-2 w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
          <div className="absolute top-2.5 right-2 w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
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

const ContactModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;

  const contactItems = [
    { icon: <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>, text: "6266649445", link: "tel:6266649445" },
    { icon: <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>, text: "raghavahir371@gmail.com", link: "mailto:raghavahir371@gmail.com" },
    { icon: <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>, text: "LinkedIn Profile", link: "https://www.linkedin.com/in/raghav-ahir-117b8b357/" },
    { icon: <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5V19.31c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.91-.62.06-.61.06-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.29.1-2.65 0 0 .84-.27 2.75 1.02a9.58 9.58 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.36.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/></svg>, text: "GitHub Profile", link: "https://github.com/rahir19" },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#0f172a] w-full max-w-[380px] rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 flex justify-end">
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500 group">
            <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="px-8 pb-12 text-center">
          <h2 className="text-4xl font-black text-white mb-10 tracking-tight">About Me</h2>
          
          <div className="bg-[#1e293b]/60 rounded-[2.5rem] p-6 flex items-center gap-5 mb-8 border border-slate-700/50 shadow-inner">
             <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-orange-500 p-1.5 flex-shrink-0 bg-slate-900 shadow-xl overflow-hidden">
                    <img 
                      src="raghav.jpg" 
                      alt="Raghav Ahir" 
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Raghav+Ahir&background=f97316&color=fff&size=128";
                      }}
                    />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-[#1e293b] rounded-full shadow-lg"></div>
             </div>
             <div className="text-left">
                <p className="text-white font-black text-xl leading-tight">Raghav Ahir Yaduvanshi</p>
                <p className="text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 bg-orange-500/10 px-2 py-0.5 rounded-md inline-block">Lead Developer</p>
             </div>
          </div>

          <div className="space-y-3.5">
            {contactItems.map((item, idx) => (
              <a 
                key={idx} 
                href={item.link} 
                target={item.link.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="w-full bg-slate-800/40 hover:bg-slate-800 border border-slate-700/30 rounded-2xl py-5 px-6 flex items-center gap-5 transition-all group active:scale-[0.98] hover:shadow-lg hover:shadow-orange-500/5"
              >
                <div className="group-hover:scale-110 transition-transform duration-300 drop-shadow-md">
                  {item.icon}
                </div>
                <span className="text-slate-200 font-bold text-[15px] tracking-wide">{item.text}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthModal = ({ isOpen, onClose, initialMode = 'signup' }: { isOpen: boolean, onClose: () => void, initialMode?: 'signup' | 'login' }) => {
  const [mode, setMode] = useState<'signup' | 'login'>(initialMode);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-4 flex justify-between items-center">
          <AnimatedLogo scale={0.8} />
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="px-10 pb-12 pt-4">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
            {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
            {mode === 'signup' ? 'Join Teen Tigdi to unlock premium AI tools.' : 'Log in to access your saved documents.'}
          </p>

          <div className="space-y-4 mb-8">
            <button className="w-full py-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-slate-700 dark:text-slate-300">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
            <div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-slate-400"><span className="bg-white dark:bg-slate-900 px-4">Or use email</span></div>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-orange-500 outline-none dark:text-white transition-all font-medium"
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-orange-500 outline-none dark:text-white transition-all font-medium"
            />
            <button className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-500/20 transition-all active:scale-[0.98] uppercase tracking-widest">
              {mode === 'signup' ? 'Create Account' : 'Log In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-bold text-slate-500">
            {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
            <button 
              onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
              className="ml-2 text-orange-500 hover:text-orange-600 underline"
            >
              {mode === 'signup' ? 'Log in here' : 'Sign up for free'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, onHomeClick, onCategoryClick, activeCategory }) => {
  const [isDark, setIsDark] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    // Apply temporary glow effect to body
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

    // Remove animation class after sequence finish
    setTimeout(() => {
        document.body.classList.remove('theme-changing');
    }, 600);
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
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => { setIsAuthOpen(false); setIsLoggedIn(true); }} 
      />
      
      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />

      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
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
              <button 
                onClick={() => setIsContactOpen(true)}
                className="text-sm font-black text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 transition-all px-4 py-2 rounded-xl whitespace-nowrap tracking-wide uppercase"
              >
                About Creator
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 group overflow-hidden relative"
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
                {/* Subtle indicator for button clickability */}
                <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 transition-colors"></div>
              </button>
              
              {isLoggedIn ? (
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-full border-2 border-orange-500 overflow-hidden shadow-lg">
                    <img 
                      src="raghav.jpg" 
                      className="w-full h-full object-cover" 
                      alt="Raghav" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Raghav+Ahir&background=f97316&color=fff&size=64";
                      }}
                    />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 leading-none mb-1">Premium</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Raghav Ahir</p>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-black text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 active:scale-95 uppercase tracking-wider"
                >
                  Sign up
                </button>
              )}
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
              The ultimate trio of PDF management tools. Powering millions of documents with advanced Trio AI intelligence.
            </p>
          </div>
          <div>
            <h3 className="text-white font-black mb-6 text-sm uppercase tracking-[0.2em]">Our Tools</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li><button onClick={() => onCategoryClick('ai')} className="hover:text-orange-400 transition-colors uppercase text-left">AI Intelligence</button></li>
              <li><button onClick={() => onCategoryClick('convert')} className="hover:text-orange-400 transition-colors uppercase text-left">Fast Convert</button></li>
              <li><button onClick={() => onCategoryClick('security')} className="hover:text-orange-400 transition-colors uppercase text-left">Deep Security</button></li>
              <li><button onClick={() => onCategoryClick('organize')} className="hover:text-orange-400 transition-colors uppercase text-left">Page Organize</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-black mb-6 text-sm uppercase tracking-[0.2em]">Information</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li><a href="#" className="hover:text-orange-400 transition-colors uppercase">About the Trio</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors uppercase">Privacy & Safety</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors uppercase">Legal Terms</a></li>
              <li><button onClick={() => setIsContactOpen(true)} className="text-orange-500 hover:text-orange-400 transition-colors uppercase text-left">Contact Developer</button></li>
            </ul>
          </div>
          <div className="md:text-right">
            <p className="text-xs font-black uppercase tracking-[0.3em] mb-3 text-slate-700">Project Owner</p>
            <p className="text-white font-black text-2xl tracking-tight">Raghav Ahir</p>
            <div className="mt-8 flex md:justify-end gap-4">
               <button 
                onClick={() => setIsContactOpen(true)}
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-orange-500 cursor-pointer transition-colors"
               >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.5 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-9 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm4.5 1.5c-2.484 0-4.5-2.016-4.5-4.5h9c0 2.484-2.016 4.5-4.5 4.5z"/></svg>
               </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-900 text-center text-[10px] font-black text-slate-800 tracking-[0.5em] uppercase">
          <p>© 2025 TEEN TIGDI • ENGINEERED FOR PERFECTION</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
