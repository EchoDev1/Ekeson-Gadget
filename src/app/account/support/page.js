"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { HeadphonesIcon, Loader2, Send, Clock, CheckCircle } from "lucide-react";

export default function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ subject: "", message: "" });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase.from('support_tickets').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
      if (data) setTickets(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    await supabase.from('support_tickets').insert([{
      user_id: session.user.id,
      subject: formData.subject,
      message: formData.message,
      status: 'open'
    }]);

    setShowForm(false);
    setFormData({ subject: "", message: "" });
    fetchTickets();
    setSubmitting(false);
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#00AEEF]" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#1B1B5E]/5">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-[#1B1B5E] uppercase tracking-tighter flex items-center gap-2">
            <HeadphonesIcon className="w-6 h-6 text-[#00AEEF]" />
            Support Tickets
          </h2>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="bg-[#1B1B5E] text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#00AEEF] transition-colors">
              New Ticket
            </button>
          )}
        </div>

        {showForm ? (
          <form onSubmit={handleSubmit} className="bg-[#F5F5F7] p-6 rounded-2xl space-y-4 border border-[#1B1B5E]/10 animate-in zoom-in-95 duration-300">
            <div>
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Subject</label>
              <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="e.g. Where is my order?" className="w-full mt-1 px-4 py-3 rounded-xl border border-[#1B1B5E]/10 outline-none focus:border-[#00AEEF]" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Message</label>
              <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Describe your issue in detail..." className="w-full mt-1 px-4 py-3 rounded-xl border border-[#1B1B5E]/10 outline-none focus:border-[#00AEEF] h-32" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={submitting} className="bg-[#1B1B5E] text-white px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-[#00AEEF] transition-colors flex items-center gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Submit Ticket
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest text-[#1B1B5E]/60 hover:bg-black/5 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12 bg-[#F5F5F7] rounded-2xl border-2 border-dashed border-[#1B1B5E]/10">
            <HeadphonesIcon className="w-12 h-12 text-[#1B1B5E]/20 mx-auto mb-4" />
            <p className="text-[#1B1B5E]/50 font-medium">You have no active support tickets.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map(ticket => (
              <div key={ticket.id} className="p-5 rounded-2xl border-2 border-[#1B1B5E]/5 bg-[#F5F5F7]/50 hover:bg-white transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-[#1B1B5E] text-lg">{ticket.subject}</h3>
                  <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${ticket.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {ticket.status === 'resolved' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />} {ticket.status}
                  </span>
                </div>
                <p className="text-[#1B1B5E]/70 text-sm whitespace-pre-wrap">{ticket.message}</p>
                <div className="mt-4 pt-4 border-t border-[#1B1B5E]/5 text-[10px] font-bold text-[#1B1B5E]/40 uppercase tracking-widest">
                  Submitted on {new Date(ticket.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
