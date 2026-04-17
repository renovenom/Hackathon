import React, { useState } from "react";
import { AppSettings } from "@/types";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, User, Database, Globe, Moon, Type, Mic, Info, FileText, HelpCircle, LogOut, LogIn, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface SettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

const SettingsItem = ({ icon: Icon, label, value, onClick, hideBorder = false }: any) => (
  <button 
    onClick={onClick} 
    className="w-full flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative"
  >
    <div className="flex items-center gap-4">
      {Icon && <Icon size={22} className="text-gray-600 dark:text-gray-300" strokeWidth={1.5} />}
      <span className="text-gray-900 dark:text-[#EAEAEF] text-base">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-gray-500 dark:text-gray-400 text-[0.9375rem]">{value}</span>}
      <ChevronRight size={20} className="text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
    </div>
    {!hideBorder && (
      <div className="absolute bottom-0 left-[56px] right-0 h-[1px] bg-gray-200 dark:bg-[#2A2A35]" />
    )}
  </button>
);

export function SettingsSheet({ isOpen, onClose, settings, onUpdateSettings }: SettingsSheetProps) {
  const t = useTranslation(settings.language);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const cycleLanguage = () => {
    const langs = ["English", "Spanish", "French", "German", "Chinese"];
    const next = langs[(langs.indexOf(settings.language) + 1) % langs.length];
    onUpdateSettings({ ...settings, language: next });
  };

  const cycleAppearance = () => {
    const apps: ("Light" | "Dark" | "System")[] = ["Light", "Dark", "System"];
    const next = apps[(apps.indexOf(settings.appearance) + 1) % apps.length];
    onUpdateSettings({ ...settings, appearance: next });
  };

  const cycleFontSize = () => {
    const sizes: ("Small" | "Medium" | "Large")[] = ["Small", "Medium", "Large"];
    const next = sizes[(sizes.indexOf(settings.uiFontSize) + 1) % sizes.length];
    onUpdateSettings({ ...settings, uiFontSize: next });
  };

  const cycleMainLanguage = () => {
    const langs = ["Use App language", "English", "Spanish", "French", "German", "Chinese"];
    const next = langs[(langs.indexOf(settings.mainLanguage) + 1) % langs.length];
    onUpdateSettings({ ...settings, mainLanguage: next });
  };

  const handleAuthToggle = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-0 bg-[#F5F5F7] dark:bg-[#0A0A0A] z-50 flex flex-col overflow-y-auto transition-colors duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sticky top-0 bg-[#F5F5F7] dark:bg-[#0A0A0A] z-10 transition-colors duration-300">
            <button onClick={onClose} className="p-2 -ml-2 bg-gray-200 dark:bg-[#2A2A35] rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-[1.0625rem] font-medium text-gray-900 dark:text-white absolute left-1/2 -translate-x-1/2">{t("Settings")}</h2>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
          
          <div className="flex-1 px-4 pb-8 max-w-3xl mx-auto w-full mt-2">
            {/* Profile Section */}
            <div className="mb-6">
              <div className="text-[0.8125rem] font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">{t("Profile")}</div>
              <div className="bg-white dark:bg-[#1C1C1E] rounded-[20px] overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
                <SettingsItem icon={User} label={t("Account settings")} onClick={() => setActiveModal('account')} />
                <SettingsItem icon={Database} label={t("Data controls")} onClick={() => setActiveModal('data')} hideBorder />
              </div>
            </div>

            {/* App Section */}
            <div className="mb-6">
              <div className="text-[0.8125rem] font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">{t("App")}</div>
              <div className="bg-white dark:bg-[#1C1C1E] rounded-[20px] overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
                <SettingsItem icon={Globe} label={t("Language")} value={settings.language} onClick={cycleLanguage} />
                <SettingsItem icon={Moon} label={t("Appearance")} value={settings.appearance} onClick={cycleAppearance} />
                <SettingsItem icon={Type} label={t("Font size")} value={settings.uiFontSize} onClick={cycleFontSize} hideBorder />
              </div>
            </div>

            {/* Audio Section */}
            <div className="mb-6">
              <div className="text-[0.8125rem] font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">{t("Audio")}</div>
              <div className="bg-white dark:bg-[#1C1C1E] rounded-[20px] overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
                <SettingsItem icon={Mic} label={t("Main language")} value={t(settings.mainLanguage)} onClick={cycleMainLanguage} hideBorder />
              </div>
              <p className="text-[0.8125rem] text-gray-500 dark:text-gray-400 mt-2 px-1 leading-relaxed">
                {t("Select the primary language you use for voice input to achieve better recognition results")}
              </p>
            </div>

            {/* About Section */}
            <div className="mb-6">
              <div className="text-[0.8125rem] font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">{t("About")}</div>
              <div className="bg-white dark:bg-[#1C1C1E] rounded-[20px] overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
                <SettingsItem icon={Info} label={t("Check for updates")} value="1.8.4(194)" onClick={() => setActiveModal('updates')} />
                <SettingsItem icon={FileText} label={t("Service agreement")} onClick={() => setActiveModal('agreement')} hideBorder />
              </div>
            </div>

            {/* Help & Feedback */}
            <div className="mb-6">
              <div className="bg-white dark:bg-[#1C1C1E] rounded-[20px] overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
                <SettingsItem icon={HelpCircle} label={t("Help & Feedback")} onClick={() => setActiveModal('help')} hideBorder />
              </div>
            </div>

            {/* Log out / Log in */}
            <div className="mb-8">
              <div className="bg-white dark:bg-[#1C1C1E] rounded-[20px] overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
                <button 
                  onClick={handleAuthToggle}
                  className="w-full flex items-center gap-4 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  {isLoggedIn ? (
                    <>
                      <LogOut size={22} className="text-red-500" strokeWidth={1.5} />
                      <span className="text-red-500 text-base">{t("Log out")}</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={22} className="text-red-500" strokeWidth={1.5} />
                      <span className="text-red-500 text-base">{t("Log in")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="text-center pb-8 pt-4">
              <p className="text-[0.8125rem] text-gray-500">{t("AI-generated, for reference only. Use legally.")}</p>
            </div>
          </div>

          {/* Modals */}
          <AnimatePresence>
            {activeModal && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4"
                onClick={() => setActiveModal(null)}
              >
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-6 max-w-sm w-full shadow-xl relative"
                >
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X size={20} />
                  </button>
                  
                  {activeModal === 'updates' && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Check for updates</h3>
                      <p className="text-gray-600 dark:text-gray-300">You are already on the latest version (1.8.4).</p>
                    </>
                  )}
                  {activeModal === 'agreement' && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Service agreement</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm h-40 overflow-y-auto pr-2">
                        By using Venom AI, you agree to our terms of service. This is a dark hackathon project and is provided "as is" without any warranties. Embrace the symbiote responsibly. We reserve the right to terminate access at any time.
                      </p>
                    </>
                  )}
                  {activeModal === 'help' && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Help & Feedback</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">Need help or want to provide feedback?</p>
                      <a href="mailto:support@venom.ai" className="text-red-500 font-medium">Contact Support</a>
                    </>
                  )}
                  {activeModal === 'account' && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Account settings</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {isLoggedIn ? "Logged in as user@example.com" : "You are currently logged out."}
                      </p>
                    </>
                  )}
                  {activeModal === 'data' && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Data controls</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">Manage your data and privacy settings here.</p>
                      <button className="text-red-500 font-medium text-sm">Delete all my data</button>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
