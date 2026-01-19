'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

// Mock invoice data
const mockInvoice = {
  id: 'INV-2026-003',
  client: {
    id: 'acme',
    name: 'Acme Corp',
    address: '123 Business Rd, Tech City',
    email: 'contact@acme.com',
  },
  reference: 'PO-1234',
  issueDate: '2026-01-10',
  dueDate: '2026-01-24',
  items: [
    {
      id: '1',
      name: 'UI/UX Design Phase 1',
      description: 'Completed wireframing and initial high-fidelity concepts.',
      quantity: 1,
      rate: 2500.00,
    },
  ],
  subtotal: 2500.00,
  discount: 0,
  tax: 0,
  total: 2500.00,
  notes: `Bank Name: BCA
Account No: 1234567890
Name: Flova Studio

Please include invoice number #INV-2026-003 in transaction details.`,
};

const mockClients = [
  { id: 'acme', name: 'Acme Corp', address: '123 Business Rd, Tech City', email: 'contact@acme.com' },
  { id: 'techstart', name: 'TechStart Inc', address: '456 Innovation Ave', email: 'hello@techstart.io' },
];

interface LineItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  rate: number;
}

export default function EditInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  const [selectedClient, setSelectedClient] = useState(mockInvoice.client.id);
  const [reference, setReference] = useState(mockInvoice.reference);
  const [issueDate, setIssueDate] = useState(mockInvoice.issueDate);
  const [dueDate, setDueDate] = useState(mockInvoice.dueDate);
  const [items, setItems] = useState<LineItem[]>(mockInvoice.items);
  const [notes, setNotes] = useState(mockInvoice.notes);
  const [discount, setDiscount] = useState(mockInvoice.discount);
  const [tax, setTax] = useState(mockInvoice.tax);
  const [showClientModal, setShowClientModal] = useState(false);

  const selectedClientData = mockClients.find(c => c.id === selectedClient);

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const discountAmount = subtotal * (discount / 100);
  const taxAmount = (subtotal - discountAmount) * (tax / 100);
  const total = subtotal - discountAmount + taxAmount;

  const addLineItem = () => {
    setItems([...items, {
      id: Date.now().toString(),
      name: '',
      description: '',
      quantity: 1,
      rate: 0,
    }]);
  };

  const removeLineItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleClientChange = (value: string) => {
    if (value === 'new') {
      setShowClientModal(true);
    } else {
      setSelectedClient(value);
    }
  };

  const quickInserts = [
    { label: '+ Bank BCA', text: 'Bank Name: BCA\nAccount No: 1234567890\nName: Flova Studio' },
    { label: '+ Reference Note', text: 'Please include invoice number in transaction details.' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden">
      {/* Add Client Modal */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setShowClientModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-base font-semibold text-slate-900">Add New Client</h3>
              <button 
                onClick={() => setShowClientModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <i className="ph-bold ph-x" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">First Name <span className="text-rose-500">*</span></label>
                  <input type="text" placeholder="e.g. Jane" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Last Name <span className="text-slate-400 font-normal">(Opt)</span></label>
                  <input type="text" placeholder="e.g. Doe" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Company Name <span className="text-slate-400 font-normal">(Opt)</span></label>
                <input type="text" placeholder="e.g. Acme Inc." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Email Address <span className="text-rose-500">*</span></label>
                <input type="email" placeholder="jane@company.com" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
            </div>
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button onClick={() => setShowClientModal(false)} className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => setShowClientModal(false)} className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors">Save & Select</button>
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
              <span>Invoices</span>
              <i className="ph-bold ph-caret-right text-[10px] text-slate-300" />
              <span className="text-slate-800">{mockInvoice.id}</span>
            </div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight leading-none">Edit Invoice</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Ready Checklist */}
          <div className="hidden md:flex items-center gap-3 mr-2">
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-500">
              <i className="ph-fill ph-check-circle" /> Client
            </span>
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-500">
              <i className="ph-fill ph-check-circle" /> Due Date
            </span>
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-500">
              <i className="ph-fill ph-check-circle" /> Total
            </span>
          </div>

          <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all">
            Save Changes
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 transition-colors">
            <i className="ph-bold ph-paper-plane-tilt" />
            <span>Update & Send</span>
          </button>
        </div>
      </header>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* 1. Metadata Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Client Selection */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Client</label>
                <div className="relative">
                  <select 
                    value={selectedClient}
                    onChange={(e) => handleClientChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select a client...</option>
                    {mockClients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                    <option value="new" className="font-bold text-indigo-600">+ Create New Client</option>
                  </select>
                  <i className="ph-bold ph-caret-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              {selectedClientData && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">{selectedClientData.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{selectedClientData.address}</p>
                  <p className="text-xs text-slate-500">{selectedClientData.email}</p>
                </div>
              )}
            </div>

            {/* Right: Invoice Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Invoice Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">#</span>
                  <input 
                    type="text" 
                    value={mockInvoice.id}
                    readOnly
                    className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Reference (Opt)</label>
                <input 
                  type="text" 
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. PO-1234"
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Issue Date</label>
                <input 
                  type="date" 
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Due Date</label>
                <input 
                  type="date" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Line Items */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-6 py-3 w-[45%]">Item Description</th>
                    <th className="px-4 py-3 w-[15%] text-right">Qty</th>
                    <th className="px-4 py-3 w-[15%] text-right">Rate</th>
                    <th className="px-6 py-3 w-[15%] text-right">Amount</th>
                    <th className="px-4 py-3 w-[5%]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 align-top">
                        <input 
                          type="text" 
                          value={item.name}
                          onChange={(e) => updateLineItem(item.id, 'name', e.target.value)}
                          placeholder="Item Name"
                          className="w-full font-medium text-slate-900 border-none px-3 py-2 -ml-3 rounded-lg focus:ring-0 focus:bg-slate-50 placeholder:text-slate-300 mb-1"
                        />
                        <textarea 
                          rows={2}
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                          placeholder="Add description..."
                          className="w-full text-xs text-slate-500 border-none px-3 py-2 -ml-3 rounded-lg focus:ring-0 focus:bg-slate-50 resize-y bg-transparent placeholder:text-slate-300 leading-relaxed"
                        />
                      </td>
                      <td className="px-4 py-4 align-top">
                        <input 
                          type="number" 
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full text-right bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                        />
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                          <input 
                            type="number" 
                            value={item.rate}
                            onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-full text-right pl-5 pr-2 py-1 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top text-right font-semibold text-slate-900 pt-5">
                        ${(item.quantity * item.rate).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4 align-top text-center pt-5">
                        <button 
                          onClick={() => removeLineItem(item.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <i className="ph-bold ph-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Add Item Button */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button 
                onClick={addLineItem}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-2 transition-colors"
              >
                <i className="ph-bold ph-plus-circle text-lg" />
                Add Line Item
              </button>
            </div>
          </div>

          {/* 3. Totals & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Notes with Templates */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">Payment Details</label>
                <select className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-500 hover:text-slate-700 cursor-pointer focus:outline-none">
                  <option>Load Template...</option>
                  <option>Bank Transfer (BCA)</option>
                  <option>PayPal</option>
                </select>
              </div>
              
              {/* Quick Inserts */}
              <div className="flex flex-wrap gap-2">
                {quickInserts.map((insert, index) => (
                  <button 
                    key={index}
                    onClick={() => setNotes(notes + (notes ? '\n' : '') + insert.text)}
                    className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    {insert.label}
                  </button>
                ))}
              </div>

              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-normal text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Calculation */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3 h-fit">
              {/* Subtotal */}
              <div className="flex justify-between items-center text-sm text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>

              {/* Discount */}
              <div className="flex justify-between items-center text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span>Discount</span>
                  <div className="relative w-16">
                    <input 
                      type="number" 
                      value={discount || ''}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full pr-6 pl-1 py-0.5 text-right border-b border-slate-300 focus:border-indigo-500 focus:outline-none text-xs bg-transparent text-rose-500"
                    />
                    <span className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
                  </div>
                </div>
                <span className="font-medium text-rose-500">-${discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>

              {/* Tax */}
              <div className="flex justify-between items-center text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span>Tax</span>
                  <div className="relative w-16">
                    <input 
                      type="number" 
                      value={tax || ''}
                      onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full pr-6 pl-1 py-0.5 text-right border-b border-slate-300 focus:border-indigo-500 focus:outline-none text-xs bg-transparent"
                    />
                    <span className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
                  </div>
                </div>
                <span className="font-medium">${taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="h-px bg-slate-100 my-2" />

              {/* Total */}
              <div className="flex justify-between items-center text-base font-bold text-slate-900">
                <span>Total</span>
                <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>

              {/* Amount Due */}
              <div className="flex justify-between items-center text-lg font-bold text-indigo-700 pt-2">
                <span>Amount Due</span>
                <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
