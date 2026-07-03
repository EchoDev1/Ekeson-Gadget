"use client";

import Link from "next/link";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-[#F5F5F7] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl border border-[#1B1B5E]/5 text-center relative overflow-hidden animate-in zoom-in-95 duration-500 fade-in">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#00AEEF] to-[#1B1B5E]" />
        
        <div className="text-[120px] font-black leading-none text-[#1B1B5E]/5 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          404
        </div>
        
        <div className="relative z-10">
          <div className="w-24 h-24 bg-[#00AEEF]/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner rotate-3">
            <Search className="w-12 h-12 text-[#00AEEF] -rotate-3" />
          </div>
          
          <h1 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter mb-4">
            Page Not Found
          </h1>
          <p className="text-[#1B1B5E]/60 text-sm font-medium tracking-wide mb-8">
            The page you're looking for doesn't exist or has been moved. Let's get you back to browsing our premium gadgets.
          </p>
          
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="w-full px-6 py-4 bg-[#1B1B5E] hover:bg-[#00AEEF] text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 group"
            >
              <Home className="w-4 h-4" />
              Return to Homepage
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="w-full px-6 py-4 bg-transparent border-2 border-[#1B1B5E]/10 hover:border-[#1B1B5E]/30 text-[#1B1B5E] hover:bg-[#F5F5F7] rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
