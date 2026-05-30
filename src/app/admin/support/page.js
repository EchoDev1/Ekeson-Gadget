"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Mail, CheckCircle, Trash2, HelpCircle } from "lucide-react";

export default function AdminSupport() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Could not fetch submissions (likely offline mode or RLS):", error);
        setSubmissions([]);
      } else if (data) {
        setSubmissions(data);
      }
    } catch (err) {
      console.warn("Error fetching submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status })
        .eq("id", id);
      
      if (error) throw error;
      setSubmissions(prev => prev.map(sub => sub.id === id ? { ...sub, status } : sub));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  const deleteSubmission = async (id) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      setSubmissions(prev => prev.filter(sub => sub.id !== id));
    } catch (err) {
      console.error("Error deleting submission:", err);
      alert("Failed to delete submission.");
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filter === "all") return true;
    if (filter === "support") return sub.type === "support";
    if (filter === "contact") return sub.type === "contact";
    if (filter === "unread") return sub.status === "unread";
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter">Support Inbox</h1>
          <p className="text-[#1B1B5E]/60 text-sm font-medium tracking-wide mt-1">Manage technical support tickets and contact office messages.</p>
        </div>

        <div className="flex gap-2 bg-white rounded-xl p-1 border border-[#1B1B5E]/5 shadow-sm">
          {['all', 'unread', 'support', 'contact'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-[#1B1B5E] text-white' : 'text-[#1B1B5E]/50 hover:bg-[#1B1B5E]/5 hover:text-[#1B1B5E]'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[#1B1B5E]/5 overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center text-[#1B1B5E]/40">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">No messages found.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#1B1B5E]/5">
            {filteredSubmissions.map((sub) => (
              <div key={sub.id} className={`p-6 transition-colors ${sub.status === 'unread' ? 'bg-[#00AEEF]/5' : ''}`}>
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      {sub.type === 'support' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                          <HelpCircle className="w-3 h-3" /> Technical Support
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                          <Mail className="w-3 h-3" /> Contact Office
                        </span>
                      )}
                      
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        sub.status === 'unread' ? 'border-amber-200 text-amber-600 bg-amber-50' :
                        sub.status === 'resolved' ? 'border-green-200 text-green-600 bg-green-50' :
                        'border-gray-200 text-gray-600 bg-gray-50'
                      }`}>
                        {sub.status}
                      </span>
                      
                      <span className="text-xs text-[#1B1B5E]/40 font-bold">
                        {new Date(sub.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-[#1B1B5E] mb-1">{sub.subject}</h3>
                      <p className="text-sm font-bold text-[#1B1B5E]/60">From: {sub.name} &lt;<a href={`mailto:${sub.email}`} className="text-[#00AEEF] hover:underline">{sub.email}</a>&gt;</p>
                    </div>

                    <div className="bg-[#F5F5F7] p-4 rounded-2xl text-[#1B1B5E]/80 text-sm whitespace-pre-wrap font-medium">
                      {sub.message}
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center justify-end gap-2 shrink-0">
                    {sub.status !== 'resolved' && (
                      <button
                        onClick={() => updateStatus(sub.id, 'resolved')}
                        className="p-3 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition-colors tooltip-trigger"
                        title="Mark as Resolved"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    {sub.status === 'unread' && (
                      <button
                        onClick={() => updateStatus(sub.id, 'read')}
                        className="p-3 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors tooltip-trigger"
                        title="Mark as Read"
                      >
                        <Mail className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteSubmission(sub.id)}
                      className="p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors tooltip-trigger"
                      title="Delete Ticket"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
