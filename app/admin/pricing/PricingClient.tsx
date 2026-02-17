"use client";

import { useState } from "react";
import { togglePlanStatus, updatePlanPrice } from "../subscription/actions";

export default function PricingClient({ plans }: { plans: any[] }) {
    const [isLoading, setIsLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editPrice, setEditPrice] = useState<string>("");

    const handleToggle = async (id: string, currentStatus: boolean) => {
        setIsLoading(true);
        try {
            await togglePlanStatus(id, !currentStatus);
        } catch (err) {
            alert("Failed to update status");
        } finally {
            setIsLoading(false);
        }
    };

    const startEdit = (plan: any) => {
        setEditingId(plan.id);
        setEditPrice(plan.price.toString());
    };

    const savePrice = async (id: string) => {
        setIsLoading(true);
        try {
            await updatePlanPrice(id, parseFloat(editPrice));
            setEditingId(null);
        } catch (err) {
            alert("Failed to update price");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                 <h1 className="text-2xl font-bold text-slate-900">Pricing Plans</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div key={plan.id} className={`bg-white border rounded-xl p-6 shadow-sm relative ${!plan.is_active ? 'opacity-75 bg-slate-50' : 'border-slate-200'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">{plan.name}</h3>
                                <p className="text-sm text-slate-500 capitalize">{plan.interval}ly</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${plan.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                {plan.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        
                        <div className="mb-6">
                             {editingId === plan.id ? (
                                 <div className="flex items-center gap-2">
                                     <span className="text-xl font-bold text-slate-900">$</span>
                                     <input 
                                        type="number" 
                                        value={editPrice}
                                        onChange={(e) => setEditPrice(e.target.value)}
                                        className="w-24 p-1 border rounded text-lg font-bold"
                                        autoFocus
                                     />
                                     <button onClick={() => savePrice(plan.id)} disabled={isLoading} className="text-emerald-600 hover:text-emerald-700"><i className="ph-bold ph-check"></i></button>
                                     <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600"><i className="ph-bold ph-x"></i></button>
                                 </div>
                             ) : (
                                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => startEdit(plan)} title="Click to edit price">
                                    <p className="text-3xl font-bold text-slate-900">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(plan.price)}
                                    </p>
                                    <i className="ph-fill ph-pencil-simple text-slate-300 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all"></i>
                                </div>
                             )}
                        </div>
                        
                        <div className="space-y-2 mb-6 min-h-[100px]">
                            {plan.features?.map((feat: string, i: number) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                    <i className="ph-fill ph-check-circle text-indigo-500"></i>
                                    {feat}
                                </div>
                            ))}
                        </div>
                        
                        <div className="border-t border-slate-100 pt-4 mt-auto">
                            <button 
                                onClick={() => handleToggle(plan.id, plan.is_active)}
                                disabled={isLoading}
                                className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                                    plan.is_active 
                                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                }`}
                            >
                                {plan.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
