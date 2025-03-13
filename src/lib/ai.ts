import { GoogleGenerativeAI } from "@google/generative-ai";

// Create a singleton instance of Google AI client
export const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_KEY);

// Get a model with default parameters
export function getAIModel(modelName = "gemini-1.5-flash") {
  return genAI.getGenerativeModel({ 
    model: modelName,
    generationConfig: {
      temperature: 0.3,
      topK: 1,
      topP: 1,
    }
  });
}