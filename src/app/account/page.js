"use client";
import Link from "next/link";
import { Package, Heart, MapPin, CreditCard, Gift, Bell } from "lucide-react";

export default function AccountOverview() {
  const quickLinks = [
    { label: "My Orders", icon: Package, desc: "Track, return, or buy things again", url: "/account/orders", color: "bg-blue-50 text-blue-600" },
    { label: "Wishlist", icon: Heart, desc: "View and modify your saved items", url: "/account/wishlist", color: "bg-red-50 text-red-600" },
    { label: "Addresses", icon: MapPin, desc: "Edit addresses for orders", url: "/account/addresses", color: "bg-green-50 text-green-600" },
    { label: "Payment Options", icon: CreditCard, desc: "Manage payment methods", url: "/account/payments", color: "bg-purple-50 text-purple-600" },
    { label: "Rewards", icon: Gift, desc: "View your coupons and points", url: "/account/rewards", color: "bg-yellow-50 text-yellow-600" },
    { label: "Notifications", icon: Bell, desc: "Manage your alerts", url: "/account/notifications", color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#1B1B5E] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-2">Welcome to your dashboard</h2>
          <p className="text-white/70 font-medium max-w-xl">From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map((link, idx) => {
          const Icon = link.icon;
          return (
            <Link 
              key={idx}
              href={link.url}
              className="bg-white rounded-3xl p-6 border border-[#1B1B5E]/5 shadow-sm hover:shadow-md hover:border-[#00AEEF]/30 transition-all group flex flex-col gap-4"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${link.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#1B1B5E] tracking-tight">{link.label}</h3>
                <p className="text-[#1B1B5E]/50 text-sm font-medium mt-1">{link.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
