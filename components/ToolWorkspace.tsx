
import React, { useState, useRef, useEffect } from 'react';
import { PDFTool, ChatMessage, ToolID } from '../types';
import { geminiService } from '../services/geminiService';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// PDF.js worker for rendering
const PDFJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

interface ToolWorkspaceProps {
  tool: PDFTool;
}

interface PdfPage {
  dataUrl: string;
  pageNumber: number;
  fileName: string;
}

const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({ tool }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [pdfPages, setPdfPages] = useState<PdfPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadStep, setDownloadStep] = useState<'idle' | 'uploading' | 'converting' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  
  // Scanner States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scannedPages, setScannedPages] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  const isPdfTool = !['screenshot-editor', 'jpg-to-pdf', 'scan'].includes(tool.id);
  const isScannerTool = tool.id === 'scan';

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing, scannedPages]);

  useEffect(() => {
    if (isPdfTool) {
      const script = document.createElement('script');
      script.src = PDFJS_URL;
      script.onload = () => {
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
      };
      document.head.appendChild(script);
    }
  }, [isPdfTool]);

  useEffect(() => {
    if (isScannerTool && isCameraActive) {
      navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
      })
      .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
      .catch(() => setIsCameraActive(false));
    }
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [isScannerTool, isCameraActive]);

  const capturePage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        setScannedPages(prev => [...prev, canvas.toDataURL('image/jpeg', 0.92)]);
      }
    }
  };

  useEffect(() => {
    const renderPreviews = async () => {
      if (files.length === 0) { setPdfPages([]); return; }
      if (isPdfTool) {
        setIsProcessing(true);
        const newPages: PdfPage[] = [];
        for (const file of files) {
          if (!file.name.toLowerCase().endsWith('.pdf')) continue;
          try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await (window as any).pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
              const page = await pdf.getPage(i);
              const viewport = page.getViewport({ scale: 0.6 });
              const canvas = document.createElement('canvas');
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise;
              newPages.push({ dataUrl: canvas.toDataURL(), pageNumber: i, fileName: file.name });
            }
          } catch (e) { console.error(e); }
        }
        setPdfPages(newPages);
        setIsProcessing(false);
      }
    };
    renderPreviews();
  }, [files, isPdfTool, tool.id]);

  const getExportExtension = (id: ToolID): string => {
    if (id.includes('to-word')) return 'docx';
    if (id.includes('to-excel')) return 'xlsx';
    if (id.includes('to-ppt')) return 'pptx';
    if (id.includes('to-jpg')) return 'jpg';
    if (id.includes('to-pdf') || id === 'merge' || id === 'split' || id === 'compress' || id === 'scan') return 'pdf';
    return 'bin';
  };

  const generateWordDoc = async (text: string) => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: text.split('\n').map(line => new Paragraph({
          children: [new TextRun(line)],
        })),
      }],
    });
    return await Packer.toBlob(doc);
  };

  const handleAIAnalysis = async (): Promise<string | null> => {
    if (files.length === 0 && scannedPages.length === 0) return null;
    setIsProcessing(true);
    try {
      const isWordTask = tool.id.includes('to-word');
      const prompt = isWordTask 
        ? "Extract ALL text from this document. Give me only the text, no conversational fillers. I need this for a Word document conversion."
        : "Bhai is scanned page mein kya hai? Summary de.";

      let extractionResult = "";
      if (scannedPages.length > 0) {
        const data = scannedPages[0].split(',')[1];
        extractionResult = await geminiService.processDocument("Scan", data, "image/jpeg", prompt, "Expert analyst.");
      } else if (files.length > 0) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.readAsDataURL(files[0]);
        });
        extractionResult = await geminiService.processDocument(files[0].name, base64, files[0].type || 'application/pdf', prompt, "Helpful assistant.");
      }
      
      setResult(extractionResult);
      return extractionResult;
    } catch (e) {
      console.error(e);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (files.length === 0 && scannedPages.length === 0) return;
    
    setDownloadStep('uploading');
    setProgress(10);
    
    try {
      let currentText = result;
      const ext = getExportExtension(tool.id);

      // If we are doing PDF to Word/Excel, we MUST have AI text first
      if ((tool.id.includes('to-word') || tool.id.includes('to-excel')) && !currentText) {
          setDownloadStep('converting');
          setProgress(30);
          currentText = await handleAIAnalysis();
          if (!currentText) throw new Error("AI Extraction failed");
      }

      setDownloadStep('converting');
      setProgress(60);
      
      let finalBlob: Blob | null = null;
      let finalFileName = `teen-tigdi-${tool.id}-${Date.now()}`;

      if (tool.id === 'scan') {
        const doc = new jsPDF();
        for (let i = 0; i < scannedPages.length; i++) {
            if (i > 0) doc.addPage();
            const imgData = scannedPages[i];
            const imgProps = doc.getImageProperties(imgData);
            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            doc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        }
        finalBlob = doc.output('blob');
      } else if (ext === 'docx') {
        finalBlob = await generateWordDoc(currentText || "No text extracted.");
      } else if (tool.id === 'merge' && files.length > 1) {
        const mergedPdf = await PDFDocument.create();
        for (const file of files) {
          const pdf = await PDFDocument.load(await file.arrayBuffer());
          const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          pages.forEach(p => mergedPdf.addPage(p));
        }
        const pdfBytes = await mergedPdf.save();
        finalBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      } else if (ext === 'jpg' && pdfPages.length > 0) {
        const res = await fetch(pdfPages[0].dataUrl);
        finalBlob = await res.blob();
      } else {
        finalBlob = files[0] || (await (await fetch(scannedPages[0])).blob());
      }

      if (finalBlob) {
        setProgress(90);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(finalBlob);
        link.download = `${finalFileName}.${ext}`;
        link.click();
        setProgress(100);
        setDownloadStep('done');
      }
      
      setTimeout(() => { setDownloadStep('idle'); setProgress(0); }, 3000);
    } catch (e) {
      console.error(e);
      setDownloadStep('idle');
      setProgress(0);
    }
  };

  const handleChat = async () => {
    if (!input.trim() || (files.length === 0 && scannedPages.length === 0)) return;
    const msg = input; setInput('');
    setMessages(p => [...p, { role: 'user', content: msg }]);
    setIsProcessing(true);
    try {
      const data = scannedPages.length > 0 ? scannedPages[0].split(',')[1] : null;
      if (data) {
        const res = await geminiService.chatWithDocument("Scan", data, "image/jpeg", msg);
        setMessages(p => [...p, { role: 'model', content: res }]);
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = async () => {
          const res = await geminiService.chatWithDocument(files[0].name, (reader.result as string).split(',')[1], files[0].type || 'application/pdf', msg);
          setMessages(p => [...p, { role: 'model', content: res }]);
        };
      }
    } finally { setIsProcessing(false); }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8 animate-in fade-in duration-500">
      {files.length === 0 && !isCameraActive && scannedPages.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center">
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter uppercase italic">
              {tool.title} <span className="text-orange-500">Suite</span>
            </h1>
            <p className="text-slate-500 font-bold mb-12 max-w-xl mx-auto text-lg leading-relaxed">
               {isScannerTool ? "Phone ya desktop camera se scan karein aur professional PDF banayein." : "Professional grade document tools powered by Trio AI."}
            </p>
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
                {isScannerTool && (
                    <div onClick={() => setIsCameraActive(true)} className="flex-1 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] p-12 bg-white dark:bg-slate-900/30 hover:border-orange-500 transition-all cursor-pointer shadow-2xl group flex flex-col items-center">
                        <div className="bg-orange-500 p-8 rounded-3xl text-white mb-6 shadow-xl group-hover:scale-110 transition-transform">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <p className="text-2xl font-black uppercase italic tracking-tighter">Use Camera</p>
                    </div>
                )}
                <div onClick={() => fileInputRef.current?.click()} className="flex-1 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] p-12 bg-white dark:bg-slate-900/30 hover:border-orange-500 transition-all cursor-pointer shadow-2xl group flex flex-col items-center">
                    <input type="file" ref={fileInputRef} className="hidden" accept={tool.id.includes('pdf-to') ? '.pdf' : '*/*'} multiple={tool.id === 'merge'} onChange={e => e.target.files && setFiles(Array.from(e.target.files))} />
                    <div className={`${tool.color} p-8 rounded-3xl text-white mb-6 shadow-xl group-hover:scale-110 transition-transform`}>{tool.icon}</div>
                    <p className="text-2xl font-black uppercase italic tracking-tighter">Choose Files</p>
                </div>
            </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-140px)]">
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4 mb-8">
                    <div className={`${tool.color} p-3 rounded-xl text-white shadow-lg`}>{tool.icon}</div>
                    <div className="truncate">
                        <h3 className="font-black text-slate-900 dark:text-white truncate uppercase italic text-sm">{tool.title}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{scannedPages.length || files.length} Items</p>
                    </div>
                </div>
                
                <div className="space-y-4">
                    {downloadStep !== 'idle' && (
                        <div className="mb-4">
                            <div className="flex justify-between text-[10px] font-black uppercase text-orange-500 mb-1">
                                <span>{downloadStep}...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${progress}%` }} /></div>
                        </div>
                    )}
                    
                    <button 
                        onClick={handleDownload}
                        disabled={downloadStep !== 'idle' || isProcessing}
                        className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 ${
                            downloadStep === 'done' ? 'bg-green-500 text-white' : 'bg-orange-600 text-white shadow-orange-500/20'
                        } active:scale-95 disabled:opacity-50`}
                    >
                        {downloadStep === 'idle' ? `Convert & Download .${getExportExtension(tool.id)}` : 'Processing...'}
                    </button>
                    
                    <button onClick={() => handleAIAnalysis()} className="w-full py-4 bg-orange-50 text-orange-600 rounded-2xl font-black text-xs uppercase hover:bg-orange-100 transition-colors">Trio AI Extract</button>
                </div>
                
                <button onClick={() => { setFiles([]); setScannedPages([]); setIsCameraActive(false); setResult(null); }} className="w-full mt-6 py-3 text-slate-400 hover:text-red-500 text-xs font-black uppercase transition-colors">Discard All</button>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-4 overflow-hidden">
             {isCameraActive ? (
                <div className="flex-grow bg-slate-950 rounded-[3rem] relative overflow-hidden shadow-2xl">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none" />
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8">
                        <button onClick={() => setIsCameraActive(false)} className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center backdrop-blur-md">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <button onClick={capturePage} className="w-20 h-20 rounded-full bg-white border-4 border-orange-500 shadow-2xl active:scale-90 transition-transform" />
                        <div className="w-12 h-12" />
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                </div>
             ) : (
                <div className="flex-grow overflow-y-auto custom-scrollbar p-8 bg-white dark:bg-slate-900 rounded-[3rem] border-4 border-slate-100 dark:border-slate-800 shadow-inner">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {isScannerTool && scannedPages.map((p, i) => (
                            <div key={i} className="relative group aspect-[3/4] bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md border-2 border-orange-500/20">
                                <img src={p} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 bg-orange-600 text-white text-[10px] font-black px-2 py-1 rounded-lg">P{i+1}</div>
                                <button onClick={() => setScannedPages(p => p.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ))}
                        {pdfPages.map((p, i) => (
                            <div key={i} className="bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
                                <img src={p.dataUrl} className="w-full h-auto rounded-xl" />
                                <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase text-center">Page {p.pageNumber}</p>
                            </div>
                        ))}
                    </div>
                </div>
             )}
          </div>

          <div className="lg:col-span-3 flex flex-col h-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
             <div className="bg-slate-50 dark:bg-slate-800/50 p-5 border-b text-[10px] font-black uppercase tracking-widest text-orange-600">Trio Intelligence</div>
             <div className="flex-grow overflow-y-auto p-5 space-y-5 custom-scrollbar">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[11px] font-bold leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-orange-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>{m.content}</div>
                    </div>
                ))}
                {result && <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/30 text-[11px] font-medium leading-relaxed">{result}</div>}
                {isProcessing && <div className="text-center py-4 animate-pulse text-xs font-bold text-slate-400 uppercase tracking-widest">Trio is thinking...</div>}
                <div ref={chatEndRef} />
             </div>
             <div className="p-4 border-t flex gap-2">
                <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleChat()} placeholder="Trio se pucho..." className="flex-grow bg-slate-50 dark:bg-slate-800 rounded-2xl px-5 py-3.5 outline-none text-xs font-bold" />
                <button onClick={handleChat} disabled={isProcessing || !input.trim()} className="bg-orange-600 text-white p-4 rounded-2xl"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolWorkspace;
