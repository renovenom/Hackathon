import React, { useState } from "react";
import { ChatSession } from "@/types";
import { Plus, MessageSquare, Settings, X, Trash2, History, LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/lib/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chats: ChatSession[];
  currentChat?: ChatSession;
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onOpenSettings: () => void;
  language: string;
  onReusePrompt: (prompt: string) => void;
}

export function Sidebar({ isOpen, onClose, chats, currentChat, currentChatId, onSelectChat, onNewChat, onDeleteChat, onOpenSettings, language, onReusePrompt }: SidebarProps) {
  const t = useTranslation(language);
  const { user, signInWithGoogle, logout } = useAuth();
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  const confirmDelete = () => {
    if (chatToDelete) {
      onDeleteChat(chatToDelete);
      setChatToDelete(null);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed md:static inset-y-0 left-0 z-50 w-72 bg-[#F5F5F7] dark:bg-[#15151E] border-r border-gray-200 dark:border-[#2A2A35] flex flex-col transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-4 flex items-center justify-between">
          <button 
            onClick={() => { onNewChat(); onClose(); }}
            className="flex-1 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl transition-colors shadow-sm dark:shadow-[0_0_15px_rgba(239,68,68,0.15)]"
          >
            <Plus size={18} />
            <span className="font-medium">{t("New Chat")}</span>
          </button>
          <button onClick={onClose} className="p-2 ml-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white md:hidden">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          {currentChat && currentChat.messages.filter(m => m.role === 'user').length > 0 && (
            <div className="mb-6">
              <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">{t("Previous Prompts")}</div>
              <div className="space-y-1">
                {currentChat.messages.filter(m => m.role === 'user').map(msg => (
                  <button
                    key={msg.id}
                    onClick={() => { onReusePrompt(msg.content); onClose(); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-sm text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-[#2A2A35]/50 hover:text-gray-900 dark:hover:text-gray-200"
                  >
                    <History size={14} className="shrink-0" />
                    <span className="truncate text-xs">{msg.content}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">{t("Recent")}</div>
          {chats.length === 0 ? (
            <div className="text-sm text-gray-500 px-2">{t("No recent chats")}</div>
          ) : (
            <div className="space-y-1">
              {chats.map(chat => (
                <div key={chat.id} className="relative group">
                  <button
                    onClick={() => { onSelectChat(chat.id); onClose(); }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors text-sm pr-10",
                      currentChatId === chat.id 
                        ? "bg-white dark:bg-[#2A2A35] text-gray-900 dark:text-white shadow-sm dark:shadow-none" 
                        : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-[#2A2A35]/50 hover:text-gray-900 dark:hover:text-gray-200"
                    )}
                  >
                    <MessageSquare size={16} className="shrink-0" />
                    <span className="truncate">{chat.title}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setChatToDelete(chat.id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-md hover:bg-gray-100 dark:hover:bg-[#3A3A45]"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-[#2A2A35] flex flex-col gap-2">
          {!user ? (
            <button 
              onClick={() => { signInWithGoogle(); onClose(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#2A2A35] hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
            >
              <LogIn size={18} />
              <span>{t("Log In / Sync")}</span>
            </button>
          ) : (
            <button 
              onClick={() => { logout(); onClose(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#2A2A35] hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
            >
              <LogOut size={18} />
              <div className="flex flex-col overflow-hidden">
                <span>{t("Log Out")}</span>
                <span className="text-[10px] text-gray-400 truncate">{user.email}</span>
              </div>
            </button>
          )}
          <button 
            onClick={() => { onOpenSettings(); onClose(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#2A2A35] hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
          >
            <Settings size={18} />
            <span>{t("Settings")}</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {chatToDelete && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Chat</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Are you sure you want to delete this chat session? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setChatToDelete(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A2A35] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
