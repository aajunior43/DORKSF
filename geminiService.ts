
import { GoogleGenAI, Type } from "@google/genai";
import { DorkResult } from "./types.ts";

// Always initialize with process.env.API_KEY as a named parameter
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDorks = async (userIntent: string): Promise<DorkResult[]> => {
  // Alterado para gemini-3-flash-preview para melhor disponibilidade e latência
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Intenção de busca do usuário: "${userIntent}"
    
    Aja como um especialista em OSINT e Cibersegurança. Gere exatamente 5 Google Dorks altamente eficazes com base na intenção de busca do usuário. 
    Cada dork deve ser único e utilizar operadores avançados (site:, filetype:, intitle:, inurl:, etc.).
    
    A resposta deve ser estritamente no formato JSON solicitado.
    IMPORTANTE: Forneça a explicação OBRIGATORIAMENTE em Português do Brasil (pt-BR).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            query: { type: Type.STRING, description: 'A string de busca do Google dork.' },
            explanation: { type: Type.STRING, description: 'Explicação curta do que este dork encontra.' },
            category: { 
              type: Type.STRING, 
              enum: ['Configuration', 'Documents', 'Database', 'Sensitive Info', 'Login Pages', 'General'] 
            },
            riskLevel: { 
              type: Type.STRING, 
              enum: ['Low', 'Medium', 'High'] 
            }
          },
          propertyOrdering: ["query", "explanation", "category", "riskLevel"],
        }
      }
    }
  });

  try {
    const text = response.text || '[]';
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Erro ao analisar resposta do Gemini:", error);
    throw new Error("Falha ao gerar dorks. Por favor, tente novamente.");
  }
};
