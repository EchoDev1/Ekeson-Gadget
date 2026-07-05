"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Loader2, Wallet, MapPin, Globe, FileText } from "lucide-react";

let cachedSettings = null;

export default function AdminSettings() {
  const [loading, setLoading] = useState(!cachedSettings);
  const [saving, setSaving] = useState(false);
  const [liveApiRate, setLiveApiRate] = useState(null);
  const [settings, setSettings] = useState(cachedSettings || {
    usdt_wallet_address: "",
    usdt_network: "TRC20",
    usdt_rate: "",
    shipping_fee_inside_lagos_abuja: 0,
    shipping_fee_outside_lagos_abuja: 0,
    shipping_fee_african_countries: 0,
    paystack_public_key: "",
    flutterwave_public_key: "",
    monnify_api_key: "",
    monnify_contract_code: "",
    bank_transfer_details: "",
    opay_merchant_id: "",
    palmpay_merchant_id: "",
    warranty_policy_text: "",
    delivery_policy_text: "",
    privacy_policy_text: "",
    refund_policy_text: "",
    terms_policy_text: "",
    is_maintenance_mode: false,
    is_checkout_locked: false,
    social_facebook: "",
    social_instagram: "",
    social_twitter: "",
    footer_hq_address: "Lagos/Abuja Nigeria",
    footer_hq_phone: "+234 814 852 7697",
    footer_hq_email: "office@ekesongroup.com",
    footer_service_links: [
      { label: "Order Tracking", url: "/track-order" },
      { label: "Technical Support", url: "/support" },
      { label: "Warranty Policy", url: "/warranty" },
      { label: "Contact Office", url: "/contact" }
    ],
    footer_policy_links: [
      { label: "Delivery/Shipping Policy", url: "/delivery-shipping" },
      { label: "Terms and Conditions", url: "/terms" },
      { label: "Privacy Policy", url: "/privacy" },
      { label: "Refund Policy", url: "/refund" }
    ],
    header_links: [
      { label: "Phones", url: "/category/phones" },
      { label: "Laptops", url: "/category/laptops" },
      { label: "Pads", url: "/category/pads" },
      { label: "Accessories", url: "/category/accessories" },
      { label: "PlayStation", url: "/category/playstation" },
      { label: "Drones", url: "/category/drones" }
    ],
    hero_title: "PREMIUM TECH<br/>SIMPLE ACCESS",
    hero_subtitle: "Nigeria's most trusted destination for genuine brand new and Grade-A UK used gadgets. Verified standards, transparent pricing.",
    hero_media_url: "",
    hero_media_type: "image",
    footer_brand_text: "Nigeria's trusted source for premium global technology. Professional service, verified specifications, and secure logistics.",
    footer_catalog_links: [
      { label: "Smartphones", url: "/category/phones" },
      { label: "Laptops", url: "/category/laptops" },
      { label: "Tablets & Pads", url: "/category/pads" },
      { label: "Accessories", url: "/category/accessories" }
    ],
    live_chat_script: "",
  });



  async function fetchSettings() {
    try {
      const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();
      if (data) {
        setSettings({
          ...data,
          category_writeups: data.category_writeups || {
            phones: { title: "Phones", description: "Discover our curated collection of phones. From the latest releases to certified pre-owned excellence.", button_text: "Enter Phones Portal" },
            laptops: { title: "Laptops", description: "Discover our curated collection of laptops. From the latest releases to certified pre-owned excellence.", button_text: "Enter Laptops Portal" },
            pads: { title: "iPads", description: "Discover our curated collection of ipads. From the latest releases to certified pre-owned excellence.", button_text: "Enter iPads Portal" },
            smart_watches: { title: "Smart Watches", description: "Discover our curated collection of smart watches. From the latest releases to certified pre-owned excellence.", button_text: "Enter Smart Watches Portal" },
            earbuds: { title: "Earbuds", description: "Discover our curated collection of earbuds. From the latest releases to certified pre-owned excellence.", button_text: "Enter Earbuds Portal" },
            accessories: { title: "Accessories", description: "Discover our curated collection of accessories. From the latest releases to certified pre-owned excellence.", button_text: "Enter Accessories Portal" },
            playstation: { title: "PlayStation", description: "Discover our curated collection of playstation. From the latest releases to certified pre-owned excellence.", button_text: "Enter PlayStation Portal" },
            drones: { title: "Drones", description: "Discover our curated collection of drones. From the latest releases to certified pre-owned excellence.", button_text: "Enter Drones Portal" }
          },
          footer_service_links: data.footer_service_links || [
            { label: "Order Tracking", url: "/track-order" },
            { label: "Technical Support", url: "/support" },
            { label: "Warranty Policy", url: "/warranty" },
            { label: "Contact Office", url: "/contact" }
          ],
          footer_policy_links: data.footer_policy_links || [
            { label: "Delivery/Shipping Policy", url: "/delivery-shipping" },
            { label: "Terms and Conditions", url: "/terms" },
            { label: "Privacy Policy", url: "/privacy" },
            { label: "Refund Policy", url: "/refund" }
          ],
          header_links: data.header_links || [
            { label: "Phones", url: "/category/phones" },
            { label: "Laptops", url: "/category/laptops" },
            { label: "Pads", url: "/category/pads" },
            { label: "Accessories", url: "/category/accessories" },
            { label: "PlayStation", url: "/category/playstation" },
            { label: "Drones", url: "/category/drones" }
          ],
          footer_catalog_links: data.footer_catalog_links || [
            { label: "Smartphones", url: "/category/phones" },
            { label: "Laptops", url: "/category/laptops" },
            { label: "Tablets & Pads", url: "/category/pads" },
            { label: "Accessories", url: "/category/accessories" }
          ]
        });
        cachedSettings = data;
      }
    } catch (err) {
      console.warn("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    
    // Fetch live API rate to display as reference
    fetch("/api/usdt-rate")
      .then(res => res.json())
      .then(data => {
        if (data && data.rate) setLiveApiRate(data.rate);
      })
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: name.includes("shipping") ? parseFloat(value) || 0 : value
    }));
  };

  const handleWriteupChange = (catId, field, value) => {
    setSettings(prev => {
      const currentWriteups = prev.category_writeups || {
        phones: { title: "Phones", description: "Discover our curated collection of phones. From the latest releases to certified pre-owned excellence.", button_text: "Enter Phones Portal" },
        laptops: { title: "Laptops", description: "Discover our curated collection of laptops. From the latest releases to certified pre-owned excellence.", button_text: "Enter Laptops Portal" },
        pads: { title: "iPads", description: "Discover our curated collection of ipads. From the latest releases to certified pre-owned excellence.", button_text: "Enter iPads Portal" },
        smart_watches: { title: "Smart Watches", description: "Discover our curated collection of smart watches. From the latest releases to certified pre-owned excellence.", button_text: "Enter Smart Watches Portal" },
        earbuds: { title: "Earbuds", description: "Discover our curated collection of earbuds. From the latest releases to certified pre-owned excellence.", button_text: "Enter Earbuds Portal" },
        accessories: { title: "Accessories", description: "Discover our curated collection of accessories. From the latest releases to certified pre-owned excellence.", button_text: "Enter Accessories Portal" },
        playstation: { title: "PlayStation", description: "Discover our curated collection of playstation. From the latest releases to certified pre-owned excellence.", button_text: "Enter PlayStation Portal" },
        drones: { title: "Drones", description: "Discover our curated collection of drones. From the latest releases to certified pre-owned excellence.", button_text: "Enter Drones Portal" }
      };
      
      return {
        ...prev,
        category_writeups: {
          ...currentWriteups,
          [catId]: {
            ...currentWriteups[catId],
            [field]: value
          }
        }
      };
    });
  };

  const handleLinkChange = (type, index, field, value) => {
    const newLinks = [...(settings[type] || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSettings({ ...settings, [type]: newLinks });
  };
  const addLink = (type) => {
    setSettings({ ...settings, [type]: [...(settings[type] || []), { label: "", url: "" }] });
  };
  const removeLink = (type, index) => {
    const newLinks = [...(settings[type] || [])];
    newLinks.splice(index, 1);
    setSettings({ ...settings, [type]: newLinks });
  };

  const handleHeroImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL("image/webp", 0.8);
        setSettings({ ...settings, hero_media_url: dataUrl, hero_media_type: "image" });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer Udi'
        },
        body: JSON.stringify(settings)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save settings');
      }

      cachedSettings = settings;
      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Failed to save settings: " + (err.message || ""));
    } finally {
      setSaving(false);
    }
  };

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

              <div>
                <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest flex items-center gap-2">
                  Manual Exchange Rate (USDT/NGN)
                  <span className="bg-[#1B1B5E]/5 text-[#1B1B5E]/60 text-[10px] px-2 py-0.5 rounded-full normal-case">Optional Override</span>
                </label>
                <p className="text-[10px] text-[#1B1B5E]/50 mt-1 mb-2">
                  If set, this perfectly accurate rate will override the live market API. 
                  {liveApiRate ? <span className="font-bold text-[#00AEEF]"> Currently live API says ₦{liveApiRate}.</span> : ""}
                </p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-[#1B1B5E]/40 font-bold">₦</span>
                  </div>
                  <input 
                    type="number" 
                    name="usdt_rate"
                    value={settings.usdt_rate || ""}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:border-[#00AEEF] focus:bg-white outline-none transition-colors font-bold text-[#1B1B5E]"
                    placeholder="e.g. 1389"
                  />
                </div>
              </div>
            </div>
          <p className="text-xs text-[#1B1B5E]/50 font-medium">* System automatically fetches live market rate and adds a $5 safety premium.</p>
        </div>

        {/* Other Payment Gateways */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#1B1B5E]/5 space-y-6">
          <h2 className="text-xl font-black text-[#1B1B5E] uppercase tracking-wider flex items-center gap-3">
            <Wallet className="w-6 h-6 text-[#1B1B5E]" />
            Local Payment Gateways
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Paystack Public Key</label>
              <input 
                type="text" 
                name="paystack_public_key"
                value={settings.paystack_public_key || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:border-[#00AEEF] focus:bg-white outline-none transition-colors"
                placeholder="pk_live_..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Flutterwave Public Key</label>
              <input 
                type="text" 
                name="flutterwave_public_key"
                value={settings.flutterwave_public_key || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:border-[#00AEEF] focus:bg-white outline-none transition-colors"
                placeholder="FLWPUBK_..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Monnify API Key</label>
              <input 
                type="text" 
                name="monnify_api_key"
                value={settings.monnify_api_key || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:border-[#00AEEF] focus:bg-white outline-none transition-colors"
                placeholder="MK_PROD_..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Monnify Contract Code</label>
              <input 
                type="text" 
                name="monnify_contract_code"
                value={settings.monnify_contract_code || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:border-[#00AEEF] focus:bg-white outline-none transition-colors"
                placeholder="e.g. 1234567890"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">OPay Merchant ID / Info</label>
              <input 
                type="text" 
                name="opay_merchant_id"
                value={settings.opay_merchant_id || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:border-[#00AEEF] focus:bg-white outline-none transition-colors"
                placeholder="OPay Details"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">PalmPay Merchant ID / Info</label>
              <input 
                type="text" 
                name="palmpay_merchant_id"
                value={settings.palmpay_merchant_id || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:border-[#00AEEF] focus:bg-white outline-none transition-colors"
                placeholder="PalmPay Details"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Bank Transfer Details</label>
              <textarea 
                name="bank_transfer_details"
                value={settings.bank_transfer_details || ""}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:border-[#00AEEF] focus:bg-white outline-none transition-colors"
                placeholder="Bank Name: GTBank&#10;Account Number: 0123456789&#10;Account Name: Ekeson Gadgets"
              />
            </div>
          </div>
          <p className="text-xs text-[#1B1B5E]/50 font-medium">* Leave keys empty to disable specific payment methods at checkout.</p>
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

        {/* God Mode Operations */}
        <div className="bg-red-50 p-8 rounded-3xl shadow-sm border border-red-200 space-y-6">
          <h2 className="text-xl font-black text-red-600 uppercase tracking-wider flex items-center gap-3">
            <Globe className="w-6 h-6" />
            God Mode Operations
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
              <div>
                <h4 className="font-bold text-[#1B1B5E]">Store Maintenance Mode</h4>
                <p className="text-xs text-[#1B1B5E]/60 max-w-sm mt-1">When active, the entire public storefront is replaced with a maintenance screen. Customers cannot browse products.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="is_maintenance_mode"
                  checked={settings.is_maintenance_mode || false}
                  onChange={e => setSettings({...settings, is_maintenance_mode: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
              <div>
                <h4 className="font-bold text-[#1B1B5E]">Checkout Lock</h4>
                <p className="text-xs text-[#1B1B5E]/60 max-w-sm mt-1">Allows customers to browse products, but globally disables the &quot;Place Order&quot; button at checkout.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="is_checkout_locked"
                  checked={settings.is_checkout_locked || false}
                  onChange={e => setSettings({...settings, is_checkout_locked: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Content Management */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#1B1B5E]/5 space-y-6">
          <h2 className="text-xl font-black text-[#1B1B5E] uppercase tracking-wider flex items-center gap-3">
            <FileText className="w-6 h-6 text-purple-500" />
            Content Management
          </h2>

          <div className="space-y-8 mt-6 border-t border-[#1B1B5E]/5 pt-6">
            <h2 className="text-xl font-black text-[#1B1B5E] uppercase tracking-wider flex items-center gap-3 border-b border-[#1B1B5E]/10 pb-4">
              <FileText className="w-6 h-6 text-[#00AEEF]" />
              Store Policies
            </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Warranty Policy</label>
                  <textarea
                    value={settings.warranty_policy_text || ""}
                    onChange={e => setSettings({...settings, warranty_policy_text: e.target.value})}
                    rows={6}
                    className="w-full mt-2 px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#00AEEF] focus:bg-white focus:ring-4 focus:ring-[#00AEEF]/10 transition-all resize-y"
                    placeholder="Enter full warranty policy text..."
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Delivery & Shipping Policy</label>
                  <textarea
                    value={settings.delivery_policy_text || ""}
                    onChange={e => setSettings({...settings, delivery_policy_text: e.target.value})}
                    rows={6}
                    className="w-full mt-2 px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#00AEEF] focus:bg-white focus:ring-4 focus:ring-[#00AEEF]/10 transition-all resize-y"
                    placeholder="Enter delivery & shipping policy text..."
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Refund & Returns Policy</label>
                  <textarea
                    value={settings.refund_policy_text || ""}
                    onChange={e => setSettings({...settings, refund_policy_text: e.target.value})}
                    rows={6}
                    className="w-full mt-2 px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#00AEEF] focus:bg-white focus:ring-4 focus:ring-[#00AEEF]/10 transition-all resize-y"
                    placeholder="Enter refund & returns policy text..."
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Terms and Conditions</label>
                  <textarea
                    value={settings.terms_policy_text || ""}
                    onChange={e => setSettings({...settings, terms_policy_text: e.target.value})}
                    rows={6}
                    className="w-full mt-2 px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#00AEEF] focus:bg-white focus:ring-4 focus:ring-[#00AEEF]/10 transition-all resize-y"
                    placeholder="Enter terms and conditions text..."
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Privacy Policy</label>
                  <textarea
                    value={settings.privacy_policy_text || ""}
                    onChange={e => setSettings({...settings, privacy_policy_text: e.target.value})}
                    rows={6}
                    className="w-full mt-2 px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#00AEEF] focus:bg-white focus:ring-4 focus:ring-[#00AEEF]/10 transition-all resize-y"
                    placeholder="Enter privacy policy text..."
                  />
                </div>
              </div>
            </div>
        </div>

        {/* Header Configuration */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#1B1B5E]/5 space-y-6">
          <h2 className="text-xl font-black text-[#1B1B5E] uppercase tracking-wider flex items-center gap-3">
            <Globe className="w-6 h-6 text-indigo-500" />
            Header Navigation
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Navigation Links</label>
              <button type="button" onClick={() => addLink('header_links')} className="text-xs font-bold text-[#00AEEF] hover:underline">
                + Add Link
              </button>
            </div>
            <div className="space-y-2">
              {(settings.header_links || []).map((link, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input type="text" value={link.label} onChange={(e) => handleLinkChange('header_links', i, 'label', e.target.value)} placeholder="Label (e.g. Phones)" className="w-1/2 px-3 py-2 bg-[#F5F5F7] rounded-lg border-transparent focus:border-[#00AEEF] outline-none text-sm" />
                  <input type="text" value={link.url} onChange={(e) => handleLinkChange('header_links', i, 'url', e.target.value)} placeholder="URL (e.g. /category/phones)" className="w-1/2 px-3 py-2 bg-[#F5F5F7] rounded-lg border-transparent focus:border-[#00AEEF] outline-none text-sm" />
                  <button type="button" onClick={() => removeLink('header_links', i)} className="text-red-500 font-bold p-2 text-xs">X</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Social Media Links Section --- */}
        <div className="bg-[#FFFDF5] rounded-3xl p-6 sm:p-8 md:p-10 border border-[#1B1B5E]/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#00AEEF]/5 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-700" />
          
          <div className="flex items-start gap-4 sm:gap-6 mb-8 md:mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00AEEF] to-[#00AEEF]/80 flex items-center justify-center shadow-lg shadow-[#00AEEF]/20 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1B1B5E] mb-2 tracking-tight">Social Media Portals</h2>
              <p className="text-sm text-[#1B1B5E]/60 font-medium">Configure direct links to your official social media pages.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest mb-3 block">Facebook URL</label>
              <input 
                type="url" 
                name="social_facebook"
                value={settings.social_facebook || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white rounded-xl border border-[#1B1B5E]/10 focus:border-[#00AEEF] outline-none transition-colors font-medium text-[#1B1B5E]"
                placeholder="https://facebook.com/ekesongadget"
              />
            </div>
            
            <div>
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest mb-3 block">Instagram URL</label>
              <input 
                type="url" 
                name="social_instagram"
                value={settings.social_instagram || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white rounded-xl border border-[#1B1B5E]/10 focus:border-[#00AEEF] outline-none transition-colors font-medium text-[#1B1B5E]"
                placeholder="https://instagram.com/ekesongadget"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest mb-3 block">Twitter / X URL</label>
              <input 
                type="url" 
                name="social_twitter"
                value={settings.social_twitter || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white rounded-xl border border-[#1B1B5E]/10 focus:border-[#00AEEF] outline-none transition-colors font-medium text-[#1B1B5E]"
                placeholder="https://twitter.com/ekesongadget"
              />
            </div>
          </div>
        </div>

        {/* --- Legal Pages Section --- */}
        {/* Hero Configuration */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#1B1B5E]/5 space-y-6">
          <h2 className="text-xl font-black text-[#1B1B5E] uppercase tracking-wider flex items-center gap-3">
            <FileText className="w-6 h-6 text-pink-500" />
            Hero Section
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Hero Title (HTML supported)</label>
              <textarea 
                name="hero_title"
                value={settings.hero_title || ""}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:border-[#00AEEF] focus:bg-white outline-none transition-colors font-mono text-sm"
                placeholder="PREMIUM TECH<br/>SIMPLE ACCESS"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Hero Subtitle</label>
              <textarea 
                name="hero_subtitle"
                value={settings.hero_subtitle || ""}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:border-[#00AEEF] focus:bg-white outline-none transition-colors"
              />
            </div>
            <div className="space-y-4 md:col-span-2 p-4 bg-[#F5F5F7] rounded-2xl">
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest block">Hero Background Media</label>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-2">
                  <span className="text-xs font-bold text-[#1B1B5E]/60 block">1. Upload Image (Auto-compressed to Base64)</span>
                  <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="w-full text-sm" />
                </div>
                <div className="flex-1 space-y-2">
                  <span className="text-xs font-bold text-[#1B1B5E]/60 block">2. Or Paste Video URL (.mp4 / youtube)</span>
                  <input type="text" name="hero_media_url" value={settings.hero_media_url || ""} onChange={(e) => {
                    handleChange(e);
                    // Infer type basic check
                    if(e.target.value.includes('.mp4') || e.target.value.includes('youtube') || e.target.value.includes('vimeo')) {
                      setSettings(prev => ({...prev, hero_media_type: 'video'}));
                    }
                  }} placeholder="https://..." className="w-full px-3 py-2 bg-white rounded-lg border-transparent outline-none text-sm" />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                 <label className="text-xs font-bold text-[#1B1B5E]/60">Current Media Type:</label>
                 <select name="hero_media_type" value={settings.hero_media_type || "image"} onChange={handleChange} className="ml-2 px-2 py-1 rounded bg-white text-sm outline-none">
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                 </select>
              </div>
              {settings.hero_media_url && settings.hero_media_type === 'image' && (
                <div className="mt-4 w-32 h-32 relative rounded-lg overflow-hidden border border-gray-200">
                   <img src={settings.hero_media_url} alt="Hero Preview" className="object-cover w-full h-full" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Portal Writeups */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#1B1B5E]/5 space-y-6">
          <h2 className="text-xl font-black text-[#1B1B5E] uppercase tracking-wider flex items-center gap-3">
            <Globe className="w-6 h-6 text-emerald-500" />
            Homepage Category Portals Writeups
          </h2>
          <p className="text-sm text-[#1B1B5E]/60">Customize the descriptions and button texts for each product category portal displayed on the homepage.</p>
          
          <div className="space-y-8 divide-y divide-[#1B1B5E]/5">
            {Object.keys(settings.category_writeups || {}).map((catId) => {
              const cat = settings.category_writeups[catId];
              return (
                <div key={catId} className="pt-6 first:pt-0 space-y-4">
                  <h3 className="font-black text-[#1B1B5E] text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00AEEF]"></span>
                    {catId === 'pads' ? 'iPads' : catId.replace('_', ' ')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#1B1B5E] uppercase tracking-widest block">Portal Description</label>
                      <textarea
                        value={cat.description || ""}
                        onChange={(e) => handleWriteupChange(catId, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:border-[#00AEEF] focus:bg-white outline-none transition-colors text-sm font-medium"
                        placeholder="Discover our curated collection..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#1B1B5E] uppercase tracking-widest block">Portal Button Text</label>
                      <input
                        type="text"
                        value={cat.button_text || ""}
                        onChange={(e) => handleWriteupChange(catId, 'button_text', e.target.value)}
                        className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:border-[#00AEEF] focus:bg-white outline-none transition-colors text-sm font-bold"
                        placeholder="Enter Portal"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#1B1B5E]/5 space-y-6">
          <h2 className="text-xl font-black text-[#1B1B5E] uppercase tracking-wider flex items-center gap-3">
            <MapPin className="w-6 h-6 text-blue-500" />
            Footer Configuration
          </h2>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Brand Description</label>
            <textarea 
              name="footer_brand_text"
              value={settings.footer_brand_text || ""}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:border-[#00AEEF] focus:bg-white outline-none transition-colors text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#1B1B5E]/5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Headquarters Address</label>
              <input 
                type="text" 
                name="footer_hq_address"
                value={settings.footer_hq_address || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:border-[#00AEEF] focus:bg-white outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Headquarters Phone</label>
              <input 
                type="text" 
                name="footer_hq_phone"
                value={settings.footer_hq_phone || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:border-[#00AEEF] focus:bg-white outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Headquarters Email</label>
              <input 
                type="text" 
                name="footer_hq_email"
                value={settings.footer_hq_email || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:border-[#00AEEF] focus:bg-white outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-[#1B1B5E]/5">
            {/* Catalog Links */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Catalog Links</label>
                <button type="button" onClick={() => addLink('footer_catalog_links')} className="text-xs font-bold text-[#00AEEF] hover:underline">
                  + Add Link
                </button>
              </div>
              <div className="space-y-2">
                {(settings.footer_catalog_links || []).map((link, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input type="text" value={link.label} onChange={(e) => handleLinkChange('footer_catalog_links', i, 'label', e.target.value)} placeholder="Label" className="w-1/2 px-3 py-2 bg-[#F5F5F7] rounded-lg border-transparent focus:border-[#00AEEF] outline-none text-sm" />
                    <input type="text" value={link.url} onChange={(e) => handleLinkChange('footer_catalog_links', i, 'url', e.target.value)} placeholder="URL" className="w-1/2 px-3 py-2 bg-[#F5F5F7] rounded-lg border-transparent focus:border-[#00AEEF] outline-none text-sm" />
                    <button type="button" onClick={() => removeLink('footer_catalog_links', i)} className="text-red-500 font-bold p-2 text-xs">X</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Links */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Service Links</label>
                <button type="button" onClick={() => addLink('footer_service_links')} className="text-xs font-bold text-[#00AEEF] hover:underline">
                  + Add Link
                </button>
              </div>
              <div className="space-y-2">
                {(settings.footer_service_links || []).map((link, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input type="text" value={link.label} onChange={(e) => handleLinkChange('footer_service_links', i, 'label', e.target.value)} placeholder="Label" className="w-1/2 px-3 py-2 bg-[#F5F5F7] rounded-lg border-transparent focus:border-[#00AEEF] outline-none text-sm" />
                    <input type="text" value={link.url} onChange={(e) => handleLinkChange('footer_service_links', i, 'url', e.target.value)} placeholder="URL" className="w-1/2 px-3 py-2 bg-[#F5F5F7] rounded-lg border-transparent focus:border-[#00AEEF] outline-none text-sm" />
                    <button type="button" onClick={() => removeLink('footer_service_links', i)} className="text-red-500 font-bold p-2 text-xs">X</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Policy Links */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Policy Links</label>
                <button type="button" onClick={() => addLink('footer_policy_links')} className="text-xs font-bold text-[#00AEEF] hover:underline">
                  + Add Link
                </button>
              </div>
              <div className="space-y-2">
                {(settings.footer_policy_links || []).map((link, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input type="text" value={link.label} onChange={(e) => handleLinkChange('footer_policy_links', i, 'label', e.target.value)} placeholder="Label" className="w-1/2 px-3 py-2 bg-[#F5F5F7] rounded-lg border-transparent focus:border-[#00AEEF] outline-none text-sm" />
                    <input type="text" value={link.url} onChange={(e) => handleLinkChange('footer_policy_links', i, 'url', e.target.value)} placeholder="URL" className="w-1/2 px-3 py-2 bg-[#F5F5F7] rounded-lg border-transparent focus:border-[#00AEEF] outline-none text-sm" />
                    <button type="button" onClick={() => removeLink('footer_policy_links', i)} className="text-red-500 font-bold p-2 text-xs">X</button>
                  </div>
                ))}
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
