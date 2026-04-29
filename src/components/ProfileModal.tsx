import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Camera, Check } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useTranslation } from "@/lib/i18n";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

export function ProfileModal({ isOpen, onClose, language }: ProfileModalProps) {
  const t = useTranslation(language);
  const { user, updateUserProfile } = useAuth();
  
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setDisplayName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile(displayName, photoURL);
      toast.success(t("Profile updated successfully"));
      onClose();
    } catch (e) {
      toast.error(t("Failed to update profile"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-[#1e1e24] rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden relative"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-[#2a2a35]">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("Edit Profile")}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2a2a35] rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative group w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 flex flex-col items-center justify-center mb-4 border-4 border-white dark:border-[#1e1e24] shadow-md">
                {photoURL ? (
                  <img src={photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {displayName ? displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                  </span>
                )}
                
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("Display Name")}
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#131314] border border-gray-200 dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t("Enter your display name")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("Avatar URL")}
                </label>
                <input
                  type="text"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#131314] border border-gray-200 dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t("https://example.com/avatar.png")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("Email Address")}
                </label>
                <input
                  type="text"
                  value={user.email || ""}
                  disabled
                  className="w-full bg-gray-100 dark:bg-[#1a1a20] border border-gray-200 dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check size={18} />
                  {t("Save Changes")}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
