import { HeadphonesIcon } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#1B1B5E]/5 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <HeadphonesIcon className="w-10 h-10 text-[#00AEEF]" />
        </div>
        <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter mb-2">Customer Support</h2>
        <p className="text-[#1B1B5E]/60 font-medium max-w-md mx-auto mb-8">
          Need help with an order or have a question? Our support team is ready to assist you.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="mailto:support@ekesontech.com" className="bg-[#1B1B5E] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#00AEEF] transition-colors text-sm uppercase tracking-widest">
            Email Support
          </Link>
          <div className="bg-[#F5F5F7] text-[#1B1B5E] px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest border border-[#1B1B5E]/10">
            Call: +234 800 000 0000
          </div>
        </div>
      </div>
    </div>
  );
}
