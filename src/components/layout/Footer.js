"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

const FacebookIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const TwitterIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

import { Logo } from '@/components/ui/BrandIdentity';
import { supabase } from '@/lib/supabase';

export default function Footer() {
  const [settings, setSettings] = useState(null);
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setSettings(data);
          }
        }
      } catch (error) {
        console.error("Error fetching footer settings:", error);
      }
    };
    loadSettings();
  }, []);
  const hqAddress = settings?.footer_hq_address || "Lagos/Abuja Nigeria";
  const hqPhone = settings?.footer_hq_phone || "+234 814 852 7697";
  const hqEmail = settings?.footer_hq_email || "office@ekesongroup.com";

  const brandText = settings?.footer_brand_text || "Nigeria's trusted source for premium global technology. Professional service, verified specifications, and secure logistics.";

  const catalogLinks = settings?.footer_catalog_links || [
    { label: "Smartphones", url: "/category/phones" },
    { label: "Laptops", url: "/category/laptops" },
    { label: "Tablets & Pads", url: "/category/pads" },
    { label: "Accessories", url: "/category/accessories" }
  ];

  const serviceLinks = settings?.footer_service_links || [
    { label: "Order Tracking", url: "/track-order" },
    { label: "Technical Support", url: "/support" },
    { label: "Warranty Policy", url: "/warranty" },
    { label: "Contact Office", url: "/contact" }
  ];
  
  const policyLinks = settings?.footer_policy_links || [
    { label: "Delivery/Shipping Policy", url: "/delivery-shipping" },
    { label: "Terms and Conditions", url: "/terms" },
    { label: "Privacy Policy", url: "/privacy" },
    { label: "Refund Policy", url: "/refund" }
  ];

  return (
    <footer className="bg-[#FFFDF5] border-t border-[#1B1B5E]/5 pt-20 pb-12 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-8">
            <Logo className="h-8" showText={true} />
            <p className="text-[#1B1B5E]/50 text-sm leading-relaxed font-medium">
              {brandText}
            </p>
            <div className="flex space-x-6">
              {settings?.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="text-[#1B1B5E]/40 hover:text-[#00AEEF] transition-colors"><FacebookIcon /></a>
              )}
              {settings?.social_twitter && (
                <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="text-[#1B1B5E]/40 hover:text-[#00AEEF] transition-colors"><TwitterIcon /></a>
              )}
              {settings?.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="text-[#1B1B5E]/40 hover:text-[#00AEEF] transition-colors"><InstagramIcon /></a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#1B1B5E] font-black text-xs uppercase tracking-widest mb-8">Catalog</h3>
            <ul className="space-y-4">
              {catalogLinks.map((link, i) => (
                <li key={i}><Link href={link.url} className="text-[#1B1B5E]/60 hover:text-[#1B1B5E] transition-colors text-sm font-bold">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-[#1B1B5E] font-black text-xs uppercase tracking-widest mb-8">Service</h3>
            <ul className="space-y-4">
              {serviceLinks.map((link, i) => (
                <li key={i}><Link href={link.url} className="text-[#1B1B5E]/60 hover:text-[#1B1B5E] transition-colors text-sm font-bold">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h3 className="text-[#1B1B5E] font-black text-xs uppercase tracking-widest mb-8">Policy</h3>
            <ul className="space-y-4">
              {policyLinks.map((link, i) => (
                <li key={i}><Link href={link.url} className="text-[#1B1B5E]/60 hover:text-[#1B1B5E] transition-colors text-sm font-bold">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#1B1B5E] font-black text-xs uppercase tracking-widest mb-8">Headquarters</h3>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <MapPin className="w-5 h-5 text-[#00AEEF] flex-shrink-0 mt-0.5" />
                <a href={`https://maps.google.com/?q=${encodeURIComponent(hqAddress)}`} target="_blank" rel="noopener noreferrer" className="text-[#1B1B5E]/70 text-sm font-bold hover:text-[#00AEEF] transition-colors">{hqAddress}</a>
              </li>
              <li className="flex items-center space-x-4">
                <Phone className="w-5 h-5 text-[#00AEEF] flex-shrink-0" />
                <a href={`tel:${hqPhone.replace(/\s+/g, '')}`} className="text-[#1B1B5E]/70 text-sm font-bold hover:text-[#00AEEF] transition-colors">{hqPhone}</a>
              </li>
              <li className="flex items-center space-x-4">
                <Mail className="w-5 h-5 text-[#00AEEF] flex-shrink-0" />
                <a href={`mailto:${hqEmail}`} className="text-[#1B1B5E]/70 text-sm font-bold hover:text-[#00AEEF] transition-colors">{hqEmail}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment methods */}
        <div className="border-t border-[#1B1B5E]/5 pt-12 mb-12">
          <div className="flex flex-wrap justify-center items-center gap-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            {["OPay", "Paystack", "Flutterwave", "Bank Transfer", "USSD"].map((method) => (
              <span key={method} className="text-[#1B1B5E] text-xs font-black uppercase tracking-[0.2em]">
                {method}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-[#1B1B5E]/30 text-[10px] font-black uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} Ekeson Gadgets. Nigeria 🇳🇬</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-[#1B1B5E] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#1B1B5E] transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
