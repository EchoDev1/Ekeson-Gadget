"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Ticket, Plus, Loader2, Trash2, CheckCircle, XCircle } from "lucide-react";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    min_spend: 0,
    is_active: true
  });

  const fetchCoupons = async () => {
    setLoading(true);
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (data) setCoupons(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleGenerateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code: result });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from('coupons').insert([{
      ...formData,
      code: formData.code.toUpperCase()
    }]);

    if (error) {
      alert("Failed to create coupon: " + error.message);
    } else {
      setShowForm(false);
      setFormData({ code: "", discount_type: "percentage", discount_value: "", min_spend: 0, is_active: true });
      fetchCoupons();
    }
    setSubmitting(false);
  };

  const toggleStatus = async (id, currentStatus) => {
    await supabase.from('coupons').update({ is_active: !currentStatus }).eq('id', id);
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c));
  };

  const deleteCoupon = async (id) => {
    if (!confirm("Delete this coupon code?")) return;
    await supabase.from('coupons').delete().eq('id', id);
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Coupon Engine</h1>
          <p className="text-[#1B1B5E]/60 text-sm font-medium tracking-wide mt-1">Generate discount codes and manage promotions.</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="bg-[#1B1B5E] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#00AEEF] transition-colors flex items-center gap-2 shadow-lg">
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-[#1B1B5E]/5 animate-in zoom-in-95 duration-300">
          <h2 className="text-lg font-black text-[#1B1B5E] uppercase tracking-widest mb-6 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#00AEEF]" /> New Promo Code
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-[10px] font-black text-[#1B1B5E]/50 uppercase tracking-widest block mb-2">Coupon Code</label>
              <div className="flex gap-2">
                <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="e.g. XMAS25" className="flex-1 px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20 font-mono font-bold text-lg uppercase" />
                <button type="button" onClick={handleGenerateCode} className="px-4 py-3 bg-[#1B1B5E]/5 text-[#1B1B5E] rounded-xl font-bold hover:bg-[#1B1B5E]/10 transition-colors text-xs uppercase tracking-widest">Generate</button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-[#1B1B5E]/50 uppercase tracking-widest block mb-2">Discount Type</label>
                <select value={formData.discount_type} onChange={e => setFormData({...formData, discount_type: e.target.value})} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20 font-bold text-sm">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₦)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-[#1B1B5E]/50 uppercase tracking-widest block mb-2">Value</label>
                <input required type="number" min="1" value={formData.discount_value} onChange={e => setFormData({...formData, discount_value: e.target.value})} placeholder="e.g. 10" className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20 font-bold text-sm" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="text-[10px] font-black text-[#1B1B5E]/50 uppercase tracking-widest block mb-2">Minimum Spend (₦)</label>
              <input type="number" min="0" value={formData.min_spend} onChange={e => setFormData({...formData, min_spend: e.target.value})} placeholder="0 for no minimum" className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20 font-bold text-sm" />
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-[#1B1B5E]/5">
            <button type="submit" disabled={submitting} className="bg-[#00AEEF] text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1B1B5E] transition-colors flex items-center gap-2">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Save Coupon
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-[#1B1B5E]/60 hover:bg-[#F5F5F7] transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-[#1B1B5E]/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[#00AEEF]" /></div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-[#1B1B5E]/40">
            <Ticket className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-bold uppercase tracking-widest text-sm">No promo codes active</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#F5F5F7] border-b border-[#1B1B5E]/5 text-[#1B1B5E] text-[10px] font-black uppercase tracking-widest">
                <th className="p-4 pl-6">Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min. Spend</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B1B5E]/5">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-[#F5F5F7]/50 transition-colors">
                  <td className="p-4 pl-6">
                    <span className="font-mono text-sm font-black text-[#1B1B5E] bg-[#1B1B5E]/5 px-3 py-1 rounded-lg">
                      {coupon.code}
                    </span>
                    <p className="text-[10px] font-bold text-[#1B1B5E]/40 mt-2 uppercase tracking-widest">
                      Created {new Date(coupon.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="p-4">
                    <span className="font-black text-[#00AEEF] text-lg">
                      {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₦${coupon.discount_value.toLocaleString()}`}
                    </span>
                    <span className="text-[10px] font-bold text-[#1B1B5E]/40 ml-1 uppercase">OFF</span>
                  </td>
                  <td className="p-4 font-bold text-[#1B1B5E]/60 text-sm">
                    {coupon.min_spend > 0 ? `₦${coupon.min_spend.toLocaleString()}` : 'None'}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleStatus(coupon.id, coupon.is_active)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${
                        coupon.is_active ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700' : 'bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700'
                      }`}
                      title="Click to toggle status"
                    >
                      {coupon.is_active ? <><CheckCircle className="w-3 h-3" /> Active</> : <><XCircle className="w-3 h-3" /> Inactive</>}
                    </button>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button 
                      onClick={() => deleteCoupon(coupon.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-colors tooltip-trigger"
                      title="Delete Code"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
