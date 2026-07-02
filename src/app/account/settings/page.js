"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Settings, Loader2, ShieldAlert, Key, Bell, Shield, Smartphone } from "lucide-react";

const NotificationToggle = ({ id, title, desc, icon, active, onToggle }) => (
  <div className="flex items-center justify-between p-4 bg-[#F5F5F7] rounded-2xl border border-[#1B1B5E]/5 hover:bg-white hover:border-[#1B1B5E]/10 transition-colors cursor-pointer" onClick={() => onToggle(id)}>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-[#1B1B5E]">{title}</h3>
        <p className="text-xs text-[#1B1B5E]/60">{desc}</p>
      </div>
    </div>
    <div className={`w-12 h-6 rounded-full transition-colors relative ${active ? 'bg-[#00AEEF]' : 'bg-gray-300'}`}>
      <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${active ? 'translate-x-6' : ''}`} />
    </div>
  </div>
);

export default function SettingsPage() {
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [prefs, setPrefs] = useState({ order_updates: true, email_promos: false, sms_alerts: false });

  useEffect(() => {
    setLoading(false);
  }, []);

  const togglePref = (id) => {
    setPrefs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({ password: formData.password });
    
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Success: Password updated securely!");
      setFormData({ password: "", confirmPassword: "" });
    }
    setSubmitting(false);
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#00AEEF]" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#1B1B5E]/5">
        <h2 className="text-2xl font-black text-[#1B1B5E] uppercase tracking-tighter mb-6 flex items-center gap-2">
          <Settings className="w-6 h-6 text-gray-500" />
          Account Settings
        </h2>

        <div className="max-w-xl space-y-8">
          
          {/* Notification Preferences */}
          <div className="space-y-4">
            <h3 className="font-bold text-[#1B1B5E] uppercase tracking-widest text-xs flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-[#00AEEF]" /> Notifications
            </h3>
            <NotificationToggle id="order_updates" title="Order Updates" desc="Get notified when your order status changes." icon="📦" active={prefs.order_updates} onToggle={togglePref} />
            <NotificationToggle id="email_promos" title="Promotions & Offers" desc="Receive exclusive discounts and flash sale alerts via email." icon="🎉" active={prefs.email_promos} onToggle={togglePref} />
            <NotificationToggle id="sms_alerts" title="SMS Alerts" desc="Get urgent delivery updates directly to your phone via SMS." icon="📱" active={prefs.sms_alerts} onToggle={togglePref} />
          </div>

          {/* Password Update */}
          <div className="bg-[#F5F5F7] p-6 rounded-2xl border border-[#1B1B5E]/5">
            <h3 className="font-bold text-[#1B1B5E] uppercase tracking-widest text-xs flex items-center gap-2 mb-4">
              <Key className="w-4 h-4 text-[#00AEEF]" /> Update Password
            </h3>
            
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-[#1B1B5E]/50 uppercase tracking-widest block mb-1">New Password</label>
                <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-[#1B1B5E]/10 outline-none focus:border-[#00AEEF] text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-[#1B1B5E]/50 uppercase tracking-widest block mb-1">Confirm New Password</label>
                <input required type="password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-[#1B1B5E]/10 outline-none focus:border-[#00AEEF] text-sm" />
              </div>
              
              {message && (
                <div className={`p-3 rounded-xl text-xs font-bold ${message.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message}
                </div>
              )}

              <button type="submit" disabled={submitting} className="bg-[#1B1B5E] text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#00AEEF] transition-colors flex items-center gap-2 w-max">
                {submitting && <Loader2 className="w-3 h-3 animate-spin" />} Update Password
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
            <h3 className="font-bold text-red-600 uppercase tracking-widest text-xs flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4" /> Danger Zone
            </h3>
            <p className="text-sm text-red-600/70 mb-4 font-medium">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="bg-white text-red-600 border border-red-200 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors">
              Delete Account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
