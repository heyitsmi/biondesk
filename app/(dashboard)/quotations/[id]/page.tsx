import Header from '@/components/dashboard/Header';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function QuotationDetailPage({ params }: PageProps) {
    const { id } = await params;

    // Mock data - will be replaced with real data from Supabase
    const quotation = {
        id,
        number: 'Q-2024-001',
        title: 'Website Redesign Project',
        client: {
            name: 'John Smith',
            email: 'john@acmecorp.com',
            company: 'Acme Corp'
        },
        status: 'sent',
        createdAt: 'Jan 15, 2024',
        validUntil: 'Jan 30, 2024',
        viewCount: 2,
        items: [
            { description: 'UI/UX Design - Homepage & 5 Inner Pages', quantity: 1, unitPrice: 2500, amount: 2500 },
            { description: 'Frontend Development (React/Next.js)', quantity: 1, unitPrice: 2500, amount: 2500 },
            { description: 'CMS Integration & Training', quantity: 1, unitPrice: 500, amount: 500 }
        ],
        subtotal: 5500,
        tax: 0,
        total: 5500,
        terms: '50% upfront deposit required. Balance due upon project completion. Quote valid for 14 days.',
        notes: 'Thank you for considering us for your project. We look forward to working together!'
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, { bg: string; text: string; label: string }> = {
            draft: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Draft' },
            sent: { bg: 'bg-indigo-50', text: 'text-indigo-700', label: 'Sent' },
            viewed: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Viewed' },
            accepted: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Accepted' }
        };
        return styles[status] || styles.draft;
    };

    const statusBadge = getStatusBadge(quotation.status);

    return (
        <>
            <Header 
                title={quotation.number}
                subtitle={quotation.title}
                showNewButton={false}
            />

            <div className="flex-1 overflow-y-auto p-8">
                <div className="w-full max-w-4xl">
                    
                    {/* Back Link */}
                    <Link 
                        href="/quotations" 
                        className="inline-flex items-center gap-1.5 text-sm font-[500] text-slate-500 hover:text-slate-700 mb-6"
                    >
                        <i className="ph ph-arrow-left"></i>
                        Back to Quotations
                    </Link>

                    {/* Header Card */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-xl font-[600] text-slate-900">{quotation.title}</h1>
                                        <span className={`px-2 py-1 rounded text-xs font-[500] ${statusBadge.bg} ${statusBadge.text}`}>
                                            {statusBadge.label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        For: <span className="font-[500] text-slate-700">{quotation.client.name}</span> • {quotation.client.company}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link 
                                        href={`/quotations/${id}/edit`}
                                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-[600] rounded-lg hover:border-slate-300 transition-all flex items-center gap-1.5"
                                    >
                                        <i className="ph ph-pencil-simple"></i>
                                        Edit
                                    </Link>
                                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-[600] rounded-lg transition-all flex items-center gap-1.5">
                                        <i className="ph ph-paper-plane-tilt"></i>
                                        Send
                                    </button>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <i className="ph ph-calendar"></i>
                                    Created {quotation.createdAt}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <i className="ph ph-clock"></i>
                                    Valid until {quotation.validUntil}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <i className="ph ph-eye"></i>
                                    {quotation.viewCount} views
                                </div>
                                <Link 
                                    href={`/quote/${id}`}
                                    target="_blank"
                                    className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-[500]"
                                >
                                    <i className="ph ph-link"></i>
                                    Public Link
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Quote Content */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h2 className="text-lg font-[600] text-slate-900">Line Items</h2>
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
                                    {quotation.items.map((item, idx) => (
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
                                    <span className="text-sm font-[600] text-slate-900 w-28 text-right">${quotation.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-end gap-8">
                                    <span className="text-sm text-slate-500">Tax</span>
                                    <span className="text-sm font-[600] text-slate-900 w-28 text-right">${quotation.tax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-end gap-8 pt-3 border-t border-slate-100">
                                    <span className="text-lg font-[600] text-slate-900">Total</span>
                                    <span className="text-lg font-[700] text-indigo-600 w-28 text-right">${quotation.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Terms & Notes */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="text-lg font-[600] text-slate-900">Terms</h2>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-slate-600">{quotation.terms}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="text-lg font-[600] text-slate-900">Notes</h2>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-slate-600">{quotation.notes}</p>
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
                            <button className="text-sm font-[500] text-indigo-600 hover:text-indigo-700">Convert to Invoice</button>
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
