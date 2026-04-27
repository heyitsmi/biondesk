"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteInsight } from "./actions";

export default function InsightsTable({ initialInsights }: { initialInsights: any[] }) {
  const [insights, setInsights] = useState(initialInsights);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this insight?")) return;
    const res = await deleteInsight(id);
    if (res.success) {
      setInsights(insights.filter(i => i.id !== id));
    } else {
      alert(res.error || "Failed to delete");
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Published At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {insights.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No insights found. Click "New Insight" to create one.
                </td>
              </tr>
            ) : (
              insights.map((insight) => (
                <tr key={insight.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{insight.title}</div>
                    <div className="text-slate-500 text-xs mt-0.5 truncate max-w-xs">{insight.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      insight.status === 'published' 
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' 
                        : 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20'
                    }`}>
                      {insight.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {insight.insight_categories?.name || "-"}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {insight.published_at ? new Date(insight.published_at).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/insights/${insight.id}/edit`}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        title="Edit"
                      >
                        <i className="ph ph-pencil-simple text-lg"></i>
                      </Link>
                      <button
                        onClick={() => handleDelete(insight.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <i className="ph ph-trash text-lg"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
