import { ModelType } from "./lib/gemini";

export type { ModelType };

export interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: number;
  model?: ModelType;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
  model: ModelType;
}

export interface ModelPreferences {
  temperature: number;
  topP: number;
  maxTokens: number;
}

export interface AppSettings {
  theme: "system" | "light" | "dark";
  fontSize: "small" | "medium" | "large";
  defaultModel: ModelType;
  temperature: number; // legacy global
  topP: number;        // legacy global
  maxTokens: number;   // legacy global
  modelPreferences: Record<ModelType, ModelPreferences>;
  showReasoningDefault: boolean;
  hapticFeedback: boolean;
  language: string;
  appearance: "Light" | "Dark" | "System";
  uiFontSize: "Small" | "Medium" | "Large";
  mainLanguage: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: "dark",
  fontSize: "medium",
  defaultModel: "V3",
  temperature: 0.7,
  topP: 0.95,
  maxTokens: 4096,
  modelPreferences: {
    V3: { temperature: 0.7, topP: 0.95, maxTokens: 4096 },
    R1: { temperature: 0.7, topP: 0.95, maxTokens: 8192 },
    Lite: { temperature: 0.7, topP: 0.95, maxTokens: 2048 },
    Pro: { temperature: 0.7, topP: 0.95, maxTokens: 8192 },
    Flash8B: { temperature: 0.7, topP: 0.95, maxTokens: 4096 },
  },
  showReasoningDefault: true,
  hapticFeedback: true,
  language: "English",
  appearance: "Dark",
  uiFontSize: "Medium",
  mainLanguage: "Use App language",
};
