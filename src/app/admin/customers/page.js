"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Loader2, MapPin, Phone, ShoppingBag } from "lucide-react";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [blockedPhones, setBlockedPhones] = useState(new Set());

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const [{ data: orders }, { data: blocks }] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("blocked_customers").select("phone").catch(() => ({ data: [] }))
      ]);
      
      if (blocks) {
        setBlockedPhones(new Set(blocks.map(b => b.phone)));
      }

      if (orders) {
        // Group orders by contact_phone to derive unique customers
        const customerMap = {};
        orders.forEach(order => {
          const phone = order.contact_phone || 'Unknown';
          if (!customerMap[phone]) {
            customerMap[phone] = {
              id: phone,
              phone: phone,
              address: order.shipping_address || 'No address provided',
              first_order_date: order.created_at,
              last_order_date: order.created_at,
              total_orders: 1,
              total_spent: order.total_amount || 0
            };
          } else {
            customerMap[phone].total_orders += 1;
            customerMap[phone].total_spent += (order.total_amount || 0);
            
            if (new Date(order.created_at) < new Date(customerMap[phone].first_order_date)) {
              customerMap[phone].first_order_date = order.created_at;
            }
            if (new Date(order.created_at) > new Date(customerMap[phone].last_order_date)) {
              customerMap[phone].last_order_date = order.created_at;
            }
          }
        });
        setCustomers(Object.values(customerMap));
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.warn("Could not fetch customers:", error);
    }
    setLoading(false);
  };

  const toggleBlockStatus = async (phone, isCurrentlyBlocked) => {
    if (isCurrentlyBlocked) {
      if (!confirm(`Are you sure you want to unblock ${phone}?`)) return;
      // Optimistic
      setBlockedPhones(prev => { const n = new Set(prev); n.delete(phone); return n; });
      const { error } = await supabase.from('blocked_customers').delete().eq('phone', phone);
      if (error) {
        alert("Failed to unblock. Ensure 'blocked_customers' table is created in Supabase.");
        fetchCustomers();
      }
    } else {
      if (!confirm(`Are you sure you want to block ${phone}? They will not be able to place orders.`)) return;
      // Optimistic
      setBlockedPhones(prev => { const n = new Set(prev); n.add(phone); return n; });
      const { error } = await supabase.from('blocked_customers').insert([{ phone, reason: 'Admin blocked via dashboard' }]);
      if (error) {
        alert("Failed to block. Ensure 'blocked_customers' table is created in Supabase.");
        fetchCustomers();
      }
    }
  };

  // Removed blocking loader for superfast rendering

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter flex items-center gap-3">
            <Users className="w-8 h-8 text-[#00AEEF]" />
            Customer Directory
          </h1>
          <p className="text-[#1B1B5E]/60 text-sm font-medium tracking-wide mt-1">Manage and view your customer base derived from orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[#1B1B5E]/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F5F5F7] border-b border-[#1B1B5E]/5 text-[#1B1B5E] text-xs font-black uppercase tracking-widest">
              <th className="p-4 pl-6">Contact Phone</th>
              <th className="p-4">Shipping Address</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Total Spent</th>
              <th className="p-4 text-right pr-6">Last Active</th>
              <th className="p-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-[#1B1B5E]/40 font-bold uppercase"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#00AEEF]" /></td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-[#1B1B5E]/40 font-bold uppercase">No customers found.</td>
              </tr>
            ) : (
              customers.map((customer) => {
                const isBlocked = blockedPhones.has(customer.phone);
                return (
                  <tr key={customer.id} className="border-b border-[#1B1B5E]/5 hover:bg-[#F5F5F7]/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isBlocked ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-[#1B1B5E] text-sm flex items-center gap-2">
                            {customer.phone}
                            {isBlocked && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Blocked</span>}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-xs text-[#1B1B5E]/60 truncate max-w-[250px]" title={customer.address}>
                        <MapPin className="w-3 h-3 shrink-0" />
                        {customer.address}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-[#1B1B5E]/40" />
                        <span className="font-bold text-[#1B1B5E]">{customer.total_orders}</span>
                      </div>
                    </td>
                    <td className="p-4 font-black text-[#00AEEF]">₦{customer.total_spent?.toLocaleString() || 0}</td>
                    <td className="p-4 pr-6 text-right">
                      <p className="font-bold text-[#1B1B5E] text-sm">{new Date(customer.last_order_date).toLocaleDateString()}</p>
                      <p className="text-[10px] text-[#1B1B5E]/50 uppercase font-bold mt-1">Customer since {new Date(customer.first_order_date).getFullYear()}</p>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button 
                        onClick={() => toggleBlockStatus(customer.phone, isBlocked)}
                        className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${
                          isBlocked 
                            ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' 
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        {isBlocked ? 'Unblock' : 'Block User'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
