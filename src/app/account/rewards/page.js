import { Gift } from "lucide-react";

export default function RewardsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#1B1B5E]/5 text-center">
        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Gift className="w-10 h-10 text-yellow-500" />
        </div>
        <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter mb-2">Coupons & Rewards</h2>
        <p className="text-[#1B1B5E]/60 font-medium max-w-md mx-auto mb-8">
          Earn points on purchases and redeem exclusive coupons. Our loyalty program is launching soon!
        </p>
        <div className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-xs font-black uppercase tracking-widest">
          Coming Soon
        </div>
      </div>
    </div>
  );
}
