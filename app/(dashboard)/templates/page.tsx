'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { templatesApi } from '@/lib/api';
import { Template } from '@/lib/types';

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                // In a real app, you'd likely fetch all and filter client-side 
                // or fetch with type param if the list is huge.
                // For this UI, fetching all allows for smoother client-side filtering.
                const response = await templatesApi.list();
                setTemplates(response.data || []);
            } catch (error) {
                console.error('Failed to load templates:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    const filteredTemplates = templates.filter(t => {
        const matchesFilter = filter === 'all' || t.type === filter;
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getBadgeColor = (type: string) => {
        switch (type) {
            case 'quote': return 'bg-white/90 backdrop-blur border-indigo-100 text-indigo-600';
            case 'proposal': return 'bg-white/90 backdrop-blur border-purple-100 text-purple-600';
            case 'invoice': return 'bg-white/90 backdrop-blur border-emerald-100 text-emerald-600';
            default: return 'bg-white/90 backdrop-blur border-slate-100 text-slate-600';
        }
    };
    
    // Helper to generate visual skeletons for the cards based on type
    const renderCardPreview = (type: string) => {
        if (type === 'quote') {
            return (
                <div className="w-full h-full bg-white border border-slate-200 shadow-sm rounded-lg p-3 space-y-2 opacity-80 group-hover:opacity-100 transition-opacity transform group-hover:scale-[1.02] duration-300 origin-top">
                    <div className="w-1/3 h-2 bg-slate-200 rounded"></div>
                    <div className="w-1/2 h-2 bg-slate-100 rounded"></div>
                    <div className="mt-4 space-y-1">
                        <div className="w-full h-1.5 bg-slate-100 rounded"></div>
                        <div className="w-full h-1.5 bg-slate-100 rounded"></div>
                        <div className="w-2/3 h-1.5 bg-slate-100 rounded"></div>
                    </div>
                </div>
            );
        } else if (type === 'proposal') {
            return (
                <div className="w-full h-full bg-white border border-slate-200 shadow-sm rounded-lg p-3 space-y-2 opacity-80 group-hover:opacity-100 transition-opacity transform group-hover:scale-[1.02] duration-300 origin-top">
                    <div className="w-1/2 h-2 bg-slate-200 rounded mx-auto mb-4"></div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="h-8 bg-slate-50 rounded"></div>
                        <div className="h-8 bg-slate-50 rounded"></div>
                    </div>
                </div>
            );
        } else { // invoice
            return (
                <div className="w-full h-full bg-white border border-slate-200 shadow-sm rounded-lg p-3 space-y-2 opacity-80 group-hover:opacity-100 transition-opacity transform group-hover:scale-[1.02] duration-300 origin-top">
                    <div className="flex justify-between">
                        <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
                        <div className="w-16 h-2 bg-slate-200 rounded"></div>
                    </div>
                    <div className="mt-4 w-full h-px bg-slate-100"></div>
                    <div className="space-y-1">
                        <div className="w-full h-1.5 bg-slate-50 rounded"></div>
                        <div className="w-full h-1.5 bg-slate-50 rounded"></div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-white transition-all duration-300 ease-in-out">
            
            {/* Header */}
            <header className="h-16 px-8 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-[600] text-slate-900 tracking-tight">Templates</h1>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <div className="relative hidden md:block">
                        <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input 
                            type="text" 
                            placeholder="Search templates..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm font-[450] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <Link href="/templates/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-[550] shadow-subtle flex items-center gap-2 transition-smooth">
                    <i className="ph-bold ph-plus"></i>
                    <span>New Template</span>
                </Link>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                
                {/* Filters */}
                <div className="flex items-center gap-2 mb-8">
                    {['all', 'quote', 'proposal', 'invoice'].map((f) => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`h-9 px-4 text-xs font-[600] rounded-lg shadow-sm transition-all capitalize ${
                                filter === f 
                                ? 'bg-slate-900 text-white' 
                                : 'text-slate-600 bg-white border border-transparent hover:border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {f === 'all' ? 'All' : f + 's'}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    
                    {/* Create New Card */}
                    <Link href="/templates/create" className="group relative flex flex-col items-center justify-center p-6 h-[280px] rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-white hover:border-indigo-400 hover:shadow-md transition-all duration-300 text-slate-400 hover:text-indigo-600">
                        <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                            <i className="ph-bold ph-plus text-xl"></i>
                        </div>
                        <span className="text-sm font-[600]">Create New Template</span>
                    </Link>

                    {/* Template Cards */}
                    {isLoading ? (
                        // Skeleton Loaders
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-xl border border-slate-200 h-[280px] animate-pulse"></div>
                        ))
                    ) : (
                        filteredTemplates.map((template) => (
                            <div key={template.id} className="template-card group bg-white rounded-xl border border-slate-200 shadow-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-[280px]">
                                {/* Preview Area */}
                                <div className="h-36 bg-slate-50 border-b border-slate-100 p-4 relative overflow-hidden">
                                    {renderCardPreview(template.type)}
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-2 py-1 text-[10px] font-bold border rounded shadow-sm capitalize ${getBadgeColor(template.type)}`}>
                                            {template.type}
                                        </span>
                                    </div>
                                </div>
                                {/* Info Area */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="text-sm font-[600] text-slate-900 leading-snug mb-1">{template.name}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-2">
                                        {/* Fallback description since DB doesn't have it, or use content snippet */}
                                        {template.content 
                                            ? template.content.substring(0, 60) + '...'
                                            : `Standard ${template.type} template.`
                                        }
                                    </p>
                                    
                                    <div className="mt-auto pt-4 flex items-center justify-between">
                                        <span className="text-[10px] text-slate-400 font-medium">Used {template.used_count} times</span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/templates/${template.id}/edit`} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded">
                                                <i className="ph-bold ph-pencil-simple"></i>
                                            </Link>
                                            <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded">
                                                <i className="ph-bold ph-copy"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                </div>
            </div>
        </div>
    );
}
