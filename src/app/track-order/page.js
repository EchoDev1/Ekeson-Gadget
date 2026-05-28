"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Loader2, Package, Truck, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(orderId.trim())) {
        throw new Error("Invalid Order ID format. Please check the ID from your receipt.");
      }

      // Call our secure RPC function to get order status safely
      const { data, error: rpcError } = await supabase.rpc('get_order_status', {
        p_order_id: orderId.trim()
      });

      if (rpcError) throw rpcError;
      
      if (!data) {
        throw new Error("Order not found. Please verify your Order ID.");
      }

      setOrder(data);
    } catch (err) {
      setError(err.message || "Failed to retrieve order status.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'text-amber-500 bg-amber-50 border-amber-200';
      case 'shipped': return 'text-[#00AEEF] bg-[#00AEEF]/5 border-[#00AEEF]/20';
      case 'delivered': return 'text-green-500 bg-green-50 border-green-200';
      case 'cancelled': return 'text-red-500 bg-red-50 border-red-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3E9] pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#1B1B5E] tracking-tighter uppercase mb-4">
            Track <span className="text-[#00AEEF]">Order</span>
          </h1>
          <p className="text-[#1B1B5E]/60 font-medium max-w-lg mx-auto">
            Enter your unique Order ID below to check the real-time status of your premium delivery.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-[#1B1B5E]/5">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1B1B5E]/30" />
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                className="w-full pl-14 pr-6 py-5 bg-[#F5F5F7] border border-transparent rounded-full text-[#1B1B5E] placeholder-[#1B1B5E]/40 focus:bg-white focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10 transition-all outline-none font-mono text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !orderId}
              className="bg-[#1B1B5E] text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#00AEEF] transition-all duration-300 shadow-lg hover:-translate-y-1 flex justify-center items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Track"}
            </button>
          </form>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 text-center animate-in fade-in">
              {error}
            </div>
          )}

          {order && (
            <div className="mt-12 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-[#F5F5F7] rounded-3xl border border-[#1B1B5E]/5">
                <div>
                  <p className="text-[10px] font-black text-[#1B1B5E]/40 uppercase tracking-widest mb-1">Order ID</p>
                  <p className="font-mono text-xs font-bold text-[#1B1B5E]">{order.id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#1B1B5E]/40 uppercase tracking-widest mb-1">Date</p>
                  <p className="text-sm font-bold text-[#1B1B5E]">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="relative pt-8 pb-4">
                <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-[#1B1B5E]/10" />

                <div className="space-y-12">
                  <div className="relative flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 z-10 ${order.status !== 'cancelled' ? 'bg-[#00AEEF] text-white shadow-lg shadow-[#00AEEF]/20' : 'bg-gray-200 text-gray-400'}`}>
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-[#1B1B5E] uppercase tracking-wider text-lg">Order Processing</h3>
                      <p className="text-sm text-[#1B1B5E]/60 font-medium">Your order has been received and is being prepared.</p>
                    </div>
                  </div>

                  <div className="relative flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 z-10 ${['shipped', 'delivered'].includes(order.status) ? 'bg-[#00AEEF] text-white shadow-lg shadow-[#00AEEF]/20' : 'bg-white border-2 border-[#1B1B5E]/10 text-[#1B1B5E]/30'}`}>
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className={`font-black uppercase tracking-wider text-lg ${['shipped', 'delivered'].includes(order.status) ? 'text-[#1B1B5E]' : 'text-[#1B1B5E]/40'}`}>Out for Delivery</h3>
                      <p className="text-sm text-[#1B1B5E]/60 font-medium">Your package is with our delivery partners.</p>
                    </div>
                  </div>

                  <div className="relative flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 z-10 ${order.status === 'delivered' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-white border-2 border-[#1B1B5E]/10 text-[#1B1B5E]/30'}`}>
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className={`font-black uppercase tracking-wider text-lg ${order.status === 'delivered' ? 'text-[#1B1B5E]' : 'text-[#1B1B5E]/40'}`}>Delivered</h3>
                      <p className="text-sm text-[#1B1B5E]/60 font-medium">Package has been successfully delivered to you.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
