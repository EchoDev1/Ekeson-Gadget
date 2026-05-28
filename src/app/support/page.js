"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Wrench, Send, HelpCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: insertError } = await supabase
        .from('contact_submissions')
        .insert([{
          ...formData,
          type: 'support'
        }]);

      if (insertError) throw insertError;
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err.message || "Failed to submit support ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3E9] pt-24 md:pt-32 pb-16 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        <div className="text-center mb-10 md:mb-16">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#1B1B5E] text-[#00AEEF] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-2xl">
            <Wrench className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[#1B1B5E] tracking-tighter uppercase mb-3 md:mb-4">
            Technical <span className="text-[#00AEEF]">Support</span>
          </h1>
          <p className="text-[#1B1B5E]/60 font-medium max-w-2xl mx-auto text-sm md:text-lg px-2">
            Experiencing an issue with a product? Submit a ticket below and our engineering team will get back to you within 24 hours.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl border border-[#1B1B5E]/5 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-bl from-[#00AEEF]/5 to-transparent rounded-bl-full pointer-events-none" />
          
          {success ? (
            <div className="text-center py-12 md:py-16 animate-in zoom-in duration-500 relative z-10">
              <CheckCircle className="w-16 h-16 md:w-24 md:h-24 text-[#00AEEF] mx-auto mb-4 md:mb-6" />
              <h2 className="text-2xl md:text-3xl font-black text-[#1B1B5E] uppercase tracking-wider mb-3 md:mb-4">Ticket Submitted</h2>
              <p className="text-[#1B1B5E]/60 mb-6 md:mb-8 max-w-md mx-auto font-medium text-sm md:text-base">
                Your support ticket has been received. Our team will review it and contact you via email shortly.
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="bg-[#1B1B5E] text-white px-6 md:px-8 py-3 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-[#00AEEF] transition-colors"
              >
                Submit Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 relative z-10">
              {error && (
                <div className="p-3 md:p-4 bg-red-50 text-red-600 rounded-xl md:rounded-2xl text-xs md:text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-[#1B1B5E] uppercase tracking-widest ml-4">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-5 md:px-6 py-3 md:py-4 bg-[#F5F5F7] border border-transparent rounded-2xl text-[#1B1B5E] focus:bg-white focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10 transition-all outline-none text-sm md:text-base"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-[#1B1B5E] uppercase tracking-widest ml-4">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-5 md:px-6 py-3 md:py-4 bg-[#F5F5F7] border border-transparent rounded-2xl text-[#1B1B5E] focus:bg-white focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10 transition-all outline-none text-sm md:text-base"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-[#1B1B5E] uppercase tracking-widest ml-4">Issue Subject</label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-5 md:px-6 py-3 md:py-4 bg-[#F5F5F7] border border-transparent rounded-2xl text-[#1B1B5E] focus:bg-white focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10 transition-all outline-none appearance-none font-medium text-sm md:text-base"
                >
                  <option value="" disabled>Select Issue Type</option>
                  <option value="Device Setup">Device Setup & Initialization</option>
                  <option value="Hardware Defect">Hardware Defect / Damage</option>
                  <option value="Software Glitch">Software / OS Issue</option>
                  <option value="Warranty Claim">Warranty Claim</option>
                  <option value="Other Technical">Other Technical Issue</option>
                </select>
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-[#1B1B5E] uppercase tracking-widest ml-4">Detailed Description</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-5 md:px-6 py-3 md:py-4 bg-[#F5F5F7] border border-transparent rounded-[1.5rem] md:rounded-3xl text-[#1B1B5E] focus:bg-white focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10 transition-all outline-none resize-none text-sm md:text-base"
                  placeholder="Please describe the issue in as much detail as possible..."
                />
              </div>

              <div className="pt-2 md:pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto bg-[#1B1B5E] text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-black text-[10px] md:text-sm uppercase tracking-widest hover:bg-[#00AEEF] transition-all duration-300 shadow-lg hover:-translate-y-1 flex justify-center items-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Submit Ticket <Send className="w-4 h-4" /></>}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-10 md:mt-12 text-center px-4">
          <p className="text-xs md:text-sm font-bold text-[#1B1B5E]/40 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
            <HelpCircle className="w-4 h-4 hidden sm:block" /> Need immediate help? Try the live chat widget in the bottom right corner.
          </p>
        </div>

      </div>
    </div>
  );
}
