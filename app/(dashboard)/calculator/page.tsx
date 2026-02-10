
'use client';

import { useState } from 'react';

export default function CalculatorPage() {
    const [hourlyRate, setHourlyRate] = useState<number>(50);
    const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');
    const [manualSubTab, setManualSubTab] = useState<'simple' | 'dates'>('simple');
    
    // Manual - Simple
    const [simpleHours, setSimpleHours] = useState<number>(0);

    // Manual - Date Range
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [workWeekends, setWorkWeekends] = useState<boolean>(false);
    const [weekdayHours, setWeekdayHours] = useState<number>(8);
    const [weekendHours, setWeekendHours] = useState<number>(4);

    // AI
    const [aiDescription, setAiDescription] = useState<string>('');
    const [aiUserContext, setAiUserContext] = useState<string>('');
    const [aiHourlyRate, setAiHourlyRate] = useState<string>(''); // Added state for AI hourly rate
    const [aiLoading, setAiLoading] = useState<boolean>(false);
    const [aiResult, setAiResult] = useState<any>(null);

    // Calculations
    const simpleTotal = hourlyRate * simpleHours;

    const calculateDateRange = () => {
        if (!startDate || !endDate) return null;
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Reset times to start of day for accurate day diff
        start.setHours(0,0,0,0);
        end.setHours(0,0,0,0);

        if (end < start) return null;

        let totalWeekdays = 0;
        let totalWeekends = 0;
        let current = new Date(start);

        while (current <= end) {
            const day = current.getDay();
            if (day === 0 || day === 6) { // 0 is Sunday, 6 is Saturday
                totalWeekends++;
            } else {
                totalWeekdays++;
            }
            current.setDate(current.getDate() + 1);
        }

        const totalHours = (totalWeekdays * weekdayHours) + (workWeekends ? (totalWeekends * weekendHours) : 0);
        const totalCost = totalHours * hourlyRate;

        return { totalWeekdays, totalWeekends, totalHours, totalCost };
    };

    const dateRangeResult = calculateDateRange();

    const handleAiGenerate = async () => {
        if (!aiDescription) return;
        setAiLoading(true);
        setAiResult(null);
        try {
            const res = await fetch('/api/calculator/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description: aiDescription,
                    userContext: aiUserContext,
                    hourlyRate: aiHourlyRate ? Number(aiHourlyRate) : undefined // Send hourly rate if present
                })
            });
            const data = await res.json();
            if (data.estimate) {
                setAiResult(data.estimate);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2 mb-6">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Project Cost Calculator</h2>
            </div>
            
            {/* Main Tabs */}
            <div className="bg-slate-100 p-1 rounded-lg inline-flex mb-6">
                <button 
                    onClick={() => setActiveTab('manual')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                >
                    <i className="ph ph-calculator text-lg"></i> Manual Calculation
                </button>
                <button 
                    onClick={() => setActiveTab('ai')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'ai' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                >
                    <i className="ph ph-brain text-lg"></i> AI Assistant
                </button>
            </div>

            {activeTab === 'manual' && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-lg font-semibold text-slate-900">Configuration</h3>
                            <p className="text-sm text-slate-500">Set your rates and project parameters.</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">Hourly Rate ($)</label>
                                <div className="relative">
                                    <i className="ph ph-currency-dollar absolute left-3 top-2.5 text-slate-400 text-lg"></i>
                                    <input 
                                        type="number" 
                                        value={hourlyRate} 
                                        onChange={(e) => setHourlyRate(Number(e.target.value))} 
                                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div className="w-full border border-slate-200 rounded-lg p-4 bg-slate-50">
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <button 
                                        onClick={() => setManualSubTab('simple')}
                                        className={`py-2 text-sm font-medium rounded-lg transition-colors ${manualSubTab === 'simple' ? 'bg-white shadow border border-slate-200 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
                                    >
                                        Simple (Hours)
                                    </button>
                                    <button 
                                        onClick={() => setManualSubTab('dates')}
                                        className={`py-2 text-sm font-medium rounded-lg transition-colors ${manualSubTab === 'dates' ? 'bg-white shadow border border-slate-200 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
                                    >
                                        Date Range
                                    </button>
                                </div>
                                
                                {manualSubTab === 'simple' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-900">Estimated Hours</label>
                                        <input 
                                            type="number" 
                                            value={simpleHours} 
                                            onChange={(e) => setSimpleHours(Number(e.target.value))} 
                                            placeholder="e.g. 20" 
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                )}

                                {manualSubTab === 'dates' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-900">Start Date</label>
                                                <input 
                                                    type="date" 
                                                    value={startDate} 
                                                    onChange={(e) => setStartDate(e.target.value)} 
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-900">End Date</label>
                                                <input 
                                                    type="date" 
                                                    value={endDate} 
                                                    onChange={(e) => setEndDate(e.target.value)} 
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="weekend-mode"
                                                    checked={workWeekends}
                                                    onChange={(e) => setWorkWeekends(e.target.checked)}
                                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 transition-all checked:border-indigo-600 checked:bg-indigo-600 hover:border-indigo-400"
                                                />
                                                <i className="ph-bold ph-check absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-white opacity-0 peer-checked:opacity-100 pointer-events-none"></i>
                                            </div>
                                            <label htmlFor="weekend-mode" className="text-sm font-medium text-slate-700 cursor-pointer select-none">Work on Weekends?</label>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-900">Hours per Weekday</label>
                                                <input 
                                                    type="number" 
                                                    value={weekdayHours} 
                                                    onChange={(e) => setWeekdayHours(Number(e.target.value))} 
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                            </div>
                                            {workWeekends && (
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-900">Hours per Weekend Day</label>
                                                    <input 
                                                        type="number" 
                                                        value={weekendHours} 
                                                        onChange={(e) => setWeekendHours(Number(e.target.value))} 
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm h-fit">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-lg font-semibold text-slate-900">Estimate Result</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            {manualSubTab === 'dates' && startDate && endDate ? (
                                dateRangeResult ? (
                                    <>
                                         <div className="flex items-center justify-between">
                                            <span className="text-slate-500">Duration</span>
                                            <span className="font-semibold text-slate-900">{dateRangeResult.totalWeekdays + dateRangeResult.totalWeekends} Days</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500">Weekdays ({dateRangeResult.totalWeekdays})</span>
                                            <span className="text-slate-900">{dateRangeResult.totalWeekdays * weekdayHours} hrs</span>
                                        </div>
                                        {workWeekends && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500">Weekends ({dateRangeResult.totalWeekends})</span>
                                                <span className="text-slate-900">{dateRangeResult.totalWeekends * weekendHours} hrs</span>
                                            </div>
                                        )}
                                        <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                                            <span className="text-lg font-bold text-slate-900">Total Hours</span>
                                            <span className="text-lg font-bold text-slate-900">{dateRangeResult.totalHours} hrs</span>
                                        </div>
                                        <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-lg">
                                            <span className="text-lg font-bold text-indigo-700">Total Cost</span>
                                            <span className="text-2xl font-bold text-indigo-700">${dateRangeResult.totalCost.toLocaleString()}</span>
                                        </div>
                                    </>
                                ) : <p className="text-slate-500 text-center">Invalid date range</p>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Hourly Rate</span>
                                        <span className="font-semibold text-slate-900">${hourlyRate}/hr</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Hours</span>
                                        <span className="font-semibold text-slate-900">{simpleHours} hrs</span>
                                    </div>
                                    <div className="border-t border-slate-200 pt-4 flex items-center justify-between bg-indigo-50 p-4 rounded-lg mt-4">
                                        <span className="text-lg font-bold text-indigo-700">Total Cost</span>
                                        <span className="text-2xl font-bold text-indigo-700">${simpleTotal.toLocaleString()}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'ai' && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm h-fit">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-lg font-semibold text-slate-900">AI Estimator</h3>
                            <p className="text-sm text-slate-500">Describe your project and let AI suggest cost and timeline.</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">Project Description</label>
                                <textarea 
                                    placeholder="e.g. Build a Shopify-like e-commerce store with user authentication, product management, and Stripe integration."
                                    rows={6}
                                    value={aiDescription}
                                    onChange={(e) => setAiDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">Your Expertise / Context (Optional)</label>
                                <textarea
                                    placeholder="e.g. I am a Senior Full Stack Developer with 5 years experience in React and Node.js."
                                    rows={3}
                                    value={aiUserContext}
                                    onChange={(e) => setAiUserContext(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">Hourly Rate (Optional)</label>
                                <div className="relative">
                                    <i className="ph ph-currency-dollar absolute left-3 top-2.5 text-slate-400 text-lg"></i>
                                    <input
                                        type="number"
                                        placeholder="e.g. 50"
                                        value={aiHourlyRate}
                                        onChange={(e) => setAiHourlyRate(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <p className="text-xs text-slate-500">If left blank, AI will suggest a rate based on the project type.</p>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                            <button 
                                onClick={handleAiGenerate} 
                                disabled={aiLoading || !aiDescription}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {aiLoading ? (
                                    <><i className="ph ph-spinner animate-spin mr-2 text-xl"></i> Generating...</>
                                 ) : (
                                    <><i className="ph ph-magic-wand mr-2 text-xl"></i> Generate Estimate</>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-slate-50/50 rounded-xl border border-slate-200 border-dashed p-6 min-h-[400px]">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-slate-900">AI Suggestion</h3>
                        </div>
                        
                        {aiResult ? (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                        <div className="text-sm text-slate-500">Estimated Hours</div>
                                        <div className="text-2xl font-bold text-indigo-600">{aiResult.estimated_hours} hrs</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                        <div className="text-sm text-slate-500">Timeline</div>
                                        <div className="text-2xl font-bold text-indigo-600">{aiResult.suggested_timeline}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                        <div className="text-sm text-slate-500">Hourly Range</div>
                                        <div className="text-lg font-semibold text-slate-900">{aiResult.hourly_rate_range}</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                        <div className="text-sm text-slate-500">Fixed Price Range</div>
                                        <div className="text-lg font-semibold text-slate-900">{aiResult.fixed_price_range}</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm text-slate-900">Rationale</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">{aiResult.rationale}</p>
                                </div>

                                {aiResult.breakdown && (
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-sm text-slate-900">Breakdown</h4>
                                        <ul className="space-y-2">
                                            {aiResult.breakdown.map((item: any, i: number) => (
                                                <li key={i} className="flex justify-between text-sm bg-white p-3 rounded-lg border border-slate-200">
                                                    <span className="text-slate-700">{item.phase}</span>
                                                    <span className="font-medium text-slate-900">{item.hours} hrs</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 py-12">
                                <i className="ph ph-brain text-6xl opacity-20"></i>
                                <p>Enter project details to generate an estimate.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
