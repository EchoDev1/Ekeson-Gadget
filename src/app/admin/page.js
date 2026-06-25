"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Package, ShoppingCart, DollarSign, Activity } from "lucide-react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

let cachedStats = null;

export default function AdminDashboard() {
  const [stats, setStats] = useState(cachedStats || {
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    newMessages: 0,
    revenueData: [],
    categoryData: []
  });
  const [dbStatus, setDbStatus] = useState("checking"); // 'checking', 'connected', 'error'

  useEffect(() => {
    // In a real scenario with proper RLS and populated database, we fetch counts:
    const fetchStats = async () => {
      try {
        const startPing = Date.now();
        const [productsRes, ordersRes, messagesRes] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact' }),
          supabase.from('orders').select('*'),
          supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false).eq('sender', 'user')
        ]);
        
        let totalRev = 0;
        const revByDate = {};
        const orders = ordersRes.data || [];
        
        orders.forEach(o => {
          totalRev += Number(o.total_amount || 0);
          const date = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          revByDate[date] = (revByDate[date] || 0) + Number(o.total_amount || 0);
        });

        const revenueData = Object.keys(revByDate).map(date => ({
          date,
          revenue: revByDate[date]
        }));

        // Mock category data for now since we don't have order_items join handy
        const categoryData = [
          { name: 'Phones', sales: 40 },
          { name: 'Laptops', sales: 30 },
          { name: 'Accessories', sales: 20 },
          { name: 'Pads', sales: 10 },
        ];

        const newStats = {
          totalProducts: productsRes.count || 0,
          totalOrders: orders.length || 0,
          totalRevenue: totalRev,
          newMessages: messagesRes.count || 0,
          revenueData: revenueData.length > 0 ? revenueData : [{ date: 'Today', revenue: 0 }],
          categoryData
        };
        setStats(newStats);
        cachedStats = newStats;
        setDbStatus("connected");
      } catch (error) {
        console.warn("Error fetching stats:", error);
        setDbStatus("error");
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-[#1B1B5E] uppercase tracking-wider">Dashboard Overview</h2>
        
        {/* Database Connection Status Widget */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#1B1B5E]/10 shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#1B1B5E]/50 mr-2">System Status:</div>
          {dbStatus === "checking" && (
            <span className="flex items-center gap-2 text-xs font-bold text-yellow-500">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span> Pinging Backend...
            </span>
          )}
          {dbStatus === "connected" && (
            <span className="flex items-center gap-2 text-xs font-bold text-green-500">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse"></span> Database Connected
            </span>
          )}
          {dbStatus === "error" && (
            <span className="flex items-center gap-2 text-xs font-bold text-red-500">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> Connection Failed
            </span>
          )}
        </div>
      </div>
      
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

        {/* Charts Section */}
        <div className="bg-white p-8 rounded-3xl border border-[#1B1B5E]/5 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-[#1B1B5E] uppercase tracking-wider">Revenue Overview</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `₦${(val/1000)}k`} />
                <RechartsTooltip cursor={{ stroke: '#E5E7EB', strokeWidth: 2 }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="revenue" stroke="#00AEEF" strokeWidth={3} dot={{ r: 4, fill: '#00AEEF', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Category Sales Chart */}
      <div className="bg-white p-8 rounded-3xl border border-[#1B1B5E]/5 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-[#1B1B5E] uppercase tracking-wider">Top Selling Categories</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.categoryData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#1B1B5E', fontWeight: 'bold' }} width={100} />
              <RechartsTooltip cursor={{ fill: '#F5F5F7' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="sales" fill="#1B1B5E" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
