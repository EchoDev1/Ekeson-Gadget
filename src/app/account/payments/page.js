"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { CreditCard, Loader2, Building, Trash2, ShieldCheck, Plus } from "lucide-react";

export default function PaymentsPage() {
  const [bankDetails, setBankDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ accountName: "", accountNumber: "", bankName: "" });

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase.from('profiles').select('saved_bank_details').eq('id', session.user.id).single();
      if (data?.saved_bank_details) {
        setBankDetails(data.saved_bank_details);
      }
    }
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    const newBank = { id: Date.now().toString(), ...formData };
    const updatedDetails = [...bankDetails, newBank];

    await supabase.from('profiles').update({ saved_bank_details: updatedDetails }).eq('id', session.user.id);
    
    setBankDetails(updatedDetails);
    setShowForm(false);
    setFormData({ accountName: "", accountNumber: "", bankName: "" });
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Remove this bank account?")) {
      const updatedDetails = bankDetails.filter(b => b.id !== id);
      const { data: { session } } = await supabase.auth.getSession();
      await supabase.from('profiles').update({ saved_bank_details: updatedDetails }).eq('id', session.user.id);
      setBankDetails(updatedDetails);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#00AEEF]" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#1B1B5E]/5">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black text-[#1B1B5E] uppercase tracking-tighter flex items-center gap-2">
              <Building className="w-6 h-6 text-purple-500" />
              Saved Bank Accounts
            </h2>
            <p className="text-xs font-bold text-[#1B1B5E]/50 mt-1 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-green-500" /> For withdrawals & refunds
            </p>
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#1B1B5E] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#00AEEF] transition-colors">
              <Plus className="w-4 h-4" /> Add Account
            </button>
          )}
        </div>

        {showForm ? (
          <form onSubmit={handleSave} className="bg-[#F5F5F7] p-6 rounded-2xl space-y-4 border border-[#1B1B5E]/10">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Account Name</label>
                <input required type="text" value={formData.accountName} onChange={e => setFormData({...formData, accountName: e.target.value})} className="w-full mt-1 px-4 py-2 rounded-xl border border-[#1B1B5E]/10 outline-none focus:border-[#00AEEF]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Account Number</label>
                  <input required type="text" value={formData.accountNumber} onChange={e => setFormData({...formData, accountNumber: e.target.value})} className="w-full mt-1 px-4 py-2 rounded-xl border border-[#1B1B5E]/10 outline-none focus:border-[#00AEEF]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Bank Name</label>
                  <input required type="text" value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} className="w-full mt-1 px-4 py-2 rounded-xl border border-[#1B1B5E]/10 outline-none focus:border-[#00AEEF]" />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={submitting} className="bg-[#1B1B5E] text-white px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-[#00AEEF] transition-colors flex items-center gap-2">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Save Account
              </button>
              <button type="button" onClick={() => { setShowForm(false); setFormData({ accountName: "", accountNumber: "", bankName: "" }); }} className="px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest text-[#1B1B5E]/60 hover:bg-black/5 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        ) : bankDetails.length === 0 ? (
          <div className="text-center py-12 bg-[#F5F5F7] rounded-2xl border-2 border-dashed border-[#1B1B5E]/10">
            <Building className="w-12 h-12 text-[#1B1B5E]/20 mx-auto mb-4" />
            <p className="text-[#1B1B5E]/50 font-medium">You haven&apos;t saved any bank accounts yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bankDetails.map((bank) => (
              <div key={bank.id} className="p-5 rounded-2xl border-2 border-[#1B1B5E]/10 bg-white hover:border-[#1B1B5E]/20 transition-all flex flex-col">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#1B1B5E]/5">
                  <span className="bg-[#1B1B5E] text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">{bank.bankName}</span>
                  <CreditCard className="w-5 h-5 text-[#1B1B5E]/40" />
                </div>
                <p className="font-mono text-lg font-bold text-[#1B1B5E] tracking-widest">{bank.accountNumber}</p>
                <p className="text-sm font-bold text-[#1B1B5E]/60 uppercase tracking-widest mt-1">{bank.accountName}</p>
                
                <div className="mt-auto pt-6 flex justify-end">
                  <button onClick={() => handleDelete(bank.id)} className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest">
                    <Trash2 className="w-3 h-3" /> Remove
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
