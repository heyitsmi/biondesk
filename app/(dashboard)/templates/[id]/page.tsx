'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

// Mock template data
const mockTemplate = {
  id: 'tpl-001',
  name: 'Standard Web Design Quote',
  type: 'quote',
  description: 'Used for standard 5-page website projects with basic SEO included.',
  content: `Payment is due within {{payment_terms_days}} days of invoice date.

Includes {{revision_count}} rounds of revisions. Additional revisions will be charged at our standard hourly rate.

Timeline: {{project_timeline_weeks}} weeks from deposit payment.`,
  usageCount: 12,
  lastUsed: '2 days ago',
  createdAt: 'Dec 15, 2025',
  updatedAt: 'Jan 18, 2026',
};

const typeLabels: Record<string, { label: string; color: string; bg: string }> = {
  quote: { label: 'Quotation', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-100' },
  invoice: { label: 'Invoice', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
  proposal: { label: 'Proposal', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100' },
};

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const typeInfo = typeLabels[mockTemplate.type] || typeLabels.quote;

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <i className="ph-bold ph-trash text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Template?</h3>
              <p className="text-sm text-slate-500 mb-6">
                This action cannot be undone. This template will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowDeleteModal(false);
                    router.push('/templates');
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="h-16 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <i className="ph-bold ph-arrow-left text-lg" />
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-0.5">
              <span>Assets</span>
              <i className="ph-bold ph-caret-right text-[10px] text-slate-300" />
              <Link href="/templates" className="hover:text-indigo-600 transition-colors">Templates</Link>
              <i className="ph-bold ph-caret-right text-[10px] text-slate-300" />
              <span className="text-slate-800">{mockTemplate.name}</span>
            </div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight leading-none">Template Details</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all flex items-center gap-2"
          >
            <i className="ph-bold ph-trash" />
            <span>Delete</span>
          </button>
          <Link 
            href={`/templates/${templateId}/edit`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 transition-colors"
          >
            <i className="ph-bold ph-pencil-simple" />
            <span>Edit Template</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Template Info Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold text-slate-900">{mockTemplate.name}</h2>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeInfo.bg} ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{mockTemplate.description}</p>
                </div>
                <div className="flex items-center gap-6 text-center shrink-0">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{mockTemplate.usageCount}</p>
                    <p className="text-xs text-slate-500">Times Used</p>
                  </div>
                  <div className="h-10 w-px bg-slate-200" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{mockTemplate.lastUsed}</p>
                    <p className="text-xs text-slate-500">Last Used</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 bg-slate-50/50">
              <div className="p-4">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Type</p>
                <p className="text-sm font-medium text-slate-900">{typeInfo.label}</p>
              </div>
              <div className="p-4">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Created</p>
                <p className="text-sm font-medium text-slate-900">{mockTemplate.createdAt}</p>
              </div>
              <div className="p-4">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Last Updated</p>
                <p className="text-sm font-medium text-slate-900">{mockTemplate.updatedAt}</p>
              </div>
              <div className="p-4">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Usage Count</p>
                <p className="text-sm font-medium text-slate-900">{mockTemplate.usageCount} documents</p>
              </div>
            </div>
          </div>

          {/* Template Content Preview */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-semibold text-slate-900">Template Content</h3>
              <span className="text-xs text-slate-400">Variables are highlighted in blue</span>
            </div>
            
            <div className="p-6">
              {/* Visual representation of Quote Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                    <tr>
                      <th className="px-4 py-3 w-[50%]">Item</th>
                      <th className="px-4 py-3 w-[15%] text-right">Qty</th>
                      <th className="px-4 py-3 w-[15%] text-right">Rate</th>
                      <th className="px-4 py-3 w-[20%] text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-3 align-top">
                        <div className="font-semibold text-slate-900 mb-1">Design Service</div>
                        <div className="text-xs text-slate-500">Initial design concept...</div>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600">1</td>
                      <td className="px-4 py-3 text-right text-slate-600">$0.00</td>
                      <td className="px-4 py-3 text-right text-slate-900 font-medium">$0.00</td>
                    </tr>
                  </tbody>
                </table>
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-center">
                  <span className="text-xs text-slate-400 italic">Items will be added when creating a document</span>
                </div>
              </div>

              {/* Terms & Notes */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Default Terms & Notes</label>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {mockTemplate.content.split(/(\{\{[a-zA-Z0-9_]+\}\})/).map((part, index) => {
                    if (part.match(/\{\{[a-zA-Z0-9_]+\}\}/)) {
                      return (
                        <span 
                          key={index}
                          className="inline-block bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-xs font-mono border border-indigo-100"
                        >
                          {part}
                        </span>
                      );
                    }
                    return part;
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href="/quotations/create"
                className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <i className="ph-bold ph-file-text text-lg" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Create Quote</p>
                  <p className="text-xs text-slate-500">Use this template</p>
                </div>
              </Link>
              <Link 
                href="/invoices/create"
                className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <i className="ph-bold ph-receipt text-lg" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Create Invoice</p>
                  <p className="text-xs text-slate-500">Use this template</p>
                </div>
              </Link>
              <button 
                className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-600 group-hover:text-white transition-colors">
                  <i className="ph-bold ph-copy text-lg" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-900">Duplicate Template</p>
                  <p className="text-xs text-slate-500">Create a copy</p>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
