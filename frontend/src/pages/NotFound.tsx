import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Activity } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans selection:bg-[#111111] selection:text-white flex flex-col relative overflow-hidden">
      <nav className="border-b border-gray-200 p-6 flex justify-between items-center relative z-10 bg-white/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-[#111111] rounded-xl shadow-sm overflow-hidden shrink-0">
            <img src="/assets/icons/logo.webp" alt="Marzia Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-serif italic tracking-tight">Marzia</h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mt-0.5 font-bold">Optics Engine v2.0</p>
          </div>
        </Link>
      </nav>
      
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gray-50 border border-gray-200 text-[#111111] mb-8">
            <Activity size={40} className="opacity-50" />
          </div>
          
          <h2 className="text-8xl md:text-9xl font-serif italic tracking-tight leading-[0.9] mb-6 text-gray-200">
            404
          </h2>
          <h3 className="text-3xl md:text-4xl font-serif italic text-[#111111] mb-6">
            Lost in the Spectrum
          </h3>
          
          <p className="text-lg text-gray-600 font-sans leading-relaxed mb-10 max-w-lg mx-auto">
            The wavelength you're looking for has been completely absorbed. It looks like this page doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/" className="flex items-center justify-center gap-3 bg-[#111111] text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all shadow-md text-lg group w-full sm:w-auto">
              <Home className="w-5 h-5" />
              <span className="font-serif italic">Return Home</span>
            </Link>
            <Link to="/editor" className="flex items-center justify-center gap-3 bg-white text-[#111111] border border-gray-200 px-8 py-4 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm text-lg group w-full sm:w-auto">
              <span className="font-serif italic">Launch App</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </main>

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex justify-center items-center opacity-[0.03]">
        <div className="w-[150vw] h-[150vw] rounded-full border-[1px] border-[#111111] animate-[spin_120s_linear_infinite]" />
        <div className="absolute w-[100vw] h-[100vw] rounded-full border-[1px] border-[#111111] animate-[spin_90s_linear_infinite_reverse]" />
        <div className="absolute w-[50vw] h-[50vw] rounded-full border-[1px] border-[#111111] animate-[spin_60s_linear_infinite]" />
      </div>
    </div>
  );
}
