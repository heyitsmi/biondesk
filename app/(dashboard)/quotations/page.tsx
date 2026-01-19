import Header from '@/components/dashboard/Header';
import Link from 'next/link';

export default function QuotationsPage() {
    // Mock data - will be replaced with real data from Supabase
    const quotations = [
        {
            id: '1',
            number: 'Q-2024-001',
            title: 'Website Redesign Quote',
            client: 'Acme Corp',
            amount: '$5,500',
            status: 'sent',
            validUntil: 'Jan 30, 2024',
            createdAt: 'Jan 15, 2024'
        },
        {
            id: '2',
            number: 'Q-2024-002',
            title: 'Mobile App Development',
            client: 'Startup.io',
            amount: '$12,000',
            status: 'accepted',
            validUntil: 'Feb 15, 2024',
            createdAt: 'Jan 18, 2024'
        },
        {
            id: '3',
            number: 'Q-2024-003',
            title: 'E-commerce Platform',
            client: 'Tech Solutions',
            amount: '$8,500',
            status: 'draft',
            validUntil: 'Feb 10, 2024',
            createdAt: 'Jan 20, 2024'
        },
        {
            id: '4',
            number: 'Q-2024-004',
            title: 'Brand Identity Package',
            client: 'Studio Design',
            amount: '$3,200',
            status: 'viewed',
            validUntil: 'Feb 5, 2024',
            createdAt: 'Jan 22, 2024'
        }
    ];

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            draft: 'bg-slate-100 text-slate-600 border-slate-200',
            sent: 'bg-indigo-50 text-indigo-700 border-indigo-100',
            viewed: 'bg-amber-50 text-amber-700 border-amber-100',
            accepted: 'bg-emerald-50 text-emerald-700 border-emerald-100',
            expired: 'bg-rose-50 text-rose-700 border-rose-100'
        };
        return styles[status] || styles.draft;
    };

    return (
        <>
            <Header 
                title="Quotations"
                subtitle={`${quotations.length} quotes`}
                newButtonText="New Quote"
                newButtonHref="/quotations/create"
            />

            <div className="flex-1 overflow-y-auto p-8">
                <div className="w-full">
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                            <p className="text-xs font-[600] text-slate-500 uppercase">Total Value</p>
                            <p className="text-2xl font-[600] text-slate-900 mt-1">$29,200</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                            <p className="text-xs font-[600] text-slate-500 uppercase">Pending</p>
                            <p className="text-2xl font-[600] text-slate-900 mt-1">3</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                            <p className="text-xs font-[600] text-slate-500 uppercase">Accepted</p>
                            <p className="text-2xl font-[600] text-emerald-600 mt-1">1</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                            <p className="text-xs font-[600] text-slate-500 uppercase">Conversion Rate</p>
                            <p className="text-2xl font-[600] text-slate-900 mt-1">25%</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                <input 
                                    type="text" 
                                    placeholder="Search quotes..." 
                                    className="pl-9 pr-4 py-2 w-64 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-[500] text-slate-600">
                                <option value="all">All Status</option>
                                <option value="draft">Draft</option>
                                <option value="sent">Sent</option>
                                <option value="viewed">Viewed</option>
                                <option value="accepted">Accepted</option>
                            </select>
                        </div>
                    </div>

                    {/* Quotations Table */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Quote #</th>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Valid Until</th>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {quotations.map((quote) => (
                                    <tr key={quote.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-[600] text-slate-900 group-hover:text-indigo-600 transition-colors">{quote.number}</p>
                                                <p className="text-xs text-slate-500">{quote.title}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{quote.client}</td>
                                        <td className="px-6 py-4 text-sm font-[600] text-slate-900">{quote.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-[500] border capitalize ${getStatusBadge(quote.status)}`}>
                                                {quote.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{quote.validUntil}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link 
                                                    href={`/quotations/${quote.id}`}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                                >
                                                    <i className="ph ph-eye"></i>
                                                </Link>
                                                <Link 
                                                    href={`/quotations/${quote.id}/edit`}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                                >
                                                    <i className="ph ph-pencil-simple"></i>
                                                </Link>
                                                <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                                                    <i className="ph ph-paper-plane-tilt"></i>
                                                </button>
                                                <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors">
                                                    <i className="ph ph-trash"></i>
                                                </button>
                                            </div>
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
