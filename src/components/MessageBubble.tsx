import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";
import { Message } from "@/types";
import { ChevronDown, ChevronRight, Copy, RefreshCw, Trash2, BrainCircuit, Cpu, Zap, Feather, Check, Smile } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MessageBubbleProps {
  message: Message;
  onDelete?: () => void;
  onRegenerate?: () => void;
  showReasoningDefault?: boolean;
  contentClassName?: string;
}

import { useAuth } from "@/lib/AuthContext";

export function MessageBubble({ message, onDelete, onRegenerate, showReasoningDefault = false, contentClassName }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const { user } = useAuth();
  const [showActions, setShowActions] = useState(false);
  const [showReactionsList, setShowReactionsList] = useState(false);
  const [reactions, setReactions] = useState<string[]>([]);
  const [reasoningExpanded, setReasoningExpanded] = useState(showReasoningDefault);

  const availableReactions = ["👍", "❤️", "😂", "🎉", "🤔"];

  const handleReact = (emoji: string) => {
    if (reactions.includes(emoji)) {
      setReactions(reactions.filter(r => r !== emoji));
    } else {
      setReactions([...reactions, emoji]);
    }
    setShowReactionsList(false);
  };


  // Parse reasoning block if present
  let content = message.content;
  let reasoning = "";
  let isReasoningStreaming = false;
  
  const reasoningMatch = content.match(/<reasoning>([\s\S]*?)<\/reasoning>/);
  if (reasoningMatch) {
    reasoning = reasoningMatch[1].trim();
    content = content.replace(/<reasoning>[\s\S]*?<\/reasoning>/, "").trim();
  } else if (content.includes("<reasoning>")) {
    // Partial reasoning block (streaming)
    reasoning = content.split("<reasoning>")[1].trim();
    content = "";
    isReasoningStreaming = true;
  }

  // Auto-expand reasoning when streaming starts
  React.useEffect(() => {
    if (isReasoningStreaming) {
      setReasoningExpanded(true);
    }
  }, [isReasoningStreaming]);

  React.useEffect(() => {
    setReasoningExpanded(showReasoningDefault);
  }, [showReasoningDefault]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setShowActions(false);
  };

  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          {...props}
          children={String(children).replace(/\n$/, "")}
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          className="rounded-md my-2 text-sm"
        />
      ) : (
        <code {...props} className={cn("bg-gray-100 dark:bg-[#2A2A35] px-1.5 py-0.5 rounded-md text-sm font-mono", className)}>
          {children}
        </code>
      );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "flex w-full mb-8 group relative",
        isUser ? "justify-end" : "justify-start"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {!isUser && (
        <div className="shrink-0 mr-4 mt-1 hidden md:flex h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 items-center justify-center text-white p-1">
           <Cpu size={16} />
        </div>
      )}
      <div 
        className={cn(
          "relative transition-colors duration-300 flex items-start gap-4",
          isUser && "flex-row-reverse",
          isUser 
            ? "max-w-[85%] md:max-w-[75%] rounded-3xl " + (!content && !reasoning ? "p-3" : "px-5 py-3") + " bg-[#f0f4f9] text-[#1f1f1f] dark:bg-[#1e1e24] dark:text-gray-100" 
            : "max-w-[95%] md:max-w-[85%] rounded-2xl py-1 text-gray-900 dark:text-[#E3E3E3] w-full"
        )}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowActions(!showActions);
        }}
      >
        {isUser && user && 'photoURL' in user && user.photoURL && (
          <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full object-cover shrink-0 mt-1 shadow-sm hidden md:block" />
        )}
        <div className="flex-1 w-full flex flex-col">
          {!isUser && (reasoning || isReasoningStreaming) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn("mb-3 border rounded-2xl overflow-hidden transition-all duration-300 shadow-sm",
              isReasoningStreaming ? "border-blue-200 dark:border-blue-900/50 bg-[#F0F4F9]/50 dark:bg-sky-900/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]" : "border-gray-200 dark:border-[#2a2a35] bg-white dark:bg-[#131314]"
            )}
          >
            <button 
              onClick={() => setReasoningExpanded(!reasoningExpanded)}
              className="flex justify-between items-center w-full px-4 py-3 text-[13px] font-medium text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                {reasoningExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                {isReasoningStreaming ? (
                  <span className="flex items-center gap-2 text-blue-600 dark:text-sky-400">
                    <BrainCircuit size={15} className="animate-pulse" />
                    Deep Thinking in progress...
                    <span className="flex gap-0.5 ml-1">
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4 }} className="w-1 h-1 bg-current rounded-full" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }} className="w-1 h-1 bg-current rounded-full" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }} className="w-1 h-1 bg-current rounded-full" />
                    </span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <BrainCircuit size={15} className="text-purple-500 opacity-70" />
                    Thought Process
                  </span>
                )}
              </div>
              {!isReasoningStreaming && <span className="text-[10px] bg-gray-100 dark:bg-[#1e1e24] px-1.5 py-0.5 rounded text-gray-400">Complete</span>}
            </button>
            <AnimatePresence>
              {reasoningExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-3 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100/50 dark:border-white/5 pt-3"
                >
                  <div className="markdown-body prose dark:prose-invert prose-sm max-w-none font-mono opacity-80 text-[13px] leading-relaxed">
                    <ReactMarkdown components={MarkdownComponents}>{reasoning}</ReactMarkdown>
                    {isReasoningStreaming && (
                      <motion.span animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-2.5 h-4 ml-1 align-middle bg-blue-500/50" />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {message.attachments && message.attachments.length > 0 && (
          <div className="flex gap-2 mb-3 overflow-x-auto">
            {message.attachments.map((att, i) => (
              <div key={i} className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-black/5 dark:bg-white/5 shrink-0">
                {att.url ? (
                  <img src={att.url} alt="Uploaded file" className="w-full h-full object-cover" />
                ) : (
                  <img src={`data:${att.mimeType};base64,${att.data}`} alt="Uploaded file" className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>
        )}

        <div className={cn(
          "markdown-body prose max-w-none text-[16px] leading-relaxed",
          isUser ? "text-[#1f1f1f] dark:prose-invert dark:text-gray-100" : "dark:prose-invert text-[#1f1f1f] dark:text-[#E3E3E3]",
          contentClassName
        )}>
          <ReactMarkdown components={MarkdownComponents}>{content}</ReactMarkdown>
        </div>

        <div className="flex items-center gap-2 mt-2">
          {reactions.map((emoji) => (
            <span key={emoji} className="inline-flex items-center justify-center bg-gray-100 dark:bg-[#2a2a35] rounded-full px-2 py-0.5 text-sm cursor-pointer" onClick={() => handleReact(emoji)}>
              {emoji}
            </span>
          ))}
        </div>

        <div className={cn("text-[10px] text-gray-400 mt-2 select-none transition-opacity duration-300", showActions ? "opacity-100" : "opacity-0", isUser ? "text-right" : "text-left")}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>

        {!isUser && message.model && (
          <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium text-gray-400 dark:text-gray-500 select-none">
            {message.model === 'V3' ? <><Feather size={12} className="text-gray-400" /> Hackathon-Flash</> : 
             message.model === 'R1' ? <><Zap size={12} className="text-gray-400" /> Hackathon-Advanced</> : 
             message.model === 'Pro' ? <><BrainCircuit size={12} className="text-gray-400" /> Hackathon-Pro</> : 
             message.model === 'Flash8B' ? <><Check size={12} className="text-gray-400" /> Hackathon-Flash-8B</> : <><Feather size={12} className="text-gray-400" /> Hackathon-Lite</>}
          </div>
        )}

        </div>

        {/* Actions Menu */}
        <AnimatePresence>
          {showActions && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onMouseLeave={() => setShowReactionsList(false)}
              className={cn(
                "absolute -bottom-10 flex items-center gap-1 bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-[#2a2a35] rounded-full p-1 shadow-sm z-10 transition-colors duration-300",
                isUser ? "right-4" : "left-0"
              )}
            >
              <AnimatePresence>
                {showReactionsList && (
                  <motion.div 
                    initial={{ opacity: 0, width: 0, scale: 0.9 }}
                    animate={{ opacity: 1, width: 'auto', scale: 1 }}
                    exit={{ opacity: 0, width: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-1 mr-1 pr-2 border-r border-gray-200 dark:border-[#2a2a35] overflow-hidden"
                  >
                    {availableReactions.map(emoji => (
                      <button key={emoji} onClick={() => handleReact(emoji)} className="p-1 hover:bg-gray-100 dark:hover:bg-[#2a2a35] rounded-full text-sm transition-colors shrink-0">
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <button onClick={() => setShowReactionsList(!showReactionsList)} title="React" className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2a2a35] rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                <Smile size={16} />
              </button>
              <button onClick={handleCopy} title="Copy to Clipboard" className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2a2a35] rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                <Copy size={16} />
              </button>
              {!isUser && onRegenerate && (
                <button onClick={() => { onRegenerate(); setShowActions(false); }} className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2a2a35] rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                  <RefreshCw size={16} />
                </button>
              )}
              {onDelete && (
                <button onClick={() => { onDelete(); setShowActions(false); }} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/20 text-red-500 dark:text-red-400 rounded-full transition-colors">
                  <Trash2 size={16} />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
