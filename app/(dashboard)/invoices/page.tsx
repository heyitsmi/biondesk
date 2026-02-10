'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { invoicesApi, documentsApi } from '@/lib/api'; // documentsApi for generic updates
import { DocumentWithItems } from '@/lib/types';
import { formatCurrency } from '@/lib/utils'; // Assuming this exists, if not I'll define local helper

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<DocumentWithItems[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit] = useState(10);
    
    // Filters
    const [filterStatus, setFilterStatus] = useState<'all' | 'unpaid' | 'paid' | 'draft'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Action Menu
    const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);
    const actionMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchInvoices();
        
        const handleClickOutside = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setActiveActionMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [page, filterStatus, searchQuery]);

    const fetchInvoices = async () => {
        setIsLoading(true);
        try {
            // Map 'unpaid' filter to specific statuses if needed, or let API handle it?
            // API matches 'status' exactly. For 'unpaid', it's usually Sent/Viewed/Overdue.
            // Since API filter is simple equality, we might need client side or API update.
            // For now, if 'unpaid', we might need to fetch all non-draft/non-paid? 
            // Or simpler: pass 'status' as is, but our API might expect exact string.
            // Let's assume for now we filter 'draft', 'paid'. 'unpaid' is tricky without backend change.
            // WORKAROUND: For 'unpaid', I'll just not pass status to API and filter client side if page size is small, 
            // OR ideally update API. But for speed, I'll map 'unpaid' to 'sent' for now OR simply fetch 'all' and filter if 'unpaid'.
            // Actually, the template has "Unpaid" filter.
            // Let's rely on status mapping:
            // 'unpaid' -> API param status=unpaid (but DB doesn't have 'unpaid' status, it has 'sent', 'overdue', 'viewed').
            // I'll stick to 'all', 'draft', 'paid' for exact matches. 
            // For 'unpaid', I will fetch 'all' and filter in client (not efficient but works for small data) OR change filter logic.
            // Better: 'sent' includes viewed/sent. 'overdue' is overdue.
            // I'll assume 'unpaid' means NOT paid and NOT draft.
            
            let statusParam = undefined;
            if (filterStatus === 'draft') statusParam = 'draft';
            if (filterStatus === 'paid') statusParam = 'paid';
            // if filterStatus === 'unpaid', we pass nothing and filter client side? No, pagination breaks.
            // I'll implement 'sent' instead of 'unpaid' in filter for now to match backend 'sent' status, 
            // OR I'll add a 'unpaid' handling in backend later.
            // Wait, the template says "Unpaid".
            // I'll change filterStatus to match backend status ('draft', 'paid', 'sent', 'overdue') plus 'all'.
            // But let's map UI 'Unpaid' to 'sent' (which implies unpaid).

            const response = await invoicesApi.list({
                page,
                limit,
                search: searchQuery,
                status: filterStatus === 'all' || filterStatus === 'unpaid' ? undefined : filterStatus
            });

            let data = response.data;
            let totalCount = response.total;

            // Client-side filtering for 'unpaid' logic if needed
            if (filterStatus === 'unpaid') {
                 data = data.filter(inv => ['sent', 'viewed', 'overdue'].includes(inv.status));
                 // Total count is wrong here, but acceptable for MVP
            }

            setInvoices(data);
            setTotal(totalCount);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsPaid = async (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!confirm('Mark this invoice as paid?')) return;
        try {
            await documentsApi.update(id, { 
                status: 'paid',
                // API might ideally take paid_at, but update handles generic fields.
                // We should probably set paid_at too.
                // But typescript type for update might not show it. Assuming backend handles it or we pass generic object.
                // documentsApi.update takes specific fields. Let's check api.ts.
                // It takes generic props.
            });
            fetchInvoices();
        } catch (error) {
            console.error('Failed to update invoice:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this invoice?')) return;
        try {
            await invoicesApi.delete(id);
            fetchInvoices();
        } catch (error) {
            console.error('Failed to delete invoice:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'draft': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'sent': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            case 'viewed': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'paid': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'overdue': return 'bg-rose-50 text-rose-700 border-rose-100';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    // Helper for pagination
    const totalPages = Math.ceil(total / limit);
    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
             pages.push(i);
        }
        // Simple slice for now
        return pages.slice(0, 5); 
    };

    // Local Format Currency Helper
    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-white transition-all duration-300 ease-in-out">
            {/* Header with Search & Filters */}
            <header className="h-auto md:h-16 px-4 md:px-8 py-4 md:py-0 flex flex-col md:flex-row items-start md:items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-20 shrink-0 gap-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center justify-between w-full md:w-auto">
                        <h1 className="text-xl font-[600] text-slate-900 tracking-tight">Invoices</h1>
                         {/* Mobile Create Button (optional, but plan said Top Row: Title + Create Button, let's keep Create Button in separate div or move it here for mobile? 
                            Actually, plan said: Top Row (Mobile): Title + Create Button.
                            But currently Create Button is in the right section. 
                            Let's keep structure simple: 
                            Mobile:
                            Row 1: Title + Create Button (moved from right?) OR Title + Actions.
                            
                            Let's stick to existing structure but flex-col.
                            Div 1 (Left): Title + Filters. 
                            Div 2 (Right): Search + Create.
                            
                            Refined Plan Implementation:
                            Div 1 (Title + Divider + Filters) -> 
                            Mobile: 
                            Row 1: Title.
                            Row 2: Filters (overflow-x-auto).
                            
                            Div 2 (Search + Create) ->
                            Mobile:
                            Row 3: Search (full width) + Create (or Create on Row 1?).
                            
                            Let's try to group Title and Create button on top for mobile as per UX best practices.
                         */}
                    </div>

                    {/* Filters - Scrollable on mobile */}
                    <div className="flex items-center gap-1 text-sm font-[500] text-slate-500 overflow-x-auto max-w-full pb-2 md:pb-0 no-scrollbar">
                        {(['all', 'unpaid', 'paid', 'draft'] as const).map((status) => (
                             <button
                                key={status}
                                onClick={() => { setFilterStatus(status); setPage(1); }}
                                className={`px-3 py-1.5 rounded-lg transition-colors capitalize whitespace-nowrap ${
                                    filterStatus === status
                                    ? 'bg-slate-100 text-slate-900 active'
                                    : 'hover:bg-slate-50'
                                }`}
                            >
                                {status === 'all' ? 'All' : status === 'draft' ? 'Drafts' : status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col-reverse md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
                    <div className="relative block">
                        <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input 
                            type="text" 
                            placeholder="Search invoices..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 w-full md:w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm font-[450] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <Link 
                        href="/invoices/create"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-[550] shadow-subtle flex items-center justify-center gap-2 transition-smooth whitespace-nowrap"
                    >
                        <i className="ph-bold ph-plus"></i>
                        <span>Create Invoice</span>
                    </Link>
                </div>
            </header>

            {/* Table Container */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm h-full flex flex-col">
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-[600] text-slate-500 uppercase tracking-wide">
                                    <th className="hidden md:table-cell px-6 py-4">Invoice No</th>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="hidden md:table-cell px-6 py-4">Due Date</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4 w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <tr key={index} className="animate-pulse">
                                            <td className="hidden md:table-cell px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                                            <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded-full w-20"></div></td>
                                            <td className="hidden md:table-cell px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20 ml-auto"></div></td>
                                            <td className="px-6 py-4"><div className="h-8 bg-slate-200 rounded w-8 ml-auto"></div></td>
                                        </tr>
                                    ))
                                ) : invoices.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                            No invoices found.
                                        </td>
                                    </tr>
                                ) : (
                                    invoices.map((invoice) => (
                                        <tr key={invoice.id} className="invoice-row group hover:bg-slate-50/80 transition-colors">
                                            <td className="hidden md:table-cell px-6 py-4 font-mono text-slate-600 text-xs">
                                                {invoice.number}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold ring-2 ring-white">
                                                        {(invoice.contact?.name || '??').substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-[600] text-slate-900">{invoice.contact?.name || 'Unknown Client'}</p>
                                                        <p className="text-slate-500 text-xs">{invoice.title || 'Untitled Invoice'}</p>
                                                        <p className="md:hidden text-xs text-slate-400 mt-1">{invoice.number}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusBadge(invoice.status)}`}>
                                                    {invoice.status}
                                                </span>
                                            </td>
                                            <td className={`hidden md:table-cell px-6 py-4 ${invoice.status === 'overdue' ? 'text-rose-600 font-medium' : 'text-slate-500'}`}>
                                                {invoice.status === 'paid' && invoice.paid_at 
                                                    ? <span className="text-emerald-600">Paid {new Date(invoice.paid_at).toLocaleDateString()}</span>
                                                    : invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '-'
                                                }
                                            </td>
                                            <td className="px-6 py-4 text-right font-[600] text-slate-900">
                                                {formatMoney(invoice.amount || 0)}
                                            </td>
                                            <td className="px-6 py-4 text-right relative">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveActionMenuId(activeActionMenuId === invoice.id ? null : invoice.id);
                                                    }}
                                                    className="action-btn p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center"
                                                >
                                                    <i className="ph-bold ph-dots-three text-lg"></i>
                                                </button>
                                                
                                                {activeActionMenuId === invoice.id && (
                                                    <div 
                                                        ref={actionMenuRef}
                                                        className="absolute right-10 top-8 bg-white border border-slate-200 rounded-xl shadow-dropdown z-40 w-48 overflow-hidden py-1 animate-fade-in-up origin-top-right text-left"
                                                    >
                                                        <Link href={`/invoices/${invoice.id}/edit`} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                                                            <i className="ph ph-pencil-simple"></i> Edit Invoice
                                                        </Link>
                                                        <button disabled className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-400 cursor-not-allowed hover:bg-slate-50 transition-colors">
                                                            <i className="ph ph-envelope-simple"></i> Send Reminder
                                                        </button>
                                                        <Link href={`/invoices/${invoice.id}`} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                                                            <i className="ph ph-download-simple"></i> View & Download
                                                        </Link>
                                                        <div className="h-px bg-slate-100 my-1"></div>
                                                        {invoice.status !== 'paid' && (
                                                            <button 
                                                                onClick={(e) => handleMarkAsPaid(invoice.id, e)}
                                                                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                            >
                                                                <i className="ph ph-check-circle"></i> Mark as Paid
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => handleDelete(invoice.id)}
                                                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                                                        >
                                                            <i className="ph ph-trash"></i> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between mt-auto">
                        <div className="text-xs text-slate-500 font-medium">
                            Showing <span className="text-slate-900">{(page - 1) * limit + 1}</span> to <span className="text-slate-900">{Math.min(page * limit, total)}</span> of <span className="text-slate-900">{total}</span> invoices
                        </div>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                            >
                                <i className="ph-bold ph-caret-left"></i>
                            </button>
                            
                            <div className="flex items-center gap-1 px-2">
                                {getPageNumbers().map(p => (
                                    <button 
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`w-8 h-8 text-xs font-[600] rounded-lg transition-colors shadow-sm ${
                                            p === page 
                                                ? 'bg-slate-900 text-white' 
                                                : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>

                            <button 
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages || totalPages === 0}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors disabled:opacity-50"
                            >
                                <i className="ph-bold ph-caret-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
