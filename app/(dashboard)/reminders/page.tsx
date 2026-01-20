"use client";

import { useState } from 'react';
import Header from '@/components/dashboard/Header';
import Link from 'next/link';

// Types
interface ReminderRule {
    id: string;
    title: string;
    description: string;
    icon: string;
    iconColor: string;
    isActive: boolean;
}

interface UpcomingReminder {
    id: string;
    scheduledFor: string;
    client: string;
    document: string;
    type: 'Pre-due' | 'Overdue' | 'Follow-up';
    typeStyle: string;
    typeIcon: string;
}

interface SentHistoryItem {
    id: string;
    time: string;
    title: string;
    subtitle: string;
    opened: boolean;
    statusColor: string;
}

export default function RemindersPage() {
    // --- State ---
    const [showManualModal, setShowManualModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reminderToDelete, setReminderToDelete] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

    // Mock Data State
    const [rules, setRules] = useState<ReminderRule[]>([
        {
            id: '1',
            title: 'Approaching Due Date',
            description: 'Send a gentle nudge 3 days before invoice is due.',
            icon: 'ph-clock-afternoon',
            iconColor: 'text-amber-400',
            isActive: true
        },
        {
            id: '2',
            title: 'On Overdue',
            description: 'Send a reminder immediately when invoice is overdue.',
            icon: 'ph-warning-circle',
            iconColor: 'text-rose-400',
            isActive: true
        },
        {
            id: '3',
            title: 'Quote Follow-up',
            description: 'Send check-in email 2 days after quote is viewed but not accepted.',
            icon: 'ph-repeat',
            iconColor: 'text-indigo-400',
            isActive: false
        }
    ]);

    const [upcoming, setUpcoming] = useState<UpcomingReminder[]>([
        {
            id: '1',
            scheduledFor: 'Tomorrow, 9:00 AM',
            client: 'TechStart Inc',
            document: 'INV-2026-003',
            type: 'Pre-due',
            typeStyle: 'bg-amber-50 text-amber-700 border-amber-100',
            typeIcon: 'ph-clock'
        },
        {
            id: '2',
            scheduledFor: 'Jan 18, 9:00 AM',
            client: 'Studio Design',
            document: 'INV-2026-002',
            type: 'Overdue',
            typeStyle: 'bg-rose-50 text-rose-700 border-rose-100',
            typeIcon: 'ph-warning'
        }
    ]);

    const historyItems: SentHistoryItem[] = [
        {
            id: '1',
            time: 'Today, 10:30 AM',
            title: 'Payment Reminder Sent',
            subtitle: 'To: Acme Corp (INV-001)',
            opened: true,
            statusColor: 'bg-emerald-500' // green dot
        },
        {
            id: '2',
            time: 'Yesterday',
            title: 'Quote Follow-up',
            subtitle: 'To: TechStart (Q-003)',
            opened: false,
            statusColor: 'bg-slate-300' // gray dot
        },
        {
            id: '3',
            time: 'Jan 12',
            title: 'Invoice Created',
            subtitle: 'System Auto-notification',
            opened: false, // irrelevant for syst notif
            statusColor: 'bg-slate-300'
        }
    ];

    // --- Actions ---

    const toggleRule = (id: string) => {
        setRules(rules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
        showToast('Rule settings updated');
    };

    const handleDeleteClick = (id: string) => {
        setReminderToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (reminderToDelete) {
            setUpcoming(upcoming.filter(r => r.id !== reminderToDelete));
            showToast('Reminder deleted successfully');
        }
        setShowDeleteModal(false);
        setReminderToDelete(null);
    };

    const handleManualSchedule = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock addition
        const newReminder: UpcomingReminder = {
            id: Date.now().toString(),
            scheduledFor: 'Jan 25, 09:00 AM',
            client: 'Acme Corp',
            document: 'INV-2026-003',
            type: 'Follow-up',
            typeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-100',
            typeIcon: 'ph-paper-plane-tilt'
        };
        setUpcoming([...upcoming, newReminder]);
        setShowManualModal(false);
        showToast('Reminder scheduled successfully');
    };

    const showToast = (msg: string) => {
        setToast({ message: msg, visible: true });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    };

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50/50">
            {/* Header */}
            <header className="h-16 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 shrink-0">
                <h1 className="text-xl font-[600] text-slate-900 tracking-tight">Reminders</h1>
                <button 
                    onClick={() => setShowManualModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-[550] shadow-subtle flex items-center gap-2 transition-all"
                >
                    <i className="ph-bold ph-plus"></i>
                    <span>Manual Reminder</span>
                </button>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 scroller-thin">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN (2/3): Configuration & Upcoming */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* 1. Auto-Reminder Rules */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <i className="ph-bold ph-robot text-xl"></i>
                                </div>
                                <div>
                                    <h3 className="text-base font-[600] text-slate-900">Auto-Reminder Rules</h3>
                                    <p className="text-xs text-slate-500">Dealis will send emails automatically based on these rules.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {rules.map((rule) => (
                                    <div key={rule.id} className={`flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors ${!rule.isActive ? 'opacity-75' : ''}`}>
                                        <div className="flex items-start gap-3">
                                            <i className={`ph-fill ${rule.icon} ${rule.iconColor} text-lg mt-0.5`}></i>
                                            <div>
                                                <p className="text-sm font-[600] text-slate-800">{rule.title}</p>
                                                <p className="text-xs text-slate-500">{rule.description}</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={rule.isActive} 
                                                onChange={() => toggleRule(rule.id)}
                                                className="sr-only peer" 
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Upcoming Reminders */}
                        <div>
                            <h3 className="text-sm font-[600] text-slate-900 mb-4">Upcoming Schedule</h3>
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-[600] text-slate-500 uppercase">
                                        <tr>
                                            <th className="px-6 py-3">Scheduled For</th>
                                            <th className="px-6 py-3">Recipient / Document</th>
                                            <th className="px-6 py-3">Type</th>
                                            <th className="px-6 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {upcoming.length > 0 ? (
                                            upcoming.map((item) => (
                                                <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 text-slate-600">
                                                        {item.scheduledFor}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="font-[600] text-slate-900">{item.client}</p>
                                                        <p className="text-xs text-slate-500">{item.document}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded bg-amber-50 text-xs border ${item.typeStyle}`}>
                                                            <i className={`ph-fill ${item.typeIcon}`}></i> {item.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button 
                                                            onClick={() => handleDeleteClick(item.id)}
                                                            className="text-slate-400 hover:text-rose-600 transition-colors"
                                                        >
                                                            <i className="ph-bold ph-trash text-lg"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                                    No reminders scheduled.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN (1/3): History */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-full">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-[600] text-slate-900">Sent History</h3>
                                <button className="text-xs text-indigo-600 hover:underline">View All</button>
                            </div>
                            
                            <div className="relative pl-4 border-l-2 border-slate-100 space-y-8">
                                {historyItems.map((item) => (
                                    <div key={item.id} className="relative">
                                        <div className={`absolute -left-[21px] w-3 h-3 ${item.statusColor} rounded-full border-2 border-white shadow-sm ${item.statusColor === 'bg-emerald-500' ? 'ring-4 ring-emerald-50' : ''}`}></div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-slate-400">{item.time}</span>
                                            <p className="text-sm font-[600] text-slate-800">{item.title}</p>
                                            <p className="text-xs text-slate-500">{item.subtitle}</p>
                                            {item.opened && (
                                                <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1">
                                                    <i className="ph-bold ph-check-double"></i> Opened
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

             {/* Footer */}
             <div className="py-6 text-center shrink-0">
                <p className="text-xs text-slate-400">© 2026 Flova. Crafted for growth.</p>
            </div>

            {/* MANUAL REMINDER MODAL */}
            {showManualModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm animate-fade-in" onClick={() => setShowManualModal(false)}></div>
                    <div className="w-full max-w-lg bg-white rounded-2xl shadow-modal z-10 animate-scale-in overflow-hidden m-4">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-base font-[600] text-slate-900">Schedule Manual Reminder</h3>
                            <button onClick={() => setShowManualModal(false)} className="text-slate-400 hover:text-slate-600">
                                <i className="ph-bold ph-x text-lg"></i>
                            </button>
                        </div>
                        
                        <form onSubmit={handleManualSchedule}>
                            <div className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-[500] text-slate-700">Document Context</label>
                                    <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-600">
                                        <option>Invoice #INV-2026-003 (TechStart)</option>
                                        <option>Quote #Q-2026-005 (Acme Corp)</option>
                                        <option>Invoice #INV-2026-002 (Studio Design)</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-[500] text-slate-700">Schedule Date</label>
                                        <input type="date" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-600" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-[500] text-slate-700">Time</label>
                                        <input type="time" defaultValue="09:00" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-600" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-[500] text-slate-700">Custom Note (Optional)</label>
                                    <textarea rows={3} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400" placeholder="e.g. Just checking in on the payment status..."></textarea>
                                </div>
                            </div>

                            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                                <button type="button" onClick={() => setShowManualModal(false)} className="px-3 py-1.5 text-xs font-[600] text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="px-3 py-1.5 text-xs font-[600] text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRM MODAL */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                     <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm animate-fade-in" onClick={() => setShowDeleteModal(false)}></div>
                    <div className="w-full max-w-sm bg-white rounded-2xl shadow-modal z-10 animate-scale-in overflow-hidden m-4">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="ph-bold ph-trash text-xl"></i>
                            </div>
                            <h3 className="text-base font-[600] text-slate-900 mb-2">Delete Reminder?</h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-6">Are you sure you want to remove this scheduled reminder? This action cannot be undone.</p>
                            
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 text-xs font-[600] text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors">Cancel</button>
                                <button onClick={confirmDelete} className="flex-1 px-4 py-2 text-xs font-[600] text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST */}
            <div className={`fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium transition-all duration-300 z-50 ${toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <i className="ph-fill ph-check-circle text-emerald-400 text-lg"></i>
                <span>{toast.message}</span>
            </div>

            <style jsx global>{`
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-scale-in {
                    animation: scaleIn 0.2s ease-out forwards;
                }
                .animate-fade-in {
                    animation: fadeIn 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
