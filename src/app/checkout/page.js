"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Wallet, MapPin, CheckCircle, Loader2, ArrowLeft, Copy, Info, CreditCard, Building, Phone, Ticket, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [settings, setSettings] = useState(null);
  const [usdtRate, setUsdtRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Promo Code State
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [applyingPromo, setApplyingPromo] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    shippingZone: "inside",
    paymentMethod: "crypto"
  });

  async function fetchData() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        if (profile?.role === 'admin') setIsAdmin(true);
      }

      const { data: settingsData } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (settingsData) {
        setSettings(settingsData);
        
        const availableMethods = [];
        if (settingsData.usdt_wallet_address) availableMethods.push('crypto');
        if (settingsData.paystack_public_key) availableMethods.push('paystack');
        if (settingsData.flutterwave_public_key) availableMethods.push('flutterwave');
        if (settingsData.monnify_api_key && settingsData.monnify_contract_code) availableMethods.push('monnify');
        if (settingsData.bank_transfer_details) availableMethods.push('bank_transfer');
        if (settingsData.opay_merchant_id) availableMethods.push('opay');
        if (settingsData.palmpay_merchant_id) availableMethods.push('palmpay');

        setFormData(prev => {
          if (availableMethods.length > 0 && !availableMethods.includes(prev.paymentMethod)) {
            return { ...prev, paymentMethod: availableMethods[0] };
          }
          return prev;
        });
      }

      let rate = 1389;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        const res = await fetch("/api/usdt-rate", { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          if (data && data.rate) rate = parseFloat(data.rate);
        }
      } catch (e) {}
      
      if (settingsData?.usdt_rate && !isNaN(parseFloat(settingsData.usdt_rate))) {
        rate = parseFloat(settingsData.usdt_rate);
      }
      
      setUsdtRate(rate);
    } catch (err) {
      setUsdtRate(1389);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (cart.length === 0 && !success) {
      router.push("/cart");
    } else {
      fetchData();
    }
  }, [cart, success, router]);

  const getShippingFee = () => {
    if (isAdmin) return 0;
    if (!settings) return 0;
    if (formData.shippingZone === "inside") return settings.shipping_fee_inside_lagos_abuja || 0;
    if (formData.shippingZone === "outside") return settings.shipping_fee_outside_lagos_abuja || 0;
    if (formData.shippingZone === "african") return settings.shipping_fee_african_countries || 0;
    return 0;
  };

  const shippingFee = getShippingFee();
  
  // Calculate discount
  const getDiscount = () => {
    if (!appliedPromo) return 0;
    if (appliedPromo.discount_type === 'percentage') {
      return (cartTotal * appliedPromo.discount_value) / 100;
    } else {
      return appliedPromo.discount_value;
    }
  };

  const discountAmount = getDiscount();
  const totalNgn = Math.max(0, cartTotal - discountAmount + shippingFee);
  const totalUsdt = usdtRate ? (totalNgn / usdtRate) : 0;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setApplyingPromo(true);
    setPromoError("");

    try {
      const { data, error } = await supabase.from('coupons').select('*').eq('code', promoCode.toUpperCase()).eq('is_active', true).single();
      
      if (error || !data) {
        setPromoError("Invalid or expired promo code.");
        setApplyingPromo(false);
        return;
      }

      if (data.min_spend > 0 && cartTotal < data.min_spend) {
        setPromoError(`Minimum spend for this code is ₦${data.min_spend.toLocaleString()}`);
        setApplyingPromo(false);
        return;
      }

      setAppliedPromo(data);
      setPromoCode("");
    } catch (err) {
      setPromoError("Error verifying promo code.");
    }
    setApplyingPromo(false);
  };

  const handleCopy = (text, item) => {
    navigator.clipboard.writeText(text);
    alert(`${item} copied to clipboard!`);
  };

  // Creates order in DB first (status: pending)
  const createOrderRecord = async () => {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user ? user.id : null,
        totalNgn,
        formData,
        cart
      })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit order');
    }
    const data = await response.json();
    return data.order;
  };

  const handlePaystack = (order) => {
    if (!settings?.paystack_public_key) return alert("Paystack is not configured.");
    const handler = window.PaystackPop.setup({
      key: settings.paystack_public_key,
      email: formData.email || "customer@ekesontech.com",
      amount: totalNgn * 100, // Kobo
      currency: "NGN",
      ref: order.id, // Use our Order ID as reference!
      callback: async function(response) {
        // Optimistically update to paid
        await supabase.from('orders').update({ payment_status: 'paid' }).eq('id', order.id);
        clearCart();
        setSuccess(true);
        window.scrollTo(0, 0);
      },
      onClose: function() {
        alert('Payment window closed. You can complete this payment later from your account.');
        clearCart();
        router.push('/account/orders');
      }
    });
    handler.openIframe();
  };

  const handleFlutterwave = (order) => {
    if (!settings?.flutterwave_public_key) return alert("Flutterwave is not configured.");
    window.FlutterwaveCheckout({
      public_key: settings.flutterwave_public_key,
      tx_ref: order.id, // Use our Order ID as reference!
      amount: totalNgn,
      currency: "NGN",
      payment_options: "card, mobilemoneyghana, network",
      customer: {
        email: formData.email || "customer@ekesontech.com",
        phone_number: formData.phone,
        name: formData.fullName,
      },
      customizations: {
        title: "Ekeson Gadgets",
        description: "Payment for Order " + order.id.substring(0,8),
        logo: "https://ekesontech.com/logo.png",
      },
      callback: async function(data) {
        await supabase.from('orders').update({ payment_status: 'paid' }).eq('id', order.id);
        clearCart();
        setSuccess(true);
        window.scrollTo(0, 0);
      },
      onclose: function() {
        alert('Payment window closed. You can complete this payment later from your account.');
        clearCart();
        router.push('/account/orders');
      }
    });
  };

  const handleMonnify = (order) => {
    if (!settings?.monnify_api_key || !settings?.monnify_contract_code) return alert("Monnify is not configured.");
    window.MonnifySDK.initialize({
      amount: totalNgn,
      currency: "NGN",
      reference: order.id,
      customerFullName: formData.fullName,
      customerEmail: formData.email || "customer@ekesontech.com",
      apiKey: settings.monnify_api_key,
      contractCode: settings.monnify_contract_code,
      paymentDescription: "Payment for Order " + order.id.substring(0,8),
      onComplete: async function(response) {
        await supabase.from('orders').update({ payment_status: 'paid' }).eq('id', order.id);
        clearCart();
        setSuccess(true);
        window.scrollTo(0, 0);
      },
      onClose: function(data) {
        alert('Payment window closed. You can complete this payment later from your account.');
        clearCart();
        router.push('/account/orders');
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (settings?.is_checkout_locked) {
      alert("Checkout is temporarily disabled by the administrator.");
      return;
    }

    try {
      const { data: blockedUser } = await supabase.from('blocked_customers').select('id').eq('phone', formData.phone).single();
      if (blockedUser) {
        alert("Your account has been restricted from placing orders.");
        return;
      }
    } catch (err) {}

    setSubmitting(true);
    try {
      // Step 1: Pre-create order
      const order = await createOrderRecord();

      // Step 2: Handle Gateways or Manual
      if (formData.paymentMethod === 'paystack') {
        setSubmitting(false); // Enable button again in case they close iframe
        handlePaystack(order);
      } else if (formData.paymentMethod === 'flutterwave') {
        setSubmitting(false);
        handleFlutterwave(order);
      } else if (formData.paymentMethod === 'monnify') {
        setSubmitting(false);
        handleMonnify(order);
      } else {
        // Manual methods (crypto, bank_transfer, etc)
        // Order is already created with pending status.
        clearCart();
        setSuccess(true);
        window.scrollTo(0, 0);
      }
    } catch (err) {
      console.warn("Order submission failed:", err);
      alert("Failed to create order: " + err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]"><Loader2 className="w-12 h-12 animate-spin text-[#00AEEF]" /></div>;
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-3xl shadow-2xl max-w-lg w-full text-center space-y-6 animate-in zoom-in-95 duration-500 border border-[#1B1B5E]/5">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-4xl font-black text-[#1B1B5E] uppercase tracking-tighter">Congratulations!</h1>
          <div className="space-y-2">
            <p className="text-[#1B1B5E]/70 font-bold">Your order has been placed successfully.</p>
            {['crypto', 'bank_transfer', 'opay', 'palmpay'].includes(formData.paymentMethod) && (
              <p className="text-sm text-[#1B1B5E]/50">Please complete the transfer to the provided details. Our team will verify your payment and process your shipping shortly.</p>
            )}
          </div>
          <Link href="/account/orders" className="inline-block mt-8 bg-[#1B1B5E] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#00AEEF] transition-all shadow-lg hover:-translate-y-1">
            Track Order
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />
      <Script src="https://checkout.flutterwave.com/v3.js" strategy="lazyOnload" />
      <Script src="https://sdk.monnify.com/plugin/monnify.js" strategy="lazyOnload" />

      <Link href="/cart" className="flex items-center gap-2 text-[#1B1B5E]/60 hover:text-[#00AEEF] transition-colors mb-8 font-bold text-sm w-max">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h1 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Secure Checkout</h1>
            <p className="text-[#1B1B5E]/60 text-sm font-medium tracking-wide mt-1">Complete your shipping and payment details.</p>
          </div>

          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Contact & Shipping */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#1B1B5E]/5 space-y-6">
              <h2 className="text-xl font-black text-[#1B1B5E] uppercase tracking-wider flex items-center gap-3">
                <MapPin className="w-6 h-6 text-[#00AEEF]" /> Shipping Information
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Full Name</label>
                    <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#1B1B5E]/40 uppercase tracking-widest ml-1">Email Address</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="mt-1 w-full px-4 py-3 bg-white border border-[#1B1B5E]/10 rounded-xl text-sm focus:outline-none focus:border-[#00AEEF]" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-[#1B1B5E]/40 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="h-4 w-4 text-gray-400" /></div>
                      <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-white border border-[#1B1B5E]/10 rounded-xl text-sm focus:outline-none focus:border-[#00AEEF]" placeholder="+234 800 000 0000" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Delivery Address</label>
                  <textarea required rows="3" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20 font-medium"></textarea>
                </div>

                <div className="space-y-2 pt-4 border-t border-[#1B1B5E]/5">
                  <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest mb-3 block">Select Shipping Region</label>
                  <div className="space-y-3">
                    <label className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${formData.shippingZone === 'inside' ? 'border-[#00AEEF] bg-[#00AEEF]/5' : 'border-[#F5F5F7] bg-[#F5F5F7] hover:border-[#1B1B5E]/20'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="zone" value="inside" checked={formData.shippingZone === 'inside'} onChange={e => setFormData({...formData, shippingZone: e.target.value})} className="w-4 h-4 accent-[#00AEEF]" />
                        <span className="font-bold text-[#1B1B5E]">Inside Lagos & Abuja</span>
                      </div>
                      <span className="font-black text-[#1B1B5E] mt-2 sm:mt-0 ml-7 sm:ml-0">₦{settings?.shipping_fee_inside_lagos_abuja?.toLocaleString() || 0}</span>
                    </label>
                    <label className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${formData.shippingZone === 'outside' ? 'border-[#00AEEF] bg-[#00AEEF]/5' : 'border-[#F5F5F7] bg-[#F5F5F7] hover:border-[#1B1B5E]/20'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="zone" value="outside" checked={formData.shippingZone === 'outside'} onChange={e => setFormData({...formData, shippingZone: e.target.value})} className="w-4 h-4 accent-[#00AEEF]" />
                        <span className="font-bold text-[#1B1B5E]">Outside Lagos & Abuja</span>
                      </div>
                      <span className="font-black text-[#1B1B5E] mt-2 sm:mt-0 ml-7 sm:ml-0">₦{settings?.shipping_fee_outside_lagos_abuja?.toLocaleString() || 0}</span>
                    </label>
                    <label className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${formData.shippingZone === 'african' ? 'border-[#00AEEF] bg-[#00AEEF]/5' : 'border-[#F5F5F7] bg-[#F5F5F7] hover:border-[#1B1B5E]/20'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="zone" value="african" checked={formData.shippingZone === 'african'} onChange={e => setFormData({...formData, shippingZone: e.target.value})} className="w-4 h-4 accent-[#00AEEF]" />
                        <span className="font-bold text-[#1B1B5E]">Other African Countries</span>
                      </div>
                      <span className="font-black text-[#1B1B5E] mt-2 sm:mt-0 ml-7 sm:ml-0">₦{settings?.shipping_fee_african_countries?.toLocaleString() || 0}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#1B1B5E]/5 space-y-6">
              <h2 className="text-xl font-black text-[#1B1B5E] uppercase tracking-wider flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-[#1B1B5E]" /> Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {settings?.usdt_wallet_address && (
                  <label className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'crypto' ? 'border-[#1B1B5E] bg-[#1B1B5E]/5' : 'border-[#F5F5F7] bg-[#F5F5F7] hover:border-[#1B1B5E]/20'}`}>
                    <input type="radio" name="payment" value="crypto" checked={formData.paymentMethod === 'crypto'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="sr-only" />
                    <Wallet className={`w-8 h-8 mb-2 ${formData.paymentMethod === 'crypto' ? 'text-[#1B1B5E]' : 'text-gray-400'}`} />
                    <span className="font-bold text-sm text-[#1B1B5E]">Crypto (USDT)</span>
                  </label>
                )}
                {settings?.paystack_public_key && (
                  <label className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'paystack' ? 'border-[#0BA4DB] bg-[#0BA4DB]/5' : 'border-[#F5F5F7] bg-[#F5F5F7] hover:border-[#1B1B5E]/20'}`}>
                    <input type="radio" name="payment" value="paystack" checked={formData.paymentMethod === 'paystack'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="sr-only" />
                    <CreditCard className={`w-8 h-8 mb-2 ${formData.paymentMethod === 'paystack' ? 'text-[#0BA4DB]' : 'text-gray-400'}`} />
                    <span className="font-bold text-sm text-[#1B1B5E]">Paystack</span>
                  </label>
                )}
                {settings?.flutterwave_public_key && (
                  <label className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'flutterwave' ? 'border-[#F5A623] bg-[#F5A623]/5' : 'border-[#F5F5F7] bg-[#F5F5F7] hover:border-[#1B1B5E]/20'}`}>
                    <input type="radio" name="payment" value="flutterwave" checked={formData.paymentMethod === 'flutterwave'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="sr-only" />
                    <CreditCard className={`w-8 h-8 mb-2 ${formData.paymentMethod === 'flutterwave' ? 'text-[#F5A623]' : 'text-gray-400'}`} />
                    <span className="font-bold text-sm text-[#1B1B5E]">Flutterwave</span>
                  </label>
                )}
                {settings?.bank_transfer_details && (
                  <label className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'bank_transfer' ? 'border-[#2D3748] bg-[#2D3748]/5' : 'border-[#F5F5F7] bg-[#F5F5F7] hover:border-[#1B1B5E]/20'}`}>
                    <input type="radio" name="payment" value="bank_transfer" checked={formData.paymentMethod === 'bank_transfer'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="sr-only" />
                    <Building className={`w-8 h-8 mb-2 ${formData.paymentMethod === 'bank_transfer' ? 'text-[#2D3748]' : 'text-gray-400'}`} />
                    <span className="font-bold text-sm text-[#1B1B5E]">Bank Transfer</span>
                  </label>
                )}
              </div>
              
              {/* Conditional Payment Text */}
              {formData.paymentMethod === 'crypto' && (
                <div className="bg-[#1B1B5E] text-white p-6 rounded-2xl space-y-6 mt-6">
                  <div className="space-y-1">
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Amount to Send</p>
                    <div className="text-4xl font-black tracking-tighter">{totalUsdt.toFixed(2)} <span className="text-xl text-[#00AEEF]">USDT</span></div>
                    <p className="text-white/40 text-xs mt-2 font-bold">Current Rate: 1 USDT = ₦{usdtRate?.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-xl flex flex-col gap-2">
                    <div className="flex justify-between font-bold text-sm">
                      <span className="text-white/60">Network</span>
                      <span className="text-[#00AEEF]">{settings?.usdt_network || "TRC20"}</span>
                    </div>
                    <div className="h-px bg-white/10 w-full"></div>
                    <div>
                      <span className="text-white/60 text-xs font-bold block mb-1">Wallet Address</span>
                      <div className="flex justify-between gap-4 font-mono text-sm">
                        <span className="break-all">{settings?.usdt_wallet_address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'bank_transfer' && (
                <div className="bg-[#2D3748] text-white p-6 rounded-2xl space-y-4 mt-6">
                  <h3 className="font-black uppercase tracking-widest text-sm text-white/60">Bank Transfer Details</h3>
                  <div className="p-4 bg-white/10 rounded-xl whitespace-pre-wrap font-mono text-sm leading-relaxed border border-white/10">
                    {settings?.bank_transfer_details || "Bank transfer details are currently being updated. Please contact support."}
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl text-sm">
                    <Info className="w-5 h-5 text-white/60 shrink-0 mt-0.5" />
                    <p className="text-white/80 font-medium">Please transfer exactly ₦{totalNgn.toLocaleString()} to the account above, then click &quot;I Have Made Payment&quot;.</p>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'opay' && (
                <div className="bg-[#1DCB96] text-white p-6 rounded-2xl space-y-4 mt-6">
                  <h3 className="font-black uppercase tracking-widest text-sm text-white/80">OPay Details</h3>
                  <div className="p-4 bg-black/10 rounded-xl whitespace-pre-wrap font-mono text-sm leading-relaxed font-bold">
                    {settings?.opay_merchant_id || "OPay Merchant ID will be provided soon."}
                  </div>
                  <p className="text-white/90 font-medium text-sm">Transfer ₦{totalNgn.toLocaleString()} using OPay, then click &quot;I Have Made Payment&quot;.</p>
                </div>
              )}

              {formData.paymentMethod === 'palmpay' && (
                <div className="bg-[#6F42C1] text-white p-6 rounded-2xl space-y-4 mt-6">
                  <h3 className="font-black uppercase tracking-widest text-sm text-white/80">PalmPay Details</h3>
                  <div className="p-4 bg-black/10 rounded-xl whitespace-pre-wrap font-mono text-sm leading-relaxed font-bold">
                    {settings?.palmpay_merchant_id || "PalmPay Merchant ID will be provided soon."}
                  </div>
                  <p className="text-white/90 font-medium text-sm">Transfer ₦{totalNgn.toLocaleString()} using PalmPay, then click &quot;I Have Made Payment&quot;.</p>
                </div>
              )}

              {['paystack', 'flutterwave', 'monnify'].includes(formData.paymentMethod) && (
                <div className="p-4 bg-[#F5F5F7] rounded-xl border border-[#1B1B5E]/10 mt-6 flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#1B1B5E] shrink-0 mt-0.5" />
                  <p className="text-[#1B1B5E] text-sm font-medium">You will be redirected to a secure payment gateway to complete your payment of ₦{totalNgn.toLocaleString()} safely.</p>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-[#1B1B5E]/5 sticky top-24 space-y-6">
            <h2 className="text-xl font-black text-[#1B1B5E] uppercase tracking-wider">Order Summary</h2>
            
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-[#F5F5F7] rounded-2xl">
                  <div className="w-16 h-16 bg-white rounded-xl relative shrink-0 border border-[#1B1B5E]/5 overflow-hidden">
                    {item.image_url ? <Image src={item.image_url} alt={item.name} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">No img</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#1B1B5E] text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-[#1B1B5E]/60 mt-1 uppercase font-bold">Qty: {item.quantity}</p>
                    <p className="text-sm font-black text-[#00AEEF] mt-1">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Box */}
            <div className="pt-4 border-t border-[#1B1B5E]/10">
              {!appliedPromo ? (
                <div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={promoCode} 
                      onChange={e => setPromoCode(e.target.value)} 
                      placeholder="Promo Code" 
                      className="flex-1 px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20 font-bold uppercase text-sm" 
                    />
                    <button 
                      onClick={handleApplyPromo} 
                      disabled={applyingPromo || !promoCode.trim()} 
                      className="bg-[#1B1B5E] hover:bg-[#00AEEF] text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                      {applyingPromo ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                  {promoError && <p className="text-red-500 text-xs font-bold mt-2 ml-1">{promoError}</p>}
                </div>
              ) : (
                <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-green-500" />
                    <div>
                      <span className="font-black text-green-700 block text-sm">{appliedPromo.code}</span>
                      <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">
                        {appliedPromo.discount_type === 'percentage' ? `${appliedPromo.discount_value}% OFF` : `₦${appliedPromo.discount_value.toLocaleString()} OFF`}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setAppliedPromo(null)} className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-[#1B1B5E]/10">
              <div className="flex justify-between text-sm font-bold text-[#1B1B5E]/60">
                <span>Subtotal</span>
                <span>₦{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#1B1B5E]/60">
                <span>Shipping</span>
                <span>₦{shippingFee.toLocaleString()}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-sm font-black text-green-500">
                  <span>Discount ({appliedPromo.code})</span>
                  <span>₦{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-xl font-black text-[#1B1B5E] pt-3">
                <span>Total</span>
                <span>₦{totalNgn.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={submitting}
              className="w-full bg-[#1B1B5E] hover:bg-[#00AEEF] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl hover:-translate-y-1 flex justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <><CheckCircle className="w-5 h-5" /> Complete Order</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
