import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';

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

export default function Footer() {
  return (
    <footer className="bg-[#FFFDF5] border-t border-[#1B1B5E]/5 pt-20 pb-12 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          {/* Brand */}
          <div className="space-y-8">
            <Logo className="h-8" showText={true} />
            <p className="text-[#1B1B5E]/50 text-sm leading-relaxed font-medium">
              Nigeria&apos;s trusted source for premium global technology. Professional service, verified specifications, and secure logistics.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-[#1B1B5E]/40 hover:text-[#00AEEF] transition-colors"><FacebookIcon /></a>
              <a href="#" className="text-[#1B1B5E]/40 hover:text-[#00AEEF] transition-colors"><TwitterIcon /></a>
              <a href="#" className="text-[#1B1B5E]/40 hover:text-[#00AEEF] transition-colors"><InstagramIcon /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#1B1B5E] font-black text-xs uppercase tracking-widest mb-8">Catalog</h3>
            <ul className="space-y-4">
              <li><Link href="/category/phones" className="text-[#1B1B5E]/60 hover:text-[#1B1B5E] transition-colors text-sm font-bold">Smartphones</Link></li>
              <li><Link href="/category/laptops" className="text-[#1B1B5E]/60 hover:text-[#1B1B5E] transition-colors text-sm font-bold">Laptops</Link></li>
              <li><Link href="/category/pads" className="text-[#1B1B5E]/60 hover:text-[#1B1B5E] transition-colors text-sm font-bold">Tablets & Pads</Link></li>
              <li><Link href="/category/accessories" className="text-[#1B1B5E]/60 hover:text-[#1B1B5E] transition-colors text-sm font-bold">Accessories</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-[#1B1B5E] font-black text-xs uppercase tracking-widest mb-8">Service</h3>
            <ul className="space-y-4">
              <li><Link href="/track-order" className="text-[#1B1B5E]/60 hover:text-[#1B1B5E] transition-colors text-sm font-bold">Order Tracking</Link></li>
              <li><Link href="/support" className="text-[#1B1B5E]/60 hover:text-[#1B1B5E] transition-colors text-sm font-bold">Technical Support</Link></li>
              <li><Link href="/warranty" className="text-[#1B1B5E]/60 hover:text-[#1B1B5E] transition-colors text-sm font-bold">Warranty Policy</Link></li>
              <li><Link href="/contact" className="text-[#1B1B5E]/60 hover:text-[#1B1B5E] transition-colors text-sm font-bold">Contact Office</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#1B1B5E] font-black text-xs uppercase tracking-widest mb-8">Headquarters</h3>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <MapPin className="w-5 h-5 text-[#00AEEF] flex-shrink-0 mt-0.5" />
                <a href="https://maps.google.com/?q=Lagos,Nigeria" target="_blank" rel="noopener noreferrer" className="text-[#1B1B5E]/70 text-sm font-bold hover:text-[#00AEEF] transition-colors">Lagos/Abuja Nigeria</a>
              </li>
              <li className="flex items-center space-x-4">
                <Phone className="w-5 h-5 text-[#00AEEF] flex-shrink-0" />
                <a href="tel:+2348148527697" className="text-[#1B1B5E]/70 text-sm font-bold hover:text-[#00AEEF] transition-colors">+234 814 852 7697</a>
              </li>
              <li className="flex items-center space-x-4">
                <Mail className="w-5 h-5 text-[#00AEEF] flex-shrink-0" />
                <a href="mailto:office@ekesongroup.com" className="text-[#1B1B5E]/70 text-sm font-bold hover:text-[#00AEEF] transition-colors">office@ekesongroup.com</a>
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
