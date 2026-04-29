import React from "react";
import { ModelType } from "@/types";
import { motion, AnimatePresence } from "motion/react";
import { Check, Zap, Brain, Feather, Cpu, Code, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: ModelType;
  onSelectModel: (model: ModelType) => void;
}

export function ModelSelector({ isOpen, onClose, currentModel, onSelectModel }: ModelSelectorProps) {
  const models: { id: ModelType; name: string; description: string; strengths: string[]; useCases: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: "V3",
      name: "Hackathon-Flash",
      description: "Balanced model for everyday logic and rapid execution. Designed for robust chat experience.",
      strengths: ["Broad general training", "Advanced coding generation", "Natural conversation flow"],
      useCases: "General queries, app generation, creative writing, casual discussions.",
      icon: <Brain size={20} className="text-blue-500" />,
      badge: "Standard"
    },
    {
      id: "R1",
      name: "Hackathon-Advanced",
      description: "Deep structural analysis engine. Visualizes its internal 'Chain of Thought' directly in the UI before answering.",
      strengths: ["Transparent thinking process", "Complex mathematical proofs", "Surgical problem-solving"],
      useCases: "Debugging legacy software, complex puzzles, PhD-level analytics, multi-step planning.",
      icon: <BrainCircuit size={20} className="text-purple-500" />,
      badge: "Pro"
    },
    {
      id: "Lite",
      name: "Hackathon-Lite",
      description: "Streamlined infrastructure optimized for pure speed and ultra low-latency environments.",
      strengths: ["Instant TTFT (Time-To-First-Token)", "Minimal cost logic", "High concurrent speed"],
      useCases: "Quick questions, translations, summaries, rapid rapid-fire texting.",
      icon: <Zap size={20} className="text-sky-500" />,
      badge: "Fast"
    },
    {
      id: "Pro",
      name: "Hackathon-Pro",
      description: "The most capable model for highly complex tasks. Deep reasoning, math, and code.",
      strengths: ["Intelligent multi-step reasoning", "Advanced instructions", "High reliability"],
      useCases: "Advanced coding, complex logic puzzles, extensive creative generation.",
      icon: <BrainCircuit size={20} className="text-indigo-500" />,
      badge: "Capable"
    },
    {
      id: "Flash8B",
      name: "Hackathon-Flash-8B",
      description: "High volume cost-effective model for mass deployment.",
      strengths: ["Ultra low cost", "High rate limits", "Good standard logic"],
      useCases: "Classification, sentiment analysis, basic extraction.",
      icon: <Check size={20} className="text-green-500" />,
      badge: "Efficient"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
            className="fixed bottom-0 left-0 right-0 bg-[#F0F4F9] dark:bg-[#131314] rounded-t-[32px] z-50 pb-8 pt-2 px-4 shadow-2xl md:max-w-xl md:mx-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:rounded-3xl border border-transparent dark:border-[#2a2a35]"
          >
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-[#2a2a35] rounded-full mx-auto mb-6 md:hidden" />
            
            <div className="flex items-center gap-2 mb-6 px-2">
              <Cpu size={22} className="text-gray-900 dark:text-white" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Choose a Model</h3>
            </div>
            
            <div className="space-y-4">
              {models.map(model => {
                const isSelected = currentModel === model.id;
                return (
                  <button
                    key={model.id}
                    onClick={() => { onSelectModel(model.id); onClose(); }}
                    className={cn(
                      "w-full flex items-start gap-4 p-5 rounded-3xl transition-all text-left relative border group",
                      isSelected 
                        ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-500/30 shadow-sm" 
                        : "bg-white dark:bg-[#1e1e24] border border-transparent dark:border-[#2a2a35] hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm"
                    )}
                  >
                    <div className={cn(
                      "mt-0.5 p-3 rounded-2xl shrink-0 transition-colors",
                      isSelected ? "bg-blue-100 dark:bg-blue-500/20" : "bg-[#F0F4F9] dark:bg-black/20 group-hover:bg-blue-50 dark:group-hover:bg-white/5"
                    )}>
                      {model.icon}
                    </div>
                    <div className="flex-1 pr-6">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={cn("font-bold text-[1.0625rem]", isSelected ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-white")}>
                          {model.name}
                        </span>
                        {model.badge && (
                          <span className={cn(
                            "text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full",
                            isSelected ? "bg-blue-200 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200" : "bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300"
                          )}>
                            {model.badge}
                          </span>
                        )}
                      </div>
                      <p className={cn("text-[0.9375rem] mb-3 leading-relaxed", isSelected ? "text-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-400")}>
                        {model.description}
                      </p>
                      
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className={cn("font-semibold", isSelected ? "text-blue-900 dark:text-blue-300" : "text-gray-700 dark:text-gray-300")}>Core Strengths:</span>
                          <ul className={cn("mt-1 space-y-1 list-disc list-inside", isSelected ? "text-blue-800 dark:text-gray-400" : "text-gray-500")}>
                            {model.strengths.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                        <div className="mt-2.5 bg-black/5 dark:bg-black/20 p-2.5 rounded-xl border border-black/5 dark:border-white/5">
                          <span className={cn("font-semibold block mb-1", isSelected ? "text-blue-900 dark:text-blue-300" : "text-gray-700 dark:text-gray-300")}>Ideal for:</span> 
                          <span className={cn("leading-relaxed", isSelected ? "text-blue-800 dark:text-gray-400" : "text-gray-500")}>{model.useCases}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={cn(
                      "absolute right-5 top-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                      isSelected 
                        ? "border-blue-500 bg-blue-500" 
                        : "border-gray-300 dark:border-gray-600"
                    )}>
                      {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
