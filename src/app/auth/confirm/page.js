"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ConfirmEmailPage() {
  const [status, setStatus] = useState("loading"); // loading, success, error
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      // With the implicit flow, Supabase processes the token from the URL hash automatically
      // on initialization and triggers an auth state change.
      // We can check if we have a session.
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session) {
        setStatus("success");
      } else {
        // If there's no session, it might still be processing. We listen to auth state changes.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === "SIGNED_IN" || session) {
            setStatus("success");
          } else if (event === "USER_UPDATED") {
            // Also a success indicator
            setStatus("success");
          }
        });

        // Give it a little time to process the hash. If after a short time there's still no session
        // and no hash in URL, it might be an invalid link or already confirmed.
        const timeout = setTimeout(() => {
          if (!window.location.hash || window.location.hash.indexOf('access_token') === -1) {
            // No token in URL, might be just visiting the page directly
            setStatus("error");
          }
        }, 3000);

        return () => {
          subscription.unsubscribe();
          clearTimeout(timeout);
        };
      }
    };
    
    checkSession();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-[#1B1B5E]/5 text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-[#00AEEF] animate-spin" />
            <h1 className="text-2xl font-black text-[#1B1B5E] tracking-tight">Confirming Email...</h1>
            <p className="text-sm text-[#1B1B5E]/60 font-medium">
              Please wait while we verify your email address.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-2" />
            <h1 className="text-3xl font-black text-[#1B1B5E] tracking-tight">Email Confirmed!</h1>
            <p className="text-sm text-[#1B1B5E]/60 font-medium mb-6">
              Your account has been successfully verified. Welcome to Ekeson!
            </p>
            <Link
              href="/dashboard"
              className="w-full bg-[#1B1B5E] hover:bg-[#00AEEF] text-white py-4 rounded-xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 mt-4"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-2">
              <span className="text-3xl font-bold">!</span>
            </div>
            <h1 className="text-2xl font-black text-[#1B1B5E] tracking-tight">Verification Failed</h1>
            <p className="text-sm text-[#1B1B5E]/60 font-medium">
              The link might be invalid or expired, or your email is already confirmed.
            </p>
            <Link
              href="/auth/login"
              className="w-full bg-[#1B1B5E] hover:bg-[#00AEEF] text-white py-4 rounded-xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center mt-4"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
