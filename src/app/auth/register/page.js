"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, User, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (authError) {
      setError(authError.message);
    } else {
      // Handle success (e.g., redirect or show check email msg)
      alert("Registration successful! Please check your email for verification.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F3E9] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 text-[#1B1B5E]/40 hover:text-[#1B1B5E] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-widest">Return to Store</span>
        </Link>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-[1.5rem] bg-[#1B1B5E] flex items-center justify-center shadow-xl">
            <ShieldCheck className="w-8 h-8 text-[#00AEEF]" />
          </div>
        </div>
        <h2 className="text-center text-4xl font-black text-[#1B1B5E] uppercase tracking-tighter leading-none">
          JOIN THE <span className="text-[#00AEEF]">ELITE</span>
        </h2>
        <p className="mt-4 text-center text-sm font-medium text-[#1B1B5E]/60">
          Create your account to start building your tech collection.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-6 shadow-2xl rounded-[3rem] border border-[#1B1B5E]/5 sm:px-12 relative overflow-hidden">
          {/* Decorative accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00AEEF]/5 rounded-bl-[8rem] pointer-events-none" />
          
          <form className="space-y-6 relative z-10" onSubmit={handleRegister}>
            <div>
              <label className="block text-[10px] font-black text-[#1B1B5E] uppercase tracking-widest mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B1B5E]/30" />
                <input
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8F9FA] border border-transparent focus:bg-white focus:border-[#00AEEF]/20 focus:ring-0 transition-all text-[#1B1B5E] font-medium"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-[#1B1B5E] uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B1B5E]/30" />
                <input
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8F9FA] border border-transparent focus:bg-white focus:border-[#00AEEF]/20 focus:ring-0 transition-all text-[#1B1B5E] font-medium"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-[#1B1B5E] uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B1B5E]/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-12 pr-12 py-4 rounded-2xl bg-[#F8F9FA] border border-transparent focus:bg-white focus:border-[#00AEEF]/20 focus:ring-0 transition-all text-[#1B1B5E] font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1B1B5E]/40 hover:text-[#1B1B5E] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-bold uppercase tracking-tight text-center">{error}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-5 px-4 border border-transparent rounded-2xl shadow-xl text-sm font-black uppercase tracking-widest text-white bg-[#1B1B5E] hover:bg-[#00AEEF] transition-all duration-500 disabled:opacity-50"
              >
                {loading ? "Initializing..." : "Create Account"}
              </button>
            </div>
          </form>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#1B1B5E]/5"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
                <span className="px-4 bg-white text-[#1B1B5E]/30">Already elite?</span>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link href="/auth/login" className="text-[#00AEEF] font-black uppercase tracking-widest hover:tracking-[0.2em] transition-all duration-500">
                Sign In Instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
