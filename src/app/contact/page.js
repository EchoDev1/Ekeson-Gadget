"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
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
          type: 'contact'
        }]);

      if (insertError) throw insertError;
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3E9] pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-[#1B1B5E] tracking-tighter uppercase mb-4">
            Contact <span className="text-[#00AEEF]">Office</span>
          </h1>
          <p className="text-[#1B1B5E]/60 font-medium text-lg">
            Reach out to our executive team for business inquiries, bulk orders, or general questions.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#1B1B5E] text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#00AEEF]/20 to-transparent rounded-bl-full pointer-events-none" />
              
              <h3 className="text-2xl font-black uppercase tracking-widest mb-10 relative z-10">Headquarters</h3>
              
              <div className="space-y-10 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#00AEEF]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Address</p>
                    <p className="font-bold text-lg leading-tight">Lagos/Abuja<br/>Nigeria</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#00AEEF]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Direct Line</p>
                    <p className="font-bold text-lg leading-tight">+234 814 852 7697</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#00AEEF]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Email Address</p>
                    <p className="font-bold text-lg leading-tight">office@ekesongroup.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3 bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-[#1B1B5E]/5">
            {success ? (
              <div className="text-center py-16 animate-in zoom-in duration-500">
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-wider mb-4">Message Sent</h2>
                <p className="text-[#1B1B5E]/60 mb-8 max-w-sm mx-auto font-medium">
                  Thank you for reaching out. A representative from our office will be in touch with you shortly.
                </p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="bg-[#1B1B5E] text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#00AEEF] transition-colors"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-black text-[#1B1B5E] tracking-tighter uppercase mb-8">Send a Message</h3>
                
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#1B1B5E] uppercase tracking-widest ml-4">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-4 bg-[#F5F5F7] border border-transparent rounded-2xl text-[#1B1B5E] focus:bg-white focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#1B1B5E] uppercase tracking-widest ml-4">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-6 py-4 bg-[#F5F5F7] border border-transparent rounded-2xl text-[#1B1B5E] focus:bg-white focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#1B1B5E] uppercase tracking-widest ml-4">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-6 py-4 bg-[#F5F5F7] border border-transparent rounded-2xl text-[#1B1B5E] focus:bg-white focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10 transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#1B1B5E] uppercase tracking-widest ml-4">Message</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-6 py-4 bg-[#F5F5F7] border border-transparent rounded-3xl text-[#1B1B5E] focus:bg-white focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10 transition-all outline-none resize-none"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#1B1B5E] text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#00AEEF] transition-all duration-300 shadow-lg hover:-translate-y-1 flex justify-center items-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Message <Send className="w-4 h-4" /></>}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
