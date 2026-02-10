'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { opportunitiesApi } from '@/lib/api';
import { Opportunity } from '@/lib/types';
import { FlagIcon } from 'react-flag-kit';

const STAGE_CONFIG = [
    { id: 'inbox', name: 'New Inbox', color: 'bg-slate-400' },
    { id: 'drafting', name: 'Drafting', color: 'bg-indigo-400' },
    { id: 'sent', name: 'Applied / Sent', color: 'bg-amber-400' },
    { id: 'negotiation', name: 'Interview', color: 'bg-purple-500' },
    { id: 'won', name: 'Won', color: 'bg-emerald-500' },
    { id: 'lost', name: 'Lost', color: 'bg-red-500' },
    { id: 'archived', name: 'Archived', color: 'bg-slate-500' }
];

export default function OpportunitiesPage() {
    const [activeFilter, setActiveFilter] = useState('all');
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOpportunities();
    }, []);

    const fetchOpportunities = async () => {
        try {
            const response = await opportunitiesApi.list({ limit: 100 });
            setOpportunities(response.data);
        } catch (error) {
            console.error('Failed to fetch opportunities:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount: number | null) => {
        if (!amount) return null;
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    const getTimeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return "Just now";
    };

    const getSourceBadge = (source: string | null) => {
        const badges: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
            upwork: { 
                bg: 'bg-emerald-50 border-emerald-100', 
                text: 'text-emerald-700', 
                icon: (
                    <svg fill="currentColor" width="14" height="14" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24.75 17.542c-1.469 0-2.849-0.62-4.099-1.635l0.302-1.432 0.010-0.057c0.276-1.521 1.13-4.078 3.786-4.078 1.99 0 3.604 1.615 3.604 3.604 0 1.984-1.615 3.599-3.604 3.599zM24.75 6.693c-3.385 0-6.016 2.198-7.083 5.818-1.625-2.443-2.865-5.38-3.583-7.854h-3.646v9.484c-0.005 1.875-1.521 3.391-3.396 3.396-1.875-0.005-3.391-1.526-3.396-3.396v-9.484h-3.646v9.484c0 3.885 3.161 7.068 7.042 7.068 3.885 0 7.042-3.182 7.042-7.068v-1.589c0.708 1.474 1.578 2.974 2.635 4.297l-2.234 10.495h3.729l1.62-7.615c1.417 0.906 3.047 1.479 4.917 1.479 4 0 7.25-3.271 7.25-7.266 0-4-3.25-7.25-7.25-7.25z"/>
                    </svg>
                ), 
                label: 'Upwork' 
            },
            linkedin: { 
                bg: 'bg-sky-50 border-sky-100', 
                text: 'text-sky-700', 
                icon: (
                    <svg width="14" height="14" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M12.225 12.225h-1.778V9.44c0-.664-.012-1.519-.925-1.519-.926 0-1.068.724-1.068 1.47v2.834H6.676V6.498h1.707v.783h.024c.348-.594.996-.95 1.684-.925 1.802 0 2.135 1.185 2.135 2.728l-.001 3.14zM4.67 5.715a1.037 1.037 0 01-1.032-1.031c0-.566.466-1.032 1.032-1.032.566 0 1.031.466 1.032 1.032 0 .566-.466 1.032-1.032 1.032zm.889 6.51h-1.78V6.498h1.78v5.727zM13.11 2H2.885A.88.88 0 002 2.866v10.268a.88.88 0 00.885.866h10.226a.882.882 0 00.889-.866V2.865a.88.88 0 00-.889-.864z"/></svg>
                ), 
                label: 'LinkedIn' 
            },
            email: { 
                bg: 'bg-slate-50 border-slate-100', 
                text: 'text-slate-600', 
                icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                        <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                ), 
                label: 'Email' 
            },
            direct: { 
                bg: 'bg-slate-50 border-slate-100', 
                text: 'text-slate-600', 
                icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                        <path d="M14 19.2857L15.8 21L20 17M4 21C4 17.134 7.13401 14 11 14C12.4872 14 13.8662 14.4638 15 15.2547M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                ), 
                label: 'Direct' 
            },
            referral: { 
                bg: 'bg-purple-50 border-purple-100', 
                text: 'text-purple-700', 
                icon: <i className="ph-fill ph-users text-sm"></i>, 
                label: 'Referral' 
            },
            fiverr: { 
                 bg: 'bg-emerald-50 border-emerald-100', 
                text: 'text-emerald-700',
                icon: (
                     <svg fill="currentColor" width="14" height="14" viewBox="-2 -2 24 24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin">
                        <path d='M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0 2C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10z'/>
                        <path d='M13.427 13.148v-5h-5v-.312c0-.517.42-.938.938-.938h.937V5.023h-.937a2.816 2.816 0 0 0-2.813 2.813v.312h-1.25v1.875h1.25v3.125h-1.25v1.875h4.375v-1.875h-1.25v-3.125h3.143v3.125h-1.268v1.875h4.375v-1.875h-1.25z'/>
                        <circle cx='12.402' cy='5.971' r='1.001'/>
                    </svg>
                ),
                label: 'Fiverr'
            },
            freelancer: {
                bg: 'bg-sky-50 border-sky-100', 
                text: 'text-sky-700',
                icon: (
                    <svg fill="currentColor" width="14" height="14" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg">
                        <path d="m14.096 3.076 1.634 2.292L24 3.076M5.503 20.924l4.474-4.374-2.692-2.89m6.133-10.584L11.027 5.23l4.022.15M4.124 3.077l.857 1.76 4.734.294m-3.058 7.072 3.497-6.522L0 5.13m7.064 7.485 3.303 3.548 3.643-3.57 1.13-6.652-4.439-.228z"/>
                    </svg>
                ),
                label: 'Freelancer'
            },
            other: { 
                bg: 'bg-slate-50 border-slate-100', 
                text: 'text-slate-500', 
                icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                        <path d="M8 10.5H16" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M8 14H13.5" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                ), 
                label: 'Other' 
            }
        };
        return badges[source || 'other'] || badges.other;
    };

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;
        
        // Find the item being dragged
        const draggedItem = opportunities.find(o => o.id === draggableId);
        if (!draggedItem) return;

        // Get items in the destination column
        // We must sort them by sort_order to determine the correct position
        const destColumnItems = opportunities
            .filter(o => o.stage === destination.droppableId && o.id !== draggableId)
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        let newSortOrder = 0;

        if (destColumnItems.length === 0) {
            newSortOrder = 1000;
        } else if (destination.index === 0) {
            newSortOrder = (destColumnItems[0].sort_order || 0) - 1000;
        } else if (destination.index >= destColumnItems.length) {
            newSortOrder = (destColumnItems[destColumnItems.length - 1].sort_order || 0) + 1000;
        } else {
            const prevItemOrder = destColumnItems[destination.index - 1].sort_order || 0;
            const nextItemOrder = destColumnItems[destination.index].sort_order || 0;
            // Handle edge case where orders are too close (collision), though unlikely with double precision
            newSortOrder = (prevItemOrder + nextItemOrder) / 2;
        }

        // Optimistic Update
        const updatedOpportunities = opportunities.map(opp => {
            if (opp.id === draggableId) {
                return { 
                    ...opp, 
                    stage: destination.droppableId as any,
                    sort_order: newSortOrder
                };
            }
            return opp;
        });
        
        // We need to re-sort the whole list locally to update UI correctly immediately
        updatedOpportunities.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setOpportunities(updatedOpportunities);

        // API Call
        try {
            await opportunitiesApi.update(draggableId, { 
                stage: destination.droppableId as any,
                sort_order: newSortOrder 
            });
        } catch (error) {
            console.error('Failed to update opportunity:', error);
            // Revert on error (optional)
             fetchOpportunities();
        }
    };

    // Group items by stage
    const groupedStages = STAGE_CONFIG.map(config => ({
        ...config,
        items: opportunities.filter(opp => 
            opp.stage === config.id && 
            (activeFilter === 'all' || opp.source === activeFilter)
        )
    }));

    return (
        <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50/50">
            {/* Header with Filters */}
            <header className="h-auto md:h-16 px-4 md:px-6 py-4 md:py-0 flex flex-col md:flex-row items-start md:items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 shrink-0 gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                    <h1 className="text-xl font-[600] text-slate-900 tracking-tight">Opportunities</h1>
                    <div className="h-6 w-px bg-slate-200 hidden md:block" />
                    
                    {/* Mobile Create Button */}
                    <Link 
                        href="/opportunities/create"
                        className="md:hidden bg-indigo-600 active:bg-indigo-700 text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transition-colors"
                    >
                        <i className="ph-bold ph-plus" />
                    </Link>
                </div>

                {/* Filters - Scrollable on mobile */}
                <div className="w-full md:w-auto overflow-x-auto pb-1 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        {['all', 'upwork', 'linkedin', 'direct'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`h-8 px-4 text-xs font-[600] rounded-lg min-w-[5rem] transition-all ${
                                    activeFilter === filter
                                        ? 'bg-slate-900 text-white shadow-sm'
                                        : 'text-slate-600 bg-white hover:bg-slate-50 border border-transparent hover:border-slate-200'
                                }`}
                            >
                                {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search jobs..." 
                            className="pl-9 pr-4 py-1.5 w-full md:w-56 bg-slate-50 border border-slate-200 rounded-lg text-sm font-[450] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <Link 
                        href="/opportunities/create"
                        className="hidden md:flex bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-[550] shadow-sm items-center gap-2 transition-colors"
                    >
                        <i className="ph-bold ph-plus" />
                        <span>New Opportunity</span>
                    </Link>
                </div>
            </header>

            {/* Kanban Board Container */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 md:p-6">
                
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <i className="ph-bold ph-spinner animate-spin text-3xl text-indigo-500"></i>
                    </div>
                ) : (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="flex gap-6 h-full min-w-max pb-4">
                            {groupedStages.map((stage) => (
                                <Droppable key={stage.id} droppableId={stage.id} isDropDisabled={activeFilter !== 'all'}>
                                    {(provided) => (
                                        <div 
                                            ref={provided.innerRef} 
                                            {...provided.droppableProps}
                                            className="w-80 flex flex-col gap-3"
                                        >
                                            {/* Column Header */}
                                            <div className="flex items-center justify-between px-1">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                                                    <h3 className="text-xs font-[600] text-slate-500 uppercase tracking-wide">{stage.name}</h3>
                                                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold">
                                                        {stage.items.length}
                                                    </span>
                                                </div>
                                                <button className="text-slate-400 hover:text-indigo-600">
                                                    <i className="ph-bold ph-plus" />
                                                </button>
                                            </div>

                                            {/* Kanban Cards Area */}
                                            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                                                {stage.items.map((opp, index) => {
                                                    const sourceBadge = getSourceBadge(opp.source);
                                                    const isWon = opp.stage === 'won';
                                                    const isActive = opp.stage === 'drafting';

                                                    return (
                                                        <Draggable 
                                                            key={opp.id} 
                                                            draggableId={opp.id} 
                                                            index={index}
                                                            isDragDisabled={activeFilter !== 'all'}
                                                        >
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    style={{
                                                                        ...provided.draggableProps.style,
                                                                        opacity: snapshot.isDragging ? 0.8 : 1,
                                                                    }}
                                                                >
                                                                    <Link href={`/opportunities/${opp.id}`}>
                                                                        {isWon ? (
                                                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
                                                                                <div className="flex flex-col gap-1">
                                                                                    <h4 className="text-sm font-[600] text-slate-900 line-through decoration-slate-400 group-hover:text-emerald-800 transition-colors">{opp.title}</h4>
                                                                                    {opp.client_name && (
                                                                                        <div className="flex items-center gap-1.5">
                                                                                            {opp.country_code && <FlagIcon code={opp.country_code as any} size={12} />}
                                                                                            <span className="text-[10px] text-slate-500">{opp.client_name}</span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                                                                    <i className="ph-bold ph-check" />
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <div 
                                                                                className={`block bg-white p-4 rounded-xl border shadow-sm transition-all cursor-pointer group ${
                                                                                    snapshot.isDragging ? 'shadow-lg rotate-3 scale-105' : ''
                                                                                } ${
                                                                                    isActive 
                                                                                        ? 'border-indigo-200 ring-2 ring-indigo-50' 
                                                                                        : 'border-slate-200 hover:border-indigo-300'
                                                                                }`}
                                                                            >
                                                                                {/* Source & Time */}
                                                                                <div className="flex justify-between items-start mb-2">
                                                                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded ${sourceBadge.bg} ${sourceBadge.text} text-[10px] font-bold border`}>
                                                                                        {sourceBadge.icon} {sourceBadge.label}
                                                                                    </span>
                                                                                    <span className="text-[10px] text-slate-400">{getTimeAgo(opp.created_at)}</span>
                                                                                </div>

                                                                                {/* Title */}
                                                                                <h4 className="text-sm font-[600] text-slate-900 leading-snug mb-2 group-hover:text-indigo-600 transition-colors">{opp.title}</h4>

                                                                                {/* Budget & Client */}
                                                                                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
                                                                                    {opp.value !== null && (
                                                                                        <span className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100 font-medium text-slate-700">
                                                                                            {formatCurrency(opp.value)}
                                                                                            {opp.budget_type === 'hourly' && <span className="text-slate-400 font-normal">/hr</span>}
                                                                                        </span>
                                                                                    )}
                                                                                </div>

                                                                                {/* Footer/Client */}
                                                                                {opp.client_name && (
                                                                                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-50 text-[10px] text-slate-400 font-[500] uppercase tracking-wide">
                                                                                        {opp.country_code && <FlagIcon code={opp.country_code as any} size={12} />}
                                                                                        {opp.client_name}
                                                                                    </div>
                                                                                )}

                                                                                {/* Active card CTA */}
                                                                                {isActive && (
                                                                                    <div className="mt-3">
                                                                                        <div className="w-full py-1.5 rounded-lg bg-indigo-600 group-hover:bg-indigo-700 text-white text-xs font-[600] flex items-center justify-center gap-1 shadow-sm transition-colors">
                                                                                            <i className="ph-bold ph-magic-wand" /> Open Detail
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </Link>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    );
                                                })}
                                                {provided.placeholder}
                                                
                                                {/* Empty state */}
                                                {stage.items.length === 0 && (
                                                    <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
                                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                                                            <i className="ph ph-folder-open text-slate-400 text-lg" />
                                                        </div>
                                                        <p className="text-xs text-slate-500">No opportunities</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            ))}
                        </div>
                    </DragDropContext>
                )}
            </div>
        </main>
    );
}

