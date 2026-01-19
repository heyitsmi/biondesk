interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PublicInvoicePage({ params }: PageProps) {
    const { id } = await params;

    // Mock data - in production, fetch by public_token
    const invoice = {
        id,
        number: 'INV-2024-002',
        title: 'Mobile App Development - Phase 1',
        workspace: {
            name: 'John Design Studio',
            email: 'hello@johndesign.co',
            address: '123 Creative Ave, Design City, DC 12345',
            paymentLink: 'https://pay.stripe.com/example',
            bankDetails: {
                bankName: 'Chase Bank',
                accountNumber: 'XXXX-XXXX-1234',
                accountHolder: 'John Design Studio LLC'
            }
        },
        client: {
            name: 'Sarah Johnson',
            company: 'Startup.io',
            email: 'sarah@startup.io'
        },
        issueDate: 'January 18, 2024',
        dueDate: 'January 28, 2024',
        status: 'sent',
        items: [
            { description: 'App UI/UX Design', quantity: 1, unitPrice: 2000, amount: 2000 },
            { description: 'Flutter Development - Core Features', quantity: 1, unitPrice: 3500, amount: 3500 },
            { description: 'API Integration', quantity: 1, unitPrice: 500, amount: 500 }
        ],
        subtotal: 6000,
        tax: 0,
        total: 6000,
        paymentTerms: 'Payment due within 10 days of invoice date.',
        notes: 'Thank you for your business!'
    };

    const isOverdue = invoice.status === 'overdue';
    const isPaid = invoice.status === 'paid';

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
                            <p className="text-sm font-[600] text-slate-900">{invoice.workspace.name}</p>
                            <p className="text-xs text-slate-500">Invoice {invoice.number}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-[600] rounded-lg hover:border-slate-300 transition-all flex items-center gap-1.5">
                            <i className="ph ph-download-simple"></i>
                            Download PDF
                        </button>
                        {!isPaid && (
                            <a 
                                href={invoice.workspace.paymentLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-[600] rounded-lg transition-all flex items-center gap-1.5"
                            >
                                <i className="ph-bold ph-credit-card"></i>
                                Pay Now
                            </a>
                        )}
                    </div>
                </div>
            </header>

            {/* Document */}
            <main className="max-w-4xl mx-auto py-8 px-6">
                
                {/* Status Banner */}
                {isPaid && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <i className="ph-fill ph-check-circle text-emerald-600 text-xl"></i>
                        </div>
                        <div>
                            <p className="text-sm font-[600] text-emerald-900">This invoice has been paid</p>
                            <p className="text-xs text-emerald-700">Payment received on January 25, 2024</p>
                        </div>
                    </div>
                )}

                {isOverdue && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                            <i className="ph-fill ph-warning text-rose-600 text-xl"></i>
                        </div>
                        <div>
                            <p className="text-sm font-[600] text-rose-900">This invoice is overdue</p>
                            <p className="text-xs text-rose-700">Please make payment as soon as possible</p>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                    
                    {/* Document Header */}
                    <div className="p-8 border-b border-slate-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-[700] text-slate-900 mb-2">Invoice</h1>
                                <p className="text-lg text-slate-600">{invoice.title}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-[700] text-indigo-600">${invoice.total.toLocaleString()}</p>
                                <p className="text-sm text-slate-500 mt-1">Amount Due</p>
                            </div>
                        </div>

                        {/* Meta Info */}
                        <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-slate-100">
                            <div>
                                <p className="text-xs font-[600] text-slate-400 uppercase mb-1">Invoice Number</p>
                                <p className="text-sm font-[600] text-slate-900">{invoice.number}</p>
                            </div>
                            <div>
                                <p className="text-xs font-[600] text-slate-400 uppercase mb-1">Issue Date</p>
                                <p className="text-sm font-[600] text-slate-900">{invoice.issueDate}</p>
                            </div>
                            <div>
                                <p className="text-xs font-[600] text-slate-400 uppercase mb-1">Due Date</p>
                                <p className={`text-sm font-[600] ${isOverdue ? 'text-rose-600' : 'text-slate-900'}`}>
                                    {invoice.dueDate}
                                    {isOverdue && ' (Overdue)'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* From / To */}
                    <div className="grid grid-cols-2 gap-8 p-8 bg-slate-50 border-b border-slate-100">
                        <div>
                            <p className="text-xs font-[600] text-slate-400 uppercase mb-2">From</p>
                            <p className="text-sm font-[600] text-slate-900">{invoice.workspace.name}</p>
                            <p className="text-sm text-slate-600">{invoice.workspace.email}</p>
                            <p className="text-sm text-slate-600 mt-1">{invoice.workspace.address}</p>
                        </div>
                        <div>
                            <p className="text-xs font-[600] text-slate-400 uppercase mb-2">Bill To</p>
                            <p className="text-sm font-[600] text-slate-900">{invoice.client.name}</p>
                            <p className="text-sm text-slate-600">{invoice.client.company}</p>
                            <p className="text-sm text-slate-600">{invoice.client.email}</p>
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
                                {invoice.items.map((item, idx) => (
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
                                        <span className="text-sm font-[600] text-slate-900">${invoice.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500">Tax</span>
                                        <span className="text-sm font-[600] text-slate-900">${invoice.tax.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t border-slate-200">
                                        <span className="text-lg font-[600] text-slate-900">Total Due</span>
                                        <span className="text-lg font-[700] text-indigo-600">${invoice.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    {!isPaid && (
                        <div className="p-8 bg-indigo-50 border-t border-indigo-100">
                            <h3 className="text-sm font-[600] text-indigo-900 mb-4">Payment Options</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl p-4 border border-indigo-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="ph ph-credit-card text-indigo-600"></i>
                                        <span className="text-sm font-[600] text-slate-900">Pay Online</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-3">Secure payment via credit card or PayPal</p>
                                    <a 
                                        href={invoice.workspace.paymentLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sm font-[600] text-indigo-600 hover:text-indigo-700"
                                    >
                                        Pay Now <i className="ph ph-arrow-right"></i>
                                    </a>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-indigo-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="ph ph-bank text-indigo-600"></i>
                                        <span className="text-sm font-[600] text-slate-900">Bank Transfer</span>
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        {invoice.workspace.bankDetails.bankName}<br/>
                                        Account: {invoice.workspace.bankDetails.accountNumber}<br/>
                                        Name: {invoice.workspace.bankDetails.accountHolder}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Terms */}
                    <div className="p-8 bg-slate-50 border-t border-slate-100">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs font-[600] text-slate-400 uppercase mb-2">Payment Terms</p>
                                <p className="text-sm text-slate-600">{invoice.paymentTerms}</p>
                            </div>
                            <div>
                                <p className="text-xs font-[600] text-slate-400 uppercase mb-2">Notes</p>
                                <p className="text-sm text-slate-600">{invoice.notes}</p>
                            </div>
                        </div>
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
