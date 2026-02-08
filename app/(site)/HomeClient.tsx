"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "../public.css"; // Keep for now if needed, or rely on layout

export default function HomeClient() {
  const [isYearly, setIsYearly] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    // Icons
    if ((window as any).lucide) {
      (window as any).lucide.createIcons();
    }

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach((element) => {
        observer.observe(element);
    });

    return () => {
        observer.disconnect();
    };
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <>
        {/* HERO SECTION */}
        <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
                
                {/* Badge */}
                <div className="reveal-on-scroll inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm mb-8">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Public Beta Access</span>
                </div>

                {/* Headline */}
                <h1 className="reveal-on-scroll text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-slate-900 mb-6 text-balance leading-[1.1]">
                    Run client work. <br />
                    <span className="text-slate-400">End-to-end.</span> One desk.
                </h1>

                {/* Subheadline */}
                <p className="reveal-on-scroll delay-100 max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed text-balance">
                    Capture leads, send proposals, get paid, and keep work moving. 
                    Everything you need to run your business, without the tab fatigue.
                </p>

                {/* CTA Group */}
                <div className="reveal-on-scroll delay-200 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/register" className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 group">
                        Create your workspace
                        <i data-lucide="arrow-right" className="w-4 h-4 transition-transform group-hover:translate-x-1"></i>
                    </Link>
                    <a href="#how-it-works" className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                        <i data-lucide="play-circle" className="w-4 h-4"></i>
                        See the desk
                    </a>
                </div>

                {/* Abstract UI Visualization (Pure CSS/HTML - No Images) */}
                <div className="reveal-on-scroll delay-300 mt-20 relative max-w-5xl mx-auto perspective-1000">
                    {/* Main Dashboard Plate */}
                    <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden aspect-[16/10] md:aspect-[16/9] transform rotate-x-12 transition-transform duration-700 hover:rotate-0">
                        
                        {/* Sidebar */}
                        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-64 border-r border-slate-100 bg-slate-50/50 p-4 flex flex-col gap-4">
                            <div className="h-8 w-8 rounded-lg bg-slate-200 mb-4"></div>
                            <div className="h-4 w-2/3 rounded bg-slate-200/50"></div>
                            <div className="h-4 w-3/4 rounded bg-slate-200/50"></div>
                            <div className="h-4 w-1/2 rounded bg-slate-200/50"></div>
                            
                            <div className="mt-auto">
                                <div className="h-10 w-full rounded-lg bg-white border border-slate-200 shadow-sm"></div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="absolute left-16 md:left-64 right-0 top-0 bottom-0 p-6 md:p-8 bg-white">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex flex-col gap-2">
                                    <div className="h-6 w-48 bg-slate-900 rounded-md"></div>
                                    <div className="h-4 w-32 bg-slate-200 rounded-md"></div>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-slate-100"></div>
                            </div>

                            {/* Kanban/Grid Mockup */}
                            <div className="grid grid-cols-3 gap-4 md:gap-6">
                                {/* Column 1 */}
                                <div className="flex flex-col gap-3">
                                    <div className="h-4 w-20 bg-slate-100 rounded mb-2"></div>
                                    <div className="p-3 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col gap-2">
                                        <div className="h-3 w-3/4 bg-slate-800 rounded"></div>
                                        <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
                                    </div>
                                    <div className="p-3 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col gap-2">
                                        <div className="h-3 w-3/4 bg-slate-800 rounded"></div>
                                        <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
                                    </div>
                                </div>
                                {/* Column 2 */}
                                <div className="flex flex-col gap-3">
                                    <div className="h-4 w-20 bg-slate-100 rounded mb-2"></div>
                                    <div className="p-3 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col gap-2">
                                        <div className="h-3 w-full bg-slate-800 rounded"></div>
                                        <div className="h-16 w-full bg-slate-50 rounded border border-dashed border-slate-200"></div>
                                    </div>
                                </div>
                                {/* Column 3 */}
                                <div className="flex flex-col gap-3 opacity-50">
                                    <div className="h-4 w-20 bg-slate-100 rounded mb-2"></div>
                                    <div className="p-3 rounded-xl border border-slate-100 bg-white shadow-sm"></div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Card Notification */}
                        <div className="absolute bottom-8 right-8 bg-slate-900 text-white p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-float">
                            <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                                <i data-lucide="check" className="text-white w-6 h-6"></i>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-slate-300">Invoice #1024</div>
                                <div className="text-lg font-bold">Paid $2,400.00</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decor gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50/50 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        </header>

        {/* TESTIMONIAL MARQUEE SECTION */}
        <section className="py-24 bg-slate-50 border-y border-slate-200 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 text-center mb-12">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Community</h2>
                <p className="text-2xl font-semibold text-slate-900">Loved by independent workers</p>
            </div>

            {/* Row 1: Left Scroll */}
            <div className="marquee-mask relative flex overflow-x-hidden mb-8">
                <div className="animate-marquee whitespace-nowrap flex items-center">
                    {/* Set of cards */}
                    <div className="flex gap-6 pr-6">
                         {[
                            { initial: "JS", bg: "bg-indigo-100", text: "text-indigo-700", name: "James Smith", role: "Freelance Developer", quote: "Finally, a tool that doesn't feel like enterprise software. It's clean, fast, and does exactly what I need." },
                            { initial: "EL", bg: "bg-emerald-100", text: "text-emerald-700", name: "Elena Liu", role: "Brand Designer", quote: "The invoice generator is a lifesaver. My clients actually compliment how professional my bills look now." },
                            { initial: "MK", bg: "bg-orange-100", text: "text-orange-700", name: "Marcus King", role: "Marketing Consultant", quote: "I stopped using Trello and three other apps. Biondesk handles the flow from lead to cash perfectly." },
                            { initial: "SA", bg: "bg-blue-100", text: "text-blue-700", name: "Sarah Al-Fayed", role: "Copywriter", quote: "Zero bloat. Just the features you need to run a solo business. Highly recommended." }
                        ].map((t, i) => (
                             <div key={i} className="w-[320px] bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 whitespace-normal flex-shrink-0">
                                <p className="text-slate-600 leading-relaxed text-sm">"{t.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full ${t.bg} flex items-center justify-center ${t.text} font-bold text-xs`}>{t.initial}</div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">{t.name}</div>
                                        <div className="text-xs text-slate-500">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                     {/* Duplicate Set for infinite loop */}
                     <div className="flex gap-6 pr-6">
                         {[
                            { initial: "JS", bg: "bg-indigo-100", text: "text-indigo-700", name: "James Smith", role: "Freelance Developer", quote: "Finally, a tool that doesn't feel like enterprise software. It's clean, fast, and does exactly what I need." },
                            { initial: "EL", bg: "bg-emerald-100", text: "text-emerald-700", name: "Elena Liu", role: "Brand Designer", quote: "The invoice generator is a lifesaver. My clients actually compliment how professional my bills look now." },
                            { initial: "MK", bg: "bg-orange-100", text: "text-orange-700", name: "Marcus King", role: "Marketing Consultant", quote: "I stopped using Trello and three other apps. Biondesk handles the flow from lead to cash perfectly." },
                            { initial: "SA", bg: "bg-blue-100", text: "text-blue-700", name: "Sarah Al-Fayed", role: "Copywriter", quote: "Zero bloat. Just the features you need to run a solo business. Highly recommended." }
                        ].map((t, i) => (
                             <div key={`dup-${i}`} className="w-[320px] bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 whitespace-normal flex-shrink-0">
                                <p className="text-slate-600 leading-relaxed text-sm">"{t.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full ${t.bg} flex items-center justify-center ${t.text} font-bold text-xs`}>{t.initial}</div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">{t.name}</div>
                                        <div className="text-xs text-slate-500">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Row 2: Right Scroll (Reverse) */}
            <div className="marquee-mask relative flex overflow-x-hidden">
                <div className="animate-marquee-reverse whitespace-nowrap flex items-center">
                    {/* Set of cards */}
                    <div className="flex gap-6 pr-6">
                        {[
                            { initial: "DR", bg: "bg-purple-100", text: "text-purple-700", name: "David Ross", role: "Video Editor", quote: "I was drowning in spreadsheets. Biondesk organized my entire client pipeline in one afternoon." },
                            { initial: "JN", bg: "bg-pink-100", text: "text-pink-700", name: "Jessica Ng", role: "Illustrator", quote: "The automated follow-ups are gold. I got paid for a 3-month overdue invoice without lifting a finger." },
                            { initial: "TM", bg: "bg-slate-200", text: "text-slate-700", name: "Tom Miller", role: "SEO Specialist", quote: "Simple, elegant, and effective. It's the only tab I keep open all day." },
                            { initial: "AK", bg: "bg-cyan-100", text: "text-cyan-700", name: "Anna Kim", role: "Social Media Manager", quote: "Best investment for my solo agency. The proposal to invoice flow is seamless." }
                        ].map((t, i) => (
                            <div key={i} className="w-[320px] bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 whitespace-normal flex-shrink-0">
                                <p className="text-slate-600 leading-relaxed text-sm">"{t.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full ${t.bg} flex items-center justify-center ${t.text} font-bold text-xs`}>{t.initial}</div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">{t.name}</div>
                                        <div className="text-xs text-slate-500">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Duplicate Set */}
                    <div className="flex gap-6 pr-6">
                         {[
                            { initial: "DR", bg: "bg-purple-100", text: "text-purple-700", name: "David Ross", role: "Video Editor", quote: "I was drowning in spreadsheets. Biondesk organized my entire client pipeline in one afternoon." },
                            { initial: "JN", bg: "bg-pink-100", text: "text-pink-700", name: "Jessica Ng", role: "Illustrator", quote: "The automated follow-ups are gold. I got paid for a 3-month overdue invoice without lifting a finger." },
                            { initial: "TM", bg: "bg-slate-200", text: "text-slate-700", name: "Tom Miller", role: "SEO Specialist", quote: "Simple, elegant, and effective. It's the only tab I keep open all day." },
                            { initial: "AK", bg: "bg-cyan-100", text: "text-cyan-700", name: "Anna Kim", role: "Social Media Manager", quote: "Best investment for my solo agency. The proposal to invoice flow is seamless." }
                        ].map((t, i) => (
                            <div key={`dup-${i}`} className="w-[320px] bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 whitespace-normal flex-shrink-0">
                                <p className="text-slate-600 leading-relaxed text-sm">"{t.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full ${t.bg} flex items-center justify-center ${t.text} font-bold text-xs`}>{t.initial}</div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">{t.name}</div>
                                        <div className="text-xs text-slate-500">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                         ))}
                    </div>
                </div>
            </div>
        </section>

        {/* BENTO GRID FEATURES */}
        <section id="features" className="py-32 relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="max-w-2xl mb-16 reveal-on-scroll">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">Built for the business of creativity.</h2>
                    <p className="text-xl text-slate-600">Stop stitching together 5 different apps. Biondesk is the operating system for your service business.</p>
                </div>

                {/* The Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
                    
                    {/* Card 1: Lead Desk (Large) */}
                    <div className="md:col-span-2 rounded-3xl bg-white border border-slate-200 p-8 md:p-10 relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 reveal-on-scroll flex flex-col md:block">
                        <div className="relative z-10 max-w-md">
                            <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                                <i data-lucide="users" className="w-6 h-6"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Lead & Opportunity Desk</h3>
                            <p className="text-slate-600 text-lg">Centralize incoming inquiries. Convert them to active opportunities with one click. Never lose a potential client in your email threads again.</p>
                        </div>
                        {/* Visual Decor */}
                        <div className="relative md:absolute right-[-20px] bottom-[-20px] w-64 h-64 bg-slate-50 rounded-tl-3xl border-t border-l border-slate-100 group-hover:scale-105 transition-transform self-end mt-6 md:mt-0">
                            <div className="p-6 space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <div className="text-xs font-medium text-slate-700">New lead from Website</div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm opacity-60">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                    <div className="text-xs font-medium text-slate-700">Proposal Sent</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Documents */}
                    <div className="md:col-span-1 rounded-3xl bg-slate-900 text-white p-8 relative overflow-hidden group reveal-on-scroll delay-100">
                        <div className="relative z-10">
                            <div className="h-12 w-12 rounded-xl bg-slate-800 text-white flex items-center justify-center mb-6">
                                <i data-lucide="file-text" className="w-6 h-6"></i>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Smart Docs</h3>
                            <p className="text-slate-400">Proposals, Quotes, Invoices. Generated in seconds, not hours.</p>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/0 to-slate-800/50 pointer-events-none"></div>
                    </div>

                    {/* Card 3: Tasks */}
                    <div className="md:col-span-1 rounded-3xl bg-white border border-slate-200 p-8 relative overflow-hidden group hover:border-slate-300 transition-colors reveal-on-scroll">
                        <div className="h-12 w-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6">
                            <i data-lucide="check-square" className="w-6 h-6"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">Task Delivery</h3>
                        <p className="text-slate-600">A clean Kanban board focused on moving work forward, not complex project management.</p>
                    </div>

                    {/* Card 4: Get Paid (Large) */}
                    <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-8 md:p-10 relative overflow-hidden group reveal-on-scroll delay-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="max-w-sm">
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Automated Follow-ups</h3>
                                <p className="text-slate-600 text-lg">Biondesk nudges your clients for payment so you don't have to exist in awkward email threads.</p>
                            </div>
                            <div className="relative">
                                <div className="bg-white p-4 rounded-xl shadow-lg border border-indigo-50 transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                                    <div className="flex items-center gap-3 mb-2">
                                        <i data-lucide="bell" className="w-4 h-4 text-indigo-600"></i>
                                        <span className="text-xs font-bold text-slate-800">Reminder Sent</span>
                                    </div>
                                    <div className="text-xs text-slate-500">"Just bumping this invoice..."</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-24 relative overflow-hidden bg-slate-50 border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                
                <div className="text-center max-w-2xl mx-auto mb-16 reveal-on-scroll">
                    <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">Simple, transparent pricing.</h2>
                    <p className="text-lg text-slate-600">Everything you need to run your business. No hidden fees. No complicated tiers.</p>
                </div>

                {/* Toggle */}
                <div className="flex justify-center items-center gap-4 mb-12 reveal-on-scroll delay-100">
                    <span className={`text-sm font-medium ${!isYearly ? 'text-indigo-900' : 'text-slate-600'}`} id="monthly-label">Monthly</span>
                    <button 
                        onClick={() => setIsYearly(!isYearly)}
                        id="billing-toggle" 
                        className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 ${isYearly ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                        <div id="toggle-circle" className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${isYearly ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                    <span className={`text-sm font-medium flex items-center gap-2 ${isYearly ? 'text-indigo-900' : 'text-slate-900'}`} id="yearly-label">
                        Yearly 
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">Save 20%</span>
                    </span>
                </div>

                {/* Pricing Card (Single Focus) */}
                <div className="max-w-lg mx-auto reveal-on-scroll delay-200">
                    <div className="relative bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                        <div className="p-8 md:p-10">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Pro Desk</h3>
                                    <p className="text-slate-500 text-sm mt-1">For freelancers & solo founders.</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-baseline justify-end gap-1">
                                        <span className="text-4xl font-bold tracking-tight text-slate-900" id="price-display">{isYearly ? '$15' : '$19'}</span>
                                        <span className="text-slate-500 font-medium text-sm">/mo</span>
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1" id="billing-text">{isYearly ? 'Billed $180 yearly' : 'Billed monthly'}</div>
                                </div>
                            </div>

                            <hr className="border-slate-100 mb-8" />

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3 text-slate-600">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mt-0.5">
                                        <i data-lucide="check" className="w-3 h-3"></i>
                                    </div>
                                    <span>Unlimited Leads & Opportunities</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-600">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mt-0.5">
                                        <i data-lucide="check" className="w-3 h-3"></i>
                                    </div>
                                    <span>Smart Proposals & Contracts</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-600">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mt-0.5">
                                        <i data-lucide="check" className="w-3 h-3"></i>
                                    </div>
                                    <span>Invoicing & Payment Tracking</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-600">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mt-0.5">
                                        <i data-lucide="check" className="w-3 h-3"></i>
                                    </div>
                                    <span>Automated Follow-ups</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-600">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mt-0.5">
                                        <i data-lucide="check" className="w-3 h-3"></i>
                                    </div>
                                    <span>Basic Task Management</span>
                                </li>
                            </ul>

                            <Link href="/register" className="block w-full text-center bg-slate-900 text-white rounded-xl py-4 font-semibold hover:bg-slate-800 transition-all hover:scale-[1.02] shadow-lg shadow-slate-900/10">
                                Start 14-day free trial
                            </Link>
                            <p className="text-center text-xs text-slate-400 mt-4">No credit card required for trial.</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-24 relative">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-12 text-center reveal-on-scroll">Frequently asked questions</h2>

                <div className="space-y-4 reveal-on-scroll delay-100">
                    {/* FAQ Items */}
                    {[
                        { q: "Is there a free trial?", a: "Yes, absolutely. You can try Biondesk fully featured for 14 days. We don't require a credit card to start the trial, so you can explore the desk without any pressure." },
                        { q: "Can I cancel anytime?", a: "Yes. Biondesk is a pay-as-you-go service. There are no long-term contracts for the monthly plan. You can cancel your subscription at any time from your account settings." },
                        { q: "Do you have a plan for teams or agencies?", a: "Currently, Biondesk is optimized for solo workers, freelancers, and very small studios (1-2 people). We are focusing on making the experience perfect for individuals first before adding complex team management features." },
                        { q: "How do I get paid?", a: "Biondesk helps you generate professional invoices that you can send to clients. You can include your own bank details or payment links (like Stripe or PayPal) directly on the invoice. We don't process payments or take a cut of your earnings." }
                    ].map((item, index) => (
                        <div key={index} className={`faq-item group bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-slate-300 ${activeFaq === index ? 'active' : ''}`}>
                            <button onClick={() => toggleFaq(index)} className="w-full flex items-center justify-between p-6 text-left focus:outline-none">
                                <span className="font-semibold text-slate-900">{item.q}</span>
                                <i data-lucide="chevron-down" className="faq-icon w-5 h-5 text-slate-400 transition-transform duration-300"></i>
                            </button>
                            <div className="faq-answer px-6">
                                <p className="text-slate-600 pb-6 leading-relaxed">{item.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* MANIFESTO SECTION (Typography focused) */}
        <section className="py-32 bg-slate-900 text-white">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                <h2 className="reveal-on-scroll text-3xl md:text-5xl font-medium leading-tight mb-12 opacity-90">
                    Most tools are too complex.<br className="hidden md:inline"/>
                    Spreadsheets are too manual.<br className="hidden md:inline"/>
                    <span className="text-indigo-400 block mt-2 md:inline md:mt-0">Biondesk is just right.</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-20">
                    <div className="reveal-on-scroll delay-100 border-l border-slate-700 pl-6">
                        <h4 className="font-bold text-lg mb-2">Calm by design</h4>
                        <p className="text-slate-400 leading-relaxed">No red notification dots everywhere. Just the signal you need.</p>
                    </div>
                    <div className="reveal-on-scroll delay-200 border-l border-slate-700 pl-6">
                        <h4 className="font-bold text-lg mb-2">Client-first</h4>
                        <p className="text-slate-400 leading-relaxed">Documents look professional and build trust instantly.</p>
                    </div>
                    <div className="reveal-on-scroll delay-300 border-l border-slate-700 pl-6">
                        <h4 className="font-bold text-lg mb-2">Fast workflow</h4>
                        <p className="text-slate-400 leading-relaxed">Keyboard friendly. Load instantly. Get in, get out.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-32 relative overflow-hidden">
            <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
                <h2 className="reveal-on-scroll text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 mb-8">
                    Ready to clear<br />your desk?
                </h2>
                <p className="reveal-on-scroll text-xl text-slate-600 mb-10">
                    Join freelancers and founders running a better business.
                </p>
                <div className="reveal-on-scroll flex flex-col sm:flex-row justify-center gap-4">
                    <Link href="/register" className="bg-slate-900 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-slate-800 transition-transform hover:-translate-y-1 shadow-xl">
                        Get Started for Free
                    </Link>
                </div>
            </div>
        </section>
    </>
  );
}
