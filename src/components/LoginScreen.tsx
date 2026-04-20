import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { motion } from 'motion/react';
import { Sparkles, User, Key, LogIn, UserPlus, ArrowLeft } from 'lucide-react';

interface LoginScreenProps {
  onBack?: () => void;
}

export function LoginScreen({ onBack }: LoginScreenProps) {
  const { loginLocal, registerLocal } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!id.trim() || !password.trim()) {
      setError("Please enter both ID and Password");
      return;
    }

    try {
      if (isRegistering) {
        registerLocal(id.trim(), password);
      } else {
        loginLocal(id.trim(), password);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F0F4F9] dark:bg-[#131314] font-sans p-4 transition-colors duration-300">
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 p-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full bg-white dark:bg-[#1e1e24] rounded-3xl p-8 shadow-sm text-center border border-transparent dark:border-[#2a2a35]"
      >
        <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
          <Sparkles className="text-white" size={32} />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {isRegistering ? "Create your Account" : "Welcome to Gemini Clone"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-[0.9375rem] leading-relaxed">
          {isRegistering 
            ? "Register a local account to save your chat history." 
            : "Sign in to save your chat history securely and access powerful AI models."}
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm py-2 px-3 rounded-lg mb-6 text-left flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Username or Email"
              className="w-full bg-[#f0f4f9] dark:bg-[#131314] text-gray-900 dark:text-white border border-transparent dark:border-[#2a2a35] rounded-xl py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Key size={18} className="text-gray-400" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#f0f4f9] dark:bg-[#131314] text-gray-900 dark:text-white border border-transparent dark:border-[#2a2a35] rounded-xl py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors py-3 px-4 rounded-xl font-medium"
          >
            {isRegistering ? <UserPlus size={18} /> : <LogIn size={18} />}
            {isRegistering ? "Register Account" : "Sign in to Account"}
          </button>
        </form>

        <button
          onClick={() => setIsRegistering(!isRegistering)}
          type="button"
          className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          {isRegistering 
            ? "Already have an account? Sign in" 
            : "Don't have an account? Register here"}
        </button>
      </motion.div>
    </div>
  );
}
