"use client";

import { useState } from "react";
import { updateTrialSettings } from "../subscription/actions";

export default function AdminSettingsPage({ settings }: { settings: { days: number } }) {
    const [days, setDays] = useState(settings?.days || 7);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await updateTrialSettings(Number(days));
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
            
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Trial Configuration</h2>
                <div className="space-y-4">
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
                    
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
}
