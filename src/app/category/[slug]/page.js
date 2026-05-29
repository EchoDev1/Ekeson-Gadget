"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronRight, Award, Zap, Smartphone, Laptop, Tablet, Watch, Headphones, Package, Gamepad2, Drone } from "lucide-react";

const categoryData = {
  phones: {
    title: "Phones",
    icon: Smartphone,
    subtitle: "Mobile Excellence",
    portals: [
      { name: "Direct / Brand New", path: "/category/phones/new", image: "/images/phones_brand_new.png", subtitle: "Factory Sealed", description: "Straight from the manufacturer. Full iPhone warranty included." },
      { name: "Highest Grade UK Used", path: "/category/phones/uk-used", image: "/images/phones_uk_used.png", subtitle: "iPhone & Samsung Only", description: "Grade A+++. Pristine condition, rigorously tested." }
    ]
  },
  laptops: {
    title: "Laptops",
    icon: Laptop,
    subtitle: "Pro Performance",
    portals: [
      { name: "Direct / Brand New", path: "/category/laptops/new", image: "/images/laptops_brand_new.png", subtitle: "Factory Sealed", description: "Latest models from HP, Dell, Apple & more." },
      { name: "Highest Grade UK Used", path: "/category/laptops/uk-used", image: "/images/laptops_uk_used.png", subtitle: "Premium Brands", description: "HP, Dell, Apple & More. Corporate grade hardware." }
    ]
  },
  pads: {
    title: "iPads",
    icon: Tablet,
    subtitle: "Creative Power",
    portals: [
      { name: "Direct / Brand New", path: "/category/pads/new", image: "/images/pads_brand_new.png", subtitle: "M-Series Power", description: "Factory sealed iPads with full manufacturer support." },
      { name: "Highest Grade UK Used", path: "/category/pads/uk-used", image: "/images/pads_uk_used.png", subtitle: "iPad & Tab Only", description: "Tested for battery health and screen perfection." }
    ]
  },
  smart_watches: {
    title: "Smart Watches",
    icon: Watch,
    subtitle: "Time Reimagined",
    portals: [
      { name: "Direct / Brand New", path: "/category/smart_watches/new", image: "/images/watches_brand_new.png", subtitle: "Sealed Excellence", description: "Brand new wearables in original boxed condition." },
      { name: "Highest Grade UK Used", path: "/category/smart_watches/uk-used", image: "/images/watches_uk_used.png", subtitle: "Apple & Samsung Only", description: "Premium wearables in near-new condition." }
    ]
  },
  earbuds: {
    title: "Earbuds",
    icon: Headphones,
    subtitle: "Pure Sound",
    portals: [
      { name: "Direct / Brand New", path: "/category/earbuds/new", image: "/images/earbuds_brand_new.png", subtitle: "Pure Sound", description: "Brand new AirPods and buds in sealed packaging." },
      { name: "Highest Grade UK Used", path: "/category/earbuds/uk-used", image: "/images/earbuds_uk_used.png", subtitle: "AirPods & Buds Only", description: "Sanitized and tested for acoustic perfection." }
    ]
  },
  accessories: {
    title: "Accessories",
    icon: Package,
    subtitle: "Essential Add-ons",
    portals: [
      { name: "Premium Accessories", path: "/category/accessories/new", image: "/images/home_accessories.png", subtitle: "Complete Your Setup", description: "Cases, protectors, chargers, cables, and more." }
    ]
  },
  playstation: {
    title: "Sony PlayStation",
    icon: Gamepad2,
    subtitle: "Next-Gen Gaming",
    portals: [
      { name: "Direct / Brand New", path: "/category/playstation/new", image: "/images/playstation_brand_new.png", subtitle: "Factory Sealed", description: "Sony PlayStation. Brand new in sealed packaging." },
      { name: "Highest Grade UK Used", path: "/category/playstation/uk-used", image: "/images/playstation_uk_used.png", subtitle: "Pristine Condition", description: "Tested and verified for ultimate gaming performance." }
    ]
  },
  drones: {
    title: "Drones",
    icon: Drone,
    subtitle: "Aerial Mastery",
    portals: [
      { name: "Direct / Brand New", path: "/category/drones/new", image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80", subtitle: "Factory Sealed", description: "DJI & premium drones. Brand new in sealed packaging." }
    ]
  }
};

export default function CategoryPage() {
  const { slug } = useParams();
  const category = categoryData[slug];

  if (!category) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F3E9]">
      <div className="text-center">
        <h1 className="text-4xl font-black text-[#1B1B5E]">Category Not Found</h1>
        <Link href="/" className="mt-8 inline-block text-[#00AEEF] font-black uppercase tracking-widest">Back to Home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F3E9]">
      {/* Header Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#1B1B5E]/40 hover:text-[#1B1B5E] transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Back to Departments</span>
          </Link>
          
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 rounded-[2.5rem] bg-white border border-[#1B1B5E]/5 shadow-sm flex items-center justify-center text-[#1B1B5E]">
              <category.icon className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-7xl md:text-[9rem] font-black text-[#1B1B5E] uppercase tracking-tighter leading-none">{category.title}</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Selection Grid */}
      <section className="pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {category.portals.map((portal, idx) => (
              <Link 
                key={idx} 
                href={portal.path} 
                className="group relative overflow-hidden rounded-[3rem] bg-white border border-[#1B1B5E]/5 shadow-xl transition-all duration-700 aspect-[4/5] md:aspect-square flex flex-col justify-end p-10 md:p-16 hover:translate-y-[-8px]"
              >
                <div className="absolute inset-0">
                  <Image 
                    src={portal.image} 
                    alt={portal.name} 
                    fill 
                    className="object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B5E] via-[#1B1B5E]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                </div>

                <div className="relative z-10 space-y-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                  <div className="flex items-center gap-3">
                    <div className="h-px w-10 bg-[#00AEEF]" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{portal.subtitle}</span>
                  </div>
                  
                  <div>
                    <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-4">
                      {portal.path.includes("new") ? (
                        <>DIRECT /<br /><span className="text-[#00AEEF]">BRAND NEW</span></>
                      ) : (
                        <>HIGHEST GRADE<br /><span className="text-[#00AEEF]">UK USED</span></>
                      )}
                    </h3>
                    <p className="text-white/60 text-lg font-medium tracking-tight max-w-sm">
                      {portal.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-6">
                    <div className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest group-hover:bg-[#00AEEF] group-hover:border-[#00AEEF] transition-all duration-500">
                      View Collection
                    </div>
                    {portal.name.includes("UK Used") && (
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-[#00AEEF]" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Premium Grade</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Decorative background number */}
                <span className="absolute top-10 right-10 text-[12rem] font-black text-white/5 pointer-events-none leading-none">0{idx + 1}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-20 bg-[#1B1B5E] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-12 md:gap-24">
            {[
              { label: "Verification", val: "50-Point Check", icon: Award },
              { label: "Warranty", val: "Up to 12 Months", icon: Zap },
              { label: "Delivery", val: "Nationwide 🇳🇬", icon: Smartphone }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <item.icon className="w-8 h-8 text-[#00AEEF]" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00AEEF] mb-1">{item.label}</p>
                  <p className="text-xl font-black">{item.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
