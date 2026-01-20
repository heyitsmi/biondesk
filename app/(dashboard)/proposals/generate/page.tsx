'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { opportunitiesApi, documentsApi } from '@/lib/api';
import { Opportunity } from '@/lib/types';

function ProposalGeneratorReact() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const opportunityId = searchParams.get('opportunityId');

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loadingContext, setLoadingContext] = useState(false);
  
  // Settings State
  const [tone, setTone] = useState('professional');
  const [format, setFormat] = useState('proposal');
  const [contextSource, setContextSource] = useState('Manual');
  
  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState('');
  
  // Editor State
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (opportunityId) {
      setLoadingContext(true);
      opportunitiesApi.get(opportunityId)
        .then((data) => {
            setOpportunity(data);
            setContextSource(data.source ? data.source.charAt(0).toUpperCase() + data.source.slice(1) : 'Opportunity');
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingContext(false));
    }
  }, [opportunityId]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
        const description = opportunity 
            ? `Client: ${opportunity.client_name || 'Generic Client'}\nProject: ${opportunity.title}\nBackground: ${opportunity.description || 'No description provided.'}`
            : (document.getElementById('manualDescription') as HTMLTextAreaElement)?.value || '';

        const res = await fetch('/api/ai/proposal/generate', {
            method: 'POST',
            body: JSON.stringify({
                description,
                tone,
                format,
                clientName: opportunity?.client_name,
            })
        });

        if (!res.ok) throw new Error('Generation failed');
        
        const data = await res.json();
        setGeneratedHtml(data.content);
        
        // Update editor content manually if it exists to avoid desync
        if (editorRef.current) {
            editorRef.current.innerHTML = data.content;
        }

    } catch (error) {
        console.error(error);
        alert('Failed to generate proposal');
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSave = async (asType: 'draft' | 'sent') => {
    if (!editorRef.current) return;
    const content = editorRef.current.innerHTML;
    
    try {
        const doc = await documentsApi.create({
            type: 'proposal',
            opportunity_id: opportunity?.id,
            contact_id: opportunity?.contact_id || undefined,
            title: opportunity ? `Proposal: ${opportunity.title}` : 'Untitled Proposal',
            content,
            status: asType === 'sent' ? 'sent' : 'draft',
            amount: opportunity?.value || 0,
            tax: 0,
            discount: 0,
        });
        
        // Redirect to detail page
        router.push(`/proposals/${doc.id}`);
    } catch (error) {
        console.error(error);
        alert('Failed to create proposal');
    }
  };

  const copyToClipboard = () => {
      if (editorRef.current) {
          navigator.clipboard.writeText(editorRef.current.innerText);
          alert('Copied to clipboard!');
      }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
        
        {/* Top Toolbar */}
        <header className="h-16 px-6 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-20 shrink-0">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <i className="ph-bold ph-arrow-left text-lg"></i>
                </button>
                <div className="h-6 w-px bg-slate-200"></div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-xs font-[500] text-slate-500">
                        <span>Growth</span>
                        <i className="ph-bold ph-caret-right text-[10px] text-slate-300"></i>
                        <span>{opportunity ? opportunity.title.substring(0, 30) + '...' : 'New Proposal'}</span>
                    </div>
                    <h1 className="text-lg font-[600] text-slate-900 tracking-tight leading-none">Proposal Generator</h1>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* <span className="text-xs font-[500] text-slate-400 mr-2">Auto-saved 2m ago</span> */}
                <button onClick={copyToClipboard} className="px-4 py-2 text-sm font-[550] text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all flex items-center gap-2 active:scale-95">
                    <i className="ph-bold ph-copy"></i> Copy
                </button>
                <button 
                    onClick={() => handleSave('draft')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-[550] shadow-subtle flex items-center gap-2 transition-smooth"
                >
                    <i className="ph-bold ph-paper-plane-tilt"></i>
                    <span>Save / Create</span>
                </button>
            </div>
        </header>

        {/* Split Content */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* LEFT PANEL: Context & Settings */}
            <div className="w-[380px] bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                <div className="p-6 space-y-8">
                    
                    {/* Context Card */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-[600] text-slate-500 uppercase tracking-wide">Context Source</label>
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">{contextSource}</span>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm transition-all">
                            {opportunity ? (
                                <p className="text-xs text-slate-500 line-clamp-6 leading-relaxed">
                                    {opportunity.description || "No description provided."}
                                </p>
                            ) : (
                                <textarea 
                                    id="manualDescription" 
                                    className="w-full text-xs text-slate-500 border-none resize-none focus:ring-0" 
                                    rows={6}
                                    placeholder="Paste job description here..."
                                ></textarea>
                            )}
                            {opportunity && (
                                <button className="mt-2 text-[11px] font-[600] text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                                    View Full Brief <i className="ph-bold ph-caret-down"></i>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* AI Controls */}
                    <div className="space-y-4">
                        <label className="text-xs font-[600] text-slate-500 uppercase tracking-wide">Generator Settings</label>
                        
                        {/* Tone Chips */}
                        <div className="space-y-2">
                            <label className="text-sm font-[500] text-slate-700">Tone of Voice</label>
                            <div className="flex flex-wrap gap-2">
                                {['Professional', 'Friendly', 'Direct'].map((t) => (
                                    <button 
                                        key={t}
                                        onClick={() => setTone(t.toLowerCase())}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${tone === t.toLowerCase() ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Format Chips */}
                        <div className="space-y-2">
                            <label className="text-sm font-[500] text-slate-700">Format</label>
                            <div className="flex flex-wrap gap-2">
                                {['Cover Letter', 'Email', 'Proposal'].map((f) => (
                                    <button 
                                        key={f}
                                        onClick={() => setFormat(f.toLowerCase().replace(' ', '_'))}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${format === f.toLowerCase().replace(' ', '_') ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Regenerate Action */}
                    <div className="pt-4 mt-auto">
                        <button 
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-[600] shadow-lg flex items-center justify-center gap-2 group transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? (
                                <i className="ph-bold ph-spinner animate-spin"></i>
                            ) : (
                                <i className="ph-bold ph-arrows-clockwise group-hover:rotate-180 transition-transform duration-500"></i>
                            )}
                            {isGenerating ? 'Generating...' : (generatedHtml ? 'Regenerate Proposal' : 'Generate Proposal')}
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Editor */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
                
                {/* Editor Tabs & Toolbar */}
                <div className="h-12 border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
                    <div className="flex gap-6 h-full">
                        <button className="h-full text-sm font-[600] text-indigo-600 border-b-2 border-indigo-600 transition-colors relative top-px">
                            Generated Content
                        </button>
                    </div>
                    
                    {/* Simple Formatting Toolbar */}
                    <div className="flex items-center gap-1 text-slate-400">
                        <button className="p-1.5 hover:text-slate-700 hover:bg-slate-50 rounded"><i className="ph-bold ph-text-b"></i></button>
                        <button className="p-1.5 hover:text-slate-700 hover:bg-slate-50 rounded"><i className="ph-bold ph-text-italic"></i></button>
                        <div className="w-px h-4 bg-slate-200 mx-1"></div>
                        <button className="p-1.5 hover:text-slate-700 hover:bg-slate-50 rounded"><i className="ph-bold ph-list-bullets"></i></button>
                    </div>
                </div>

                {/* Editor Canvas */}
                <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8 custom-scrollbar relative">
                    <div className="max-w-2xl mx-auto bg-white min-h-[800px] p-10 shadow-sm border border-slate-200 rounded-none sm:rounded-sm">
                        
                        {/* Status Message if empty */}
                        {!generatedHtml && !isGenerating && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
                                <i className="ph-duotone ph-magic-wand text-4xl mb-4"></i>
                                <p className="text-sm">Configure settings and click Generate</p>
                            </div>
                        )}

                        {/* Loading State */}
                        {isGenerating && (
                             <div className="space-y-4 animate-pulse">
                                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                <div className="h-4 bg-slate-100 rounded w-full"></div>
                                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                                <div className="h-20 bg-slate-100 rounded w-full mt-6"></div>
                             </div>
                        )}

                        {/* Content */}
                        <div 
                            ref={editorRef}
                            contentEditable
                            className="prose prose-slate prose-sm max-w-none font-sans text-slate-800 leading-relaxed focus:outline-none min-h-[400px]"
                            dangerouslySetInnerHTML={{ __html: generatedHtml }}
                            suppressContentEditableWarning
                        ></div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
}

export default function ProposalGeneratorPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <ProposalGeneratorReact />
        </Suspense>
    );
}
