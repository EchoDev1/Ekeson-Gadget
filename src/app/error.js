"use client";

import { useEffect, useState } from "react";
import { AlertCircle, RefreshCw, Home, Send, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/BrandIdentity";

export default function GlobalError({ error, reset }) {
  const [reporting, setReporting] = useState(false);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    // Log the error to console
    console.error("Application crashed:", error);
  }, [error]);

  const handleReportBug = async () => {
    if (reporting || reported) return;
    setReporting(true);
    try {
      await fetch('/api/report-bug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
          digest: error.digest,
          path: window.location.pathname,
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      });
      setReported(true);
    } catch (err) {
      console.error("Failed to report bug:", err);
    } finally {
      setReporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-4">
      <div className="mb-8 animate-in slide-in-from-top-4 duration-700 fade-in">
        <Logo className="h-10" showText={true} />
      </div>
      
      <div className="w-full max-w-lg bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl border border-red-100 text-center relative overflow-hidden animate-in zoom-in-95 duration-500 fade-in">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500" />
        
        <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner rotate-3">
          <AlertCircle className="w-12 h-12 text-red-500 -rotate-3" />
        </div>
        
        <h1 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter mb-4">
          Oops! Something Broke
        </h1>
        <p className="text-[#1B1B5E]/60 text-sm font-medium tracking-wide mb-8">
          We encountered an unexpected error while loading this page. Our team has been notified, but you can also report this specific instance below.
        </p>
        
        <div className="bg-red-50 p-4 rounded-2xl mb-8 text-left border border-red-100 overflow-hidden relative">
          <p className="text-xs font-black text-red-800 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Error Summary
          </p>
          <p className="text-sm font-mono text-red-600 break-words">{error.message || "An unexpected system error occurred."}</p>
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            <button
              onClick={() => reset()}
              className="w-full sm:w-1/2 px-6 py-4 bg-[#1B1B5E] hover:bg-[#00AEEF] text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 group"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Try Again
            </button>
            
            <Link
              href="/"
              className="w-full sm:w-1/2 px-6 py-4 bg-white border-2 border-[#1B1B5E]/10 hover:border-[#1B1B5E] text-[#1B1B5E] hover:bg-[#F5F5F7] rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </div>

          <button
            onClick={handleReportBug}
            disabled={reporting || reported}
            className={`w-full px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border-2 ${
              reported 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-transparent border-[#00AEEF]/20 text-[#00AEEF] hover:bg-[#00AEEF]/5'
            }`}
          >
            {reporting ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Sending Report...</>
            ) : reported ? (
              <><CheckCircle className="w-4 h-4" /> Bug Reported Successfully</>
            ) : (
              <><Send className="w-4 h-4" /> Report This Bug To Admin</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
