"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Loader2, Wallet, MapPin, Globe } from "lucide-react";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    usdt_wallet_address: "",
    usdt_network: "TRC20",
    shipping_fee_inside_lagos_abuja: 0,
    shipping_fee_outside_lagos_abuja: 0,
    shipping_fee_african_countries: 0,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();
      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: name.includes("shipping") ? parseFloat(value) || 0 : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Upsert logic for id=1
      const { error } = await supabase.from("settings").upsert({
        id: 1,
        ...settings,
        updated_at: new Date()
      });
      if (error) throw error;
      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#00AEEF]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">System Settings</h1>
        <p className="text-[#1B1B5E]/60 text-sm font-medium tracking-wide mt-1">Configure Crypto payments and shipping zones.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Crypto Settings */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#1B1B5E]/5 space-y-6">
          <h2 className="text-xl font-black text-[#1B1B5E] uppercase tracking-wider flex items-center gap-3">
            <Wallet className="w-6 h-6 text-[#00AEEF]" />
            Crypto Payments (USDT)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">USDT Wallet Address</label>
              <input 
                type="text" 
                name="usdt_wallet_address"
                value={settings.usdt_wallet_address}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:border-[#00AEEF] focus:bg-white outline-none transition-colors font-mono"
                placeholder="e.g. TYP89..."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Network</label>
              <select 
                name="usdt_network"
                value={settings.usdt_network}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:border-[#00AEEF] focus:bg-white outline-none transition-colors font-bold"
              >
                <option value="TRC20">TRC20 (Tron)</option>
                <option value="ERC20">ERC20 (Ethereum)</option>
                <option value="BEP20">BEP20 (Binance Smart Chain)</option>
              </select>
            </div>
          </div>
          <p className="text-xs text-[#1B1B5E]/50 font-medium">* System automatically fetches live market rate and adds a $3 premium.</p>
        </div>

        {/* Shipping Settings */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#1B1B5E]/5 space-y-6">
          <h2 className="text-xl font-black text-[#1B1B5E] uppercase tracking-wider flex items-center gap-3">
            <MapPin className="w-6 h-6 text-green-500" />
            Shipping Fees (₦)
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F5F5F7]">
              <div>
                <h4 className="font-bold text-[#1B1B5E]">Inside Lagos & Abuja</h4>
                <p className="text-xs text-[#1B1B5E]/60">Standard local delivery fee.</p>
              </div>
              <div className="w-48 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#1B1B5E]/50">₦</span>
                <input 
                  type="number" 
                  name="shipping_fee_inside_lagos_abuja"
                  value={settings.shipping_fee_inside_lagos_abuja}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-3 bg-white rounded-xl border border-transparent focus:border-[#00AEEF] outline-none transition-colors font-bold text-right"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F5F5F7]">
              <div>
                <h4 className="font-bold text-[#1B1B5E]">Outside Lagos & Abuja</h4>
                <p className="text-xs text-[#1B1B5E]/60">Inter-state delivery fee.</p>
              </div>
              <div className="w-48 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#1B1B5E]/50">₦</span>
                <input 
                  type="number" 
                  name="shipping_fee_outside_lagos_abuja"
                  value={settings.shipping_fee_outside_lagos_abuja}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-3 bg-white rounded-xl border border-transparent focus:border-[#00AEEF] outline-none transition-colors font-bold text-right"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F5F5F7]">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#1B1B5E]/40" />
                <div>
                  <h4 className="font-bold text-[#1B1B5E]">Other African Countries</h4>
                  <p className="text-xs text-[#1B1B5E]/60">International delivery fee.</p>
                </div>
              </div>
              <div className="w-48 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#1B1B5E]/50">₦</span>
                <input 
                  type="number" 
                  name="shipping_fee_african_countries"
                  value={settings.shipping_fee_african_countries}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-3 bg-white rounded-xl border border-transparent focus:border-[#00AEEF] outline-none transition-colors font-bold text-right"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-[#1B1B5E] hover:bg-[#00AEEF] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-300 shadow-lg shadow-[#1B1B5E]/20 hover:shadow-[#00AEEF]/30 hover:-translate-y-1 flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
