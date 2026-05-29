"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Star, ShieldCheck, Truck, ArrowLeft, Heart, Share2, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { fallbackProducts } from "@/lib/data";

export default function ProductDetail({ params }) {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      
      // Try to find in local data first as fallback
      let localProduct = null;
      Object.values(fallbackProducts).forEach((cat) => {
        const found = cat.find(p => p.id.toString() === params.id.toString());
        if (found) localProduct = found;
      });

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", params.id)
          .single();
        
        if (!error && data) {
          setProduct(data);
        } else {
          setProduct(localProduct);
        }
      } catch (err) {
        setProduct(localProduct);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    router.push("/checkout");
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price);

  if (loading) {
    return (
      <div className="bg-[#050510] min-h-screen pb-20 pt-32 flex justify-center text-[#00AEEF] font-black text-2xl uppercase tracking-widest">
        Loading Details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#050510] min-h-screen pb-20 pt-32 flex flex-col items-center justify-center text-center">
        <h1 className="text-white text-4xl font-black uppercase mb-4">Product Not Found</h1>
        <Link href="/" className="text-[#00AEEF] hover:text-white transition-colors uppercase font-bold tracking-widest">
          Return Home
        </Link>
      </div>
    );
  }

  // Ensure images exist (handle DB format vs local format)
  const productImages = product.images || [product.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"];

  return (
    <div className="bg-[#050510] min-h-screen pb-20 pt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#00AEEF] transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/category/${product.category || 'all'}`} className="hover:text-[#00AEEF] transition-colors capitalize">
            {product.category || 'Category'}
          </Link>
          <span>/</span>
          <span className="text-white font-bold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-[#0A0A20] rounded-3xl border border-[#00AEEF]/10 overflow-hidden shadow-2xl">
              <Image
                src={productImages[0]}
                alt={product.name}
                fill
                className="object-contain p-8"
              />
              <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
                <button className="bg-[#0A0A20]/80 p-2.5 rounded-xl border border-white/10 text-white hover:text-[#00AEEF] transition-colors backdrop-blur-sm">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="bg-[#0A0A20]/80 p-2.5 rounded-xl border border-white/10 text-white hover:text-[#00AEEF] transition-colors backdrop-blur-sm">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((img, i) => (
                  <div key={i} className={`relative aspect-square bg-[#0A0A20] rounded-xl border ${i === 0 ? 'border-[#00AEEF]' : 'border-white/10'} overflow-hidden cursor-pointer hover:border-[#00AEEF]/50 transition-all p-2`}>
                    <Image src={img} alt={`${product.name} ${i}`} fill className="object-contain" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-2 bg-[#1B1B5E]/40 border border-[#00AEEF]/20 rounded-full px-3 py-1 w-fit">
                <CheckCircle2 className="w-4 h-4 text-[#00AEEF]" />
                <span className="text-[10px] font-bold text-[#00AEEF] uppercase tracking-widest">
                  {product.condition === 'uk-used' ? 'Verified UK Used 🇬🇧' : 'Genuine Brand New 🇳🇬'}
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-current' : ''}`} />
                  ))}
                  <span className="ml-2 text-sm text-gray-400 font-bold">4.8 (124 Reviews)</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-sm font-bold text-green-500 uppercase tracking-widest">In Stock</span>
              </div>
            </div>

            <div className="p-6 bg-[#0A0A20] rounded-3xl border border-[#00AEEF]/10 mb-8 shadow-xl">
              <div className="flex items-baseline space-x-4 mb-4">
                <span className="text-4xl font-extrabold text-white">{formatPrice(product.price)}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {product.description || "Premium quality gadget, rigorously tested and verified for ultimate performance. Comes with our standard store warranty."}
              </p>
              
              <div className="space-y-4 mb-8">
                {["100% Genuine Guarantee", "Nationwide Delivery", "24/7 Customer Support"].map((feature, i) => (
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
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#00AEEF] hover:bg-[#0090c8] text-white py-4 rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(0,174,239,0.3)] flex items-center justify-center active:scale-95"
                >
                  <ShoppingCart className="w-5 h-5 mr-3" /> Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="flex-1 border border-white/20 hover:border-[#00AEEF] text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center active:scale-95"
                >
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
                  <p className="text-gray-500 text-[10px]">Official Store Warranty</p>
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
