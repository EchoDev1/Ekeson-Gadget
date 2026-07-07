"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User, Mail, ShieldCheck, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setProfile({ ...data, email: session.user.email });
        setEditName(data?.full_name || "");
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('profiles').update({ full_name: editName }).eq('id', session.user.id);
      setProfile(prev => ({ ...prev, full_name: editName }));
    }
    setSaving(false);
    setIsEditing(false);
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#00AEEF]" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#1B1B5E]/5">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-black text-[#1B1B5E] uppercase tracking-tighter flex items-center gap-2 m-0">
            <User className="w-6 h-6 text-[#00AEEF]" />
            My Profile
          </h2>
          {profile?.is_vip && (
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs px-3 py-1 rounded-full uppercase tracking-widest font-black shadow-sm flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> VIP Member
            </span>
          )}
        </div>

        <div className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black text-[#1B1B5E]/50 uppercase tracking-widest block mb-2">Full Name</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  className="w-full bg-[#F5F5F7] px-4 py-3 rounded-xl text-[#1B1B5E] font-bold border border-[#1B1B5E]/10 focus:outline-none focus:border-[#00AEEF]"
                />
              ) : (
                <div className="bg-[#F5F5F7] px-4 py-3 rounded-xl text-[#1B1B5E] font-bold">
                  {profile?.full_name || 'Not provided'}
                </div>
              )}
            </div>
            <div>
              <label className="text-[10px] font-black text-[#1B1B5E]/50 uppercase tracking-widest block mb-2">Email Address</label>
              <div className="bg-[#F5F5F7] px-4 py-3 rounded-xl text-[#1B1B5E] font-bold flex items-center justify-between opacity-70">
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

          <div className="pt-6 border-t border-[#1B1B5E]/5 flex gap-4">
            {isEditing ? (
              <>
                <button 
                  onClick={handleSaveProfile} 
                  disabled={saving}
                  className="bg-[#1B1B5E] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#00AEEF] transition-colors text-sm uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
                </button>
                <button 
                  onClick={() => { setIsEditing(false); setEditName(profile?.full_name || ""); }} 
                  disabled={saving}
                  className="bg-transparent text-[#1B1B5E]/60 px-6 py-3 rounded-xl font-bold hover:bg-[#F5F5F7] transition-colors text-sm uppercase tracking-widest"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-[#1B1B5E] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#00AEEF] transition-colors text-sm uppercase tracking-widest"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
