import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { FlagIcon } from 'react-flag-kit';
import { Opportunity } from '@/lib/types';
import { STAGE_CONFIG, getSourceBadge, getTimeAgo, formatCurrency } from './utils';

type Props = {
    opportunities: Opportunity[];
    activeFilter: string;
    onDragEnd: (result: DropResult) => void;
    onOpportunityClick: (opp: Opportunity) => void;
};

export default function OpportunityBoard({ opportunities, activeFilter, onDragEnd, onOpportunityClick }: Props) {
    const groupedStages = STAGE_CONFIG.map(config => ({
        ...config,
        items: opportunities.filter(opp => 
            opp.stage === config.id && 
            (activeFilter === 'all' || opp.source === activeFilter)
        )
    }));

    return (
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
                                                        <div onClick={() => onOpportunityClick(opp)}>
                                                            {isWon ? (
                                                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all cursor-pointer">
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
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded ${sourceBadge.bg} ${sourceBadge.text} text-[10px] font-bold border`}>
                                                                            {sourceBadge.icon} {sourceBadge.label}
                                                                        </span>
                                                                        <span className="text-[10px] text-slate-400">{getTimeAgo(opp.created_at)}</span>
                                                                    </div>

                                                                    <h4 className="text-sm font-[600] text-slate-900 leading-snug mb-2 group-hover:text-indigo-600 transition-colors">{opp.title}</h4>

                                                                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
                                                                        {opp.value !== null && (
                                                                            <span className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100 font-medium text-slate-700">
                                                                                {formatCurrency(opp.value)}
                                                                                {opp.budget_type === 'hourly' && <span className="text-slate-400 font-normal">/hr</span>}
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    {opp.client_name && (
                                                                        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-50 text-[10px] text-slate-400 font-[500] uppercase tracking-wide">
                                                                            {opp.country_code && <FlagIcon code={opp.country_code as any} size={12} />}
                                                                            {opp.client_name}
                                                                        </div>
                                                                    )}

                                                                    {isActive && (
                                                                        <div className="mt-3">
                                                                            <div className="w-full py-1.5 rounded-lg bg-indigo-600 group-hover:bg-indigo-700 text-white text-xs font-[600] flex items-center justify-center gap-1 shadow-sm transition-colors">
                                                                                <i className="ph-bold ph-magic-wand" /> Open Detail
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                    {provided.placeholder}
                                    
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
    );
}
