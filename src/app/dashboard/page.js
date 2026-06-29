"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User, Package, LogOut, ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth/login");
        return;
      }
      setUser(session.user);
      
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setProfile(profileData);

      const { data: orderData } = await supabase.from('orders').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
      setOrders(orderData || []);
      
      setLoading(false);
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (loading) {
    return <div className="min-h-screen bg-[#F7F3E9] flex items-center justify-center">Loading portal...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F7F3E9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-[#1B1B5E] rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00AEEF]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                Welcome, {profile?.full_name || user?.email?.split('@')[0]}
              </h1>
              <p className="text-[#00AEEF] font-bold text-sm tracking-widest uppercase mt-1">Elite Member</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="mt-6 md:mt-0 relative z-10 flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all backdrop-blur-md border border-white/10"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#1B1B5E]/5">
              <h2 className="text-[#1B1B5E] font-black uppercase tracking-wider mb-6 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#00AEEF]" /> Profile
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[#1B1B5E]/50 font-bold uppercase tracking-widest mb-1">Email</p>
                  <p className="text-[#1B1B5E] font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-[#1B1B5E]/50 font-bold uppercase tracking-widest mb-1">Role</p>
                  <p className="text-[#1B1B5E] font-medium capitalize">{profile?.role}</p>
                </div>
                {profile?.role === 'admin' && (
                  <Link href="/admin" className="mt-4 block text-center bg-[#00AEEF] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">
                    Go to Admin Portal
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#1B1B5E]/5">
              <h2 className="text-[#1B1B5E] font-black uppercase tracking-wider mb-6 flex items-center gap-3">
                <Package className="w-5 h-5 text-[#00AEEF]" /> Order History
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-12 bg-[#F5F5F7] rounded-2xl">
                  <Package className="w-12 h-12 text-[#1B1B5E]/20 mx-auto mb-4" />
                  <p className="text-[#1B1B5E]/60 font-medium">You haven&apos;t placed any orders yet.</p>
                  <Link href="/" className="inline-block mt-4 text-[#00AEEF] font-bold text-sm hover:underline">Start Shopping</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="border border-[#1B1B5E]/10 rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div>
                          <p className="text-xs text-[#1B1B5E]/50 font-bold uppercase tracking-widest">Order ID</p>
                          <p className="text-[#1B1B5E] font-mono text-sm mt-1">{order.id.split('-')[0]}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#1B1B5E]/50 font-bold uppercase tracking-widest">Date</p>
                          <p className="text-[#1B1B5E] font-medium text-sm mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#1B1B5E]/50 font-bold uppercase tracking-widest">Amount</p>
                          <p className="text-[#1B1B5E] font-bold mt-1">₦{Number(order.total_amount).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                           <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                             order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                             order.status === 'processing' ? 'bg-orange-100 text-orange-700' :
                             'bg-blue-100 text-blue-700'
                           }`}>
                             {order.status}
                           </span>
                        </div>
                      </div>
                      {order.shipping_address && (
                        <div className="flex items-start gap-2 pt-4 border-t border-[#1B1B5E]/5 mt-4">
                          <MapPin className="w-4 h-4 text-[#1B1B5E]/40 mt-0.5" />
                          <p className="text-sm text-[#1B1B5E]/70">{order.shipping_address}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
