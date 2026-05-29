"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Package, Plus, Edit2, Trash2, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const initialForm = {
    name: "", description: "", price: "", category: "phones", 
    condition: "new", brand: "", image_url: "", inventory: 0, 
    status: "In Stock", is_featured: false
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
    if (error) console.error("Error fetching products:", error);
    setLoading(false);
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) fetchProducts();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingProduct) {
      const { error } = await supabase.from("products").update(formData).eq("id", editingProduct.id);
      if (!error) {
        setIsModalOpen(false);
        fetchProducts();
      }
    } else {
      const { error } = await supabase.from("products").insert([formData]);
      if (!error) {
        setIsModalOpen(false);
        fetchProducts();
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#00AEEF]" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[#1B1B5E] uppercase tracking-tighter flex items-center gap-3">
            <Package className="w-8 h-8 text-[#00AEEF]" />
            Product Management
          </h1>
          <p className="text-[#1B1B5E]/60 text-sm font-medium tracking-wide mt-1">Add, edit, or remove inventory.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#1B1B5E] hover:bg-[#00AEEF] text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-2 shadow-lg shadow-[#1B1B5E]/20"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[#1B1B5E]/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F5F5F7] border-b border-[#1B1B5E]/5 text-[#1B1B5E] text-xs font-black uppercase tracking-widest">
              <th className="p-4 pl-6">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-[#1B1B5E]/40 font-bold uppercase">No products found.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-[#1B1B5E]/5 hover:bg-[#F5F5F7]/50 transition-colors">
                  <td className="p-4 pl-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 relative overflow-hidden border border-gray-200">
                      {product.image_url ? (
                        <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                      ) : (
                        <Package className="w-5 h-5 text-gray-400 absolute inset-0 m-auto" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-[#1B1B5E]">{product.name}</p>
                      <p className="text-xs text-[#1B1B5E]/50 font-medium uppercase">{product.brand} • {product.condition}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-bold text-[#1B1B5E]/80 uppercase">{product.category}</td>
                  <td className="p-4 text-sm font-bold text-[#00AEEF]">₦{product.price.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      product.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                      product.status === 'Out of Stock' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <button onClick={() => handleOpenModal(product)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1B1B5E]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#1B1B5E]/5 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-black text-[#1B1B5E] uppercase tracking-tighter">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#1B1B5E]/40 hover:text-red-500 font-black">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Product Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Price (₦)</label>
                  <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Brand</label>
                  <input type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20">
                    {['phones', 'laptops', 'pads', 'smart_watches', 'earbuds', 'accessories', 'playstation', 'drones', 'gadgets'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Condition</label>
                  <select value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20">
                    <option value="new">Brand New</option>
                    <option value="uk-used">UK Used</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20">
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Restocking Soon">Restocking Soon</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Inventory Count</label>
                  <input type="number" value={formData.inventory} onChange={e => setFormData({...formData, inventory: e.target.value})} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20" />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Image URL</label>
                  <input type="text" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20" placeholder="/images/your_image.png or https://..." />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-bold text-[#1B1B5E] uppercase tracking-widest">Description</label>
                  <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-2 focus:ring-[#00AEEF]/20"></textarea>
                </div>

                <div className="col-span-2 flex items-center gap-3">
                  <input type="checkbox" id="featured" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} className="w-5 h-5 accent-[#00AEEF]" />
                  <label htmlFor="featured" className="text-sm font-bold text-[#1B1B5E]">Feature on Home Page</label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-4 border-t border-[#1B1B5E]/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-[#1B1B5E]/60 hover:text-[#1B1B5E]">Cancel</button>
                <button type="submit" className="bg-[#1B1B5E] text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#00AEEF] transition-colors">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
