"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/ChatWidget";

export default function GlobalLayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Hide main store elements on any admin routes
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      
      <main className="flex-grow">
        {children}
      </main>
      
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <ChatWidget />}
    </>
  );
}
