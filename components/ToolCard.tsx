
import React from 'react';
import { PDFTool } from '../types';

interface ToolCardProps {
  tool: PDFTool;
  onClick: (id: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  return (
    <div 
      className="tool-card group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-7 flex flex-col items-start cursor-pointer transition-all duration-300 hover:border-red-400 dark:hover:border-red-500/50"
      onClick={() => onClick(tool.id)}
    >
      <div className={`${tool.color} p-3.5 rounded-xl text-white mb-6 shadow-lg shadow-${tool.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform`}>
        {tool.icon}
      </div>
      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
        {tool.title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
        {tool.description}
      </p>
      
      <div className="mt-6 flex items-center text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest group-hover:text-red-500 transition-colors">
        Launch Tool
        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </div>
  );
};

export default ToolCard;
