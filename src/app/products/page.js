"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Filter, Search, ShoppingBag } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7F3E9] pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-[#1B1B5E]/40 hover:text-[#1B1B5E] transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">Back to Home</span>
            </Link>
            <h1 className="text-5xl md:text-7xl font-black text-[#1B1B5E] uppercase tracking-tighter leading-none">
              ALL <span className="text-[#00AEEF]">COLLECTION</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B1B5E]/30" />
              <input 
                type="text" 
                placeholder="Search premium gadgets..." 
                className="pl-12 pr-6 py-4 rounded-2xl bg-white border border-[#1B1B5E]/5 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 w-full sm:w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="inline-flex items-center gap-3 bg-white border border-[#1B1B5E]/5 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#1B1B5E] hover:text-white transition-all duration-300">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-white rounded-[2rem] animate-pulse border border-[#1B1B5E]/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link 
                key={product.id} 
                href={`/products/${product.id}`}
                className="group bg-white rounded-[2.5rem] border border-[#1B1B5E]/5 p-4 transition-all duration-500 hover:shadow-2xl hover:translate-y-[-4px]"
              >
                <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-6">
                  <Image 
                    src={product.image_url || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80"} 
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {product.is_featured && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-[#1B1B5E] text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                <div className="px-2 space-y-1">
                  <p className="text-[10px] font-black text-[#00AEEF] uppercase tracking-widest">{product.category}</p>
                  <h3 className="text-lg font-black text-[#1B1B5E] tracking-tight truncate uppercase">{product.name}</h3>
                  <p className="text-[#1B1B5E]/40 text-sm font-medium">₦{parseFloat(product.price).toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <ShoppingBag className="w-12 h-12 text-[#1B1B5E]/10 mx-auto mb-4" />
            <p className="text-[#1B1B5E]/40 font-medium italic">No products found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
