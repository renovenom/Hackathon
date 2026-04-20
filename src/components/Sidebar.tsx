import React, { useState, useMemo } from "react";
import { ChatSession } from "@/types";
import { Plus, MessageSquare, Settings, X, Trash2, History, LogIn, LogOut, Search } from "lucide-react";
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
  onLoginClick: () => void;
  language: string;
  onReusePrompt: (prompt: string) => void;
}

export function Sidebar({ isOpen, onClose, chats, currentChat, currentChatId, onSelectChat, onNewChat, onDeleteChat, onOpenSettings, onLoginClick, language, onReusePrompt }: SidebarProps) {
  const t = useTranslation(language);
  const { user, logout } = useAuth();
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const confirmDelete = () => {
    if (chatToDelete) {
      onDeleteChat(chatToDelete);
      setChatToDelete(null);
    }
  };

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    return chats.filter(
      (chat) =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.messages.some((msg) =>
          msg.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [chats, searchQuery]);

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
          "fixed md:static inset-y-0 left-0 z-50 w-72 bg-[#F0F4F9] dark:bg-[#131314] flex flex-col transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-4 flex items-center justify-between">
          <button 
            onClick={() => { onNewChat(); onClose(); }}
            className="flex-1 flex items-center gap-2 bg-[#d3e3fd] text-[#041e49] dark:bg-[#004a77] dark:text-[#c2e7ff] hover:bg-[#b4cff7] dark:hover:bg-[#005c91] px-4 py-3 rounded-full transition-colors text-sm font-medium"
          >
            <Plus size={18} />
            <span className="font-semibold">{t("New Chat")}</span>
          </button>
          <button onClick={onClose} className="p-2 ml-2 text-gray-500 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors md:hidden">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          {chats.length > 0 && (
            <div className="mb-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={14} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t("Search history...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-[#1e1e24] border border-transparent rounded-full py-2 pl-9 pr-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-shadow"
              />
            </div>
          )}

          {currentChat && currentChat.messages.filter(m => m.role === 'user').length > 0 && !searchQuery.trim() && (
            <div className="mb-6">
              <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">{t("Previous Prompts")}</div>
              <div className="space-y-1">
                {currentChat.messages.filter(m => m.role === 'user').map(msg => (
                  <button
                    key={msg.id}
                    onClick={() => { onReusePrompt(msg.content); onClose(); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-sm text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-gray-200"
                  >
                    <History size={14} className="shrink-0" />
                    <span className="truncate text-xs">{msg.content}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">
            {searchQuery.trim() ? t("Search Results") : t("Recent")}
          </div>
          {filteredChats.length === 0 ? (
            <div className="text-sm text-gray-500 px-2">
              {searchQuery.trim() ? t("No matches found") : t("No recent chats")}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredChats.map(chat => (
                <div key={chat.id} className="relative group">
                  <button
                    onClick={() => { onSelectChat(chat.id); onClose(); }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-left transition-colors text-sm pr-10",
                      currentChatId === chat.id 
                        ? "bg-[#d3e3fd] text-[#041e49] dark:bg-[#004a77] dark:text-[#c2e7ff]" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10"
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col gap-1">
          {!user ? (
            <button 
              onClick={() => { onLoginClick(); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-left text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm"
            >
              <LogIn size={18} />
              <span className="font-medium">{t("Log In / Sync")}</span>
            </button>
          ) : (
            <button 
              onClick={() => { logout(); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-left text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm"
            >
              {'photoURL' in user && user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-6 h-6 rounded-full object-cover shrink-0" />
              ) : (
                <LogOut size={18} />
              )}
              <div className="flex flex-col overflow-hidden">
                <span className="font-medium">{user && 'displayName' in user && user.displayName ? user.displayName : t("Log Out")}</span>
                <span className="text-[10px] text-gray-500 truncate">{user.email}</span>
              </div>
            </button>
          )}
          <button 
            onClick={() => { onOpenSettings(); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-left text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm"
          >
            <Settings size={18} />
            <span className="font-medium">{t("Settings")}</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {chatToDelete && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e1e24] rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Chat</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Are you sure you want to delete this chat session? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setChatToDelete(null)}
                className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a35] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-full text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
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
