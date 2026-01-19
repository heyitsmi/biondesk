'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const validVariables = [
  '{{client_name}}', '{{client_company}}', '{{client_address}}',
  '{{project_title}}', '{{quote_number}}', '{{issue_date}}',
  '{{payment_terms_days}}', '{{revision_count}}', '{{my_company_name}}', '{{my_email}}'
];

const sampleData: Record<string, string> = {
  '{{client_name}}': 'John Smith',
  '{{client_company}}': 'Acme Corp',
  '{{client_address}}': '123 Innovation Dr, Tech City',
  '{{project_title}}': 'SaaS Website Redesign',
  '{{quote_number}}': 'Q-2026-001',
  '{{issue_date}}': 'Jan 15, 2026',
  '{{payment_terms_days}}': '14',
  '{{revision_count}}': '2',
  '{{my_company_name}}': 'Flova Studio',
  '{{my_email}}': 'hello@flova.studio'
};

const variableGroups = [
  {
    name: 'Client Details',
    variables: ['{{client_name}}', '{{client_company}}', '{{client_address}}']
  },
  {
    name: 'Project Info',
    variables: ['{{payment_terms_days}}', '{{revision_count}}', '{{issue_date}}']
  }
];

export default function CreateTemplatePage() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [type, setType] = useState('quote');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('Payment is due within {{payment_terms_days}} days of invoice date.\n\nIncludes {{revision_count}} rounds of revisions. Additional revisions will be charged at our standard hourly rate.');
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const insertVariable = (variable: string) => {
    setContent(prev => prev + variable);
  };

  const getPreviewContent = () => {
    let previewContent = content;
    Object.entries(sampleData).forEach(([key, value]) => {
      previewContent = previewContent.replace(
        new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'),
        `<span class="bg-emerald-50 text-emerald-700 px-1 rounded border border-emerald-100">${value}</span>`
      );
    });
    return previewContent.replace(/\n/g, '<br>');
  };

  const validateAndSave = () => {
    const foundVariables = content.match(/{{[a-zA-Z0-9_]+}}/g) || [];
    const invalidVars = foundVariables.filter(v => !validVariables.includes(v));

    if (invalidVars.length > 0) {
      setToast({
        message: invalidVars.length === 1 
          ? `Unknown variable: ${invalidVars[0]}` 
          : `${invalidVars.length} unknown variables found (e.g., ${invalidVars[0]})`,
        type: 'error'
      });
    } else {
      setToast({ message: 'Template saved successfully!', type: 'success' });
    }

    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium z-50 animate-in slide-in-from-bottom-4 duration-300 ${
          toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'
        }`}>
          <i className={`ph-fill ${toast.type === 'error' ? 'ph-warning-circle' : 'ph-check-circle text-emerald-400'} text-lg`} />
          <span>{toast.message}</span>
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
              <span>Templates</span>
              <i className="ph-bold ph-caret-right text-[10px] text-slate-300" />
              <span className="text-slate-800">New</span>
            </div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight leading-none">Create Template</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Preview Toggle */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Preview</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={showPreview}
                onChange={(e) => setShowPreview(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>

          <button 
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={validateAndSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 transition-colors"
          >
            <i className="ph-bold ph-floppy-disk" />
            <span>Save Template</span>
          </button>
        </div>
      </header>

      {/* Split Layout Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT: Template Editor */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50/50 p-8 relative">
          {/* Editor Container */}
          <div className={`max-w-4xl mx-auto w-full space-y-6 transition-opacity ${showPreview ? 'opacity-0 pointer-events-none' : ''}`}>
            
            {/* 1. Metadata */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Template Name */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Template Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Standard Web Design Quote"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400"
                  />
                </div>

                {/* Template Type */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Type</label>
                  <div className="relative">
                    <select 
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer"
                    >
                      <option value="quote">Quotation</option>
                      <option value="invoice">Invoice</option>
                      <option value="proposal">Proposal</option>
                    </select>
                    <i className="ph-bold ph-caret-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Description <span className="font-normal text-slate-400">(Optional)</span></label>
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Used for standard 5-page website projects..."
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* 2. Editor Canvas */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
              {/* Toolbar */}
              <div className="h-12 border-b border-slate-100 flex items-center px-4 bg-slate-50/50 gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Default Content</span>
                <div className="h-6 w-px bg-slate-200 mx-2" />
                <span className="text-[10px] text-slate-400 italic">Click a variable on the right to insert at cursor</span>
              </div>

              {/* Editable Area */}
              <div className="p-8 flex-1">
                {/* Visual representation of a Quote Table */}
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
                    <span className="text-xs text-slate-400 italic">Items will be added when creating a quote</span>
                  </div>
                </div>

                {/* Terms Area */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Default Terms & Notes</label>
                  <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-lg text-sm text-slate-600 leading-relaxed min-h-[150px] outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PREVIEW OVERLAY */}
          {showPreview && (
            <div className="absolute inset-0 bg-slate-100 p-8 overflow-y-auto z-10">
              <div className="max-w-3xl mx-auto bg-white shadow-lg min-h-[800px] p-12 border border-slate-200 relative">
                {/* Watermark */}
                <div className="absolute top-4 right-4 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase rounded tracking-wide opacity-50">
                  Preview Mode
                </div>
                
                {/* Header Mockup */}
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">QUOTATION</h1>
                    <p className="text-sm text-slate-500">#Q-SAMPLE-001</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-lg font-bold text-slate-900">Flova Studio</h2>
                    <p className="text-sm text-slate-500">hello@flova.studio</p>
                  </div>
                </div>

                {/* Client Mockup */}
                <div className="mb-10 pb-6 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Prepared For</p>
                  <p className="text-base font-medium text-slate-900">Acme Corporation</p>
                  <p className="text-sm text-slate-500">123 Business Rd, Tech City</p>
                </div>

                {/* Items Mockup */}
                <div className="mb-10">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200">
                      <tr>
                        <th className="py-2 w-[50%] font-semibold text-slate-900">Description</th>
                        <th className="py-2 w-[15%] text-right font-semibold text-slate-900">Qty</th>
                        <th className="py-2 w-[15%] text-right font-semibold text-slate-900">Rate</th>
                        <th className="py-2 w-[20%] text-right font-semibold text-slate-900">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-4 text-slate-700">Web Design Service</td>
                        <td className="py-4 text-right text-slate-700">1</td>
                        <td className="py-4 text-right text-slate-700">$2,500.00</td>
                        <td className="py-4 text-right text-slate-900 font-medium">$2,500.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Dynamic Content Preview */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Notes & Terms</p>
                  <div 
                    className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Variables Sidebar */}
        <div className="w-[300px] bg-white border-l border-slate-200 flex flex-col shrink-0 z-20">
          <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
            <h3 className="text-sm font-semibold text-slate-900">Dynamic Variables</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-700 mb-4">
              <i className="ph-fill ph-cursor-click mr-1" />
              Click a variable to insert it at your cursor position.
            </div>

            {variableGroups.map((group) => (
              <div key={group.name} className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{group.name}</h4>
                <div className="space-y-2">
                  {group.variables.map((variable) => (
                    <button 
                      key={variable}
                      onClick={() => insertVariable(variable)}
                      className="w-full text-left px-3 py-2 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 rounded-lg text-xs font-mono text-slate-600 transition-colors flex justify-between items-center group"
                    >
                      <span>{variable}</span>
                      <i className="ph-bold ph-plus text-indigo-500 opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
