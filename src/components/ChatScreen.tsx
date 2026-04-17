import React, { useState, useRef, useEffect } from "react";
import { Message, ModelType } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { Menu, MessageSquarePlus, Zap, Diamond, Brain, Globe, PlusCircle, ArrowUp, Radio, Feather, Eye, EyeOff, Download, Eraser } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { ModelSelector } from "./ModelSelector";

interface ChatScreenProps {
  messages: Message[];
  isGenerating: boolean;
  onSendMessage: (text: string, modelOverride?: ModelType) => void;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const t = useTranslation(language);

  // Map local state to the parent's model
  const chatMode = currentModel === "V3" ? "instant" : "expert";

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
      onSendMessage(input.trim(), modelOverride);
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
    <div className="flex flex-col h-full bg-[#F5F5F7] dark:bg-[#0A0A0A] text-gray-900 dark:text-[#EAEAEF] relative overflow-hidden transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#F5F5F7] dark:bg-[#0A0A0A] z-10 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <button onClick={onOpenSidebar} className="p-2 -ml-2 text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-[#1C1C1E] rounded-full transition-colors">
            <Menu size={24} strokeWidth={1.5} />
          </button>
          {(currentModel === 'R1' || currentModel === 'Lite') && (
            <button 
              onClick={() => setIsModelSelectorOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-[#1C1C1E] border border-gray-200 dark:border-[#2A2A35] text-xs font-medium text-gray-600 dark:text-gray-300 shadow-sm"
            >
              {currentModel === 'R1' ? <Zap size={12} className="text-purple-500" /> : <Feather size={12} className="text-green-500" />}
              Venom-{currentModel === 'R1' ? 'Reasoner' : 'Lite'}
            </button>
          )}
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <>
              <button onClick={onExportChat} className="p-2 text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-[#1C1C1E] rounded-full transition-colors" title={t("Export Chat")}>
                <Download size={20} strokeWidth={1.5} />
              </button>
              <button onClick={onClearChat} className="p-2 text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-[#1C1C1E] rounded-full transition-colors" title={t("Clear Chat")}>
                <Eraser size={20} strokeWidth={1.5} />
              </button>
            </>
          )}
          <button onClick={onNewChat} className="p-2 -mr-2 text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-[#1C1C1E] rounded-full transition-colors" title={t("New Chat")}>
            <MessageSquarePlus size={24} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 pb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="text-red-500">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17.5 13.5C16.67 13.5 16 12.83 16 12C16 11.17 16.67 10.5 17.5 10.5C18.33 10.5 19 11.17 19 12C19 12.83 18.33 13.5 17.5 13.5ZM12 18C8.69 18 6 15.31 6 12C6 11.66 6.04 11.33 6.11 11.01C7.62 12.23 9.68 13 12 13C14.32 13 16.38 12.23 17.89 11.01C17.96 11.33 18 11.66 18 12C18 15.31 15.31 18 12 18Z" />
                </svg>
              </div>
              <h2 className="text-[1.375rem] font-bold text-gray-900 dark:text-white">{t("Bond with Venom")} {t(chatMode === 'instant' ? 'Instant' : 'Expert')}</h2>
            </div>
            
            <div className="flex bg-white dark:bg-[#1C1C1E] rounded-full p-1 w-full max-w-[320px] mb-4 border border-gray-200 dark:border-[#2A2A35] shadow-sm dark:shadow-none transition-colors duration-300">
              <button 
                onClick={() => { triggerHaptic(); onModelChange('V3'); }}
                className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-medium transition-colors text-[0.9375rem]", chatMode === 'instant' ? "bg-gray-100 dark:bg-[#2A2A35] text-red-500" : "text-gray-500 dark:text-gray-400")}
              >
                <Zap size={18} fill={chatMode === 'instant' ? "currentColor" : "none"} /> {t("Instant")}
              </button>
              <button 
                onClick={() => { triggerHaptic(); onModelChange('R1'); }}
                className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-medium transition-colors text-[0.9375rem]", chatMode === 'expert' ? "bg-gray-100 dark:bg-[#2A2A35] text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400")}
              >
                <Diamond size={18} /> {t("Expert")}
              </button>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-[0.9375rem]">
              {t(chatMode === 'instant' ? 'Instant responses for daily conversations' : 'Advanced reasoning for complex tasks')}
            </p>
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
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm p-4"
              >
                <div className="flex gap-1">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                </div>
                <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  {t("Thinking...")}
                </motion.span>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#F5F5F7] dark:bg-[#0A0A0A] transition-colors duration-300">
        <div className="max-w-3xl mx-auto bg-white dark:bg-[#1C1C1E] rounded-[28px] p-3 flex flex-col gap-3 shadow-sm dark:shadow-none border border-gray-200 dark:border-transparent transition-colors duration-300">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={t("Type a message or hold to speak")}
            className="bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none outline-none px-2 py-1 text-base transition-transform duration-75"
            rows={1}
          />
          <div className="flex justify-between items-center px-1">
            <div className="flex gap-2 items-center">
              <div className="flex items-center bg-gray-50 dark:bg-[#2A2A35]/50 rounded-full p-0.5 border border-gray-200 dark:border-[#3A3A45]">
                <button 
                  onClick={() => { 
                    triggerHaptic(); 
                    const newIsThinking = !isThinking;
                    setIsThinking(newIsThinking); 
                    if (newIsThinking && currentModel !== 'R1') {
                      onModelChange('R1');
                    }
                  }}
                  className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-colors", isThinking ? "bg-white dark:bg-[#3A3A45] text-red-500 shadow-sm ring-1 ring-red-500/20" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300")}
                >
                  <Brain size={16} /> {t("Think")}
                </button>
                {isThinking && (
                  <button
                    onClick={() => { triggerHaptic(); onUpdateShowReasoningDefault(!showReasoningDefault); }}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    title={showReasoningDefault ? "Hide reasoning by default" : "Show reasoning by default"}
                  >
                    {showReasoningDefault ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                )}
              </div>
              <button 
                onClick={() => { triggerHaptic(); setIsSearch(!isSearch); }}
                className={cn("flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm font-medium transition-colors", isSearch ? "border-red-500 text-red-500 bg-red-500/10" : "border-gray-200 dark:border-[#3A3A45] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2A2A35]")}
              >
                <Globe size={16} /> {t("Search")}
              </button>
            </div>
            <div className="flex gap-3 text-gray-400 items-center pr-1">
              {input.trim() ? (
                <button 
                  onClick={handleSend}
                  disabled={isGenerating}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <ArrowUp size={20} />
                </button>
              ) : (
                <>
                  <button className="hover:text-gray-600 dark:hover:text-white transition-colors"><PlusCircle size={24} strokeWidth={1.5} /></button>
                  <button className="hover:text-gray-600 dark:hover:text-white transition-colors"><Radio size={24} strokeWidth={1.5} /></button>
                </>
              )}
            </div>
          </div>
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
