import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const formatPrice = (price) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price);

  return (
    <div className="group bg-white rounded-[2rem] overflow-hidden border border-[#1B1B5E]/5 hover:border-[#00AEEF]/20 transition-all duration-500 hover:shadow-[0_20px_50px_-20px_rgba(27,27,94,0.15)] flex flex-col p-2">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.8rem] bg-[#F8F9FA] flex items-center justify-center p-4">
        <Image
          src={product.image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80'}
          alt={product.name}
          fill
          className="object-contain group-hover:scale-110 transition-transform duration-700 ease-in-out p-4"
        />
      </div>

      <div className="p-6 flex flex-col flex-1">
        {product.isNew && (
          <div className="mb-3 inline-block self-start bg-[#1B1B5E]/5 text-[#1B1B5E] text-[10px] font-black px-3 py-1 rounded-md tracking-widest uppercase border border-[#1B1B5E]/10">
            NEW / SEALED
          </div>
        )}
        <div className="flex justify-between items-start mb-3">
          <Link href={`/products/${product.id}`} className="block flex-1 pr-2">
            <h3 className="font-black text-[#1B1B5E] hover:text-[#00AEEF] transition-colors line-clamp-1 text-base uppercase tracking-tight">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center space-x-1 text-[#00AEEF] mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < 4 ? 'fill-current' : 'opacity-20'}`} />
          ))}
          <span className="text-[10px] text-[#1B1B5E]/40 font-bold ml-1">4.0</span>
        </div>

        <div className="flex items-end justify-between mt-auto pt-4 border-t border-[#1B1B5E]/5">
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">Price</p>
            <p className="text-xl font-black text-[#1B1B5E] tracking-tighter">{formatPrice(product.price)}</p>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="bg-[#1B1B5E] hover:bg-[#00AEEF] text-white p-4 rounded-2xl transition-all duration-300 group-hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
