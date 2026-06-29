"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { MessageSquare, X, Send, User, Clock } from "lucide-react";
import { usePathname } from "next/navigation";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [liveScript, setLiveScript] = useState("");
  const messagesEndRef = useRef(null);
  const pathname = usePathname();

  // We cannot return early here because it breaks Rules of Hooks!
  // Instead, we will conditionally render the JSX at the bottom.

  useEffect(() => {
    // Generate or get a simple session ID for the guest user
    let sid = localStorage.getItem("ekeson_chat_session");
    if (!sid) {
      sid = "guest_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("ekeson_chat_session", sid);
    }

    setSessionId(sid);

    const fetchMessages = async (sid) => {
      const { data } = await supabase.from('messages').select('*').eq('session_id', sid).order('created_at', { ascending: true });
      if (data) setMessages(data);
    };

    fetchMessages(sid);
    // Fetch live_chat_script from settings
    const checkSettings = async () => {
      const { data } = await supabase.from('settings').select('live_chat_script').eq('id', 1).single();
      if (data?.live_chat_script) {
        setLiveScript(data.live_chat_script);
      }
    };
    checkSettings();

    const subscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        if (payload.new.session_id === sid) {
          setMessages(prev => [...prev, payload.new]);
          if (payload.new.sender === 'admin' && !isOpen) {
            // Optional: Show notification if chat is closed
            if (typeof window !== "undefined" && Notification.permission === "granted") {
              new Notification("New message from Support", { body: payload.new.text });
            }
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // fetchMessages was moved inside useEffect to avoid hoisting and dependency issues.

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !sessionId) return;

    const msg = {
      session_id: sessionId,
      sender: 'user',
      text: newMessage.trim(),
    };

    setNewMessage("");
    await supabase.from('messages').insert([msg]);
  };

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  if (liveScript) {
    return <div dangerouslySetInnerHTML={{ __html: liveScript }} />;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-[350px] h-[500px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-[#1B1B5E]/10 mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300">
          {/* Header */}
          <div className="bg-[#1B1B5E] text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-wider text-sm">Customer Support</h3>
                <p className="text-[10px] text-green-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F5F5F7]/50">
            {messages.length === 0 ? (
              <div className="text-center text-xs font-bold text-[#1B1B5E]/40 mt-10">
                Send a message to start chatting with us. We reply immediately!
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={msg.id || idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      isUser 
                        ? 'bg-[#00AEEF] text-white rounded-br-sm shadow-md' 
                        : 'bg-white text-[#1B1B5E] rounded-bl-sm border border-[#1B1B5E]/5 shadow-sm'
                    }`}>
                      <p className="text-sm font-medium">{msg.text}</p>
                      <div className={`flex items-center gap-1 mt-1 text-[10px] font-bold ${isUser ? 'text-white/60 justify-end' : 'text-[#1B1B5E]/40'}`}>
                        <Clock className="w-3 h-3" />
                        {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[#1B1B5E]/5 bg-white shrink-0">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-[#F5F5F7] px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20 text-sm font-medium text-[#1B1B5E]"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-[#1B1B5E] hover:bg-[#00AEEF] text-white p-3 rounded-xl transition-colors shadow-md disabled:opacity-50 shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-[#1B1B5E] hover:bg-[#00AEEF] text-white rounded-full flex items-center justify-center shadow-2xl shadow-[#1B1B5E]/30 hover:scale-110 transition-all duration-300 relative group"
        >
          <MessageSquare className="w-7 h-7" />
          <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 border-2 border-white animate-pulse"></span>
        </button>
      )}
    </div>
  );
}
