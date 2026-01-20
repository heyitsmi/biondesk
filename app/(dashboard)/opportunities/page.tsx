'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { opportunitiesApi } from '@/lib/api';
import { Opportunity } from '@/lib/types';

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
        const badges: Record<string, { bg: string; text: string; icon: string; label: string }> = {
            upwork: { bg: 'bg-emerald-50 border-emerald-100', text: 'text-emerald-700', icon: 'ph-fill ph-briefcase', label: 'Upwork' },
            linkedin: { bg: 'bg-sky-50 border-sky-100', text: 'text-sky-700', icon: 'ph-fill ph-linkedin-logo', label: 'LinkedIn' },
            email: { bg: 'bg-slate-50 border-slate-100', text: 'text-slate-600', icon: 'ph-fill ph-envelope-simple', label: 'Email' },
            direct: { bg: 'bg-slate-50 border-slate-100', text: 'text-slate-600', icon: 'ph-fill ph-user', label: 'Direct' },
            referral: { bg: 'bg-purple-50 border-purple-100', text: 'text-purple-700', icon: 'ph-fill ph-users', label: 'Referral' },
            other: { bg: 'bg-slate-50 border-slate-100', text: 'text-slate-500', icon: 'ph-fill ph-question', label: 'Other' }
        };
        return badges[source || 'other'] || badges.other;
    };

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;
        
        // Optimistic Update
        const updatedOpportunities = opportunities.map(opp => {
            if (opp.id === draggableId) {
                return { ...opp, stage: destination.droppableId as any };
            }
            return opp;
        });
        
        setOpportunities(updatedOpportunities);

        // API Call
        try {
            await opportunitiesApi.update(draggableId, { stage: destination.droppableId as any });
        } catch (error) {
            console.error('Failed to update stage:', error);
            // Revert on error (optional, skipping for simplicity)
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
            <header className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-[600] text-slate-900 tracking-tight">Opportunities</h1>
                    <div className="h-6 w-px bg-slate-200" />
                    {/* Filters */}
                    <div className="flex items-center gap-2">
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

                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search jobs..." 
                            className="pl-9 pr-4 py-1.5 w-56 bg-slate-50 border border-slate-200 rounded-lg text-sm font-[450] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <Link 
                        href="/opportunities/create"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-[550] shadow-sm flex items-center gap-2 transition-colors"
                    >
                        <i className="ph-bold ph-plus" />
                        <span>New Opportunity</span>
                    </Link>
                </div>
            </header>

            {/* Kanban Board Container */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                
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
                                                                                        <span className="text-[10px] text-slate-500">{opp.client_name}</span>
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
                                                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${sourceBadge.bg} ${sourceBadge.text} text-[10px] font-bold border`}>
                                                                                        <i className={sourceBadge.icon} /> {sourceBadge.label}
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
                                                                                        </span>
                                                                                    )}
                                                                                    {opp.budget_type && (
                                                                                        <span className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100 capitalize">{opp.budget_type}</span>
                                                                                    )}
                                                                                </div>

                                                                                {/* Footer/Client */}
                                                                                {opp.client_name && (
                                                                                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-50 text-[10px] text-slate-400 font-[500] uppercase tracking-wide">
                                                                                        <i className="ph-fill ph-building"></i>
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

