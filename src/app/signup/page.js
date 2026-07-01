"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Logo } from '@/components/ui/BrandIdentity';
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (signUpError) throw signUpError;
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-8">
        <Logo className="h-10" showText={true} />
      </Link>
      
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-[#1B1B5E]/5">
        <h1 className="text-2xl font-black text-[#1B1B5E] tracking-tight mb-2 text-center">Create Account</h1>
        <p className="text-sm text-[#1B1B5E]/60 text-center mb-8 font-medium">
          Join Ekeson to manage your orders securely.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-start gap-3 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-2xl flex items-start gap-3 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p>Account created successfully! Redirecting...</p>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest mb-2 block">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-[#1B1B5E]/40" />
              </div>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20 font-medium text-[#1B1B5E] transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest mb-2 block">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-[#1B1B5E]/40" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20 font-medium text-[#1B1B5E] transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest mb-2 block">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-[#1B1B5E]/40" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-11 pr-4 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20 font-medium text-[#1B1B5E] transition-all"
                placeholder="Min. 6 characters"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || success}
            className="w-full bg-[#1B1B5E] hover:bg-[#00AEEF] text-white py-4 rounded-xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-[#1B1B5E]/60">
          Already have an account?{" "}
          <Link href="/login" className="text-[#00AEEF] hover:underline font-bold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
