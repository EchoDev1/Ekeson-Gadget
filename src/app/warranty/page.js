"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function WarrantyPage() {
  const [policyText, setPolicyText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPolicy() {
      const { data, error } = await supabase
        .from('settings')
        .select('warranty_policy_text')
        .eq('id', 1)
        .single();
      
      if (!error && data) {
        setPolicyText(data.warranty_policy_text);
      }
      setLoading(false);
    }
    fetchPolicy();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F3E9] pt-24 md:pt-32 pb-16 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        <div className="text-center mb-10 md:mb-16">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-white text-[#00AEEF] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-2xl border border-[#1B1B5E]/5">
            <ShieldCheck className="w-8 h-8 md:w-12 md:h-12" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[#1B1B5E] tracking-tighter uppercase mb-3 md:mb-4">
            Warranty <span className="text-[#00AEEF]">Policy</span>
          </h1>
          <p className="text-[#1B1B5E]/60 font-medium max-w-2xl mx-auto text-sm md:text-lg px-2">
            We stand behind the quality of every product we sell. Read our comprehensive warranty coverage below.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 shadow-xl border border-[#1B1B5E]/5 relative">
          <div className="absolute top-12 left-12 w-20 h-20 bg-[#00AEEF]/5 rounded-full blur-2xl hidden md:block" />
          <div className="absolute bottom-12 right-12 w-32 h-32 bg-[#1B1B5E]/5 rounded-full blur-3xl hidden md:block" />
          
          <div className="relative z-10 prose prose-sm md:prose-lg prose-blue max-w-none">
            {loading ? (
              <div className="flex justify-center items-center py-20 text-[#1B1B5E]/30">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <div className="text-[#1B1B5E]/80 whitespace-pre-wrap font-medium leading-relaxed text-sm md:text-lg">
                {policyText || "Our premium items come with a standard 1-Year warranty directly from our global partners. For more details, please contact technical support."}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
