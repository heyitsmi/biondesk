'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ProposalsClient() {
    const [filter, setFilter] = useState('all');
    const [activeActionId, setActiveActionId] = useState<string | null>(null);
    const actionMenuRef = useRef<HTMLDivElement>(null);
    const [actionMenuPosition, setActionMenuPosition] = useState({ top: 0, left: 0 });

    const proposals = [
        {
            id: '1',
            name: 'SaaS Landing Page Redesign',
            version: 'Version 2 (Detailed)',
            client_initials: 'TS',
            client_name: 'TechStart Inc',
            client_color: 'indigo',
            status: 'accepted',
            created: 'Jan 14, 2026',
            value: '$4,500.00',
        },
        {
            id: '2',
            name: 'Mobile App MVP',
            version: 'Cover Letter',
            client_icon: 'ph-user',
            client_name: 'Acme Corp',
            client_color: 'slate',
            status: 'sent',
            viewed: true,
            created: 'Jan 18, 2026',
            value: '$12,000.00',
        },
        {
            id: '3',
            name: 'Brand Identity Refresh',
            version: 'Proposal',
            client_initials: 'SD',
            client_name: 'Studio Design',
            client_color: 'rose',
            status: 'sent',
            created: 'Jan 19, 2026',
            value: '$2,500.00',
        },
        {
            id: '4',
            name: 'Q1 Marketing Retainer',
            version: 'Drafting',
            client_name: 'No Client Selected',
            status: 'draft',
            created: 'Today, 10:00 AM',
            value: '-',
        }
    ];

    const filteredProposals = filter === 'all' 
        ? proposals 
        : proposals.filter(p => p.status === filter);

    const handleActionClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (activeActionId === id) {
            setActiveActionId(null);
        } else {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            // Calculate relative to the viewport + scroll
            // However, fixed positioning works best with viewport coordinates
            // The template uses window.scrollY, let's replicate or use improved logic
            setActionMenuPosition({
                top: rect.bottom + 5, // Just below the button
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

    const getStatusBadge = (proposal: any) => {
        if (proposal.status === 'accepted') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Accepted
                </span>
            );
        } else if (proposal.status === 'sent') {
             if (proposal.viewed) {
                 return (
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">Viewed</span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400" title="Viewed 2 hours ago">
                            <i className="ph-fill ph-eye"></i> 2h ago
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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    Draft
                </span>
            );
        }
    };

    return (
        <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-white transition-all duration-300 ease-in-out">
            
            {/* Header with Search & Filters */}
            <header className="h-16 px-8 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-[600] text-slate-900 tracking-tight">Proposals</h1>
                    <div className="h-6 w-px bg-slate-200"></div>
                    {/* Filters */}
                    <div className="flex items-center gap-1 text-sm font-[500] text-slate-500">
                        <button 
                            onClick={() => setFilter('all')}
                            className={`px-3 py-1.5 rounded-lg transition-colors ${filter === 'all' ? 'active bg-slate-100 text-slate-900' : 'hover:bg-slate-50'}`} 
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setFilter('draft')}
                            className={`px-3 py-1.5 rounded-lg transition-colors ${filter === 'draft' ? 'active bg-slate-100 text-slate-900' : 'hover:bg-slate-50'}`} 
                        >
                            Drafts
                        </button>
                        <button 
                            onClick={() => setFilter('sent')}
                            className={`px-3 py-1.5 rounded-lg transition-colors ${filter === 'sent' ? 'active bg-slate-100 text-slate-900' : 'hover:bg-slate-50'}`} 
                        >
                            Sent
                        </button>
                        <button 
                            onClick={() => setFilter('accepted')}
                            className={`px-3 py-1.5 rounded-lg transition-colors ${filter === 'accepted' ? 'active bg-slate-100 text-slate-900' : 'hover:bg-slate-50'}`} 
                        >
                            Accepted
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input type="text" placeholder="Search proposals..." className="pl-9 pr-4 py-2 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm font-[450] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"/>
                    </div>
                    {/* New Proposal Button */}
                    <Link href="/proposal/generate" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-[550] shadow-subtle flex items-center gap-2 transition-smooth">
                        <i className="ph-bold ph-plus"></i>
                        <span>New Proposal</span>
                    </Link>
                </div>
            </header>

            {/* Table Container */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white h-full flex flex-col">
                    <div className="flex-1 overflow-auto">
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
                                {filteredProposals.map((proposal) => (
                                    <tr key={proposal.id} className="group hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-[600] text-slate-900">{proposal.name}</span>
                                                <span className="text-xs text-slate-400">{proposal.version}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {proposal.client_icon ? (
                                                     <div className={`w-6 h-6 rounded bg-${proposal.client_color}-100 text-${proposal.client_color}-600 flex items-center justify-center text-[10px] font-bold`}>
                                                        <i className={`ph-bold ${proposal.client_icon}`}></i>
                                                     </div>
                                                ) : proposal.client_initials ? (
                                                    <div className={`w-6 h-6 rounded bg-${proposal.client_color}-50 text-${proposal.client_color}-600 flex items-center justify-center text-[10px] font-bold uppercase`}>
                                                        {proposal.client_initials}
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 italic">No Client Selected</span>
                                                )}
                                                {proposal.client_name !== 'No Client Selected' && (
                                                    <span className="text-slate-600">{proposal.client_name}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(proposal)}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{proposal.created}</td>
                                        <td className="px-6 py-4 text-right font-[500] text-slate-900">{proposal.value}</td>
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
                                <button className="w-8 h-8 text-xs font-[500] text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">2</button>
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
                    className="fixed bg-white border border-slate-200 rounded-xl shadow-dropdown z-50 w-48 overflow-hidden py-1 animate-fade-in-up origin-top-right"
                    style={{ top: actionMenuPosition.top, left: actionMenuPosition.left }}
                >
                    <Link href="#" className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                        <i className="ph ph-eye"></i> View Details
                    </Link>
                    <button className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                        <i className="ph ph-pencil-simple"></i> Edit
                    </button>
                    <button className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                        <i className="ph ph-copy"></i> Duplicate
                    </button>
                    <div className="h-px bg-slate-100 my-1"></div>
                    <button className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors">
                        <i className="ph ph-file-text"></i> Convert to Quote
                    </button>
                    <button className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors">
                        <i className="ph ph-trash"></i> Delete
                    </button>
                </div>
            )}
        </main>
    );
}
