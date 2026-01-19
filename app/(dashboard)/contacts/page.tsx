import Header from '@/components/dashboard/Header';
import Link from 'next/link';

export default function ContactsPage() {
    // Mock data - will be replaced with real data from Supabase
    const contacts = [
        {
            id: '1',
            name: 'John Smith',
            email: 'john@acmecorp.com',
            phone: '+1 555-0123',
            company: 'Acme Corp',
            type: 'client',
            totalValue: '$12,500',
            projects: 4,
            avgTimeToPay: 7,
            lastContact: '2 days ago'
        },
        {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah@startup.io',
            phone: '+1 555-0456',
            company: 'Startup.io',
            type: 'lead',
            totalValue: '$0',
            projects: 0,
            avgTimeToPay: null,
            lastContact: '1 week ago'
        },
        {
            id: '3',
            name: 'Michael Chen',
            email: 'michael@techsolutions.com',
            phone: '+1 555-0789',
            company: 'Tech Solutions',
            type: 'client',
            totalValue: '$8,200',
            projects: 3,
            avgTimeToPay: 12,
            lastContact: '3 days ago'
        },
        {
            id: '4',
            name: 'Emily Davis',
            email: 'emily@studiodesign.com',
            phone: '+1 555-0321',
            company: 'Studio Design',
            type: 'client',
            totalValue: '$5,400',
            projects: 2,
            avgTimeToPay: 5,
            lastContact: 'Yesterday'
        }
    ];

    const stats = {
        totalContacts: contacts.length,
        clients: contacts.filter(c => c.type === 'client').length,
        leads: contacts.filter(c => c.type === 'lead').length
    };

    return (
        <>
            <Header 
                title="Contacts"
                subtitle={`${stats.totalContacts} contacts • ${stats.clients} clients • ${stats.leads} leads`}
                newButtonText="Add Contact"
                newButtonHref="/contacts/create"
            />

            <div className="flex-1 overflow-y-auto p-8">
                <div className="w-full">
                    
                    {/* Filters */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                <input 
                                    type="text" 
                                    placeholder="Search contacts..." 
                                    className="pl-9 pr-4 py-2 w-64 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-[500] text-slate-600">
                                <option value="all">All Types</option>
                                <option value="client">Clients</option>
                                <option value="lead">Leads</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                <i className="ph ph-funnel text-lg"></i>
                            </button>
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                <i className="ph ph-download-simple text-lg"></i>
                            </button>
                        </div>
                    </div>

                    {/* Contacts Table */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Total Value</th>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Avg. Time to Pay</th>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Last Contact</th>
                                    <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {contacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-[600]">
                                                    {contact.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-[600] text-slate-900 group-hover:text-indigo-600 transition-colors">{contact.name}</p>
                                                    <p className="text-xs text-slate-500">{contact.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{contact.company}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-[500] ${
                                                contact.type === 'client' 
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                            }`}>
                                                {contact.type === 'client' ? 'Client' : 'Lead'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-[600] text-slate-900">{contact.totalValue}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {contact.avgTimeToPay ? `${contact.avgTimeToPay} days` : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{contact.lastContact}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link 
                                                    href={`/contacts/${contact.id}`}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                                >
                                                    <i className="ph ph-eye"></i>
                                                </Link>
                                                <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                                                    <i className="ph ph-pencil-simple"></i>
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

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-slate-500">Showing 1-{contacts.length} of {contacts.length} contacts</p>
                        <div className="flex items-center gap-1">
                            <button className="px-3 py-1.5 text-sm font-[500] text-slate-400 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                                Previous
                            </button>
                            <button className="px-3 py-1.5 text-sm font-[600] text-white bg-indigo-600 border border-indigo-600 rounded-lg">
                                1
                            </button>
                            <button className="px-3 py-1.5 text-sm font-[500] text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                                Next
                            </button>
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
