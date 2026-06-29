"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Zap, Search, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { fallbackProducts } from "@/lib/data";

const ProductCard = ({ product }) => {
  const isNew = product.condition === "new";
  
  return (
    <Link 
      href={`/products/${product.id}`}
      className="group bg-white rounded-[3.5rem] border border-[#1B1B5E]/5 p-5 transition-all duration-700 hover:shadow-3xl hover:translate-y-[-8px] flex flex-col justify-between"
    >
      <div>
        <div className="relative aspect-square rounded-[2.5rem] overflow-hidden mb-6 bg-[#F7F3E9]/50">
          <Image 
            src={product.image_url || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80"} 
            alt={product.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-black/5 shadow-sm">
            <span className="text-[8px] font-black uppercase tracking-widest text-[#1B1B5E]">
              {isNew ? "Sealed" : "Grade A++"}
            </span>
          </div>
        </div>
        <div className="px-2 space-y-2">
          <span className="text-[9px] font-black text-[#00AEEF] uppercase tracking-widest">{product.brand || "Premium"}</span>
          <h3 className="text-xl font-black text-[#1B1B5E] tracking-tight uppercase leading-tight group-hover:text-[#00AEEF] transition-colors line-clamp-2">{product.name}</h3>
        </div>
      </div>
      <div className="px-2 pt-4 flex items-end justify-between gap-4 mt-4">
        <p className="text-[#00AEEF] text-lg font-black italic">₦{parseFloat(product.price).toLocaleString()}</p>
        <div className="w-9 h-9 rounded-full bg-[#1B1B5E]/5 flex items-center justify-center group-hover:bg-[#00AEEF] group-hover:text-white transition-all duration-500 shadow-sm">
          <Zap className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
};

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function performSearch() {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const searchTerm = `%${query.toLowerCase()}%`;

      try {
        // Attempt to fetch from Supabase
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .or(`name.ilike.${searchTerm},brand.ilike.${searchTerm}`)
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          setResults(data);
        } else {
          // Fallback to local data
          const localResults = [];
          Object.values(fallbackProducts).forEach((categoryProducts) => {
            categoryProducts.forEach((product) => {
              if (
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                (product.brand && product.brand.toLowerCase().includes(query.toLowerCase()))
              ) {
                localResults.push(product);
              }
            });
          });
          setResults(localResults);
        }
      } catch (err) {
        // Fallback to local data on error
        const localResults = [];
        Object.values(fallbackProducts).forEach((categoryProducts) => {
          categoryProducts.forEach((product) => {
            if (
              product.name.toLowerCase().includes(query.toLowerCase()) ||
              (product.brand && product.brand.toLowerCase().includes(query.toLowerCase()))
            ) {
              localResults.push(product);
            }
          });
        });
        setResults(localResults);
      } finally {
        setLoading(false);
      }
    }

    performSearch();
  }, [query]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      {/* Header */}
      <div className="max-w-4xl mb-16">
        <Link href="/" className="inline-flex items-center gap-2 text-[#1B1B5E]/40 hover:text-[#1B1B5E] transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Home</span>
        </Link>
        
        <div className="flex items-center gap-6 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#1B1B5E]/5 shadow-sm flex items-center justify-center text-[#1B1B5E]">
            <Search className="w-6 h-6" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[#1B1B5E] uppercase tracking-tighter leading-tight">
            Search Results
          </h1>
        </div>
        
        <p className="text-xl text-[#1B1B5E]/60 font-medium max-w-2xl leading-relaxed">
          {loading ? (
            `Searching for "${query}"...`
          ) : results.length > 0 ? (
            `Found ${results.length} item${results.length === 1 ? '' : 's'} matching "${query}".`
          ) : (
            `We couldn't find any products matching "${query}".`
          )}
        </p>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-[3.5rem] border border-[#1B1B5E]/5 p-5 aspect-[3/4]" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[3.5rem] border border-[#1B1B5E]/5 mb-20 shadow-sm">
          <Search className="w-16 h-16 text-[#1B1B5E]/20 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-[#1B1B5E] uppercase tracking-tight mb-4">No Results Found</h3>
          <p className="text-[#1B1B5E]/60 font-medium mb-8 max-w-md mx-auto">Try checking your spelling or use more general terms like &quot;Apple&quot; or &quot;Headphones&quot;.</p>
          <Link href="/" className="inline-block bg-[#1B1B5E] text-white px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-[#00AEEF] transition-colors">
            Browse All Categories
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#F7F3E9] pt-24 pb-20">
      <Suspense fallback={
        <div className="container mx-auto px-4 pt-32 text-center text-xl text-[#1B1B5E]/60 font-bold uppercase tracking-widest">
          Loading Search...
        </div>
      }>
        <SearchContent />
      </Suspense>
    </div>
  );
}
