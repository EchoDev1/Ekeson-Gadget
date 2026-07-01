"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  MessageSquare,
  Users,
  HelpCircle,
  LogOut,
  Loader2,
  ChevronRight
} from "lucide-react";

export default function AdminLayout({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      // Don't check on the old login page if it still exists
      if (pathname === '/admin/login') {
        router.replace('/login'); // Redirect to new unified login
        setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/login");
          return;
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', session.user.id)
          .single();

        if (profileData?.role === 'admin') {
          setIsAdmin(true);
          setProfile(profileData);
        } else {
          router.push("/"); // Normal users get booted to homepage
        }
      } catch (err) {
        router.push("/login");
      }
      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {}
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#00AEEF]" />
      </div>
    );
  }

  // If on login page, just render the children without sidebar
  if (pathname === '/admin/login') {
    return children;
  }

  // If not admin and somehow loading finished, don't render dashboard
  if (!isAdmin) return null;

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Live Chat", href: "/admin/chat", icon: MessageSquare },
    { name: "Support Inbox", href: "/admin/support", icon: HelpCircle },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#1B1B5E]/5 flex flex-col fixed inset-y-0 z-50">
        <div className="h-20 flex items-center px-8 border-b border-[#1B1B5E]/5">
          <Link href="/admin" className="text-2xl font-black text-[#1B1B5E] tracking-tighter uppercase">
            Ekeson <span className="text-[#00AEEF]">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? "bg-[#1B1B5E] text-white shadow-lg shadow-[#1B1B5E]/20" 
                    : "text-[#1B1B5E]/60 hover:bg-[#F5F5F7] hover:text-[#1B1B5E]"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[#00AEEF]" : "group-hover:text-[#00AEEF] transition-colors"}`} />
                <span className="font-bold tracking-wide text-sm">{item.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#1B1B5E]/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3.5 w-full rounded-2xl text-red-500 hover:bg-red-50 transition-colors group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-bold tracking-wide text-sm">Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-[#1B1B5E]/5 sticky top-0 z-40 flex items-center justify-between px-8">
          <h2 className="text-xl font-black text-[#1B1B5E] uppercase tracking-wider">
            {navigation.find(n => pathname === n.href || (pathname.startsWith(n.href) && n.href !== '/admin'))?.name || "Dashboard"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-[#1B1B5E]">{profile?.full_name || "Admin User"}</span>
              <span className="text-[10px] font-black text-[#00AEEF] uppercase tracking-widest">Superuser</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#1B1B5E] text-white flex items-center justify-center font-black">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : "A"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
