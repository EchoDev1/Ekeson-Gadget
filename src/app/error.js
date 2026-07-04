'use client';
 
import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';
 
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error('System Antivirus Caught Error:', error);
  }, [error]);
 
  return (
    <div className="min-h-screen bg-[#FFFDF5] flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in duration-500">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-red-100 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h2 className="text-2xl font-black text-[#1B1B5E] tracking-tighter uppercase mb-2">
          System Guard Engaged
        </h2>
        
        <p className="text-[#1B1B5E]/60 text-sm font-medium mb-8 leading-relaxed">
          Our internal system caught an unexpected error. Don't worry, the system has successfully contained it. You can safely restart this page or return home.
        </p>
        
        <div className="flex flex-col w-full gap-3">
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 bg-[#1B1B5E] text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#00AEEF] transition-all shadow-lg hover:shadow-[#00AEEF]/20"
          >
            <RefreshCcw className="w-4 h-4" />
            Repair & Reload
          </button>
          
          <Link 
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-white text-[#1B1B5E] border-2 border-[#1B1B5E]/10 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:border-[#1B1B5E] transition-all"
          >
            <Home className="w-4 h-4" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
