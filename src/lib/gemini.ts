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
    modelName = "gemini-3.1-flash-lite-preview"; // 8b is deprecated
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
    const config: any = {
      tools: useSearch ? [{ googleSearch: {} }] : undefined,
      systemInstruction: modelType === "R1" 
        ? "You are an elite hacking, cybersecurity, and coding assistant named Hackathon. Your primary goal is to help users learn hacking, write code, debug systems, and understand cybersecurity concepts. Always provide secure, educational, and highly technical responses. For any factual, coding, or analytical queries, analyze step-by-step. You MUST wrap your detailed internal chain-of-thought reasoning and intermediate steps inside <reasoning>...</reasoning> XML tags before giving the final answer."
        : "You are an elite hacking, cybersecurity, and coding assistant named Hackathon. Your primary goal is to help users learn hacking, write code, debug systems, and understand cybersecurity concepts. Always provide secure, educational, and highly technical responses. For any factual, coding, or analytical queries, analyze step-by-step and provide the most accurate possible answer."
    };

    if (modelType !== "R1") {
      if (temperature !== undefined) config.temperature = temperature;
      if (topP !== undefined) config.topP = topP;
    }

    const responseStream = await ai.models.generateContentStream({
      model: modelName,
      contents: formattedMessages,
      config: config
    });

    for await (const chunk of responseStream) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        yield { text: c.text };
      }
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    let errorMessage = "An unexpected error occurred while communicating with the AI.";
    const errString = error?.message || String(error);

    if (errString.includes("404") || errString.includes("NOT_FOUND")) {
      errorMessage = "The requested AI model was not found. It may be temporarily unavailable or deprecated.";
    } else if (errString.includes("403") || errString.includes("PERMISSION_DENIED")) {
      errorMessage = "API key lacks sufficient permissions. Please verify your API key access scopes.";
    } else if (errString.includes("400") || errString.includes("INVALID_ARGUMENT") || errString.includes("API key not valid")) {
      errorMessage = "Invalid API key provided. Please check your AI model settings.";
    } else if (errString.includes("429") || errString.includes("quota") || errString.includes("RESOURCE_EXHAUSTED")) {
      errorMessage = "API quota exceeded. Please try again later or check your billing plan.";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error?.status) {
      errorMessage = `API Error (${error.status}): ${error.message}`;
    }

    throw new Error(errorMessage);
  }
}

