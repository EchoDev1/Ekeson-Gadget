"use client";
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ShoppingCart, User, Menu, Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/BrandIdentity';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [headerLinks, setHeaderLinks] = useState([
    { label: "Phones", url: "/category/phones" },
    { label: "Laptops", url: "/category/laptops" },
    { label: "Pads", url: "/category/pads" },
    { label: "Accessories", url: "/category/accessories" },
    { label: "PlayStation", url: "/category/playstation" },
    { label: "Drones", url: "/category/drones" }
  ]);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState(null);
  const router = useRouter();
  const { cartCount } = useCart();

  // Fetch settings safely from the client-side using useEffect
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await supabase.from('settings').select('header_links').eq('id', 1).single();
        if (data?.header_links) {
          setHeaderLinks(data.header_links);
        }
      } catch (err) {}
    };
    loadSettings();

    // Check Auth Session
    const checkUser = async (currentSession) => {
      if (!currentSession?.user?.id) {
        setSession(null);
        setProfile(null);
        setIsAdmin(false);
        return;
      }
      setSession(currentSession);
      try {
        const { data } = await supabase.from('profiles').select('full_name, role').eq('id', currentSession.user.id).single();
        setProfile(data);
        setIsAdmin(data?.role === 'admin');
      } catch(err) {}
    };

    supabase.auth.getSession().then(({ data: { session } }) => checkUser(session));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkUser(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const executeSearch = (query) => {
    setSearchQuery(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#FFFDF5]/90 backdrop-blur-md border-b border-[#1B1B5E]/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Component */}
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <Logo className="h-10 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-10">
              {headerLinks.map((item, i) => (
                <Link 
                  key={i} 
                  href={item.url} 
                  className="text-[#1B1B5E]/70 hover:text-[#1B1B5E] transition-colors text-sm font-bold uppercase tracking-widest"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-[#1B1B5E]/60 hover:text-[#1B1B5E] transition-colors focus:outline-none"
              >
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
              
              {session ? (
                <div className="flex items-center gap-4">
                  {isAdmin && (
                    <Link href="/admin" className="bg-[#1B1B5E] text-[#00AEEF] text-[10px] font-black px-2 py-1 rounded tracking-widest uppercase hover:bg-[#00AEEF] hover:text-white transition-colors">
                      Admin Dashboard
                    </Link>
                  )}
                  <div className="flex items-center gap-2 text-sm font-bold text-[#1B1B5E]">
                    <div className="w-8 h-8 rounded-full bg-[#1B1B5E] text-white flex items-center justify-center font-black">
                      {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="hidden lg:inline">{profile?.full_name?.split(' ')[0] || 'My Account'}</span>
                  </div>
                  <button onClick={() => supabase.auth.signOut()} className="text-[10px] font-black text-[#1B1B5E]/40 hover:text-red-500 uppercase tracking-widest transition-colors">
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login" className="text-[#1B1B5E] font-bold text-sm hover:text-[#00AEEF] transition-colors">
                    LOGIN
                  </Link>
                  <Link href="/signup" className="text-[#1B1B5E] font-bold text-sm border-2 border-[#1B1B5E] px-4 py-1.5 rounded-full hover:bg-[#1B1B5E] hover:text-white transition-all">
                    SIGN UP
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-[#1B1B5E]/60 hover:text-[#1B1B5E] transition-colors focus:outline-none"
              >
                <Search className="w-5 h-5" />
              </button>
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
              {headerLinks.map((item, i) => (
                <Link 
                  key={i} 
                  href={item.url} 
                  className="block text-xl font-black text-[#1B1B5E] uppercase tracking-tighter"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-6 border-t border-[#1B1B5E]/5 space-y-4">
                {session ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1B1B5E]">{profile?.full_name?.split(' ')[0] || 'My Account'}</span>
                      {isAdmin && (
                        <Link href="/admin" className="bg-[#1B1B5E] text-[#00AEEF] text-[10px] font-black px-2 py-1 rounded tracking-widest uppercase" onClick={() => setIsMenuOpen(false)}>
                          Admin
                        </Link>
                      )}
                    </div>
                    <button onClick={() => { supabase.auth.signOut(); setIsMenuOpen(false); }} className="block w-full text-center py-4 border-2 border-red-500/20 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-colors">LOG OUT</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block w-full text-center py-4 bg-[#1B1B5E] text-white rounded-xl font-bold" onClick={() => setIsMenuOpen(false)}>LOGIN</Link>
                    <Link href="/signup" className="block w-full text-center py-4 border-2 border-[#1B1B5E] text-[#1B1B5E] rounded-xl font-bold" onClick={() => setIsMenuOpen(false)}>SIGN UP</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Full Screen Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl animate-in fade-in duration-300 flex flex-col items-center justify-start pt-32 px-4">
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="absolute top-8 right-8 text-[#1B1B5E] hover:text-[#00AEEF] transition-colors p-2"
          >
            <X className="w-8 h-8 md:w-12 md:h-12" />
          </button>
          
          <div className="w-full max-w-4xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 text-[#1B1B5E]/30" />
            <input 
              type="text"
              placeholder="Search by product name or brand..."
              className="w-full bg-transparent border-b-2 border-[#1B1B5E]/10 text-2xl md:text-5xl font-black text-[#1B1B5E] placeholder:text-[#1B1B5E]/20 pb-4 md:pb-6 pl-16 md:pl-24 focus:outline-none focus:border-[#00AEEF] transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              autoFocus
            />
            <div className="mt-8 flex flex-wrap gap-4 text-xs md:text-sm font-bold text-[#1B1B5E]/40 uppercase tracking-widest pl-4 md:pl-24">
              <span>Trending:</span>
              <button onClick={() => executeSearch('Apple')} className="hover:text-[#00AEEF] transition-colors">Apple</button>
              <button onClick={() => executeSearch('Samsung')} className="hover:text-[#00AEEF] transition-colors">Samsung</button>
              <button onClick={() => executeSearch('PlayStation')} className="hover:text-[#00AEEF] transition-colors">PlayStation</button>
              <button onClick={() => executeSearch('DJI')} className="hover:text-[#00AEEF] transition-colors">DJI</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
