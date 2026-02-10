"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { invoicesApi, contactsApi, quotesApi } from '@/lib/api';
import { Contact, DocumentWithItems } from '@/lib/types';

interface InvoiceItem {
    id: string; // temp id
    description: string;
    notes: string;
    quantity: number;
    unit_price: number;
}

interface InvoiceFormData {
    client_id: string;
    title: string;
    reference: string;
    issue_date: string;
    due_date: string;
    items: InvoiceItem[];
    notes: string; // General notes
    terms: string; // Payment terms/instructions
    description: string; // Hidden scope description if needed, or mapped to title context
    discount_percentage: number;
    tax_percentage: number;
    deposit_percentage: number;
    is_deposit_required: boolean;
}

export default function CreateInvoicePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sourceQuoteId = searchParams.get('from_quote');

    const [isLoading, setIsLoading] = useState(false);
    const [clients, setClients] = useState<Contact[]>([]);
    const [acceptedQuotes, setAcceptedQuotes] = useState<DocumentWithItems[]>([]);
    const [isQuoteImportOpen, setIsQuoteImportOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState<InvoiceFormData>({
        client_id: '',
        title: '',
        reference: '', // PO Number
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Net 14
        items: [
            { id: '1', description: 'Professional Services', notes: '', quantity: 1, unit_price: 0 }
        ],
        notes: '',
        terms: 'Payment is due within 14 days. Please include invoice number on check.',
        description: '',
        discount_percentage: 0,
        tax_percentage: 0,
        deposit_percentage: 0,
        is_deposit_required: false,
    });

    // Client Modal State
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [newClientData, setNewClientData] = useState({ name: '', email: '', company: '' });
    const [isCreatingClient, setIsCreatingClient] = useState(false);

    useEffect(() => {
        fetchClients();
        fetchAcceptedQuotes();
    }, []);

    // Load source quote if present in URL
    useEffect(() => {
        if (sourceQuoteId && acceptedQuotes.length > 0) {
            importQuote(sourceQuoteId);
        }
    }, [sourceQuoteId, acceptedQuotes]);

    const fetchClients = async () => {
        try {
            const data = await contactsApi.list({ limit: 100 });
            setClients(data.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const fetchAcceptedQuotes = async () => {
        try {
            const data = await quotesApi.list({ status: 'accepted', limit: 20 });
            setAcceptedQuotes(data.data);
        } catch (error) {
            console.error('Error fetching quotes:', error);
        }
    };

    const importQuote = async (quoteId: string) => {
        const quote = acceptedQuotes.find(q => q.id === quoteId);
        if (!quote) return;

        // Map quote to invoice
        setFormData(prev => ({
            ...prev,
            client_id: quote.contact_id || '',
            title: quote.title || '',
            reference: quote.reference || '', // Maybe use Quote Number as reference?
            items: (quote.items || []).map(item => {
                const [title, ...notesParts] = (item.description || '').split('\n');
                return {
                    id: Math.random().toString(36).substr(2, 9),
                    description: title || '',
                    notes: notesParts.join('\n') || '',
                    quantity: item.quantity,
                    unit_price: item.unit_price
                };
            }),
            discount_percentage: 0, // Need to back-calculate if only amount stored? Document stores amount.
            // If document stores percentage, we should use it. checking types... Document has discount number (amount).
            // We'll leave 0 for now or try to calc.
            tax_percentage: 0,
            notes: quote.notes || prev.notes,
            terms: quote.terms || prev.terms,
        }));
        setIsQuoteImportOpen(false);
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
        if (!newClientData.name || !newClientData.email) return;
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
        } finally {
            setIsCreatingClient(false);
        }
    };

    const handleSubmit = async (saveAsStatus: 'draft' | 'sent' | null = null) => {
        if (!formData.client_id) {
            alert('Please select a client');
            return;
        }

        const finalStatus = saveAsStatus || 'draft';

        setIsLoading(true);
        try {
            await invoicesApi.create({
                contact_id: formData.client_id,
                title: formData.title || 'Untitled Invoice', 
                content: formData.description,
                status: finalStatus as any,
                due_date: formData.due_date,
                valid_until: formData.due_date, // Map due_date to valid_until as well?
                reference: formData.reference,
                amount: total,
                items: formData.items.map(item => ({
                    description: item.description + (item.notes ? `\n${item.notes}` : ''),
                    quantity: item.quantity,
                    unit_price: item.unit_price
                })),
                discount: discountAmount,
                tax: taxAmount,
                deposit: depositAmount,
                notes: formData.notes,
                terms: formData.terms
            });
            router.push('/invoices');
        } catch (error) {
            console.error('Failed to create invoice:', error);
            alert('Failed to create invoice');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-white transition-all duration-300 ease-in-out">
            <header className="h-auto md:h-16 px-4 md:px-8 py-4 md:py-0 flex flex-col md:flex-row items-start md:items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 shrink-0 gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Link href="/invoices" className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <i className="ph-bold ph-arrow-left text-lg"></i>
                    </Link>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <div>
                        <div className="flex items-center gap-2 text-xs font-[500] text-slate-500 mb-0.5">
                            <span>Invoices</span>
                            <i className="ph-bold ph-caret-right text-[10px] text-slate-300"></i>
                            <span className="text-slate-800">New</span>
                        </div>
                        <h1 className="text-lg font-[600] text-slate-900 tracking-tight leading-none">Create Invoice</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => handleSubmit('draft')}
                        disabled={isLoading}
                        className="flex-1 md:flex-none justify-center bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-5 py-2 rounded-lg text-sm font-[550] shadow-sm flex items-center gap-2 transition-all whitespace-nowrap"
                    >
                        <span>Save Draft</span>
                    </button>
                    <button 
                        onClick={() => handleSubmit('sent')}
                        disabled={isLoading}
                        className="flex-1 md:flex-none justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-[550] shadow-subtle flex items-center gap-2 transition-smooth whitespace-nowrap"
                    >
                        <i className="ph-bold ph-paper-plane-tilt"></i>
                        <span>{isLoading ? 'Saving...' : 'Save & Send'}</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
                <div className="max-w-5xl mx-auto space-y-6">
                    
                    {/* Import Quote Banner */}
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between relative gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <i className="ph ph-file-text text-indigo-600 text-lg"></i>
                            </div>
                            <div>
                                <p className="text-sm font-[600] text-indigo-900">Create from existing quote?</p>
                                <p className="text-xs text-indigo-700">Import line items from an accepted quote</p>
                            </div>
                        </div>
                            <button 
                                onClick={() => setIsQuoteImportOpen(!isQuoteImportOpen)}
                                className="w-full sm:w-auto px-4 py-2 bg-white border border-indigo-200 text-indigo-700 text-sm font-[600] rounded-lg hover:border-indigo-300 transition-all text-center"
                            >
                                Select Quote
                            </button>
                        
                        {isQuoteImportOpen && (
                            <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in-up">
                                <div className="p-2 max-h-60 overflow-y-auto">
                                    {acceptedQuotes.length === 0 ? (
                                        <p className="p-3 text-sm text-slate-500 text-center">No accepted quotes found.</p>
                                    ) : (
                                        acceptedQuotes.map(quote => (
                                            <button 
                                                key={quote.id}
                                                onClick={() => importQuote(quote.id)}
                                                className="w-full text-left p-2 hover:bg-slate-50 rounded-lg transition-colors group"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <span className="font-[600] text-sm text-slate-900">{quote.number}</span>
                                                    <span className="text-xs font-[500] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">Accepted</span>
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1 truncate">{quote.title}</div>
                                                <div className="text-xs text-slate-400 mt-0.5">{quote.contact?.name}</div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-[600] text-slate-700">Client</label>
                                    <div className="relative">
                                        <select 
                                            value={formData.client_id}
                                            onChange={(e) => {
                                                if (e.target.value === 'new') setIsClientModalOpen(true);
                                                else setFormData({ ...formData, client_id: e.target.value });
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-fit">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-[600] text-slate-700">Invoice Number</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-[600]">#</span>
                                        <input type="text" value="AUTO" disabled className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-[500] text-slate-600" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-[600] text-slate-700">PO / Reference</label>
                                    <input 
                                        type="text" 
                                        value={formData.reference}
                                        onChange={(e) => setFormData({...formData, reference: e.target.value})}
                                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        placeholder="e.g. PO-1234"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-[600] text-slate-700">Issue Date</label>
                                    <input 
                                        type="date" 
                                        value={formData.issue_date}
                                        onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
                                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-[600] text-slate-700">Due Date</label>
                                    <input 
                                        type="date" 
                                        value={formData.due_date}
                                        onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-[600] text-slate-700">Invoice Title</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Website Development - Phase 1"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-[450] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
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
                                                    rows={1} 
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
                                                <button onClick={() => handleRemoveItem(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                                                    <i className="ph-bold ph-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4 p-4">
                            {formData.items.map((item, index) => (
                                <div key={item.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-1">
                                            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Item</label>
                                            <input 
                                                type="text" 
                                                placeholder="Item Name" 
                                                value={item.description}
                                                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                                className="w-full font-[550] text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-300 mb-2"
                                            />
                                            <textarea 
                                                rows={2} 
                                                placeholder="Add description..." 
                                                value={item.notes}
                                                onChange={(e) => handleItemChange(item.id, 'notes', e.target.value)}
                                                className="w-full text-sm text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none placeholder:text-slate-300"
                                            ></textarea>
                                        </div>
                                        <button onClick={() => handleRemoveItem(item.id)} className="text-slate-400 hover:text-rose-500 p-1">
                                            <i className="ph-bold ph-trash text-lg"></i>
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Qty</label>
                                            <input 
                                                type="number" 
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Rate</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                                                <input 
                                                    type="number" 
                                                    value={item.unit_price}
                                                    onChange={(e) => handleItemChange(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                                                    className="w-full pl-6 pr-3 py-2 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                        <span className="text-xs font-semibold text-slate-500 uppercase">Amount</span>
                                        <span className="font-[600] text-slate-900">${(item.quantity * item.unit_price).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                            <button onClick={handleAddItem} className="text-sm font-[600] text-indigo-600 hover:text-indigo-700 flex items-center gap-2 transition-colors">
                                <i className="ph-bold ph-plus-circle text-lg"></i> Add Line Item
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-sm font-[600] text-slate-700">Payment Instructions / Terms</label>
                             <div className="flex flex-wrap gap-2">
                                <button type='button' onClick={() => setFormData(prev => ({...prev, terms: 'Payment due on receipt.'}))} className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-600 hover:bg-slate-200">+ Due on Receipt</button>
                                <button type='button' onClick={() => setFormData(prev => ({...prev, terms: 'Payment due within 14 days.'}))} className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-600 hover:bg-slate-200">+ Net 14</button>
                                <button type='button' onClick={() => setFormData(prev => ({...prev, terms: 'Payment due within 30 days.'}))} className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-600 hover:bg-slate-200">+ Net 30</button>
                            </div>
                            <textarea 
                                value={formData.terms}
                                onChange={(e) => setFormData({...formData, terms: e.target.value})}
                                rows={4} 
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-[450] text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none" 
                                placeholder="Payment details..."
                            ></textarea>
                            
                            <label className="text-sm font-[600] text-slate-700 block mt-4">Private Notes (Internal)</label>
                            <textarea 
                                value={formData.notes}
                                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                rows={2} 
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-[450] text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none" 
                                placeholder="Internal notes..."
                            ></textarea>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6 space-y-3 h-fit">
                            <div className="flex justify-between items-center text-sm text-slate-600">
                                <span>Subtotal</span>
                                <span className="font-[500]">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <span>Discount</span>
                                    <div className="relative w-16">
                                        <input type="number" value={formData.discount_percentage} onChange={(e) => setFormData({...formData, discount_percentage: parseFloat(e.target.value) || 0})} className="w-full pr-6 pl-1 py-0.5 text-right border-b border-slate-300 focus:border-indigo-500 focus:outline-none text-xs bg-transparent text-rose-500"/>
                                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
                                    </div>
                                </div>
                                <span className="font-[500] text-rose-500">-${discountAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <span>Tax</span>
                                    <div className="relative w-16">
                                        <input type="number" value={formData.tax_percentage} onChange={(e) => setFormData({...formData, tax_percentage: parseFloat(e.target.value) || 0})} className="w-full pr-6 pl-1 py-0.5 text-right border-b border-slate-300 focus:border-indigo-500 focus:outline-none text-xs bg-transparent"/>
                                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
                                    </div>
                                </div>
                                <span className="font-[500]">${taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-slate-100 my-2"></div>
                            <div className="flex justify-between items-center text-base font-[700] text-slate-900">
                                <span>Total Due</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Client Modal */}
            {isClientModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsClientModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-modal max-w-md w-full relative overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-base font-[600] text-slate-900">Add New Client</h3>
                                <button onClick={() => setIsClientModalOpen(false)}><i className="ph-bold ph-x text-slate-400"></i></button>
                            </div>
                            <div className="p-6 space-y-4">
                                <input type="text" value={newClientData.name} onChange={(e) => setNewClientData({...newClientData, name: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm" placeholder="Full Name *" />
                                <input type="email" value={newClientData.email} onChange={(e) => setNewClientData({...newClientData, email: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm" placeholder="Email Address *" />
                                <input type="text" value={newClientData.company} onChange={(e) => setNewClientData({...newClientData, company: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm" placeholder="Company Name (Opt)" />
                            </div>
                            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                                <button onClick={() => setIsClientModalOpen(false)} className="px-3 py-1.5 text-xs font-[600] text-slate-600 hover:bg-slate-200 rounded-lg">Cancel</button>
                                <button onClick={handleSaveClient} disabled={isCreatingClient} className="px-3 py-1.5 text-xs font-[600] text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1">
                                    {isCreatingClient && <i className="ph-bold ph-spinner animate-spin"></i>} Save & Select
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
