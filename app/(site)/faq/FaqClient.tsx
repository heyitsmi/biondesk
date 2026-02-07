"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "../../public.css";

export default function FaqClient() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    // Icons
    if ((window as any).lucide) {
      (window as any).lucide.createIcons();
    }
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqData = [
    {
        section: "General",
        icon: "sparkles",
        items: [
            { q: "What exactly is Biondesk?", a: "Biondesk is an all-in-one workspace designed for freelancers and small studios. It replaces multiple tools (like Trello, Google Docs, and invoicing software) with one clean desk to manage leads, projects, and payments." },
            { q: "Is there a mobile app?", a: "Currently, Biondesk is a web application optimized for mobile browsers. You can access your desk from any device, and it looks great on your phone. A dedicated native app is on our roadmap." }
        ]
    },
    {
        section: "Features & Usage",
        icon: "layers",
        items: [
            { q: "Can I customize my invoices?", a: "Yes! You can add your logo, change accent colors, and set default terms. Biondesk invoices are designed to look professional and build trust with your clients out of the box." },
            { q: "How do automated follow-ups work?", a: "When an invoice is overdue, Biondesk can send a polite email reminder to your client on your behalf. You can customize the timing (e.g., 3 days after due date) and the message template." },
            { q: "Can I export my data?", a: "Absolutely. Your data belongs to you. You can export all your invoices, client lists, and project data as CSV files at any time from the settings menu." }
        ]
    },
    {
        section: "Billing & Pricing",
        icon: "credit-card",
        items: [
            { q: "Do I need a credit card for the trial?", a: "No. You can sign up and use all features for 14 days without entering any payment information. We only ask for payment when you decide to continue after the trial." },
            { q: "What happens if I cancel?", a: "There are no lock-in contracts. If you cancel, your account will remain active until the end of your current billing cycle. After that, your data will be kept safe for 30 days in case you change your mind." }
        ]
    }
  ];

  return (
    <div className="flex-grow pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">Common questions.</h1>
                    <p className="text-lg text-slate-600">
                        Everything you need to know about the product and billing.
                    </p>
                </div>

                <div className="space-y-16">
                    {faqData.map((section, sIndex) => (
                        <div key={sIndex}>
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <i data-lucide={section.icon} className="w-5 h-5 text-indigo-500"></i> {section.section}
                            </h2>
                            <div className="space-y-4">
                                {section.items.map((item, iIndex) => {
                                    const index = sIndex * 100 + iIndex; // Simple unique ID generation
                                    return (
                                        <div key={iIndex} className={`faq-item group bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-slate-300 ${activeFaq === index ? 'active' : ''}`}>
                                            <button onClick={() => toggleFaq(index)} className="w-full flex items-center justify-between p-6 text-left focus:outline-none">
                                                <span className="font-semibold text-slate-900">{item.q}</span>
                                                <i data-lucide="chevron-down" className="faq-icon w-5 h-5 text-slate-400 transition-transform duration-300"></i>
                                            </button>
                                            <div className="faq-answer px-6">
                                                <p className="text-slate-600 pb-6 leading-relaxed">{item.a}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still have questions? */}
                <div className="mt-20 text-center p-8 bg-indigo-50 rounded-3xl border border-indigo-100">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Still have questions?</h3>
                    <p className="text-slate-600 mb-8 max-w-lg mx-auto">Can’t find the answer you’re looking for? Please chat to our friendly team.</p>
                    <Link href="/support" className="inline-flex items-center justify-center bg-slate-900 text-white font-medium px-6 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 gap-2">
                        Get in touch
                    </Link>
                </div>

            </div>
    </div>
  );
}
