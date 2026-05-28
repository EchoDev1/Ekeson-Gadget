"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Lock, User, ArrowRight, Loader2, KeyRound, ShieldQuestion } from "lucide-react";

export default function AdminLogin() {
  const [step, setStep] = useState("login"); // 'login', 'reset_password', 'secret_question'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [secretAnswer, setSecretAnswer] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Map custom username to email
      const email = username.toLowerCase() === "ebukagreateke" 
        ? "ebukagreateke@ekesontech.com" 
        : username;

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Fetch profile to check admin role and auth flags
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, needs_password_reset, secret_answer')
        .eq('id', data.user.id)
        .single();

      if (profileError || profile?.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error("Unauthorized: Admin access required.");
      }

      // Check which step to go to next
      if (profile?.needs_password_reset) {
        setStep("reset_password");
      } else {
        setStep("secret_question");
      }
    } catch (err) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      // Update Auth Password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      // Update Profile Flag
      const { data: user } = await supabase.auth.getUser();
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ needs_password_reset: false })
        .eq('id', user.user.id);

      if (profileError) throw profileError;

      // Move to secret question
      setStep("secret_question");
    } catch (err) {
      setError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleSecretQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: user } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('secret_answer')
        .eq('id', user.user.id)
        .single();

      if (secretAnswer.trim().toLowerCase() === profile?.secret_answer?.toLowerCase()) {
        sessionStorage.setItem('admin_secret_verified', 'true');
        router.push("/admin");
        router.refresh();
      } else {
        throw new Error("Incorrect secret answer.");
      }
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="p-8 md:p-10 space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-[#1B1B5E] tracking-tighter uppercase">Admin Portal</h1>
            <p className="text-[#1B1B5E]/60 text-sm font-medium tracking-wide">
              {step === "login" && "Enter your credentials"}
              {step === "reset_password" && "Reset your temporary password"}
              {step === "secret_question" && "Verify your identity"}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 flex items-start gap-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs mt-0.5">!</span>
              <p>{error}</p>
            </div>
          )}

          {/* Step 1: Login */}
          {step === "login" && (
            <form onSubmit={handleLogin} className="space-y-5 animate-in slide-in-from-right-4">
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1B1B5E]/40 group-focus-within:text-[#00AEEF] transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#F5F5F7] border border-transparent rounded-2xl text-[#1B1B5E] placeholder-[#1B1B5E]/40 focus:bg-white focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10 transition-all outline-none"
                    placeholder="Admin Username"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1B1B5E]/40 group-focus-within:text-[#00AEEF] transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#F5F5F7] border border-transparent rounded-2xl text-[#1B1B5E] placeholder-[#1B1B5E]/40 focus:bg-white focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10 transition-all outline-none"
                    placeholder="Password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1B1B5E] hover:bg-[#00AEEF] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-300 shadow-lg shadow-[#1B1B5E]/20 hover:shadow-[#00AEEF]/30 hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Secure Login <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
          )}

          {/* Step 2: Reset Password */}
          {step === "reset_password" && (
            <form onSubmit={handlePasswordReset} className="space-y-5 animate-in slide-in-from-right-4">
              <div className="p-4 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl border border-amber-200">
                For security reasons, you must change your temporary password before accessing the dashboard.
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1B1B5E]/40 group-focus-within:text-[#00AEEF] transition-colors">
                  <KeyRound className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#F5F5F7] border border-transparent rounded-2xl text-[#1B1B5E] placeholder-[#1B1B5E]/40 focus:bg-white focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10 transition-all outline-none"
                  placeholder="New Secure Password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1B1B5E] hover:bg-[#00AEEF] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-300 shadow-lg shadow-[#1B1B5E]/20 hover:shadow-[#00AEEF]/30 hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Update Password <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
          )}

          {/* Step 3: Secret Question */}
          {step === "secret_question" && (
            <form onSubmit={handleSecretQuestion} className="space-y-5 animate-in slide-in-from-right-4">
              <div className="space-y-4">
                <label className="block text-sm font-black text-[#1B1B5E] text-center mb-6">
                  What's the secrete ?
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1B1B5E]/40 group-focus-within:text-[#00AEEF] transition-colors">
                    <ShieldQuestion className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={secretAnswer}
                    onChange={(e) => setSecretAnswer(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#F5F5F7] border border-transparent rounded-2xl text-[#1B1B5E] placeholder-[#1B1B5E]/40 focus:bg-white focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10 transition-all outline-none text-center tracking-widest font-black"
                    placeholder="Enter Secret Answer"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1B1B5E] hover:bg-[#00AEEF] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-300 shadow-lg shadow-[#1B1B5E]/20 hover:shadow-[#00AEEF]/30 hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify Identity <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
          )}

        </div>
        <div className="bg-[#1B1B5E] p-4 text-center">
          <p className="text-white/60 text-xs font-medium tracking-wider uppercase">Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
}
