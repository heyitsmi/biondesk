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

export default function Header({ 
    title, 
    subtitle,
    focusItems = [],
    showNewButton = true,
    newButtonText = 'New Opportunity',
    newButtonHref = '/opportunities/create'
}: HeaderProps) {
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    return (
        <header className="py-4 px-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
            <div>
                <h1 className="text-xl font-[600] text-slate-900 tracking-tight leading-none">{title}</h1>
                {/* Daily Focus Section */}
                <div className="flex flex-wrap items-center gap-3 mt-2">
                    <p className="text-xs font-[450] text-slate-500">{subtitle || today}</p>
                    {focusItems.length > 0 && (
                        <>
                            <div className="hidden sm:block h-1 w-1 rounded-full bg-slate-300"></div>
                            <div className="flex items-center gap-1.5 text-xs font-[500] text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100/50 shadow-sm shadow-indigo-100/50 cursor-pointer hover:bg-indigo-100 transition-colors group max-w-full truncate">
                                <i className="ph-fill ph-target text-indigo-500 group-hover:scale-110 transition-transform shrink-0"></i>
                                <span className="truncate">Today&apos;s Focus: {focusItems.join(' · ')}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4 self-start md:self-auto">
                {showNewButton && (
                    <Link 
                        href={newButtonHref}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-[550] shadow-subtle flex items-center gap-2 transition-all whitespace-nowrap"
                    >
                        <i className="ph-bold ph-plus"></i>
                        <span>{newButtonText}</span>
                    </Link>
                )}
            </div>
        </header>
    );
}
