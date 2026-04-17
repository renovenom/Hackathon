import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { motion } from 'motion/react';
import { Hexagon, Lock } from 'lucide-react';

export function LoginScreen() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F7] dark:bg-[#1E1E2E] font-sans p-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full bg-white dark:bg-[#2A2A35] rounded-3xl p-8 shadow-xl text-center border border-gray-200 dark:border-white/5"
      >
        <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-black/10 dark:shadow-white/10">
          <Hexagon className="text-white dark:text-black" size={32} />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to Venom AI
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-[0.9375rem] leading-relaxed">
          Sign in to save your chat history securely, access powerful AI models, and sync across your devices.
        </p>

        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black transition-colors py-3.5 px-4 rounded-xl font-medium"
        >
          <Lock size={18} />
          Sign in with Google
        </button>
      </motion.div>
    </div>
  );
}
