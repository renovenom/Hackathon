import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export type ModelType = "V3" | "R1" | "Lite";

export async function* generateChatResponse(
  messages: { role: "user" | "model"; parts: { text: string }[] }[],
  modelType: ModelType,
  temperature: number = 0.7,
  topP: number = 0.95,
  maxOutputTokens?: number
) {
  let modelName = "gemini-3-flash-preview";

  if (modelType === "R1") {
    modelName = "gemini-3.1-pro-preview";
  } else if (modelType === "Lite") {
    modelName = "gemini-3.1-flash-lite-preview";
  }

  // Use process.env for the real key inside AI Studio
  const apiKey = process.env.GEMINI_API_KEY;
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
        temperature: modelType === "R1" ? undefined : temperature,
        topP: modelType === "R1" ? undefined : topP,
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

