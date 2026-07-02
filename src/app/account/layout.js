"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { User, Package, Heart, MapPin, CreditCard, Gift, Bell, HeadphonesIcon, Settings, ScrollText, LogOut, ChevronRight, Loader2 } from "lucide-react";

export default function AccountLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login?redirect=/account");
        return;
      }
      setSession(session);

      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setProfile(data);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#00AEEF]" />
      </div>
    );
  }

  const navLinks = [
    { label: "Overview", url: "/account", icon: User, exact: true },
    { label: "My Profile", url: "/account/profile", icon: Settings, exact: false },
    { label: "My Orders", url: "/account/orders", icon: Package, exact: false },
    { label: "Wishlist", url: "/account/wishlist", icon: Heart, exact: false },
    { label: "Addresses", url: "/account/addresses", icon: MapPin, exact: false },
    { label: "Payment Methods", url: "/account/payments", icon: CreditCard, exact: false },
    { label: "Coupons & Rewards", url: "/account/rewards", icon: Gift, exact: false },
    { label: "Notifications", url: "/account/notifications", icon: Bell, exact: false },
    { label: "Customer Support", url: "/account/support", icon: HeadphonesIcon, exact: false },
    { label: "Policies", url: "/account/policies", icon: ScrollText, exact: false },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-24 md:pb-12 pt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-[#1B1B5E] uppercase tracking-tighter">My Account</h1>
            <p className="text-[#1B1B5E]/60 font-medium mt-1">Manage your orders, profile, and preferences.</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 pr-6 rounded-full shadow-sm border border-[#1B1B5E]/5 w-max">
            <div className="w-10 h-10 rounded-full bg-[#1B1B5E] text-white flex items-center justify-center font-black">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <p className="text-sm font-black text-[#1B1B5E]">{profile?.full_name || 'User'}</p>
              <p className="text-[10px] font-bold text-[#1B1B5E]/40 uppercase tracking-widest">{session?.user?.email}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Sidebar Navigation */}
          <div className="hidden lg:block w-72 shrink-0 space-y-2 sticky top-28">
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#1B1B5E]/5 flex flex-col gap-1">
              {navLinks.map((link, idx) => {
                const Icon = link.icon;
                const isActive = link.exact ? pathname === link.url : pathname.startsWith(link.url);
                return (
                  <Link 
                    key={idx} 
                    href={link.url}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                      isActive 
                        ? 'bg-[#1B1B5E] text-white shadow-md' 
                        : 'text-[#1B1B5E]/60 hover:bg-[#F5F5F7] hover:text-[#00AEEF]'
                    }`}
                  >
                    <div className="flex items-center gap-3 font-bold text-sm">
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                  </Link>
                );
              })}
              
              <div className="my-2 border-t border-[#1B1B5E]/5"></div>
              
              <button 
                onClick={() => supabase.auth.signOut()}
                className="flex items-center gap-3 p-3 rounded-2xl text-red-500 hover:bg-red-50 font-bold text-sm transition-all text-left uppercase tracking-widest"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </div>
          </div>

          {/* Mobile Horizontal Scroll Navigation */}
          <div className="lg:hidden -mx-4 px-4 overflow-x-auto hide-scrollbar sticky top-20 z-40 bg-[#F5F5F7] py-2">
            <div className="flex gap-2 w-max pb-2">
              {navLinks.map((link, idx) => {
                const Icon = link.icon;
                const isActive = link.exact ? pathname === link.url : pathname.startsWith(link.url);
                return (
                  <Link 
                    key={idx} 
                    href={link.url}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all text-xs font-black uppercase tracking-widest ${
                      isActive 
                        ? 'bg-[#1B1B5E] text-white shadow-md' 
                        : 'bg-white text-[#1B1B5E]/60 border border-[#1B1B5E]/5 shadow-sm'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}
