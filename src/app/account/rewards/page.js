"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Gift, Loader2, Award, Copy, CheckCircle } from "lucide-react";

export default function RewardsPage() {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");

  const systemCoupons = [
    { code: "WELCOME10", desc: "10% off your first order", minSpend: 0 },
    { code: "FREESHIP", desc: "Free shipping on orders above ₦500,000", minSpend: 500000 },
    { code: "TECHFEST", desc: "5% off all Gadgets and Accessories", minSpend: 0 },
  ];

  useEffect(() => {
    const fetchRewards = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from('profiles').select('reward_points').eq('id', session.user.id).single();
        if (data) {
          setPoints(data.reward_points || 0);
        }
      }
      setLoading(false);
    };
    fetchRewards();
  }, []);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(""), 2000);
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#00AEEF]" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Points Card */}
      <div className="bg-gradient-to-br from-[#1B1B5E] to-[#00AEEF] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-white/80 uppercase tracking-widest mb-2 flex items-center justify-center md:justify-start gap-2">
              <Award className="w-5 h-5" /> Ekeson Rewards
            </h2>
            <div className="text-5xl md:text-6xl font-black tracking-tighter">
              {points.toLocaleString()} <span className="text-2xl text-white/60">pts</span>
            </div>
            <p className="text-white/80 mt-2 font-medium">Earn 1 point for every ₦1,000 spent.</p>
          </div>
          <button className="bg-white text-[#1B1B5E] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-lg">
            Redeem Points
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#1B1B5E]/5">
        <h2 className="text-2xl font-black text-[#1B1B5E] uppercase tracking-tighter mb-6 flex items-center gap-2">
          <Gift className="w-6 h-6 text-yellow-500" />
          Available Coupons
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemCoupons.map((coupon, idx) => (
            <div key={idx} className="bg-[#F5F5F7] rounded-2xl p-6 border-2 border-dashed border-[#1B1B5E]/10 flex flex-col sm:flex-row items-center gap-4 hover:border-[#00AEEF]/30 transition-colors">
              <div className="flex-1 text-center sm:text-left w-full">
                <p className="font-black text-[#1B1B5E] text-lg">{coupon.desc}</p>
                {coupon.minSpend > 0 && <p className="text-xs font-bold text-[#1B1B5E]/50 uppercase tracking-widest mt-1">Min. spend ₦{coupon.minSpend.toLocaleString()}</p>}
              </div>
              <button 
                onClick={() => copyCode(coupon.code)}
                className="w-full sm:w-auto bg-white border border-[#1B1B5E]/10 rounded-xl px-4 py-3 flex items-center justify-center gap-2 hover:bg-[#1B1B5E] hover:text-white transition-colors group"
              >
                <span className="font-mono font-bold tracking-widest">{coupon.code}</span>
                {copied === coupon.code ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-[#1B1B5E]/40 group-hover:text-white" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
