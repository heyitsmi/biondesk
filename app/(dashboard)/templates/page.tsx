import Header from '@/components/dashboard/Header';
import Link from 'next/link';

export default function TemplatesPage() {
    // Mock data - will be replaced with real data from Supabase
    const templates = [
        {
            id: '1',
            name: 'Standard Project Quote',
            type: 'quote',
            description: 'Professional quote template for most projects',
            itemCount: 5,
            lastUsed: '2 days ago',
            usageCount: 12
        },
        {
            id: '2',
            name: 'Retainer Agreement',
            type: 'quote',
            description: 'Monthly retainer template with hourly rates',
            itemCount: 3,
            lastUsed: '1 week ago',
            usageCount: 5
        },
        {
            id: '3',
            name: 'Standard Invoice',
            type: 'invoice',
            description: 'Clean invoice template with bank details',
            itemCount: 4,
            lastUsed: 'Yesterday',
            usageCount: 24
        },
        {
            id: '4',
            name: 'Milestone Invoice',
            type: 'invoice',
            description: 'Invoice template for milestone-based payments',
            itemCount: 3,
            lastUsed: '3 days ago',
            usageCount: 8
        }
    ];

    const getTypeIcon = (type: string) => {
        return type === 'quote' ? 'ph-file-text' : 'ph-receipt';
    };

    const getTypeBadge = (type: string) => {
        return type === 'quote' 
            ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
            : 'bg-emerald-50 text-emerald-700 border-emerald-100';
    };

    return (
        <>
            <Header 
                title="Templates"
                subtitle="Reusable document templates"
                newButtonText="New Template"
                newButtonHref="/templates/create"
            />

            <div className="flex-1 overflow-y-auto p-8">
                <div className="w-full">
                    
                    {/* Template Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map((template) => (
                            <div 
                                key={template.id}
                                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-200 hover:shadow-md transition-all group"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                        <i className={`ph ${getTypeIcon(template.type)} text-2xl text-slate-500 group-hover:text-indigo-600 transition-colors`}></i>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-[500] border capitalize ${getTypeBadge(template.type)}`}>
                                        {template.type}
                                    </span>
                                </div>

                                {/* Content */}
                                <h3 className="text-base font-[600] text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                                    {template.name}
                                </h3>
                                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{template.description}</p>

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                                    <span>{template.itemCount} items</span>
                                    <span>•</span>
                                    <span>Used {template.usageCount} times</span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <span className="text-xs text-slate-400">Last used {template.lastUsed}</span>
                                    <div className="flex items-center gap-2">
                                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                                            <i className="ph ph-pencil-simple"></i>
                                        </button>
                                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                                            <i className="ph ph-copy"></i>
                                        </button>
                                        <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors">
                                            <i className="ph ph-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add New Template Card */}
                        <Link 
                            href="/templates/create"
                            className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-5 flex flex-col items-center justify-center min-h-[200px] hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group"
                        >
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors mb-3">
                                <i className="ph-bold ph-plus text-xl text-slate-400 group-hover:text-indigo-600 transition-colors"></i>
                            </div>
                            <p className="text-sm font-[600] text-slate-500 group-hover:text-indigo-600 transition-colors">Create New Template</p>
                        </Link>
                    </div>

                    {/* Tips */}
                    <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                                <i className="ph-fill ph-lightbulb text-indigo-600"></i>
                            </div>
                            <div>
                                <h3 className="text-sm font-[600] text-indigo-900 mb-1">Templates save you time!</h3>
                                <p className="text-xs text-indigo-700">
                                    Create templates with your common line items and terms. When creating a new quote or invoice, 
                                    simply select a template to pre-fill all the details.
                                </p>
                            </div>
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
