'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function TapToneClient() {
    const searchParams = useSearchParams();
    
    // Modes
    const [mode, setMode] = useState<'understand' | 'strategize' | 'compose' | 'conversation'>('compose');

    // Inputs
    const [inputText, setInputText] = useState('');
    const [goal, setGoal] = useState('Clarify');
    const [tone, setTone] = useState('Professional');
    const [context, setContext] = useState('');
    const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('low');
    const [position, setPosition] = useState('Professional');
    const [length, setLength] = useState('Balanced');
    const [language, setLanguage] = useState('English');
    const [channel, setChannel] = useState('Email');

    // Outputs
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [strategyResult, setStrategyResult] = useState<any>(null);
    const [conversationResult, setConversationResult] = useState<any>(null);
    const [composeResult, setComposeResult] = useState<any>(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

    // Linked entity
    const [linkedEntity, setLinkedEntity] = useState<string | null>(null);

    useEffect(() => {
        const queryContext = searchParams.get('context');
        if (queryContext) {
            setContext(decodeURIComponent(queryContext));
            setLinkedEntity(searchParams.get('source') || null);
        }
    }, [searchParams]);

    // Lists
    const tones = ['Professional', 'Friendly', 'Confident', 'Firm', 'Diplomatic', 'Assertive', 'Calm', 'Neutral'];
    const goals = ['Clarify', 'Close', 'Negotiate', 'Remind', 'Delay', 'Reject', 'Ask', 'Update', 'Payment Reminder'];
    const positions = ['Firm', 'Flexible', 'Premium', 'Supportive'];
    const lengths = ['Short', 'Balanced', 'Detailed'];
    const languages = ['English', 'Indonesian', 'Mixed', 'Simplified English', 'Corporate English'];
    const channels = ['Email', 'WhatsApp', 'Upwork', 'Slack'];

    const handleGenerate = async () => {
        setIsLoading(true);
        setAnalysisResult(null);
        setStrategyResult(null);
        setConversationResult(null);
        setComposeResult(null);

        try {
            const res = await fetch('/api/ai/taptone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode,
                    clientMessage: inputText,
                    goal,
                    tone,
                    context,
                    riskLevel,
                    position,
                    length,
                    language,
                    channel
                })
            });
            const data = await res.json();
            
            if (mode === 'understand') setAnalysisResult(data);
            else if (mode === 'strategize') setStrategyResult(data);
            else if (mode === 'conversation') setConversationResult(data);
            else setComposeResult(data);

        } catch (error) {
            console.error('Failed to generate:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string, idx: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    // Flow helpers: carry context between modes
    const flowToStrategize = () => {
        if (analysisResult) {
            setContext(prev => prev + (prev ? '\n\n' : '') + `[Analysis] Intent: ${analysisResult.intent}. ${analysisResult.suggestedStrategy}`);
        }
        setMode('strategize');
    };

    const flowToCompose = () => {
        if (strategyResult) {
            setContext(prev => prev + (prev ? '\n\n' : '') + `[Strategy] ${strategyResult.strategyTitle}. Key points: ${strategyResult.keyPoints?.join('; ')}`);
            if (strategyResult.recommendedTone) setTone(strategyResult.recommendedTone);
        }
        setMode('compose');
    };

    const riskColor = (score: number) => {
        if (score <= 3) return 'bg-emerald-100 text-emerald-700';
        if (score <= 6) return 'bg-amber-100 text-amber-700';
        return 'bg-rose-100 text-rose-700';
    };

    const riskLabel = (score: number) => {
        if (score <= 3) return 'Safe';
        if (score <= 6) return 'Moderate';
        return 'Bold';
    };

    return (
        <main className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
            {/* Header */}
            <header className="h-16 px-6 flex items-center justify-between border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <i className="ph-fill ph-magic-wand text-lg"></i>
                    </div>
                    <div>
                        <h1 className="text-lg font-[650] text-slate-900 leading-none">TapTone</h1>
                        <p className="text-[10px] text-slate-500 font-medium pt-1">Smart Communication Desk</p>
                    </div>
                    {linkedEntity && (
                        <span className="ml-2 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-[600] text-indigo-600 flex items-center gap-1">
                            <i className="ph-bold ph-link-simple text-xs"></i> {linkedEntity}
                        </span>
                    )}
                </div>

                {/* Mode Switcher */}
                <div className="flex p-1 bg-slate-100 rounded-lg">
                    {(['understand', 'strategize', 'compose', 'conversation'] as const).map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`px-3 py-1.5 text-[11px] font-[600] capitalize rounded-md transition-all ${mode === m ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {m === 'conversation' ? 'Thread' : m}
                        </button>
                    ))}
                </div>

                <div className="w-24"></div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                
                {/* ═══════════ LEFT PANEL: Controls ═══════════ */}
                <div className="w-[280px] bg-slate-50/50 border-r border-slate-200 flex flex-col overflow-y-auto shrink-0">
                    <div className="p-5 space-y-5">
                        
                        {/* Context */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider">Context</label>
                            <textarea 
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                placeholder="Project details, amounts, deadlines..."
                                className="w-full h-20 p-3 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none transition-all placeholder:text-slate-400"
                            ></textarea>
                        </div>

                        {/* Controls visible for Strategize/Compose */}
                        {(mode === 'strategize' || mode === 'compose') && (
                            <div className="space-y-5">
                                {/* Goal */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider">Goal</label>
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

                                {/* Position */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider">Position</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {positions.map(p => (
                                            <button
                                                key={p}
                                                onClick={() => setPosition(p)}
                                                className={`px-2.5 py-1 text-[10px] font-medium rounded-full border transition-all ${position === p ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Risk Level */}
                                {mode === 'strategize' && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider">Risk Level</label>
                                        <div className="flex p-1 bg-white border border-slate-200 rounded-lg">
                                            {['low', 'medium', 'high'].map((r) => (
                                                <button
                                                    key={r}
                                                    onClick={() => setRiskLevel(r as any)}
                                                    className={`flex-1 py-1 text-[10px] font-bold uppercase rounded transition-all ${riskLevel === r ? (r === 'high' ? 'bg-rose-100 text-rose-600' : r === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600') : 'text-slate-400'}`}
                                                >
                                                    {r}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tone */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider">Tone</label>
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

                                {/* Length (Compose only) */}
                                {mode === 'compose' && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider">Length</label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {lengths.map(l => (
                                                <button
                                                    key={l}
                                                    onClick={() => setLength(l)}
                                                    className={`px-2.5 py-1 text-[10px] font-medium rounded-full border transition-all ${length === l ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                                >
                                                    {l}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Language */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider">Language</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {languages.map(l => (
                                            <button
                                                key={l}
                                                onClick={() => setLanguage(l)}
                                                className={`px-2.5 py-1 text-[10px] font-medium rounded-full border transition-all ${language === l ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                            >
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Channel */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider">Channel</label>
                                    <div className="flex gap-1.5">
                                        {channels.map(c => (
                                            <button 
                                                key={c}
                                                onClick={() => setChannel(c)}
                                                className={`flex-1 py-1.5 text-[10px] font-[600] border rounded-md transition-all ${channel === c ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-600'}`}
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

                {/* ═══════════ CENTER PANEL: Input ═══════════ */}
                <div className="flex-1 flex flex-col border-r border-slate-200 bg-white min-w-[320px]">
                    <div className="flex-1 p-6 overflow-y-auto">
                        <label className="text-sm font-[600] text-slate-700 mb-3 flex items-center gap-2">
                            {mode === 'understand' ? <><i className="ph-bold ph-envelope-open text-indigo-500"></i> Paste Client Message</> : 
                             mode === 'conversation' ? <><i className="ph-bold ph-chats-circle text-indigo-500"></i> Paste Full Thread</> :
                             mode === 'compose' ? <><i className="ph-bold ph-pencil-simple-line text-indigo-500"></i> Your Draft / Points (Optional)</> : 
                             <><i className="ph-bold ph-notepad text-indigo-500"></i> Situation Description</>}
                        </label>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="w-full h-full min-h-[300px] p-4 text-sm bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400 resize-none font-medium text-slate-600 leading-relaxed"
                            placeholder={
                                mode === 'understand' ? "Paste email, chat, or message here..." : 
                                mode === 'conversation' ? "Paste the full conversation thread here..." :
                                mode === 'compose' ? "Type what you want to say, key points to cover..." :
                                "Describe the situation you need a strategy for..."
                            }
                        ></textarea>
                    </div>
                    <div className="p-5 border-t border-slate-100 bg-slate-50/30">
                        <button 
                            onClick={handleGenerate}
                            disabled={isLoading || !inputText.trim()}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl text-sm font-[600] shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {isLoading ? (
                                <><i className="ph ph-spinner animate-spin text-lg"></i> Processing...</>
                            ) : (
                                <>
                                    <i className="ph-bold ph-lightning text-lg text-yellow-400"></i> 
                                    {mode === 'understand' ? 'Analyze Message' : 
                                     mode === 'strategize' ? 'Generate Strategy' : 
                                     mode === 'conversation' ? 'Analyze Thread' :
                                     'Compose Message'}
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* ═══════════ RIGHT PANEL: Output ═══════════ */}
                <div className="flex-1 min-w-[400px] bg-slate-50 overflow-y-auto p-6">
                    
                    {/* Empty State */}
                    {!analysisResult && !strategyResult && !conversationResult && !composeResult && !isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-30">
                            <i className="ph-duotone ph-sparkle text-5xl text-indigo-300 mb-4"></i>
                            <p className="text-sm font-medium text-slate-500">AI Output will appear here</p>
                            <p className="text-xs text-slate-400 mt-1">
                                {mode === 'understand' ? 'Paste a message and click Analyze' :
                                 mode === 'conversation' ? 'Paste a full thread and click Analyze' :
                                 'Configure your settings and click Generate'}
                            </p>
                        </div>
                    )}
                    
                    {/* Loading */}
                    {isLoading && (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-28 bg-slate-200 rounded-xl"></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="h-20 bg-slate-200 rounded-xl"></div>
                                <div className="h-20 bg-slate-200 rounded-xl"></div>
                            </div>
                            <div className="h-36 bg-slate-200 rounded-xl"></div>
                        </div>
                    )}

                    {/* ── UNDERSTAND OUTPUT ──────────────────────── */}
                    {mode === 'understand' && analysisResult && (
                        <div className="space-y-5">
                            {/* Intent */}
                            <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm">
                                <h3 className="text-[10px] font-[700] text-indigo-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                    <i className="ph-bold ph-brain"></i> Core Intent
                                </h3>
                                <p className="text-lg font-[650] text-slate-800">{analysisResult.intent || "Unknown"}</p>
                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{analysisResult.summary}</p>
                            </div>

                            {/* Hidden Signals Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <h4 className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider mb-2">Urgency</h4>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2.5 h-2.5 rounded-full ${analysisResult.urgency === 'High' ? 'bg-rose-500' : analysisResult.urgency === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                                        <span className="text-sm font-[600] text-slate-700">{analysisResult.urgency}</span>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <h4 className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider mb-2">Sentiment</h4>
                                    <span className="text-sm font-[600] text-slate-700">{analysisResult.sentiment}</span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <h4 className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider mb-2">Scope Creep Risk</h4>
                                    <span className={`text-sm font-[600] ${analysisResult.hiddenSignals?.scopeCreepRisk === 'High' ? 'text-rose-600' : analysisResult.hiddenSignals?.scopeCreepRisk === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}`}>
                                        {analysisResult.hiddenSignals?.scopeCreepRisk || 'None'}
                                    </span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <h4 className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider mb-2">Price Sensitivity</h4>
                                    <span className={`text-sm font-[600] ${analysisResult.hiddenSignals?.priceSensitivity === 'High' ? 'text-rose-600' : analysisResult.hiddenSignals?.priceSensitivity === 'Medium' ? 'text-amber-600' : 'text-slate-600'}`}>
                                        {analysisResult.hiddenSignals?.priceSensitivity || 'None'}
                                    </span>
                                </div>
                            </div>

                            {/* Risk Signals */}
                            {analysisResult.hiddenSignals?.riskSignals?.length > 0 && (
                                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                    <h4 className="text-[10px] font-[700] text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <i className="ph-bold ph-warning"></i> Risk Signals Detected
                                    </h4>
                                    <ul className="space-y-1.5">
                                        {analysisResult.hiddenSignals.riskSignals.map((s: string, i: number) => (
                                            <li key={i} className="text-xs text-amber-800 flex items-start gap-2">
                                                <i className="ph-bold ph-flag-pennant text-amber-500 mt-0.5 shrink-0"></i>
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Suggested Strategy */}
                            <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                                <h3 className="text-[10px] font-[700] text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                    <i className="ph-bold ph-compass"></i> Suggested Strategy
                                </h3>
                                <p className="text-sm font-medium text-indigo-900 leading-relaxed">{analysisResult.suggestedStrategy}</p>
                            </div>

                            {/* Actionable Strategies */}
                            {analysisResult.actionableStrategies?.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider">Actionable Next Steps</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {analysisResult.actionableStrategies.map((s: any, i: number) => (
                                            <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 hover:border-indigo-200 transition-colors cursor-default">
                                                <p className="text-xs font-[600] text-slate-800">{s.label}</p>
                                                <p className="text-[11px] text-slate-500 mt-0.5">{s.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Flow CTA */}
                            <button
                                onClick={flowToStrategize}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-[600] flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                            >
                                <i className="ph-bold ph-strategy"></i> Strategize a Response →
                            </button>
                        </div>
                    )}

                    {/* ── STRATEGIZE OUTPUT ──────────────────────── */}
                    {mode === 'strategize' && strategyResult && (
                        <div className="space-y-5">
                            {/* Strategy Title */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-base font-[700] text-slate-800">{strategyResult.strategyTitle || 'Communication Strategy'}</h3>
                                    {strategyResult.recommendedTone && (
                                        <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-[10px] font-[600] text-indigo-600 border border-indigo-100">
                                            Tone: {strategyResult.recommendedTone}
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    {strategyResult.keyPoints?.map((point: string, i: number) => (
                                        <div key={i} className="flex gap-3">
                                            <i className="ph-fill ph-check-circle text-emerald-500 mt-0.5 shrink-0"></i>
                                            <p className="text-sm text-slate-600">{point}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Avoid Points */}
                            <div className="bg-rose-50 p-5 rounded-xl border border-rose-100">
                                <h3 className="text-[10px] font-[700] text-rose-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                    <i className="ph-bold ph-prohibit"></i> Avoid Mentioning
                                </h3>
                                <ul className="space-y-2">
                                    {strategyResult.avoidPoints?.map((p: string, i: number) => (
                                        <li key={i} className="text-sm text-rose-800 flex items-start gap-2">
                                            <i className="ph-bold ph-x-circle text-rose-400 mt-0.5 shrink-0"></i>
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Boundary Statements */}
                            {strategyResult.boundaryStatements?.length > 0 && (
                                <div className="bg-slate-800 p-5 rounded-xl text-white">
                                    <h3 className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                        <i className="ph-bold ph-shield-check"></i> Boundary Statements
                                    </h3>
                                    <div className="space-y-3">
                                        {strategyResult.boundaryStatements.map((b: string, i: number) => (
                                            <div key={i} className="flex items-start gap-3 group">
                                                <p className="text-sm text-slate-200 italic leading-relaxed flex-1">"{b}"</p>
                                                <button 
                                                    onClick={() => copyToClipboard(b, 100 + i)} 
                                                    className="text-slate-500 hover:text-white p-1 rounded transition-colors shrink-0"
                                                >
                                                    <i className={`ph-bold ${copiedIdx === 100 + i ? 'ph-check' : 'ph-copy'} text-sm`}></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Risk Assessment */}
                            {strategyResult.riskAssessment && (
                                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-3">
                                    <i className="ph-bold ph-info text-amber-500 mt-0.5"></i>
                                    <p className="text-xs text-amber-800">{strategyResult.riskAssessment}</p>
                                </div>
                            )}

                            {/* Flow CTA */}
                            <button
                                onClick={flowToCompose}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-[600] flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                            >
                                <i className="ph-bold ph-pencil-simple"></i> Compose Reply →
                            </button>
                        </div>
                    )}

                    {/* ── CONVERSATION OUTPUT ──────────────────────── */}
                    {mode === 'conversation' && conversationResult && (
                        <div className="space-y-5">
                            {/* Thread Summary */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-[10px] font-[700] text-indigo-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                    <i className="ph-bold ph-chat-dots"></i> Thread Summary
                                </h3>
                                <p className="text-sm text-slate-700 leading-relaxed">{conversationResult.threadSummary}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Commitments */}
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <h4 className="text-[10px] font-[700] text-emerald-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <i className="ph-bold ph-handshake"></i> Commitments
                                    </h4>
                                    <ul className="space-y-1.5">
                                        {conversationResult.commitments?.map((c: string, i: number) => (
                                            <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                                                <i className="ph-fill ph-check text-emerald-400 mt-0.5 shrink-0"></i> {c}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Unresolved */}
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <h4 className="text-[10px] font-[700] text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <i className="ph-bold ph-question"></i> Unresolved
                                    </h4>
                                    <ul className="space-y-1.5">
                                        {conversationResult.unresolvedItems?.map((u: string, i: number) => (
                                            <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                                                <i className="ph-fill ph-circle text-amber-400 mt-0.5 shrink-0 text-[8px]"></i> {u}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Scope Changes */}
                            {conversationResult.scopeChanges?.length > 0 && (
                                <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                                    <h4 className="text-[10px] font-[700] text-rose-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <i className="ph-bold ph-warning"></i> Scope Changes Detected
                                    </h4>
                                    <ul className="space-y-1.5">
                                        {conversationResult.scopeChanges.map((s: string, i: number) => (
                                            <li key={i} className="text-xs text-rose-800">{s}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Next Action */}
                            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                <h4 className="text-[10px] font-[700] text-indigo-600 uppercase tracking-wider mb-2">Suggested Next Action</h4>
                                <p className="text-sm font-medium text-indigo-900">{conversationResult.suggestedNextAction}</p>
                            </div>

                            {/* Structured Reply */}
                            {conversationResult.structuredReply && (
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[10px] font-[700] text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                            <i className="ph-bold ph-envelope-simple"></i> Structured Reply Draft
                                        </h3>
                                        <button 
                                            onClick={() => {
                                                const r = conversationResult.structuredReply;
                                                copyToClipboard(`Subject: ${r.subject}\n\n${r.summary}\n\nClarification:\n${r.clarification}\n\nNext Steps:\n${r.nextSteps}\n\nDeadline: ${r.deadline}`, 200);
                                            }}
                                            className="text-slate-400 hover:text-indigo-600 p-1 rounded transition-colors"
                                        >
                                            <i className={`ph-bold ${copiedIdx === 200 ? 'ph-check' : 'ph-copy'} text-sm`}></i>
                                        </button>
                                    </div>
                                    {[
                                        { label: 'Subject', value: conversationResult.structuredReply.subject },
                                        { label: 'Summary', value: conversationResult.structuredReply.summary },
                                        { label: 'Clarification', value: conversationResult.structuredReply.clarification },
                                        { label: 'Next Steps', value: conversationResult.structuredReply.nextSteps },
                                        { label: 'Deadline', value: conversationResult.structuredReply.deadline },
                                    ].map((field, i) => (
                                        <div key={i}>
                                            <span className="text-[10px] font-[700] text-slate-400 uppercase">{field.label}</span>
                                            <p className="text-sm text-slate-700 mt-0.5">{field.value}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── COMPOSE OUTPUT ──────────────────────── */}
                    {mode === 'compose' && composeResult && (
                        <div className="space-y-5">
                            
                            {/* Scope Guard Warnings */}
                            {composeResult.scopeGuardWarnings?.length > 0 && (
                                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                                    <h4 className="text-[10px] font-[700] text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <i className="ph-bold ph-shield-warning"></i> Scope Guard
                                    </h4>
                                    <ul className="space-y-1.5">
                                        {composeResult.scopeGuardWarnings.map((w: string, i: number) => (
                                            <li key={i} className="text-xs text-amber-800 flex items-start gap-2">
                                                <i className="ph-bold ph-warning text-amber-500 mt-0.5 shrink-0"></i>
                                                {w}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Confidence Booster */}
                            {composeResult.confidenceBoosts?.length > 0 && (
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                                    <h4 className="text-[10px] font-[700] text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <i className="ph-bold ph-trophy"></i> Confidence Booster
                                    </h4>
                                    <ul className="space-y-1.5">
                                        {composeResult.confidenceBoosts.map((b: string, i: number) => (
                                            <li key={i} className="text-xs text-blue-800 flex items-start gap-2">
                                                <i className="ph-bold ph-arrow-fat-up text-blue-500 mt-0.5 shrink-0"></i>
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Variants */}
                            {composeResult.variants?.map((variant: string, idx: number) => (
                                <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-[600] text-slate-500 uppercase tracking-wider">
                                                {composeResult.escalationLabels ? composeResult.escalationLabels[idx] : `Option ${idx + 1}`}
                                            </span>
                                            {composeResult.riskScores?.[idx] && (
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${riskColor(composeResult.riskScores[idx])}`}>
                                                    {riskLabel(composeResult.riskScores[idx])} ({composeResult.riskScores[idx]}/10)
                                                </span>
                                            )}
                                        </div>
                                        <button 
                                            onClick={() => copyToClipboard(variant, idx)}
                                            className="text-slate-400 hover:text-indigo-600 p-1.5 hover:bg-indigo-50 rounded-md transition-colors"
                                        >
                                            <i className={`ph-bold ${copiedIdx === idx ? 'ph-check' : 'ph-copy'} text-lg`}></i>
                                        </button>
                                    </div>
                                    <div 
                                        className="p-5 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-[450] outline-none"
                                        contentEditable
                                        suppressContentEditableWarning
                                    >
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
