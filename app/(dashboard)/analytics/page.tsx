import Header from '@/components/dashboard/Header';

export default function AnalyticsPage() {
    // Mock data - will be replaced with real data from Supabase
    const stats = {
        totalRevenue: '$24,500',
        revenueChange: '+12%',
        avgTimeToPayDays: 8,
        avgTimeToPayChange: '-2 days',
        winRate: '42%',
        winRateChange: '+5%',
        activeDeals: 12,
        activeDealsValue: '$15,200'
    };

    const monthlyData = [
        { month: 'Aug', invoiced: 4200, paid: 3800 },
        { month: 'Sep', invoiced: 5100, paid: 4900 },
        { month: 'Oct', invoiced: 4800, paid: 4600 },
        { month: 'Nov', invoiced: 6200, paid: 5800 },
        { month: 'Dec', invoiced: 7500, paid: 6200 },
        { month: 'Jan', invoiced: 5400, paid: 4100 }
    ];

    const pipelineBreakdown = [
        { stage: 'New Inbox', count: 5, value: '$8,500', color: 'bg-slate-400' },
        { stage: 'Drafting', count: 3, value: '$5,200', color: 'bg-indigo-400' },
        { stage: 'Sent', count: 4, value: '$12,800', color: 'bg-amber-400' },
        { stage: 'Negotiation', count: 2, value: '$6,500', color: 'bg-emerald-400' }
    ];

    const topClients = [
        { name: 'Acme Corp', totalValue: '$12,500', projects: 4, status: 'Active' },
        { name: 'Startup.io', totalValue: '$8,200', projects: 2, status: 'Active' },
        { name: 'Tech Solutions', totalValue: '$6,800', projects: 3, status: 'Inactive' },
        { name: 'Studio Design', totalValue: '$5,400', projects: 2, status: 'Active' }
    ];

    return (
        <>
            <Header 
                title="Analytics"
                subtitle="Track your business performance"
                showNewButton={false}
            />

            <div className="flex-1 overflow-y-auto p-8">
                <div className="w-full space-y-8">
                    
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Total Revenue */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-[600] text-slate-500 uppercase tracking-wide">Total Revenue (6mo)</p>
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <i className="ph ph-currency-dollar"></i>
                                </div>
                            </div>
                            <h3 className="text-2xl font-[600] text-slate-900">{stats.totalRevenue}</h3>
                            <p className="text-xs text-emerald-600 mt-2 font-[500]">{stats.revenueChange} vs last period</p>
                        </div>

                        {/* Avg Time to Pay */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-[600] text-slate-500 uppercase tracking-wide">Avg Time to Pay</p>
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <i className="ph ph-clock"></i>
                                </div>
                            </div>
                            <h3 className="text-2xl font-[600] text-slate-900">{stats.avgTimeToPayDays} days</h3>
                            <p className="text-xs text-emerald-600 mt-2 font-[500]">{stats.avgTimeToPayChange} improvement</p>
                        </div>

                        {/* Win Rate */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-[600] text-slate-500 uppercase tracking-wide">Win Rate</p>
                                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                    <i className="ph ph-target"></i>
                                </div>
                            </div>
                            <h3 className="text-2xl font-[600] text-slate-900">{stats.winRate}</h3>
                            <p className="text-xs text-emerald-600 mt-2 font-[500]">{stats.winRateChange} vs last period</p>
                        </div>

                        {/* Active Deals */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-[600] text-slate-500 uppercase tracking-wide">Active Deals</p>
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <i className="ph ph-briefcase"></i>
                                </div>
                            </div>
                            <h3 className="text-2xl font-[600] text-slate-900">{stats.activeDeals}</h3>
                            <p className="text-xs text-slate-500 mt-2 font-[500]">{stats.activeDealsValue} total value</p>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Revenue Chart */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-[600] text-slate-900">Revenue Overview</h2>
                                <select className="text-xs font-[500] text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                                    <option>Last 6 months</option>
                                    <option>Last 12 months</option>
                                </select>
                            </div>
                            
                            {/* Simple bar chart representation */}
                            <div className="h-64 flex items-end justify-between gap-4 px-4">
                                {monthlyData.map((data, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full flex flex-col gap-1">
                                            <div 
                                                className="w-full bg-indigo-200 rounded-t"
                                                style={{ height: `${(data.invoiced / 8000) * 180}px` }}
                                            ></div>
                                            <div 
                                                className="w-full bg-indigo-500 rounded-t"
                                                style={{ height: `${(data.paid / 8000) * 180}px`, marginTop: `-${(data.invoiced / 8000) * 180}px` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-slate-500">{data.month}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex items-center justify-center gap-6 mt-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-indigo-200 rounded"></div>
                                    <span className="text-xs text-slate-500">Invoiced</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-indigo-500 rounded"></div>
                                    <span className="text-xs text-slate-500">Paid</span>
                                </div>
                            </div>
                        </div>

                        {/* Pipeline Breakdown */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200">
                            <h2 className="text-lg font-[600] text-slate-900 mb-6">Pipeline Breakdown</h2>
                            
                            <div className="space-y-4">
                                {pipelineBreakdown.map((stage, idx) => (
                                    <div key={idx}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-[500] text-slate-700">{stage.stage}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-slate-500">{stage.count} deals</span>
                                                <span className="text-sm font-[600] text-slate-900">{stage.value}</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2">
                                            <div 
                                                className={`${stage.color} h-2 rounded-full`}
                                                style={{ width: `${(parseInt(stage.value.replace(/[$,]/g, '')) / 15000) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-[600] text-slate-900">Total Pipeline Value</span>
                                    <span className="text-lg font-[600] text-indigo-600">$33,000</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Clients */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-lg font-[600] text-slate-900">Top Clients</h2>
                            <button className="text-sm font-[550] text-indigo-600 hover:text-indigo-700">View all</button>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Total Value</th>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Projects</th>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {topClients.map((client, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-[600]">
                                                    {client.name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-[500] text-slate-900">{client.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-[600] text-slate-900">{client.totalValue}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{client.projects} projects</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-[500] ${
                                                client.status === 'Active' 
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                            }`}>
                                                {client.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
