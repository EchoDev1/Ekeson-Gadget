"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl border border-red-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-[#1B1B5E]" />
            
            <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner rotate-3">
              <AlertCircle className="w-12 h-12 text-red-500 -rotate-3" />
            </div>
            
            <h1 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter mb-4">
              Critical System Error
            </h1>
            <p className="text-[#1B1B5E]/60 text-sm font-medium tracking-wide mb-8">
              A fatal error occurred at the layout level. The application failed to render.
            </p>
            
            <button
              onClick={() => reset()}
              className="w-full px-6 py-4 bg-[#1B1B5E] hover:bg-[#00AEEF] text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 group"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Hard Restart
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
