"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Send, User, Bot, MoreVertical, Search, CheckCheck, ChevronLeft } from "lucide-react";

export default function AdminChatRoom() {
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeSession, setActiveSession] = useState(null);

  const markAsRead = async (sid) => {
    await supabase.from('messages').update({ is_read: true }).eq('session_id', sid).eq('sender', 'user').eq('is_read', false);
  };

  const fetchChats = async () => {
    // Group messages by session_id to build chat list
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (!data) return;
    
    const sessionMap = {};
    data.forEach(msg => {
      if (!sessionMap[msg.session_id]) {
        sessionMap[msg.session_id] = {
          id: msg.session_id,
          name: "Guest_" + msg.session_id.substring(5, 9),
          lastMessage: msg.text,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: msg.created_at,
          unread: 0,
          active: msg.session_id === activeSession
        };
      }
      if (msg.sender === 'user' && !msg.is_read) {
        sessionMap[msg.session_id].unread += 1;
      }
    });
    
    const sortedChats = Object.values(sessionMap).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setChats(sortedChats);
  };

  useEffect(() => {
    fetchChats();

    const channelName = `admin_chat_messages_${Date.now()}`;
    const subscription = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, payload => {
        fetchChats(); // Refresh sidebar
        
        // If it's the active chat, append message or update it
        setMessages(prev => {
          if (payload.new && payload.new.session_id === activeSession) {
            if (payload.eventType === 'INSERT') {
              // Optimistically mark as read since admin is viewing it
              if (payload.new.sender === 'user') {
                markAsRead(payload.new.session_id);
              }
              return [...prev, payload.new];
            } else if (payload.eventType === 'UPDATE') {
              return prev.map(m => m.id === payload.new.id ? payload.new : m);
            }
          }
          return prev;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [activeSession]);

  const selectChat = async (sid) => {
    setActiveSession(sid);
    setChats(prev => prev.map(c => ({ ...c, active: c.id === sid, unread: c.id === sid ? 0 : c.unread })));
    
    const { data } = await supabase.from('messages').select('*').eq('session_id', sid).order('created_at', { ascending: true });
    if (data) setMessages(data);
    
    markAsRead(sid);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeSession) return;
    
    const msg = {
      session_id: activeSession,
      sender: 'admin',
      text: newMessage.trim(),
      is_read: false
    };

    setNewMessage("");
    // Optimistic update
    setMessages(prev => [...prev, { ...msg, id: Date.now(), created_at: new Date().toISOString() }]);

    await supabase.from('messages').insert([msg]);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-[#0A0A20] rounded-3xl border border-[#00AEEF]/10 overflow-hidden shadow-2xl">
      {/* Chat List Sidebar */}
      <div className={`w-full md:w-1/3 border-r border-[#00AEEF]/10 flex flex-col bg-[#050510]/50 ${activeSession ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-[#00AEEF]/10">
          <h2 className="text-xl font-bold text-white mb-4">Support Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-[#1B1B5E]/30 border border-[#00AEEF]/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00AEEF] transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">
              No active chats
            </div>
          ) : (
            chats.map((chat) => (
              <div key={chat.id} onClick={() => selectChat(chat.id)} className={`p-4 border-b border-[#00AEEF]/5 cursor-pointer transition-all ${chat.active ? 'bg-[#1B1B5E]/40 border-l-4 border-l-[#00AEEF]' : 'hover:bg-white/5'}`}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-sm font-bold ${chat.active ? 'text-white' : 'text-gray-400'}`}>{chat.name}</h3>
                  <span className="text-[10px] text-gray-500 font-medium uppercase">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 truncate max-w-[85%]">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="bg-[#00AEEF] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,174,239,0.4)]">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-[#050510]/30 w-full md:w-2/3 ${!activeSession ? 'hidden md:flex' : 'flex'}`}>
        {/* Chat Header */}
        <div className="h-20 border-b border-[#00AEEF]/10 flex items-center justify-between px-6 bg-[#0A0A20]">
          {activeSession ? (
            <div className="flex items-center space-x-3">
              <button onClick={() => setActiveSession(null)} className="md:hidden text-white mr-2">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-[#1B1B5E] border border-[#00AEEF]/20 flex items-center justify-center text-[#00AEEF]">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">Active Customer</h3>
                <p className="text-[10px] text-green-400 font-bold flex items-center uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 inline-block shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                  Active Now
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#1B1B5E]/30 flex items-center justify-center text-gray-500">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-400">Waiting for messages...</h3>
              </div>
            </div>
          )}
          <button className="text-gray-500 hover:text-white transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex justify-center">
            <span className="text-[10px] text-gray-500 bg-[#1B1B5E]/30 px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-[#00AEEF]/10">Today</span>
          </div>
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                <div className={`px-5 py-3.5 rounded-2xl shadow-xl ${msg.sender === 'admin' ? 'bg-[#00AEEF] text-white rounded-tr-none' : 'bg-[#1B1B5E] text-gray-200 rounded-tl-none border border-[#00AEEF]/10'}`}>
                  <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">{msg.text}</p>
                </div>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                  </span>
                  {msg.sender === 'admin' && (
                    <CheckCheck className={`w-3.5 h-3.5 ${msg.is_read ? 'text-[#00AEEF]' : 'text-gray-500'}`} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-6 bg-[#0A0A20] border-t border-[#00AEEF]/10">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!activeSession}
              placeholder={activeSession ? "Type your response..." : "Select a chat first..."}
              className="w-full bg-[#1B1B5E]/30 border border-[#00AEEF]/10 rounded-2xl pl-6 pr-16 py-4 text-white focus:outline-none focus:border-[#00AEEF] transition-all placeholder:text-gray-600 disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={!activeSession || !newMessage.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#00AEEF] hover:bg-white hover:text-[#00AEEF] text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
