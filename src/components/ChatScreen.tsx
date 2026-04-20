import React, { useState, useRef, useEffect } from "react";
import { Message, ModelType } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { Menu, MessageSquarePlus, Zap, Diamond, Brain, Globe, PlusCircle, ArrowUp, Mic, Feather, Eye, EyeOff, Download, Eraser, Bold, Italic, Code } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { ModelSelector } from "./ModelSelector";

interface ChatScreenProps {
  messages: Message[];
  isGenerating: boolean;
  onSendMessage: (text: string, modelOverride?: ModelType, useSearch?: boolean) => void;
  onOpenSidebar: () => void;
  onNewChat: () => void;
  onClearChat: () => void;
  onExportChat: () => void;
  currentModel: ModelType;
  onModelChange: (model: ModelType) => void;
  language: string;
  hapticFeedback: boolean;
  showReasoningDefault: boolean;
  onUpdateShowReasoningDefault: (val: boolean) => void;
  reusedPrompt: string;
  onPromptReused: () => void;
}

export function ChatScreen({
  messages,
  isGenerating,
  onSendMessage,
  onOpenSidebar,
  onNewChat,
  onClearChat,
  onExportChat,
  currentModel,
  onModelChange,
  language,
  hapticFeedback,
  showReasoningDefault,
  onUpdateShowReasoningDefault,
  reusedPrompt,
  onPromptReused
}: ChatScreenProps) {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [modelSwitchCue, setModelSwitchCue] = useState<{ visible: boolean, name: string } | null>(null);
  const prevModelRef = useRef<ModelType>(currentModel);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prevModelRef.current !== currentModel) {
      // Model changed, trigger cue
      const names: Record<string, string> = {
        V3: "Gemini-Flash",
        R1: "Gemini-Advanced",
        Lite: "Gemini-Lite"
      };
      
      setModelSwitchCue({ visible: true, name: names[currentModel] || "Gemini" });
      
      const timer = setTimeout(() => {
        setModelSwitchCue(prev => prev ? { ...prev, visible: false } : null);
      }, 1500);
      
      prevModelRef.current = currentModel;
      
      return () => clearTimeout(timer);
    }
  }, [currentModel]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const t = useTranslation(language);

  // Map local state to the parent's model
  const chatMode = currentModel === "V3" ? "instant" : "expert";

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setInput((prev) => prev + (prev.length > 0 ? ' ' : '') + finalTranscript);
            if (textareaRef.current) {
              textareaRef.current.style.height = "auto";
              textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
            }
          }
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, []);

  const toggleRecording = () => {
    triggerHaptic();
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsRecording(true);
      } else {
        alert("Speech recognition is not supported in this browser.");
      }
    }
  };

  const triggerHaptic = () => {
    if (!hapticFeedback) return;
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    } else {
      // Subtle visual cue for web
      if (textareaRef.current) {
        textareaRef.current.style.transform = 'scale(0.99)';
        setTimeout(() => {
          if (textareaRef.current) textareaRef.current.style.transform = 'scale(1)';
        }, 50);
      }
    }
  };

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  };

  useEffect(() => {
    scrollToBottom(!isGenerating);
  }, [messages, isGenerating]);

  useEffect(() => {
    if (reusedPrompt) {
      setInput(reusedPrompt);
      onPromptReused();
      if (textareaRef.current) {
        textareaRef.current.focus();
        // Adjust height
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
          }
        }, 0);
      }
    }
  }, [reusedPrompt, onPromptReused]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleSend = () => {
    if (input.trim() && !isGenerating) {
      triggerHaptic();
      let modelOverride: ModelType | undefined;
      // If "Think" is enabled, ensure we use R1 model
      if (isThinking && currentModel !== "R1") {
        onModelChange("R1");
        modelOverride = "R1";
      }
      onSendMessage(input.trim(), modelOverride, isSearch);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#131314] text-[#1F1F1F] dark:text-[#E3E3E3] relative overflow-hidden transition-colors duration-300">
      {/* Model Switch Overlay */}
      <AnimatePresence>
        {modelSwitchCue?.visible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 z-50 pointer-events-none flex justify-center w-full"
          >
            <div className="bg-white/95 dark:bg-[#1e1e24]/95 shadow-lg backdrop-blur-sm rounded-full px-5 py-2.5 flex items-center gap-2 border border-blue-100/50 dark:border-blue-900/30">
              <Brain className="text-blue-500 w-4 h-4 animate-pulse" />
              <div className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                {modelSwitchCue.name} Activated
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#131314] z-10 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <button onClick={onOpenSidebar} className="p-2 -ml-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1e1e24] shadow-sm rounded-full transition-colors">
            <Menu size={24} strokeWidth={1.5} />
          </button>
          {(currentModel === 'R1' || currentModel === 'Lite') && (
            <button 
              onClick={() => setIsModelSelectorOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/50 dark:bg-[#1e1e24] border border-blue-100 dark:border-[#2a2a35] text-xs font-semibold text-blue-700 dark:text-blue-300 shadow-sm"
            >
              {currentModel === 'R1' ? <Zap size={14} className="text-blue-500" /> : <Feather size={14} className="text-sky-500" />}
              Gemini-{currentModel === 'R1' ? 'Advanced' : 'Flash'}
            </button>
          )}
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <>
              <button onClick={onExportChat} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1e1e24] rounded-full transition-colors">
                <Download size={20} strokeWidth={1.5} />
              </button>
              <button onClick={onClearChat} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1e1e24] rounded-full transition-colors">
                <Eraser size={20} strokeWidth={1.5} />
              </button>
            </>
          )}
          <button onClick={onNewChat} className="p-2 -mr-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1e1e24] rounded-full transition-colors">
            <MessageSquarePlus size={24} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scroll-smooth bg-white dark:bg-transparent">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center -mt-10 px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full max-w-2xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-2 gemini-gradient">
                {t("Hello, there")}
              </h1>
              <h2 className="text-3xl md:text-4xl font-medium text-gray-400 dark:text-[#5f6368] mb-12">
                {t("How can I help you today?")}
              </h2>
              
              {/* Suggestion Chips */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                <button 
                  onClick={() => onSendMessage("What's the weather like?", undefined, false)}
                  className="flex flex-col text-left gap-2 p-4 rounded-2xl bg-[#F0F4F9] dark:bg-[#1e1e24] hover:bg-[#e8edf2] dark:hover:bg-[#2a2a35] transition-colors border border-transparent"
                >
                  <Globe className="text-sky-500" size={24} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Check weather</span>
                </button>
                <button 
                  onClick={() => onSendMessage("Help me write an email...", undefined, false)}
                  className="flex flex-col text-left gap-2 p-4 rounded-2xl bg-[#F0F4F9] dark:bg-[#1e1e24] hover:bg-[#e8edf2] dark:hover:bg-[#2a2a35] transition-colors border border-transparent"
                >
                  <Feather className="text-blue-500" size={24} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Draft an email</span>
                </button>
                <button 
                  onClick={() => onSendMessage("Explain quantum computing to a 5 year old", undefined, false)}
                  className="flex flex-col text-left gap-2 p-4 rounded-2xl bg-[#F0F4F9] dark:bg-[#1e1e24] hover:bg-[#e8edf2] dark:hover:bg-[#2a2a35] transition-colors border border-transparent md:col-span-1"
                >
                  <Brain className="text-purple-500" size={24} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Explain a concept</span>
                </button>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto p-4 pb-8">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} showReasoningDefault={showReasoningDefault} />
            ))}
            {isGenerating && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-blue-500 dark:text-sky-400 text-sm p-4 px-6 md:px-0"
              >
                <div className="flex gap-1">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-blue-500 dark:bg-sky-400 rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-500 dark:bg-sky-400 rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-500 dark:bg-sky-400 rounded-full" />
                </div>
                <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  {t("Working on it...")}
                </motion.span>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-transparent transition-colors duration-300">
        <div className="max-w-4xl mx-auto bg-[#F0F4F9] dark:bg-[#1e1e24] md:rounded-[32px] rounded-3xl p-3 flex flex-col gap-2 shadow-sm border border-transparent dark:border-[#2a2a35] transition-colors duration-300">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={t("Enter a prompt here")}
            className="bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none outline-none px-4 py-3 text-[1.05rem] transition-transform duration-75"
            rows={1}
          />
          <div className="flex justify-between items-center px-2">
            <div className="flex gap-2 items-center flex-wrap">
              <button 
                onClick={() => { 
                  triggerHaptic(); 
                  const newIsThinking = !isThinking;
                  setIsThinking(newIsThinking); 
                  if (newIsThinking && currentModel !== 'R1') {
                    onModelChange('R1');
                  }
                }}
                className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border", isThinking ? "border-transparent bg-blue-50 dark:bg-sky-900/40 text-blue-600 dark:text-sky-300 ring-1 ring-blue-500/30" : "border-gray-200 dark:border-[#2a2a35] bg-white dark:bg-[#131314] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200")}
              >
                <Brain size={16} /> {t("Deep Think")}
              </button>
              
              <button
                onClick={() => { triggerHaptic(); onUpdateShowReasoningDefault(!showReasoningDefault); }}
                className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border", showReasoningDefault ? "border-transparent bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 ring-1 ring-purple-500/30" : "border-gray-200 dark:border-[#2a2a35] bg-white dark:bg-[#131314] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200")}
                title={showReasoningDefault ? "Hide Reasoning" : "Show Reasoning"}
              >
                {showReasoningDefault ? <Eye size={16} /> : <EyeOff size={16} />} 
                <span className="hidden sm:inline">{showReasoningDefault ? t("Hide Reasoning") : t("Show Reasoning")}</span>
              </button>

              <button 
                onClick={() => { triggerHaptic(); setIsSearch(!isSearch); }}
                className={cn("flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm font-medium transition-colors", isSearch ? "border-transparent text-blue-600 bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-500/30" : "border-gray-200 dark:border-[#2a2a35] hover:bg-white dark:hover:bg-[#131314] text-gray-600 dark:text-gray-400")}
              >
                <Globe size={16} /> {t("Search")}
              </button>
            </div>
            <div className="flex gap-2 text-gray-600 dark:text-gray-400 items-center pr-1">
              <label className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                <input type="file" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setInput((prev) => prev + `[Uploaded File: ${file.name}] `);
                    if (textareaRef.current) {
                      textareaRef.current.focus();
                    }
                  }
                }} />
                <PlusCircle size={22} strokeWidth={1.5} />
              </label>
              {!input.trim() && (
                <button 
                  onClick={toggleRecording}
                  className={cn("transition-colors p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10", isRecording ? "text-blue-500 dark:text-sky-400 animate-pulse bg-blue-50 dark:bg-blue-900/30" : "hover:text-gray-900 dark:hover:text-white")}
                >
                  <Mic size={22} strokeWidth={1.5} />
                </button>
              )}
              {input.trim() && (
                <button 
                  onClick={handleSend}
                  disabled={isGenerating}
                  className="p-2 ml-1 cursor-pointer bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
                  aria-label="Send message"
                >
                  <ArrowUp size={20} strokeWidth={2} />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="text-center mt-3 text-xs text-gray-500 dark:text-gray-400">
          Gemini can make mistakes, so double-check it.
        </div>
      </div>

      <ModelSelector 
        isOpen={isModelSelectorOpen}
        onClose={() => setIsModelSelectorOpen(false)}
        currentModel={currentModel}
        onSelectModel={(model) => { triggerHaptic(); onModelChange(model); }}
      />
    </div>
  );
}
