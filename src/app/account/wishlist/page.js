"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Heart, Loader2, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      // Because we used REFERENCES public.products(id), Supabase can do a join:
      const { data, error } = await supabase
        .from('user_wishlist')
        .select('id, product_id, products(*)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setWishlist(data);
      }
    }
    setLoading(false);
  };

  const removeFromWishlist = async (id) => {
    const { error } = await supabase.from('user_wishlist').delete().eq('id', id);
    if (!error) {
      setWishlist(wishlist.filter(item => item.id !== id));
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#00AEEF]" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#1B1B5E]/5">
        <h2 className="text-2xl font-black text-[#1B1B5E] uppercase tracking-tighter mb-6 flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          My Wishlist
        </h2>

        {wishlist.length === 0 ? (
          <div className="text-center py-12 bg-[#F5F5F7] rounded-2xl border-2 border-dashed border-[#1B1B5E]/10">
            <Heart className="w-12 h-12 text-[#1B1B5E]/20 mx-auto mb-4" />
            <h3 className="text-lg font-black text-[#1B1B5E] mb-2">Your wishlist is empty</h3>
            <p className="text-[#1B1B5E]/50 font-medium mb-6">Save items you love here and buy them later.</p>
            <Link href="/" className="bg-[#1B1B5E] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#00AEEF] transition-colors inline-block text-sm uppercase tracking-widest">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlist.map((item) => {
              const product = item.products;
              if (!product) return null; // Defensive check
              return (
                <div key={item.id} className="bg-white rounded-2xl border border-[#1B1B5E]/10 p-4 shadow-sm relative group hover:shadow-md hover:border-[#00AEEF]/30 transition-all flex flex-col">
                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-2 right-2 p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors z-10 opacity-0 group-hover:opacity-100"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link href={`/product/${product.id}`} className="block relative w-full h-40 bg-[#F5F5F7] rounded-xl overflow-hidden mb-4">
                    {product.image_url ? (
                      <Image src={product.image_url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                    )}
                  </Link>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#1B1B5E] text-sm line-clamp-2">{product.name}</h3>
                    <p className="font-black text-[#00AEEF] mt-2">₦{product.price?.toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="mt-4 w-full bg-[#1B1B5E] text-white py-2 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#00AEEF] transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
