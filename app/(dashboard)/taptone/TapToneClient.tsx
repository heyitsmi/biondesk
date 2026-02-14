'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export default function TapToneClient() {
    const searchParams = useSearchParams();
    
    // Modes
    const [mode, setMode] = useState<'understand' | 'strategize' | 'compose'>('compose');

    // Inputs
    const [inputText, setInputText] = useState(''); // For Understand/Compose
    const [goal, setGoal] = useState('Ask');
    const [tone, setTone] = useState('Professional');
    const [context, setContext] = useState('');
    const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('low');
    const [language, setLanguage] = useState('English');
    const [channel, setChannel] = useState('Email');

    // Outputs
    const [analysisResult, setAnalysisResult] = useState<any>(null); // For Understand
    const [strategyResult, setStrategyResult] = useState<any>(null); // For Strategize
    const [variants, setVariants] = useState<string[]>([]); // For Compose
    
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const queryContext = searchParams.get('context');
        if (queryContext) {
            setContext(decodeURIComponent(queryContext));
        }
    }, [searchParams]);

    // Lists
    const tones = ['Professional', 'Friendly', 'Calm', 'Confident', 'Firm', 'Urgent', 'Direct', 'Warm', 'Concise'];
    const goals = ['Clarify', 'Close', 'Negotiate', 'Remind', 'Delay', 'Reject', 'Ask', 'Update'];
    const languages = ['English', 'Indonesian', 'Mixed', 'Simplified English', 'Corporate English'];
    const channels = ['Email', 'WhatsApp', 'Upwork', 'Slack'];

    const handleGenerate = async () => {
        setIsLoading(true);
        setAnalysisResult(null);
        setStrategyResult(null);
        setVariants([]);

        try {
            const res = await fetch('/api/ai/taptone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode,
                    clientMessage: inputText, // For Understand
                    goal,
                    tone,
                    context,
                    riskLevel,
                    language,
                    channel
                })
            });
            const data = await res.json();
            
            if (mode === 'understand') setAnalysisResult(data);
            if (mode === 'strategize') setStrategyResult(data);
            if (mode === 'compose') setVariants(data.variants || []);

        } catch (error) {
            console.error('Failed to generate:', error);
            alert('Failed to generate. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <main className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
            {/* Header with Mode Switcher */}
            <header className="h-16 px-6 flex items-center justify-between border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <i className="ph-fill ph-magic-wand text-lg"></i>
                    </div>
                    <div>
                        <h1 className="text-lg font-[650] text-slate-900 leading-none">TapTone</h1>
                        <p className="text-[10px] text-slate-500 font-medium pt-1">Smart Communication Desk</p>
                    </div>
                </div>

                {/* Center Mode Switcher */}
                <div className="flex p-1 bg-slate-100 rounded-lg">
                    {(['understand', 'strategize', 'compose'] as const).map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`px-4 py-1.5 text-xs font-[600] capitalize rounded-md transition-all ${mode === m ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {m}
                        </button>
                    ))}
                </div>

                <div className="w-32"></div> {/* Spacer for balance */}
            </header>

            <div className="flex-1 flex overflow-hidden">
                
                {/* 1. LEFT PANEL: Controls */}
                <div className="w-[300px] bg-slate-50/50 border-r border-slate-200 flex flex-col overflow-y-auto shrink-0">
                    <div className="p-5 space-y-6">
                        
                        {/* Scope/Context */}
                         <div className="space-y-2">
                            <label className="text-xs font-[700] text-slate-400 uppercase tracking-wide">Context</label>
                            <textarea 
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                placeholder="E.g. Project details, money involved..."
                                className="w-full h-20 p-3 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none transition-all placeholder:text-slate-400"
                            ></textarea>
                        </div>

                        {mode !== 'understand' && (
                            <div className="space-y-4 animate-fade-in-up">
                                {/* Goal */}
                                <div className="space-y-2">
                                    <label className="text-xs font-[700] text-slate-400 uppercase tracking-wide">Goal</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {goals.map(g => (
                                            <button
                                                key={g}
                                                onClick={() => setGoal(g)}
                                                className={`px-2.5 py-1 text-[10px] font-medium rounded-full border transition-all ${goal === g ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Risk Level (Strategize only) */}
                                {mode === 'strategize' && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-[700] text-slate-400 uppercase tracking-wide">Risk Level</label>
                                        <div className="flex p-1 bg-white border border-slate-200 rounded-lg">
                                            {['low', 'medium', 'high'].map((r) => (
                                                <button
                                                    key={r}
                                                    onClick={() => setRiskLevel(r as any)}
                                                    className={`flex-1 py-1 text-[10px] font-bold uppercase rounded transition-all ${riskLevel === r ? (r === 'high' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-900') : 'text-slate-400'}`}
                                                >
                                                    {r}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tone & Language (Compose/Strategize) */}
                                <div className="space-y-2">
                                    <label className="text-xs font-[700] text-slate-400 uppercase tracking-wide">Tone</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {tones.map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setTone(t)}
                                                className={`px-2.5 py-1 text-[10px] font-medium rounded-full border transition-all ${tone === t ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-[700] text-slate-400 uppercase tracking-wide">Language</label>
                                    <select 
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                                    >
                                        {languages.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                                
                                <div className="space-y-2">
                                     <label className="text-xs font-[700] text-slate-400 uppercase tracking-wide">Channel</label>
                                     <div className="flex gap-2">
                                        {channels.map(c => (
                                            <button 
                                                key={c}
                                                onClick={() => setChannel(c)}
                                                className={`flex-1 py-1.5 text-xs border rounded-md transition-all ${channel === c ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-600'}`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                     </div>
                                </div>
                            </div>
                        )}
                        
                    </div>
                </div>

                {/* 2. CENTER PANEL: Input / Preview */}
                <div className="flex-1 flex flex-col border-r border-slate-200 bg-white min-w-[350px]">
                    <div className="flex-1 p-6 overflow-y-auto">
                        <label className="text-sm font-[600] text-slate-700 mb-3 block">
                            {mode === 'understand' ? 'Paste Client Message' : 
                             mode === 'compose' ? 'Your Draft / Points (Optional)' : 
                             'Situation Description'}
                        </label>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="w-full h-full min-h-[300px] p-4 text-sm bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400 resize-none font-medium text-slate-600"
                            placeholder={mode === 'understand' ? "Paste email, chat, or thread here..." : "Type what you want to say roughly..."}
                        ></textarea>
                    </div>
                    <div className="p-6 border-t border-slate-100 bg-slate-50/30">
                         <button 
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl text-sm font-[600] shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                        >
                            {isLoading ? (
                                <>
                                    <i className="ph ph-spinner animate-spin text-lg"></i> Processing...
                                </>
                            ) : (
                                <>
                                    <i className="ph-bold ph-lightning text-lg text-yellow-400"></i> 
                                    {mode === 'understand' ? 'Analyze Message' : mode === 'strategize' ? 'Generate Strategy' : 'Compose Message'}
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* 3. RIGHT PANEL: Output / Analysis */}
                <div className="flex-1 min-w-[400px] bg-slate-50 overflow-y-auto p-6 md:p-8">
                     {/* Empty State */}
                     {!analysisResult && !strategyResult && variants.length === 0 && !isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                            <i className="ph-duotone ph-sparkle text-5xl text-indigo-300 mb-4"></i>
                            <p className="text-sm font-medium text-slate-500">AI Output will appear here</p>
                        </div>
                    )}
                    
                    {/* LOADING */}
                    {isLoading && (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-32 bg-slate-200 rounded-xl"></div>
                            <div className="h-20 bg-slate-200 rounded-xl"></div>
                            <div className="h-40 bg-slate-200 rounded-xl"></div>
                        </div>
                    )}

                    {/* MODE 1: UNDERSTAND OUTPUT */}
                    {mode === 'understand' && analysisResult && (
                        <div className="space-y-6 animate-fade-in-up">
                            
                            {/* Intent Card */}
                            <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm">
                                <h3 className="text-xs font-[700] text-indigo-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <i className="ph-bold ph-brain"></i> Core Intent
                                </h3>
                                <p className="text-lg font-[600] text-slate-800">{analysisResult.intent || "Unknown Intent"}</p>
                                <p className="text-sm text-slate-500 mt-1">{analysisResult.summary}</p>
                            </div>

                            {/* Hidden Signals */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                     <h4 className="text-[10px] font-[700] text-slate-400 uppercase tracking-wide mb-2">Urgency</h4>
                                     <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${analysisResult.urgency === 'High' ? 'bg-rose-500' : analysisResult.urgency === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                                        <span className="text-sm font-[600] text-slate-700">{analysisResult.urgency}</span>
                                     </div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                     <h4 className="text-[10px] font-[700] text-slate-400 uppercase tracking-wide mb-2">Sentiment</h4>
                                     <span className="text-sm font-[600] text-slate-700">{analysisResult.sentiment}</span>
                                </div>
                            </div>

                            {/* Suggested Strategy */}
                            <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                                <h3 className="text-xs font-[700] text-indigo-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <i className="ph-bold ph-strategy"></i> Suggested Strategy
                                </h3>
                                <p className="text-sm font-medium text-indigo-900 leading-relaxed">{analysisResult.suggestedStrategy}</p>
                            </div>
                        </div>
                    )}

                    {/* MODE 2: STRATEGIZE OUTPUT */}
                    {mode === 'strategize' && strategyResult && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-base font-[700] text-slate-800 mb-4">Communication Strategy</h3>
                                <div className="space-y-4">
                                    {strategyResult.keyPoints?.map((point: string, i: number) => (
                                        <div key={i} className="flex gap-3">
                                            <i className="ph-fill ph-check-circle text-emerald-500 mt-0.5"></i>
                                            <p className="text-sm text-slate-600">{point}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                             <div className="bg-rose-50 p-5 rounded-xl border border-rose-100">
                                <h3 className="text-xs font-[700] text-rose-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <i className="ph-bold ph-warning-circle"></i> Avoid Mentioning
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-sm text-rose-800">
                                    {strategyResult.avoidPoints?.map((p: string, i: number) => <li key={i}>{p}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* MODE 3: COMPOSE OUTPUT */}
                    {mode === 'compose' && variants.length > 0 && (
                         <div className="space-y-6 animate-fade-in-up">
                            {variants.map((variant, idx) => (
                                <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                     <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-[600] text-slate-500 uppercase tracking-wider">Option {idx + 1}</span>
                                            {/* Mock Risk Score */}
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${idx === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {idx === 0 ? 'Safe' : 'Bold'}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => copyToClipboard(variant)}
                                            className="text-slate-400 hover:text-indigo-600 p-1.5 hover:bg-indigo-50 rounded-md transition-colors"
                                        >
                                            <i className="ph-bold ph-copy text-lg"></i>
                                        </button>
                                    </div>
                                    <div className="p-5 text-sm md:text-base text-slate-700 leading-relaxed whitespace-pre-wrap font-[450] font-sans">
                                        {variant}
                                    </div>
                                </div>
                            ))}
                         </div>
                    )}
                </div>
            </div>
        </main>
    );
}
