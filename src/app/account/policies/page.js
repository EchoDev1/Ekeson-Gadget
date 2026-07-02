"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ScrollText, Loader2, ShieldCheck, Truck } from "lucide-react";

export default function PoliciesPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (data) setSettings(data);
      setLoading(false);
    };
    fetchPolicies();
  }, []);

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#00AEEF]" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#1B1B5E]/5">
        <h2 className="text-2xl font-black text-[#1B1B5E] uppercase tracking-tighter mb-8 flex items-center gap-2">
          <ScrollText className="w-6 h-6 text-indigo-500" />
          Store Policies
        </h2>

        <div className="space-y-8">
          
          <div className="bg-[#F5F5F7] p-6 md:p-8 rounded-2xl border border-[#1B1B5E]/5">
            <h3 className="font-black text-[#1B1B5E] text-lg flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5 text-[#00AEEF]" /> Delivery & Shipping
            </h3>
            <div className="prose prose-sm max-w-none text-[#1B1B5E]/70 font-medium whitespace-pre-wrap">
              {settings?.delivery_info || "Shipping information is currently being updated. Please contact support."}
            </div>
          </div>

          <div className="bg-[#F5F5F7] p-6 md:p-8 rounded-2xl border border-[#1B1B5E]/5">
            <h3 className="font-black text-[#1B1B5E] text-lg flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-green-500" /> Return & Refund Policy
            </h3>
            <div className="prose prose-sm max-w-none text-[#1B1B5E]/70 font-medium whitespace-pre-wrap">
              {settings?.return_policy || "Return policy details are currently being updated. Please contact support."}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
