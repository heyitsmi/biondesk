interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PublicQuotePage({ params }: PageProps) {
    const { id } = await params;

    // Mock data - in production, fetch by public_token
    const quote = {
        id,
        number: 'Q-2024-001',
        title: 'Website Redesign Project',
        workspace: {
            name: 'John Design Studio',
            email: 'hello@johndesign.co',
            address: '123 Creative Ave, Design City, DC 12345',
            logo: null
        },
        client: {
            name: 'John Smith',
            company: 'Acme Corporation',
            email: 'john@acmecorp.com'
        },
        createdAt: 'January 15, 2024',
        validUntil: 'January 30, 2024',
        items: [
            { description: 'UI/UX Design - Homepage & 5 Inner Pages', quantity: 1, unitPrice: 2500, amount: 2500 },
            { description: 'Frontend Development (React/Next.js)', quantity: 1, unitPrice: 2500, amount: 2500 },
            { description: 'CMS Integration & Training', quantity: 1, unitPrice: 500, amount: 500 }
        ],
        subtotal: 5500,
        tax: 0,
        total: 5500,
        terms: '50% upfront deposit required ($2,750). Balance due upon project completion. Quote valid for 14 days.',
        notes: 'Thank you for considering us for your project. We look forward to working together!'
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Header Bar */}
            <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                            <i className="ph-bold ph-lightning text-lg"></i>
                        </div>
                        <div>
                            <p className="text-sm font-[600] text-slate-900">{quote.workspace.name}</p>
                            <p className="text-xs text-slate-500">Quote {quote.number}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-[600] rounded-lg hover:border-slate-300 transition-all flex items-center gap-1.5">
                            <i className="ph ph-download-simple"></i>
                            Download PDF
                        </button>
                        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-[600] rounded-lg transition-all flex items-center gap-1.5">
                            <i className="ph-bold ph-check"></i>
                            Accept Quote
                        </button>
                    </div>
                </div>
            </header>

            {/* Document */}
            <main className="max-w-4xl mx-auto py-8 px-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                    
                    {/* Document Header */}
                    <div className="p-8 border-b border-slate-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-[700] text-slate-900 mb-2">Quote</h1>
                                <p className="text-lg text-slate-600">{quote.title}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-[700] text-indigo-600">${quote.total.toLocaleString()}</p>
                                <p className="text-sm text-slate-500 mt-1">Total Amount</p>
                            </div>
                        </div>

                        {/* Meta Info */}
                        <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-slate-100">
                            <div>
                                <p className="text-xs font-[600] text-slate-400 uppercase mb-1">Quote Number</p>
                                <p className="text-sm font-[600] text-slate-900">{quote.number}</p>
                            </div>
                            <div>
                                <p className="text-xs font-[600] text-slate-400 uppercase mb-1">Date Issued</p>
                                <p className="text-sm font-[600] text-slate-900">{quote.createdAt}</p>
                            </div>
                            <div>
                                <p className="text-xs font-[600] text-slate-400 uppercase mb-1">Valid Until</p>
                                <p className="text-sm font-[600] text-slate-900">{quote.validUntil}</p>
                            </div>
                        </div>
                    </div>

                    {/* From / To */}
                    <div className="grid grid-cols-2 gap-8 p-8 bg-slate-50 border-b border-slate-100">
                        <div>
                            <p className="text-xs font-[600] text-slate-400 uppercase mb-2">From</p>
                            <p className="text-sm font-[600] text-slate-900">{quote.workspace.name}</p>
                            <p className="text-sm text-slate-600">{quote.workspace.email}</p>
                            <p className="text-sm text-slate-600 mt-1">{quote.workspace.address}</p>
                        </div>
                        <div>
                            <p className="text-xs font-[600] text-slate-400 uppercase mb-2">To</p>
                            <p className="text-sm font-[600] text-slate-900">{quote.client.name}</p>
                            <p className="text-sm text-slate-600">{quote.client.company}</p>
                            <p className="text-sm text-slate-600">{quote.client.email}</p>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="p-8">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="pb-4 text-left text-xs font-[600] text-slate-500 uppercase">Description</th>
                                    <th className="pb-4 text-center text-xs font-[600] text-slate-500 uppercase w-20">Qty</th>
                                    <th className="pb-4 text-right text-xs font-[600] text-slate-500 uppercase w-28">Price</th>
                                    <th className="pb-4 text-right text-xs font-[600] text-slate-500 uppercase w-28">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quote.items.map((item, idx) => (
                                    <tr key={idx} className="border-b border-slate-100">
                                        <td className="py-4 text-sm text-slate-700">{item.description}</td>
                                        <td className="py-4 text-sm text-slate-600 text-center">{item.quantity}</td>
                                        <td className="py-4 text-sm text-slate-600 text-right">${item.unitPrice.toLocaleString()}</td>
                                        <td className="py-4 text-sm font-[600] text-slate-900 text-right">${item.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div className="mt-6 pt-6 border-t border-slate-200">
                            <div className="flex justify-end">
                                <div className="w-64 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500">Subtotal</span>
                                        <span className="text-sm font-[600] text-slate-900">${quote.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500">Tax</span>
                                        <span className="text-sm font-[600] text-slate-900">${quote.tax.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t border-slate-200">
                                        <span className="text-lg font-[600] text-slate-900">Total</span>
                                        <span className="text-lg font-[700] text-indigo-600">${quote.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Terms & Notes */}
                    <div className="grid grid-cols-2 gap-8 p-8 bg-slate-50 border-t border-slate-100">
                        <div>
                            <p className="text-xs font-[600] text-slate-400 uppercase mb-2">Payment Terms</p>
                            <p className="text-sm text-slate-600">{quote.terms}</p>
                        </div>
                        <div>
                            <p className="text-xs font-[600] text-slate-400 uppercase mb-2">Notes</p>
                            <p className="text-sm text-slate-600">{quote.notes}</p>
                        </div>
                    </div>

                    {/* Accept CTA */}
                    <div className="p-8 bg-indigo-50 border-t border-indigo-100 text-center">
                        <p className="text-sm text-indigo-700 mb-4">Ready to proceed? Accept this quote to get started.</p>
                        <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-[600] rounded-xl shadow-lg shadow-indigo-200 transition-all">
                            Accept Quote & Proceed
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-xs text-slate-400">Powered by <span className="font-[600]">Flova</span></p>
                </div>
            </main>
        </div>
    );
}
