"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/BrandIdentity";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application crashed:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Logo className="h-10" showText={true} />
      </div>
      
      <div className="w-full max-w-lg bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl border border-red-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
        
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter mb-4">
          Oops! Something Broke
        </h1>
        
        <div className="bg-red-50 p-4 rounded-xl mb-8 text-left border border-red-100 overflow-auto">
          <p className="text-xs font-bold text-red-800 uppercase tracking-widest mb-2">Error Details:</p>
          <p className="text-sm font-mono text-red-600 break-words">{error.message || "An unexpected error occurred."}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-8 py-4 bg-[#1B1B5E] hover:bg-[#00AEEF] text-white rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 group"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-[#1B1B5E]/10 hover:border-[#1B1B5E] text-[#1B1B5E] rounded-full font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
