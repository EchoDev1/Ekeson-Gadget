"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User, Mail, ShieldCheck, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setProfile({ ...data, email: session.user.email });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#00AEEF]" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#1B1B5E]/5">
        <h2 className="text-2xl font-black text-[#1B1B5E] uppercase tracking-tighter mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-[#00AEEF]" />
          My Profile
        </h2>

        <div className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black text-[#1B1B5E]/50 uppercase tracking-widest block mb-2">Full Name</label>
              <div className="bg-[#F5F5F7] px-4 py-3 rounded-xl text-[#1B1B5E] font-bold">
                {profile?.full_name || 'Not provided'}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-[#1B1B5E]/50 uppercase tracking-widest block mb-2">Email Address</label>
              <div className="bg-[#F5F5F7] px-4 py-3 rounded-xl text-[#1B1B5E] font-bold flex items-center justify-between">
                {profile?.email}
                <Mail className="w-4 h-4 text-[#1B1B5E]/30" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-[#1B1B5E]/50 uppercase tracking-widest block mb-2">Account Role</label>
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              {profile?.role || 'User'}
            </div>
          </div>

          <div className="pt-6 border-t border-[#1B1B5E]/5">
            <button className="bg-[#1B1B5E] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#00AEEF] transition-colors text-sm uppercase tracking-widest">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
