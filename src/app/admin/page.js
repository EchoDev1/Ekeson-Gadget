"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Package, ShoppingCart, DollarSign, Activity } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    newMessages: 0
  });

  useEffect(() => {
    // In a real scenario with proper RLS and populated database, we fetch counts:
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, messagesRes] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('*', { count: 'exact', head: true }),
          supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false).eq('sender', 'user')
        ]);
        
        setStats({
          totalProducts: productsRes.count || 0,
          totalOrders: ordersRes.count || 0,
          totalRevenue: 0, // Would sum up completed orders total_amount
          newMessages: messagesRes.count || 0
        });
      } catch (error) {
        console.warn("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Products", value: stats.totalProducts, icon: Package, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-green-500", bg: "bg-green-50" },
          { label: "Unread Messages", value: stats.newMessages, icon: Activity, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Total Revenue", value: `₦${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-purple-500", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-[#1B1B5E]/5 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[#1B1B5E]/40 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
              <h3 className="text-3xl font-black text-[#1B1B5E] tracking-tighter mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white p-8 rounded-3xl border border-[#1B1B5E]/5 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-[#1B1B5E] uppercase tracking-wider flex items-center gap-3">
            <Activity className="w-6 h-6 text-[#00AEEF]" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/products" className="p-4 border border-[#1B1B5E]/10 rounded-2xl hover:border-[#00AEEF] hover:bg-[#00AEEF]/5 transition-colors group">
              <Package className="w-8 h-8 mb-3 text-[#1B1B5E]/60 group-hover:text-[#00AEEF]" />
              <h4 className="font-bold text-[#1B1B5E]">Add New Product</h4>
              <p className="text-xs text-[#1B1B5E]/60 mt-1">Update inventory</p>
            </Link>
            <Link href="/admin/settings" className="p-4 border border-[#1B1B5E]/10 rounded-2xl hover:border-[#00AEEF] hover:bg-[#00AEEF]/5 transition-colors group">
              <DollarSign className="w-8 h-8 mb-3 text-[#1B1B5E]/60 group-hover:text-[#00AEEF]" />
              <h4 className="font-bold text-[#1B1B5E]">Update Crypto</h4>
              <p className="text-xs text-[#1B1B5E]/60 mt-1">Change USDT address</p>
            </Link>
          </div>
        </div>

        {/* Recent Activity Mock */}
        <div className="bg-white p-8 rounded-3xl border border-[#1B1B5E]/5 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-[#1B1B5E] uppercase tracking-wider">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-green-50 border border-green-100">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <div>
                <h4 className="font-bold text-green-900 text-sm">Database Connected</h4>
                <p className="text-xs text-green-700">Supabase link active</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
              <div>
                <h4 className="font-bold text-blue-900 text-sm">Realtime Active</h4>
                <p className="text-xs text-blue-700">Listening for new messages</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
