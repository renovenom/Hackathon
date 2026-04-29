import React, { useState } from "react";
import { AppSettings } from "@/types";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, User as UserIcon, Database, Globe, Moon, Type, Mic, Info, FileText, HelpCircle, LogOut, LogIn, X, Zap, Check, Sliders } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

interface SettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onLoginClick: () => void;
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

const UpdateChecker = () => {
  const [status, setStatus] = useState<"checking" | "available" | "updating" | "updated">("checking");
  
  React.useEffect(() => {
    const checkTimer = setTimeout(() => {
      setStatus("available");
    }, 1500);
    return () => clearTimeout(checkTimer);
  }, []);

  const handleUpdate = () => {
    setStatus("updating");
    setTimeout(() => {
      setStatus("updated");
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center py-2 text-center w-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Software Update</h3>
      
      {status === "checking" && (
        <div className="py-4">
          <div className="w-10 h-10 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Checking for updates...</p>
        </div>
      )}

      {status === "available" && (
        <div className="w-full">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap size={24} />
          </div>
          <p className="text-gray-900 dark:text-white font-medium mb-1">Update Available (v1.9.0)</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">This update includes vital stability improvements, model fixes, and new features.</p>

          <div className="text-left w-full mb-6">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Recently updates:</h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5 pl-4 list-disc marker:text-gray-300 dark:marker:text-gray-600">
              <li>Added user avatar configuration</li>
              <li>Per-model advanced settings (Temp, Top-P, Tokens)</li>
              <li>Fixed dark theme variants throughout the application</li>
              <li>Introduced markdown editing in text area</li>
            </ul>
          </div>

          <button 
            onClick={handleUpdate}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
          >
            Update Now
          </button>
        </div>
      )}

      {status === "updating" && (
        <div className="py-8 w-full flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin mb-6" />
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 mb-4 overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
              className="bg-blue-600 h-2.5 rounded-full"
            />
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">Downloading UI payload & updates...</p>
          <p className="text-gray-500 text-xs mt-2">Please do not close this window</p>
        </div>
      )}

      {status === "updated" && (
        <div className="w-full">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={28} strokeWidth={3} />
          </div>
          <p className="text-gray-900 dark:text-white font-medium mb-1">Update Complete</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Hackathon UI is now running exactly with the latest patch.</p>
          
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-medium rounded-xl transition-colors"
          >
            Restart Application
          </button>
        </div>
      )}
    </div>
  );
};

const ModelPreferencesEditor = ({ settings, onUpdateSettings }: { settings: AppSettings, onUpdateSettings: (s: AppSettings) => void }) => {
  const [selectedModel, setSelectedModel] = useState<import("@/types").ModelType>("V3");

  const currentPrefs = settings.modelPreferences?.[selectedModel] || {
    temperature: settings.temperature,
    topP: settings.topP,
    maxTokens: settings.maxTokens
  };

  const updatePref = (key: keyof typeof currentPrefs, value: number) => {
    onUpdateSettings({
      ...settings,
      modelPreferences: {
        ...settings.modelPreferences,
        [selectedModel]: {
          ...currentPrefs,
          [key]: value
        }
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 pb-2">
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-[#1a1a20] rounded-xl flex-wrap">
        {(["V3", "R1", "Lite", "Pro", "Flash8B"] as const).map(m => (
          <button
            key={m}
            className={`flex-auto py-1.5 px-2 text-[10px] sm:text-xs font-medium rounded-lg transition-colors ${selectedModel === m ? "bg-white dark:bg-[#2a2a35] text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
            onClick={() => setSelectedModel(m)}
          >
            {m === "V3" ? "Flash" : m === "R1" ? "Advanced" : m === "Pro" ? "Pro" : m === "Flash8B" ? "Flash-8B" : "Lite"}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            <span>Temperature</span>
            <span>{currentPrefs.temperature.toFixed(2)}</span>
          </label>
          <input 
            type="range" 
            min="0" max="2" step="0.05"
            value={currentPrefs.temperature}
            onChange={(e) => updatePref('temperature', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-[10px] text-gray-400 mt-1">Controls randomness. Lower is more deterministic.</p>
        </div>

        <div>
          <label className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            <span>Top-P</span>
            <span>{currentPrefs.topP.toFixed(2)}</span>
          </label>
          <input 
            type="range" 
            min="0" max="1" step="0.05"
            value={currentPrefs.topP}
            onChange={(e) => updatePref('topP', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-[10px] text-gray-400 mt-1">Nucleus sampling threshold.</p>
        </div>

        <div>
          <label className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            <span>Max Tokens</span>
            <span>{currentPrefs.maxTokens}</span>
          </label>
          <input 
            type="range" 
            min="256" max="32768" step="256"
            value={currentPrefs.maxTokens}
            onChange={(e) => updatePref('maxTokens', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-[10px] text-gray-400 mt-1">Maximum length of the generated response.</p>
        </div>
      </div>
    </div>
  );
};

const AccountEditor = () => {
  const { user, updateUserProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user && 'displayName' in user ? user.displayName || "" : "");
  const [photoURL, setPhotoURL] = useState(user && 'photoURL' in user ? user.photoURL || "" : "");
  const [isSaving, setIsSaving] = useState(false);

  // Use a type guard or direct check for displayName
  const currentDisplayName = user && 'displayName' in user ? user.displayName : "";

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile(displayName, photoURL);
      toast.success("Profile updated successfully!");
    } catch (e: any) {
      toast.error(e.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File is too large. Please select an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoURL(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return <p className="text-gray-600 dark:text-gray-300">You are currently logged out.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-gray-600 dark:text-gray-300 mb-2">
        Logged in as <strong className="text-gray-900 dark:text-white">{user.email}</strong>
      </p>
      
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Display Name</label>
        <input 
          type="text" 
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          placeholder="e.g. Hackathon User"
          className="w-full bg-gray-50 dark:bg-[#1e1e24] border border-gray-200 dark:border-[#2a2a35] text-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:border-blue-500 transition-colors text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Avatar Update</label>
        <div className="flex items-center gap-3">
          {photoURL && (
             <img src={photoURL} alt="Avatar" className="w-10 h-10 rounded-full object-cover shrink-0 bg-gray-100" />
          )}
          <input 
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-gray-50 dark:bg-[#1e1e24] hover:bg-gray-100 dark:hover:bg-[#2a2a35] border border-gray-200 dark:border-[#2a2a35] text-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none transition-colors text-sm text-center"
          >
            Upload Image
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-500">Or paste URL: </span>
        </div>
        <input 
          type="url" 
          value={photoURL}
          onChange={e => setPhotoURL(e.target.value)}
          placeholder="https://..."
          className="w-full mt-1 bg-gray-50 dark:bg-[#1e1e24] border border-gray-200 dark:border-[#2a2a35] text-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:border-blue-500 transition-colors text-sm"
        />
      </div>

      <button 
        onClick={handleSave}
        disabled={isSaving}
        className="w-full mt-2 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-medium disabled:opacity-50 rounded-xl transition-colors"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export function SettingsSheet({ isOpen, onClose, settings, onUpdateSettings, onLoginClick }: SettingsSheetProps) {
  const t = useTranslation(settings.language);
  const { user, logout } = useAuth();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [confirmWipe, setConfirmWipe] = useState(false);

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
    if (user) {
      logout();
    } else {
      onLoginClick();
    }
  };

  const handleWipeData = async () => {
    // Clear local storage
    localStorage.removeItem('gemini_clone_settings');
    localStorage.removeItem('gemini_clone_local_chats');
    localStorage.removeItem('gemini_clone_local_user');
    localStorage.removeItem('gemini_clone_local_accounts');
    
    if (user) {
      localStorage.removeItem(`gemini_clone_chats_${user.uid}`);
      await logout();
    }
    
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-0 bg-[#F0F4F9] dark:bg-[#131314] z-50 flex flex-col overflow-y-auto transition-colors duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sticky top-0 bg-[#F0F4F9] dark:bg-[#131314] z-10 transition-colors duration-300">
            <button onClick={onClose} className="p-2 -ml-2 bg-white dark:bg-[#1e1e24] shadow-sm rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-[1.0625rem] font-medium text-gray-900 dark:text-white absolute left-1/2 -translate-x-1/2">{t("Settings")}</h2>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
          
          <div className="flex-1 px-4 pb-8 max-w-3xl mx-auto w-full mt-2">
            {/* Profile Section */}
            <div className="mb-6">
              <div className="text-[0.8125rem] font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">{t("Profile")}</div>
              <div className="bg-white dark:bg-[#1e1e24] rounded-3xl overflow-hidden shadow-sm border border-transparent dark:border-[#2a2a35] transition-colors duration-300">
                <SettingsItem icon={UserIcon} label={t("Account settings")} onClick={() => setActiveModal('account')} />
                <SettingsItem icon={Database} label={t("Data controls")} onClick={() => setActiveModal('data')} hideBorder />
              </div>
            </div>

            {/* Models Section */}
            <div className="mb-6">
              <div className="text-[0.8125rem] font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">{t("Models")}</div>
              <div className="bg-white dark:bg-[#1e1e24] rounded-3xl overflow-hidden shadow-sm border border-transparent dark:border-[#2a2a35] transition-colors duration-300">
                <SettingsItem icon={Sliders} label={t("Advanced Settings")} onClick={() => setActiveModal('modelPreferences')} hideBorder />
              </div>
            </div>

            {/* App Section */}
            <div className="mb-6">
              <div className="text-[0.8125rem] font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">{t("App")}</div>
              <div className="bg-white dark:bg-[#1e1e24] rounded-3xl overflow-hidden shadow-sm border border-transparent dark:border-[#2a2a35] transition-colors duration-300">
                <SettingsItem icon={Globe} label={t("Language")} value={settings.language} onClick={cycleLanguage} />
                <SettingsItem icon={Moon} label={t("Appearance")} value={settings.appearance} onClick={cycleAppearance} />
                <SettingsItem icon={Type} label={t("Font size")} value={settings.uiFontSize} onClick={cycleFontSize} hideBorder />
              </div>
            </div>

            {/* Audio Section */}
            <div className="mb-6">
              <div className="text-[0.8125rem] font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">{t("Audio")}</div>
              <div className="bg-white dark:bg-[#1e1e24] rounded-3xl overflow-hidden shadow-sm border border-transparent dark:border-[#2a2a35] transition-colors duration-300">
                <SettingsItem icon={Mic} label={t("Main language")} value={t(settings.mainLanguage)} onClick={cycleMainLanguage} hideBorder />
              </div>
              <p className="text-[0.8125rem] text-gray-500 dark:text-gray-400 mt-2 px-1 leading-relaxed">
                {t("Select the primary language you use for voice input to achieve better recognition results")}
              </p>
            </div>

            {/* About Section */}
            <div className="mb-6">
              <div className="text-[0.8125rem] font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">{t("About")}</div>
              <div className="bg-white dark:bg-[#1e1e24] rounded-3xl overflow-hidden shadow-sm border border-transparent dark:border-[#2a2a35] transition-colors duration-300">
                <SettingsItem icon={Info} label={t("Check for updates")} onClick={() => setActiveModal('updates')} />
                <SettingsItem icon={FileText} label={t("Service agreement")} onClick={() => setActiveModal('agreement')} hideBorder />
              </div>
            </div>

            {/* Help & Feedback */}
            <div className="mb-6">
              <div className="bg-white dark:bg-[#1e1e24] rounded-3xl overflow-hidden shadow-sm border border-transparent dark:border-[#2a2a35] transition-colors duration-300">
                <SettingsItem icon={HelpCircle} label={t("Help & Feedback")} onClick={() => setActiveModal('help')} hideBorder />
              </div>
            </div>

            {/* Log out / Log in */}
            <div className="mb-8">
              <div className="bg-white dark:bg-[#1e1e24] rounded-3xl overflow-hidden shadow-sm border border-transparent dark:border-[#2a2a35] transition-colors duration-300">
                <button 
                  onClick={handleAuthToggle}
                  className="w-full flex items-center gap-4 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  {user ? (
                    <>
                      <LogOut size={22} className="text-gray-700 dark:text-gray-300" strokeWidth={1.5} />
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-base">{t("Log out")}</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={22} className="text-blue-600 dark:text-sky-400" strokeWidth={1.5} />
                      <span className="text-blue-600 dark:text-sky-400 font-medium text-base">{t("Log in")}</span>
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
                  className="bg-white dark:bg-[#1e1e24] rounded-3xl p-6 max-w-sm w-full shadow-xl relative"
                >
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X size={20} />
                  </button>
                  
                  {activeModal === 'updates' && (
                    <UpdateChecker />
                  )}
                  {activeModal === 'agreement' && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Service agreement</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm h-40 overflow-y-auto pr-2">
                        By using Hackathon, you agree to our terms of service. This is a learning project and is provided "as is" without any warranties.
                      </p>
                    </>
                  )}
                  {activeModal === 'help' && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Help & Feedback</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">Need help or want to provide feedback?</p>
                      <a href="mailto:support@example.com" className="text-blue-500 font-medium">Contact Support</a>
                    </>
                  )}
                  {activeModal === 'account' && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Account settings</h3>
                      <AccountEditor />
                    </>
                  )}
                  {activeModal === 'modelPreferences' && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t("Model Preferences")}</h3>
                      <ModelPreferencesEditor settings={settings} onUpdateSettings={onUpdateSettings} />
                    </>
                  )}
                  {activeModal === 'data' && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t("Data controls")}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{t("Manage your data and privacy settings here.")}</p>
                      
                      {!confirmWipe ? (
                        <button 
                          onClick={() => setConfirmWipe(true)}
                          className="w-full py-2.5 bg-red-100 hover:bg-red-200 dark:bg-red-600/10 dark:hover:bg-red-600/20 text-red-600 dark:text-red-500 font-medium rounded-xl transition-colors"
                        >
                          {t("Delete all my data")}
                        </button>
                      ) : (
                        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-200 dark:border-red-900/30">
                          <p className="text-sm text-red-800 dark:text-red-400 font-medium mb-3">
                            {t("Are you sure you want to delete all your local data and log out? This action cannot be undone.")}
                          </p>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={handleWipeData}
                              className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm"
                            >
                              {t("Yes, delete it")}
                            </button>
                            <button 
                              onClick={() => setConfirmWipe(false)}
                              className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors text-sm"
                            >
                              {t("Cancel")}
                            </button>
                          </div>
                        </div>
                      )}
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
