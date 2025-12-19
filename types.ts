
export type ToolID = 
  | 'merge' | 'split' | 'remove-pages' | 'extract-pages' | 'organize' | 'scan'
  | 'compress' | 'repair' | 'ocr'
  | 'jpg-to-pdf' | 'word-to-pdf' | 'ppt-to-pdf' | 'excel-to-pdf' | 'html-to-pdf'
  | 'pdf-to-jpg' | 'pdf-to-word' | 'pdf-to-ppt' | 'pdf-to-excel' | 'pdf-to-pdfa'
  | 'rotate' | 'page-numbers' | 'watermark' | 'crop' | 'edit-pdf'
  | 'unlock' | 'protect' | 'sign' | 'redact' | 'compare'
  | 'ai-summarize' | 'ai-chat' | 'pdf-to-ocr-word' | 'screenshot-editor';

export interface PDFTool {
  id: ToolID;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: 'edit' | 'convert' | 'ai' | 'security' | 'organize' | 'optimize';
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
