"use client";
import Link from 'next/link';
import { ShoppingCart, User, Menu, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '@/components/ui/BrandIdentity';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-[#FFFDF5]/90 backdrop-blur-md border-b border-[#1B1B5E]/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Component */}
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Logo className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            {['Phones', 'Laptops', 'Pads', 'Accessories', 'PlayStation'].map((item) => (
              <Link 
                key={item} 
                href={`/category/${item.toLowerCase()}`} 
                className="text-[#1B1B5E]/70 hover:text-[#1B1B5E] transition-colors text-sm font-bold uppercase tracking-widest"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-[#1B1B5E]/60 hover:text-[#1B1B5E] transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/cart" className="text-[#1B1B5E]/60 hover:text-[#1B1B5E] transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#00AEEF] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-black animate-in fade-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href="/auth/login" className="text-[#1B1B5E] font-bold text-sm border-2 border-[#1B1B5E] px-5 py-2 rounded-full hover:bg-[#1B1B5E] hover:text-white transition-all">
              LOGIN
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#1B1B5E] hover:opacity-70 focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#1B1B5E]/10 animate-in slide-in-from-top duration-300">
          <div className="px-6 py-8 space-y-6">
            {['Phones', 'Laptops', 'Pads', 'Accessories', 'PlayStation'].map((item) => (
              <Link 
                key={item} 
                href={`/category/${item.toLowerCase()}`} 
                className="block text-xl font-black text-[#1B1B5E] uppercase tracking-tighter"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <div className="pt-6 border-t border-[#1B1B5E]/5 space-y-4">
              <Link href="/auth/login" className="block w-full text-center py-4 bg-[#1B1B5E] text-white rounded-xl font-bold">LOGIN</Link>
              <Link href="/auth/register" className="block w-full text-center py-4 border-2 border-[#1B1B5E] text-[#1B1B5E] rounded-xl font-bold">SIGN UP</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
