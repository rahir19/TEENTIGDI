
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async processDocument(
    fileName: string, 
    base64Data: string, 
    mimeType: string, 
    taskPrompt: string,
    systemInstruction: string
  ): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data,
                },
              },
              {
                text: `${taskPrompt}`,
              },
            ],
          },
        ],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.1, // Lower temperature for more faithful reproduction
        },
      });
      return response.text || "No output could be generated.";
    } catch (error) {
      console.error("Gemini processing error:", error);
      return "An error occurred while the AI was reading your document. Please ensure the file is valid and not password protected.";
    }
  }

  async summarizeDocument(fileName: string, base64Data: string, mimeType: string): Promise<string> {
    return this.processDocument(
      fileName,
      base64Data,
      mimeType,
      "Summarize this document clearly.",
      "You are a professional document summarizer. Be concise and accurate."
    );
  }

  async convertToEditable(fileName: string, base64Data: string, mimeType: string): Promise<string> {
    return this.processDocument(
      fileName,
      base64Data,
      mimeType,
      "Transcribe this document exactly. Maintain the layout, alignment, bold text, and overall structure as much as possible using plain text and basic spacing. DO NOT add any extra text, titles, or commentary. Start immediately with the document content.",
      "You are an expert OCR and document reconstruction specialist. Your only task is to replicate the input document's text and basic layout perfectly. Never add your own labels or branding."
    );
  }

  async chatWithDocument(fileName: string, base64Data: string, mimeType: string, question: string): Promise<string> {
    return this.processDocument(
      fileName,
      base64Data,
      mimeType,
      `Question about this document: ${question}`,
      "You are an AI assistant answering questions strictly based on the provided file."
    );
  }
}

export const geminiService = new GeminiService();
