"use client";

import { useState, use } from 'react';
import Header from '@/components/dashboard/Header';
import Link from 'next/link';

interface Task {
    id: string;
    title: string;
    priority?: string | null;
    assignee?: string | null;
    assignees?: string[];
    attachments?: number;
    comments?: number;
    label?: string;
    dueDate?: string;
    image?: string;
    done?: boolean;
}

interface Column {
    id: string;
    name: string;
    color: string;
    tasks: Task[];
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function OpportunityDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<{ title: string; status: string } | null>(null);

    // Mock data - will be replaced with real data from Supabase
    const opportunity = {
        id,
        title: 'Acme Redesign Project',
        client: 'Acme Corp',
        value: '$5,500',
        stage: 'negotiation',
        source: 'Direct',
        priority: 'high',
        createdAt: 'Jan 15, 2024',
        team: [
            { name: 'Alex', avatar: 'https://ui-avatars.com/api/?name=Alex&background=0f172a&color=fff' },
            { name: 'Sarah', avatar: 'https://ui-avatars.com/api/?name=Sarah&background=e0e7ff&color=4f46e5' }
        ]
    };

    const columns: Column[] = [
        {
            id: 'todo',
            name: 'To Do',
            color: 'bg-slate-400',
            tasks: [
                { id: '1', title: 'Setup Project Repo & Environment', priority: 'high', assignee: 'Alex', attachments: 1, comments: 2 },
                { id: '2', title: 'Gather Client Assets (Logos, Fonts)', priority: null, assignee: null },
                { id: '3', title: 'Competitor Analysis', priority: null, assignee: 'Sarah', label: 'Research', dueDate: 'Oct 20' }
            ]
        },
        {
            id: 'progress',
            name: 'In Progress',
            color: 'bg-indigo-500',
            tasks: [
                { id: '4', title: 'Homepage Wireframes', priority: null, assignee: 'Sarah', dueDate: 'Today', image: 'https://placehold.co/300x150/f1f5f9/94a3b8?text=Wireframe' },
                { id: '5', title: 'Drafting Copy for Services Page', priority: null, assignee: 'Alex' }
            ]
        },
        {
            id: 'review',
            name: 'Review',
            color: 'bg-amber-400',
            tasks: [
                { id: '6', title: 'Review Sitemap Structure', priority: null, label: 'Client Feedback', assignees: ['Alex', 'Sarah'], comments: 5 }
            ]
        },
        {
            id: 'done',
            name: 'Done',
            color: 'bg-emerald-500',
            tasks: [
                { id: '7', title: 'Project Kickoff Meeting', done: true },
                { id: '8', title: 'Sign Contract & Invoice #1', done: true },
                { id: '9', title: 'Initial Client Briefing', done: true }
            ]
        }
    ];

    const openTaskDetail = (task: { title: string }, status: string) => {
        setSelectedTask({ title: task.title, status });
        setIsDetailModalOpen(true);
    };

    return (
        <>
            <Header 
                title={opportunity.title}
                subtitle={`${opportunity.client} • ${opportunity.value}`}
                showNewButton={false}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Board Header */}
                <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-white/50">
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/opportunities"
                            className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <i className="ph-bold ph-arrow-left text-lg"></i>
                        </Link>
                        <div className="h-6 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-2 text-xs font-[500] text-slate-500">
                            <span>Opportunities</span>
                            <i className="ph-bold ph-caret-right text-[10px] text-slate-300"></i>
                            <span className="text-slate-800">{opportunity.title}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Team Members */}
                        <div className="flex -space-x-2 mr-2">
                            {opportunity.team.map((member, idx) => (
                                <img 
                                    key={idx}
                                    src={member.avatar} 
                                    alt={member.name}
                                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm" 
                                    title={member.name}
                                />
                            ))}
                            <button className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs text-slate-500 hover:bg-slate-200 font-bold transition-colors">
                                <i className="ph-bold ph-plus"></i>
                            </button>
                        </div>
                        
                        <div className="h-8 w-px bg-slate-200 mx-1"></div>

                        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                            <button className="p-1.5 bg-white text-slate-900 rounded shadow-sm"><i className="ph-bold ph-kanban"></i></button>
                            <button className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white/50 rounded transition-colors"><i className="ph-bold ph-list-dashes"></i></button>
                        </div>
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                    <div className="flex gap-6 h-full min-w-max pb-4">
                        {columns.map((column) => (
                            <div key={column.id} className="w-72 flex flex-col gap-3 h-full">
                                {/* Column Header */}
                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${column.color}`}></span>
                                        <h3 className="text-xs font-[600] text-slate-500 uppercase tracking-wide">{column.name}</h3>
                                        <span className="px-1.5 py-0.5 rounded bg-slate-200/50 text-slate-500 text-[10px] font-bold">
                                            {column.tasks.length}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => setIsTaskModalOpen(true)}
                                        className="text-slate-400 hover:text-indigo-600"
                                    >
                                        <i className="ph-bold ph-plus"></i>
                                    </button>
                                </div>

                                {/* Tasks */}
                                <div className={`flex-1 overflow-y-auto space-y-3 pr-2 ${column.id === 'done' ? 'opacity-60 hover:opacity-100 transition-opacity' : ''}`}>
                                    {column.tasks.map((task) => (
                                        <div 
                                            key={task.id}
                                            onClick={() => openTaskDetail(task, column.name)}
                                            className={`bg-white p-3 rounded-xl border shadow-card hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group ${
                                                column.id === 'progress' ? 'border-indigo-200 ring-2 ring-indigo-50' : 'border-slate-200'
                                            } ${task.done ? 'bg-slate-50' : ''}`}
                                        >
                                            {/* Image */}
                                            {task.image && (
                                                <div className="w-full h-24 bg-slate-100 rounded-lg mb-3 overflow-hidden">
                                                    <img src={task.image} alt="" className="w-full h-full object-cover opacity-80" />
                                                </div>
                                            )}

                                            {/* Priority/Label Badge */}
                                            {(task.priority === 'high' || task.label) && (
                                                <div className="flex justify-between items-start mb-2">
                                                    {task.priority === 'high' && (
                                                        <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-700 text-[10px] font-bold border border-orange-100">High Priority</span>
                                                    )}
                                                    {task.label && (
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                                            task.label === 'Client Feedback' 
                                                                ? 'bg-amber-50 text-amber-700 border-amber-100' 
                                                                : 'bg-slate-100 text-slate-600 border-slate-200'
                                                        }`}>{task.label}</span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Title */}
                                            <h4 className={`text-sm font-[600] text-slate-900 leading-snug ${task.done ? 'line-through decoration-slate-400' : 'mb-3'}`}>
                                                {task.title}
                                            </h4>

                                            {/* Footer */}
                                            {!task.done && (
                                                <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                                                    {/* Assignees */}
                                                    <div className="flex -space-x-1">
                                                        {task.assignees ? (
                                                            task.assignees.map((name, idx) => (
                                                                <img 
                                                                    key={idx}
                                                                    src={`https://ui-avatars.com/api/?name=${name}&background=${name === 'Alex' ? '0f172a' : 'e0e7ff'}&color=${name === 'Alex' ? 'fff' : '4f46e5'}`} 
                                                                    className="w-5 h-5 rounded-full border border-white" 
                                                                />
                                                            ))
                                                        ) : task.assignee ? (
                                                            <img 
                                                                src={`https://ui-avatars.com/api/?name=${task.assignee}&background=${task.assignee === 'Alex' ? '0f172a' : 'e0e7ff'}&color=${task.assignee === 'Alex' ? 'fff' : '4f46e5'}`} 
                                                                className="w-5 h-5 rounded-full" 
                                                            />
                                                        ) : (
                                                            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
                                                                <i className="ph-bold ph-user"></i>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Meta */}
                                                    <div className="flex gap-2 text-slate-400 text-xs">
                                                        {task.attachments && (
                                                            <span className="flex items-center gap-1"><i className="ph-bold ph-paperclip"></i> {task.attachments}</span>
                                                        )}
                                                        {task.comments && (
                                                            <span className="flex items-center gap-1"><i className="ph-bold ph-chat-circle"></i> {task.comments}</span>
                                                        )}
                                                        {task.dueDate && (
                                                            <span className={`flex items-center gap-1 ${task.dueDate === 'Today' ? 'text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold' : ''}`}>
                                                                <i className="ph-bold ph-calendar"></i> {task.dueDate}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {task.done && (
                                                <i className="ph-bold ph-check text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2"></i>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add Task Modal */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 z-50">
                    <div 
                        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
                        onClick={() => setIsTaskModalOpen(false)}
                    ></div>
                    <div className="absolute top-1/2 left-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl transform -translate-x-1/2 -translate-y-1/2 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-base font-[600] text-slate-900">New Task</h3>
                            <button onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <i className="ph-bold ph-x"></i>
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-[500] text-slate-700">Task Title</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                                    placeholder="e.g. Design Homepage"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-[500] text-slate-700">Priority</label>
                                    <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                                        <option value="Normal">Normal</option>
                                        <option value="High">High</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-[500] text-slate-700">Assignee</label>
                                    <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                                        <option value="alex">Alex</option>
                                        <option value="sarah">Sarah</option>
                                        <option value="unassigned">Unassigned</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                            <button onClick={() => setIsTaskModalOpen(false)} className="px-3 py-1.5 text-xs font-[600] text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                            <button className="px-3 py-1.5 text-xs font-[600] text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">Add Task</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Task Detail Modal */}
            {isDetailModalOpen && selectedTask && (
                <div className="fixed inset-0 z-50">
                    <div 
                        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
                        onClick={() => setIsDetailModalOpen(false)}
                    ></div>
                    <div className="absolute top-1/2 left-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-xl transform -translate-x-1/2 -translate-y-1/2 overflow-hidden flex flex-col max-h-[85vh]">
                        {/* Header */}
                        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-start bg-white">
                            <div className="flex-1 pr-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200 uppercase tracking-wide">{selectedTask.status}</span>
                                    <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-700 text-[10px] font-bold border border-orange-100 uppercase tracking-wide">High Priority</span>
                                </div>
                                <h2 className="text-xl font-[700] text-slate-900 leading-snug">{selectedTask.title}</h2>
                            </div>
                            <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50">
                                <i className="ph-bold ph-x text-lg"></i>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-8 flex flex-col md:flex-row gap-8">
                            {/* Left: Description & Activity */}
                            <div className="flex-1 space-y-6">
                                <div>
                                    <h4 className="text-sm font-[600] text-slate-900 mb-2 flex items-center gap-2"><i className="ph-bold ph-text-align-left"></i> Description</h4>
                                    <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        Initialize the git repository, set up the Next.js environment with Tailwind CSS, and configure the CI/CD pipeline for deployment.
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="text-sm font-[600] text-slate-900 mb-3 flex items-center gap-2"><i className="ph-bold ph-list-checks"></i> Subtasks</h4>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                                            <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                                            <span className="text-sm text-slate-600 line-through decoration-slate-400">Create GitHub Repo</span>
                                        </label>
                                        <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                                            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                                            <span className="text-sm text-slate-600">Install Dependencies</span>
                                        </label>
                                    </div>
                                    <button className="mt-2 text-xs font-[600] text-slate-500 hover:text-indigo-600 flex items-center gap-1 py-1 px-2 hover:bg-slate-100 rounded-lg transition-colors">
                                        <i className="ph-bold ph-plus"></i> Add subtask
                                    </button>
                                </div>

                                <div>
                                    <h4 className="text-sm font-[600] text-slate-900 mb-3 flex items-center gap-2"><i className="ph-bold ph-chat-circle"></i> Activity</h4>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">YOU</div>
                                        <div className="flex-1">
                                            <input type="text" placeholder="Write a comment..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Meta */}
                            <div className="w-full md:w-48 space-y-6 flex-shrink-0">
                                <div className="space-y-1">
                                    <label className="text-xs font-[600] text-slate-500 uppercase tracking-wide">Assignee</label>
                                    <div className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                                        <img src="https://ui-avatars.com/api/?name=Alex&background=0f172a&color=fff" className="w-6 h-6 rounded-full border border-slate-200" />
                                        <span className="text-sm font-[500] text-slate-700">Alex</span>
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="text-xs font-[600] text-slate-500 uppercase tracking-wide">Due Date</label>
                                    <div className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer text-slate-700">
                                        <i className="ph-bold ph-calendar-blank"></i>
                                        <span className="text-sm">Oct 24, 2026</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-[600] text-slate-500 uppercase tracking-wide">Labels</label>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">Dev</span>
                                        <button className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"><i className="ph-bold ph-plus"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
