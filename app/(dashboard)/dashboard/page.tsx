import Header from '@/components/dashboard/Header';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
    // Mock data - will be replaced with real data from Supabase
    const stats = {
        pipelineValue: '$12,450',
        pipelineChange: '+15%',
        toBeCollected: '$3,200',
        invoicesDue: 2,
        winRate: '42%',
        proposalCount: 20
    };

    const priorityActions = [
        {
            id: '1',
            type: 'overdue',
            icon: 'ph-bold ph-warning',
            iconBg: 'bg-rose-50 border-rose-100',
            iconColor: 'text-rose-600',
            title: 'Invoice #INV-2024-04 Overdue',
            subtitle: 'Client: Studio Design • Due 3 days ago',
            action: 'Send Reminder',
            href: '/invoices/1'
        },
        {
            id: '2',
            type: 'followup',
            icon: 'ph-bold ph-paper-plane-tilt',
            iconBg: 'bg-indigo-50 border-indigo-100',
            iconColor: 'text-indigo-600',
            title: 'Follow up Proposal: E-commerce Redesign',
            subtitle: 'Sent 2 days ago • High Priority',
            action: 'Write Follow-up',
            href: '/proposals/2'
        },
        {
            id: '3',
            type: 'draft',
            icon: 'ph-bold ph-pencil-simple',
            iconBg: 'bg-slate-50 border-slate-100',
            iconColor: 'text-slate-500',
            title: 'Finish drafting Quote for PT Maju Jaya',
            subtitle: 'Last edited 4 hours ago',
            action: 'Resume',
            href: '/quotations/3/edit'
        }
    ];

    const pipeline = {
        opportunities: { count: 5, progress: 40, items: ['SaaS Landing Page Redesign', 'Mobile App Flutter Dev'] },
        negotiation: { count: 2, progress: 60, items: [{ name: 'Corporate Branding Kit', value: '$2.5k' }] }
    };

    const recentActivity = [
        {
            id: '1',
            icon: 'ph-fill ph-file-text',
            entity: 'Quote #Q-2024-001',
            action: 'Sent to client via email',
            date: 'Today, 10:23 AM',
            status: 'Sent',
            statusClass: 'bg-slate-100 text-slate-600 border-slate-200'
        },
        {
            id: '2',
            icon: 'ph-fill ph-check-circle',
            entity: 'Project: Website Redesign',
            action: 'Marked as Completed',
            date: 'Yesterday',
            status: 'Won',
            statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-100'
        }
    ];

    return (
        <>
            <Header 
                title="Dashboard"
                focusItems={['Follow up 2 proposals', 'Send 1 invoice reminder']}
            />

            {/* Dashboard Content */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="w-full space-y-8">
                    
                    {/* 1. KPI Cards (Metrics) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Metric: Pipeline */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card flex flex-col justify-between group hover:border-indigo-200 transition-all">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-[600] text-slate-500 uppercase tracking-wide">Pipeline Value</p>
                                    <h3 className="text-2xl font-[600] text-slate-900 mt-1">{stats.pipelineValue}</h3>
                                </div>
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <i className="ph ph-trend-up"></i>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-xs font-[500]">
                                <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">{stats.pipelineChange}</span>
                                <span className="text-slate-400">vs last month</span>
                            </div>
                        </div>

                        {/* Metric: Outstanding Invoices */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card flex flex-col justify-between group hover:border-amber-200 transition-all">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-[600] text-slate-500 uppercase tracking-wide">To Be Collected</p>
                                    <h3 className="text-2xl font-[600] text-slate-900 mt-1">{stats.toBeCollected}</h3>
                                </div>
                                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                    <i className="ph ph-wallet"></i>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-xs font-[500]">
                                <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">{stats.invoicesDue} Invoices</span>
                                <span className="text-slate-400">due this week</span>
                            </div>
                        </div>

                        {/* Metric: Success Rate */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card flex flex-col justify-between group hover:border-emerald-200 transition-all">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-[600] text-slate-500 uppercase tracking-wide">Win Rate</p>
                                    <h3 className="text-2xl font-[600] text-slate-900 mt-1">{stats.winRate}</h3>
                                </div>
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <i className="ph ph-target"></i>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-xs font-[500]">
                                <span className="text-slate-400">Based on last {stats.proposalCount} proposals</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Split Layout: Priority Actions & Pipeline Snapshot */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* LEFT: Priority Actions (The "To-Do" list) */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-[600] text-slate-900">Priority Actions</h2>
                                <button className="text-sm font-[550] text-indigo-600 hover:text-indigo-700">View all</button>
                            </div>

                            {priorityActions.map((action) => (
                                <Link 
                                    key={action.id}
                                    href={action.href}
                                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group"
                                >
                                    <div className={`w-10 h-10 rounded-full ${action.iconBg} border flex items-center justify-center shrink-0`}>
                                        <i className={`${action.icon} ${action.iconColor}`}></i>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-[600] text-slate-900 group-hover:text-indigo-600 transition-colors">{action.title}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">{action.subtitle}</p>
                                    </div>
                                    <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-[600] rounded-lg hover:border-slate-300 hover:text-slate-900 transition-all">
                                        {action.action}
                                    </button>
                                </Link>
                            ))}
                        </div>

                        {/* RIGHT: Pipeline Snapshot (Mini List) */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-[600] text-slate-900">Pipeline</h2>
                            </div>
                            
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle space-y-5">
                                {/* Stage: Opportunities */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-[600] text-slate-500">OPPORTUNITIES</span>
                                        <span className="text-xs font-[600] text-slate-900">{pipeline.opportunities.count} Active</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${pipeline.opportunities.progress}%` }}></div>
                                    </div>
                                    <div className="mt-3 space-y-2">
                                        {pipeline.opportunities.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                                <p className="text-sm font-[450] text-slate-700 truncate">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100"></div>

                                {/* Stage: Negotiation */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-[600] text-slate-500">NEGOTIATION</span>
                                        <span className="text-xs font-[600] text-slate-900">{pipeline.negotiation.count} Deals</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                                        <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${pipeline.negotiation.progress}%` }}></div>
                                    </div>
                                    <div className="mt-3 space-y-2">
                                        {pipeline.negotiation.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                                <p className="text-sm font-[450] text-slate-700 truncate">{item.name}</p>
                                                <span className="ml-auto text-xs text-slate-400">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Mini Promo for AI */}
                            <Link href="/proposals/generate" className="block bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-5 text-white shadow-lg relative overflow-hidden group cursor-pointer">
                                <div className="relative z-10">
                                    <h3 className="text-base font-[600] mb-1">Generate Proposal</h3>
                                    <p className="text-xs font-[400] text-indigo-100 mb-3">Turn a messy job post into a winning proposal in seconds.</p>
                                    <div className="inline-flex items-center gap-1 text-xs font-[600] bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-colors">
                                        <span>Try AI Draft</span>
                                        <i className="ph-bold ph-arrow-right"></i>
                                    </div>
                                </div>
                                {/* Decor */}
                                <i className="ph ph-magic-wand absolute -right-2 -bottom-2 text-6xl text-white/10 rotate-12 group-hover:scale-110 transition-transform"></i>
                            </Link>
                        </div>
                    </div>

                    {/* 3. Recent Activity (History) */}
                    <div>
                        <h2 className="text-lg font-[600] text-slate-900 mb-4">Recent Activity</h2>
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Entity</th>
                                        <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Action</th>
                                        <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentActivity.map((activity) => (
                                        <tr key={activity.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                                                        <i className={activity.icon}></i>
                                                    </div>
                                                    <span className="text-sm font-[500] text-slate-900">{activity.entity}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{activity.action}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{activity.date}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-[500] border ${activity.statusClass}`}>
                                                    {activity.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
                
                {/* Footer */}
                <div className="mt-12 mb-6 text-center">
                    <p className="text-xs text-slate-400">© 2026 Flova. Crafted for growth.</p>
                </div>
            </div>
        </>
    );
}
