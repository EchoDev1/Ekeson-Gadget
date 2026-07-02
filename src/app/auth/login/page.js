"use client";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Turnstile } from '@marsidev/react-turnstile';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [captchaToken, setCaptchaToken] = useState(null);
  const turnstileRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken,
      }
    });
    if (error) {
      setError(error.message);
      if (turnstileRef.current) turnstileRef.current.reset();
      setCaptchaToken(null);
    } else {
      window.location.href = '/dashboard';
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#FFFDF5]">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1B1B5E]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00AEEF]/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] border border-[#1B1B5E]/10 shadow-2xl relative z-10">
        <div className="text-center">
          <div className="flex flex-col items-center mb-6">
             <div className="flex flex-col items-center">
                <span className="text-2xl font-extrabold text-[#1B1B5E] tracking-widest uppercase">EKESON GADGETS</span>
                <span className="text-[#00AEEF] text-[10px] tracking-[0.3em] uppercase font-bold mt-1">Building Wealth</span>
              </div>
          </div>
          <h2 className="text-2xl font-black text-[#1B1B5E] tracking-tight uppercase">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-[#1B1B5E]/50 font-medium">
            Sign in to your Ekeson account to track orders and more.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-black text-[#1B1B5E]/40 uppercase tracking-widest ml-1">Email Address</label>
              <div className="mt-1.5 relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#00AEEF] transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 bg-[#F8F9FA] border border-[#1B1B5E]/5 rounded-2xl py-4 text-[#1B1B5E] placeholder-gray-400 focus:outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF] transition-all text-sm"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-[#1B1B5E]/40 uppercase tracking-widest ml-1">Password</label>
              <div className="mt-1.5 relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#00AEEF] transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 bg-[#F8F9FA] border border-[#1B1B5E]/5 rounded-2xl py-4 text-[#1B1B5E] placeholder-gray-400 focus:outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF] transition-all text-sm"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#1B1B5E]/40 hover:text-[#1B1B5E] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 bg-white border-[#1B1B5E]/10 rounded text-[#00AEEF] focus:ring-[#00AEEF]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-[#1B1B5E]/40 font-black uppercase tracking-widest">
                Keep me signed in
              </label>
            </div>

            <div className="text-xs">
              <a href="#" className="font-black text-[#00AEEF] hover:text-[#1B1B5E] transition-colors uppercase tracking-widest">
                Forgot?
              </a>
            </div>
          </div>

          {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
            <div className="flex justify-center py-2">
              <Turnstile 
                ref={turnstileRef}
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} 
                onSuccess={(token) => setCaptchaToken(token)}
              />
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !captchaToken)}
              className="w-full flex items-center justify-center gap-3 py-4 px-8 border border-transparent rounded-2xl shadow-xl text-xs font-black uppercase tracking-[0.2em] text-white bg-[#1B1B5E] hover:bg-[#00AEEF] hover:shadow-[#00AEEF]/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Access Portal"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1B1B5E]/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
              <span className="px-3 bg-white text-[#1B1B5E]/20">Or continue with</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button type="button" className="w-full flex items-center justify-center py-3.5 px-4 border border-[#1B1B5E]/10 rounded-2xl bg-[#F8F9FA] hover:bg-white text-sm font-black text-[#1B1B5E] transition-all uppercase tracking-widest">
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-[10px] font-black text-[#1B1B5E]/30 uppercase tracking-[0.2em]">
          New to Ekeson?{" "}
          <Link href="/auth/register" className="text-[#00AEEF] hover:text-[#1B1B5E] transition-colors">
            Create Free Account
          </Link>
        </p>
      </div>
    </div>
  );
}
