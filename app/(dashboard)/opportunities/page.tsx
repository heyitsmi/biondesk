import Header from '@/components/dashboard/Header';
import Link from 'next/link';

export default function OpportunitiesPage() {
    // Mock data - will be replaced with real data from Supabase
    const stages = [
        {
            id: 'inbox',
            name: 'New Inbox',
            color: 'bg-slate-400',
            borderColor: 'border-slate-200',
            count: 3,
            opportunities: [
                { id: '1', title: 'SaaS Landing Page Redesign', client: 'Potential Client', source: 'Upwork', value: '$2,500', priority: 'high', daysAgo: 1 },
                { id: '2', title: 'Mobile App UX Audit', client: null, source: 'LinkedIn', value: '$1,800', priority: 'medium', daysAgo: 2 },
                { id: '3', title: 'Corporate Website', client: null, source: 'Direct', value: '$3,200', priority: 'low', daysAgo: 3 }
            ]
        },
        {
            id: 'drafting',
            name: 'Drafting',
            color: 'bg-indigo-400',
            borderColor: 'border-indigo-200',
            count: 2,
            opportunities: [
                { id: '4', title: 'E-commerce Platform', client: 'Startup.io', source: 'Referral', value: '$5,000', priority: 'high', daysAgo: 4 }
            ]
        },
        {
            id: 'sent',
            name: 'Proposal Sent',
            color: 'bg-amber-400',
            borderColor: 'border-amber-200',
            count: 2,
            opportunities: [
                { id: '5', title: 'Brand Identity System', client: 'Acme Corp', source: 'Direct', value: '$4,500', priority: 'high', daysAgo: 2 },
                { id: '6', title: 'Admin Dashboard', client: 'Tech Solutions', source: 'Upwork', value: '$3,800', priority: 'medium', daysAgo: 5 }
            ]
        },
        {
            id: 'negotiation',
            name: 'Negotiation',
            color: 'bg-emerald-400',
            borderColor: 'border-emerald-200',
            count: 1,
            opportunities: [
                { id: '7', title: 'Corporate Branding Kit', client: 'Studio Design', source: 'Referral', value: '$6,200', priority: 'high', daysAgo: 7 }
            ]
        }
    ];

    const getPriorityBadge = (priority: string) => {
        const styles: Record<string, string> = {
            high: 'bg-rose-50 text-rose-600 border-rose-100',
            medium: 'bg-amber-50 text-amber-600 border-amber-100',
            low: 'bg-slate-50 text-slate-500 border-slate-200'
        };
        return styles[priority] || styles.low;
    };

    const getSourceIcon = (source: string) => {
        const icons: Record<string, string> = {
            'Upwork': 'ph-briefcase',
            'LinkedIn': 'ph-linkedin-logo',
            'Direct': 'ph-envelope',
            'Referral': 'ph-users'
        };
        return icons[source] || 'ph-globe';
    };

    return (
        <>
            <Header 
                title="Opportunities"
                subtitle="Manage your sales pipeline"
                newButtonText="New Opportunity"
                newButtonHref="/opportunities/create"
            />

            <div className="flex-1 overflow-hidden p-8">
                {/* Pipeline Board */}
                <div className="flex gap-6 h-full overflow-x-auto pb-4">
                    {stages.map((stage) => (
                        <div key={stage.id} className="flex-shrink-0 w-80">
                            {/* Column Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                                    <h3 className="text-sm font-[600] text-slate-700">{stage.name}</h3>
                                    <span className="text-xs text-slate-400">({stage.count})</span>
                                </div>
                                <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors">
                                    <i className="ph ph-plus text-sm"></i>
                                </button>
                            </div>

                            {/* Cards Container */}
                            <div className={`bg-slate-50/50 border ${stage.borderColor} rounded-xl p-3 space-y-3 min-h-[400px]`}>
                                {stage.opportunities.map((opp) => (
                                    <Link
                                        key={opp.id}
                                        href={`/opportunities/${opp.id}`}
                                        className="block bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-slate-300 transition-all cursor-grab active:cursor-grabbing group"
                                    >
                                        {/* Title & Priority */}
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <h4 className="text-sm font-[600] text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">{opp.title}</h4>
                                            <span className={`shrink-0 px-1.5 py-0.5 text-[10px] font-[600] rounded border capitalize ${getPriorityBadge(opp.priority)}`}>
                                                {opp.priority}
                                            </span>
                                        </div>

                                        {/* Client & Source */}
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                                            <i className={`ph ${getSourceIcon(opp.source)}`}></i>
                                            <span>{opp.source}</span>
                                            {opp.client && (
                                                <>
                                                    <span>•</span>
                                                    <span>{opp.client}</span>
                                                </>
                                            )}
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                            <span className="text-sm font-[600] text-slate-900">{opp.value}</span>
                                            <span className="text-[10px] text-slate-400">{opp.daysAgo}d ago</span>
                                        </div>
                                    </Link>
                                ))}

                                {stage.opportunities.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                                            <i className="ph ph-folder-open text-slate-400 text-lg"></i>
                                        </div>
                                        <p className="text-xs text-slate-400">No opportunities here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Won & Lost columns (collapsed) */}
                    <div className="flex-shrink-0 w-20 flex flex-col gap-4">
                        <button className="flex-1 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col items-center justify-center p-4 hover:bg-emerald-100 transition-colors group">
                            <i className="ph ph-trophy text-2xl text-emerald-500 mb-2"></i>
                            <span className="text-xs font-[600] text-emerald-700">Won</span>
                            <span className="text-lg font-[700] text-emerald-600 mt-1">5</span>
                        </button>
                        <button className="flex-1 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 hover:bg-slate-100 transition-colors group">
                            <i className="ph ph-x-circle text-2xl text-slate-400 mb-2"></i>
                            <span className="text-xs font-[600] text-slate-600">Lost</span>
                            <span className="text-lg font-[700] text-slate-500 mt-1">2</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
