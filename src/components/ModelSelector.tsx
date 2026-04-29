import React, { useState } from "react";
import { ModelType } from "@/types";
import { motion, AnimatePresence } from "motion/react";
import { Check, Zap, Brain, Feather, Cpu, Code, BrainCircuit, BarChart2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: ModelType;
  onSelectModel: (model: ModelType) => void;
}

export function ModelSelector({ isOpen, onClose, currentModel, onSelectModel }: ModelSelectorProps) {
  const [showComparison, setShowComparison] = useState(false);

  const models = [
    {
      id: "V3" as ModelType,
      name: "Hackathon-Flash",
      description: "Fast, versatile model for everyday everyday tasks.",
      tip: "Best default choice for 90% of user queries.",
      metrics: { speed: 90, capability: 75, context: 80 },
      strengths: ["Fast response time", "Strong general knowledge", "Fluid conversation flow"],
      useCases: "General chat, drafting emails, simple coding, brainstorming.",
      icon: <Brain size={20} className="text-blue-500" />,
      badge: "Standard"
    },
    {
      id: "R1" as ModelType,
      name: "Hackathon-Advanced",
      description: "Deep reasoning model that visualizes its thought process.",
      tip: "Use when you need transparent, step-by-step logic.",
      metrics: { speed: 50, capability: 95, context: 85 },
      strengths: ["Transparent thinking", "Math & logic proofs", "Surgical problem-solving"],
      useCases: "Debugging, complex puzzles, analytics, academic writing.",
      icon: <BrainCircuit size={20} className="text-purple-500" />,
      badge: "Pro"
    },
    {
      id: "Lite" as ModelType,
      name: "Hackathon-Lite",
      description: "Ultra low-latency model optimized for instant responses.",
      tip: "Best for quick, simple tasks where speed is paramount.",
      metrics: { speed: 100, capability: 60, context: 70 },
      strengths: ["Instant Time-To-First-Token", "Highly efficient", "Responsive feel"],
      useCases: "Quick facts, translation, summarizing short texts.",
      icon: <Zap size={20} className="text-sky-500" />,
      badge: "Fast"
    },
    {
      id: "Pro" as ModelType,
      name: "Hackathon-Pro",
      description: "Highest capability for tackling complex, multi-step problems.",
      tip: "Choose for heavy lifting in coding or deep analysis.",
      metrics: { speed: 60, capability: 100, context: 95 },
      strengths: ["Advanced reasoning", "Complex coding tasks", "Highest reliability"],
      useCases: "Advanced coding, architecture design, deep research.",
      icon: <BrainCircuit size={20} className="text-indigo-500" />,
      badge: "Capable"
    },
    {
      id: "Flash8B" as ModelType,
      name: "Hackathon-Flash-8B",
      description: "Efficient model ideal for repetitive, high-volume tasks.",
      tip: "Use for basic extraction and classification on a budget.",
      metrics: { speed: 85, capability: 65, context: 75 },
      strengths: ["Ultra low cost", "High concurrency", "Good standard logic"],
      useCases: "Classification, sentiment analysis, data formatting.",
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
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
            className="fixed inset-x-0 bottom-0 bg-[#F0F4F9] dark:bg-[#131314] rounded-t-[32px] z-50 pt-2 pb-6 px-4 shadow-2xl md:max-w-3xl md:mx-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:rounded-3xl border border-transparent dark:border-[#2a2a35] max-h-[90vh] overflow-y-auto"
          >
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-[#2a2a35] rounded-full mx-auto mb-4 md:hidden" />
            
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <Cpu size={22} className="text-gray-900 dark:text-white" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Choose a Model</h3>
              </div>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                <BarChart2 size={16} />
                {showComparison ? "Hide Comparison" : "Compare Metrics"}
              </button>
            </div>
            
            <div className="space-y-3">
              {models.map(model => {
                const isSelected = currentModel === model.id;
                return (
                  <div key={model.id} className={cn(
                    "flex flex-col border rounded-3xl transition-all relative group overflow-hidden",
                    isSelected 
                      ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-500/30 shadow-sm" 
                      : "bg-white dark:bg-[#1e1e24] border-gray-100 dark:border-[#2a2a35] hover:border-blue-100 dark:hover:border-gray-700"
                  )}>
                    <button
                      onClick={() => { onSelectModel(model.id); onClose(); }}
                      className="w-full flex items-start gap-3.5 p-4 text-left relative z-10"
                    >
                      <div className={cn(
                        "mt-1 p-2.5 rounded-2xl shrink-0 transition-colors",
                        isSelected ? "bg-blue-100 dark:bg-blue-500/20" : "bg-[#F0F4F9] dark:bg-black/20 group-hover:bg-blue-50 dark:group-hover:bg-white/5"
                      )}>
                        {model.icon}
                      </div>
                      <div className="flex-1 pr-6 pb-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn("font-bold text-[1.0625rem]", isSelected ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-white")}>
                            {model.name}
                          </span>
                          {model.badge && (
                            <span className={cn(
                              "text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full",
                              isSelected ? "bg-blue-200 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200" : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400"
                            )}>
                              {model.badge}
                            </span>
                          )}
                        </div>
                        <p className={cn("text-sm mb-1.5 leading-relaxed", isSelected ? "text-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-400")}>
                          {model.description}
                        </p>
                        
                        <div className={cn("flex items-start gap-1.5 text-[0.8125rem]", isSelected ? "text-blue-800/80 dark:text-blue-300/80" : "text-gray-500 dark:text-gray-500")}>
                          <Info size={14} className="mt-0.5 shrink-0" />
                          <p className="font-medium">{model.tip}</p>
                        </div>
                      </div>
                      
                      <div className={cn(
                        "absolute right-4 top-5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                        isSelected 
                          ? "border-blue-500 bg-blue-500" 
                          : "border-gray-200 dark:border-gray-600"
                      )}>
                        {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {showComparison && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-gray-50/50 dark:bg-black/10 border-t border-gray-100 dark:border-white/5"
                        >
                          <div className="p-4 pl-[4.5rem] grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="space-y-3 pr-4">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span>Speed</span>
                                    <span className="font-medium">{model.metrics.speed} / 100</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-sky-500 rounded-full" style={{ width: `${model.metrics.speed}%` }} />
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span>Capability</span>
                                    <span className="font-medium">{model.metrics.capability} / 100</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${model.metrics.capability}%` }} />
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span>Context Window</span>
                                    <span className="font-medium">{model.metrics.context} / 100</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${model.metrics.context}%` }} />
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3 text-xs border-l border-gray-200 dark:border-gray-700 pl-4">
                              <div>
                                <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Core Strengths:</span>
                                <ul className="text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                                  {model.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Best For:</span> 
                                <span className="text-gray-600 dark:text-gray-400">{model.useCases}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
