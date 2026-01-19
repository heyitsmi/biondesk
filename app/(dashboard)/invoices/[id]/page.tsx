import Header from '@/components/dashboard/Header';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({ params }: PageProps) {
    const { id } = await params;

    // Mock data - will be replaced with real data from Supabase
    const invoice = {
        id,
        number: 'INV-2024-002',
        title: 'Mobile App Development - Phase 1',
        client: {
            name: 'Sarah Johnson',
            company: 'Startup.io',
            email: 'sarah@startup.io'
        },
        status: 'sent',
        issueDate: 'Jan 18, 2024',
        dueDate: 'Jan 28, 2024',
        viewCount: 1,
        items: [
            { description: 'App UI/UX Design', quantity: 1, unitPrice: 2000, amount: 2000 },
            { description: 'Flutter Development - Core Features', quantity: 1, unitPrice: 3500, amount: 3500 },
            { description: 'API Integration', quantity: 1, unitPrice: 500, amount: 500 }
        ],
        subtotal: 6000,
        tax: 0,
        total: 6000,
        paymentTerms: 'Payment due within 10 days of invoice date. Bank transfer or PayPal accepted.',
        notes: 'Thank you for your business! This invoice covers Phase 1 development as agreed.'
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, { bg: string; text: string; label: string }> = {
            draft: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Draft' },
            sent: { bg: 'bg-indigo-50', text: 'text-indigo-700', label: 'Sent' },
            viewed: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Viewed' },
            overdue: { bg: 'bg-rose-50', text: 'text-rose-700', label: 'Overdue' },
            paid: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Paid' }
        };
        return styles[status] || styles.draft;
    };

    const statusBadge = getStatusBadge(invoice.status);

    return (
        <>
            <Header 
                title={invoice.number}
                subtitle={invoice.title}
                showNewButton={false}
            />

            <div className="flex-1 overflow-y-auto p-8">
                <div className="w-full max-w-4xl">
                    
                    {/* Back Link */}
                    <Link 
                        href="/invoices" 
                        className="inline-flex items-center gap-1.5 text-sm font-[500] text-slate-500 hover:text-slate-700 mb-6"
                    >
                        <i className="ph ph-arrow-left"></i>
                        Back to Invoices
                    </Link>

                    {/* Header Card */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-xl font-[600] text-slate-900">{invoice.title}</h1>
                                        <span className={`px-2 py-1 rounded text-xs font-[500] ${statusBadge.bg} ${statusBadge.text}`}>
                                            {statusBadge.label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        Bill To: <span className="font-[500] text-slate-700">{invoice.client.name}</span> • {invoice.client.company}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link 
                                        href={`/invoices/${id}/edit`}
                                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-[600] rounded-lg hover:border-slate-300 transition-all flex items-center gap-1.5"
                                    >
                                        <i className="ph ph-pencil-simple"></i>
                                        Edit
                                    </Link>
                                    {invoice.status !== 'paid' && (
                                        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-[600] rounded-lg transition-all flex items-center gap-1.5">
                                            <i className="ph-bold ph-check"></i>
                                            Mark as Paid
                                        </button>
                                    )}
                                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-[600] rounded-lg transition-all flex items-center gap-1.5">
                                        <i className="ph ph-paper-plane-tilt"></i>
                                        Send Reminder
                                    </button>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <i className="ph ph-calendar"></i>
                                    Issued {invoice.issueDate}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <i className="ph ph-clock"></i>
                                    Due {invoice.dueDate}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <i className="ph ph-eye"></i>
                                    {invoice.viewCount} views
                                </div>
                                <Link 
                                    href={`/invoice/${id}`}
                                    target="_blank"
                                    className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-[500]"
                                >
                                    <i className="ph ph-link"></i>
                                    Payment Link
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Content */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-lg font-[600] text-slate-900">Line Items</h2>
                            <div className="text-right">
                                <p className="text-2xl font-[700] text-indigo-600">${invoice.total.toLocaleString()}</p>
                                <p className="text-xs text-slate-500">Total Due</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="pb-3 text-left text-xs font-[600] text-slate-500 uppercase">Description</th>
                                        <th className="pb-3 text-center text-xs font-[600] text-slate-500 uppercase w-20">Qty</th>
                                        <th className="pb-3 text-right text-xs font-[600] text-slate-500 uppercase w-28">Price</th>
                                        <th className="pb-3 text-right text-xs font-[600] text-slate-500 uppercase w-28">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.items.map((item, idx) => (
                                        <tr key={idx} className="border-b border-slate-50">
                                            <td className="py-4 text-sm text-slate-700">{item.description}</td>
                                            <td className="py-4 text-sm text-slate-600 text-center">{item.quantity}</td>
                                            <td className="py-4 text-sm text-slate-600 text-right">${item.unitPrice.toLocaleString()}</td>
                                            <td className="py-4 text-sm font-[600] text-slate-900 text-right">${item.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Totals */}
                            <div className="mt-6 pt-4 border-t border-slate-200 space-y-2">
                                <div className="flex justify-end gap-8">
                                    <span className="text-sm text-slate-500">Subtotal</span>
                                    <span className="text-sm font-[600] text-slate-900 w-28 text-right">${invoice.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-end gap-8">
                                    <span className="text-sm text-slate-500">Tax</span>
                                    <span className="text-sm font-[600] text-slate-900 w-28 text-right">${invoice.tax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-end gap-8 pt-3 border-t border-slate-100">
                                    <span className="text-lg font-[600] text-slate-900">Total Due</span>
                                    <span className="text-lg font-[700] text-indigo-600 w-28 text-right">${invoice.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment & Notes */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="text-lg font-[600] text-slate-900">Payment Terms</h2>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-slate-600">{invoice.paymentTerms}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="text-lg font-[600] text-slate-900">Notes</h2>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-slate-600">{invoice.notes}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6 flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-600">Quick Actions:</span>
                            <button className="text-sm font-[500] text-indigo-600 hover:text-indigo-700">Download PDF</button>
                            <span className="text-slate-300">•</span>
                            <button className="text-sm font-[500] text-indigo-600 hover:text-indigo-700">Duplicate</button>
                            <span className="text-slate-300">•</span>
                            <button className="text-sm font-[500] text-indigo-600 hover:text-indigo-700">Record Payment</button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
