"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MessageSquare, CheckCircle, XCircle, Trash2, Star } from "lucide-react";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('*, products(name), profiles(full_name)')
      .order('created_at', { ascending: false });
    
    if (data) setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateStatus = async (id, status) => {
    await supabase.from('reviews').update({ status }).eq('id', id);
    fetchReviews();
  };

  const deleteReview = async (id) => {
    if (confirm("Are you sure you want to delete this review?")) {
      await supabase.from('reviews').delete().eq('id', id);
      fetchReviews();
    }
  };

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-[#1B1B5E] uppercase tracking-wider flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-[#00AEEF]" /> Review Management
        </h2>
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#1B1B5E]/5">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews found.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="border border-[#1B1B5E]/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 justify-between items-start">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-[#1B1B5E]">{review.profiles?.full_name || "Anonymous User"}</h3>
                    <span className="text-xs text-gray-400">on</span>
                    <span className="text-xs font-bold bg-[#1B1B5E]/5 px-2 py-1 rounded-md">{review.products?.name}</span>
                  </div>
                  
                  <div className="flex text-[#00AEEF]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-[#00AEEF]' : 'text-gray-300'}`} />
                    ))}
                  </div>

                  <p className="text-gray-600 text-sm">{review.comment}</p>
                  
                  <div className="pt-2 flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      review.status === 'approved' ? 'bg-green-100 text-green-700' :
                      review.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {review.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2">
                  {review.status !== 'approved' && (
                    <button onClick={() => updateStatus(review.id, 'approved')} className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl text-xs font-bold transition-colors">
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                  )}
                  {review.status !== 'rejected' && (
                    <button onClick={() => updateStatus(review.id, 'rejected')} className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-xl text-xs font-bold transition-colors">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  )}
                  <button onClick={() => deleteReview(review.id)} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
