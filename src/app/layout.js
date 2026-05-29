import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Inter } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import ChatWidget from "@/components/ChatWidget";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Ekeson Gadget | Premium Technology",
  description: "Nigeria's most trusted destination for genuine brand new and Grade-A UK used electronics.",
  keywords: "gadgets, electronics, premium tech, smartphones, laptops, fast delivery, Nigeria, Ekeson Gadget",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col bg-[#FFFDF5]`}>
        <CartProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
