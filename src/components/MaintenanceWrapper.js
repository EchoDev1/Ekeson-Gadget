"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { usePathname } from 'next/navigation';
import { Settings } from 'lucide-react';

export default function MaintenanceWrapper({ children }) {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;

    const checkMaintenance = async () => {
      try {
        const { data } = await supabase.from('settings').select('is_maintenance_mode').eq('id', 1).single();
        if (data?.is_maintenance_mode) {
          setIsMaintenance(true);
        }
      } catch (err) {
        // ignore
      }
    };
    
    checkMaintenance();
  }, [pathname]);

  if (isMaintenance && !pathname?.startsWith('/admin')) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-4 text-center">
        <Settings className="w-16 h-16 text-[#00AEEF] animate-spin mb-6" />
        <h1 className="text-4xl font-black text-[#1B1B5E] uppercase tracking-tighter mb-4">Under Maintenance</h1>
        <p className="text-[#1B1B5E]/60 max-w-md font-medium">
          Our store is currently undergoing scheduled maintenance to improve your shopping experience. We&apos;ll be back online shortly!
        </p>
      </div>
    );
  }

  return children;
}
