import React from 'react';
import Link from 'next/link';
import { FlagIcon } from 'react-flag-kit';
import { Opportunity } from '@/lib/types';
import { STAGE_CONFIG, formatCurrency } from './utils';

type Props = {
    opportunity: Opportunity | null;
    onClose: () => void;
};

export default function OpportunityPreviewModal({ opportunity, onClose }: Props) {
    if (!opportunity) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-100 flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">{opportunity.title}</h2>
                        {opportunity.client_name && (
                            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                {opportunity.country_code && <FlagIcon code={opportunity.country_code as any} size={14} />}
                                {opportunity.client_name}
                            </p>
                        )}
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        <i className="ph ph-x text-lg" />
                    </button>
                </div>
                
                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-sm text-slate-500">Stage</span>
                            <span className="text-sm font-medium text-slate-900 capitalize text-right">
                                {STAGE_CONFIG.find(s => s.id === opportunity.stage)?.name || opportunity.stage}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                             <span className="text-sm text-slate-500">Budget</span>
                             <span className="text-sm font-medium text-slate-900 text-right">
                                 {opportunity.value ? formatCurrency(opportunity.value) : '-'}
                                 {opportunity.budget_type === 'hourly' && <span className="text-slate-500 font-normal">/hr</span>}
                             </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                             <span className="text-sm text-slate-500">Source</span>
                             <span className="text-sm font-medium text-slate-900 capitalize text-right">
                                 {opportunity.source || '-'}
                             </span>
                        </div>

                        {opportunity.description && (
                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-slate-900 mb-2">Description</h3>
                                <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                                    {opportunity.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                    <Link 
                        href={`/opportunities/${opportunity.id}`}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                    >
                        <span>View Full Page</span>
                        <i className="ph-bold ph-arrow-right" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
