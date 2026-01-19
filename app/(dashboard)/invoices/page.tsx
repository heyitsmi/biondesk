import Header from '@/components/dashboard/Header';
import Link from 'next/link';

export default function InvoicesPage() {
    // Mock data - will be replaced with real data from Supabase
    const invoices = [
        {
            id: '1',
            number: 'INV-2024-001',
            title: 'Website Redesign - Final Payment',
            client: 'Acme Corp',
            amount: '$2,750',
            status: 'paid',
            dueDate: 'Jan 20, 2024',
            paidAt: 'Jan 18, 2024'
        },
        {
            id: '2',
            number: 'INV-2024-002',
            title: 'Mobile App Development - Phase 1',
            client: 'Startup.io',
            amount: '$6,000',
            status: 'sent',
            dueDate: 'Jan 28, 2024',
            paidAt: null
        },
        {
            id: '3',
            number: 'INV-2024-003',
            title: 'E-commerce Platform Setup',
            client: 'Tech Solutions',
            amount: '$4,250',
            status: 'overdue',
            dueDate: 'Jan 15, 2024',
            paidAt: null
        },
        {
            id: '4',
            number: 'INV-2024-004',
            title: 'Brand Identity Package',
            client: 'Studio Design',
            amount: '$1,600',
            status: 'draft',
            dueDate: 'Feb 1, 2024',
            paidAt: null
        }
    ];

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            draft: 'bg-slate-100 text-slate-600 border-slate-200',
            sent: 'bg-indigo-50 text-indigo-700 border-indigo-100',
            viewed: 'bg-amber-50 text-amber-700 border-amber-100',
            overdue: 'bg-rose-50 text-rose-700 border-rose-100',
            paid: 'bg-emerald-50 text-emerald-700 border-emerald-100'
        };
        return styles[status] || styles.draft;
    };

    const stats = {
        totalOutstanding: '$10,250',
        overdueAmount: '$4,250',
        paidThisMonth: '$2,750',
        avgDaysToPay: 8
    };

    return (
        <>
            <Header 
                title="Invoices"
                subtitle={`${invoices.length} invoices`}
                newButtonText="New Invoice"
                newButtonHref="/invoices/create"
            />

            <div className="flex-1 overflow-y-auto p-8">
                <div className="w-full">
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                            <p className="text-xs font-[600] text-slate-500 uppercase">Outstanding</p>
                            <p className="text-2xl font-[600] text-slate-900 mt-1">{stats.totalOutstanding}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/50">
                            <p className="text-xs font-[600] text-rose-600 uppercase">Overdue</p>
                            <p className="text-2xl font-[600] text-rose-700 mt-1">{stats.overdueAmount}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                            <p className="text-xs font-[600] text-emerald-600 uppercase">Paid This Month</p>
                            <p className="text-2xl font-[600] text-emerald-700 mt-1">{stats.paidThisMonth}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                            <p className="text-xs font-[600] text-slate-500 uppercase">Avg Days to Pay</p>
                            <p className="text-2xl font-[600] text-slate-900 mt-1">{stats.avgDaysToPay} days</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                <input 
                                    type="text" 
                                    placeholder="Search invoices..." 
                                    className="pl-9 pr-4 py-2 w-64 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-[500] text-slate-600">
                                <option value="all">All Status</option>
                                <option value="draft">Draft</option>
                                <option value="sent">Sent</option>
                                <option value="overdue">Overdue</option>
                                <option value="paid">Paid</option>
                            </select>
                        </div>
                    </div>

                    {/* Invoices Table */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Invoice #</th>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Due Date</th>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {invoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-[600] text-slate-900 group-hover:text-indigo-600 transition-colors">{invoice.number}</p>
                                                <p className="text-xs text-slate-500">{invoice.title}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{invoice.client}</td>
                                        <td className="px-6 py-4 text-sm font-[600] text-slate-900">{invoice.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-[500] border capitalize ${getStatusBadge(invoice.status)}`}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {invoice.paidAt ? (
                                                <span className="text-emerald-600">Paid {invoice.paidAt}</span>
                                            ) : (
                                                invoice.dueDate
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link 
                                                    href={`/invoices/${invoice.id}`}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                                >
                                                    <i className="ph ph-eye"></i>
                                                </Link>
                                                <Link 
                                                    href={`/invoices/${invoice.id}/edit`}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                                >
                                                    <i className="ph ph-pencil-simple"></i>
                                                </Link>
                                                {invoice.status !== 'paid' && (
                                                    <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Mark as Paid">
                                                        <i className="ph ph-check-circle"></i>
                                                    </button>
                                                )}
                                                <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Send">
                                                    <i className="ph ph-paper-plane-tilt"></i>
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
