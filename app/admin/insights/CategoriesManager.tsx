"use client";

import { useState } from "react";
import { createInsightCategory, deleteInsightCategory } from "./actions";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CategoriesManager({ initialCategories }: { initialCategories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const res = await createInsightCategory({ name, slug });
    if (res.success && res.data) {
      setCategories([...categories, res.data]);
      setName("");
    } else {
      alert(res.error || "Failed to add category");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const res = await deleteInsightCategory(id);
    if (res.success) {
      setCategories(categories.filter(c => c.id !== id));
    } else {
      alert(res.error || "Failed to delete category");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
      >
        <i className="ph ph-folder"></i> Categories
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Manage Categories</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <i className="ph ph-x"></i>
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="New Category Name"
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <button
                  onClick={handleAdd}
                  disabled={loading || !name.trim()}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
                >
                  Add
                </button>
              </div>

              <div className="border border-slate-100 rounded-lg max-h-60 overflow-y-auto">
                {categories.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">No categories found.</div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {categories.map(c => (
                      <li key={c.id} className="flex items-center justify-between p-3 text-sm">
                        <span>{c.name}</span>
                        <button onClick={() => handleDelete(c.id)} className="text-rose-500 hover:text-rose-700">
                          <i className="ph ph-trash"></i>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
