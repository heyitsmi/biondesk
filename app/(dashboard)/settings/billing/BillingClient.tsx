"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Add Snap type to window
declare global {
    interface Window {
        snap: any;
    }
}

export default function BillingClient({ plans, subscription }: { plans: any[], subscription: any }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const error = searchParams.get('error');
    const [isLoading, setIsLoading] = useState(false);

    // Load Snap Script
    useEffect(() => {
        const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';

        const snapScript = isProduction 
            ? "https://app.midtrans.com/snap/snap.js"
            : "https://app.sandbox.midtrans.com/snap/snap.js";
            
        const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""; 
        
        const script = document.createElement("script");
        script.src = snapScript;
        script.setAttribute("data-client-key", clientKey);
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleSubscribe = async (plan: any) => {
        setIsLoading(true);
        try {
            // 1. Create Transaction
            const res = await fetch('/api/payment/create-transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId: plan.id })
            });

            if (!res.ok) throw new Error("Failed to create transaction");

            const { token, amount_idr, rate } = await res.json();

            // 2. Open Snap
            if (window.snap) {
                window.snap.pay(token, {
                    onSuccess: function(result: any) {
                        alert("Payment successful!");
                        router.refresh();
                        // Ideally redirect to a success page or refetch subscription
                    },
                    onPending: function(result: any) {
                        alert("Waiting for payment...");
                        router.refresh();
                    },
                    onError: function(result: any) {
                        alert("Payment failed!");
                    },
                    onClose: function() {
                        alert('You closed the popup without finishing the payment');
                    }
                });
            } else {
                alert("Payment gateway not loaded yet. Please refresh.");
            }

        } catch (err) {
            console.error(err);
            alert("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-slate-900">Subscription & Billing</h1>

            {error === 'subscription_expired' && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg flex items-center gap-3">
                    <i className="ph-fill ph-warning-circle text-xl"></i>
                    <div>
                        <p className="font-bold">Access Restricted</p>
                        <p className="text-sm">Your subscription or trial has expired. Please upgrade to continue accessing premium features.</p>
                    </div>
                </div>
            )}

            {/* Current Status */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Current Status</h2>
                <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${['active', 'trialing'].includes(subscription?.status) ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                    <div>
                        <p className="text-sm font-medium text-slate-900 capitalize">
                            {subscription?.status || 'No Subscription'}
                        </p>
                        {subscription?.status === 'trialing' && (
                            <p className="text-xs text-slate-500">
                                Trial ends on {new Date(subscription.trial_end).toLocaleDateString()}
                            </p>
                        )}
                         {subscription?.status === 'expired' && (
                            <p className="text-xs text-rose-500">
                                Expired on {new Date(subscription.current_period_end || subscription.trial_end).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {plans.filter(p => p.is_active).map((plan) => (
                    <div key={plan.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-indigo-300 transition-colors">
                        <h3 className="font-bold text-lg text-slate-900">{plan.name}</h3>
                        <p className="text-3xl font-bold text-slate-900 mt-2">
                             {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(plan.price)}
                             <span className="text-sm text-slate-500 font-normal">/{plan.interval}</span>
                        </p>
                         <div className="space-y-2 my-6">
                            {plan.features?.map((feat: string, i: number) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                    <i className="ph-fill ph-check-circle text-indigo-500"></i>
                                    {feat}
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={() => handleSubscribe(plan)}
                            disabled={isLoading}
                            className="w-full py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Processing...' : 'Subscribe Now'}
                        </button>
                    </div>
                 ))}
            </div>
            
            <p className="text-center text-sm text-slate-500">
                Secure payment processed by Midtrans.
            </p>
        </div>
    );
}
