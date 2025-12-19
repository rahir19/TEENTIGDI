
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private getAI() {
    // Creating a fresh instance to ensure the latest API key is used.
    // Always use process.env.API_KEY string directly as per guidelines.
    return new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  async processDocument(
    fileName: string, 
    base64Data: string, 
    mimeType: string, 
    taskPrompt: string,
    systemInstruction: string
  ): Promise<string> {
    try {
      const ai = this.getAI();
      // Using gemini-3-pro-preview for complex reasoning tasks as per guidelines.
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            },
            {
              text: taskPrompt,
            },
          ],
        },
        config: {
          systemInstruction: systemInstruction + " IMPORTANT: You are a Hinglish-expert AI. You perfectly understand Hindi, English, and Hinglish. If the user gives instructions in Hinglish (e.g., 'iska summary kar do', 'bhai text nikaal de'), you must execute them flawlessly. Always reply in a mix of English and Hindi (Hinglish) to keep it friendly.",
          temperature: 0.7,
        },
      });
      // Directly accessing the .text property as per guidelines.
      return response.text || "Sorry, koi output generate nahi ho paya.";
    } catch (error: any) {
      console.error("Trio AI processing error:", error);
      if (error?.message?.includes("entity was not found")) {
        return "ERROR_KEY_NOT_FOUND";
      }
      return "Arre! Trio AI ko thodi dikkat ho rahi hai. Kripya check karein ki file sahi hai ya internet theek chal raha hai. (Trio AI error: " + (error.message || "Unknown error") + ")";
    }
  }

  async summarizeDocument(fileName: string, base64Data: string, mimeType: string): Promise<string> {
    return this.processDocument(
      fileName,
      base64Data,
      mimeType,
      "Summarize this document clearly in Hinglish.",
      "You are a professional document summarizer."
    );
  }

  async convertToEditable(fileName: string, base64Data: string, mimeType: string): Promise<string> {
    return this.processDocument(
      fileName,
      base64Data,
      mimeType,
      "Extract and transcribe all text from this document accurately.",
      "You are an expert OCR specialist."
    );
  }

  async chatWithDocument(fileName: string, base64Data: string, mimeType: string, question: string): Promise<string> {
    return this.processDocument(
      fileName,
      base64Data,
      mimeType,
      `User Question: ${question}`,
      "You are an AI assistant for Teen Tigdi. Answer strictly based on the provided file in a helpful Hinglish tone."
    );
  }
}

export const geminiService = new GeminiService();
