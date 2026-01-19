'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { quotesApi, contactsApi } from '@/lib/api';
import { Contact, DocumentItem } from '@/lib/types';

interface QuoteFormData {
    client_id: string;
    reference: string;
    status: string;
    issue_date: string;
    valid_until: string;
    items: {
        id: string; // temp id for key
        description: string; // Title
        notes: string; // Long description
        quantity: number;
        unit_price: number;
    }[];
    notes: string;
    description: string;
    discount_percentage: number;
    tax_percentage: number;
    deposit_percentage: number;
    is_deposit_required: boolean;
}

export default function CreateQuotePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [clients, setClients] = useState<Contact[]>([]);
    
    // Form State
    const [formData, setFormData] = useState<QuoteFormData>({
        client_id: '',
        reference: '', // Acts as Title
        status: 'draft',
        issue_date: new Date().toISOString().split('T')[0],
        valid_until: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +14 days
        items: [
            { id: '1', description: 'Service Name', notes: '', quantity: 1, unit_price: 0 }
        ],
        notes: '', // Terms
        description: '', // Project Scope / Content
        discount_percentage: 0,
        tax_percentage: 0,
        deposit_percentage: 50,
        is_deposit_required: false,
    });

    // Client Modal State
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [newClientData, setNewClientData] = useState({ name: '', email: '', company: '' });
    const [isCreatingClient, setIsCreatingClient] = useState(false);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const data = await contactsApi.list({ limit: 100 });
            setClients(data.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    // Calculations
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const discountAmount = subtotal * (formData.discount_percentage / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (formData.tax_percentage / 100);
    const total = afterDiscount + taxAmount;
    const depositAmount = formData.is_deposit_required ? total * (formData.deposit_percentage / 100) : 0;

    // Handlers
    const handleAddItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [
                ...prev.items,
                { id: Math.random().toString(36).substr(2, 9), description: '', notes: '', quantity: 1, unit_price: 0 }
            ]
        }));
    };

    const handleRemoveItem = (id: string) => {
        if (formData.items.length === 1) return;
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id)
        }));
    };

    const handleItemChange = (id: string, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map(item => 
                item.id === id ? { ...item, [field]: value } : item
            )
        }));
    };

    const handleSaveClient = async () => {
        if (!newClientData.name || !newClientData.email) {
            alert('Name and Email are required');
            return;
        }
        setIsCreatingClient(true);
        try {
            const newClient = await contactsApi.create({
                name: newClientData.name,
                email: newClientData.email,
                company: newClientData.company || null,
                type: 'client'
            });
            setClients(prev => [...prev, newClient]);
            setFormData(prev => ({ ...prev, client_id: newClient.id }));
            setIsClientModalOpen(false);
            setNewClientData({ name: '', email: '', company: '' });
        } catch (error) {
            console.error('Failed to create client:', error);
            alert('Failed to create client');
        } finally {
            setIsCreatingClient(false);
        }
    };

    const handleSubmit = async (saveAsStatus: 'draft' | 'sent' | null = null) => {
        if (!formData.client_id) {
            alert('Please select a client');
            return;
        }

        const finalStatus = saveAsStatus || formData.status;

        setIsLoading(true);
        try {
            await quotesApi.create({
                contact_id: formData.client_id,
                title: formData.reference || 'Untitled Quote', 
                content: formData.description, // Description/Scope
                status: finalStatus as any,
                valid_until: formData.valid_until,
                amount: total,
                matches_template: false,
                items: formData.items.map(item => ({
                    description: item.description + (item.notes ? `\n${item.notes}` : ''),
                    quantity: item.quantity,
                    unit_price: item.unit_price
                })),
                discount: discountAmount,
                tax: taxAmount,
                deposit: depositAmount,
                notes: formData.notes
            });
            router.push('/quotations');
        } catch (error) {
            console.error('Failed to create quote:', error);
            alert('Failed to create quote');
        } finally {
            setIsLoading(false);
        }
    };

    const addNote = (text: string) => {
        setFormData(prev => ({
            ...prev,
            notes: (prev.notes ? prev.notes + '\n' : '') + text
        }));
    };

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-white transition-all duration-300 ease-in-out">
            
            {/* Header */}
            <header className="h-16 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <i className="ph-bold ph-arrow-left text-lg"></i>
                    </button>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <div>
                        <div className="flex items-center gap-2 text-xs font-[500] text-slate-500 mb-0.5">
                            <span>Quotations</span>
                            <i className="ph-bold ph-caret-right text-[10px] text-slate-300"></i>
                            <span className="text-slate-800">New</span>
                        </div>
                        <h1 className="text-lg font-[600] text-slate-900 tracking-tight leading-none">Create Quote</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Checklist Indicator */}
                    <div className="hidden md:flex items-center gap-3 mr-2">
                        <span className={`flex items-center gap-1 text-[10px] font-[600] uppercase tracking-wide ${formData.client_id ? 'text-emerald-500' : 'text-slate-400'}`}>
                            <i className={`ph-bold ${formData.client_id ? 'ph-check-circle' : 'ph-circle'}`}></i> Client
                        </span>
                        <span className={`flex items-center gap-1 text-[10px] font-[600] uppercase tracking-wide ${formData.issue_date ? 'text-emerald-500' : 'text-slate-400'}`}>
                            <i className={`ph-bold ${formData.issue_date ? 'ph-check-circle' : 'ph-circle'}`}></i> Date
                        </span>
                        <span className={`flex items-center gap-1 text-[10px] font-[600] uppercase tracking-wide ${total > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                            <i className={`ph-bold ${total > 0 ? 'ph-check-circle' : 'ph-circle'}`}></i> Total
                        </span>
                    </div>

                    <button 
                        onClick={() => handleSubmit()}
                        disabled={isLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-[550] shadow-subtle flex items-center gap-2 transition-smooth"
                    >
                        <i className="ph-bold ph-floppy-disk"></i>
                        <span>{isLoading ? 'Saving...' : 'Save Quote'}</span>
                    </button>
                </div>
            </header>
            
            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                <div className="max-w-5xl mx-auto space-y-6">
                    
                    {/* Metadata Card */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-8">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Client Selection */}
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-[600] text-slate-700">Client</label>
                                    <div className="relative">
                                        <select 
                                            value={formData.client_id}
                                            onChange={(e) => {
                                                if (e.target.value === 'new') {
                                                    setIsClientModalOpen(true);
                                                } else {
                                                    setFormData({ ...formData, client_id: e.target.value });
                                                }
                                            }}
                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-[450] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>Select a client...</option>
                                            {clients.map(client => (
                                                <option key={client.id} value={client.id}>{client.name} {client.company ? `(${client.company})` : ''}</option>
                                            ))}
                                            <option value="new" className="font-bold text-indigo-600">+ Create New Client</option>
                                        </select>
                                        <i className="ph-bold ph-caret-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                                    </div>
                                </div>
                                
                                {formData.client_id && (() => {
                                    const sc = clients.find(c => c.id === formData.client_id);
                                    if (!sc) return null;
                                    return (
                                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                            <p className="text-sm font-[600] text-slate-900">{sc.name}</p>
                                            {sc.company && <p className="text-xs text-slate-500 mt-1">{sc.company}</p>}
                                            {sc.email && <p className="text-xs text-slate-500">{sc.email}</p>}
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Quote Details */}
                            <div className="grid grid-cols-2 gap-4 h-fit">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-[600] text-slate-700">Quote Number</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-[600]">#</span>
                                        <input type="text" value="AUTO" disabled className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-[500] text-slate-600 focus:outline-none focus:border-slate-300 transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-[600] text-slate-700">Status</label>
                                    <div className="relative">
                                         <select 
                                            value={formData.status}
                                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                                            className="w-full pl-3 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-[450] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="sent">Sent</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="overdue">Overdue</option>
                                        </select>
                                        <i className="ph-bold ph-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-[600] text-slate-700">Issue Date</label>
                                    <input 
                                        type="date" 
                                        value={formData.issue_date}
                                        onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
                                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-[450] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-[600] text-slate-700">Valid Until</label>
                                    <input 
                                        type="date" 
                                        value={formData.valid_until}
                                        onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
                                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-[450] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Full Width Fields */}
                        <div className="space-y-6 pt-2">
                             <div className="space-y-1.5">
                                <label className="text-sm font-[600] text-slate-700">Project Title</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Website Redesign Phase 2"
                                    value={formData.reference}
                                    onChange={(e) => setFormData({...formData, reference: e.target.value})}
                                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-[450] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-[600] text-slate-700">Scope Description</label>
                                <textarea 
                                    placeholder="Describe the scope of work..."
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-[450] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-[600] text-slate-500 uppercase tracking-wide">
                                    <tr>
                                        <th className="px-6 py-3 w-[45%]">Item Description</th>
                                        <th className="px-4 py-3 w-[15%] text-right">Qty</th>
                                        <th className="px-4 py-3 w-[15%] text-right">Rate</th>
                                        <th className="px-6 py-3 w-[15%] text-right">Amount</th>
                                        <th className="px-4 py-3 w-[5%]"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {formData.items.map((item) => (
                                        <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 align-top">
                                                <input 
                                                    type="text" 
                                                    placeholder="Item Name" 
                                                    value={item.description}
                                                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                                    className="w-full font-[550] text-slate-900 border-none px-3 py-2 -ml-3 rounded-lg focus:ring-0 focus:bg-slate-50 placeholder:text-slate-300 mb-1 transition-colors"
                                                />
                                                <textarea 
                                                    rows={2} 
                                                    placeholder="Add description..." 
                                                    value={item.notes}
                                                    onChange={(e) => handleItemChange(item.id, 'notes', e.target.value)}
                                                    className="w-full text-xs text-slate-500 border-none px-3 py-2 -ml-3 rounded-lg focus:ring-0 focus:bg-slate-50 resize-y bg-transparent placeholder:text-slate-300 transition-colors leading-relaxed"
                                                ></textarea>
                                            </td>
                                            <td className="px-4 py-4 align-top">
                                                <input 
                                                    type="number" 
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                                    className="w-full text-right bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                                                />
                                            </td>
                                            <td className="px-4 py-4 align-top">
                                                <div className="relative">
                                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                                                    <input 
                                                        type="number" 
                                                        value={item.unit_price}
                                                        onChange={(e) => handleItemChange(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                                                        className="w-full text-right pl-5 pr-2 py-1 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-top text-right font-[600] text-slate-900 pt-5">
                                                ${(item.quantity * item.unit_price).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-4 align-top text-center pt-5">
                                                <button 
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="text-slate-300 hover:text-rose-500 transition-colors"
                                                >
                                                    <i className="ph-bold ph-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                            <button 
                                onClick={handleAddItem}
                                className="text-sm font-[600] text-indigo-600 hover:text-indigo-700 flex items-center gap-2 transition-colors"
                            >
                                <i className="ph-bold ph-plus-circle text-lg"></i>
                                Add Line Item
                            </button>
                        </div>
                    </div>

                    {/* Totals & Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Notes */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-[600] text-slate-700">Notes / Terms</label>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                <button type='button' onClick={() => addNote('Payment is due within 14 days of invoice date.')} className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-600 hover:bg-slate-200 transition-colors">
                                    + Payment Terms
                                </button>
                                <button type='button' onClick={() => addNote('Includes 2 rounds of minor revisions.')} className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-600 hover:bg-slate-200 transition-colors">
                                    + Revisions
                                </button>
                                <button type='button' onClick={() => addNote('Timeline: 4 weeks from project start.')} className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-600 hover:bg-slate-200 transition-colors">
                                    + Timeline
                                </button>
                            </div>

                            <textarea 
                                value={formData.notes}
                                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                rows={4} 
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-[450] text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-none" 
                                placeholder="e.g. Payment due within 14 days."
                            ></textarea>
                        </div>

                        {/* Calculations */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3 h-fit">
                            <div className="flex justify-between items-center text-sm text-slate-600">
                                <span>Subtotal</span>
                                <span className="font-[500]">${subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <span>Discount</span>
                                    <div className="relative w-16">
                                        <input 
                                            type="number" 
                                            value={formData.discount_percentage}
                                            onChange={(e) => setFormData({...formData, discount_percentage: parseFloat(e.target.value) || 0})}
                                            className="w-full pr-6 pl-1 py-0.5 text-right border-b border-slate-300 focus:border-indigo-500 focus:outline-none text-xs bg-transparent text-rose-500"
                                        />
                                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
                                    </div>
                                </div>
                                <span className="font-[500] text-rose-500">-${discountAmount.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <span>Tax</span>
                                    <div className="relative w-16">
                                        <input 
                                            type="number" 
                                            value={formData.tax_percentage}
                                            onChange={(e) => setFormData({...formData, tax_percentage: parseFloat(e.target.value) || 0})}
                                            className="w-full pr-6 pl-1 py-0.5 text-right border-b border-slate-300 focus:border-indigo-500 focus:outline-none text-xs bg-transparent"
                                        />
                                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
                                    </div>
                                </div>
                                <span className="font-[500]">${taxAmount.toFixed(2)}</span>
                            </div>

                            <div className="h-px bg-slate-100 my-2"></div>

                            <div className="flex justify-between items-center text-base font-[700] text-slate-900">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 border-dashed">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className="relative">
                                            <input 
                                                type="checkbox" 
                                                checked={formData.is_deposit_required}
                                                onChange={(e) => setFormData({...formData, is_deposit_required: e.target.checked})}
                                                className="sr-only peer" 
                                            />
                                            <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 transition-colors"></div>
                                            <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full peer-checked:translate-x-4 transition-transform"></div>
                                        </div>
                                        <span className="text-xs font-[600] text-slate-600">Required Deposit</span>
                                    </label>
                                    <div className={`relative w-20 transition-opacity ${formData.is_deposit_required ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                                        <input 
                                            type="number" 
                                            value={formData.deposit_percentage}
                                            onChange={(e) => setFormData({...formData, deposit_percentage: parseFloat(e.target.value) || 0})}
                                            className="w-full pr-6 pl-1 py-0.5 text-right border-b border-slate-300 focus:border-indigo-500 focus:outline-none text-xs bg-transparent"
                                        />
                                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
                                    </div>
                                </div>
                                <div className={`flex justify-between items-center text-sm font-[600] text-indigo-700 transition-opacity ${formData.is_deposit_required ? 'opacity-100' : 'opacity-50'}`}>
                                    <span>Due Now</span>
                                    <span>${depositAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Client Modal */}
            {isClientModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setIsClientModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-modal transition-all sm:my-8 sm:w-full sm:max-w-md">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-base font-[600] text-slate-900">Add New Client</h3>
                                <button onClick={() => setIsClientModalOpen(false)} type="button" className="text-slate-400 hover:text-slate-600">
                                    <i className="ph-bold ph-x"></i>
                                </button>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-[500] text-slate-700">Full Name <span className="text-rose-500">*</span></label>
                                    <input 
                                        type="text" 
                                        value={newClientData.name}
                                        onChange={(e) => setNewClientData({...newClientData, name: e.target.value})}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400" 
                                        placeholder="e.g. Jane Doe"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-[500] text-slate-700">Email Address <span className="text-rose-500">*</span></label>
                                    <input 
                                        type="email" 
                                        value={newClientData.email}
                                        onChange={(e) => setNewClientData({...newClientData, email: e.target.value})}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400" 
                                        placeholder="jane@company.com"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-[500] text-slate-700">Company Name <span className="text-slate-400 font-normal">(Opt)</span></label>
                                    <input 
                                        type="text" 
                                        value={newClientData.company}
                                        onChange={(e) => setNewClientData({...newClientData, company: e.target.value})}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400" 
                                        placeholder="e.g. Acme Inc."
                                    />
                                </div>
                            </div>

                            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                                <button onClick={() => setIsClientModalOpen(false)} className="px-3 py-1.5 text-xs font-[600] text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                                <button 
                                    onClick={handleSaveClient}
                                    disabled={isCreatingClient}
                                    className="px-3 py-1.5 text-xs font-[600] text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
                                >
                                    {isCreatingClient ? <i className="ph-bold ph-spinner animate-spin"></i> : null}
                                    Save & Select
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
