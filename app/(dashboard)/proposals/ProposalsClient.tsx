'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { DocumentWithItems } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { documentsApi } from '@/lib/api';

export default function ProposalsClient() {
    const [filter, setFilter] = useState('all');
    const [proposals, setProposals] = useState<DocumentWithItems[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeActionId, setActiveActionId] = useState<string | null>(null);
    const actionMenuRef = useRef<HTMLDivElement>(null);
    const [actionMenuPosition, setActionMenuPosition] = useState({ top: 0, left: 0 });
    const router = useRouter();

    useEffect(() => {
        fetchProposals();
    }, []);

    const fetchProposals = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/proposals?limit=100`);
            if (!res.ok) throw new Error('Failed to fetch proposals');
            const data = await res.json();
            setProposals(data.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProposals = filter === 'all' 
        ? proposals 
        : proposals.filter(p => p.status === filter);

    const handleActionClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        e.preventDefault();
        
        if (activeActionId === id) {
            setActiveActionId(null);
        } else {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

            setActionMenuPosition({
                top: rect.bottom + 5, 
                left: rect.right - 192 // Align right edge (w-48 is 12rem = 192px)
            });
            setActiveActionId(id);
        }
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setActiveActionId(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this proposal?')) return;
        
        try {
            await documentsApi.delete(id);
            setProposals(prev => prev.filter(p => p.id !== id));
            setActiveActionId(null);
        } catch (error) {
            console.error('Failed to delete', error);
            alert('Failed to delete proposal');
        }
    }

    const handleDuplicate = async (id: string) => {
        try {
            const original = await documentsApi.get(id);
            if (!original) throw new Error('Document not found');

            const newDoc = await documentsApi.create({
                type: 'proposal',
                title: `${original.title} (Copy)`,
                content: original.content || '',
                status: 'draft',
                currency: original.currency || 'USD',
                // Copy other relevant fields
                opportunity_id: original.opportunity_id || undefined,
                contact_id: original.contact_id || undefined,
                amount: original.amount,
                items: original.items,
            } as any); // Casting as api might expect slightly different shape or optional param mismatches

            setActiveActionId(null);
            router.push(`/proposals/${newDoc.id}`);
        } catch (error) {
            console.error('Failed to duplicate', error);
            alert('Failed to duplicate proposal');
        }
    }

    const handleConvert = async (id: string) => {
        try {
            const proposal = await documentsApi.get(id);
            if (!proposal) throw new Error('Proposal not found');

            // Create new quote from proposal data
            const newQuote = await documentsApi.create({
                type: 'quote',
                title: `Quote from ${proposal.title}`,
                content: proposal.content || '',
                status: 'draft',
                currency: proposal.currency || 'USD',
                opportunity_id: proposal.opportunity_id || undefined,
                contact_id: proposal.contact_id || undefined,
                amount: proposal.amount,
                items: proposal.items.map(item => ({
                    description: item.description,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    notes: item.notes
                })),
                valid_until: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +14 days default
            } as any);

            setActiveActionId(null);
            router.push(`/quotations/${newQuote.id}`);
        } catch (error) {
            console.error('Failed to convert to quote', error);
            alert('Failed to convert to quote');
        }
    }

    const getStatusBadge = (proposal: DocumentWithItems) => {
        if (proposal.status === 'accepted') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Accepted
                </span>
            );
        } else if (proposal.status === 'sent') {
             if (proposal.view_count > 0) {
                 return (
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">Viewed</span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400" title="Viewed">
                            <i className="ph-fill ph-eye"></i> {proposal.view_count}
                        </div>
                    </div>
                 );
             }
             return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                    Sent
                </span>
             );
        } else {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                    {proposal.status}
                </span>
            );
        }
    };

    const getClientAvatar = (proposal: DocumentWithItems) => {
        const clientName = proposal.contact?.company || proposal.contact?.name || 'No Client';
        const initials = clientName.substring(0, 2).toUpperCase();
        const colors = ['indigo', 'rose', 'emerald', 'amber', 'slate', 'blue'];
        const colorIndex = clientName.length % colors.length;
        const color = colors[colorIndex];

        if (!proposal.contact) {
            return (
                <div className="flex items-center gap-2">
                     <span className="text-slate-400 italic">No Client Selected</span>
                </div>
            )
        }

        return (
            <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded bg-${color}-50 text-${color}-600 flex items-center justify-center text-[10px] font-bold uppercase`}>
                    {initials}
                </div>
                <span className="text-slate-600">{clientName}</span>
            </div>
        )
    }

    return (
        <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-white transition-all duration-300 ease-in-out">
            
            {/* Header with Search & Filters */}
            <header className="h-auto md:h-16 px-4 md:px-8 py-4 md:py-0 flex flex-col md:flex-row items-start md:items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-20 shrink-0 gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-4">
                         <h1 className="text-xl font-[600] text-slate-900 tracking-tight">Proposals</h1>
                         <div className="hidden md:block h-6 w-px bg-slate-200"></div>
                    </div>
                    
                    {/* Filters - Scrollable on mobile */}
                    <div className="flex items-center gap-1 text-sm font-[500] text-slate-500 overflow-x-auto pb-1 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
                        {['all', 'draft', 'sent', 'accepted'].map(f => (
                            <button 
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg transition-colors capitalize whitespace-nowrap ${filter === f ? 'active bg-slate-100 text-slate-900' : 'hover:bg-slate-50'}`} 
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 w-full md:w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm font-[450] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"/>
                    </div>
                    {/* New Proposal Button */}
                    <Link href="/proposals/generate" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-[550] shadow-subtle flex items-center gap-2 transition-smooth whitespace-nowrap">
                        <i className="ph-bold ph-plus"></i>
                        <span className="hidden md:inline">New Proposal</span>
                        <span className="md:hidden">New</span>
                    </Link>
                </div>
            </header>

            {/* List Container */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white h-full flex flex-col">
                    
                    {/* DESKTOP TABLE */}
                    <div className="hidden md:block flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-[600] text-slate-500 uppercase tracking-wide">
                                    <th className="px-6 py-4">Proposal Name</th>
                                    <th className="px-6 py-4">Client / Source</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Created</th>
                                    <th className="px-6 py-4 text-right">Est. Value</th>
                                    <th className="px-6 py-4 w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">Loading proposals...</td>
                                    </tr>
                                ) : filteredProposals.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">No proposals found.</td>
                                    </tr>
                                ) : filteredProposals.map((proposal) => (
                                    <tr key={proposal.id} className="group hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-[600] text-slate-900">{proposal.title}</span>
                                                <span className="text-xs text-slate-400">#{proposal.number}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getClientAvatar(proposal)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(proposal)}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(proposal.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-right font-[500] text-slate-900">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(proposal.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button 
                                                onClick={(e) => handleActionClick(e, proposal.id)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                                            >
                                                <i className="ph-bold ph-dots-three text-lg"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE LIST (CARDS) */}
                    <div className="md:hidden flex-1 overflow-y-auto bg-slate-50 p-4 space-y-3">
                         {isLoading ? (
                            <div className="text-center py-12 text-slate-500 text-sm">Loading proposals...</div>
                         ) : filteredProposals.length === 0 ? (
                            <div className="text-center py-12 text-slate-500 text-sm">No proposals found.</div>
                         ) : filteredProposals.map((proposal) => (
                             <div key={proposal.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-mono text-slate-400">#{proposal.number}</span>
                                            {getStatusBadge(proposal)}
                                        </div>
                                        <h3 className="text-sm font-[600] text-slate-900 truncate">{proposal.title}</h3>
                                    </div>
                                    <button 
                                        onClick={(e) => handleActionClick(e, proposal.id)}
                                        className="p-2 -mr-2 -mt-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        <i className="ph-bold ph-dots-three text-lg"></i>
                                    </button>
                                </div>
                                
                                <div className="h-px bg-slate-50"></div>
                                
                                <div className="flex items-center justify-between">
                                    {getClientAvatar(proposal)}
                                    <div className="text-right">
                                        <div className="text-sm font-[600] text-slate-900">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(proposal.amount)}
                                        </div>
                                        <div className="text-[10px] text-slate-400">
                                            {new Date(proposal.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                             </div>
                         ))}
                    </div>
                
                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between mt-auto">
                        <div className="text-xs text-slate-500 font-medium">
                            Showing <span className="text-slate-900">1</span> to <span className="text-slate-900">{filteredProposals.length}</span> of <span className="text-slate-900">{proposals.length}</span> proposals
                        </div>
                        <div className="flex items-center gap-1">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>
                                <i className="ph-bold ph-caret-left"></i>
                            </button>
                            <div className="flex items-center gap-1 px-2">
                                <button className="w-8 h-8 text-xs font-[600] rounded-lg bg-slate-900 text-white shadow-sm">1</button>
                            </div>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                                <i className="ph-bold ph-caret-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ACTION MENU DROPDOWN */}
            {activeActionId && (
                <div 
                    ref={actionMenuRef}
                    className="fixed bg-white border border-slate-200 rounded-xl shadow-dropdown z-50 w-48 overflow-hidden py-1 animate-fade-in-up origin-top-right text-left"
                    style={{ top: actionMenuPosition.top, left: actionMenuPosition.left }}
                >
                    <Link href={`/proposals/${activeActionId}`} className="block w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                        <i className="ph ph-eye"></i> View Details
                    </Link>
                    <Link href={`/proposals/${activeActionId}`} className="block w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                        <i className="ph ph-pencil-simple"></i> Edit
                    </Link>
                    <button 
                         onClick={() => handleDuplicate(activeActionId)}
                         className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                    >
                        <i className="ph ph-copy"></i> Duplicate
                    </button>
                    <div className="h-px bg-slate-100 my-1"></div>
                    <button 
                        onClick={() => handleConvert(activeActionId)}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
                    >
                        <i className="ph ph-file-text"></i> Convert to Quote
                    </button>
                    <button 
                        onClick={() => handleDelete(activeActionId)}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                        <i className="ph ph-trash"></i> Delete
                    </button>
                </div>
            )}
        </main>
    );
}
