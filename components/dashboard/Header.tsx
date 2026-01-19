"use client";

import { useState } from 'react';
import Link from 'next/link';

interface HeaderProps {
    title: string;
    subtitle?: string;
    focusItems?: string[];
    showNewButton?: boolean;
    newButtonText?: string;
    newButtonHref?: string;
}

interface Notification {
    id: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    title: string;
    description: string;
    time: string;
}

export default function Header({ 
    title, 
    subtitle,
    focusItems = [],
    showNewButton = true,
    newButtonText = 'New Opportunity',
    newButtonHref = '/opportunities/create'
}: HeaderProps) {
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    // Mock notifications - replace with real data
    const notifications: Notification[] = [
        {
            id: '1',
            icon: 'ph-fill ph-check',
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
            title: 'Invoice #2024-004 Paid',
            description: 'Studio Design paid $1,200',
            time: '2 mins ago'
        },
        {
            id: '2',
            icon: 'ph-fill ph-eye',
            iconBg: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
            title: 'Quote Viewed',
            description: 'PT Maju Jaya viewed Proposal v2',
            time: '1 hour ago'
        },
        {
            id: '3',
            icon: 'ph-fill ph-clock',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            title: 'Follow-up Reminder',
            description: 'Don\'t forget to email Sarah',
            time: '3 hours ago'
        }
    ];

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    return (
        <header className="py-4 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
            <div>
                <h1 className="text-xl font-[600] text-slate-900 tracking-tight leading-none">{title}</h1>
                {/* Daily Focus Section */}
                <div className="flex items-center gap-3 mt-2">
                    <p className="text-xs font-[450] text-slate-500">{subtitle || today}</p>
                    {focusItems.length > 0 && (
                        <>
                            <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                            <div className="flex items-center gap-1.5 text-xs font-[500] text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100/50 shadow-sm shadow-indigo-100/50 cursor-pointer hover:bg-indigo-100 transition-colors group">
                                <i className="ph-fill ph-target text-indigo-500 group-hover:scale-110 transition-transform"></i>
                                <span>Today&apos;s Focus: {focusItems.join(' · ')}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                    <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="pl-9 pr-4 py-2 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm font-[450] text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    />
                </div>
                
                {/* Quick Actions */}
                <div className="h-8 w-px bg-slate-200 mx-2"></div>
                
                {/* Notifications with Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all relative"
                    >
                        <i className="ph ph-bell text-xl"></i>
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                    </button>

                    {/* Notification Dropdown */}
                    {isNotifOpen && (
                        <div className="absolute top-12 right-0 w-80 bg-white border border-slate-200 rounded-xl shadow-dropdown z-50 overflow-hidden animate-fade-in-up origin-top-right">
                            <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-sm font-[600] text-slate-900">Notifications</h3>
                                <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Mark all read</button>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.map((notif) => (
                                    <div 
                                        key={notif.id}
                                        className="px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 cursor-pointer flex gap-3"
                                    >
                                        <div className={`w-8 h-8 rounded-full ${notif.iconBg} flex items-center justify-center shrink-0 ${notif.iconColor}`}>
                                            <i className={notif.icon}></i>
                                        </div>
                                        <div>
                                            <p className="text-sm font-[500] text-slate-900">{notif.title}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{notif.description}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-slate-50 px-4 py-2 text-center border-t border-slate-100">
                                <button className="text-xs font-[500] text-slate-600 hover:text-indigo-600 transition-colors">View all activity</button>
                            </div>
                        </div>
                    )}
                </div>

                {showNewButton && (
                    <Link 
                        href={newButtonHref}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-[550] shadow-subtle flex items-center gap-2 transition-all"
                    >
                        <i className="ph-bold ph-plus"></i>
                        <span>{newButtonText}</span>
                    </Link>
                )}
            </div>
        </header>
    );
}
