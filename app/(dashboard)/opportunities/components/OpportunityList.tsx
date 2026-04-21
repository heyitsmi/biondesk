import React from 'react';
import { FlagIcon } from 'react-flag-kit';
import { Opportunity } from '@/lib/types';
import { STAGE_CONFIG, getSourceBadge, getTimeAgo, formatCurrency } from './utils';

type Props = {
    opportunities: Opportunity[];
    activeFilter: string;
    onOpportunityClick: (opp: Opportunity) => void;
};

export default function OpportunityList({ opportunities, activeFilter, onOpportunityClick }: Props) {
    const filteredOpportunities = opportunities.filter(opp => 
        activeFilter === 'all' || opp.source === activeFilter
    );

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium whitespace-nowrap">
                        <tr>
                            <th className="px-6 py-4">Title & Client</th>
                            <th className="px-6 py-4">Stage</th>
                            <th className="px-6 py-4">Source</th>
                            <th className="px-6 py-4">Budget</th>
                            <th className="px-6 py-4">Created</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredOpportunities.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-slate-400">
                                    No opportunities found.
                                </td>
                            </tr>
                        ) : (
                            filteredOpportunities.map(opp => {
                                const sourceBadge = getSourceBadge(opp.source);
                                const stageConfig = STAGE_CONFIG.find(s => s.id === opp.stage);
                                
                                return (
                                    <tr 
                                        key={opp.id} 
                                        onClick={() => onOpportunityClick(opp)}
                                        className="hover:bg-slate-50 transition-colors cursor-pointer group"
                                    >
                                        <td className="px-6 py-4 min-w-[200px]">
                                            <div className="font-[600] text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                {opp.title}
                                            </div>
                                            {opp.client_name && (
                                                <div className="text-[10px] uppercase font-bold text-slate-500 mt-1 flex items-center gap-1.5">
                                                    {opp.country_code && <FlagIcon code={opp.country_code as any} size={12} />}
                                                    {opp.client_name}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${stageConfig?.color || 'bg-slate-200'}`} />
                                                <span className="text-sm font-medium capitalize text-slate-700">{stageConfig?.name || opp.stage}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded ${sourceBadge.bg} ${sourceBadge.text} text-xs font-bold border`}>
                                                {sourceBadge.icon} {sourceBadge.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">
                                            {opp.value !== null ? (
                                                <>
                                                    {formatCurrency(opp.value)}
                                                    {opp.budget_type === 'hourly' && <span className="text-slate-400 font-normal">/hr</span>}
                                                </>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm whitespace-nowrap">
                                            {getTimeAgo(opp.created_at)}
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
