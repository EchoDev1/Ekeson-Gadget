"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price);

  if (cartCount === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-[#1B1B5E]/5 rounded-full flex items-center justify-center text-[#1B1B5E] mb-8">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter mb-4">Your cart is empty</h2>
        <p className="text-[#1B1B5E]/50 mb-8 font-medium">Looks like you haven&apos;t added any premium gadgets yet.</p>
        <Link 
          href="/products" 
          className="bg-[#1B1B5E] text-white px-12 py-4 rounded-full font-black uppercase tracking-widest hover:bg-[#00AEEF] transition-all shadow-xl"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF5] min-h-screen py-12 pb-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-[#1B1B5E] uppercase tracking-tighter mb-12">Shopping Bag ({cartCount})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-[#1B1B5E]/5 flex items-center gap-6 group hover:shadow-xl transition-all duration-500">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#F8F9FA] flex-shrink-0">
                  <Image src={item.image_url || item.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"} alt={item.name} fill className="object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black text-[#1B1B5E] uppercase tracking-tight truncate">{item.name}</h3>
                  <p className="text-[#00AEEF] font-black text-sm mt-1">{formatPrice(item.price)}</p>
                </div>

                <div className="flex items-center bg-[#F8F9FA] rounded-xl p-1 border border-[#1B1B5E]/5">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-[#1B1B5E] hover:text-[#00AEEF] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-[#1B1B5E] font-bold text-sm">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-[#1B1B5E] hover:text-[#00AEEF] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#1B1B5E] text-white p-10 rounded-[2.5rem] shadow-2xl sticky top-32">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[#F8F9FA]/60 font-bold uppercase text-[10px] tracking-widest">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-[#F8F9FA]/60 font-bold uppercase text-[10px] tracking-widest">
                  <span>Shipping</span>
                  <span>Calculated at next step</span>
                </div>
                <div className="h-px bg-white/10 my-6" />
                <div className="flex justify-between items-end">
                  <span className="text-sm font-black uppercase tracking-widest">Total Amount</span>
                  <span className="text-3xl font-black tracking-tighter">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <Link 
                href="/checkout" 
                className="w-full bg-[#00AEEF] hover:bg-white hover:text-[#1B1B5E] text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center group shadow-2xl shadow-[#00AEEF]/20"
              >
                Checkout Now <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <p className="text-[10px] text-[#F8F9FA]/40 mt-6 text-center font-bold uppercase tracking-[0.2em]">
                Secure Payment via Crypto, Cards & Transfers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
