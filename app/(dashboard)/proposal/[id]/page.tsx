import Header from '@/components/dashboard/Header';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProposalDetailPage({ params }: PageProps) {
    const { id } = await params;

    // Mock data - will be replaced with real data from Supabase
    const proposal = {
        id,
        number: 'P-2024-001',
        title: 'Website Redesign Proposal',
        client: {
            name: 'Acme Corp',
            email: 'john@acmecorp.com',
            company: 'Acme Corporation'
        },
        opportunity: 'Website Redesign Project',
        status: 'sent',
        createdAt: 'Jan 15, 2024',
        sentAt: 'Jan 16, 2024',
        viewCount: 3,
        content: `Hi John,

Thank you for considering me for your website redesign project. I'm excited about the opportunity to help Acme Corp create a stunning new online presence.

**Understanding Your Needs**

Based on our initial conversation, I understand you're looking for:
- A modern, professional website that reflects your brand
- Improved user experience and navigation
- Mobile-responsive design
- Integration with your existing CRM system

**My Approach**

I propose a 4-week project timeline broken into three phases:

**Phase 1: Discovery & Strategy (Week 1)**
- Brand audit and competitor analysis
- User persona development
- Sitemap and wireframes

**Phase 2: Design & Development (Week 2-3)**
- High-fidelity mockups
- Responsive development
- CRM integration

**Phase 3: Launch & Support (Week 4)**
- Testing and optimization
- Launch support
- Training session

**Investment**

Based on the scope outlined above, the total investment for this project is $5,500.

Payment terms: 50% upfront, 50% upon completion.

I'd love to discuss this proposal in more detail. Are you available for a call this week?

Best regards,
[Your Name]`
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

    const statusBadge = getStatusBadge(proposal.status);

    return (
        <>
            <Header 
                title={proposal.number}
                subtitle={proposal.title}
                showNewButton={false}
            />

            <div className="flex-1 overflow-y-auto p-8">
                <div className="w-full max-w-4xl">
                    
                    {/* Back Link */}
                    <Link 
                        href="/opportunities" 
                        className="inline-flex items-center gap-1.5 text-sm font-[500] text-slate-500 hover:text-slate-700 mb-6"
                    >
                        <i className="ph ph-arrow-left"></i>
                        Back to Pipeline
                    </Link>

                    {/* Header Card */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-xl font-[600] text-slate-900">{proposal.title}</h1>
                                        <span className={`px-2 py-1 rounded text-xs font-[500] ${statusBadge.bg} ${statusBadge.text}`}>
                                            {statusBadge.label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        For: <span className="font-[500] text-slate-700">{proposal.client.name}</span> • {proposal.client.company}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-[600] rounded-lg hover:border-slate-300 transition-all flex items-center gap-1.5">
                                        <i className="ph ph-pencil-simple"></i>
                                        Edit
                                    </button>
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
                                    Created {proposal.createdAt}
                                </div>
                                {proposal.sentAt && (
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <i className="ph ph-paper-plane-tilt"></i>
                                        Sent {proposal.sentAt}
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <i className="ph ph-eye"></i>
                                    {proposal.viewCount} views
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-lg font-[600] text-slate-900">Proposal Content</h2>
                            <button className="text-sm font-[500] text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                                <i className="ph ph-copy"></i>
                                Copy
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="prose prose-sm max-w-none">
                                <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed">
                                    {proposal.content}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Activity Timeline */}
                    <div className="mt-6 bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h2 className="text-lg font-[600] text-slate-900">Activity</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                                        <i className="ph-fill ph-eye text-indigo-600 text-sm"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-[500] text-slate-900">Client viewed proposal</p>
                                        <p className="text-xs text-slate-400">Today, 2:45 PM</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                                        <i className="ph-fill ph-paper-plane-tilt text-indigo-600 text-sm"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-[500] text-slate-900">Proposal sent via email</p>
                                        <p className="text-xs text-slate-400">{proposal.sentAt}, 10:30 AM</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                                        <i className="ph-fill ph-file-text text-slate-500 text-sm"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-[500] text-slate-900">Proposal created</p>
                                        <p className="text-xs text-slate-400">{proposal.createdAt}, 3:00 PM</p>
                                    </div>
                                </div>
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
