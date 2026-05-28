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

  const getProgressWidth = () => {
    if (!order) return '0%';
    if (order.status === 'processing') return '0%';
    if (order.status === 'shipped') return '50%';
    if (order.status === 'delivered') return '100%';
    return '0%';
  };

  return (
    <div className="min-h-screen bg-[#F7F3E9] pt-24 md:pt-32 pb-16 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        
        <div className="text-center mb-10 md:mb-16">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#1B1B5E] text-[#00AEEF] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-2xl">
            <Package className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[#1B1B5E] tracking-tighter uppercase mb-3 md:mb-4">
            Track <span className="text-[#00AEEF]">Order</span>
          </h1>
          <p className="text-[#1B1B5E]/60 font-medium text-sm md:text-lg px-2">
            Enter your order ID below to see real-time updates on your shipment status.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl border border-[#1B1B5E]/5 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-bl from-[#00AEEF]/5 to-transparent rounded-bl-full pointer-events-none" />
          
          <form onSubmit={handleTrack} className="relative z-10">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
                  className="w-full px-5 md:px-6 py-4 md:py-5 bg-[#F5F5F7] border border-transparent rounded-2xl md:rounded-full text-[#1B1B5E] focus:bg-white focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10 transition-all outline-none font-mono text-sm md:text-base text-center sm:text-left"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#1B1B5E] text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#00AEEF] transition-all duration-300 shadow-lg hover:-translate-y-1 flex justify-center items-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Track <Search className="w-4 h-4" /></>}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 md:mt-8 p-4 bg-red-50 text-red-600 rounded-xl md:rounded-2xl text-center text-sm font-medium border border-red-100 relative z-10 animate-in fade-in">
              {error}
            </div>
          )}

          {order && (
            <div className="mt-8 md:mt-12 pt-8 md:pt-12 border-t border-[#1B1B5E]/5 relative z-10 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 md:p-6 bg-[#F5F5F7] rounded-2xl md:rounded-3xl border border-[#1B1B5E]/5 mb-8">
                <div>
                  <p className="text-[9px] md:text-[10px] font-black text-[#1B1B5E]/40 uppercase tracking-widest mb-1">Order ID</p>
                  <p className="font-mono text-[10px] md:text-xs font-bold text-[#1B1B5E] break-all">{order.id}</p>
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] font-black text-[#1B1B5E]/40 uppercase tracking-widest mb-1">Date</p>
                  <p className="text-xs md:text-sm font-bold text-[#1B1B5E]">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className={`px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="relative pt-4 pb-4">
                {/* Vertical Line */}
                <div className="absolute left-6 md:left-8 top-8 bottom-8 w-0.5 bg-[#1B1B5E]/10" />

                <div className="space-y-8 md:space-y-12">
                  <div className="relative flex items-center gap-4 md:gap-6">
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${order.status !== 'cancelled' ? 'bg-[#00AEEF] text-white shadow-lg shadow-[#00AEEF]/20' : 'bg-gray-200 text-gray-400'}`}>
                      <Package className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-[#1B1B5E] uppercase tracking-wider text-base md:text-lg">Order Processing</h3>
                      <p className="text-xs md:text-sm text-[#1B1B5E]/60 font-medium">Your order has been received and is being prepared.</p>
                    </div>
                  </div>

                  <div className="relative flex items-center gap-4 md:gap-6">
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${['shipped', 'delivered'].includes(order.status) ? 'bg-[#00AEEF] text-white shadow-lg shadow-[#00AEEF]/20' : 'bg-white border-2 border-[#1B1B5E]/10 text-[#1B1B5E]/30'}`}>
                      <Truck className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h3 className={`font-black uppercase tracking-wider text-base md:text-lg ${['shipped', 'delivered'].includes(order.status) ? 'text-[#1B1B5E]' : 'text-[#1B1B5E]/40'}`}>Out for Delivery</h3>
                      <p className="text-xs md:text-sm text-[#1B1B5E]/60 font-medium">Your package is with our delivery partners.</p>
                    </div>
                  </div>

                  <div className="relative flex items-center gap-4 md:gap-6">
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${order.status === 'delivered' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-white border-2 border-[#1B1B5E]/10 text-[#1B1B5E]/30'}`}>
                      <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h3 className={`font-black uppercase tracking-wider text-base md:text-lg ${order.status === 'delivered' ? 'text-[#1B1B5E]' : 'text-[#1B1B5E]/40'}`}>Delivered</h3>
                      <p className="text-xs md:text-sm text-[#1B1B5E]/60 font-medium">Package has been successfully delivered to you.</p>
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
