"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/dashboard/Header';
import Link from 'next/link';

export default function CreateOpportunityPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        source: 'direct',
        priority: 'medium',
        value: '',
        jobLink: '',
        notes: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // TODO: Submit to API
            console.log('Form data:', formData);
            router.push('/opportunities');
        } catch (error) {
            console.error('Error creating opportunity:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header 
                title="New Opportunity"
                subtitle="Add a new lead to your pipeline"
                showNewButton={false}
            />

            <div className="flex-1 overflow-y-auto p-8">
                <div className="w-full max-w-2xl">
                    
                    {/* Back Link */}
                    <Link 
                        href="/opportunities" 
                        className="inline-flex items-center gap-1.5 text-sm font-[500] text-slate-500 hover:text-slate-700 mb-6"
                    >
                        <i className="ph ph-arrow-left"></i>
                        Back to Pipeline
                    </Link>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Basic Info Card */}
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="text-lg font-[600] text-slate-900">Basic Information</h2>
                            </div>
                            <div className="p-6 space-y-5">
                                
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-[600] text-slate-700 mb-1.5">
                                        Opportunity Title <span className="text-rose-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g., Website Redesign for Acme Corp"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-[600] text-slate-700 mb-1.5">Description</label>
                                    <textarea 
                                        rows={3}
                                        placeholder="Brief description of the project scope..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                                    ></textarea>
                                </div>

                                {/* Source & Priority */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-[600] text-slate-700 mb-1.5">Source</label>
                                        <select 
                                            value={formData.source}
                                            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        >
                                            <option value="upwork">Upwork</option>
                                            <option value="linkedin">LinkedIn</option>
                                            <option value="direct">Direct Contact</option>
                                            <option value="referral">Referral</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-[600] text-slate-700 mb-1.5">Priority</label>
                                        <select 
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        >
                                            <option value="high">High</option>
                                            <option value="medium">Medium</option>
                                            <option value="low">Low</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Estimated Value */}
                                <div>
                                    <label className="block text-sm font-[600] text-slate-700 mb-1.5">Estimated Value</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                                        <input 
                                            type="number" 
                                            placeholder="0.00"
                                            value={formData.value}
                                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                            step="0.01"
                                            min="0"
                                            className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info Card */}
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="text-lg font-[600] text-slate-900">Additional Details</h2>
                            </div>
                            <div className="p-6 space-y-5">
                                
                                {/* Job Link */}
                                <div>
                                    <label className="block text-sm font-[600] text-slate-700 mb-1.5">Job Post Link</label>
                                    <p className="text-xs text-slate-500 mb-2">Paste the Upwork, LinkedIn, or other job post URL</p>
                                    <input 
                                        type="url" 
                                        placeholder="https://..."
                                        value={formData.jobLink}
                                        onChange={(e) => setFormData({ ...formData, jobLink: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-[600] text-slate-700 mb-1.5">Internal Notes</label>
                                    <textarea 
                                        rows={4}
                                        placeholder="Any additional notes for yourself..."
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* AI Assist Promo */}
                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-5 text-white relative overflow-hidden">
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-[600] mb-1">Have a job post? Let AI help!</h3>
                                    <p className="text-xs text-indigo-100">Paste the job URL and we&apos;ll extract details and generate a proposal draft.</p>
                                </div>
                                <Link 
                                    href="/proposal/generate"
                                    className="px-4 py-2 bg-white text-indigo-700 text-sm font-[600] rounded-lg hover:bg-indigo-50 transition-colors shrink-0"
                                >
                                    Try AI Draft
                                </Link>
                            </div>
                            <i className="ph ph-magic-wand absolute -right-4 -bottom-4 text-7xl text-white/10 rotate-12"></i>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-4">
                            <Link 
                                href="/opportunities"
                                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-[600] rounded-lg hover:border-slate-300 transition-all"
                            >
                                Cancel
                            </Link>
                            <button 
                                type="submit"
                                disabled={isLoading || !formData.title}
                                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-[600] rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Creating...' : 'Create Opportunity'}
                            </button>
                        </div>
                    </form>

                </div>
                
                {/* Footer */}
                <div className="mt-12 mb-6 text-center">
                    <p className="text-xs text-slate-400">© 2026 Flova. Crafted for growth.</p>
                </div>
            </div>
        </>
    );
}
