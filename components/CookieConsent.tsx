"use client";

import { useState, useEffect } from 'react';

export default function CookieConsent() {
    const [showConsent, setShowConsent] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('biondesk_cookie_consent');
        if (!consent) {
            // Show after a small delay
            const timer = setTimeout(() => {
                setShowConsent(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('biondesk_cookie_consent', 'true');
        setShowConsent(false);
    };

    const handleDecline = () => {
        localStorage.setItem('biondesk_cookie_consent', 'false');
        setShowConsent(false);
    };

    if (!showConsent) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 m-4 md:m-8 flex justify-center animate-fade-in-up">
            <div className="bg-dark-900 text-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-xl w-full flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border border-white/10">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <i className="ph-fill ph-cookie text-amber-400 text-xl"></i>
                        <h3 className="font-bold text-lg">Cookie Consent</h3>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        We use cookies to improve your experience and analyze our traffic. By clicking "Accept", you agree to our use of cookies as described in our <a href="/cookie" className="text-white underline hover:no-underline">Cookie Policy</a>.
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={handleDecline}
                        className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                    >
                        Decline
                    </button>
                    <button 
                        onClick={handleAccept}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-white text-dark-900 rounded-full text-sm font-bold hover:bg-slate-200 transition-colors shadow-lg"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
