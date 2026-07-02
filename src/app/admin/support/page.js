"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Mail, CheckCircle, Trash2, HelpCircle, ChevronLeft, Send, Clock, User } from "lucide-react";

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  async function fetchTickets() {
    setLoading(true);
    // Fetch auth'd support tickets
    const { data: supportData } = await supabase.from("support_tickets").select("*, profiles(full_name, email)").order("created_at", { ascending: false });
    
    // Fetch anonymous contact submissions
    const { data: contactData } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });

    // Combine them for the inbox
    const combined = [];
    if (supportData) combined.push(...supportData.map(t => ({...t, isAuth: true, name: t.profiles?.full_name || 'User', email: t.profiles?.email})));
    if (contactData) combined.push(...contactData.map(t => ({...t, isAuth: false})));

    combined.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    setTickets(combined);
    setLoading(false);
  }

  const handleOpenTicket = async (ticket) => {
    setActiveTicket(ticket);
    if (ticket.isAuth) {
      const { data } = await supabase.from('support_ticket_messages').select('*').eq('ticket_id', ticket.id).order('created_at', { ascending: true });
      if (data) setMessages(data);
    }
  };

  useEffect(() => {
    if (activeTicket?.isAuth) {
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeTicket || !activeTicket.isAuth) return;

    const msg = {
      ticket_id: activeTicket.id,
      sender_type: 'admin',
      message: newMessage.trim()
    };

    setNewMessage("");
    await supabase.from('support_ticket_messages').insert([msg]);
  };

  const updateStatus = async (id, status, isAuth) => {
    const table = isAuth ? 'support_tickets' : 'contact_submissions';
    await supabase.from(table).update({ status }).eq('id', id);
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    if (activeTicket?.id === id) {
      setActiveTicket({ ...activeTicket, status });
    }
  };

  const deleteSubmission = async (id, isAuth) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    const table = isAuth ? 'support_tickets' : 'contact_submissions';
    await supabase.from(table).delete().eq('id', id);
    setTickets(prev => prev.filter(t => t.id !== id));
    if (activeTicket?.id === id) setActiveTicket(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-8rem)] flex flex-col">
      <div className="shrink-0">
        <h1 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Support Inbox</h1>
        <p className="text-[#1B1B5E]/60 text-sm font-medium tracking-wide mt-1">Manage technical support tickets and contact office messages.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[#1B1B5E]/5 overflow-hidden flex-1 flex flex-col md:flex-row">
        
        {/* Inbox List */}
        <div className={`md:w-96 border-r border-[#1B1B5E]/5 flex flex-col ${activeTicket ? 'hidden md:flex' : 'flex-1'}`}>
          <div className="p-4 border-b border-[#1B1B5E]/5 bg-[#F5F5F7]/30 shrink-0">
            <h3 className="font-black text-[#1B1B5E] uppercase tracking-widest text-sm">All Messages</h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-[#1B1B5E]/5">
            {loading ? (
              <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[#00AEEF]" /></div>
            ) : tickets.length === 0 ? (
              <div className="p-12 text-center text-[#1B1B5E]/40">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-medium">No messages found.</p>
              </div>
            ) : (
              tickets.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleOpenTicket(sub)}
                  className={`w-full text-left p-4 hover:bg-[#F5F5F7] transition-colors flex items-start gap-4 ${activeTicket?.id === sub.id ? 'bg-[#F5F5F7] border-l-4 border-l-[#00AEEF]' : 'border-l-4 border-l-transparent'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${sub.isAuth ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                    {sub.isAuth ? <HelpCircle className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-[#1B1B5E] truncate text-sm">{sub.name}</h4>
                      <span className="text-[10px] font-bold text-[#1B1B5E]/40 whitespace-nowrap ml-2">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-bold text-[#1B1B5E] text-xs truncate mb-1">{sub.subject}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${sub.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {sub.status}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detail/Thread View */}
        <div className={`flex-1 flex flex-col bg-white ${!activeTicket ? 'hidden md:flex' : 'flex'}`}>
          {!activeTicket ? (
            <div className="flex-1 flex flex-col items-center justify-center text-[#1B1B5E]/20">
              <Mail className="w-20 h-20 mb-4" />
              <p className="font-black uppercase tracking-widest text-sm">Select a ticket to view</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-4 border-b border-[#1B1B5E]/5 flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveTicket(null)} className="md:hidden p-2 bg-[#F5F5F7] rounded-xl">
                    <ChevronLeft className="w-5 h-5 text-[#1B1B5E]" />
                  </button>
                  <div>
                    <h2 className="font-black text-[#1B1B5E]">{activeTicket.subject}</h2>
                    <p className="text-xs font-bold text-[#1B1B5E]/50">{activeTicket.name} ({activeTicket.email || 'N/A'})</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {activeTicket.status !== 'resolved' && (
                    <button onClick={() => updateStatus(activeTicket.id, 'resolved', activeTicket.isAuth)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100" title="Resolve">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button onClick={() => deleteSubmission(activeTicket.id, activeTicket.isAuth)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Delete">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F5F5F7]/30">
                {/* Original Ticket */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1B1B5E]/10 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-[#1B1B5E]/50" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-[#1B1B5E]/5 shadow-sm text-sm text-[#1B1B5E] whitespace-pre-wrap">
                      {activeTicket.message}
                    </div>
                    <span className="text-[10px] font-bold text-[#1B1B5E]/40 mt-1 inline-block">{new Date(activeTicket.created_at).toLocaleString()}</span>
                  </div>
                </div>

                {/* Replies (if auth'd ticket) */}
                {activeTicket.isAuth && messages.map((msg, idx) => {
                  const isAdmin = msg.sender_type === 'admin';
                  return (
                    <div key={idx} className={`flex gap-4 ${isAdmin ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isAdmin ? 'bg-[#00AEEF]/10' : 'bg-[#1B1B5E]/10'}`}>
                        {isAdmin ? <HelpCircle className="w-5 h-5 text-[#00AEEF]" /> : <User className="w-5 h-5 text-[#1B1B5E]/50" />}
                      </div>
                      <div className={`flex-1 flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[80%] p-4 text-sm shadow-sm ${
                          isAdmin 
                            ? 'bg-[#1B1B5E] text-white rounded-2xl rounded-tr-sm' 
                            : 'bg-white text-[#1B1B5E] rounded-2xl rounded-tl-sm border border-[#1B1B5E]/5'
                        }`}>
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                        </div>
                        <span className="text-[10px] font-bold text-[#1B1B5E]/40 mt-1">{new Date(msg.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Input */}
              {activeTicket.isAuth ? (
                <div className="p-4 bg-white border-t border-[#1B1B5E]/5 shrink-0">
                  {activeTicket.status === 'resolved' ? (
                    <p className="text-center text-xs font-bold text-[#1B1B5E]/40 uppercase tracking-widest bg-[#F5F5F7] p-3 rounded-xl">Ticket is resolved. Reopen to reply.</p>
                  ) : (
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input 
                        type="text" 
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Reply to user..." 
                        className="flex-1 bg-[#F5F5F7] px-4 py-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#00AEEF]"
                      />
                      <button 
                        type="submit" 
                        disabled={!newMessage.trim()}
                        className="w-12 h-12 bg-[#00AEEF] text-white rounded-xl flex items-center justify-center hover:bg-[#1B1B5E] transition-colors disabled:opacity-50 shrink-0"
                      >
                        <Send className="w-5 h-5 -ml-1" />
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-white border-t border-[#1B1B5E]/5 shrink-0">
                  <p className="text-center text-xs font-bold text-[#1B1B5E]/40 uppercase tracking-widest bg-[#F5F5F7] p-3 rounded-xl">This is a guest contact form. Please reply via email: {activeTicket.email}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
