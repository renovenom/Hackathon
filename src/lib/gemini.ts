import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export type ModelType = "V3" | "R1" | "Lite" | "Pro" | "Flash8B";

export async function* generateChatResponse(
  messages: { role: "user" | "model"; parts: { text: string }[] }[],
  modelType: ModelType,
  temperature: number = 0.7,
  topP: number = 0.95,
  maxOutputTokens?: number,
  useSearch?: boolean
) {
  let modelName = "gemini-3-flash-preview";

  if (modelType === "R1" || modelType === "Pro") {
    modelName = "gemini-3.1-pro-preview";
  } else if (modelType === "Lite") {
    modelName = "gemini-3.1-flash-lite-preview";
  } else if (modelType === "Flash8B") {
    modelName = "gemini-3-flash-8b-preview";
  }

  // Use process.env for the real key inside AI Studio
  const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Please set it in your environment.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const formattedMessages = messages.map(m => ({
    role: m.role,
    parts: m.parts,
  }));

  try {
    const responseStream = await ai.models.generateContentStream({
      model: modelName,
      contents: formattedMessages,
      config: {
        tools: useSearch ? [{ googleSearch: {} }] : undefined,
        systemInstruction: modelType === "R1" 
          ? "You are an elite hacking, cybersecurity, and coding assistant named Hackathon. Your primary goal is to help users learn hacking, write code, debug systems, and understand cybersecurity concepts. Always provide secure, educational, and highly technical responses. For any factual, coding, or analytical queries, analyze step-by-step. You MUST wrap your detailed internal chain-of-thought reasoning and intermediate steps inside <reasoning>...</reasoning> XML tags before giving the final answer."
          : "You are an elite hacking, cybersecurity, and coding assistant named Hackathon. Your primary goal is to help users learn hacking, write code, debug systems, and understand cybersecurity concepts. Always provide secure, educational, and highly technical responses. For any factual, coding, or analytical queries, analyze step-by-step and provide the most accurate possible answer.",
        temperature: modelType === "R1" ? undefined : temperature,
        topP: modelType === "R1" ? undefined : topP,
        maxOutputTokens: maxOutputTokens,
      }
    });

    for await (const chunk of responseStream) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        yield { text: c.text };
      }
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

