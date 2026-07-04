import GlobalLayoutWrapper from "@/components/layout/GlobalLayoutWrapper";
import { Inter } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import MaintenanceWrapper from "@/components/MaintenanceWrapper";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Ekeson Gadgets | Premium Technology",
  description: "Nigeria's most trusted destination for genuine brand new and Grade-A UK used electronics.",
  keywords: "gadgets, electronics, premium tech, smartphones, laptops, fast delivery, Nigeria, Ekeson Gadgets",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col bg-[#FFFDF5]`}>
        <MaintenanceWrapper>
          <CartProvider>
            <GlobalLayoutWrapper>
              {children}
            </GlobalLayoutWrapper>
          </CartProvider>
        </MaintenanceWrapper>
      </body>
    </html>
  );
}
