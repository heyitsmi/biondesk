"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/dashboard/Header';
import Link from 'next/link';

export default function CreateQuotationPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState([
        { id: '1', description: '', quantity: 1, unitPrice: 0 }
    ]);

    const addItem = () => {
        setItems([...items, { 
            id: Date.now().toString(), 
            description: '', 
            quantity: 1, 
            unitPrice: 0 
        }]);
    };

    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const updateItem = (id: string, field: string, value: string | number) => {
        setItems(items.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // TODO: Submit to API
            router.push('/quotations');
        } catch (error) {
            console.error('Error creating quotation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header 
                title="New Quotation"
                subtitle="Create a professional quote"
                showNewButton={false}
            />

            <div className="flex-1 overflow-y-auto p-8">
                <div className="w-full max-w-4xl">
                    
                    {/* Back Link */}
                    <Link 
                        href="/quotations" 
                        className="inline-flex items-center gap-1.5 text-sm font-[500] text-slate-500 hover:text-slate-700 mb-6"
                    >
                        <i className="ph ph-arrow-left"></i>
                        Back to Quotations
                    </Link>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Client Info */}
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="text-lg font-[600] text-slate-900">Client Information</h2>
                            </div>
                            <div className="p-6 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-[600] text-slate-700 mb-1.5">
                                        Client <span className="text-rose-500">*</span>
                                    </label>
                                    <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                                        <option value="">Select a client</option>
                                        <option value="1">Acme Corp - John Smith</option>
                                        <option value="2">Startup.io - Sarah Johnson</option>
                                        <option value="3">Tech Solutions - Michael Chen</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-[600] text-slate-700 mb-1.5">Quote Title</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g., Website Redesign Project"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-[600] text-slate-700 mb-1.5">Valid Until</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-[600] text-slate-700 mb-1.5">Template</label>
                                    <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                                        <option value="">Start from scratch</option>
                                        <option value="1">Standard Project Quote</option>
                                        <option value="2">Retainer Quote</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Line Items */}
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-lg font-[600] text-slate-900">Line Items</h2>
                                <button 
                                    type="button"
                                    onClick={addItem}
                                    className="text-sm font-[550] text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                                >
                                    <i className="ph-bold ph-plus"></i>
                                    Add Item
                                </button>
                            </div>
                            <div className="p-6">
                                {/* Header */}
                                <div className="grid grid-cols-12 gap-4 mb-3 px-1">
                                    <div className="col-span-6 text-xs font-[600] text-slate-500 uppercase">Description</div>
                                    <div className="col-span-2 text-xs font-[600] text-slate-500 uppercase">Qty</div>
                                    <div className="col-span-2 text-xs font-[600] text-slate-500 uppercase">Price</div>
                                    <div className="col-span-2 text-xs font-[600] text-slate-500 uppercase text-right">Amount</div>
                                </div>

                                {/* Items */}
                                <div className="space-y-3">
                                    {items.map((item, index) => (
                                        <div key={item.id} className="grid grid-cols-12 gap-4 items-center group">
                                            <div className="col-span-6">
                                                <input 
                                                    type="text" 
                                                    placeholder="Item description"
                                                    value={item.description}
                                                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input 
                                                    type="number" 
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                                                    <input 
                                                        type="number" 
                                                        min="0"
                                                        step="0.01"
                                                        value={item.unitPrice}
                                                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                        className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-2 flex items-center justify-between">
                                                <span className="text-sm font-[600] text-slate-900">
                                                    ${(item.quantity * item.unitPrice).toFixed(2)}
                                                </span>
                                                {items.length > 1 && (
                                                    <button 
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        className="p-1 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <i className="ph ph-x"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                                    <div className="flex justify-end gap-8">
                                        <span className="text-sm text-slate-500">Subtotal</span>
                                        <span className="text-sm font-[600] text-slate-900 w-24 text-right">${calculateSubtotal().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-end gap-8">
                                        <span className="text-sm text-slate-500">Tax (0%)</span>
                                        <span className="text-sm font-[600] text-slate-900 w-24 text-right">$0.00</span>
                                    </div>
                                    <div className="flex justify-end gap-8 pt-2 border-t border-slate-100">
                                        <span className="text-base font-[600] text-slate-900">Total</span>
                                        <span className="text-base font-[700] text-indigo-600 w-24 text-right">${calculateSubtotal().toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Terms & Notes */}
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="text-lg font-[600] text-slate-900">Terms & Notes</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-[600] text-slate-700 mb-1.5">Payment Terms</label>
                                    <textarea 
                                        rows={2}
                                        placeholder="e.g., 50% upfront, 50% upon completion. Quote valid for 14 days."
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-[600] text-slate-700 mb-1.5">Notes for Client</label>
                                    <textarea 
                                        rows={3}
                                        placeholder="Any additional notes or thank you message..."
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-4">
                            <Link 
                                href="/quotations"
                                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-[600] rounded-lg hover:border-slate-300 transition-all"
                            >
                                Cancel
                            </Link>
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-[600] rounded-lg hover:border-slate-300 transition-all"
                            >
                                Save as Draft
                            </button>
                            <button 
                                type="button"
                                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-[600] rounded-lg shadow-lg transition-all"
                            >
                                Save & Preview
                            </button>
                        </div>
                    </form>

                </div>
                
                {/* Footer */}
                <div className="mt-12 mb-6 text-center">
                    <p className="text-xs text-slate-400">© 2026 Flova. Crafted for growth.</p>
                </div>
            </div>
        </>
    );
}
