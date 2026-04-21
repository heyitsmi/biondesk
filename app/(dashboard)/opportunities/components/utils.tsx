import React from 'react';

export const STAGE_CONFIG = [
    { id: 'inbox', name: 'New Inbox', color: 'bg-slate-400' },
    { id: 'drafting', name: 'Drafting', color: 'bg-indigo-400' },
    { id: 'sent', name: 'Applied / Sent', color: 'bg-amber-400' },
    { id: 'negotiation', name: 'Interview', color: 'bg-purple-500' },
    { id: 'won', name: 'Won', color: 'bg-emerald-500' },
    { id: 'lost', name: 'Lost', color: 'bg-red-500' },
    { id: 'archived', name: 'Archived', color: 'bg-slate-500' }
];

export const formatCurrency = (amount: number | null) => {
    if (!amount) return null;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
};

export const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "Just now";
};

export const getSourceBadge = (source: string | null) => {
    const badges: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
        upwork: { 
            bg: 'bg-emerald-50 border-emerald-100', 
            text: 'text-emerald-700', 
            icon: (
                <svg fill="currentColor" width="14" height="14" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24.75 17.542c-1.469 0-2.849-0.62-4.099-1.635l0.302-1.432 0.010-0.057c0.276-1.521 1.13-4.078 3.786-4.078 1.99 0 3.604 1.615 3.604 3.604 0 1.984-1.615 3.599-3.604 3.599zM24.75 6.693c-3.385 0-6.016 2.198-7.083 5.818-1.625-2.443-2.865-5.38-3.583-7.854h-3.646v9.484c-0.005 1.875-1.521 3.391-3.396 3.396-1.875-0.005-3.391-1.526-3.396-3.396v-9.484h-3.646v9.484c0 3.885 3.161 7.068 7.042 7.068 3.885 0 7.042-3.182 7.042-7.068v-1.589c0.708 1.474 1.578 2.974 2.635 4.297l-2.234 10.495h3.729l1.62-7.615c1.417 0.906 3.047 1.479 4.917 1.479 4 0 7.25-3.271 7.25-7.266 0-4-3.25-7.25-7.25-7.25z"/>
                </svg>
            ), 
            label: 'Upwork' 
        },
        linkedin: { 
            bg: 'bg-sky-50 border-sky-100', 
            text: 'text-sky-700', 
            icon: (
                <svg width="14" height="14" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M12.225 12.225h-1.778V9.44c0-.664-.012-1.519-.925-1.519-.926 0-1.068.724-1.068 1.47v2.834H6.676V6.498h1.707v.783h.024c.348-.594.996-.95 1.684-.925 1.802 0 2.135 1.185 2.135 2.728l-.001 3.14zM4.67 5.715a1.037 1.037 0 01-1.032-1.031c0-.566.466-1.032 1.032-1.032.566 0 1.031.466 1.032 1.032 0 .566-.466 1.032-1.032 1.032zm.889 6.51h-1.78V6.498h1.78v5.727zM13.11 2H2.885A.88.88 0 002 2.866v10.268a.88.88 0 00.885.866h10.226a.882.882 0 00.889-.866V2.865a.88.88 0 00-.889-.864z"/></svg>
            ), 
            label: 'LinkedIn' 
        },
        email: { 
            bg: 'bg-slate-50 border-slate-100', 
            text: 'text-slate-600', 
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                    <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            ), 
            label: 'Email' 
        },
        direct: { 
            bg: 'bg-slate-50 border-slate-100', 
            text: 'text-slate-600', 
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                    <path d="M14 19.2857L15.8 21L20 17M4 21C4 17.134 7.13401 14 11 14C12.4872 14 13.8662 14.4638 15 15.2547M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            ), 
            label: 'Direct' 
        },
        referral: { 
            bg: 'bg-purple-50 border-purple-100', 
            text: 'text-purple-700', 
            icon: <i className="ph-fill ph-users text-sm"></i>, 
            label: 'Referral' 
        },
        fiverr: { 
             bg: 'bg-emerald-50 border-emerald-100', 
            text: 'text-emerald-700',
            icon: (
                 <svg fill="currentColor" width="14" height="14" viewBox="-2 -2 24 24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin">
                    <path d='M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0 2C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10z'/>
                    <path d='M13.427 13.148v-5h-5v-.312c0-.517.42-.938.938-.938h.937V5.023h-.937a2.816 2.816 0 0 0-2.813 2.813v.312h-1.25v1.875h1.25v3.125h-1.25v1.875h4.375v-1.875h-1.25v-3.125h3.143v3.125h-1.268v1.875h4.375v-1.875h-1.25z'/>
                    <circle cx='12.402' cy='5.971' r='1.001'/>
                </svg>
            ),
            label: 'Fiverr'
        },
        freelancer: {
            bg: 'bg-sky-50 border-sky-100', 
            text: 'text-sky-700',
            icon: (
                <svg fill="currentColor" width="14" height="14" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg">
                    <path d="m14.096 3.076 1.634 2.292L24 3.076M5.503 20.924l4.474-4.374-2.692-2.89m6.133-10.584L11.027 5.23l4.022.15M4.124 3.077l.857 1.76 4.734.294m-3.058 7.072 3.497-6.522L0 5.13m7.064 7.485 3.303 3.548 3.643-3.57 1.13-6.652-4.439-.228z"/>
                </svg>
            ),
            label: 'Freelancer'
        },
        other: { 
            bg: 'bg-slate-50 border-slate-100', 
            text: 'text-slate-500', 
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                    <path d="M8 10.5H16" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M8 14H13.5" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            ), 
            label: 'Other' 
        }
    };
    return badges[source || 'other'] || badges.other;
};
