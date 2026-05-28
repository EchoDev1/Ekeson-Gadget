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
  title: "Ekeson Group | Premium Technology",
  description: "Building Wealth Through Technology. Nigeria's premier source for genuine global electronics.",
  keywords: "gadgets, electronics, premium tech, smartphones, laptops, fast delivery, Nigeria, Ekeson Group",
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
