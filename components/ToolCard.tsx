
import React from 'react';
import { PDFTool } from '../types';

interface ToolCardProps {
  tool: PDFTool;
  onClick: (id: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  return (
    <div 
      className="tool-card group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-7 flex flex-col items-start cursor-pointer transition-all duration-300 hover:border-orange-400 dark:hover:border-orange-500/50 active:scale-98"
      onClick={() => onClick(tool.id)}
    >
      <div className={`${tool.color} p-3 md:p-3.5 rounded-xl text-white mb-5 md:mb-6 shadow-lg shadow-${tool.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform`}>
        {tool.icon}
      </div>
      <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-2 md:mb-3 group-hover:text-orange-500 transition-colors tracking-tight">
        {tool.title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed line-clamp-2 mb-4">
        {tool.description}
      </p>
      
      <div className="mt-auto flex items-center text-[10px] md:text-xs font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest group-hover:text-orange-500 transition-colors">
        Launch Tool
        <svg className="w-3 h-3 md:w-4 md:h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </div>
  );
};

export default ToolCard;
