import React, { useState, useEffect } from 'react';
import { ChatScreen } from './components/ChatScreen';
import { Sidebar } from './components/Sidebar';
import { SettingsSheet } from './components/SettingsSheet';
import { ChatSession, Message, AppSettings, DEFAULT_SETTINGS } from './types';
import { generateChatResponse, ModelType } from './lib/gemini';

export default function App() {
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
    // Apply appearance
    const isDark = settings.appearance === 'Dark' || 
      (settings.appearance === 'System' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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
    setChats(prev => prev.filter(c => c.id !== id));
    if (currentChatId === id) {
      setCurrentChatId(null);
    }
  };

  const handleClearChat = () => {
    if (currentChatId) {
      setChats(prev => prev.map(c => c.id === currentChatId ? { ...c, messages: [] } : c));
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

  const handleSendMessage = async (text: string) => {
    let chatId = currentChatId;
    let newChats = [...chats];
    let chatIndex = newChats.findIndex(c => c.id === chatId);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: Date.now()
    };

    if (!chatId || chatIndex === -1) {
      // Create new chat
      chatId = Date.now().toString();
      const newChat: ChatSession = {
        id: chatId,
        title: text.slice(0, 30) + (text.length > 30 ? "..." : ""),
        messages: [userMessage],
        updatedAt: Date.now(),
        model: settings.defaultModel
      };
      newChats.unshift(newChat);
      setCurrentChatId(chatId);
      chatIndex = 0;
    } else {
      newChats[chatIndex].messages.push(userMessage);
      newChats[chatIndex].updatedAt = Date.now();
    }

    setChats(newChats);
    setIsGenerating(true);

    try {
      const messagesForApi = newChats[chatIndex].messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const stream = await generateChatResponse(
        messagesForApi,
        newChats[chatIndex].model,
        settings.temperature,
        settings.topP,
        settings.maxTokens
      );

      const assistantMessageId = (Date.now() + 1).toString();
      let assistantContent = "";

      // Add empty assistant message
      newChats = [...newChats];
      newChats[chatIndex].messages.push({
        id: assistantMessageId,
        role: "model",
        content: "",
        timestamp: Date.now()
      });
      setChats(newChats);

      for await (const chunk of stream) {
        assistantContent += chunk.text;
        
        setChats(prev => {
          const updated = [...prev];
          const idx = updated.findIndex(c => c.id === chatId);
          if (idx !== -1) {
            const msgIdx = updated[idx].messages.findIndex(m => m.id === assistantMessageId);
            if (msgIdx !== -1) {
              updated[idx].messages[msgIdx].content = assistantContent;
            }
          }
          return updated;
        });
      }
    } catch (error) {
      console.error("Failed to generate response:", error);
      // Add error message
      setChats(prev => {
        const updated = [...prev];
        const idx = updated.findIndex(c => c.id === chatId);
        if (idx !== -1) {
          updated[idx].messages.push({
            id: Date.now().toString(),
            role: "model",
            content: "Sorry, I encountered an error while generating a response. Please try again.",
            timestamp: Date.now()
          });
        }
        return updated;
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectModel = (model: ModelType) => {
    if (currentChatId) {
      setChats(prev => prev.map(c => c.id === currentChatId ? { ...c, model } : c));
    } else {
      setSettings(prev => ({ ...prev, defaultModel: model }));
    }
  };

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
