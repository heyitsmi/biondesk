'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { quotesApi } from '@/lib/api';
import { DocumentWithItems } from '@/lib/types';
import { formatCurrency } from '@/lib/utils'; // Assuming this helper exists or I'll implement inline if simple

export default function QuotationsPage() {
    const [quotations, setQuotations] = useState<DocumentWithItems[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit] = useState(10);
    
    // Filters
    const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'sent' | 'accepted' | 'expired'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Action Menu
    const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);
    const actionMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchQuotations();
        
        // Close menus on click outside
        const handleClickOutside = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setActiveActionMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [page, filterStatus, searchQuery]);

    const fetchQuotations = async () => {
        setIsLoading(true);
        try {
            const data = await quotesApi.list({
                page,
                limit,
                search: searchQuery,
                status: filterStatus === 'all' ? undefined : filterStatus
            });
            setQuotations(data.data);
            setTotal(data.total);
        } catch (error) {
            console.error('Error fetching quotations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this quote?')) return;
        try {
            await quotesApi.delete(id);
            fetchQuotations();
        } catch (error) {
            console.error('Failed to delete quote:', error);
            alert('Failed to delete quote.');
        }
    };

    // Helper for pagination
    const totalPages = Math.ceil(total / limit);
    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
             pages.push(i);
        }
        return pages.slice(0, 5); // Limit to 5 for simplicity
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'draft': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'sent': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            case 'viewed': return 'bg-amber-50 text-amber-700 border-amber-100'; // Template treats viewed basically as Sent/Viewed
            case 'accepted': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'overdue': return 'bg-rose-50 text-rose-700 border-rose-100'; // 'expired' in template, 'overdue' in types?
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-white transition-all duration-300 ease-in-out">
            
            {/* Header */}
            <header className="h-auto md:h-16 px-4 md:px-8 py-4 md:py-0 flex flex-col md:flex-row items-start md:items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-20 shrink-0 gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                    <h1 className="text-xl font-[600] text-slate-900 tracking-tight">Quotations</h1>
                    <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
                    
                    {/* Mobile Create Button (Visible only on small screens) */}
                    <Link 
                        href="/quotations/create"
                        className="md:hidden bg-indigo-600 active:bg-indigo-700 text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-subtle transition-colors"
                    >
                        <i className="ph-bold ph-plus"></i>
                    </Link>
                </div>

                {/* Filters - Scrollable on mobile */}
                <div className="w-full md:w-auto overflow-x-auto pb-1 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex items-center gap-1 text-sm font-[500] text-slate-500 whitespace-nowrap">
                        <button 
                            onClick={() => { setFilterStatus('all'); setPage(1); }}
                            className={`px-3 py-1.5 rounded-lg transition-colors ${filterStatus === 'all' ? 'bg-slate-100 text-slate-900 active' : 'hover:bg-slate-50'}`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => { setFilterStatus('draft'); setPage(1); }}
                            className={`px-3 py-1.5 rounded-lg transition-colors ${filterStatus === 'draft' ? 'bg-slate-100 text-slate-900 active' : 'hover:bg-slate-50'}`}
                        >
                            Drafts
                        </button>
                        <button 
                            onClick={() => { setFilterStatus('sent'); setPage(1); }}
                            className={`px-3 py-1.5 rounded-lg transition-colors ${filterStatus === 'sent' ? 'bg-slate-100 text-slate-900 active' : 'hover:bg-slate-50'}`}
                        >
                            Sent
                        </button>
                        <button 
                            onClick={() => { setFilterStatus('accepted'); setPage(1); }}
                            className={`px-3 py-1.5 rounded-lg transition-colors ${filterStatus === 'accepted' ? 'bg-slate-100 text-slate-900 active' : 'hover:bg-slate-50'}`}
                        >
                            Accepted
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input 
                            type="text" 
                            placeholder="Search quotes..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 w-full md:w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm font-[450] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <Link 
                        href="/quotations/create"
                        className="hidden md:flex bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-[550] shadow-subtle items-center gap-2 transition-smooth"
                    >
                        <i className="ph-bold ph-plus"></i>
                        <span>Create Quote</span>
                    </Link>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white h-full flex flex-col">
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-[600] text-slate-500 uppercase tracking-wide">
                                    <th className="px-6 py-4">Quote Number</th>
                                    <th className="px-6 py-4">Client / Project</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 hidden md:table-cell">Date</th>
                                    <th className="px-6 py-4 text-right hidden md:table-cell">Amount</th>
                                    <th className="px-6 py-4 w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {isLoading ? (
                                    // Skeleton Loader
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <tr key={index} className="animate-pulse">
                                            <td className="px-6 py-4">
                                                <div className="h-4 bg-slate-200 rounded w-24"></div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-slate-200 rounded"></div>
                                                    <div className="space-y-2">
                                                        <div className="h-4 bg-slate-200 rounded w-32"></div>
                                                        <div className="h-3 bg-slate-200 rounded w-20"></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-6 bg-slate-200 rounded-full w-20"></div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <div className="h-4 bg-slate-200 rounded w-24"></div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <div className="h-4 bg-slate-200 rounded w-20 ml-auto"></div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-8 bg-slate-200 rounded w-8 ml-auto"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : quotations.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                            No quotations found.
                                        </td>
                                    </tr>
                                ) : (
                                    quotations.map((quote) => (
                                        <tr key={quote.id} className="group hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 font-mono text-slate-600 text-xs align-top">
                                                <div className="flex flex-col gap-1">
                                                    <span>{quote.number}</span>
                                                    <span className="md:hidden text-slate-400 font-sans">{new Date(quote.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold ring-2 ring-white shrink-0">
                                                        {(quote.contact?.name || '??').substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-[600] text-slate-900">{quote.contact?.name || 'Unknown Client'}</p>
                                                        <p className="text-slate-500 text-xs line-clamp-1">{quote.title || 'Untitled Quote'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize w-fit ${getStatusBadge(quote.status)}`}>
                                                        {quote.status}
                                                    </span>
                                                    <span className="md:hidden text-xs font-[500] text-slate-900 mt-1">
                                                        ${(quote.amount || 0).toLocaleString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 hidden md:table-cell">
                                                {new Date(quote.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right font-[500] text-slate-900 hidden md:table-cell">
                                                ${(quote.amount || 0).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right relative">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveActionMenuId(activeActionMenuId === quote.id ? null : quote.id);
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                                                >
                                                    <i className="ph-bold ph-dots-three text-lg"></i>
                                                </button>
                                                
                                                {activeActionMenuId === quote.id && (
                                                    <div 
                                                        ref={actionMenuRef}
                                                        className="absolute right-10 top-8 bg-white border border-slate-200 rounded-xl shadow-dropdown z-40 w-48 overflow-hidden py-1 animate-fade-in-up origin-top-right"
                                                    >
                                                        <Link href={`/quotations/${quote.id}/edit`} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                                                            <i className="ph ph-pencil-simple"></i> Edit Quote
                                                        </Link>
                                                        <button className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                                                            <i className="ph ph-paper-plane-tilt"></i> Send Email
                                                        </button>
                                                        <Link href={`/quotations/${quote.id}`} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                                                            <i className="ph ph-eye"></i> View Details
                                                        </Link>
                                                        <div className="h-px bg-slate-100 my-1"></div>
                                                        <button 
                                                            onClick={() => handleDelete(quote.id)}
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
                            Showing <span className="text-slate-900">{(page - 1) * limit + 1}</span> to <span className="text-slate-900">{Math.min(page * limit, total)}</span> of <span className="text-slate-900">{total}</span> results
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
