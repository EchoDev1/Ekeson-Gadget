"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Filter, Search, ShoppingBag, Box } from "lucide-react";
import { supabase } from "@/lib/supabase";

const categoryPortals = [
  { id: "phones", title: "Phones", description: "Discover our curated collection of phones. From the latest releases to certified pre-owned excellence.", image: "/images/luxury_phones_black.png", link: "/category/phones" },
  { id: "laptops", title: "Laptops", description: "Discover our curated collection of laptops. From the latest releases to certified pre-owned excellence.", image: "/images/luxury_laptop.png", link: "/category/laptops" },
  { id: "pads", title: "iPads", description: "Discover our curated collection of ipads. From the latest releases to certified pre-owned excellence.", image: "/images/luxury_ipad.png", link: "/category/pads" },
  { id: "smart_watches", title: "Smart Watches", description: "Discover our curated collection of smart watches. From the latest releases to certified pre-owned excellence.", image: "/images/luxury_watch.png", link: "/category/smart_watches" },
  { id: "earbuds", title: "Earbuds", description: "Discover our curated collection of earbuds. From the latest releases to certified pre-owned excellence.", image: "/images/luxury_earbuds.jpg", link: "/category/earbuds" },
  { id: "accessories", title: "Accessories", description: "Discover our curated collection of accessories. From the latest releases to certified pre-owned excellence.", image: "/images/home_accessories.png", link: "/category/accessories" },
  { id: "playstation", title: "Sony PlayStation", description: "Discover our curated collection of Sony PlayStation consoles. From the latest releases to certified pre-owned excellence.", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80", link: "/category/playstation" },
  { id: "drones", title: "Drones", description: "Discover our curated collection of drones. From DJI to premium aerial vehicles.", image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80", link: "/category/drones" }
];

const brandPortals = [
  { id: "hp", title: "HP", description: "Premium Envy & Spectre.", image: "/brands/brand_hp_1779785107499.png", link: "/products?search=hp" },
  { id: "dell", title: "Dell", description: "Powerful XPS & Inspiron.", image: "/brands/brand_dell_1779785125175.png", link: "/products?search=dell" },
  { id: "macbook", title: "Apple MacBook", description: "MacBook Pro & Air.", image: "/brands/brand_macbook_1779785141033.png", link: "/products?search=macbook" },
  { id: "asus", title: "Asus", description: "ZenBook & VivoBook.", image: "/brands/brand_asus_1779785157671.png", link: "/products?search=asus" },
  { id: "gaming", title: "Gaming", description: "ROG, Alienware, Razer.", image: "/brands/brand_gaming_1779785172294.png", link: "/products?search=gaming" },
  { id: "apple-ipad", title: "Apple iPad", description: "iPad Pro & Air.", image: "/brands/brand_ipad_1779785991441.png", link: "/products?search=ipad" },
  { id: "galaxy-tab", title: "Samsung Galaxy Tab", description: "Galaxy Tab Series.", image: "/brands/brand_galaxy_tab_1779786005063.png", link: "/products?search=galaxy tab" }
];

const PortalSection = ({ title, description, image, link }) => (
  <section className="py-20 border-t border-[#1B1B5E]/5">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1B1B5E]/5 flex items-center justify-center text-[#1B1B5E]">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">{title}</h2>
            <div className="h-1 w-12 bg-[#00AEEF] mt-1" />
          </div>
        </div>
        <p className="text-lg text-[#1B1B5E]/60 max-w-md font-medium leading-relaxed">
          {description}
        </p>
        <Link 
          href={link} 
          className="inline-flex items-center gap-3 bg-[#1B1B5E] text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#00AEEF] transition-all duration-500 shadow-xl"
        >
          View Collection <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="relative w-full aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-2xl group">
        <Image 
          src={image} 
          alt={title} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B5E]/20 to-transparent" />
      </div>
    </div>
  </section>
);

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("search") || "";
    }
    return "";
  });

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
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()))
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

        {/* Portals - Only show if not actively searching specific terms */}
        {search === "" && (
          <div className="space-y-8 mb-24">
            {/* Categories */}
            {categoryPortals.map(portal => (
              <PortalSection key={portal.id} {...portal} />
            ))}

            <div className="pt-24 pb-8 text-center border-t border-[#1B1B5E]/5">
              <h2 className="text-4xl font-black text-[#1B1B5E] tracking-tighter uppercase">
                Premium <span className="text-[#00AEEF]">Brands</span>
              </h2>
            </div>

            {/* Brands */}
            {brandPortals.map(portal => (
              <PortalSection key={portal.id} {...portal} />
            ))}
          </div>
        )}

        {/* Grid - Show products if searching or as a catalog at the bottom */}
        <div className="pt-12 border-t border-[#1B1B5E]/5">
          <h2 className="text-2xl font-black text-[#1B1B5E] tracking-tighter uppercase mb-8">
            {search ? "Search Results" : "All Individual Items"}
          </h2>
          
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
    </div>
  );
}
