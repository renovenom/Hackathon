import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const resp = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: "Hello",
      config: {
        maxOutputTokens: undefined,
      }
    });
    console.log("3.1-pro-preview works");
  } catch (e) {
    console.error("pro failed:", e);
  }

  try {
    const resp2 = await ai.models.generateContent({
      model: "gemini-3-flash-8b-preview",
      contents: "Hello"
    });
    console.log("8b works");
  } catch (e) {
    console.error("8b failed:", e);
  }
}
run();
