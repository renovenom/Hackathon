import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";
import { Message } from "@/types";
import { ChevronDown, ChevronRight, Copy, RefreshCw, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MessageBubbleProps {
  message: Message;
  onDelete?: () => void;
  onRegenerate?: () => void;
  showReasoningDefault?: boolean;
}

export function MessageBubble({ message, onDelete, onRegenerate, showReasoningDefault = false }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [showActions, setShowActions] = useState(false);
  const [reasoningExpanded, setReasoningExpanded] = useState(showReasoningDefault);

  // Parse reasoning block if present
  let content = message.content;
  let reasoning = "";
  
  const reasoningMatch = content.match(/<reasoning>([\s\S]*?)<\/reasoning>/);
  if (reasoningMatch) {
    reasoning = reasoningMatch[1].trim();
    content = content.replace(/<reasoning>[\s\S]*?<\/reasoning>/, "").trim();
  } else if (content.includes("<reasoning>")) {
    // Partial reasoning block (streaming)
    reasoning = content.split("<reasoning>")[1].trim();
    content = "";
  }

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
        "flex w-full mb-6 group relative",
        isUser ? "justify-end" : "justify-start"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div 
        className={cn(
          "max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 relative transition-colors duration-300",
          isUser 
            ? "bg-[#0066FF] text-white rounded-tr-sm" 
            : "bg-white dark:bg-[#2A2A35] text-gray-900 dark:text-[#EAEAEF] rounded-tl-sm shadow-sm dark:shadow-none border border-gray-100 dark:border-transparent"
        )}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowActions(!showActions);
        }}
      >
        {!isUser && reasoning && (
          <div className="mb-3 border border-gray-200 dark:border-[#3A3A45] rounded-xl overflow-hidden bg-gray-50 dark:bg-[#1E1E2E] transition-colors duration-300">
            <button 
              onClick={() => setReasoningExpanded(!reasoningExpanded)}
              className="flex items-center w-full px-3 py-2 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2A2A35] transition-colors"
            >
              {reasoningExpanded ? <ChevronDown size={14} className="mr-1" /> : <ChevronRight size={14} className="mr-1" />}
              Reasoning Process
            </button>
            <AnimatePresence>
              {reasoningExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-3 pb-3 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-[#3A3A45] pt-2"
                >
                  <div className="markdown-body prose dark:prose-invert prose-sm max-w-none">
                    <ReactMarkdown components={MarkdownComponents}>{reasoning}</ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className={cn(
          "markdown-body prose max-w-none text-[16px] leading-relaxed",
          isUser ? "prose-invert text-white" : "dark:prose-invert text-gray-900 dark:text-[#EAEAEF]"
        )}>
          <ReactMarkdown components={MarkdownComponents}>{content}</ReactMarkdown>
        </div>

        {/* Actions Menu */}
        <AnimatePresence>
          {showActions && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "absolute top-full mt-2 flex items-center gap-1 bg-white dark:bg-[#2A2A35] border border-gray-200 dark:border-[#3A3A45] rounded-lg p-1 shadow-lg z-10 transition-colors duration-300",
                isUser ? "right-0" : "left-0"
              )}
            >
              <button onClick={handleCopy} className="p-2 hover:bg-gray-100 dark:hover:bg-[#3A3A45] rounded-md text-gray-600 dark:text-gray-300 transition-colors" title="Copy">
                <Copy size={16} />
              </button>
              {!isUser && onRegenerate && (
                <button onClick={() => { onRegenerate(); setShowActions(false); }} className="p-2 hover:bg-gray-100 dark:hover:bg-[#3A3A45] rounded-md text-gray-600 dark:text-gray-300 transition-colors" title="Regenerate">
                  <RefreshCw size={16} />
                </button>
              )}
              {onDelete && (
                <button onClick={() => { onDelete(); setShowActions(false); }} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/20 text-red-500 dark:text-red-400 rounded-md transition-colors" title="Delete">
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
