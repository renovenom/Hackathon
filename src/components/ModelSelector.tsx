import React from "react";
import { ModelType } from "@/types";
import { motion, AnimatePresence } from "motion/react";
import { Check, Zap, Brain, Feather } from "lucide-react";

interface ModelSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: ModelType;
  onSelectModel: (model: ModelType) => void;
}

export function ModelSelector({ isOpen, onClose, currentModel, onSelectModel }: ModelSelectorProps) {
  const models: { id: ModelType; name: string; description: string; strengths: string; useCases: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: "V3",
      name: "Venom-Chat",
      description: "Balanced symbiote model for general use. Great for drafting emails, brainstorming ideas, and answering general knowledge questions.",
      strengths: "High accuracy, broad knowledge base, aggressive at coding and logic.",
      useCases: "General queries, programming, analysis, and creative writing.",
      icon: <Brain size={20} className="text-red-500" />,
      badge: "Lethal"
    },
    {
      id: "R1",
      name: "Venom-Reasoner",
      description: "Advanced chain-of-thought model. Best for deep structural analysis, complex hunting, and solving logic puzzles.",
      strengths: "Transparent reasoning, rigorous problem-solving, symbiotic adaptation.",
      useCases: "Math, complex logic puzzles, multi-step planning, debugging code.",
      icon: <Zap size={20} className="text-purple-500" />,
      badge: "Symbiote"
    },
    {
      id: "Lite",
      name: "Venom-Lite",
      description: "Optimized for raw speed and efficiency. Perfect for quick translations, short summaries, and rapid strikes.",
      strengths: "High speed, low latency, viciously efficient.",
      useCases: "Quick questions, quick translations, summarization, casual chat.",
      icon: <Feather size={20} className="text-green-500" />,
      badge: "Fast"
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
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-[#1E1E2E] rounded-t-[24px] z-50 pb-8 pt-2 px-4 md:max-w-md md:mx-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:rounded-2xl"
          >
            <div className="w-12 h-1.5 bg-[#3A3A45] rounded-full mx-auto mb-6 md:hidden" />
            
            <h3 className="text-xl font-semibold text-white mb-4 px-2">Select Model</h3>
            
            <div className="space-y-3">
              {models.map(model => (
                <button
                  key={model.id}
                  onClick={() => { onSelectModel(model.id); onClose(); }}
                  className="w-full flex items-start gap-4 p-4 rounded-xl hover:bg-[#2A2A35] transition-colors text-left relative border border-transparent hover:border-[#3A3A45]"
                >
                  <div className="mt-0.5 bg-[#2A2A35] p-2 rounded-lg shrink-0">
                    {model.icon}
                  </div>
                  <div className="flex-1 pr-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">{model.name}</span>
                      {model.badge && (
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#3A3A45] text-gray-300">
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{model.description}</p>
                    <div className="space-y-1 text-xs">
                      <p><span className="text-gray-300 font-medium">Strengths:</span> <span className="text-gray-500">{model.strengths}</span></p>
                      <p><span className="text-gray-300 font-medium">Ideal for:</span> <span className="text-gray-500">{model.useCases}</span></p>
                    </div>
                  </div>
                  {currentModel === model.id && (
                    <Check size={20} className="text-red-500 absolute right-4 top-1/2 -translate-y-1/2" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
