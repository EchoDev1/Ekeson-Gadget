"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Bell, Loader2, CheckCircle } from "lucide-react";

export default function NotificationsPage() {
  const [preferences, setPreferences] = useState({
    email_orders: true,
    email_promos: false,
    sms_alerts: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from('profiles').select('notification_preferences').eq('id', session.user.id).single();
        if (data?.notification_preferences) {
          setPreferences({ ...preferences, ...data.notification_preferences });
        }
      }
      setLoading(false);
    };
    fetchPrefs();
  }, []);

  const togglePref = async (key) => {
    const newPrefs = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPrefs);
    setSaving(true);
    
    const { data: { session } } = await supabase.auth.getSession();
    await supabase.from('profiles').update({ notification_preferences: newPrefs }).eq('id', session.user.id);
    
    setSaving(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#00AEEF]" /></div>;

  const NotificationToggle = ({ id, title, desc, icon }) => (
    <div className="flex items-center justify-between p-4 bg-[#F5F5F7] rounded-2xl border border-[#1B1B5E]/5 hover:bg-white hover:border-[#1B1B5E]/10 transition-colors cursor-pointer" onClick={() => togglePref(id)}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl bg-white shadow-sm border border-[#1B1B5E]/5`}>{icon}</div>
        <div>
          <h3 className="font-bold text-[#1B1B5E]">{title}</h3>
          <p className="text-xs font-medium text-[#1B1B5E]/50 mt-0.5">{desc}</p>
        </div>
      </div>
      <div className={`w-12 h-6 rounded-full transition-colors relative ${preferences[id] ? 'bg-[#00AEEF]' : 'bg-gray-300'}`}>
        <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${preferences[id] ? 'translate-x-7' : 'translate-x-1'}`}></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#1B1B5E]/5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-[#1B1B5E] uppercase tracking-tighter flex items-center gap-2">
            <Bell className="w-6 h-6 text-orange-500" />
            Notification Preferences
          </h2>
          {saving && <Loader2 className="w-4 h-4 animate-spin text-[#00AEEF]" />}
          {savedMessage && <span className="flex items-center gap-1 text-xs font-bold text-green-500 uppercase tracking-widest"><CheckCircle className="w-3 h-3" /> Saved</span>}
        </div>

        <div className="space-y-4 max-w-2xl">
          <NotificationToggle 
            id="email_orders"
            title="Order Updates"
            desc="Get emails about your order status, shipping, and delivery."
            icon="📦"
          />
          <NotificationToggle 
            id="email_promos"
            title="Promotions & Offers"
            desc="Receive exclusive discounts and flash sale alerts via email."
            icon="🎉"
          />
          <NotificationToggle 
            id="sms_alerts"
            title="SMS Alerts"
            desc="Get urgent delivery updates directly to your phone via SMS."
            icon="📱"
          />
        </div>
      </div>
    </div>
  );
}
