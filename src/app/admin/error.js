"use client";

import { AlertOctagon, RefreshCw } from "lucide-react";

export default function AdminError({ error, reset }) {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-lg border border-red-100 text-center relative overflow-hidden animate-in zoom-in-95 duration-500 fade-in">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
        
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertOctagon className="w-8 h-8 text-red-500" />
        </div>
        
        <h2 className="text-xl font-black text-[#1B1B5E] uppercase tracking-tighter mb-2">
          Dashboard Component Failed
        </h2>
        <p className="text-[#1B1B5E]/60 text-xs font-medium mb-6">
          A specific part of the admin dashboard crashed. The rest of the system is unaffected.
        </p>

        <div className="bg-[#F5F5F7] p-3 rounded-xl mb-6 text-left border border-[#1B1B5E]/5">
          <p className="text-[10px] font-mono text-red-600 break-words line-clamp-3">
            {error.message || "Unknown error occurred"}
          </p>
        </div>
        
        <button
          onClick={() => reset()}
          className="w-full px-6 py-3 bg-[#1B1B5E] hover:bg-red-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 group"
        >
          <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
          Reload Component
        </button>
      </div>
    </div>
  );
}
