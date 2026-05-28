"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Laptop, Smartphone, Tablet, ChevronRight, Watch, Headphones, ShieldCheck, Package } from "lucide-react";
import { SealBadge } from "@/components/ui/BrandIdentity";

const categories = [
  { id: "phones", title: "Phones", icon: Smartphone, image: "/images/luxury_phones_black.png" },
  { id: "laptops", title: "Laptops", icon: Laptop, image: "/images/luxury_laptop.png" },
  { id: "pads", title: "iPads", icon: Tablet, image: "/images/luxury_ipad.png" },
  { id: "smart_watches", title: "Smart Watches", icon: Watch, image: "/images/luxury_watch.png" },
  { id: "earbuds", title: "Earbuds", icon: Headphones, image: "/images/luxury_earbuds.jpg" },
  { id: "accessories", title: "Accessories", icon: Package, image: "/images/home_accessories.png" }
];

const CategorySection = ({ title, id, icon: Icon, image }) => (
  <section className="py-20 border-t border-[#1B1B5E]/5">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1B1B5E]/5 flex items-center justify-center text-[#1B1B5E]">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">{title}</h2>
              <div className="h-1 w-12 bg-[#00AEEF] mt-1" />
            </div>
          </div>
          <p className="text-lg text-[#1B1B5E]/60 max-w-md font-medium leading-relaxed">
            Discover our curated collection of {title.toLowerCase()}. From the latest releases to certified pre-owned excellence.
          </p>
          <Link 
            href={`/category/${id}`} 
            className="inline-flex items-center gap-3 bg-[#1B1B5E] text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#00AEEF] transition-all duration-500 shadow-xl"
          >
            Enter {title} Portal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="relative w-full aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-2xl group">
          <Image 
            src={image} 
            alt={title} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority={id === 'phones'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B5E]/20 to-transparent" />
        </div>
      </div>
    </div>
  </section>
);

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7F3E9]">
      
      {/* Original Hero Section Style */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        <div className="absolute top-8 right-8 md:top-12 md:right-12 z-20">
          <SealBadge className="w-24 h-24 md:w-32 md:h-32" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <div className="inline-flex items-center space-x-3 bg-white border border-[#1B1B5E]/5 px-4 py-2 rounded-full shadow-sm">
              <span className="text-[10px] font-black text-[#1B1B5E] uppercase tracking-[0.2em]">Authentic Technology 🇳🇬</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black text-[#1B1B5E] tracking-tighter leading-[0.9]">
              PREMIUM <span className="text-[#00AEEF]">TECH</span><br />
              SIMPLE <span className="opacity-20">ACCESS</span>
            </h1>

            <p className="text-lg md:text-xl text-[#1B1B5E]/60 max-w-2xl mx-auto font-medium leading-relaxed">
              Nigeria&apos;s most trusted destination for genuine brand new and Grade-A UK used electronics. 
              Verified standards, transparent pricing.
            </p>

            {/* Promotional Flash Banner */}
            <div className="w-[100vw] relative left-1/2 -translate-x-1/2 overflow-hidden mt-4 pointer-events-none h-10 flex items-center">
              <div className="inline-block animate-[slide-left_12s_linear_infinite] whitespace-nowrap">
                <div className="inline-flex items-center gap-2 bg-[#1B1B5E]/90 backdrop-blur-md text-white py-1 px-4 rounded-full border border-[#00AEEF]/30 shadow-[0_0_10px_rgba(0,174,239,0.3)]">
                  <span className="text-[10px] animate-bounce">🎁</span>
                  <span className="font-black uppercase tracking-widest text-[9px] md:text-[10px]">
                    In every purchase you get a <span className="text-[#00AEEF]">free accessories!</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Link
                href="/products"
                className="w-full sm:w-auto px-12 py-5 bg-[#1B1B5E] text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#00AEEF] transition-all duration-500 shadow-2xl hover:shadow-[#00AEEF]/20"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#1B1B5E]/10 to-transparent" />
      </section>

      {/* Categories Sections */}
      {categories.map((cat) => (
        <CategorySection key={cat.id} {...cat} />
      ))}

      {/* Trust Section */}
      <section className="py-24 bg-[#1B1B5E] text-white overflow-hidden relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-8">
                GENUINE<br />
                <span className="text-[#00AEEF]">SPECIFICATIONS</span>
              </h2>
              <p className="text-[#F8F9FA]/60 text-lg mb-12 max-w-md">
                We verify every product specification so you get exactly what you pay for. No aftermarket clones, no refurbished tricks.
              </p>
              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: "Warranty", val: "1-Years" },
                  { label: "Verification", val: "Serial Check" },
                  { label: "Origin", val: "Direct Global" },
                  { label: "Support", val: "Lagos/Abuja Based" }
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-[#00AEEF] text-[10px] font-black uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-xl font-black">{item.val}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl">
              <Image 
                src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80" 
                alt="Verification Process" 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-[#00AEEF] flex items-center justify-center animate-pulse shadow-[0_0_50px_rgba(0,174,239,0.5)]">
                  <ShieldCheck className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="py-32 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black text-[#1B1B5E] tracking-tighter mb-8 uppercase">
            Ready to upgrade?
          </h2>
          <Link 
            href="/auth/register" 
            className="inline-flex items-center gap-3 text-[#00AEEF] font-black uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all duration-500"
          >
            Create Your Account Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
