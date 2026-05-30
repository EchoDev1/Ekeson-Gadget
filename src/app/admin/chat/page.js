"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Send, User, Bot, MoreVertical, Search, CheckCheck } from "lucide-react";

export default function AdminChatRoom() {
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]); // Clear dummy chats
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Listen for incoming live chat messages swiftly using Supabase Broadcast
    const channel = supabase.channel('public:live-chat');
    
    channel.on('broadcast', { event: 'message' }, (payload) => {
      setMessages(prev => [...prev, payload.payload]);
    }).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const msg = {
      id: Date.now(),
      sender: 'admin',
      name: 'Support',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    // Optimistically update UI instantly for swift responsiveness
    setMessages(prev => [...prev, msg]);
    setNewMessage("");

    // Broadcast instantly to customer
    await supabase.channel('public:live-chat').send({
      type: 'broadcast',
      event: 'message',
      payload: msg
    });
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-[#0A0A20] rounded-3xl border border-[#00AEEF]/10 overflow-hidden shadow-2xl">
      {/* Chat List Sidebar */}
      <div className="w-1/3 border-r border-[#00AEEF]/10 hidden md:flex flex-col bg-[#050510]/50">
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
              <div key={chat.id} className={`p-4 border-b border-[#00AEEF]/5 cursor-pointer transition-all ${chat.active ? 'bg-[#1B1B5E]/40 border-l-4 border-l-[#00AEEF]' : 'hover:bg-white/5'}`}>
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
      <div className="flex-1 flex flex-col bg-[#050510]/30">
        {/* Chat Header */}
        <div className="h-20 border-b border-[#00AEEF]/10 flex items-center justify-between px-6 bg-[#0A0A20]">
          {chats.length > 0 ? (
            <div className="flex items-center space-x-3">
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
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                <div className={`px-5 py-3.5 rounded-2xl shadow-xl ${msg.sender === 'admin' ? 'bg-[#00AEEF] text-white rounded-tr-none' : 'bg-[#1B1B5E] text-gray-200 rounded-tl-none border border-[#00AEEF]/10'}`}>
                  <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
                </div>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{msg.time}</span>
                  {msg.sender === 'admin' && (
                    <CheckCheck className={`w-3.5 h-3.5 ${msg.read ? 'text-[#00AEEF]' : 'text-gray-500'}`} />
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
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your reply to customer..."
              className="w-full bg-[#1B1B5E]/30 border border-[#00AEEF]/10 rounded-2xl pl-6 pr-14 py-4 text-sm text-white focus:outline-none focus:border-[#00AEEF] transition-all"
            />
            <button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="absolute right-3 p-3 bg-[#00AEEF] hover:bg-[#0090c8] disabled:bg-gray-700 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(0,174,239,0.2)]"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
