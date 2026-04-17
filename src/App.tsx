import React, { useState, useEffect } from 'react';
import { ChatScreen } from './components/ChatScreen';
import { Sidebar } from './components/Sidebar';
import { SettingsSheet } from './components/SettingsSheet';
import { LoginScreen } from './components/LoginScreen';
import { ChatSession, Message, AppSettings, DEFAULT_SETTINGS } from './types';
import { generateChatResponse, ModelType } from './lib/gemini';
import { useAuth } from './lib/AuthContext';
import { subscribeToChats, saveChatToFirestore, deleteChatFromFirestore } from './lib/firestore';

export default function App() {
  const { user, loading } = useAuth();
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [reusedPrompt, setReusedPrompt] = useState<string>("");

  const currentChat = chats.find(c => c.id === currentChatId);
  const currentModel = currentChat?.model || settings.defaultModel;

  useEffect(() => {
    let unsubscribe: () => void;
    if (user) {
      unsubscribe = subscribeToChats(user.uid, (fetchedChats) => {
        setChats(fetchedChats);
      });
    } else {
      setChats([]);
      setCurrentChatId(null);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    // Apply appearance - Force dark mode for Venom theme
    const isDark = true;
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    }

    // Apply font size
    let fontSize = '16px';
    if (settings.uiFontSize === 'Small') fontSize = '14px';
    if (settings.uiFontSize === 'Large') fontSize = '18px';
    document.documentElement.style.fontSize = fontSize;
  }, [settings.appearance, settings.uiFontSize]);

  const handleNewChat = () => {
    setCurrentChatId(null);
  };

  const handleDeleteChat = (id: string) => {
    if (!user) {
      setChats(prev => prev.filter(c => c.id !== id));
    } else {
      deleteChatFromFirestore(user.uid, id);
    }
    if (currentChatId === id) {
      setCurrentChatId(null);
    }
  };

  const handleClearChat = () => {
    if (currentChatId && currentChat) {
      const updated = { ...currentChat, messages: [] };
      if (!user) {
        setChats(prev => prev.map(c => c.id === currentChatId ? updated : c));
      } else {
        saveChatToFirestore(user.uid, updated);
      }
    }
  };

  const handleExportChat = () => {
    if (!currentChat) return;
    const content = currentChat.messages.map(m => `[${m.role.toUpperCase()}]\n${m.content}\n`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentChat.title || 'chat-export'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendMessage = async (text: string, modelOverride?: ModelType, useSearch?: boolean) => {
    let chatId = currentChatId;
    let newChats = [...chats];
    let chatIndex = newChats.findIndex(c => c.id === chatId);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: Date.now()
    };

    const modelToUse = modelOverride || (chatIndex !== -1 ? newChats[chatIndex].model : settings.defaultModel);
    let updatedChat: ChatSession;

    if (!chatId || chatIndex === -1) {
      // Create new chat
      chatId = Date.now().toString();
      const newChat: ChatSession = {
        id: chatId,
        title: text.slice(0, 30) + (text.length > 30 ? "..." : ""),
        messages: [userMessage],
        updatedAt: Date.now(),
        model: modelToUse
      };
      newChats.unshift(newChat);
      setCurrentChatId(chatId);
      chatIndex = 0;
      updatedChat = newChat;
    } else {
      updatedChat = {
        ...newChats[chatIndex],
        messages: [...newChats[chatIndex].messages, userMessage],
        updatedAt: Date.now()
      };
      if (modelOverride) {
        updatedChat.model = modelOverride;
      }
      newChats[chatIndex] = updatedChat;
    }

    if (!user) {
      setChats(newChats);
    } else {
      await saveChatToFirestore(user.uid, updatedChat);
    }
    
    setIsGenerating(true);

    const assistantMessageId = (Date.now() + 1).toString();

    try {
      const messagesForApi = updatedChat.messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const stream = await generateChatResponse(
        messagesForApi,
        modelToUse,
        settings.temperature,
        settings.topP,
        settings.maxTokens,
        useSearch
      );

      let assistantContent = "";
      
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: "model",
        content: "",
        timestamp: Date.now()
      };
      
      updatedChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, assistantMessage]
      };

      if (!user) {
        let tempChats = [...newChats];
        tempChats[chatIndex] = updatedChat;
        setChats(tempChats);
      } else {
        await saveChatToFirestore(user.uid, updatedChat);
      }

      let lastUpdateTime = Date.now();
      
      for await (const chunk of stream) {
        assistantContent += chunk.text;
        
        const now = Date.now();
        // Update state at most every 500ms to prevent lag and too many DB writes
        if (now - lastUpdateTime > 500) {
          const streamChat = {
             ...updatedChat,
             messages: updatedChat.messages.map(m => 
               m.id === assistantMessageId ? { ...m, content: assistantContent } : m
             )
          };
          if (!user) {
            setChats(prev => prev.map(c => c.id === chatId ? streamChat : c));
          } else {
             saveChatToFirestore(user.uid, streamChat); // fire and forget during stream
          }
          lastUpdateTime = now;
        }
      }
      
      // Final update
      const finalChat = {
        ...updatedChat,
        messages: updatedChat.messages.map(m => 
          m.id === assistantMessageId ? { ...m, content: assistantContent } : m
        )
      };
      
      if (!user) {
        setChats(prev => prev.map(c => c.id === chatId ? finalChat : c));
      } else {
        await saveChatToFirestore(user.uid, finalChat);
      }

    } catch (error) {
      console.error("Failed to generate response:", error);
      const errorChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, {
          id: Date.now().toString(),
          role: "model" as const,
          content: "Sorry, I encountered an error while generating a response. Please try again.",
          timestamp: Date.now()
        }]
      };
      
      if (!user) {
        setChats(prev => prev.map(c => c.id === chatId ? errorChat : c));
      } else {
        await saveChatToFirestore(user.uid, errorChat);
      }

    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectModel = (model: ModelType) => {
    if (currentChatId && currentChat) {
      const updated = { ...currentChat, model };
      if (!user) {
        setChats(prev => prev.map(c => c.id === currentChatId ? updated : c));
      } else {
        saveChatToFirestore(user.uid, updated);
      }
    } else {
      setSettings(prev => ({ ...prev, defaultModel: model }));
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5F5F7] dark:bg-[#1E1E2E] transition-colors duration-300">
        <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-black dark:border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#F5F5F7] dark:bg-[#1E1E2E] overflow-hidden font-sans transition-colors duration-300">
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chats={chats}
        currentChat={currentChat}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        language={settings.language}
        onReusePrompt={setReusedPrompt}
      />
      
      <main className="flex-1 min-w-0 h-full relative">
        <ChatScreen 
          messages={currentChat?.messages || []}
          isGenerating={isGenerating}
          onSendMessage={handleSendMessage}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onNewChat={handleNewChat}
          onClearChat={handleClearChat}
          onExportChat={handleExportChat}
          currentModel={currentModel}
          onModelChange={handleSelectModel}
          language={settings.language}
          hapticFeedback={settings.hapticFeedback}
          showReasoningDefault={settings.showReasoningDefault}
          onUpdateShowReasoningDefault={(val) => setSettings(prev => ({ ...prev, showReasoningDefault: val }))}
          reusedPrompt={reusedPrompt}
          onPromptReused={() => setReusedPrompt("")}
        />
      </main>

      <SettingsSheet 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />
    </div>
  );
}
