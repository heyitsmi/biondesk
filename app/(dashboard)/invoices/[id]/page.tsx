"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { invoicesApi } from '@/lib/api';
import { DocumentWithItems } from '@/lib/types';

export default function InvoiceDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [invoice, setInvoice] = useState<DocumentWithItems | null>(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const data = await invoicesApi.get(id);
                setInvoice(data);
            } catch (error) {
                console.error('Error fetching invoice:', error);
                router.push('/invoices');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchInvoice();
        }
    }, [id, router]);

    const handleSend = async () => {
        if (!invoice) return;
        // Logic to send invoice (e.g. open modal or direct API call)
        alert('Send functionality to be implemented');
    };

    const handleDownload = () => {
        // Logic to download PDF
        alert('Download functionality to be implemented');
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            unpaid: 'bg-amber-100 text-amber-700 border-amber-200',
            overdue: 'bg-rose-100 text-rose-700 border-rose-200',
            draft: 'bg-slate-100 text-slate-700 border-slate-200',
            sent: 'bg-blue-100 text-blue-700 border-blue-200',
            void: 'bg-slate-100 text-slate-500 border-slate-200',
        };
        const style = styles[status] || styles.draft;
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-[600] border ${style} capitalize`}>
                {status}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="flex-1 p-8 flex items-center justify-center">
                 <div className="flex flex-col items-center gap-3">
                    <i className="ph-bold ph-spinner animate-spin text-2xl text-indigo-600"></i>
                    <p className="text-slate-500 font-medium">Loading invoice...</p>
                </div>
            </div>
        );
    }

    if (!invoice) return null;

    // Calculations for display if needed
    // The API returns totals in the document root usually, assuming they were saved correctly.
    // If we need to re-calc:
    const subtotal = invoice.items?.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0) || 0;
    
    // Check if discount/tax are amounts or percentages in the DB.
    // Based on create page, we sent calculated amounts.
    const discountAmount = invoice.discount || 0;
    const taxAmount = invoice.tax || 0;
    const total = invoice.amount; // Should be grand total
    const depositAmount = invoice.deposit || 0;

    return (
        <div className="flex-1 flex flex-col h-full bg-slate-50/50 relative overflow-hidden">
            {/* Header */}
            <header className="h-16 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/invoices" className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <i className="ph-bold ph-arrow-left text-lg"></i>
                    </Link>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <div>
                        <div className="flex items-center gap-2 text-xs font-[500] text-slate-500 mb-0.5">
                            <span>Invoices</span>
                            <i className="ph-bold ph-caret-right text-[10px] text-slate-300"></i>
                            <span className="text-slate-800">{invoice.number}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg font-[600] text-slate-900 tracking-tight leading-none">{invoice.title || `Invoice ${invoice.number}`}</h1>
                            {invoice.status === 'overdue' ? (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100 flex items-center gap-1.5">
                                    <i className="ph-fill ph-warning-circle"></i> 
                                    {invoice.due_date ? `Overdue by ${Math.ceil((new Date().getTime() - new Date(invoice.due_date).getTime()) / (1000 * 3600 * 24))} days` : 'Overdue'}
                                </span>
                            ) : (
                                getStatusBadge(invoice.status)
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link 
                        href={`/invoices/${id}/edit`}
                        className="px-4 py-2 text-sm font-[550] text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all flex items-center gap-2"
                    >
                        <i className="ph-bold ph-pencil-simple"></i> Edit
                    </Link>
                    <div className="h-8 w-px bg-slate-200"></div>
                    <button 
                        onClick={handleDownload}
                        className="px-4 py-2 text-sm font-[550] text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all" 
                        title="Download PDF"
                    >
                        <i className="ph-bold ph-download-simple"></i>
                    </button>
                    <button 
                        onClick={handleSend}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-[550] shadow-subtle flex items-center gap-2 transition-smooth"
                    >
                        <i className="ph-bold ph-paper-plane-tilt"></i>
                        <span>{invoice.status === 'sent' ? 'Resend Invoice' : 'Send Invoice'}</span>
                    </button>
                </div>
            </header>

            {/* Main Workspace (Split View) */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* LEFT COLUMN: Document Preview (65%) */}
                <div className="flex-1 overflow-y-auto p-8 pb-16 scroller-thin flex justify-center">
                    
                    {/* A4 Paper Representation */}
                    <div className="w-full max-w-[210mm] bg-white shadow-paper border border-slate-200 min-h-[297mm] p-12 text-slate-800 text-sm leading-relaxed relative break-words">

                        {/* Document Header */}
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <div className="flex items-center gap-2 mb-4 text-indigo-600">
                                    {invoice.workspace?.logo_url ? (
                                        <img src={invoice.workspace.logo_url} alt="Logo" className="w-8 h-8 object-contain" />
                                    ) : (
                                        <i className="ph-fill ph-lightning text-2xl"></i>
                                    )}
                                    <span className="text-xl font-bold text-slate-900">{invoice.workspace?.name || 'Dealis.'}</span>
                                </div>
                                <div className="text-slate-500">
                                    {invoice.workspace?.address ? (
                                        invoice.workspace.address.split('\n').map((line: string, i: number) => (
                                            <p key={i}>{line}</p>
                                        ))
                                    ) : (
                                        <p className="text-slate-400 italic">Address not set</p>
                                    )}
                                    <p>Tax ID: 987-654-321</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">INVOICE</h1>
                                <p className="text-slate-500">#{invoice.number}</p>
                                <p className="text-slate-500 mt-1">Issue Date: {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}</p>
                                {invoice.due_date && (
                                    <p className={`${new Date(invoice.due_date) < new Date() && invoice.status !== 'paid' ? 'text-rose-600' : 'text-slate-600'} font-medium`}>
                                        Due Date: {new Date(invoice.due_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Client Info & Amount */}
                        <div className="mb-12 pb-8 border-b border-slate-100 flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Billed To</p>
                                {invoice.contact ? (
                                    <>
                                        <h3 className="text-lg font-bold text-slate-900">{invoice.contact.company || invoice.contact.name}</h3>
                                        <p className="text-slate-600">{invoice.contact.company ? `Attn: ${invoice.contact.name}` : invoice.contact.email}</p>
                                        <p className="text-slate-500">{invoice.contact.phone}</p>
                                    </>
                                ) : (
                                    <p className="text-slate-400 italic">No client selected</p>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Amount Due</p>
                                <h2 className="text-3xl font-bold text-indigo-600">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
                                {invoice.status === 'overdue' && (
                                    <span className="inline-flex items-center px-2 py-0.5 mt-2 rounded text-[10px] font-bold bg-rose-100 text-rose-700 uppercase">Overdue</span>
                                )}
                                {invoice.status === 'paid' && (
                                    <span className="inline-flex items-center px-2 py-0.5 mt-2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase">Paid</span>
                                )}
                            </div>
                        </div>

                        {/* Line Items */}
                        <div className="mb-12">
                            <table className="w-full text-left">
                                <thead className="border-b-2 border-slate-100 bg-slate-50/50">
                                    <tr>
                                        <th className="py-3 px-2 font-semibold text-slate-900 w-[50%]">Description</th>
                                        <th className="py-3 px-2 font-semibold text-slate-900 w-[15%] text-right">Qty</th>
                                        <th className="py-3 px-2 font-semibold text-slate-900 w-[15%] text-right">Rate</th>
                                        <th className="py-3 px-2 font-semibold text-slate-900 w-[20%] text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {invoice.items?.map((item, index) => (
                                        <tr key={index}>
                                            <td className="py-4 px-2 align-top">
                                                <p className="font-medium text-slate-900">{item.description.split('\n')[0]}</p>
                                                {item.description.includes('\n') && (
                                                    <p className="text-slate-500 text-xs mt-1 whitespace-pre-line">{item.description.split('\n').slice(1).join('\n')}</p>
                                                )}
                                            </td>
                                            <td className="py-4 px-2 align-top text-right text-slate-600">{item.quantity}</td>
                                            <td className="py-4 px-2 align-top text-right text-slate-600">${item.unit_price.toFixed(2)}</td>
                                            <td className="py-4 px-2 align-top text-right text-slate-900 font-medium">${(item.quantity * item.unit_price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="flex justify-end mb-12">
                            <div className="w-72 space-y-3">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-rose-600">
                                        <span>Discount</span>
                                        <span>-${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                {taxAmount > 0 && (
                                    <div className="flex justify-between text-slate-600">
                                        <span>Tax</span>
                                        <span>${taxAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="h-px bg-slate-200 my-2"></div>
                                <div className="flex justify-between text-lg font-bold text-slate-900">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                {depositAmount > 0 && (
                                    <div className="bg-slate-50 rounded-lg p-3 mt-4 border border-slate-100">
                                        <div className="flex justify-between text-sm font-[600] text-indigo-700 mb-1">
                                            <span>Deposit Required</span>
                                            <span>${depositAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>Remaining Balance</span>
                                            <span>${(total - depositAmount).toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                         {/* Payment Info Box */}
                        <div className="p-6 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Payment Instructions</p>
                            <div className="grid grid-cols-2 gap-8 text-sm">
                                <div>
                                    <p className="text-slate-500 mb-1">Bank Transfer</p>
                                    {(invoice.workspace?.bank_details as any)?.bank_name ? (
                                        <>
                                            <p className="font-medium text-slate-900">{(invoice.workspace?.bank_details as any).bank_name}</p>
                                            <p className="font-mono text-slate-700 mt-1">{(invoice.workspace?.bank_details as any).account_number}</p>
                                            <p className="text-slate-600">A/N: {(invoice.workspace?.bank_details as any).account_name || invoice.workspace?.name}</p>
                                        </>
                                    ) : (
                                        <p className="text-slate-400 italic">No bank details provided.</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-slate-500 mb-1">Notes</p>
                                    <p className="text-slate-600 leading-relaxed">
                                        {invoice.notes || `Please include invoice number #${invoice.number} in your transfer description. Thank you for your business!`}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* RIGHT COLUMN: Activity & Status (35%) */}
                <div className="w-[360px] bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-y-auto">
                    
                    {/* Status Timeline */}
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-sm font-[600] text-slate-900 mb-4">Invoice Timeline</h3>
                        
                        <div className="relative pl-4 border-l-2 border-slate-100 space-y-8">
                            
                            {/* Step 1: Created */}
                            <div className="relative">
                                <div className="absolute -left-[21px] w-3 h-3 bg-indigo-600 rounded-full border-2 border-white shadow-sm"></div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-900 uppercase">Created</span>
                                    <span className="text-xs text-slate-500">{new Date(invoice.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Conditional Steps based on Status */}
                            {invoice.status !== 'draft' && (
                                <div className="relative">
                                    <div className="absolute -left-[21px] w-3 h-3 bg-indigo-600 rounded-full border-2 border-white shadow-sm"></div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-900 uppercase">Sent</span>
                                        <span className="text-xs text-slate-500">{invoice.sent_at ? new Date(invoice.sent_at).toLocaleDateString() : 'Pending send...'}</span>
                                    </div>
                                </div>
                            )}

                             {invoice.status === 'paid' && (
                                <div className="relative">
                                    <div className="absolute -left-[21px] w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-emerald-600 uppercase">Paid</span>
                                        <span className="text-xs text-slate-500">{new Date(invoice.paid_at!).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            )}

                             {invoice.status === 'overdue' && (
                                <div className="relative">
                                    <div className="absolute -left-[21px] w-3 h-3 bg-rose-500 rounded-full border-2 border-white shadow-sm ring-4 ring-rose-50"></div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-rose-600 uppercase">Payment Overdue</span>
                                        <span className="text-xs text-slate-500">Due {new Date(invoice.due_date!).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Client Context */}
                    <div className="p-6 border-b border-slate-100">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-[600] text-slate-900">Client</h3>
                            {invoice.contact && (
                                <Link href={`/contacts?search=${invoice.contact.name}`} className="text-xs text-indigo-600 hover:underline">View Profile</Link>
                            )}
                        </div>
                        {invoice.contact && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 font-bold text-sm">
                                    {invoice.contact.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-[600] text-slate-900">{invoice.contact.name}</p>
                                    <p className="text-xs text-slate-500">{invoice.contact.email}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment Actions */}
                    <div className="p-6 bg-slate-50/50 flex-1">
                        <h3 className="text-sm font-[600] text-slate-900 mb-3">Collection Actions</h3>
                        <div className="space-y-3">
                            {/* Primary Action: Reminder */}
                            <button onClick={handleSend} className="w-full text-left p-3 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl shadow-sm transition-all flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                    <i className="ph-bold ph-paper-plane-right"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-[600] text-slate-700 group-hover:text-indigo-700">Send Reminder</p>
                                    <p className="text-[10px] text-slate-500">Gentle nudge via email</p>
                                </div>
                            </button>

                            {/* Secondary: Record Payment */}
                            <button className="w-full text-left p-3 bg-white border border-slate-200 hover:border-emerald-300 rounded-xl shadow-sm transition-all flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                    <i className="ph-bold ph-money"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-[600] text-slate-700 group-hover:text-emerald-700">Record Payment</p>
                                    <p className="text-[10px] text-slate-500">If paid offline / transfer</p>
                                </div>
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
