
import React, { useState, useRef, useEffect } from 'react';
import { PDFTool, ChatMessage } from '../types';
import { geminiService } from '../services/geminiService';
import { jsPDF } from 'https://esm.sh/jspdf';

interface ToolWorkspaceProps {
  tool: PDFTool;
}

interface ErrorState {
  type: 'unsupported' | 'corrupted' | 'password' | 'generic';
  message: string;
}

const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({ tool }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState<ErrorState | null>(null);
  
  const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'doc'>(
    (tool.id.includes('word') || tool.id.includes('ocr')) ? 'doc' : 'pdf'
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const validateFiles = (selected: File[]): boolean => {
    setError(null);
    const supportedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    for (const file of selected) {
      if (!supportedTypes.includes(file.type) && !file.name.endsWith('.pdf')) {
        setError({
          type: 'unsupported',
          message: `The file format of "${file.name}" is not supported. Please use PDF, JPG, or PNG.`
        });
        return false;
      }
      
      if (file.size > 20 * 1024 * 1024) { // 20MB limit
        setError({
          type: 'generic',
          message: `The file "${file.name}" is too large. Maximum size allowed is 20MB.`
        });
        return false;
      }
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      if (!validateFiles(selected)) return;

      if (tool.id === 'merge') {
        setFiles(prev => [...prev, ...selected]);
      } else {
        setFiles(selected.slice(0, 1));
      }
      setResult(null);
      setEditedText('');
      setMessages([]);
    }
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setResult(null);
    setError(null);

    try {
      if (tool.id === 'merge') {
        const summary = `MERGED DOCUMENT\n\nFiles combined: ${files.length}\nFiles list:\n` + 
                       files.map((f, i) => `${i+1}. ${f.name}`).join('\n') +
                       `\n\nCombined Content Summary: [Simulated merged binary data for ${files.length} documents]`;
        setResult(summary);
        setEditedText(summary);
      } else {
        const file = files[0];
        const base64Data = await fileToBase64(file);
        const mimeType = file.type || 'application/pdf';

        // Simulated check for password protection or corruption
        // In a real app, you'd use a PDF library to probe the file first
        if (file.name.includes('_protected')) {
           setError({ type: 'password', message: "This PDF is password protected. Please unlock it before processing." });
           setIsProcessing(false);
           return;
        }

        let text = "";
        if (tool.id === 'ai-summarize') {
          text = await geminiService.summarizeDocument(file.name, base64Data, mimeType);
        } else if (tool.id === 'pdf-to-ocr-word' || tool.id === 'pdf-to-word') {
          text = await geminiService.convertToEditable(file.name, base64Data, mimeType);
        } else {
          text = await geminiService.convertToEditable(file.name, base64Data, mimeType);
        }
        
        setResult(text);
        setEditedText(text);
      }
    } catch (e: any) {
      console.error(e);
      setError({
        type: 'corrupted',
        message: "An error occurred during processing. The file might be corrupted or incompatible with our AI engine."
      });
    }
    
    setIsProcessing(false);
  };

  const handleDownload = () => {
    const contentToSave = editedText || result;
    if (!contentToSave) return;
    const fileName = (files[0]?.name.split('.')[0] || 'teen_tigdi_export') + `.${downloadFormat}`;

    if (downloadFormat === 'doc') {
      const htmlContent = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; padding: 1in; color: #333;"><div style="white-space: pre-wrap; font-size: 11pt;">${contentToSave.replace(/\n/g, '<br>')}</div></body></html>`;
      const blob = new Blob([htmlContent], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const splitText = doc.splitTextToSize(contentToSave, 180);
      let y = 20;
      const pageHeight = doc.internal.pageSize.height;
      splitText.forEach((line: string) => {
        if (y > pageHeight - 20) { doc.addPage(); y = 20; }
        doc.text(line, 15, y);
        y += 7; 
      });
      doc.save(fileName);
    }
  };

  const handleChat = async () => {
    if (!input.trim() || files.length === 0) return;
    setError(null);
    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsProcessing(true);

    try {
      const base64Data = await fileToBase64(files[0]);
      const mimeType = files[0].type || 'application/pdf';
      const response = await geminiService.chatWithDocument(files[0].name, base64Data, mimeType, currentInput);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (e) {
      setError({ type: 'generic', message: "Trio AI is currently unable to answer questions. Please try again later." });
    }
    setIsProcessing(false);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (files.length <= 1) setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-20 animate-in fade-in duration-700">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">{tool.title}</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto leading-relaxed">{tool.description}</p>
      </div>

      {files.length === 0 ? (
        <div className="space-y-8">
          <div 
            className="border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] p-24 flex flex-col items-center justify-center bg-white dark:bg-slate-900/30 hover:border-orange-500 transition-all cursor-pointer group shadow-2xl shadow-slate-200 dark:shadow-none"
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" ref={fileInputRef} className="hidden" multiple={tool.id === 'merge'} onChange={handleFileChange} />
            <div className={`${tool.color} p-10 rounded-3xl text-white mb-8 shadow-2xl group-hover:scale-110 transition-all group-hover:rotate-3`}>
              {tool.icon}
            </div>
            <p className="text-4xl font-black text-slate-800 dark:text-slate-100 mb-2">Drop your PDF here</p>
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">The Trio AI is ready for your task</p>
            <button className="mt-12 bg-orange-600 text-white px-12 py-5 rounded-2xl text-xl font-black hover:bg-orange-700 shadow-2xl transition-all active:scale-95 uppercase tracking-widest">
              Select {tool.id === 'merge' ? 'Files' : 'File'}
            </button>
          </div>
          
          {error && (
            <div className="animate-in slide-in-from-top duration-300">
              <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-500/20 rounded-3xl p-6 flex items-start gap-5">
                <div className="bg-red-500 p-2 rounded-xl text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div>
                  <h4 className="text-red-600 dark:text-red-400 font-black uppercase tracking-widest text-xs mb-1">Upload Error</h4>
                  <p className="text-slate-800 dark:text-slate-200 font-bold leading-tight">{error.message}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl p-10 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-10 pb-8 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center">
              <div className={`${tool.color} p-4 rounded-2xl text-white mr-6 shadow-xl`}>
                {tool.icon}
              </div>
              <div>
                <p className="font-black text-slate-900 dark:text-white text-2xl tracking-tight leading-none">
                  {files.length > 1 ? `${files.length} Files selected` : files[0].name}
                </p>
                <div className="flex items-center mt-3">
                   <div className={`w-2.5 h-2.5 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'} mr-2 animate-pulse`}></div>
                   <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">{error ? 'Action Required' : 'Ready to Process'}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => {setFiles([]); setResult(null); setMessages([]); setEditedText(''); setError(null);}} 
              className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-300 hover:text-red-500 transition-all"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {error && (
            <div className="mb-8 animate-in fade-in zoom-in-95">
              <div className="bg-red-600 text-white p-6 rounded-[2rem] flex items-center gap-6 shadow-xl shadow-red-500/20">
                <div className="bg-white/20 p-3 rounded-full">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div>
                   <p className="font-black text-xs uppercase tracking-[0.3em] opacity-80 mb-1">Process Blocked</p>
                   <p className="text-xl font-bold">{error.message}</p>
                </div>
              </div>
            </div>
          )}

          {tool.id === 'merge' && !result && (
            <div className="mb-10 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Selected Documents</h3>
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-black mr-4">{idx + 1}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{file.name}</span>
                  </div>
                  <button onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-600 p-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
              <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-orange-500 hover:border-orange-500 font-black uppercase tracking-widest text-sm transition-all">+ Add More Files</button>
            </div>
          )}

          {tool.id === 'ai-chat' ? (
            <div className="space-y-6">
              <div className="h-[500px] overflow-y-auto border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 bg-slate-50 dark:bg-slate-950/50 space-y-6 shadow-inner scroll-smooth">
                {messages.length === 0 && (
                  <div className="text-center mt-40">
                    <div className="inline-block p-5 bg-orange-100 dark:bg-orange-900/20 rounded-[2rem] mb-6"><svg className="w-12 h-12 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg></div>
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-sm">Ask anything about this document</p>
                  </div>
                )}
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-3xl px-8 py-5 shadow-lg text-lg font-medium leading-relaxed ${m.role === 'user' ? 'bg-orange-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200'}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl px-8 py-5 text-slate-400 animate-pulse font-black uppercase tracking-widest text-xs">The Trio is thinking...</div>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleChat()} placeholder="Type your question for the Trio..." className="flex-grow border-4 border-slate-100 dark:border-slate-800 rounded-3xl px-8 py-6 outline-none focus:border-orange-500 transition-all dark:text-white bg-transparent text-xl font-medium" />
                <button onClick={handleChat} disabled={isProcessing || !input.trim()} className="bg-orange-600 text-white px-12 rounded-3xl font-black text-xl hover:bg-orange-700 disabled:opacity-50 transition-all active:scale-95 shadow-xl shadow-orange-500/20">SEND</button>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              {result ? (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <div><h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">AI Output Editor</h3><p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Refine your document below</p></div>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-2 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-inner">
                      <button onClick={() => setDownloadFormat('pdf')} className={`px-8 py-4 rounded-2xl text-sm font-black transition-all uppercase tracking-widest ${downloadFormat === 'pdf' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:text-orange-500'}`}>PDF</button>
                      <button onClick={() => setDownloadFormat('doc')} className={`px-8 py-4 rounded-2xl text-sm font-black transition-all uppercase tracking-widest ${downloadFormat === 'doc' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:text-orange-500'}`}>WORD</button>
                    </div>
                  </div>
                  <div className="relative bg-slate-100 dark:bg-slate-950 p-6 md:p-12 rounded-[3rem] shadow-inner border-4 border-slate-200 dark:border-slate-800">
                    <textarea value={editedText} onChange={(e) => setEditedText(e.target.value)} className="w-full min-h-[700px] p-12 md:p-20 rounded-md bg-white dark:bg-slate-900 shadow-2xl font-sans text-xl leading-relaxed text-slate-800 dark:text-slate-100 outline-none focus:ring-8 focus:ring-orange-500/5 transition-all border border-slate-200 dark:border-slate-800" placeholder="Your content is ready for editing..." />
                    <div className="absolute top-16 right-16 hidden lg:block"><div className="flex items-center space-x-2 bg-orange-600 text-white px-5 py-2.5 rounded-full shadow-2xl"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg><span className="text-[11px] font-black uppercase tracking-widest">Trio AI Verified Output</span></div></div>
                  </div>
                  <div className="mt-12 flex flex-col lg:flex-row gap-6">
                    <button onClick={handleDownload} className="flex-grow bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-8 rounded-[2rem] font-black text-3xl hover:scale-[1.01] active:scale-[0.99] shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center tracking-tighter"><svg className="w-10 h-10 mr-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>DOWNLOAD .{downloadFormat.toUpperCase()}</button>
                    <button onClick={() => {setFiles([]); setResult(null); setEditedText(''); setError(null);}} className="px-16 py-8 border-4 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-orange-500 hover:border-orange-500 rounded-[2rem] font-black transition-all text-2xl uppercase tracking-tighter">RESET</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-10">
                   <button 
                    onClick={handleProcess}
                    disabled={isProcessing || !!error}
                    className="w-full max-w-2xl bg-orange-600 text-white py-10 rounded-[3rem] text-4xl font-black hover:bg-orange-700 shadow-2xl shadow-orange-500/40 disabled:opacity-50 flex items-center justify-center transition-all hover:scale-105 active:scale-95 group"
                  >
                    {isProcessing ? (
                      <span className="flex items-center"><svg className="animate-spin -ml-1 mr-5 h-10 w-10 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>The Trio is Working...</span>
                    ) : (
                      <><svg className="w-10 h-10 mr-5 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>RUN {tool.title.toUpperCase()}</>
                    )}
                  </button>
                  <div className="mt-12 flex items-center space-x-8">
                     <div className="flex -space-x-4">
                        {[1,2,3].map(i => <div key={i} className="w-14 h-14 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 overflow-hidden shadow-xl"><div className="w-full h-full bg-[#ffdca2] flex items-center justify-center text-xs font-black">AI</div></div>)}
                     </div>
                     <p className="text-slate-400 font-black text-sm uppercase tracking-[0.4em]">Engineered for perfection</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ToolWorkspace;
