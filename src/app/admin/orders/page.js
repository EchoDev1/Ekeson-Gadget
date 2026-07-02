"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShoppingCart, Loader2, Search, CheckCircle, Clock, XCircle, ChevronRight } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();

    // Subscribe to new orders and changes
    const subscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
        setOrders(prev => [payload.new, ...prev]);
        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
          new Notification("New Order Received!", { body: `Order ID: ${payload.new.id}` });
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, payload => {
         fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (data) setOrders(data);
      if (error) console.warn("Error fetching orders:", error);
    } catch (err) {
      console.warn("Failed to fetch orders natively:", err);
    }
    setLoading(false);
  }

  const updateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.warn("Failed to update status via API:", err);
    }
  };

  // Removed blocking loader for superfast rendering

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-[#00AEEF]" />
            Order Management
          </h1>
          <p className="text-[#1B1B5E]/60 text-sm font-medium tracking-wide mt-1">Review and process customer purchases.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[#1B1B5E]/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F5F5F7] border-b border-[#1B1B5E]/5 text-[#1B1B5E] text-xs font-black uppercase tracking-widest">
              <th className="p-4 pl-6">Order ID</th>
              <th className="p-4">Customer Info</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Payment Status</th>
              <th className="p-4">Order Status</th>
              <th className="p-4 text-right pr-6">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-[#1B1B5E]/40 font-bold uppercase"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#00AEEF]" /></td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-[#1B1B5E]/40 font-bold uppercase">No orders found.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-[#1B1B5E]/5 hover:bg-[#F5F5F7]/50 transition-colors">
                  <td className="p-4 pl-6">
                    <span className="font-mono text-xs text-[#1B1B5E] font-bold bg-[#F5F5F7] px-2 py-1 rounded-lg">
                      {order.id.slice(0,8)}...
                    </span>
                    <p className="text-[10px] text-[#1B1B5E]/50 mt-1 uppercase font-bold">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-[#1B1B5E] text-sm">{order.contact_phone || 'N/A'}</p>
                    <p className="text-xs text-[#1B1B5E]/60 truncate max-w-[200px]" title={order.shipping_address}>
                      {order.shipping_address || 'No address'}
                    </p>
                  </td>
                  <td className="p-4 font-black text-[#00AEEF]">₦{order.total_amount?.toLocaleString() || 0}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      order.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                      order.payment_status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select 
                      value={order.status} 
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="bg-transparent border-none text-xs font-bold uppercase text-[#1B1B5E] outline-none cursor-pointer hover:bg-[#F5F5F7] p-1 rounded-lg"
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
