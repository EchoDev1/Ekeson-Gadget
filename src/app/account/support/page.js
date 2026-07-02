"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { HeadphonesIcon, Loader2, Send, Clock, CheckCircle, ChevronLeft } from "lucide-react";

export default function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ subject: "", message: "" });
  const messagesEndRef = useRef(null);

  const fetchTickets = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase.from('support_tickets').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
      if (data) setTickets(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchMessages = async (ticketId) => {
    const { data } = await supabase.from('support_ticket_messages').select('*').eq('ticket_id', ticketId).order('created_at', { ascending: true });
    if (data) setMessages(data);
  };

  const handleOpenTicket = (ticket) => {
    setActiveTicket(ticket);
    fetchMessages(ticket.id);
  };

  useEffect(() => {
    if (activeTicket) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      
      const subscription = supabase
        .channel(`public:support_ticket_messages:ticket_id=eq.${activeTicket.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_ticket_messages', filter: `ticket_id=eq.${activeTicket.id}` }, payload => {
          setMessages(prev => [...prev, payload.new]);
        })
        .subscribe();

      return () => { supabase.removeChannel(subscription); };
    }
  }, [activeTicket]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    const { data, error } = await supabase.from('support_tickets').insert([{
      user_id: session.user.id,
      subject: formData.subject,
      message: formData.message,
      status: 'open'
    }]).select().single();

    if (error) {
      console.error(error);
      alert("Error creating ticket: " + error.message);
      setSubmitting(false);
      return;
    }

    if (data) {
      // Create first message
      await supabase.from('support_ticket_messages').insert([{
        ticket_id: data.id,
        sender_type: 'user',
        message: formData.message
      }]);
      setShowForm(false);
      setFormData({ subject: "", message: "" });
      fetchTickets();
      handleOpenTicket(data);
    }
    setSubmitting(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeTicket) return;

    const msg = {
      ticket_id: activeTicket.id,
      sender_type: 'user',
      message: newMessage.trim()
    };

    setNewMessage("");
    await supabase.from('support_ticket_messages').insert([msg]);
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#00AEEF]" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#1B1B5E]/5 min-h-[600px] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 shrink-0">
          <div className="flex items-center gap-3">
            {activeTicket && (
              <button onClick={() => setActiveTicket(null)} className="p-2 bg-[#F5F5F7] rounded-xl hover:bg-[#1B1B5E]/10 transition-colors">
                <ChevronLeft className="w-5 h-5 text-[#1B1B5E]" />
              </button>
            )}
            <h2 className="text-2xl font-black text-[#1B1B5E] uppercase tracking-tighter flex items-center gap-2">
              <HeadphonesIcon className="w-6 h-6 text-[#00AEEF]" />
              {activeTicket ? 'Ticket Thread' : 'Support Tickets'}
            </h2>
          </div>
          {!showForm && !activeTicket && (
            <button onClick={() => setShowForm(true)} className="bg-[#1B1B5E] text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#00AEEF] transition-colors">
              New Ticket
            </button>
          )}
        </div>

        {/* View Router */}
        {activeTicket ? (
          <div className="flex-1 flex flex-col bg-[#F5F5F7]/50 rounded-2xl border border-[#1B1B5E]/5 overflow-hidden">
            <div className="p-4 bg-white border-b border-[#1B1B5E]/5 shrink-0 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[#1B1B5E]">{activeTicket.subject}</h3>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${activeTicket.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {activeTicket.status}
                </span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => {
                const isUser = msg.sender_type === 'user';
                return (
                  <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      isUser 
                        ? 'bg-[#1B1B5E] text-white rounded-br-sm shadow-sm' 
                        : 'bg-white border border-[#1B1B5E]/10 text-[#1B1B5E] rounded-bl-sm shadow-sm'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                      <div className={`flex items-center gap-1 mt-2 text-[10px] font-bold ${isUser ? 'text-white/50 justify-end' : 'text-[#1B1B5E]/40'}`}>
                        <Clock className="w-3 h-3" />
                        {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-[#1B1B5E]/5 shrink-0">
              {activeTicket.status === 'resolved' ? (
                <p className="text-center text-sm font-bold text-green-600 bg-green-50 p-3 rounded-xl uppercase tracking-widest flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> This ticket is resolved and closed.
                </p>
              ) : (
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type your reply to support..." 
                    className="flex-1 bg-[#F5F5F7] px-4 py-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#00AEEF] text-[#1B1B5E] font-medium"
                  />
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="px-6 py-3 bg-[#00AEEF] text-white font-bold rounded-xl flex items-center justify-center hover:bg-[#1B1B5E] transition-colors disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : showForm ? (
          <form onSubmit={handleCreateTicket} className="bg-[#F5F5F7] p-6 rounded-2xl space-y-4 border border-[#1B1B5E]/10 animate-in zoom-in-95 duration-300">
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
          <div className="text-center py-20 bg-[#F5F5F7] rounded-2xl border-2 border-dashed border-[#1B1B5E]/10 flex-1 flex flex-col items-center justify-center">
            <HeadphonesIcon className="w-12 h-12 text-[#1B1B5E]/20 mb-4" />
            <p className="text-[#1B1B5E]/50 font-medium">You have no active support tickets.</p>
          </div>
        ) : (
          <div className="space-y-4 flex-1">
            {tickets.map(ticket => (
              <button key={ticket.id} onClick={() => handleOpenTicket(ticket)} className="w-full text-left p-5 rounded-2xl border-2 border-[#1B1B5E]/5 bg-[#F5F5F7]/50 hover:bg-white hover:border-[#00AEEF]/30 hover:shadow-md transition-all flex justify-between items-center group">
                <div>
                  <h3 className="font-bold text-[#1B1B5E] text-lg group-hover:text-[#00AEEF] transition-colors">{ticket.subject}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${ticket.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {ticket.status === 'resolved' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />} {ticket.status}
                    </span>
                    <span className="text-[10px] font-bold text-[#1B1B5E]/40 uppercase tracking-widest">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white border border-[#1B1B5E]/10 flex items-center justify-center text-[#1B1B5E]/40 group-hover:bg-[#00AEEF] group-hover:text-white group-hover:border-[#00AEEF] transition-colors">
                  <Send className="w-4 h-4 translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
