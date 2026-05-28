"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Award, Zap, Smartphone, Laptop, Tablet, Watch, Headphones, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";

const icons = {
  phones: Smartphone,
  laptops: Laptop,
  ipads: Tablet,
  pads: Tablet,
  watches: Watch,
  smart_watches: Watch,
  earbuds: Headphones,
  accessories: Package
};

// Beautiful inline SVG Apple Logo
const AppleIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className || "w-6 h-6"}>
    <path d="M18.71,19.5 C17.88,20.74 17,21.95 15.66,21.97 C14.32,22 13.89,21.18 12.37,21.18 C10.84,21.18 10.37,21.95 9.1,22 C7.79,22.05 6.8,20.68 5.96,19.47 C4.25,17 2.94,12.45 4.7,9.39 C5.57,7.87 7.13,6.91 8.82,6.88 C10.1,6.86 11.32,7.75 12.11,7.75 C12.89,7.75 14.37,6.68 15.92,6.84 C16.57,6.87 18.39,7.1 19.56,8.82 C19.47,8.88 17.39,10.1 17.41,12.63 C17.44,15.65 20.06,16.66 20.1,16.67 C20.08,16.74 19.67,18.11 18.71,19.5 M15.97,4.17 C16.63,3.37 17.07,2.28 16.95,1 C16,1.04 14.9,1.6 14.24,2.38 C13.68,3.04 13.19,4.14 13.34,5.39 C14.39,5.47 15.4,4.88 15.97,4.17 Z" />
  </svg>
);

const GoogleIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className || "w-6 h-6"}>
    <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
  </svg>
);

// High-fidelity fallback products database
const fallbackProducts = {
  phones: [
    // Apple UK Used
    {
      id: 101,
      name: "iPhone 15 Pro Max",
      price: 1350000,
      category: "phones",
      image_url: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80",
      condition: "uk-used",
      is_featured: true,
      brand: "Apple"
    },
    {
      id: 102,
      name: "iPhone 14 Pro Max",
      price: 1100000,
      category: "phones",
      image_url: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80",
      condition: "uk-used",
      is_featured: false,
      brand: "Apple"
    },
    {
      id: 103,
      name: "iPhone 13 Pro Max",
      price: 850000,
      category: "phones",
      image_url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80",
      condition: "uk-used",
      is_featured: false,
      brand: "Apple"
    },
    // Samsung UK Used
    {
      id: 105,
      name: "Samsung Galaxy S24 Ultra",
      price: 1450000,
      category: "phones",
      image_url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
      condition: "uk-used",
      is_featured: true,
      brand: "Samsung"
    },
    {
      id: 106,
      name: "Samsung Galaxy S23 Ultra",
      price: 1050000,
      category: "phones",
      image_url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
      condition: "uk-used",
      is_featured: false,
      brand: "Samsung"
    },
    {
      id: 107,
      name: "Samsung Galaxy Z Fold 5",
      price: 1250000,
      category: "phones",
      image_url: "https://images.unsplash.com/photo-1583573636246-18cb2246697f?w=800&q=80",
      condition: "uk-used",
      is_featured: false,
      brand: "Samsung"
    },
    // Apple Brand New
    {
      id: 111,
      name: "iPhone 15 Pro Max (Sealed)",
      price: 1850000,
      category: "phones",
      image_url: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80",
      condition: "new",
      is_featured: true,
      brand: "Apple"
    },
    {
      id: 112,
      name: "Samsung Galaxy S24 Ultra (Sealed)",
      price: 1950000,
      category: "phones",
      image_url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
      condition: "new",
      is_featured: true,
      brand: "Samsung"
    },
    {
      id: 113,
      name: "Google Pixel 8 Pro (Sealed)",
      price: 1350000,
      category: "phones",
      image_url: "https://images.unsplash.com/photo-1662953284074-68f766f60046?w=800&q=80",
      condition: "new",
      is_featured: true,
      brand: "Google"
    }
  ],
  pads: [
    // Apple UK Used
    {
      id: 201,
      name: "iPad Pro 12.9 M2",
      price: 1150000,
      category: "pads",
      image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
      condition: "uk-used",
      is_featured: true,
      brand: "Apple"
    },
    {
      id: 202,
      name: "iPad Air 5 (M1)",
      price: 680000,
      category: "pads",
      image_url: "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&q=80",
      condition: "uk-used",
      is_featured: false,
      brand: "Apple"
    },
    // Samsung UK Used
    {
      id: 203,
      name: "Samsung Galaxy Tab S9 Ultra",
      price: 1200000,
      category: "pads",
      image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
      condition: "uk-used",
      is_featured: true,
      brand: "Samsung"
    },
    // Apple Brand New
    {
      id: 211,
      name: "iPad Pro 12.9 M3 (Sealed)",
      price: 1550000,
      category: "pads",
      image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
      condition: "new",
      is_featured: true,
      brand: "Apple"
    },
    // Samsung Brand New
    {
      id: 212,
      name: "Samsung Galaxy Tab S9 Ultra (Sealed)",
      price: 1800000,
      category: "pads",
      image_url: "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&q=80",
      condition: "new",
      is_featured: true,
      brand: "Samsung"
    }
  ],
  smart_watches: [
    // Apple UK Used
    {
      id: 301,
      name: "Apple Watch Ultra 2",
      price: 750000,
      category: "smart_watches",
      image_url: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80",
      condition: "uk-used",
      is_featured: true,
      brand: "Apple"
    },
    {
      id: 302,
      name: "Apple Watch Series 9",
      price: 450000,
      category: "smart_watches",
      image_url: "https://images.unsplash.com/photo-1517502884422-41eaaced0168?w=800&q=80",
      condition: "uk-used",
      is_featured: false,
      brand: "Apple"
    },
    // Samsung UK Used
    {
      id: 303,
      name: "Samsung Galaxy Watch 6 Classic",
      price: 320000,
      category: "smart_watches",
      image_url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
      condition: "uk-used",
      is_featured: true,
      brand: "Samsung"
    },
    // Apple Brand New
    {
      id: 311,
      name: "Apple Watch Ultra 2 (Sealed)",
      price: 980000,
      category: "smart_watches",
      image_url: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80",
      condition: "new",
      is_featured: true,
      brand: "Apple"
    },
    // Samsung Brand New
    {
      id: 312,
      name: "Samsung Galaxy Watch 6 Classic (Sealed)",
      price: 380000,
      category: "smart_watches",
      image_url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
      condition: "new",
      is_featured: true,
      brand: "Samsung"
    },
    // Oraimo Brand New
    {
      id: 313,
      name: "Oraimo Watch 2 Pro",
      price: 45000,
      category: "smart_watches",
      image_url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
      condition: "new",
      is_featured: true,
      brand: "Oraimo"
    },
    // Fitbit Brand New
    {
      id: 314,
      name: "Fitbit Sense 2",
      price: 250000,
      category: "smart_watches",
      image_url: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80",
      condition: "new",
      is_featured: true,
      brand: "Fitbit"
    },
    // Xiaomi Brand New
    {
      id: 315,
      name: "Xiaomi Amazfit GTR 4",
      price: 150000,
      category: "smart_watches",
      image_url: "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=800&q=80",
      condition: "new",
      is_featured: true,
      brand: "Xiaomi"
    }
  ],
  earbuds: [
    // Apple UK Used
    {
      id: 401,
      name: "AirPods Pro 2",
      price: 260000,
      category: "earbuds",
      image_url: "https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=800&q=80",
      condition: "uk-used",
      is_featured: true,
      brand: "Apple"
    },
    {
      id: 402,
      name: "AirPods Max",
      price: 540000,
      category: "earbuds",
      image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
      condition: "uk-used",
      is_featured: false,
      brand: "Apple"
    },
    // Samsung UK Used
    {
      id: 403,
      name: "Samsung Galaxy Buds 2 Pro",
      price: 180000,
      category: "earbuds",
      image_url: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800&q=80",
      condition: "uk-used",
      is_featured: true,
      brand: "Samsung"
    },
    // Apple Brand New
    {
      id: 611,
      name: "Apple AirPods Pro 2",
      price: 320000,
      category: "earbuds",
      image_url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80",
      condition: "new",
      is_featured: true,
      brand: "Apple"
    }
  ],
  accessories: [
    { id: 701, name: "Premium Silicon Phone Case", price: 15000, category: "accessories", image_url: "/images/silicon_case.png", condition: "new", is_featured: true, brand: "cases" },
    { id: 702, name: "Tempered Glass Screen Protector", price: 8000, category: "accessories", image_url: "/images/screen_protector.png", condition: "new", is_featured: true, brand: "protectors" },
    { id: 703, name: "Fast Charger & Braided Cable", price: 25000, category: "accessories", image_url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80", condition: "new", is_featured: true, brand: "chargers" },
    { id: 704, name: "20,000mAh Power Bank", price: 45000, category: "accessories", image_url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80", condition: "new", is_featured: true, brand: "power_banks" },
    { id: 705, name: "Magnetic Smartwatch Strap", price: 12000, category: "accessories", image_url: "/images/smartwatch_strap.png", condition: "new", is_featured: true, brand: "straps" },
    { id: 706, name: "Portable Bluetooth Speaker", price: 35000, category: "accessories", image_url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80", condition: "new", is_featured: true, brand: "speakers" },
    { id: 707, name: "Premium Leather Laptop Bag", price: 55000, category: "accessories", image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80", condition: "new", is_featured: true, brand: "bags" },
    { id: 708, name: "Universal Active Stylus Pen", price: 18000, category: "accessories", image_url: "/images/stylus_pen.png", condition: "new", is_featured: true, brand: "stylus" }
  ],
  laptops: [
    // Apple UK Used
    {
      id: 501,
      name: "MacBook Pro M3",
      price: 2100000,
      category: "laptops",
      image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      condition: "uk-used",
      is_featured: true,
      brand: "Apple"
    },
    // Samsung UK Used
    {
      id: 503,
      name: "Samsung Galaxy Book 3 Pro",
      price: 1650000,
      category: "laptops",
      image_url: "https://images.unsplash.com/photo-1496181130204-755241524eab?w=800&q=80",
      condition: "uk-used",
      is_featured: true,
      brand: "Samsung"
    },
    // HP Brand New
    {
      id: 511,
      name: "HP Spectre x360",
      price: 1850000,
      category: "laptops",
      image_url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80",
      condition: "new",
      is_featured: true,
      brand: "HP"
    },
    // Dell Brand New
    {
      id: 512,
      name: "Dell XPS 15",
      price: 2200000,
      category: "laptops",
      image_url: "https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?w=800&q=80",
      condition: "new",
      is_featured: true,
      brand: "Dell"
    },
    // Apple Brand New
    {
      id: 513,
      name: "MacBook Pro M3 Max",
      price: 3500000,
      category: "laptops",
      image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      condition: "new",
      is_featured: true,
      brand: "Apple"
    },
    // Asus Brand New
    {
      id: 514,
      name: "Asus ZenBook 14",
      price: 1300000,
      category: "laptops",
      image_url: "https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?w=800&q=80",
      condition: "new",
      is_featured: true,
      brand: "Asus"
    },
    // Gaming Brand New
    {
      id: 515,
      name: "Razer Blade 16",
      price: 4500000,
      category: "laptops",
      image_url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
      condition: "new",
      is_featured: true,
      brand: "Gaming"
    }
  ]
};

// Reusable premium product card component
const ProductCard = ({ product, isNew }) => {
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
          <h3 className="text-xl font-black text-[#1B1B5E] tracking-tight uppercase leading-tight group-hover:text-[#00AEEF] transition-colors">{product.name}</h3>
        </div>
      </div>
      <div className="px-2 pt-4 flex items-end justify-between gap-4">
        <p className="text-[#00AEEF] text-lg font-black italic">₦{parseFloat(product.price).toLocaleString()}</p>
        <div className="w-9 h-9 rounded-full bg-[#1B1B5E]/5 flex items-center justify-center group-hover:bg-[#00AEEF] group-hover:text-white transition-all duration-500 shadow-sm">
          <Zap className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
};

export default function CategoryConditionPage() {
  const { slug, condition } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBrand, setActiveBrand] = useState("all");

  const isNew = condition === "new";
  const title = isNew ? "Direct / Brand New" : "Highest Grade UK Used";
  const Icon = icons[slug] || Smartphone;

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("category", slug)
          .eq("condition", condition)
          .order("created_at", { ascending: false });

        let currentCategoryProducts = fallbackProducts[slug] || [];
        // Filter local products to respect the condition parameter
        currentCategoryProducts = currentCategoryProducts.filter(p => p.condition === condition);

        if (error || !data || data.length === 0) {
          setProducts(currentCategoryProducts);
        } else {
          // If Supabase returned products, we map over them and ensure condition is set
          // Since our DB doesn't have a condition column, let's merge or use DB data.
          // In a real-world scenario, we'd add 'condition' column or filter.
          // Let's filter Supabase data that matches the brand patterns or just use Supabase data.
          setProducts(data);
        }
      } catch (err) {
        let currentCategoryProducts = fallbackProducts[slug] || [];
        currentCategoryProducts = currentCategoryProducts.filter(p => p.condition === condition);
        setProducts(currentCategoryProducts);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [slug, condition]);

  // Grouping logic for Apple & Samsung sections when condition is uk-used
  const isUKUsed = condition === "uk-used";

  const appleProducts = products.filter(p => 
    p.brand === "Apple" || 
    p.name.toLowerCase().includes("apple") || 
    p.name.toLowerCase().includes("iphone") || 
    p.name.toLowerCase().includes("ipad") || 
    p.name.toLowerCase().includes("macbook") || 
    p.name.toLowerCase().includes("airpods") || 
    p.name.toLowerCase().includes("watch") || 
    p.name.toLowerCase().includes("iwatch")
  );

  const samsungProducts = products.filter(p => 
    p.brand === "Samsung" || 
    p.name.toLowerCase().includes("samsung") || 
    p.name.toLowerCase().includes("galaxy") || 
    p.name.toLowerCase().includes("buds")
  );

  const googleProducts = products.filter(p => 
    p.brand === "Google" || 
    p.name.toLowerCase().includes("google") || 
    p.name.toLowerCase().includes("pixel")
  );

  const hpProducts = products.filter(p => p.brand === "HP" || p.name.toLowerCase().includes("hp"));
  const dellProducts = products.filter(p => p.brand === "Dell" || p.name.toLowerCase().includes("dell") || p.name.toLowerCase().includes("xps"));
  const asusProducts = products.filter(p => p.brand === "Asus" || p.name.toLowerCase().includes("asus") || p.name.toLowerCase().includes("zenbook"));
  const gamingProducts = products.filter(p => p.brand === "Gaming" || p.name.toLowerCase().includes("gaming") || p.name.toLowerCase().includes("alienware") || p.name.toLowerCase().includes("rog") || p.name.toLowerCase().includes("razer"));
  const oraimoProducts = products.filter(p => p.brand === "Oraimo" || p.name.toLowerCase().includes("oraimo"));
  const oppoProducts = products.filter(p => p.brand === "Oppo" || p.name.toLowerCase().includes("oppo"));
  const ankerProducts = products.filter(p => p.brand === "Anker" || p.name.toLowerCase().includes("anker"));
  const realmeProducts = products.filter(p => p.brand === "Realme" || p.name.toLowerCase().includes("realme"));
  const fitbitProducts = products.filter(p => p.brand === "Fitbit" || p.name.toLowerCase().includes("fitbit"));
  const xiaomiProducts = products.filter(p => p.brand === "Xiaomi" || p.name.toLowerCase().includes("xiaomi") || p.name.toLowerCase().includes("amazfit"));
  
  const casesProducts = products.filter(p => p.brand === "cases" || p.name.toLowerCase().includes("case"));
  const protectorsProducts = products.filter(p => p.brand === "protectors" || p.name.toLowerCase().includes("protector"));
  const chargersProducts = products.filter(p => p.brand === "chargers" || p.name.toLowerCase().includes("charger") || p.name.toLowerCase().includes("cable"));
  const powerBanksProducts = products.filter(p => p.brand === "power_banks" || p.name.toLowerCase().includes("power bank"));
  const strapsProducts = products.filter(p => p.brand === "straps" || p.name.toLowerCase().includes("strap"));
  const speakersProducts = products.filter(p => p.brand === "speakers" || p.name.toLowerCase().includes("speaker"));
  const bagsProducts = products.filter(p => p.brand === "bags" || p.name.toLowerCase().includes("bag"));
  const stylusProducts = products.filter(p => p.brand === "stylus" || p.name.toLowerCase().includes("stylus") || p.name.toLowerCase().includes("pen"));

  const otherProducts = products.filter(p => 
    !appleProducts.some(ap => ap.id === p.id) && 
    !samsungProducts.some(sp => sp.id === p.id) &&
    !googleProducts.some(gp => gp.id === p.id) &&
    !hpProducts.some(hp => hp.id === p.id) &&
    !dellProducts.some(dp => dp.id === p.id) &&
    !asusProducts.some(ap => ap.id === p.id) &&
    !gamingProducts.some(gp => gp.id === p.id) &&
    !oraimoProducts.some(op => op.id === p.id) &&
    !fitbitProducts.some(fp => fp.id === p.id) &&
    !xiaomiProducts.some(xp => xp.id === p.id) &&
    !casesProducts.some(cp => cp.id === p.id) &&
    !protectorsProducts.some(pp => pp.id === p.id) &&
    !chargersProducts.some(cp => cp.id === p.id) &&
    !powerBanksProducts.some(pp => pp.id === p.id) &&
    !strapsProducts.some(sp => sp.id === p.id) &&
    !speakersProducts.some(sp => sp.id === p.id) &&
    !bagsProducts.some(bp => bp.id === p.id) &&
    !stylusProducts.some(sp => sp.id === p.id)
  );

  return (
    <div className="min-h-screen bg-[#F7F3E9] pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl mb-20">
          {(slug === "phones" || slug === "laptops" || slug === "pads" || slug === "smart_watches" || slug === "accessories") && activeBrand !== "all" ? (
            <button onClick={() => setActiveBrand("all")} className="inline-flex items-center gap-2 text-[#1B1B5E]/40 hover:text-[#1B1B5E] transition-colors mb-12">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">Back to Brands</span>
            </button>
          ) : (
            <Link href={`/category/${slug}`} className="inline-flex items-center gap-2 text-[#1B1B5E]/40 hover:text-[#1B1B5E] transition-colors mb-12">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">Back to {slug} Portal</span>
            </Link>
          )}
          
          <div className="flex items-center gap-6 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white border border-[#1B1B5E]/5 shadow-sm flex items-center justify-center text-[#1B1B5E]">
              <Icon className="w-6 h-6" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-[#1B1B5E] uppercase tracking-tighter leading-tight">
              {slug} / <span className="text-[#00AEEF]">{isNew ? "BRAND NEW" : "UK USED"}</span>
            </h1>
          </div>
          
          <p className="text-xl text-[#1B1B5E]/60 font-medium max-w-2xl leading-relaxed">
            {isNew 
              ? "Experience excellence with our direct-from-manufacturer collection. Factory sealed, full warranty, zero compromises."
              : "Experience premium quality without the premium price tag. Our Grade A+++ UK used collection is rigorously tested and verified."}
          </p>
        </div>

        {/* Full-Page Brand Portals */}
        {slug === "accessories" && activeBrand === "all" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-20 max-w-7xl mx-auto">
            {/* Phone Cases Portal */}
            <button onClick={() => setActiveBrand("cases")} className="group relative rounded-[2rem] bg-white border border-[#1B1B5E]/5 shadow-lg transition-all duration-500 aspect-[3/4] flex flex-col justify-end p-6 hover:-translate-y-2 overflow-hidden text-left">
              <div className="absolute inset-0">
                <Image src="/images/silicon_case.png" alt="Phone Cases" fill className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B5E] via-[#1B1B5E]/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="relative z-10 space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Silicon Cases</h3>
                <div className="inline-block mt-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#1B1B5E] transition-colors duration-500">
                  View
                </div>
              </div>
            </button>

            {/* Screen Protectors Portal */}
            <button onClick={() => setActiveBrand("protectors")} className="group relative rounded-[2rem] bg-white border border-[#1B1B5E]/5 shadow-lg transition-all duration-500 aspect-[3/4] flex flex-col justify-end p-6 hover:-translate-y-2 overflow-hidden text-left">
              <div className="absolute inset-0">
                <Image src="/images/screen_protector.png" alt="Screen Protectors" fill className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B5E] via-[#1B1B5E]/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="relative z-10 space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Screen Protectors</h3>
                <div className="inline-block mt-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#1B1B5E] transition-colors duration-500">
                  View
                </div>
              </div>
            </button>

            {/* Chargers & Cables Portal */}
            <button onClick={() => setActiveBrand("chargers")} className="group relative rounded-[2rem] bg-white border border-[#1B1B5E]/5 shadow-lg transition-all duration-500 aspect-[3/4] flex flex-col justify-end p-6 hover:-translate-y-2 overflow-hidden text-left">
              <div className="absolute inset-0">
                <Image src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80" alt="Chargers" fill className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B5E] via-[#1B1B5E]/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="relative z-10 space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Chargers & Cables</h3>
                <div className="inline-block mt-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#1B1B5E] transition-colors duration-500">
                  View
                </div>
              </div>
            </button>

            {/* Power Banks Portal */}
            <button onClick={() => setActiveBrand("power_banks")} className="group relative rounded-[2rem] bg-white border border-[#1B1B5E]/5 shadow-lg transition-all duration-500 aspect-[3/4] flex flex-col justify-end p-6 hover:-translate-y-2 overflow-hidden text-left">
              <div className="absolute inset-0">
                <Image src="https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80" alt="Power Banks" fill className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B5E] via-[#1B1B5E]/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="relative z-10 space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Power Banks</h3>
                <div className="inline-block mt-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#1B1B5E] transition-colors duration-500">
                  View
                </div>
              </div>
            </button>

            {/* Smartwatch Strap Portal */}
            <button onClick={() => setActiveBrand("straps")} className="group relative rounded-[2rem] bg-white border border-[#1B1B5E]/5 shadow-lg transition-all duration-500 aspect-[3/4] flex flex-col justify-end p-6 hover:-translate-y-2 overflow-hidden text-left">
              <div className="absolute inset-0">
                <Image src="/images/smartwatch_strap.png" alt="Straps" fill className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B5E] via-[#1B1B5E]/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="relative z-10 space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Smartwatch Straps</h3>
                <div className="inline-block mt-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#1B1B5E] transition-colors duration-500">
                  View
                </div>
              </div>
            </button>

            {/* Bluetooth Speakers Portal */}
            <button onClick={() => setActiveBrand("speakers")} className="group relative rounded-[2rem] bg-white border border-[#1B1B5E]/5 shadow-lg transition-all duration-500 aspect-[3/4] flex flex-col justify-end p-6 hover:-translate-y-2 overflow-hidden text-left">
              <div className="absolute inset-0">
                <Image src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80" alt="Speakers" fill className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B5E] via-[#1B1B5E]/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="relative z-10 space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Bluetooth Speakers</h3>
                <div className="inline-block mt-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#1B1B5E] transition-colors duration-500">
                  View
                </div>
              </div>
            </button>

            {/* Laptop Bags Portal */}
            <button onClick={() => setActiveBrand("bags")} className="group relative rounded-[2rem] bg-white border border-[#1B1B5E]/5 shadow-lg transition-all duration-500 aspect-[3/4] flex flex-col justify-end p-6 hover:-translate-y-2 overflow-hidden text-left">
              <div className="absolute inset-0">
                <Image src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80" alt="Laptop Bags" fill className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B5E] via-[#1B1B5E]/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="relative z-10 space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Laptop Bags</h3>
                <div className="inline-block mt-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#1B1B5E] transition-colors duration-500">
                  View
                </div>
              </div>
            </button>

            {/* Stylus Pens Portal */}
            <button onClick={() => setActiveBrand("stylus")} className="group relative rounded-[2rem] bg-white border border-[#1B1B5E]/5 shadow-lg transition-all duration-500 aspect-[3/4] flex flex-col justify-end p-6 hover:-translate-y-2 overflow-hidden text-left">
              <div className="absolute inset-0">
                <Image src="/images/stylus_pen.png" alt="Stylus Pens" fill className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B5E] via-[#1B1B5E]/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="relative z-10 space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Stylus Pens</h3>
                <div className="inline-block mt-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#1B1B5E] transition-colors duration-500">
                  View
                </div>
              </div>
            </button>
          </div>
        ) : slug === "earbuds" && activeBrand === "all" ? (
          <div className={`grid grid-cols-1 md:grid-cols-2 ${isNew ? 'lg:grid-cols-3' : ''} gap-8 mb-20 max-w-7xl mx-auto`}>
            {/* Apple Portal */}
            <button onClick={() => setActiveBrand("apple")} className="group relative rounded-[3rem] bg-white border border-[#1B1B5E]/5 shadow-xl transition-all duration-700 aspect-[3/4] flex flex-col justify-end p-10 hover:-translate-y-4 overflow-hidden text-left">
              <div className="absolute inset-0">
                <Image src="/images/brand_earbuds_apple.png" alt="Apple AirPods" fill className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B5E] via-[#1B1B5E]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="relative z-10 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-6 shadow-md border border-white/20">
                  <AppleIcon className="w-8 h-8" />
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Apple</h3>
                <p className="text-white/80 font-medium tracking-tight">AirPods & Pro.</p>
                <div className="inline-block mt-4 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#1B1B5E] transition-colors duration-500">View Collection</div>
              </div>
            </button>

            {/* Samsung Portal */}
            <button onClick={() => setActiveBrand("samsung")} className="group relative rounded-[3rem] bg-white border border-[#00AEEF]/10 shadow-xl transition-all duration-700 aspect-[3/4] flex flex-col justify-end p-10 hover:-translate-y-4 overflow-hidden text-left">
              <div className="absolute inset-0">
                <Image src="/images/brand_earbuds_samsung.png" alt="Samsung Galaxy Buds" fill className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00AEEF] via-[#00AEEF]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="relative z-10 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-6 shadow-md border border-white/20">
                  <span className="font-black text-xl tracking-wider">SMSG</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Samsung</h3>
                <p className="text-white/80 font-medium tracking-tight">Galaxy Buds Series.</p>
                <div className="inline-block mt-4 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#00AEEF] transition-colors duration-500">View Collection</div>
              </div>
            </button>

            {isNew && (
              <>
                {/* Oraimo Portal */}
                <button onClick={() => setActiveBrand("oraimo")} className="group relative rounded-[3rem] bg-white border border-[#16C57C]/10 shadow-xl transition-all duration-700 aspect-[3/4] flex flex-col justify-end p-10 hover:-translate-y-4 overflow-hidden text-left">
                  <div className="absolute inset-0">
                    <Image src="/images/brand_earbuds_oraimo.png" alt="Oraimo FreePods" fill className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#16C57C] via-[#16C57C]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  </div>
                  <div className="relative z-10 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-6 shadow-md border border-white/20">
                      <span className="font-black text-xl tracking-wider">ORMO</span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Oraimo</h3>
                    <p className="text-white/80 font-medium tracking-tight">FreePods Series.</p>
                    <div className="inline-block mt-4 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#16C57C] transition-colors duration-500">View Collection</div>
                  </div>
                </button>

                {/* Oppo Portal */}
                <button onClick={() => setActiveBrand("oppo")} className="group relative rounded-[3rem] bg-white border border-[#0F8A55]/10 shadow-xl transition-all duration-700 aspect-[3/4] flex flex-col justify-end p-10 hover:-translate-y-4 overflow-hidden text-left">
                  <div className="absolute inset-0">
                    <Image src="/images/brand_earbuds_oppo.png" alt="Oppo Enco" fill className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F8A55] via-[#0F8A55]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  </div>
                  <div className="relative z-10 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-6 shadow-md border border-white/20">
                      <span className="font-black text-xl tracking-wider">OPPO</span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Oppo</h3>
                    <p className="text-white/80 font-medium tracking-tight">Enco Series.</p>
                    <div className="inline-block mt-4 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#0F8A55] transition-colors duration-500">View Collection</div>
                  </div>
                </button>

                {/* Anker Portal */}
                <button onClick={() => setActiveBrand("anker")} className="group relative rounded-[3rem] bg-white border border-[#1992D4]/10 shadow-xl transition-all duration-700 aspect-[3/4] flex flex-col justify-end p-10 hover:-translate-y-4 overflow-hidden text-left">
                  <div className="absolute inset-0">
                    <Image src="/images/brand_earbuds_anker.png" alt="Anker Soundcore" fill className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1992D4] via-[#1992D4]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  </div>
                  <div className="relative z-10 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-6 shadow-md border border-white/20">
                      <span className="font-black text-xl tracking-wider">ANKR</span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Anker</h3>
                    <p className="text-white/80 font-medium tracking-tight">Soundcore Audio.</p>
                    <div className="inline-block mt-4 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#1992D4] transition-colors duration-500">View Collection</div>
                  </div>
                </button>

                {/* Realme Portal */}
                <button onClick={() => setActiveBrand("realme")} className="group relative rounded-[3rem] bg-white border border-[#FBBB00]/10 shadow-xl transition-all duration-700 aspect-[3/4] flex flex-col justify-end p-10 hover:-translate-y-4 overflow-hidden text-left">
                  <div className="absolute inset-0">
                    <Image src="/images/brand_earbuds_realme.png" alt="Realme Earbuds" fill className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FBBB00] via-[#FBBB00]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  </div>
                  <div className="relative z-10 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-6 shadow-md border border-white/20">
                      <span className="font-black text-xl tracking-wider">RLME</span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Realme</h3>
                    <p className="text-white/80 font-medium tracking-tight">Realme Buds Series.</p>
                    <div className="inline-block mt-4 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#FBBB00] transition-colors duration-500">View Collection</div>
                  </div>
                </button>
              </>
            )}
          </div>
        ) : slug === "smart_watches" && activeBrand === "all" ? (
          <div className={`grid grid-cols-1 md:grid-cols-2 ${isNew ? 'lg:grid-cols-3' : ''} gap-8 mb-20 max-w-7xl mx-auto`}>
            {/* Apple Portal */}
            <button 
              onClick={() => setActiveBrand("apple")}
              className="group relative rounded-[3rem] bg-white border border-[#1B1B5E]/5 shadow-xl transition-all duration-700 aspect-[3/4] flex flex-col justify-end p-10 hover:-translate-y-4 overflow-hidden text-left"
            >
              <div className="absolute inset-0">
                <Image 
                  src="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80" 
                  alt="Apple Watch" 
                  fill 
                  className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B5E] via-[#1B1B5E]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="relative z-10 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-6 shadow-md border border-white/20">
                  <AppleIcon className="w-8 h-8" />
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Apple</h3>
                <p className="text-white/80 font-medium tracking-tight">Apple Watch Series.</p>
                <div className="inline-block mt-4 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#1B1B5E] transition-colors duration-500">
                  View Collection
                </div>
              </div>
            </button>

            {/* Samsung Portal */}
            <button 
              onClick={() => setActiveBrand("samsung")}
              className="group relative rounded-[3rem] bg-white border border-[#00AEEF]/10 shadow-xl transition-all duration-700 aspect-[3/4] flex flex-col justify-end p-10 hover:-translate-y-4 overflow-hidden text-left"
            >
              <div className="absolute inset-0">
                <Image 
                  src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80" 
                  alt="Samsung Galaxy Watch" 
                  fill 
                  className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00AEEF] via-[#00AEEF]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="relative z-10 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-6 shadow-md border border-white/20">
                  <span className="font-black text-xl tracking-wider">SMSG</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Samsung</h3>
                <p className="text-white/80 font-medium tracking-tight">Galaxy Watch.</p>
                <div className="inline-block mt-4 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#00AEEF] transition-colors duration-500">
                  View Collection
                </div>
              </div>
            </button>

            {isNew && (
              <>
                {/* Oraimo Portal */}
                <button 
                  onClick={() => setActiveBrand("oraimo")}
                  className="group relative rounded-[3rem] bg-white border border-[#7BB833]/10 shadow-xl transition-all duration-700 aspect-[3/4] flex flex-col justify-end p-10 hover:-translate-y-4 overflow-hidden text-left"
                >
                  <div className="absolute inset-0">
                    <Image 
                      src="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80" 
                      alt="Oraimo" 
                      fill 
                      className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#7BB833] via-[#7BB833]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  </div>
                  <div className="relative z-10 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-6 shadow-md border border-white/20">
                      <span className="font-black text-xl tracking-wider">ORMO</span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Oraimo</h3>
                    <p className="text-white/80 font-medium tracking-tight">Smart Accessories.</p>
                    <div className="inline-block mt-4 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#7BB833] transition-colors duration-500">
                      View Collection
                    </div>
                  </div>
                </button>

                {/* Fitbit Portal */}
                <button 
                  onClick={() => setActiveBrand("fitbit")}
                  className="group relative rounded-[3rem] bg-white border border-[#00B0B9]/10 shadow-xl transition-all duration-700 aspect-[3/4] flex flex-col justify-end p-10 hover:-translate-y-4 overflow-hidden text-left"
                >
                  <div className="absolute inset-0">
                    <Image 
                      src="https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80" 
                      alt="Fitbit" 
                      fill 
                      className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#00B0B9] via-[#00B0B9]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  </div>
                  <div className="relative z-10 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-6 shadow-md border border-white/20">
                      <span className="font-black text-xl tracking-wider">FIT</span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Fitbit</h3>
                    <p className="text-white/80 font-medium tracking-tight">Health & Fitness.</p>
                    <div className="inline-block mt-4 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#00B0B9] transition-colors duration-500">
                      View Collection
                    </div>
                  </div>
                </button>

                {/* Xiaomi Portal */}
                <button 
                  onClick={() => setActiveBrand("xiaomi")}
                  className="group relative rounded-[3rem] bg-white border border-[#FF6900]/10 shadow-xl transition-all duration-700 aspect-[3/4] flex flex-col justify-end p-10 hover:-translate-y-4 overflow-hidden text-left"
                >
                  <div className="absolute inset-0">
                    <Image 
                      src="https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=800&q=80" 
                      alt="Xiaomi Amazfit" 
                      fill 
                      className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FF6900] via-[#FF6900]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  </div>
                  <div className="relative z-10 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-6 shadow-md border border-white/20">
                      <span className="font-black text-xl tracking-wider">MI</span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Xiaomi</h3>
                    <p className="text-white/80 font-medium tracking-tight">Amazfit Series.</p>
                    <div className="inline-block mt-4 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#FF6900] transition-colors duration-500">
                      View Collection
                    </div>
                  </div>
                </button>
              </>
            )}
          </div>
        ) : slug === "pads" && activeBrand === "all" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-5xl mx-auto">
            {/* Apple Portal */}
            <button 
              onClick={() => setActiveBrand("apple")}
              className="group relative rounded-[3rem] bg-white border border-[#1B1B5E]/5 shadow-xl transition-all duration-700 aspect-[3/4] flex flex-col justify-end p-10 hover:-translate-y-4 overflow-hidden text-left"
            >
              <div className="absolute inset-0">
                <Image 
                  src="/images/brand_ipad.png" 
                  alt="Apple iPad" 
                  fill 
                  className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B5E] via-[#1B1B5E]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="relative z-10 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-6 shadow-md border border-white/20">
                  <AppleIcon className="w-8 h-8" />
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Apple</h3>
                <p className="text-white/80 font-medium tracking-tight">iPad Pro & Air.</p>
                <div className="inline-block mt-4 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#1B1B5E] transition-colors duration-500">
                  View Collection
                </div>
              </div>
            </button>
            
            {/* Samsung Portal */}
            <button 
              onClick={() => setActiveBrand("samsung")}
              className="group relative rounded-[3rem] bg-white border border-[#00AEEF]/10 shadow-xl transition-all duration-700 aspect-[3/4] flex flex-col justify-end p-10 hover:-translate-y-4 overflow-hidden text-left"
            >
              <div className="absolute inset-0">
                <Image 
                  src="/images/brand_galaxy_tab.png" 
                  alt="Samsung Galaxy Tab" 
                  fill 
                  className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00AEEF] via-[#00AEEF]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="relative z-10 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-6 shadow-md border border-white/20">
                  <span className="font-black text-xl tracking-wider">SMSG</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Samsung</h3>
                <p className="text-white/80 font-medium tracking-tight">Galaxy Tab Series.</p>
                <div className="inline-block mt-4 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#00AEEF] transition-colors duration-500">
                  View Collection
                </div>
              </div>
            </button>
          </div>
        ) : slug === "laptops" && activeBrand === "all" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 max-w-7xl mx-auto">
            {/* HP Portal */}
            <button 
              onClick={() => setActiveBrand("hp")}
              className="group relative rounded-[3rem] bg-white border border-[#1B1B5E]/5 shadow-xl transition-all duration-700 aspect-[3/4] flex flex-col justify-end p-10 hover:-translate-y-4 overflow-hidden text-left"
            >
              <div className="absolute inset-0">
                <Image 
                  src="/images/brand_hp.png" 
                  alt="HP" 
                  fill 
                  className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0096D6] via-[#0096D6]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="relative z-10 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-6 shadow-md border border-white/20">
                  <span className="font-black text-2xl tracking-wider">hp</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">HP</h3>
                <p className="text-white/80 font-medium tracking-tight">Premium Envy & Spectre.</p>
                <div className="inline-block mt-4 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#0096D6] transition-colors duration-500">
                  View Collection
                </div>
              </div>
            </button>
            
            {/* Dell Portal */}
            <button 
              onClick={() => setActiveBrand("dell")}
              className="group relative rounded-[3rem] bg-white border border-[#1B1B5E]/5 shadow-xl transition-all duration-700 aspect-[3/4] flex flex-col justify-end p-10 hover:-translate-y-4 overflow-hidden text-left"
            >
              <div className="absolute inset-0">
                <Image 
                  src="/images/brand_dell.png" 
                  alt="Dell" 
                  fill 
                  className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#007DB8] via-[#007DB8]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="relative z-10 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-6 shadow-md border border-white/20">
                  <span className="font-black text-xl tracking-wider">DELL</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Dell</h3>
                <p className="text-white/80 font-medium tracking-tight">Powerful XPS & Inspiron.</p>
                <div className="inline-block mt-4 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#007DB8] transition-colors duration-500">
                  View Collection
                </div>
              </div>
            </button>

            {/* Apple MacBook Portal */}
            <button 
              onClick={() => setActiveBrand("apple")}
              className="group relative rounded-[3rem] bg-white border border-[#1B1B5E]/5 shadow-xl transition-all duration-700 aspect-[3/4] flex flex-col justify-end p-10 hover:-translate-y-4 overflow-hidden text-left"
            >
              <div className="absolute inset-0">
                <Image 
                  src="/images/brand_macbook.png" 
                  alt="Apple MacBook" 
                  fill 
                  className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B5E] via-[#1B1B5E]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="relative z-10 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-6 shadow-md border border-white/20">
                  <AppleIcon className="w-8 h-8" />
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Apple</h3>
                <p className="text-white/80 font-medium tracking-tight">MacBook Pro & Air.</p>
                <div className="inline-block mt-4 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#1B1B5E] transition-colors duration-500">
                  View Collection
                </div>
              </div>
            </button>

            {/* Asus Portal */}
            <button 
              onClick={() => setActiveBrand("asus")}
              className="group relative rounded-[3rem] bg-white border border-[#1B1B5E]/5 shadow-xl transition-all duration-700 aspect-[3/4] flex flex-col justify-end p-10 hover:-translate-y-4 overflow-hidden text-left"
            >
              <div className="absolute inset-0">
                <Image 
                  src="/images/brand_asus.png" 
                  alt="Asus" 
                  fill 
                  className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00539B] via-[#00539B]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="relative z-10 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-6 shadow-md border border-white/20">
                  <span className="font-black text-xl tracking-wider">ASUS</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Asus</h3>
                <p className="text-white/80 font-medium tracking-tight">ZenBook & VivoBook.</p>
                <div className="inline-block mt-4 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#00539B] transition-colors duration-500">
                  View Collection
                </div>
              </div>
            </button>

            {/* Gaming Portal */}
            <button 
              onClick={() => setActiveBrand("gaming")}
              className="group relative rounded-[3rem] bg-white border border-[#1B1B5E]/5 shadow-xl transition-all duration-700 aspect-[3/4] flex flex-col justify-end p-10 hover:-translate-y-4 overflow-hidden text-left"
            >
              <div className="absolute inset-0">
                <Image 
                  src="/images/brand_gaming.png" 
                  alt="Gaming" 
                  fill 
                  className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#E51400] via-[#E51400]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="relative z-10 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-6 shadow-md border border-white/20">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Gaming</h3>
                <p className="text-white/80 font-medium tracking-tight">ROG, Alienware, Razer.</p>
                <div className="inline-block mt-4 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#E51400] transition-colors duration-500">
                  View Collection
                </div>
              </div>
            </button>
          </div>
        ) : slug === "phones" && activeBrand === "all" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 max-w-7xl mx-auto">
            {/* Apple Portal */}
            <button 
              onClick={() => setActiveBrand("apple")}
              className="group relative rounded-[3rem] bg-white border border-[#1B1B5E]/5 shadow-xl transition-all duration-700 aspect-[3/4] flex flex-col justify-end p-10 hover:-translate-y-4 overflow-hidden text-left"
            >
              <div className="absolute inset-0">
                <Image 
                  src="/images/brand_apple.png" 
                  alt="Apple" 
                  fill 
                  className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B5E] via-[#1B1B5E]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="relative z-10 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-6 shadow-md border border-white/20">
                  <AppleIcon className="w-8 h-8" />
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Apple</h3>
                <p className="text-white/80 font-medium tracking-tight">Explore pristine iOS devices.</p>
                <div className="inline-block mt-4 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#1B1B5E] transition-colors duration-500">
                  View Collection
                </div>
              </div>
            </button>
            
            {/* Samsung Portal */}
            <button 
              onClick={() => setActiveBrand("samsung")}
              className="group relative rounded-[3rem] bg-white border border-[#00AEEF]/10 shadow-xl transition-all duration-700 aspect-[3/4] flex flex-col justify-end p-10 hover:-translate-y-4 overflow-hidden text-left"
            >
              <div className="absolute inset-0">
                <Image 
                  src="/images/brand_samsung.png" 
                  alt="Samsung" 
                  fill 
                  className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00AEEF] via-[#00AEEF]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="relative z-10 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-6 shadow-md border border-white/20">
                  <span className="font-black text-xl tracking-wider">SMSG</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Samsung</h3>
                <p className="text-white/80 font-medium tracking-tight">Premium Galaxy Experience.</p>
                <div className="inline-block mt-4 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#00AEEF] transition-colors duration-500">
                  View Collection
                </div>
              </div>
            </button>

            {/* Google Portal */}
            <button 
              onClick={() => setActiveBrand("google")}
              className="group relative rounded-[3rem] bg-white border border-[#EA4335]/10 shadow-xl transition-all duration-700 aspect-[3/4] flex flex-col justify-end p-10 hover:-translate-y-4 overflow-hidden text-left"
            >
              <div className="absolute inset-0">
                <Image 
                  src="/images/brand_google.png" 
                  alt="Google Pixel" 
                  fill 
                  className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#EA4335] via-[#EA4335]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="relative z-10 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-6 shadow-md border border-white/20">
                  <GoogleIcon className="w-8 h-8" />
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Google</h3>
                <p className="text-white/80 font-medium tracking-tight">Pure Android Experience.</p>
                <div className="inline-block mt-4 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#EA4335] transition-colors duration-500">
                  View Collection
                </div>
              </div>
            </button>
          </div>
        ) : (
          <>
            {/* Product Grid / Sections */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-white rounded-[3rem] animate-pulse border border-[#1B1B5E]/5" />
                ))}
              </div>
            ) : products.length > 0 ? (
              (isUKUsed || slug === "phones" || slug === "laptops" || slug === "pads" || slug === "smart_watches" || slug === "accessories" || slug === "earbuds") ? (
                <div className="space-y-28">
                  {/* Apple Section */}
                  {appleProducts.length > 0 && activeBrand === "apple" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-[#1B1B5E]/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-[#1B1B5E]/5 shadow-sm flex items-center justify-center text-[#1B1B5E] hover:scale-105 transition-transform">
                            <AppleIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Apple Collection</h2>
                            <p className="text-xs text-[#1B1B5E]/40 font-black uppercase tracking-widest mt-1">Pristine iOS & macOS Devices</p>
                          </div>
                        </div>
                        <div className="px-5 py-2 bg-[#1B1B5E]/5 border border-[#1B1B5E]/5 rounded-full text-[10px] font-black text-[#1B1B5E] uppercase tracking-widest shadow-sm">
                          {appleProducts.length} Items Available
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {appleProducts.map((product) => (
                          <ProductCard key={product.id} product={product} isNew={isNew} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Samsung Section */}
                  {samsungProducts.length > 0 && activeBrand === "samsung" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-[#1B1B5E]/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-[#00AEEF]/5 border border-[#00AEEF]/10 shadow-sm flex items-center justify-center text-[#00AEEF] hover:scale-105 transition-transform">
                            <span className="font-black text-xs tracking-wider">SMSG</span>
                          </div>
                          <div>
                            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Samsung Collection</h2>
                            <p className="text-xs text-[#1B1B5E]/40 font-black uppercase tracking-widest mt-1">Premium Galaxy Experience</p>
                          </div>
                        </div>
                        <div className="px-5 py-2 bg-[#00AEEF]/5 border border-[#00AEEF]/10 rounded-full text-[10px] font-black text-[#00AEEF] uppercase tracking-widest shadow-sm">
                          {samsungProducts.length} Items Available
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {samsungProducts.map((product) => (
                          <ProductCard key={product.id} product={product} isNew={isNew} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Google Section */}
                  {googleProducts.length > 0 && activeBrand === "google" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-[#1B1B5E]/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-[#EA4335]/5 border border-[#EA4335]/10 shadow-sm flex items-center justify-center text-[#EA4335] hover:scale-105 transition-transform">
                            <GoogleIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Google Pixel Collection</h2>
                            <p className="text-xs text-[#1B1B5E]/40 font-black uppercase tracking-widest mt-1">Pure Android Experience</p>
                          </div>
                        </div>
                        <div className="px-5 py-2 bg-[#EA4335]/5 border border-[#EA4335]/10 rounded-full text-[10px] font-black text-[#EA4335] uppercase tracking-widest shadow-sm">
                          {googleProducts.length} Items Available
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {googleProducts.map((product) => (
                          <ProductCard key={product.id} product={product} isNew={isNew} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Other Products Section */}
                  {slug === "laptops" && hpProducts.length > 0 && activeBrand === "hp" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-[#1B1B5E]/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-[#0096D6]/5 border border-[#0096D6]/10 shadow-sm flex items-center justify-center text-[#0096D6] hover:scale-105 transition-transform">
                            <span className="font-black text-xs tracking-wider">hp</span>
                          </div>
                          <div>
                            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">HP Collection</h2>
                            <p className="text-xs text-[#1B1B5E]/40 font-black uppercase tracking-widest mt-1">Premium Envy & Spectre</p>
                          </div>
                        </div>
                        <div className="px-5 py-2 bg-[#0096D6]/5 border border-[#0096D6]/10 rounded-full text-[10px] font-black text-[#0096D6] uppercase tracking-widest shadow-sm">
                          {hpProducts.length} Items Available
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {hpProducts.map((product) => (
                          <ProductCard key={product.id} product={product} isNew={isNew} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dell Section */}
                  {slug === "laptops" && dellProducts.length > 0 && activeBrand === "dell" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-[#1B1B5E]/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-[#007DB8]/5 border border-[#007DB8]/10 shadow-sm flex items-center justify-center text-[#007DB8] hover:scale-105 transition-transform">
                            <span className="font-black text-xs tracking-wider">DELL</span>
                          </div>
                          <div>
                            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Dell Collection</h2>
                            <p className="text-xs text-[#1B1B5E]/40 font-black uppercase tracking-widest mt-1">Powerful XPS & Inspiron</p>
                          </div>
                        </div>
                        <div className="px-5 py-2 bg-[#007DB8]/5 border border-[#007DB8]/10 rounded-full text-[10px] font-black text-[#007DB8] uppercase tracking-widest shadow-sm">
                          {dellProducts.length} Items Available
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {dellProducts.map((product) => (
                          <ProductCard key={product.id} product={product} isNew={isNew} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Asus Section */}
                  {slug === "laptops" && asusProducts.length > 0 && activeBrand === "asus" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-[#1B1B5E]/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-[#00539B]/5 border border-[#00539B]/10 shadow-sm flex items-center justify-center text-[#00539B] hover:scale-105 transition-transform">
                            <span className="font-black text-xs tracking-wider">ASUS</span>
                          </div>
                          <div>
                            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Asus Collection</h2>
                            <p className="text-xs text-[#1B1B5E]/40 font-black uppercase tracking-widest mt-1">ZenBook & VivoBook</p>
                          </div>
                        </div>
                        <div className="px-5 py-2 bg-[#00539B]/5 border border-[#00539B]/10 rounded-full text-[10px] font-black text-[#00539B] uppercase tracking-widest shadow-sm">
                          {asusProducts.length} Items Available
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {asusProducts.map((product) => (
                          <ProductCard key={product.id} product={product} isNew={isNew} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gaming Section */}
                  {slug === "laptops" && gamingProducts.length > 0 && activeBrand === "gaming" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-[#1B1B5E]/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-[#E51400]/5 border border-[#E51400]/10 shadow-sm flex items-center justify-center text-[#E51400] hover:scale-105 transition-transform">
                            <Zap className="w-6 h-6" />
                          </div>
                          <div>
                            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Gaming Collection</h2>
                            <p className="text-xs text-[#1B1B5E]/40 font-black uppercase tracking-widest mt-1">ROG, Alienware, Razer</p>
                          </div>
                        </div>
                        <div className="px-5 py-2 bg-[#E51400]/5 border border-[#E51400]/10 rounded-full text-[10px] font-black text-[#E51400] uppercase tracking-widest shadow-sm">
                          {gamingProducts.length} Items Available
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {gamingProducts.map((product) => (
                          <ProductCard key={product.id} product={product} isNew={isNew} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Oraimo Section */}
                  {(slug === "smart_watches" || slug === "earbuds") && oraimoProducts.length > 0 && activeBrand === "oraimo" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-[#1B1B5E]/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-[#7BB833]/5 border border-[#7BB833]/10 shadow-sm flex items-center justify-center text-[#7BB833] hover:scale-105 transition-transform">
                            <span className="font-black text-xs tracking-wider">ORMO</span>
                          </div>
                          <div>
                            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Oraimo Collection</h2>
                            <p className="text-xs text-[#1B1B5E]/40 font-black uppercase tracking-widest mt-1">Smart Accessories</p>
                          </div>
                        </div>
                        <div className="px-5 py-2 bg-[#7BB833]/5 border border-[#7BB833]/10 rounded-full text-[10px] font-black text-[#7BB833] uppercase tracking-widest shadow-sm">
                          {oraimoProducts.length} Items Available
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {oraimoProducts.map((product) => (
                          <ProductCard key={product.id} product={product} isNew={isNew} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Oppo Section */}
                  {slug === "earbuds" && oppoProducts.length > 0 && activeBrand === "oppo" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-[#1B1B5E]/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-[#0F8A55]/5 border border-[#0F8A55]/10 shadow-sm flex items-center justify-center text-[#0F8A55] hover:scale-105 transition-transform">
                            <span className="font-black text-xs tracking-wider">OPPO</span>
                          </div>
                          <div>
                            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Oppo Collection</h2>
                            <p className="text-xs text-[#1B1B5E]/40 font-black uppercase tracking-widest mt-1">Smart Audio</p>
                          </div>
                        </div>
                        <div className="px-5 py-2 bg-[#0F8A55]/5 border border-[#0F8A55]/10 rounded-full text-[10px] font-black text-[#0F8A55] uppercase tracking-widest shadow-sm">
                          {oppoProducts.length} Items Available
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {oppoProducts.map((product) => (
                          <ProductCard key={product.id} product={product} isNew={isNew} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Anker Section */}
                  {slug === "earbuds" && ankerProducts.length > 0 && activeBrand === "anker" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-[#1B1B5E]/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-[#1992D4]/5 border border-[#1992D4]/10 shadow-sm flex items-center justify-center text-[#1992D4] hover:scale-105 transition-transform">
                            <span className="font-black text-xs tracking-wider">ANKR</span>
                          </div>
                          <div>
                            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Anker Collection</h2>
                            <p className="text-xs text-[#1B1B5E]/40 font-black uppercase tracking-widest mt-1">Soundcore Audio</p>
                          </div>
                        </div>
                        <div className="px-5 py-2 bg-[#1992D4]/5 border border-[#1992D4]/10 rounded-full text-[10px] font-black text-[#1992D4] uppercase tracking-widest shadow-sm">
                          {ankerProducts.length} Items Available
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {ankerProducts.map((product) => (
                          <ProductCard key={product.id} product={product} isNew={isNew} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Realme Section */}
                  {slug === "earbuds" && realmeProducts.length > 0 && activeBrand === "realme" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-[#1B1B5E]/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-[#FBBB00]/5 border border-[#FBBB00]/10 shadow-sm flex items-center justify-center text-[#FBBB00] hover:scale-105 transition-transform">
                            <span className="font-black text-xs tracking-wider">RLME</span>
                          </div>
                          <div>
                            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Realme Collection</h2>
                            <p className="text-xs text-[#1B1B5E]/40 font-black uppercase tracking-widest mt-1">Realme Buds</p>
                          </div>
                        </div>
                        <div className="px-5 py-2 bg-[#FBBB00]/5 border border-[#FBBB00]/10 rounded-full text-[10px] font-black text-[#FBBB00] uppercase tracking-widest shadow-sm">
                          {realmeProducts.length} Items Available
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {realmeProducts.map((product) => (
                          <ProductCard key={product.id} product={product} isNew={isNew} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fitbit Section */}
                  {slug === "smart_watches" && fitbitProducts.length > 0 && activeBrand === "fitbit" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-[#1B1B5E]/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-[#00B0B9]/5 border border-[#00B0B9]/10 shadow-sm flex items-center justify-center text-[#00B0B9] hover:scale-105 transition-transform">
                            <span className="font-black text-xs tracking-wider">FIT</span>
                          </div>
                          <div>
                            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Fitbit Collection</h2>
                            <p className="text-xs text-[#1B1B5E]/40 font-black uppercase tracking-widest mt-1">Health & Fitness</p>
                          </div>
                        </div>
                        <div className="px-5 py-2 bg-[#00B0B9]/5 border border-[#00B0B9]/10 rounded-full text-[10px] font-black text-[#00B0B9] uppercase tracking-widest shadow-sm">
                          {fitbitProducts.length} Items Available
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {fitbitProducts.map((product) => (
                          <ProductCard key={product.id} product={product} isNew={isNew} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Xiaomi Section */}
                  {slug === "smart_watches" && xiaomiProducts.length > 0 && activeBrand === "xiaomi" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-[#1B1B5E]/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-[#FF6900]/5 border border-[#FF6900]/10 shadow-sm flex items-center justify-center text-[#FF6900] hover:scale-105 transition-transform">
                            <span className="font-black text-xs tracking-wider">MI</span>
                          </div>
                          <div>
                            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Xiaomi Collection</h2>
                            <p className="text-xs text-[#1B1B5E]/40 font-black uppercase tracking-widest mt-1">Amazfit Series</p>
                          </div>
                        </div>
                        <div className="px-5 py-2 bg-[#FF6900]/5 border border-[#FF6900]/10 rounded-full text-[10px] font-black text-[#FF6900] uppercase tracking-widest shadow-sm">
                          {xiaomiProducts.length} Items Available
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {xiaomiProducts.map((product) => (
                          <ProductCard key={product.id} product={product} isNew={isNew} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Accessories Sections */}
                  {slug === "accessories" && casesProducts.length > 0 && activeBrand === "cases" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-[#1B1B5E]/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div>
                            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Silicon Phone Cases</h2>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {casesProducts.map((product) => (
                          <ProductCard key={product.id} product={product} isNew={isNew} />
                        ))}
                      </div>
                    </div>
                  )}
                  {slug === "accessories" && protectorsProducts.length > 0 && activeBrand === "protectors" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-[#1B1B5E]/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div>
                            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Screen Protectors</h2>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {protectorsProducts.map((product) => (
                          <ProductCard key={product.id} product={product} isNew={isNew} />
                        ))}
                      </div>
                    </div>
                  )}
                  {slug === "accessories" && chargersProducts.length > 0 && activeBrand === "chargers" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-[#1B1B5E]/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div>
                            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Chargers & Cables</h2>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {chargersProducts.map((product) => (
                          <ProductCard key={product.id} product={product} isNew={isNew} />
                        ))}
                      </div>
                    </div>
                  )}
                  {slug === "accessories" && powerBanksProducts.length > 0 && activeBrand === "power_banks" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-[#1B1B5E]/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div>
                            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Power Banks</h2>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {powerBanksProducts.map((product) => (
                          <ProductCard key={product.id} product={product} isNew={isNew} />
                        ))}
                      </div>
                    </div>
                  )}
                  {slug === "accessories" && strapsProducts.length > 0 && activeBrand === "straps" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-[#1B1B5E]/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div>
                            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Smartwatch Straps</h2>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {strapsProducts.map((product) => (
                          <ProductCard key={product.id} product={product} isNew={isNew} />
                        ))}
                      </div>
                    </div>
                  )}
                  {slug === "accessories" && speakersProducts.length > 0 && activeBrand === "speakers" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-[#1B1B5E]/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div>
                            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Bluetooth Speakers</h2>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {speakersProducts.map((product) => (
                          <ProductCard key={product.id} product={product} isNew={isNew} />
                        ))}
                      </div>
                    </div>
                  )}
                  {slug === "accessories" && bagsProducts.length > 0 && activeBrand === "bags" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-[#1B1B5E]/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div>
                            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Laptop Bags</h2>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {bagsProducts.map((product) => (
                          <ProductCard key={product.id} product={product} isNew={isNew} />
                        ))}
                      </div>
                    </div>
                  )}
                  {slug === "accessories" && stylusProducts.length > 0 && activeBrand === "stylus" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-[#1B1B5E]/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div>
                            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Stylus Pens</h2>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stylusProducts.map((product) => (
                          <ProductCard key={product.id} product={product} isNew={isNew} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Other Products Section */}
                  {otherProducts.length > 0 && activeBrand !== "apple" && activeBrand !== "samsung" && activeBrand !== "google" && slug !== "accessories" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-[#1B1B5E]/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-[#1B1B5E]/5 shadow-sm flex items-center justify-center text-[#1B1B5E]/40">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Other Premium Brands</h2>
                            <p className="text-xs text-[#1B1B5E]/40 font-black uppercase tracking-widest mt-1">Certified Pre-Owned Standards</p>
                          </div>
                        </div>
                        <div className="px-5 py-2 bg-[#1B1B5E]/5 border border-[#1B1B5E]/5 rounded-full text-[10px] font-black text-[#1B1B5E]/40 uppercase tracking-widest shadow-sm">
                          {otherProducts.length} Items Available
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {otherProducts.map((product) => (
                          <ProductCard key={product.id} product={product} isNew={isNew} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} isNew={isNew} />
                  ))}
                </div>
              )
            ) : (
              <div className="py-32 text-center bg-white rounded-[3rem] border border-[#1B1B5E]/5">
                <Icon className="w-16 h-16 text-[#1B1B5E]/5 mx-auto mb-6" />
                <h2 className="text-2xl font-black text-[#1B1B5E] uppercase mb-4">No Products Available</h2>
                <p className="text-[#1B1B5E]/40 font-medium mb-8">We are currently updating our {slug} inventory.</p>
                <Link href="/" className="inline-block px-10 py-4 bg-[#1B1B5E] text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#00AEEF] transition-all">
                  Return to Catalog
                </Link>
              </div>
            )}
          </>
        )}

        {/* Trust Points */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-[#1B1B5E]/5 pt-20">
          {[
            { title: "Authentication", desc: "Every unit is verified against global serial databases.", icon: Award },
            { title: "Warranty", desc: "Full coverage on brand new and extended support on used.", icon: Zap },
            { title: "Support", desc: "Lagos-based technical support for all our customers.", icon: Smartphone }
          ].map((item, i) => (
            <div key={i} className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-[#00AEEF]/10 flex items-center justify-center shrink-0">
                <item.icon className="w-6 h-6 text-[#00AEEF]" />
              </div>
              <div>
                <h4 className="font-black text-[#1B1B5E] uppercase tracking-tighter mb-2">{item.title}</h4>
                <p className="text-[#1B1B5E]/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

