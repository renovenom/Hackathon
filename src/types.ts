import { ModelType } from "./lib/gemini";

export type { ModelType };

export interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
  model: ModelType;
}

export interface AppSettings {
  theme: "system" | "light" | "dark";
  fontSize: "small" | "medium" | "large";
  defaultModel: ModelType;
  temperature: number;
  topP: number;
  maxTokens: number;
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
  showReasoningDefault: true,
  hapticFeedback: true,
  language: "English",
  appearance: "Dark",
  uiFontSize: "Medium",
  mainLanguage: "Use App language",
};
