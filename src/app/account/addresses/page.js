"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MapPin, Loader2, Plus, Trash2, Edit2 } from "lucide-react";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, full_name: "", phone: "", address: "", state: "", is_default: false });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase.from('user_addresses').select('*').eq('user_id', session.user.id).order('is_default', { ascending: false }).order('created_at', { ascending: false });
      if (data) setAddresses(data);
    }
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    // If setting as default, we might want to unset others. A simple DB trigger is best, but we'll do a simple update here.
    if (formData.is_default) {
      await supabase.from('user_addresses').update({ is_default: false }).eq('user_id', session.user.id);
    }

    const payload = {
      user_id: session.user.id,
      full_name: formData.full_name,
      phone: formData.phone,
      address: formData.address,
      state: formData.state,
      is_default: formData.is_default || addresses.length === 0
    };

    if (formData.id) {
      await supabase.from('user_addresses').update(payload).eq('id', formData.id);
    } else {
      await supabase.from('user_addresses').insert([payload]);
    }
    
    setShowForm(false);
    setFormData({ id: null, full_name: "", phone: "", address: "", state: "", is_default: false });
    fetchAddresses();
    setSubmitting(false);
  };

  const handleEdit = (address) => {
    setFormData(address);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this address?")) {
      await supabase.from('user_addresses').delete().eq('id', id);
      fetchAddresses();
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#00AEEF]" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#1B1B5E]/5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-[#1B1B5E] uppercase tracking-tighter flex items-center gap-2">
            <MapPin className="w-6 h-6 text-green-500" />
            Addresses
          </h2>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#1B1B5E] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#00AEEF] transition-colors">
              <Plus className="w-4 h-4" /> Add New
            </button>
          )}
        </div>

        {showForm ? (
          <form onSubmit={handleSave} className="bg-[#F5F5F7] p-6 rounded-2xl space-y-4 border border-[#1B1B5E]/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Full Name</label>
                <input required type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full mt-1 px-4 py-2 rounded-xl border border-[#1B1B5E]/10 outline-none focus:border-[#00AEEF]" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Phone Number</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full mt-1 px-4 py-2 rounded-xl border border-[#1B1B5E]/10 outline-none focus:border-[#00AEEF]" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Full Address</label>
              <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full mt-1 px-4 py-2 rounded-xl border border-[#1B1B5E]/10 outline-none focus:border-[#00AEEF] h-24" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">State/Region</label>
              <input required type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full mt-1 px-4 py-2 rounded-xl border border-[#1B1B5E]/10 outline-none focus:border-[#00AEEF]" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer w-max">
              <input type="checkbox" checked={formData.is_default} onChange={e => setFormData({...formData, is_default: e.target.checked})} className="w-4 h-4 accent-[#00AEEF]" />
              <span className="text-sm font-bold text-[#1B1B5E]">Set as default address</span>
            </label>
            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={submitting} className="bg-[#1B1B5E] text-white px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-[#00AEEF] transition-colors flex items-center gap-2">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Save Address
              </button>
              <button type="button" onClick={() => { setShowForm(false); setFormData({ id: null, full_name: "", phone: "", address: "", state: "", is_default: false }); }} className="px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest text-[#1B1B5E]/60 hover:bg-black/5 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        ) : addresses.length === 0 ? (
          <div className="text-center py-12 bg-[#F5F5F7] rounded-2xl border-2 border-dashed border-[#1B1B5E]/10">
            <p className="text-[#1B1B5E]/50 font-medium">You haven&apos;t saved any addresses yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div key={address.id} className={`p-5 rounded-2xl border-2 transition-all ${address.is_default ? 'border-[#00AEEF] bg-[#00AEEF]/5' : 'border-[#1B1B5E]/10 bg-white hover:border-[#1B1B5E]/20'}`}>
                {address.is_default && <span className="inline-block bg-[#00AEEF] text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mb-2">Default</span>}
                <p className="font-black text-[#1B1B5E]">{address.full_name}</p>
                <p className="text-sm font-medium text-[#1B1B5E]/60 mt-1">{address.phone}</p>
                <p className="text-sm font-medium text-[#1B1B5E] mt-3 line-clamp-2">{address.address}, {address.state}</p>
                
                <div className="flex gap-2 mt-4 pt-4 border-t border-[#1B1B5E]/10">
                  <button onClick={() => handleEdit(address)} className="flex items-center gap-1 text-xs font-bold text-[#1B1B5E]/60 hover:text-[#00AEEF] transition-colors uppercase tracking-widest">
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => handleDelete(address.id)} className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest ml-auto">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
