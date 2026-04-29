import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

export function PricingModal({ isOpen, onClose, language }: PricingModalProps) {
  const t = useTranslation(language);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-[#1e1e24] rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-[#2a2a35]">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pricing</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2a2a35] rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 md:p-8 overflow-y-auto">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                All Hackathon Models Are Now Free!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                During the hackathon, enjoy unrestricted access to all our advanced models without any limits. Build your best application today.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Flash / Flash-8B */}
              <div className="bg-gray-50 dark:bg-[#1a1a20] rounded-2xl p-6 border border-gray-200 dark:border-[#2a2a35] flex flex-col">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Efficient</h4>
                <p className="text-sm text-gray-500 mb-4">Fastest response times for standard tasks.</p>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  $0<span className="text-lg font-normal text-gray-500">/mo</span>
                </div>
                <div className="flex-1">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                      Hackathon-Flash
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                      Hackathon-Flash-8B
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                      Unlimited standard requests
                    </li>
                  </ul>
                </div>
              </div>

              {/* Advanced / Pro */}
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-200 dark:border-blue-900/30 flex flex-col relative transform scale-105 z-10 shadow-xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  Most Popular
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Capable</h4>
                <p className="text-sm text-gray-500 mb-4">Deep reasoning for complex coding and logic.</p>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6 flex items-baseline gap-2">
                  <span className="line-through text-gray-400 text-lg">$20</span>
                  $0<span className="text-lg font-normal text-gray-500">/mo</span>
                </div>
                <div className="flex-1">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                      Hackathon-Pro
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                      Hackathon-Advanced
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                      High accuracy coding tasks
                    </li>
                  </ul>
                </div>
              </div>

              {/* Lite */}
              <div className="bg-gray-50 dark:bg-[#1a1a20] rounded-2xl p-6 border border-gray-200 dark:border-[#2a2a35] flex flex-col">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Lite</h4>
                <p className="text-sm text-gray-500 mb-4">Quick actions and summarizations.</p>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  $0<span className="text-lg font-normal text-gray-500">/mo</span>
                </div>
                <div className="flex-1">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                      Hackathon-Lite
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                      Low latency responses
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
