"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Loader2, MapPin, Phone, ShoppingBag, ShieldAlert, UserCheck, AlertTriangle, ShieldX, Building, X, CreditCard } from "lucide-react";

export default function AdminCustomers() {
  const [activeTab, setActiveTab] = useState("registered"); // 'registered' or 'guests'
  
  // Registered Users State
  const [profiles, setProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [selectedBankUser, setSelectedBankUser] = useState(null);

  // Guest Customers State
  const [guests, setGuests] = useState([]);
  const [blockedPhones, setBlockedPhones] = useState(new Set());
  const [loadingGuests, setLoadingGuests] = useState(true);

  // Fetch Registered Profiles
  const fetchProfiles = async () => {
    setLoadingProfiles(true);
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProfiles(data || []);
    } catch (err) {
      console.error("Error fetching profiles:", err);
    }
    setLoadingProfiles(false);
  };

  // Fetch Guest Orders
  const fetchGuests = async () => {
    setLoadingGuests(true);
    try {
      const [{ data: orders }, { data: blocks }] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("blocked_customers").select("phone").catch(() => ({ data: [] }))
      ]);
      
      if (blocks) {
        setBlockedPhones(new Set(blocks.map(b => b.phone)));
      }

      if (orders) {
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
        setGuests(Object.values(customerMap));
      } else {
        setGuests([]);
      }
    } catch (error) {
      console.warn("Could not fetch guests:", error);
    }
    setLoadingGuests(false);
  };

  useEffect(() => {
    if (activeTab === 'registered') {
      fetchProfiles();
    } else {
      fetchGuests();
    }
  }, [activeTab]);

  // Handle Registered Profile Status Change
  const handleStatusChange = async (userId, newStatus) => {
    // Optimistic update
    setProfiles(prev => prev.map(p => p.id === userId ? { ...p, status: newStatus } : p));
    
    try {
      const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', userId);
      if (error) {
        throw error;
      }
    } catch (err) {
      alert("Failed to update status. Please make sure the 'status' column is added to the profiles table.");
      fetchProfiles(); // revert
    }
  };
  // Handle VIP Status Change
  const toggleVipStatus = async (userId, currentVipStatus) => {
    const newStatus = !currentVipStatus;
    setProfiles(prev => prev.map(p => p.id === userId ? { ...p, is_vip: newStatus } : p));
    
    try {
      const { error } = await supabase.from('profiles').update({ is_vip: newStatus }).eq('id', userId);
      if (error) throw error;
    } catch (err) {
      alert("Failed to update VIP status.");
      fetchProfiles(); // revert
    }
  };


  // Handle Guest Phone Blocking
  const toggleBlockStatus = async (phone, isCurrentlyBlocked) => {
    if (isCurrentlyBlocked) {
      if (!confirm(`Are you sure you want to unblock ${phone}?`)) return;
      setBlockedPhones(prev => { const n = new Set(prev); n.delete(phone); return n; });
      const { error } = await supabase.from('blocked_customers').delete().eq('phone', phone);
      if (error) {
        alert("Failed to unblock.");
        fetchGuests();
      }
    } else {
      if (!confirm(`Are you sure you want to block ${phone}? They will not be able to place orders.`)) return;
      setBlockedPhones(prev => { const n = new Set(prev); n.add(phone); return n; });
      const { error } = await supabase.from('blocked_customers').insert([{ phone, reason: 'Admin blocked via dashboard' }]);
      if (error) {
        alert("Failed to block.");
        fetchGuests();
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
      case null:
      case undefined:
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-max"><UserCheck className="w-3 h-3" /> Active</span>;
      case 'suspended':
        return <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-max"><ShieldAlert className="w-3 h-3" /> Suspended</span>;
      case 'investigating':
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-max"><AlertTriangle className="w-3 h-3" /> Investigating</span>;
      case 'blocked':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-max"><ShieldX className="w-3 h-3" /> Blocked</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-max">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter flex items-center gap-3">
            <Users className="w-8 h-8 text-[#00AEEF]" />
            User Management
          </h1>
          <p className="text-[#1B1B5E]/60 text-sm font-medium tracking-wide mt-1">Manage registered accounts and guest order contacts.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-[#1B1B5E]/5 p-1 rounded-2xl w-max">
          <button
            onClick={() => setActiveTab('registered')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'registered' ? 'bg-white text-[#1B1B5E] shadow-sm' : 'text-[#1B1B5E]/50 hover:text-[#1B1B5E]'
            }`}
          >
            Registered Accounts
          </button>
          <button
            onClick={() => setActiveTab('guests')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'guests' ? 'bg-white text-[#1B1B5E] shadow-sm' : 'text-[#1B1B5E]/50 hover:text-[#1B1B5E]'
            }`}
          >
            Guest Contacts
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[#1B1B5E]/5 overflow-hidden">
        
        {/* REGISTERED USERS TAB */}
        {activeTab === 'registered' && (
          <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#F5F5F7] border-b border-[#1B1B5E]/5 text-[#1B1B5E] text-xs font-black uppercase tracking-widest">
                <th className="p-4 pl-6">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Bank Accounts</th>
                <th className="p-4 text-right pr-6">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {loadingProfiles ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#1B1B5E]/40 font-bold uppercase"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#00AEEF]" /></td>
                </tr>
              ) : profiles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#1B1B5E]/40 font-bold uppercase">No registered users found.</td>
                </tr>
              ) : (
                profiles.map((profile) => (
                  <tr key={profile.id} className="border-b border-[#1B1B5E]/5 hover:bg-[#F5F5F7]/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#1B1B5E]/5 flex items-center justify-center font-black text-[#1B1B5E]">
                            {profile.full_name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-[#1B1B5E] text-sm flex items-center gap-2">
                              {profile.full_name || 'Unknown User'}
                              {profile.is_vip && (
                                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest font-black shadow-sm">VIP</span>
                              )}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleVipStatus(profile.id, profile.is_vip)}
                          title={profile.is_vip ? "Revoke VIP" : "Make VIP"}
                          className={`p-2 rounded-xl transition-all ${profile.is_vip ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' : 'bg-gray-100 text-gray-400 hover:bg-yellow-50 hover:text-yellow-500'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={profile.is_vip ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-[#1B1B5E]/70">
                      {profile.email}
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${profile.role === 'admin' ? 'bg-[#1B1B5E] text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {profile.role || 'user'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(profile.status)}
                        <select
                          className="bg-gray-50 border border-gray-200 text-[#1B1B5E] text-xs font-bold rounded-lg focus:ring-[#00AEEF] focus:border-[#00AEEF] block p-2 outline-none cursor-pointer"
                          value={profile.status || 'active'}
                          onChange={(e) => handleStatusChange(profile.id, e.target.value)}
                        >
                          <option value="active">Active</option>
                          <option value="investigating">Investigating</option>
                          <option value="suspended">Suspended</option>
                          <option value="blocked">Blocked</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setSelectedBankUser(profile)}
                        className="bg-[#1B1B5E]/5 hover:bg-[#1B1B5E]/10 text-[#1B1B5E] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <Building className="w-3 h-3" />
                        View ({profile.saved_bank_details?.length || 0})
                      </button>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <p className="font-bold text-[#1B1B5E] text-sm">{new Date(profile.created_at).toLocaleDateString()}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        )}

        {/* GUEST CUSTOMERS TAB */}
        {activeTab === 'guests' && (
          <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#F5F5F7] border-b border-[#1B1B5E]/5 text-[#1B1B5E] text-xs font-black uppercase tracking-widest">
                <th className="p-4 pl-6">Contact Phone</th>
                <th className="p-4">Shipping Address</th>
                <th className="p-4">Orders</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingGuests ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-[#1B1B5E]/40 font-bold uppercase"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#00AEEF]" /></td>
                </tr>
              ) : guests.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-[#1B1B5E]/40 font-bold uppercase">No guest customers found.</td>
                </tr>
              ) : (
                guests.map((customer) => {
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
                      <td className="p-4 pr-6 text-right">
                        <button 
                          onClick={() => toggleBlockStatus(customer.phone, isBlocked)}
                          className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${
                            isBlocked 
                              ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' 
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          {isBlocked ? 'Unblock Phone' : 'Block Phone'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Bank Details Modal */}
      {selectedBankUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#1B1B5E]/10 flex items-center justify-between bg-[#F5F5F7]">
              <div>
                <h3 className="text-xl font-black text-[#1B1B5E] uppercase tracking-tighter flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#00AEEF]" />
                  Saved Bank Accounts
                </h3>
                <p className="text-sm font-bold text-[#1B1B5E]/60 mt-1">{selectedBankUser.full_name} ({selectedBankUser.email})</p>
              </div>
              <button 
                onClick={() => setSelectedBankUser(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-[#1B1B5E]/40 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {!selectedBankUser.saved_bank_details || selectedBankUser.saved_bank_details.length === 0 ? (
                <div className="text-center py-12 bg-[#F5F5F7] rounded-2xl border-2 border-dashed border-[#1B1B5E]/10">
                  <Building className="w-12 h-12 text-[#1B1B5E]/20 mx-auto mb-4" />
                  <p className="text-[#1B1B5E]/50 font-medium">This user has not saved any bank accounts.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {selectedBankUser.saved_bank_details.map((bank, idx) => (
                    <div key={idx} className="p-5 rounded-2xl border border-[#1B1B5E]/10 bg-white hover:border-[#00AEEF] transition-all flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-[#1B1B5E] text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">{bank.bankName}</span>
                        </div>
                        <p className="font-mono text-xl font-bold text-[#1B1B5E] tracking-widest">{bank.accountNumber}</p>
                        <p className="text-sm font-bold text-[#1B1B5E]/60 uppercase tracking-widest mt-1">{bank.accountName}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-[#F5F5F7] flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-[#1B1B5E]/40" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
