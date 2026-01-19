'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { opportunitiesApi } from '@/lib/api';
import { Opportunity, OpportunitySource, Priority } from '@/lib/types';

export default function CreateOpportunityPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState<{
        title: string;
        source: OpportunitySource;
        client_name: string;
        job_link: string;
        value: string; // string for input
        budget_type: 'fixed' | 'hourly' | 'tbd';
        priority: Priority;
        description: string;
        notes: string;
    }>({
        title: '',
        source: 'direct',
        client_name: '',
        job_link: '',
        value: '',
        budget_type: 'fixed',
        priority: 'medium',
        description: '',
        notes: ''
    });

    const handlePasteFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (!text) return;
            
            // Set description immediately
            setFormData(prev => ({ ...prev, description: text }));
            
            // Call AI extraction
            setIsAiLoading(true);
            const response = await fetch('/api/ai/extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: text })
            });
            
            if (response.ok) {
                const data = await response.json();
                setFormData(prev => ({
                    ...prev,
                    description: text, // ensure description is kept
                    title: data.title || prev.title,
                    client_name: data.client_name || prev.client_name,
                    value: data.budget ? String(data.budget).replace(/[^0-9.]/g, '') : prev.value,
                    budget_type: (['fixed', 'hourly', 'tbd'].includes(data.budget_type) ? data.budget_type : 'fixed') as any,
                    priority: (['low', 'medium', 'high'].includes(data.priority) ? data.priority : 'medium') as any,
                    source: (['upwork', 'linkedin', 'email', 'direct', 'other'].includes(data.source) ? data.source : 'other') as any,
                }));
            }
        } catch (error) {
            console.error('Failed to paste or extract:', error);
            // Fallback: just pasting text is already done if readText worked
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await opportunitiesApi.create({
                title: formData.title,
                source: formData.source,
                client_name: formData.client_name || null,
                job_link: formData.job_link || null,
                value: formData.value ? parseFloat(formData.value) : null,
                budget_type: formData.budget_type,
                priority: formData.priority,
                description: formData.description || null,
                notes: formData.notes || null,
                stage: 'inbox', // Default stage
                workspace_id: 'default' // This will be ignored/overridden by API implementation usually, or I need to handle it. api creates with fetched workspace or session.
                // Actually `opportunitiesApi.create` in DB helper takes workspaceId. The client api calls the route. 
                // The route `app/api/opportunities/route.ts` usually gets workspace from session.
            });
            
            router.push('/opportunities');
        } catch (error) {
            console.error('Error creating opportunity:', error);
            alert('Failed to create opportunity. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50/50 transition-all duration-300 ease-in-out">
            
            {/* Header */}
            <header className="h-16 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <i className="ph-bold ph-arrow-left text-lg"></i>
                    </button>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <div>
                        <div className="flex items-center gap-2 text-xs font-[500] text-slate-500 mb-0.5">
                            <span>Opportunities</span>
                            <i className="ph-bold ph-caret-right text-[10px] text-slate-300"></i>
                            <span className="text-slate-800">New</span>
                        </div>
                        <h1 className="text-lg font-[600] text-slate-900 tracking-tight leading-none">New Opportunity</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/opportunities" className="px-4 py-2 text-sm font-[550] text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all">
                        Cancel
                    </Link>
                    <button onClick={handleSubmit} disabled={isLoading || !formData.title} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-[550] shadow-sm flex items-center gap-2 transition-all">
                        <i className="ph-bold ph-check"></i>
                        <span>{isLoading ? 'Saving...' : 'Save Draft'}</span>
                    </button>
                </div>
            </header>

            {/* Form Container */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-4xl mx-auto">
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Section 1: Basic Info */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                {/* Title */}
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-sm font-[600] text-slate-700">Project Title <span className="text-rose-500">*</span></label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Redesign Landing Page for SaaS" 
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-[450] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        required
                                    />
                                </div>

                                {/* Source / Platform */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-[600] text-slate-700">Source</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-[450] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                                            value={formData.source}
                                            onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value as OpportunitySource }))}
                                        >
                                            <option value="upwork">Upwork</option>
                                            <option value="linkedin">LinkedIn</option>
                                            <option value="email">Email Inquiry</option>
                                            <option value="direct">Direct Client</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <i className="ph-bold ph-caret-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                                    </div>
                                </div>

                                {/* Client Name */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-[600] text-slate-700">Client Name <span className="text-slate-400 font-normal">(Optional)</span></label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Acme Inc." 
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-[450] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                        value={formData.client_name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                                    />
                                </div>

                                {/* Link */}
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-sm font-[600] text-slate-700">Job Link / URL</label>
                                    <div className="relative">
                                        <i className="ph ph-link absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
                                        <input 
                                            type="url" 
                                            placeholder="https://..." 
                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-[450] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                            value={formData.job_link}
                                            onChange={(e) => setFormData(prev => ({ ...prev, job_link: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Details & Tags */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                
                                {/* Budget */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-[600] text-slate-700">Budget Estimate</label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                                        <input 
                                            type="number" 
                                            placeholder="0.00" 
                                            className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-[450] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                            value={formData.value}
                                            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                                            step="0.01"
                                        />
                                    </div>
                                </div>

                                {/* Type */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-[600] text-slate-700">Type</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-[450] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                                            value={formData.budget_type}
                                            onChange={(e) => setFormData(prev => ({ ...prev, budget_type: e.target.value as any }))}
                                        >
                                            <option value="fixed">Fixed Price</option>
                                            <option value="hourly">Hourly Rate</option>
                                            <option value="tbd">TBD</option>
                                        </select>
                                        <i className="ph-bold ph-caret-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                                    </div>
                                </div>

                                {/* Urgency */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-[600] text-slate-700">Priority / Urgency</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-[450] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                                            value={formData.priority}
                                            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Priority }))}
                                        >
                                            <option value="medium">Normal</option>
                                            <option value="high">High Priority</option>
                                            <option value="low">Low Priority</option>
                                        </select>
                                        <i className="ph-bold ph-caret-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Job Description (AI) */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-[600] text-slate-700">Job Description / Brief</label>
                                <button 
                                    type="button" 
                                    onClick={handlePasteFromClipboard}
                                    className="text-xs font-[600] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors"
                                >
                                    <i className="ph-bold ph-clipboard-text"></i> 
                                    {isAiLoading ? 'Extracting...' : 'Paste from Clipboard'}
                                </button>
                            </div>
                            <div className="relative">
                                <textarea 
                                    rows={10} 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-[450] text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-y" 
                                    placeholder="Paste the entire job post here. This will be used by AI to generate your proposal..."
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                ></textarea>
                                {isAiLoading && (
                                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
                                        <div className="flex flex-col items-center gap-2">
                                            <i className="ph-bold ph-spinner animate-spin text-2xl text-indigo-600"></i>
                                            <span className="text-xs font-medium text-indigo-600">Analyzing job post...</span>
                                        </div>
                                    </div>
                                )}
                                {!isAiLoading && formData.description && (
                                    <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 font-medium bg-white/80 px-2 py-1 rounded backdrop-blur-sm border border-slate-100">
                                        AI Ready
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-slate-500">
                                <i className="ph-fill ph-info text-indigo-500 mr-1"></i>
                                Paste the full text. AI will extract the requirements automatically.
                            </p>
                        </div>

                        {/* CTA Bar */}
                        <div className="flex items-center justify-end gap-4 pt-4 pb-12">
                            <button type="button" className="px-6 py-3 text-sm font-[600] text-slate-600 hover:text-slate-900 transition-colors">
                                Save for Later
                            </button>
                            <button 
                                type="submit" 
                                disabled={isLoading || !formData.title}
                                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-[600] text-white transition-all duration-200 bg-slate-900 hover:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 overflow-hidden disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {/* Gradient Shine Effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0"></div>
                                
                                <span className="relative z-10 flex items-center gap-2">
                                    <i className="ph-bold ph-magic-wand text-lg text-indigo-300"></i>
                                    {isLoading ? 'Creating...' : 'Save & Generate Proposal'}
                                </span>
                            </button>
                        </div>

                    </form>

                </div>
                
                {/* Footer */}
                <div className="mt-12 mb-6 text-center">
                    <p className="text-xs text-slate-400">© 2026 Flova. Crafted for growth.</p>
                </div>
            </div>
        </main>
    );
}
