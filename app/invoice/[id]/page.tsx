"use client";

import { useState, useEffect, use, useRef } from 'react';
import { publicApi } from '@/lib/api';
import { DocumentWithItems } from '@/lib/types';
import Link from 'next/link';
import { useReactToPrint } from 'react-to-print';


export default function PublicInvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [invoice, setInvoice] = useState<DocumentWithItems | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: invoice ? `Invoice ${invoice.number}` : 'Invoice',
    });

    useEffect(() => {
        const fetchInvoice = async () => {
             try {
                const data = await publicApi.getDocument(id);
                // Ensure it is an invoice? Or just display whatever it is? 
                // Ideally check data.type === 'invoice'
                setInvoice(data);
            } catch (error) {
                console.error('Error fetching public invoice:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInvoice();
    }, [id]);

    const handlePay = () => {
        alert('Payment integration pending.');
    };

    if (isLoading) {
        return (
            <div className="font-sans antialiased text-slate-900 min-h-screen flex flex-col bg-slate-100">
                 <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm h-16 shrink-0" />
                 <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-start">
                     <div className="flex-1 w-full">
                         <div className="bg-white shadow-paper rounded-sm border border-slate-200 aspect-[210/297] p-12 space-y-8 animate-pulse">
                              <div className="flex justify-between">
                                  <div className="space-y-3">
                                      <div className="w-32 h-8 bg-slate-200 rounded"></div>
                                      <div className="w-48 h-4 bg-slate-200 rounded"></div>
                                  </div>
                                  <div className="space-y-3 flex flex-col items-end">
                                      <div className="w-40 h-8 bg-slate-200 rounded"></div>
                                      <div className="w-32 h-4 bg-slate-200 rounded"></div>
                                  </div>
                              </div>
                              <div className="space-y-4 pt-12">
                                  <div className="w-full h-8 bg-slate-100 rounded"></div>
                                  <div className="w-full h-32 bg-slate-50 rounded"></div>
                              </div>
                         </div>
                     </div>
                 </main>
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 flex-col gap-4">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                    <i className="ph-bold ph-file-x text-3xl"></i>
                </div>
                <h1 className="text-xl font-semibold text-slate-900">Invoice not found</h1>
                <p className="text-slate-500">This link may be invalid or expired.</p>
            </div>
        );
    }

    // Calculations
    const subtotal = invoice.items?.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0) || 0;
    const total = invoice.amount;
    const discountAmount = invoice.discount || 0;
    const taxAmount = invoice.tax || 0;
    const depositAmount = invoice.deposit || 0;
    const isPaid = invoice.status === 'paid';
    const isOverdue = invoice.status === 'overdue' || (invoice.due_date && new Date(invoice.due_date) < new Date() && !isPaid);
    const daysOverdue = invoice.due_date && isOverdue ? Math.ceil((new Date().getTime() - new Date(invoice.due_date).getTime()) / (1000 * 3600 * 24)) : 0;

    return (
        <div className="font-sans antialiased text-slate-900 min-h-screen flex flex-col bg-slate-100">
             <style jsx global>{`
                .paper-texture { 
                    background-image: radial-gradient(#f8fafc 1px, transparent 1px); 
                    background-size: 20px 20px; 
                }
                @media print {
                    @page { margin: 0; }
                    body { background: white; }
                    .print\:shadow-none { shadow: none; }
                }
             `}</style>
             {/* TOP BAR */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         {invoice.workspace?.logo_url ? (
                            <img 
                                src={invoice.workspace.logo_url} 
                                alt={invoice.workspace.name} 
                                className="w-8 h-8 rounded-lg object-contain bg-white"
                            />
                        ) : (
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                                <i className="ph-bold ph-lightning text-lg"></i>
                            </div>
                        )}
                        <span className="text-lg font-[650] tracking-tight">{invoice.workspace?.name || 'Dealis Studio'}</span>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                        <i className="ph-fill ph-lock-key text-emerald-500"></i>
                         Secure Payment by {invoice.workspace?.name || 'Dealis'}
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-start">
                
                {/* LEFT: Invoice Document */}
                <div className="flex-1 w-full animate-fade-in-up">
                    
                    {/* Status Banners */}
                    {isPaid && (
                        <div className="mb-6 bg-emerald-50 border border-emerald-100 rounded-xl p-4 shadow-sm flex items-center justify-between border-l-4 border-l-emerald-500">
                            <div>
                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Paid in Full</p>
                                <p className="text-sm font-medium text-slate-900">This invoice was paid on {invoice.paid_at ? new Date(invoice.paid_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Unknown Date'}</p>
                            </div>
                             <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <i className="ph-fill ph-check text-xl"></i>
                            </div>
                        </div>
                    )}

                    <div ref={printRef} className="bg-white shadow-paper rounded-sm border border-slate-200 min-h-[600px] sm:min-h-[800px] p-8 sm:p-12 relative overflow-hidden print:shadow-none print:border-none print:m-0 print:p-8 paper-texture">
                         {isOverdue && !isPaid && (
                             <div className="absolute top-12 right-12 opacity-10 pointer-events-none transform rotate-12">
                                 <span className="text-8xl font-black text-rose-600 border-4 border-rose-600 px-4 py-2 rounded-xl uppercase tracking-widest">Overdue</span>
                             </div>
                         )}
                         {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-12 gap-6">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">INVOICE</h1>
                                <p className="text-slate-500 font-medium">{invoice.number}</p>
                            </div>
                            <div className="text-left sm:text-right">
                                <p className="text-sm text-slate-500">Issued: {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}</p>
                                {invoice.due_date && (
                                     <p className={`text-sm font-semibold ${isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>Due Date: {new Date(invoice.due_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</p>
                                )}
                            </div>
                        </div>

                         {/* Addresses */}
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12 pb-8 border-b border-slate-100">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">From</p>
                                <h3 className="font-bold text-slate-900">{invoice.workspace?.name || 'Flova Studio'}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                    {invoice.workspace?.address || 'Address not available'}
                                </p>
                            </div>
                            <div className="sm:text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Bill To</p>
                                <h3 className="font-bold text-slate-900">{invoice.contact?.name || 'Valued Client'}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {invoice.contact?.company && <>{invoice.contact.company}<br/></>}
                                    {invoice.contact?.email}
                                </p>
                            </div>
                        </div>

                        {/* Title/Description */}
                         <div className="mb-10">
                            <h3 className="text-lg font-bold text-slate-900 mb-3">{invoice.title}</h3>
                            {invoice.content && (
                                <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {invoice.content}
                                </div>
                            )}
                        </div>

                        {/* Line Items */}
                        <div className="mb-12 overflow-x-auto">
                            <table className="w-full text-left min-w-[500px]">
                                <thead className="border-b-2 border-slate-100">
                                    <tr>
                                        <th className="py-3 font-semibold text-slate-900 w-[50%]">Description</th>
                                        <th className="py-3 font-semibold text-slate-900 w-[15%] text-right">Qty</th>
                                        <th className="py-3 font-semibold text-slate-900 w-[15%] text-right">Price</th>
                                        <th className="py-3 font-semibold text-slate-900 w-[20%] text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {invoice.items?.map((item) => (
                                        <tr key={item.id}>
                                            <td className="py-4 align-top">
                                                <p className="font-medium text-slate-900">{item.description?.split('\n')[0]}</p>
                                                {item.description?.split('\n').slice(1).join('\n') && (
                                                    <p className="text-slate-500 text-xs mt-1 whitespace-pre-line">{item.description.split('\n').slice(1).join('\n')}</p>
                                                )}
                                            </td>
                                            <td className="py-4 align-top text-right text-slate-600">{item.quantity}</td>
                                            <td className="py-4 align-top text-right text-slate-600">${item.unit_price.toFixed(2)}</td>
                                            <td className="py-4 align-top text-right text-slate-900 font-medium">${(item.quantity * item.unit_price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                         {/* Totals */}
                         <div className="flex justify-end mb-12">
                            <div className="w-72 space-y-3">
                                <div className="flex justify-between text-slate-600 text-sm">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-slate-600 text-sm">
                                        <span>Discount</span>
                                        <span className="text-rose-500">-${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                {taxAmount > 0 && (
                                    <div className="flex justify-between text-slate-600 text-sm">
                                        <span>Tax</span>
                                        <span>${taxAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="h-px bg-slate-200 my-2"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-base font-bold text-slate-900">Total</span>
                                    <span className="text-xl font-bold text-indigo-700">${total.toFixed(2)}</span>
                                </div>
                                {depositAmount > 0 && (
                                    <div className="flex justify-between items-center text-sm font-semibold text-slate-700 bg-slate-50 p-2 rounded">
                                        <span>Deposit / Paid</span>
                                        <span>${depositAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                {isPaid && (
                                     <div className="flex justify-between items-center text-sm font-bold text-emerald-600 mt-2">
                                        <span>Amount Due</span>
                                        <span>$0.00</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Payment Details */}
                        {(invoice.workspace?.bank_details as any)?.bank_name && !isPaid && (
                            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-sm mb-8">
                                <p className="font-bold text-slate-900 mb-2">Bank Transfer Details</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-slate-500 text-xs uppercase tracking-wide">Bank</p>
                                        <p className="font-medium">{(invoice.workspace?.bank_details as any).bank_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs uppercase tracking-wide">Account Number</p>
                                        <p className="font-mono font-medium">{(invoice.workspace?.bank_details as any).account_number}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <p className="text-slate-500 text-xs uppercase tracking-wide">Account Name</p>
                                        <p className="font-medium">{(invoice.workspace?.bank_details as any).account_name || invoice.workspace?.name}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                         {/* Terms */}
                         {invoice.terms && (
                            <div className={`pt-8 ${!((invoice.workspace?.bank_details as any)?.bank_name && !isPaid) ? 'border-t border-slate-100' : ''} text-sm`}>
                                <p className="font-bold text-slate-900 mb-2">Payment Instructions / Terms</p>
                                <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                                    {invoice.terms}
                                </p>
                            </div>
                        )}
                        {invoice.notes && (
                            <div className="pt-8 text-sm">
                                <p className="font-bold text-slate-900 mb-2">Notes</p>
                                <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                                    {invoice.notes}
                                </p>
                            </div>
                        )}

                    </div>
                </div>

                {/* RIGHT: Action Panel */}
                <div className="lg:w-[360px] flex-shrink-0 space-y-6 lg:sticky lg:top-24 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="bg-white border border-slate-200 shadow-floating rounded-2xl p-6 overflow-hidden relative">
                         {isOverdue && !isPaid && (
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500"></div>
                         )}
                         {!isPaid ? (
                            <>
                                <div className="mb-6">
                                    <p className="text-sm text-slate-500 mb-1">Amount Due</p>
                                    <h2 className="text-3xl font-[700] text-slate-900">${(total - (isPaid ? total : 0)).toFixed(2)}</h2>
                                    
                                    {isOverdue ? (
                                        <div className="mt-3 flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg text-xs font-bold border border-rose-100">
                                            <i className="ph-fill ph-warning"></i>
                                            Overdue by {daysOverdue} days
                                        </div>
                                    ) : (
                                        invoice.due_date && (
                                            <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border text-slate-600 bg-slate-50 border-slate-100">
                                                <i className="ph-fill ph-calendar-blank"></i>
                                                Due {new Date(invoice.due_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                            </div>
                                        )
                                    )}
                                </div>
                                
                                <button 
                                    onClick={handlePay}
                                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all"
                                >
                                    <i className="ph-bold ph-credit-card"></i> Pay Invoice
                                </button>
                                <p className="text-xs text-center text-slate-400 mt-3 flex items-center justify-center gap-1">
                                    <i className="ph-fill ph-lock-key"></i> Secure encrypted payment
                                </p>
                            </>
                         ) : (
                             <div className="text-center py-4">
                                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                     <i className="ph-fill ph-check text-3xl"></i>
                                 </div>
                                 <h3 className="text-xl font-bold text-slate-900 mb-1">Invoice Paid</h3>
                                 <p className="text-slate-500 text-sm">No further action required.</p>
                             </div>
                         )}
                    </div>
                    
                     <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4">
                        <button 
                            onClick={() => handlePrint()}
                            className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <i className="ph-bold ph-download-simple"></i>
                                </div>
                                <span className="text-sm font-semibold text-slate-700">Download PDF</span>
                            </div>
                            <i className="ph-bold ph-caret-right text-slate-300 group-hover:text-indigo-400"></i>
                        </button>
                    </div>

                    <div className="text-center">
                        <a href="#" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors">
                            <i className="ph-fill ph-lightning"></i> Powered by Flova
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
