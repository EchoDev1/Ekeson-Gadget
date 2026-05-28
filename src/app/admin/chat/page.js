"use client";
import { useState } from "react";
import { Send, User, Bot, MoreVertical, Search, CheckCheck } from "lucide-react";

export default function AdminChatRoom() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'user', name: 'Chinedu Okafor', text: 'Hi, I need help with my order ORD-001. It says delivered but I haven\'t received it yet in my Lekki office.', time: '10:42 AM', read: true },
    { id: 2, sender: 'admin', name: 'Support', text: 'Hello Chinedu! I apologize for the delay. Let me check the courier status for Lagos deliveries right away.', time: '10:45 AM', read: true },
    { id: 3, sender: 'admin', name: 'Support', text: 'Our delivery agent is currently in your building. Could you please check with the security at the gate?', time: '10:48 AM', read: true },
    { id: 4, sender: 'user', name: 'Chinedu Okafor', text: 'Yes, they just brought it up! Thank you so much for the swift response.', time: '11:05 AM', read: false },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setMessages([
      ...messages,
      {
        id: Date.now(),
        sender: 'admin',
        name: 'Support',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      }
    ]);
    setNewMessage("");
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
          {[
            { id: 1, name: "Chinedu Okafor", lastMessage: "Yes, they just brought it up! Thank you...", time: "11:05 AM", unread: 1, active: true },
            { id: 2, name: "Amina Yusuf", lastMessage: "Is the Samsung Galaxy Watch in stock?", time: "09:30 AM", unread: 0, active: false },
            { id: 3, name: "Tunde Balogun", lastMessage: "I want to change my delivery address to Abuja.", time: "Yesterday", unread: 0, active: false },
          ].map((chat) => (
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
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#050510]/30">
        {/* Chat Header */}
        <div className="h-20 border-b border-[#00AEEF]/10 flex items-center justify-between px-6 bg-[#0A0A20]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#1B1B5E] border border-[#00AEEF]/20 flex items-center justify-center text-[#00AEEF]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white">Chinedu Okafor</h3>
              <p className="text-[10px] text-green-400 font-bold flex items-center uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 inline-block shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                Active Now
              </p>
            </div>
          </div>
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
