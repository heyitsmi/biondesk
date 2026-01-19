'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { documentsApi, opportunitiesApi } from '@/lib/api';
import { DocumentWithItems, Opportunity } from '@/lib/types';
import Link from 'next/link';

export default function ProposalDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [document, setDocument] = useState<DocumentWithItems | null>(null);
    const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const doc = await documentsApi.get(id);
            setDocument(doc);
            if (doc.opportunity_id) {
                const opp = await opportunitiesApi.get(doc.opportunity_id);
                setOpportunity(opp);
            }
        } catch (error) {
            console.error('Failed to load proposal', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!document || !editorRef.current) return;
        
        try {
            await documentsApi.update(document.id, {
                content: editorRef.current.innerHTML
            });
            setIsEditing(false);
            // Reload to ensure sync
            loadData();
        } catch (error) {
            console.error('Failed to save', error);
            alert('Failed to save changes');
        }
    };

    const handleStatusChange = async (newStatus: 'sent' | 'accepted' | 'lost') => {
        if (!document) return;
        
        // Map UI status to DB status if needed, or simple update
        // DB status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'paid' | 'overdue'
        let status = newStatus as any;
        if (newStatus === 'lost') status = 'overdue'; // Mapping lost/archived? Or just keep it separate. 'lost' is opportunity stage.
        // If "Mark as Won", update Opportunity?
        
        try {
            await documentsApi.update(document.id, { status });
            if (newStatus === 'accepted' && opportunity) {
                await opportunitiesApi.update(opportunity.id, { stage: 'won' });
            }
            if (newStatus === 'lost' && opportunity) {
                await opportunitiesApi.update(opportunity.id, { stage: 'lost' });
            }
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSend = async () => {
        if (!document) return;
        try {
             await documentsApi.send(document.id);
             alert('Proposal marked as sent. Public link generated.');
             loadData();
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!document) {
        return <div className="flex h-screen items-center justify-center">Proposal not found</div>;
    }

    return (
        <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
            
            {/* Header */}
            <header className="h-16 px-8 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <i className="ph-bold ph-arrow-left text-lg"></i>
                    </button>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <div>
                        <div className="flex items-center gap-2 text-xs font-[500] text-slate-500 mb-0.5">
                            <span>Proposals</span>
                            <i className="ph-bold ph-caret-right text-[10px] text-slate-300"></i>
                            <span className="text-slate-800">{opportunity?.title || 'Unknown Project'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg font-[600] text-slate-900 tracking-tight leading-none">{document.title}</h1>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1.5 capitalize
                                ${document.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                  document.status === 'sent' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 
                                  'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                {document.status === 'accepted' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                                {document.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isEditing ? (
                         <>
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-sm font-[550] text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-[550] shadow-subtle flex items-center gap-2 transition-smooth"
                            >
                                <i className="ph-bold ph-check"></i>
                                Save Changes
                            </button>
                         </>
                    ) : (
                        <>
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 text-sm font-[550] text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all flex items-center gap-2"
                            >
                                <i className="ph-bold ph-pencil-simple"></i> Edit
                            </button>
                            <div className="h-8 w-px bg-slate-200"></div>
                            {document.status === 'draft' && (
                                <button 
                                    onClick={handleSend}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-[550] shadow-subtle flex items-center gap-2 transition-smooth"
                                >
                                    <i className="ph-bold ph-paper-plane-tilt"></i>
                                    <span>Send Now</span>
                                </button>
                            )}
                            {document.status === 'sent' && (
                                <button 
                                    onClick={handleSend}
                                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-5 py-2 rounded-lg text-sm font-[550] shadow-subtle flex items-center gap-2 transition-smooth"
                                >
                                    <i className="ph-bold ph-paper-plane-tilt"></i>
                                    <span>Resend</span>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </header>

            {/* Main Workspace (Split View) */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* LEFT COLUMN: Document Preview */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar flex justify-center bg-slate-100">
                    
                    {/* A4 Paper Representation */}
                    <div className="w-full max-w-[210mm] bg-white shadow-xl border border-slate-200 min-h-[297mm] p-12 text-slate-800 text-sm leading-relaxed relative">
                        
                        {/* Header Section (Dynamic) */}
                        <div className="mb-10 pointer-events-none select-none">
                            <div className="flex items-center gap-2 mb-6 text-indigo-600">
                                <i className="ph-fill ph-lightning text-xl"></i>
                                <span className="text-lg font-bold text-slate-900">Dealis Studio</span>
                            </div>
                            <p className="text-slate-500 mb-1">{new Date(document.created_at).toLocaleDateString()}</p>
                            <h1 className="text-2xl font-bold text-slate-900">{document.title}</h1>
                            <p className="text-slate-600 mt-2">Prepared for <strong>{opportunity?.client_name || 'Client'}</strong></p>
                        </div>

                        {/* Editable Content */}
                        <div 
                            ref={editorRef}
                            contentEditable={isEditing}
                            suppressContentEditableWarning
                            className={`space-y-6 text-slate-700 outline-none ${isEditing ? 'ring-2 ring-indigo-100 rounded p-2 -ml-2' : ''}`}
                            dangerouslySetInnerHTML={{ __html: document.content || '<p>No content provided.</p>' }}
                        />

                        {/* Footer Section */}
                        <div className="mt-12 pt-8 border-t border-slate-100 text-center text-xs text-slate-400 pointer-events-none">
                            <p>Proposal #{document.number} • Valid until {new Date(new Date().setDate(new Date().getDate() + 14)).toLocaleDateString()}</p>
                        </div>

                    </div>
                </div>

                {/* RIGHT COLUMN: Activity & Status */}
                <div className="w-[360px] bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                    
                    {/* Status Timeline */}
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-sm font-[600] text-slate-900 mb-4">Proposal Status</h3>
                        
                        <div className="relative pl-4 border-l-2 border-slate-100 space-y-8">
                            
                            {/* Created */}
                            <div className="relative">
                                <div className="absolute -left-[21px] w-3 h-3 bg-indigo-600 rounded-full border-2 border-white shadow-sm"></div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-900 uppercase">Drafted</span>
                                    <span className="text-xs text-slate-500">{new Date(document.created_at).toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Sent */}
                            <div className={`relative ${['sent', 'viewed', 'accepted'].includes(document.status) ? '' : 'opacity-40'}`}>
                                <div className={`absolute -left-[21px] w-3 h-3 rounded-full border-2 border-white shadow-sm ${['sent', 'viewed', 'accepted'].includes(document.status) ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-900 uppercase">Sent</span>
                                    {document.sent_at ? <span className="text-xs text-slate-500">{new Date(document.sent_at).toLocaleString()}</span> : <span className="text-xs text-slate-400">Not sent yet</span>}
                                </div>
                            </div>

                            {/* Accepted */}
                            <div className={`relative ${document.status === 'accepted' ? '' : 'opacity-40'}`}>
                                <div className={`absolute -left-[21px] w-3 h-3 rounded-full border-2 border-white shadow-sm ${document.status === 'accepted' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                <div className="flex flex-col">
                                    <span className={`text-xs font-bold uppercase ${document.status === 'accepted' ? 'text-emerald-700' : 'text-slate-400'}`}>Accepted</span>
                                    {document.accepted_at && <span className="text-xs text-slate-500">{new Date(document.accepted_at).toLocaleString()}</span>}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Opportunity Context */}
                    {opportunity && (
                        <div className="p-6 border-b border-slate-100">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-sm font-[600] text-slate-900">Opportunity</h3>
                                <Link href={`/opportunities/${opportunity.id}`} className="text-xs text-indigo-600 hover:underline">View Details</Link>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <p className="text-sm font-[600] text-slate-900 mb-1">{opportunity.title}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    {opportunity.source && <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] capitalize">{opportunity.source}</span>}
                                    {opportunity.value && <span>${opportunity.value.toLocaleString()} Budget</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="p-6 bg-slate-50/50 flex-1">
                        <h3 className="text-sm font-[600] text-slate-900 mb-3">Next Steps</h3>
                        <div className="space-y-3">
                            {/* Mark as Won */}
                            {document.status !== 'accepted' && (
                                <button 
                                    onClick={() => handleStatusChange('accepted')}
                                    className="w-full text-left p-3 bg-white border border-slate-200 hover:border-emerald-300 rounded-xl shadow-sm transition-all flex items-center gap-3 group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                        <i className="ph-bold ph-check-circle"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-[600] text-slate-700 group-hover:text-emerald-700">Mark as Accepted</p>
                                        <p className="text-[10px] text-slate-500">Also marks opportunity as Won</p>
                                    </div>
                                </button>
                            )}

                             {/* Send Follow-up (Mock) */}
                            <button className="w-full text-left p-3 bg-white border border-slate-200 hover:border-amber-300 rounded-xl shadow-sm transition-all flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                                    <i className="ph-bold ph-clock"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-[600] text-slate-700 group-hover:text-amber-700">Send Follow-up</p>
                                    <p className="text-[10px] text-slate-500">Reminder to client</p>
                                </div>
                            </button>
                            
                            {/* Mark as Lost */}
                            <button 
                                onClick={() => handleStatusChange('lost')}
                                className="w-full text-left p-3 bg-white border border-slate-200 hover:border-rose-300 rounded-xl shadow-sm transition-all flex items-center gap-3 group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                                    <i className="ph-bold ph-x-circle"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-[600] text-slate-700 group-hover:text-rose-700">Mark as Lost</p>
                                    <p className="text-[10px] text-slate-500">Archive this proposal</p>
                                </div>
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
