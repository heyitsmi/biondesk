'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DropResult } from '@hello-pangea/dnd';
import { opportunitiesApi } from '@/lib/api';
import { Opportunity } from '@/lib/types';
import OpportunityBoard from './components/OpportunityBoard';
import OpportunityList from './components/OpportunityList';
import OpportunityPreviewModal from './components/OpportunityPreviewModal';

export default function OpportunitiesPage() {
    const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
    const [activeFilter, setActiveFilter] = useState('all');
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

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

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;
        
        const draggedItem = opportunities.find(o => o.id === draggableId);
        if (!draggedItem) return;

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
            newSortOrder = (prevItemOrder + nextItemOrder) / 2;
        }

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
        
        updatedOpportunities.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setOpportunities(updatedOpportunities);

        try {
            await opportunitiesApi.update(draggableId, { 
                stage: destination.droppableId as any,
                sort_order: newSortOrder 
            });
        } catch (error) {
            console.error('Failed to update opportunity:', error);
             fetchOpportunities();
        }
    };

    return (
        <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50/50">
            <header className="h-auto md:h-16 px-4 md:px-6 py-4 md:py-0 flex flex-col md:flex-row items-start md:items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 shrink-0 gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                    <h1 className="text-xl font-[600] text-slate-900 tracking-tight">Opportunities</h1>
                    <div className="h-6 w-px bg-slate-200 hidden md:block" />
                    
                    <Link 
                        href="/opportunities/create"
                        className="md:hidden bg-indigo-600 active:bg-indigo-700 text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transition-colors"
                    >
                        <i className="ph-bold ph-plus" />
                    </Link>
                </div>

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
                    <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                        <button 
                            onClick={() => setViewMode('board')}
                            className={`p-1.5 rounded-md flex items-center justify-center transition-all ${viewMode === 'board' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                            title="Board View"
                        >
                            <i className="ph-fill ph-kanban text-lg" />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                            title="List View"
                        >
                            <i className="ph-fill ph-list text-lg" />
                        </button>
                    </div>

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

            <div className={`flex-1 ${viewMode === 'list' ? 'overflow-auto' : 'overflow-x-auto overflow-y-hidden'} p-4 md:p-6`}>
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <i className="ph-bold ph-spinner animate-spin text-3xl text-indigo-500"></i>
                    </div>
                ) : viewMode === 'board' ? (
                    <OpportunityBoard 
                        opportunities={opportunities} 
                        activeFilter={activeFilter} 
                        onDragEnd={onDragEnd} 
                        onOpportunityClick={setSelectedOpportunity} 
                    />
                ) : (
                    <OpportunityList 
                        opportunities={opportunities} 
                        activeFilter={activeFilter} 
                        onOpportunityClick={setSelectedOpportunity} 
                    />
                )}
            </div>

            <OpportunityPreviewModal 
                opportunity={selectedOpportunity} 
                onClose={() => setSelectedOpportunity(null)} 
            />
        </main>
    );
}
