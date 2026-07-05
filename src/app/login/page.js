"use client";


import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Logo } from '@/components/ui/BrandIdentity';
import { Loader2, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const turnstileRef = useRef(null);
  const router = useRouter();
  const [redirectUrl, setRedirectUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setRedirectUrl(params.get('redirect') || '');
    }
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken,
        }
      });

      if (signInError) throw signInError;

      // Check if user is admin and account status
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, status')
        .eq('id', data.user.id)
        .single();

      if (profile?.status === 'blocked' || profile?.status === 'suspended') {
        await supabase.auth.signOut();
        throw new Error("Your account has been restricted. Please contact support.");
      }
      const searchParams = new URLSearchParams(window.location.search);
      const redirectUrl = searchParams.get('redirect');

      if (profile?.role === 'admin') {
        // Set secure mock token if they are admin (so old admin layout code doesn't break)
        sessionStorage.setItem('admin_mock_logged_in', 'true');
        sessionStorage.setItem('admin_secret_verified', 'true');
        router.push('/admin');
      } else {
        router.push(redirectUrl || '/'); // normal users go to homepage after login
      }
    } catch (err) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
      if (turnstileRef.current) turnstileRef.current.reset();
      setCaptchaToken(null);
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
        <h1 className="text-2xl font-black text-[#1B1B5E] tracking-tight mb-2 text-center">Welcome Back</h1>
        <p className="text-sm text-[#1B1B5E]/60 text-center mb-8 font-medium">
          Sign in to your Ekeson account to continue.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-start gap-3 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
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
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-12 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20 font-medium text-[#1B1B5E] transition-all"
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

          {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
            <div className="flex justify-center py-2">
              <Turnstile 
                ref={turnstileRef}
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} 
                onSuccess={(token) => setCaptchaToken(token)}
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !captchaToken)}
            className="w-full bg-[#1B1B5E] hover:bg-[#00AEEF] text-white py-4 rounded-xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          </button>
        </form>
        <div className="mt-8 text-center text-sm font-medium text-[#1B1B5E]/60">
          Don&apos;t have an account?{" "}
          <Link href={redirectUrl ? `/signup?redirect=${encodeURIComponent(redirectUrl)}` : "/signup"} className="text-[#00AEEF] hover:underline font-bold">
            Create one now
          </Link>
        </div>
      </div>
    </div>
  );
}
