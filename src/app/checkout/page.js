"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Wallet, MapPin, CheckCircle, Loader2, ArrowLeft, Copy, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [settings, setSettings] = useState(null);
  const [usdtRate, setUsdtRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    shippingZone: "inside", // 'inside', 'outside', 'african'
  });

  useEffect(() => {
    if (cart.length === 0 && !success) {
      router.push("/cart"); // Redirect to cart if empty
    } else {
      fetchData();
    }
  }, [cart, success]);

  const fetchData = async () => {
    try {
      // Fetch settings for fees and wallet
      const { data: settingsData } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (settingsData) setSettings(settingsData);

      // Fetch Live USDT/NGN rate from Binance
      const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=USDTNGN");
      const data = await res.json();
      if (data && data.price) {
        setUsdtRate(parseFloat(data.price));
      } else {
        // Fallback rate if API fails
        setUsdtRate(1500);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setUsdtRate(1500); // Fallback
    } finally {
      setLoading(false);
    }
  };

  const getShippingFee = () => {
    if (!settings) return 0;
    if (formData.shippingZone === "inside") return settings.shipping_fee_inside_lagos_abuja || 0;
    if (formData.shippingZone === "outside") return settings.shipping_fee_outside_lagos_abuja || 0;
    if (formData.shippingZone === "african") return settings.shipping_fee_african_countries || 0;
    return 0;
  };

  const shippingFee = getShippingFee();
  const totalNgn = cartTotal + shippingFee;
  // User requested rate from crypto market but 3 dollar high. 
  // We calculate base USDT, then add $3 premium as requested.
  const totalUsdt = usdtRate ? (totalNgn / usdtRate) + 3 : 0;

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(settings?.usdt_wallet_address || "");
    alert("Wallet address copied to clipboard!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1. Create Order
      const { data: order, error: orderError } = await supabase.from('orders').insert([{
        total_amount: totalNgn,
        status: 'processing',
        payment_status: 'pending',
        shipping_address: formData.address,
        contact_phone: formData.phone,
      }]).select().single();

      if (orderError) throw orderError;

      // 2. Create Order Items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // 3. Clear cart and show success
      clearCart();
      setSuccess(true);
      window.scrollTo(0, 0);

      // Flash message is handled by the success state UI below.
    } catch (err) {
      console.error("Order submission failed:", err);
      alert("Failed to submit order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
        <Loader2 className="w-12 h-12 animate-spin text-[#00AEEF]" />
      </div>
    );
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
            <p className="text-sm text-[#1B1B5E]/50">Please transfer the USDT amount to the provided wallet address. Our team will verify your payment and process your shipping shortly.</p>
          </div>
          <Link href="/" className="inline-block mt-8 bg-[#1B1B5E] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#00AEEF] transition-all shadow-lg hover:-translate-y-1">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/cart" className="flex items-center gap-2 text-[#1B1B5E]/60 hover:text-[#00AEEF] transition-colors mb-8 font-bold text-sm w-max">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h1 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Secure Checkout</h1>
            <p className="text-[#1B1B5E]/60 text-sm font-medium tracking-wide mt-1">Complete your shipping and payment details.</p>
          </div>

          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Contact & Shipping */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#1B1B5E]/5 space-y-6">
              <h2 className="text-xl font-black text-[#1B1B5E] uppercase tracking-wider flex items-center gap-3">
                <MapPin className="w-6 h-6 text-[#00AEEF]" />
                Shipping Information
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Full Name</label>
                    <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Phone Number</label>
                    <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20 font-medium" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Delivery Address</label>
                  <textarea required rows="3" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20 font-medium"></textarea>
                </div>

                <div className="space-y-2 pt-4 border-t border-[#1B1B5E]/5">
                  <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest mb-3 block">Select Shipping Region</label>
                  <div className="space-y-3">
                    <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${formData.shippingZone === 'inside' ? 'border-[#00AEEF] bg-[#00AEEF]/5' : 'border-[#F5F5F7] bg-[#F5F5F7] hover:border-[#1B1B5E]/20'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="zone" value="inside" checked={formData.shippingZone === 'inside'} onChange={e => setFormData({...formData, shippingZone: e.target.value})} className="w-4 h-4 accent-[#00AEEF]" />
                        <span className="font-bold text-[#1B1B5E]">Inside Lagos & Abuja</span>
                      </div>
                      <span className="font-black text-[#1B1B5E]">₦{settings?.shipping_fee_inside_lagos_abuja?.toLocaleString() || 0}</span>
                    </label>
                    
                    <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${formData.shippingZone === 'outside' ? 'border-[#00AEEF] bg-[#00AEEF]/5' : 'border-[#F5F5F7] bg-[#F5F5F7] hover:border-[#1B1B5E]/20'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="zone" value="outside" checked={formData.shippingZone === 'outside'} onChange={e => setFormData({...formData, shippingZone: e.target.value})} className="w-4 h-4 accent-[#00AEEF]" />
                        <span className="font-bold text-[#1B1B5E]">Outside Lagos & Abuja</span>
                      </div>
                      <span className="font-black text-[#1B1B5E]">₦{settings?.shipping_fee_outside_lagos_abuja?.toLocaleString() || 0}</span>
                    </label>

                    <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${formData.shippingZone === 'african' ? 'border-[#00AEEF] bg-[#00AEEF]/5' : 'border-[#F5F5F7] bg-[#F5F5F7] hover:border-[#1B1B5E]/20'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="zone" value="african" checked={formData.shippingZone === 'african'} onChange={e => setFormData({...formData, shippingZone: e.target.value})} className="w-4 h-4 accent-[#00AEEF]" />
                        <span className="font-bold text-[#1B1B5E]">Other African Countries</span>
                      </div>
                      <span className="font-black text-[#1B1B5E]">₦{settings?.shipping_fee_african_countries?.toLocaleString() || 0}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Crypto Payment Details */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#1B1B5E]/5 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-[#1B1B5E] uppercase tracking-wider flex items-center gap-3">
                  <Wallet className="w-6 h-6 text-[#1B1B5E]" />
                  Crypto Payment (USDT)
                </h2>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-black uppercase tracking-widest">Preferred</span>
              </div>
              
              <div className="bg-[#1B1B5E] text-white p-6 rounded-2xl space-y-6 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                
                <div className="relative z-10 space-y-1">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Amount to Send (+ $3 premium included)</p>
                  <div className="text-4xl font-black tracking-tighter flex items-end gap-2">
                    {totalUsdt.toFixed(2)} <span className="text-xl text-[#00AEEF] mb-1">USDT</span>
                  </div>
                  <p className="text-white/40 text-xs mt-2">Rate: 1 USDT = ₦{usdtRate?.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>

                <div className="relative z-10 p-4 bg-white/10 rounded-xl border border-white/10 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-white/60">Network</span>
                    <span className="text-[#00AEEF]">{settings?.usdt_network || "TRC20"}</span>
                  </div>
                  <div className="h-px bg-white/10 w-full"></div>
                  <div className="space-y-1">
                    <span className="text-white/60 text-xs font-bold block">Wallet Address</span>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-mono text-sm break-all">{settings?.usdt_wallet_address || "Loading..."}</span>
                      <button type="button" onClick={handleCopyWallet} className="p-2 bg-white/10 hover:bg-[#00AEEF] rounded-lg transition-colors shrink-0">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex items-start gap-3 p-4 bg-[#00AEEF]/10 rounded-xl text-sm">
                  <Info className="w-5 h-5 text-[#00AEEF] shrink-0 mt-0.5" />
                  <p className="text-white/80 font-medium">Please send the exact USDT amount to the address above. After payment, click "I have made payment" below.</p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#1B1B5E]/5 sticky top-24 space-y-6">
            <h2 className="text-xl font-black text-[#1B1B5E] uppercase tracking-wider">Order Summary</h2>
            
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-[#F5F5F7] rounded-2xl">
                  <div className="w-16 h-16 bg-white rounded-xl relative overflow-hidden shrink-0 border border-[#1B1B5E]/5">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">No img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#1B1B5E] text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-[#1B1B5E]/60 mt-1 uppercase font-bold">Qty: {item.quantity}</p>
                    <p className="text-sm font-black text-[#00AEEF] mt-1">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-[#1B1B5E]/10">
              <div className="flex justify-between items-center text-sm font-bold text-[#1B1B5E]/60">
                <span>Subtotal</span>
                <span>₦{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-[#1B1B5E]/60">
                <span>Shipping</span>
                <span>₦{shippingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xl font-black text-[#1B1B5E] pt-3">
                <span>Total</span>
                <span>₦{totalNgn.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={submitting}
              className="w-full bg-[#1B1B5E] hover:bg-[#00AEEF] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-300 shadow-xl shadow-[#1B1B5E]/20 hover:shadow-[#00AEEF]/30 hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : (
                <><CheckCircle className="w-5 h-5" /> I Have Made Payment</>
              )}
            </button>
            <p className="text-center text-[10px] font-bold text-[#1B1B5E]/40 uppercase tracking-widest">
              By confirming, you agree to our terms of service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
