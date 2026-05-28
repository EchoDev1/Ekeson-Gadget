import Image from "next/image";
import Link from "next/link";

const brands = [
  { name: 'Apple', image: '/brands/brand_apple_1779784861664.png', query: 'apple' },
  { name: 'Samsung', image: '/brands/brand_samsung_1779784875639.png', query: 'samsung' },
  { name: 'Google', image: '/brands/brand_google_1779784890155.png', query: 'google' },
  { name: 'HP', image: '/brands/brand_hp_1779785107499.png', query: 'hp' },
  { name: 'Dell', image: '/brands/brand_dell_1779785125175.png', query: 'dell' },
  { name: 'MacBook', image: '/brands/brand_macbook_1779785141033.png', query: 'macbook' },
  { name: 'Asus', image: '/brands/brand_asus_1779785157671.png', query: 'asus' },
  { name: 'Gaming', image: '/brands/brand_gaming_1779785172294.png', query: 'gaming' },
  { name: 'iPad', image: '/brands/brand_ipad_1779785991441.png', query: 'ipad' },
  { name: 'Galaxy Tab', image: '/brands/brand_galaxy_tab_1779786005063.png', query: 'galaxy tab' }
];

export default function BrandShowcase() {
  return (
    <div className="w-full py-12 bg-white border-y border-[#1B1B5E]/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter text-center">
          Featured <span className="text-[#00AEEF]">Brands</span>
        </h2>
      </div>
      
      {/* Horizontal scrolling container */}
      <div className="w-full overflow-hidden relative">
        {/* Left/Right fading edges */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        <div className="flex overflow-x-auto gap-6 px-8 snap-x snap-mandatory pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Hide webkit scrollbar */}
          <style dangerouslySetInnerHTML={{__html: `
            div::-webkit-scrollbar { display: none; }
          `}} />
          
          {brands.map((brand, idx) => (
            <Link href={`/products`} key={idx} className="snap-center shrink-0 w-48 group">
              <div className="bg-[#F5F5F7] rounded-[2rem] p-4 aspect-square flex flex-col items-center justify-center gap-4 transition-all duration-300 group-hover:bg-[#1B1B5E] group-hover:scale-105 border border-[#1B1B5E]/5">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                  <Image 
                    src={brand.image} 
                    alt={brand.name} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                </div>
                <span className="font-black text-sm uppercase tracking-widest text-[#1B1B5E] group-hover:text-white transition-colors text-center">
                  {brand.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
