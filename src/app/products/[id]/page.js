"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, ShieldCheck, Truck, ArrowLeft, Heart, Share2, CheckCircle2 } from "lucide-react";

export default function ProductDetail({ params }) {
  const [quantity, setQuantity] = useState(1);
  
  // Mock Product Data (In a real app, fetch based on params.id)
  const product = {
    id: 1,
    name: "Sony WH-1000XM5 Wireless Headphones",
    price: 189000,
    originalPrice: 220000,
    rating: 4.8,
    reviews: 124,
    description: "Industry-leading noise cancellation with two processors controlling 8 microphones. Magnificent Sound, engineered to perfection with the new Integrated Processor V1. Crystal clear hands-free calling with 4 beamforming microphones, advanced audio signal processing, and Precise Voice Pickup Technology.",
    features: [
      "Auto NC Optimizer based on wearing conditions",
      "Up to 30-hour battery life with quick charging",
      "Multipoint connection allows you to switch between devices",
      "Intuitive touch control settings"
    ],
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
    ],
    inStock: true,
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price);

  return (
    <div className="bg-[#050510] min-h-screen pb-20 pt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#00AEEF] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#00AEEF] transition-colors">Products</Link>
          <span>/</span>
          <span className="text-white font-bold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-[#0A0A20] rounded-3xl border border-[#00AEEF]/10 overflow-hidden shadow-2xl">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <button className="bg-[#0A0A20]/80 p-2.5 rounded-xl border border-white/10 text-white hover:text-[#00AEEF] transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="bg-[#0A0A20]/80 p-2.5 rounded-xl border border-white/10 text-white hover:text-[#00AEEF] transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <div key={i} className={`relative aspect-square bg-[#0A0A20] rounded-xl border ${i === 0 ? 'border-[#00AEEF]' : 'border-white/10'} overflow-hidden cursor-pointer hover:border-[#00AEEF]/50 transition-all`}>
                  <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-2 bg-[#1B1B5E]/40 border border-[#00AEEF]/20 rounded-full px-3 py-1 w-fit">
                <CheckCircle2 className="w-4 h-4 text-[#00AEEF]" />
                <span className="text-[10px] font-bold text-[#00AEEF] uppercase tracking-widest">Genuine Product 🇳🇬</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                  ))}
                  <span className="ml-2 text-sm text-gray-400 font-bold">{product.rating} ({product.reviews} Reviews)</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-sm font-bold text-green-500 uppercase tracking-widest">In Stock</span>
              </div>
            </div>

            <div className="p-6 bg-[#0A0A20] rounded-3xl border border-[#00AEEF]/10 mb-8 shadow-xl">
              <div className="flex items-baseline space-x-4 mb-4">
                <span className="text-4xl font-extrabold text-white">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through font-bold">{formatPrice(product.originalPrice)}</span>
                )}
                <span className="bg-[#1B1B5E] text-[#00AEEF] px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border border-[#00AEEF]/30">
                  Save 14%
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {product.description}
              </p>
              
              <div className="space-y-4 mb-8">
                {product.features.map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-[#00AEEF] flex-shrink-0" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center bg-[#1B1B5E]/30 border border-[#00AEEF]/20 rounded-2xl p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-white hover:text-[#00AEEF] transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-white font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-white hover:text-[#00AEEF] transition-colors"
                  >
                    +
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  <p className="font-bold text-gray-400">Shipping calculated at checkout</p>
                  <p>Estimated delivery: 2-3 business days in Lagos</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-[#00AEEF] hover:bg-[#0090c8] text-white py-4 rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(0,174,239,0.3)] flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 mr-3" /> Add to Cart
                </button>
                <button className="flex-1 border border-white/20 hover:border-[#00AEEF] text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center">
                  Buy Now
                </button>
              </div>
            </div>

            {/* Quick Benefits */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-[#1B1B5E]/20 rounded-2xl border border-[#00AEEF]/10">
                <ShieldCheck className="w-8 h-8 text-[#00AEEF] flex-shrink-0" />
                <div>
                  <p className="text-white text-xs font-bold uppercase tracking-widest">Warranty</p>
                  <p className="text-gray-500 text-[10px]">1 Year Official Warranty</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-[#1B1B5E]/20 rounded-2xl border border-[#00AEEF]/10">
                <Truck className="w-8 h-8 text-[#00AEEF] flex-shrink-0" />
                <div>
                  <p className="text-white text-xs font-bold uppercase tracking-widest">Shipping</p>
                  <p className="text-gray-500 text-[10px]">Nationwide 🇳🇬 Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
