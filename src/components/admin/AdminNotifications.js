"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Bell, X } from "lucide-react";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Request permission for native notifications if not already granted
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const channelName = `admin_notifications_${Date.now()}`;
    const subscription = supabase
      .channel(channelName)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
        addNotification("New Order Received!", `Order ID: ${payload.new.id.substring(0,8)}`);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, payload => {
        addNotification("New Customer Signup!", `Email: ${payload.new.email}`);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        if (payload.new.sender === 'user') {
          addNotification("New Live Chat Message!", payload.new.text.substring(0, 50));
        }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_ticket_messages' }, payload => {
        if (payload.new.sender_type === 'user') {
          addNotification("New Support Ticket Reply!", payload.new.message.substring(0, 50));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(subscription); };
  }, []);

  const addNotification = (title, message) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { id, title, message }]);
    
    // Auto remove after 6 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000);
    
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body: message });
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-24 right-8 z-[100] flex flex-col gap-3">
      {notifications.map(n => (
        <div key={n.id} className="bg-[#1B1B5E] text-white p-4 rounded-xl shadow-2xl min-w-[300px] max-w-[350px] border border-white/10 animate-in slide-in-from-right-8 fade-in duration-300 flex justify-between items-start">
          <div className="flex gap-3">
            <div className="bg-[#00AEEF]/20 p-2 rounded-lg text-[#00AEEF] shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider">{n.title}</h4>
              <p className="text-xs text-white/60 mt-1 font-medium">{n.message}</p>
            </div>
          </div>
          <button onClick={() => removeNotification(n.id)} className="text-white/40 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
