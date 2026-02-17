"use client";

import { useState } from "react";
import { updateTrialSettings, updateExchangeRate } from "../subscription/actions";

export default function AdminSettingsPage({ settings }: { settings: any }) {
    const [days, setDays] = useState(settings?.trial?.days || 7);
    const [rate, setRate] = useState(settings?.exchange?.rate || 16000);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                updateTrialSettings(Number(days)),
                updateExchangeRate(Number(rate))
            ]);
            alert("Settings updated!");
        } catch (err) {
            alert("Failed to update settings");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
            
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-8">
                {/* Trial Section */}
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Trial Configuration</h2>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Default Trial Duration (Days)
                        </label>
                        <p className="text-xs text-slate-500 mb-2">
                             New users will automatically receive a trial subscription for this many days upon registration.
                        </p>
                        <input 
                            type="number"
                            value={days}
                            onChange={(e) => setDays(Number(e.target.value))}
                            className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                            min="1"
                        />
                    </div>
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Exchange Rate Section */}
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Payment Configuration</h2>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            USD to IDR Exchange Rate
                        </label>
                        <p className="text-xs text-slate-500 mb-2">
                             Fixed exchange rate used for converting USD plan prices to IDR for Midtrans payments.
                        </p>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <span className="text-slate-500 text-sm">Rp</span>
                            </div>
                            <input 
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(Number(e.target.value))}
                                className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
                                min="1"
                            />
                        </div>
                         <p className="text-xs text-slate-500 mt-2">
                            Example: If set to 16,000, a $15 plan will cost Rp 240,000.
                        </p>
                    </div>
                </div>
                
                <div className="pt-4">
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : 'Save All Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
}
