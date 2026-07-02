"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { MessageCircle, X, Send, User, Loader2 } from "lucide-react";

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadAdmin, setUnreadAdmin] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Check for existing session or create one
    let sid = localStorage.getItem("ekeson_chat_session");
    if (!sid) {
      sid = "sess_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("ekeson_chat_session", sid);
    }
    setSessionId(sid);

    fetchMessages(sid);

    // Subscribe to new messages for this session
    const subscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        if (payload.new.session_id === sid) {
          setMessages(prev => [...prev, payload.new]);
          if (payload.new.sender === 'admin' && !isOpen) {
            setUnreadAdmin(prev => prev + 1);
            if (typeof window !== 'undefined' && "Notification" in window && Notification.permission === "granted") {
              new Notification("New Support Message", { body: payload.new.text });
            }
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [isOpen]);

  const fetchMessages = async (sid) => {
    const { data } = await supabase.from('messages').select('*').eq('session_id', sid).order('created_at', { ascending: true });
    if (data) {
      setMessages(data);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadAdmin(0); // clear unread when opened
      // Mark messages as read in DB could be done here, but since sender='admin' is unread for user, we don't have is_read_by_user column currently.
    }
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !sessionId) return;

    const msg = {
      session_id: sessionId,
      sender: 'user',
      text: newMessage.trim(),
      is_read: false
    };

    setNewMessage("");
    await supabase.from('messages').insert([msg]);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#00AEEF] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:bg-[#1B1B5E] transition-all z-50 animate-bounce-slow"
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
        {!isOpen && unreadAdmin > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white">
            {unreadAdmin}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 w-[360px] h-[500px] bg-white rounded-3xl shadow-2xl border border-[#1B1B5E]/10 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1B1B5E] to-[#00AEEF] p-4 text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black tracking-widest text-sm uppercase">Customer Support</h3>
              <p className="text-[10px] text-white/80 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Replies in minutes
              </p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#F5F5F7]/50 space-y-4">
            {messages.length === 0 && (
              <div className="text-center mt-10">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-4">
                  <MessageCircle className="w-8 h-8 text-[#00AEEF]/50" />
                </div>
                <p className="text-sm font-bold text-[#1B1B5E] uppercase tracking-widest">How can we help?</p>
                <p className="text-xs text-[#1B1B5E]/50 mt-1 font-medium">Send us a message and we'll reply shortly.</p>
              </div>
            )}
            
            {messages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    isUser 
                      ? 'bg-[#1B1B5E] text-white rounded-br-sm' 
                      : 'bg-white border border-[#1B1B5E]/10 text-[#1B1B5E] rounded-bl-sm shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-[#1B1B5E]/5">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input 
                type="text" 
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type your message..." 
                className="flex-1 bg-[#F5F5F7] px-4 py-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#00AEEF]"
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="w-12 h-12 bg-[#00AEEF] text-white rounded-xl flex items-center justify-center hover:bg-[#1B1B5E] transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5 -ml-1" />
              </button>
            </form>
          </div>
          
        </div>
      )}
    </>
  );
}
