"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShoppingCart, Loader2, Search, CheckCircle, Clock, XCircle, ChevronRight } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  async function fetchOrders() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setOrders(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchOrders();

    // Subscribe to new orders and changes
    const channelName = `admin_orders_page_${Date.now()}`;
    const subscription = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
        if (payload.eventType === 'INSERT') {
          setOrders(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setOrders(prev => prev.map(order => order.id === payload.new.id ? payload.new : order));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

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

  const updatePaymentStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}/payment_status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, payment_status: status } : o));
      } else {
        alert("Failed to update payment status");
      }
    } catch (err) {
      console.warn("Failed to update payment status via API:", err);
    }
  };

  const viewOrderDetails = async (order) => {
    setSelectedOrder(order);
    setLoadingItems(true);
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*, products(name, image_url)')
        .eq('order_id', order.id);
      
      if (data) setOrderItems(data);
    } catch (err) {
      console.error("Failed to fetch order items:", err);
    }
    setLoadingItems(false);
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
                      {order.shipping_address?.split(' | Method: ')[0] || 'No address'}
                    </p>
                    {order.shipping_address?.includes(' | Method: ') && (
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#00AEEF] bg-[#00AEEF]/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                        Paid via {order.shipping_address.split(' | Method: ')[1]}
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-black text-[#00AEEF]">₦{order.total_amount?.toLocaleString() || 0}</td>
                  <td className="p-4">
                    <select 
                      value={order.payment_status} 
                      onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                      className={`bg-transparent border-none text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:bg-[#F5F5F7] p-1.5 rounded-lg ${
                        order.payment_status === 'paid' ? 'text-green-700' :
                        order.payment_status === 'failed' ? 'text-red-700' :
                        'text-orange-700'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
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
                    <button onClick={() => viewOrderDetails(order)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B1B5E]/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-6 right-6 text-[#1B1B5E]/40 hover:text-red-500 transition-colors">
              <XCircle className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-black text-[#1B1B5E] uppercase tracking-tighter mb-2 flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-[#00AEEF]" />
              Order Items
            </h2>
            <p className="text-[#1B1B5E]/60 text-xs font-bold uppercase tracking-widest mb-6">
              Order ID: <span className="text-[#1B1B5E]">{selectedOrder.id.split('-')[0]}</span>
            </p>

            {loadingItems ? (
              <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#00AEEF]" /></div>
            ) : orderItems.length === 0 ? (
              <div className="text-center p-8 text-[#1B1B5E]/40 font-bold uppercase text-sm">No items found for this order.</div>
            ) : (
              <div className="space-y-4">
                {orderItems.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 bg-[#F5F5F7] rounded-2xl border border-[#1B1B5E]/5">
                    <div className="w-16 h-16 bg-white rounded-xl border border-[#1B1B5E]/5 flex items-center justify-center overflow-hidden shrink-0">
                      {item.products?.image_url ? (
                        <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-gray-400 font-bold">Img</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#1B1B5E] text-sm truncate">{item.products?.name || 'Unknown Product'}</h4>
                      <p className="text-[#1B1B5E]/60 text-xs font-bold uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                      <p className="text-[#00AEEF] font-black text-sm mt-1">₦{item.unit_price?.toLocaleString() || 0}</p>
                    </div>
                  </div>
                ))}
                
                <div className="pt-6 mt-6 border-t border-[#1B1B5E]/10 flex justify-between items-center">
                  <span className="font-bold text-[#1B1B5E]/60 uppercase tracking-widest text-sm">Total Amount</span>
                  <span className="font-black text-2xl text-[#1B1B5E]">₦{selectedOrder.total_amount?.toLocaleString() || 0}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
