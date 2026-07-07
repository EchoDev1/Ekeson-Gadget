"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Package, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Fetch orders linked to this user's ID
        const { data } = await supabase.from('orders')
          .select('*, order_items(*)')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        
        if (data) {
          setOrders(data);
        }
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#00AEEF]" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#1B1B5E]/5">
        <h2 className="text-2xl font-black text-[#1B1B5E] uppercase tracking-tighter mb-6 flex items-center gap-2">
          <Package className="w-6 h-6 text-[#00AEEF]" />
          My Orders
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-[#F5F5F7] rounded-2xl border-2 border-dashed border-[#1B1B5E]/10">
            <Package className="w-12 h-12 text-[#1B1B5E]/20 mx-auto mb-4" />
            <h3 className="text-lg font-black text-[#1B1B5E] mb-2">No orders yet</h3>
            <p className="text-[#1B1B5E]/50 font-medium mb-6">Looks like you haven&apos;t made your first purchase.</p>
            <Link href="/" className="bg-[#1B1B5E] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#00AEEF] transition-colors inline-block uppercase tracking-widest text-sm">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-[#F5F5F7] rounded-2xl p-6 border border-[#1B1B5E]/5">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-[#1B1B5E]/5">
                  <div>
                    <p className="text-[10px] font-black text-[#1B1B5E]/50 uppercase tracking-widest mb-1">Order ID</p>
                    <p className="font-bold text-[#1B1B5E]">#{order.id.split('-')[0]}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#1B1B5E]/50 uppercase tracking-widest mb-1">Date</p>
                    <p className="font-bold text-[#1B1B5E]">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#1B1B5E]/50 uppercase tracking-widest mb-1">Total</p>
                    <p className="font-black text-[#00AEEF]">₦{(order.total_amount || 0).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-end sm:items-start">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                      order.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                      order.payment_status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.payment_status === 'paid' ? 'Paid' : order.payment_status || 'Unpaid'}
                    </span>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                      order.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status === 'processing' || order.status === 'pending' || !order.status 
                        ? 'Order Processing' 
                        : order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm">
                      <div className="w-12 h-12 bg-[#F5F5F7] rounded-lg overflow-hidden relative shrink-0">
                        {item.image_url ? (
                          <Image src={item.image_url} alt={item.product_name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">IMG</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#1B1B5E] text-sm truncate">{item.product_name}</p>
                        <p className="text-xs font-black text-[#1B1B5E]/50 uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-black text-[#1B1B5E]">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
