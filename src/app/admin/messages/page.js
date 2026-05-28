"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { MessageSquare, Send, User, Loader2, Clock } from "lucide-react";

export default function AdminMessages() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchSessions();

    const subscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        handleNewMessage(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    if (activeSession) {
      fetchMessages(activeSession);
    }
  }, [activeSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewMessage = (message) => {
    // If it's for the active session, append it
    setActiveSession(currentActive => {
      if (currentActive === message.session_id) {
        setMessages(prev => [...prev, message]);
        markAsRead(message.session_id);
      }
      return currentActive;
    });

    // Update sessions list (move to top, update unread count if not active)
    setSessions(prev => {
      const existing = prev.find(s => s.session_id === message.session_id);
      const others = prev.filter(s => s.session_id !== message.session_id);
      
      const updatedSession = existing ? {
        ...existing,
        last_message: message.text,
        created_at: message.created_at,
        unread: activeSession !== message.session_id && message.sender === 'user' ? (existing.unread || 0) + 1 : existing.unread
      } : {
        session_id: message.session_id,
        last_message: message.text,
        created_at: message.created_at,
        unread: message.sender === 'user' ? 1 : 0
      };

      return [updatedSession, ...others];
    });

    // Play sound / notification
    if (message.sender === 'user' && typeof window !== 'undefined') {
      new Notification("New Customer Message", { body: message.text });
    }
  };

  const fetchSessions = async () => {
    // A simplified approach: get all messages, group by session in JS (for a small app)
    // Or use a database view. We'll group in JS for now.
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (data) {
      const sessionMap = new Map();
      data.forEach(msg => {
        if (!sessionMap.has(msg.session_id)) {
          sessionMap.set(msg.session_id, {
            session_id: msg.session_id,
            last_message: msg.text,
            created_at: msg.created_at,
            unread: msg.sender === 'user' && !msg.is_read ? 1 : 0
          });
        } else if (msg.sender === 'user' && !msg.is_read) {
          sessionMap.get(msg.session_id).unread++;
        }
      });
      setSessions(Array.from(sessionMap.values()));
    }
    setLoading(false);
  };

  const fetchMessages = async (sessionId) => {
    const { data } = await supabase.from('messages').select('*').eq('session_id', sessionId).order('created_at', { ascending: true });
    if (data) {
      setMessages(data);
      markAsRead(sessionId);
    }
  };

  const markAsRead = async (sessionId) => {
    await supabase.from('messages').update({ is_read: true }).eq('session_id', sessionId).eq('sender', 'user').eq('is_read', false);
    setSessions(prev => prev.map(s => s.session_id === sessionId ? { ...s, unread: 0 } : s));
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeSession) return;

    const msg = {
      session_id: activeSession,
      sender: 'admin',
      text: newMessage.trim(),
      is_read: true
    };

    setNewMessage("");
    await supabase.from('messages').insert([msg]);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#00AEEF]" /></div>;
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-3xl shadow-sm border border-[#1B1B5E]/5 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Sidebar - Sessions */}
      <div className="w-80 border-r border-[#1B1B5E]/5 flex flex-col bg-[#F5F5F7]/30">
        <div className="p-6 border-b border-[#1B1B5E]/5 bg-white">
          <h2 className="text-xl font-black text-[#1B1B5E] uppercase tracking-wider flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-[#00AEEF]" />
            Live Chat
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-8 text-center text-[#1B1B5E]/40 font-bold text-sm uppercase">No active chats</div>
          ) : (
            sessions.map(session => (
              <button
                key={session.session_id}
                onClick={() => setActiveSession(session.session_id)}
                className={`w-full text-left p-4 border-b border-[#1B1B5E]/5 hover:bg-white transition-colors flex items-start gap-4 ${
                  activeSession === session.session_id ? 'bg-white border-l-4 border-l-[#00AEEF]' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#1B1B5E]/5 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-[#1B1B5E]/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[#1B1B5E] truncate text-sm">Guest {session.session_id.slice(0,4)}</span>
                    <span className="text-[10px] font-bold text-[#1B1B5E]/40">{new Date(session.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className={`text-xs truncate ${session.unread > 0 ? 'font-black text-[#1B1B5E]' : 'font-medium text-[#1B1B5E]/60'}`}>
                    {session.last_message}
                  </p>
                </div>
                {session.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-[#00AEEF] text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-md">
                    {session.unread}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeSession ? (
          <>
            {/* Header */}
            <div className="h-20 border-b border-[#1B1B5E]/5 flex items-center px-8 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#1B1B5E]/5 flex items-center justify-center">
                  <User className="w-6 h-6 text-[#1B1B5E]" />
                </div>
                <div>
                  <h3 className="font-black text-[#1B1B5E] uppercase">Guest {activeSession.slice(0,8)}</h3>
                  <p className="text-xs text-green-500 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#F5F5F7]/30">
              {messages.map((msg, idx) => {
                const isAdmin = msg.sender === 'admin';
                return (
                  <div key={msg.id || idx} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-3xl px-6 py-4 ${
                      isAdmin 
                        ? 'bg-[#1B1B5E] text-white rounded-br-sm shadow-md shadow-[#1B1B5E]/10' 
                        : 'bg-white text-[#1B1B5E] rounded-bl-sm border border-[#1B1B5E]/10 shadow-sm'
                    }`}>
                      <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                      <div className={`flex items-center gap-1 mt-2 text-[10px] font-bold ${isAdmin ? 'text-white/50 justify-end' : 'text-[#1B1B5E]/40'}`}>
                        <Clock className="w-3 h-3" />
                        {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t border-[#1B1B5E]/5 bg-white">
              <form onSubmit={sendMessage} className="flex gap-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 bg-[#F5F5F7] px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20 transition-all font-medium text-[#1B1B5E]"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-[#00AEEF] hover:bg-[#1B1B5E] text-white px-8 py-4 rounded-2xl transition-all shadow-lg shadow-[#00AEEF]/20 disabled:opacity-50 flex items-center justify-center hover:-translate-y-1"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#1B1B5E]/40 space-y-4">
            <MessageSquare className="w-16 h-16 opacity-20" />
            <p className="font-bold uppercase tracking-widest text-sm">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
