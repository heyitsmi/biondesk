import Header from '@/components/dashboard/Header';
import Link from 'next/link';

export default function RemindersPage() {
    // Mock data - will be replaced with real data from Supabase
    const upcomingReminders = [
        {
            id: '1',
            type: 'Pre-Due',
            typeColor: 'bg-amber-50 text-amber-700 border-amber-100',
            document: 'Invoice #INV-2024-005',
            client: 'Acme Corp',
            scheduledFor: 'Tomorrow, 9:00 AM',
            daysOffset: -3,
            status: 'Scheduled'
        },
        {
            id: '2',
            type: 'Follow-up',
            typeColor: 'bg-indigo-50 text-indigo-700 border-indigo-100',
            document: 'Quote #Q-2024-003',
            client: 'Startup.io',
            scheduledFor: 'Jan 22, 10:00 AM',
            daysOffset: 3,
            status: 'Scheduled'
        }
    ];

    const sentReminders = [
        {
            id: '1',
            type: 'Overdue',
            typeColor: 'bg-rose-50 text-rose-700 border-rose-100',
            document: 'Invoice #INV-2024-004',
            client: 'Studio Design',
            sentAt: 'Today, 8:30 AM',
            opened: true
        },
        {
            id: '2',
            type: 'Pre-Due',
            typeColor: 'bg-amber-50 text-amber-700 border-amber-100',
            document: 'Invoice #INV-2024-003',
            client: 'Tech Solutions',
            sentAt: 'Yesterday, 9:00 AM',
            opened: false
        }
    ];

    const reminderRules = [
        {
            id: '1',
            type: 'Pre-Due Reminder',
            icon: 'ph-clock-countdown',
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-600',
            description: '3 days before invoice due date',
            isActive: true
        },
        {
            id: '2',
            type: 'Overdue Reminder',
            icon: 'ph-warning',
            iconBg: 'bg-rose-50',
            iconColor: 'text-rose-600',
            description: '1 day after invoice due date',
            isActive: true
        },
        {
            id: '3',
            type: 'Quote Follow-up',
            icon: 'ph-paper-plane-tilt',
            iconBg: 'bg-indigo-50',
            iconColor: 'text-indigo-600',
            description: '3 days after quote sent (if not accepted)',
            isActive: true
        }
    ];

    return (
        <>
            <Header 
                title="Reminders"
                subtitle="Manage your automated follow-ups"
                showNewButton={false}
            />

            <div className="flex-1 overflow-y-auto p-8">
                <div className="w-full space-y-8">
                    
                    {/* Reminder Rules */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-[600] text-slate-900">Automation Rules</h2>
                            <button className="text-sm font-[550] text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                                <i className="ph-bold ph-plus"></i>
                                Add Rule
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {reminderRules.map((rule) => (
                                <div key={rule.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`w-10 h-10 ${rule.iconBg} rounded-lg flex items-center justify-center ${rule.iconColor}`}>
                                            <i className={`ph ${rule.icon} text-xl`}></i>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked={rule.isActive} className="sr-only peer" />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                    <h3 className="text-sm font-[600] text-slate-900 mb-1">{rule.type}</h3>
                                    <p className="text-xs text-slate-500">{rule.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Reminders */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-[600] text-slate-900">Upcoming Reminders</h2>
                        </div>
                        
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Document</th>
                                        <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Client</th>
                                        <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Scheduled For</th>
                                        <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {upcomingReminders.map((reminder) => (
                                        <tr key={reminder.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-[500] border ${reminder.typeColor}`}>
                                                    {reminder.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-[500] text-slate-900">{reminder.document}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{reminder.client}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{reminder.scheduledFor}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="text-xs text-slate-500 hover:text-indigo-600 font-[500]">Preview</button>
                                                    <button className="text-xs text-slate-500 hover:text-rose-600 font-[500]">Cancel</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Sent Reminders */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-[600] text-slate-900">Recently Sent</h2>
                            <Link href="#" className="text-sm font-[550] text-indigo-600 hover:text-indigo-700">View all</Link>
                        </div>
                        
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Document</th>
                                        <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Client</th>
                                        <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">Sent At</th>
                                        <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider text-right">Opened</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {sentReminders.map((reminder) => (
                                        <tr key={reminder.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-[500] border ${reminder.typeColor}`}>
                                                    {reminder.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-[500] text-slate-900">{reminder.document}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{reminder.client}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{reminder.sentAt}</td>
                                            <td className="px-6 py-4 text-right">
                                                {reminder.opened ? (
                                                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                                                        <i className="ph-fill ph-check-circle"></i> Yes
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-400">No</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
