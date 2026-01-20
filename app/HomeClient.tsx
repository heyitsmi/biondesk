"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomeClient({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Staggered Reveal Logic
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('active');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal-item').forEach(el => {
            observer.observe(el);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* 1. Floating Glass Navbar */}
            <nav className="fixed top-4 md:top-6 left-4 right-4 z-50 flex flex-col items-center px-0">
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-glass rounded-3xl md:rounded-full px-2 py-2 pl-4 md:pl-6 w-full max-w-5xl transition-all duration-300">
                    <div className="flex items-center justify-between">

                        {/* Logo */}
                        <a href="#" className="flex items-center gap-2 group shrink-0">
                            <div className="w-8 h-8 flex items-center justify-center text-white group-hover:rotate-12 transition-transform duration-300 overflow-hidden">
                                <img src="/logo.png" alt="Flova" className="w-full h-full rounded-full shadow object-cover" />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-dark-900">Flova</span>
                        </a>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-1 p-1">
                            <a href="#features" className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-dark-900 hover:bg-white rounded-full transition-all">Features</a>
                            <a href="#how-it-works" className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-dark-900 hover:bg-white rounded-full transition-all">Workflow</a>
                            <a href="#pricing" className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-dark-900 hover:bg-white rounded-full transition-all">Pricing</a>
                        </div>

                        {/* Actions (Desktop) */}
                        <div className="hidden md:flex items-center gap-3 pr-1">
                            {isLoggedIn ? (
                                <Link href="/dashboard" className="bg-dark-900 hover:bg-black text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2">
                                    Dashboard <i className="ph-bold ph-arrow-right"></i>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-dark-900 transition-colors">Log in</Link>
                                    <Link href="/register" className="bg-dark-900 hover:bg-black text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2">
                                        Get Started <i className="ph-bold ph-arrow-right"></i>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Hamburger Button */}
                        <button 
                            id="mobile-menu-btn" 
                            className="md:hidden p-2 text-dark-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
                            onClick={toggleMobileMenu}
                        >
                            <i className={`ph-bold ${isMobileMenuOpen ? 'ph-x' : 'ph-list'} text-2xl`} id="menu-icon"></i>
                        </button>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    <div id="mobile-menu" className={`md:hidden w-full flex flex-col items-center gap-4 pt-4 pb-2 border-t border-slate-100 mt-2 ${isMobileMenuOpen ? 'open' : ''}`}>
                        <a href="#features" className="text-sm font-medium text-slate-600 hover:text-dark-900 w-full text-center py-2">Features</a>
                        <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-dark-900 w-full text-center py-2">Workflow</a>
                        <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-dark-900 w-full text-center py-2">Pricing</a>
                        <div className="h-px w-full bg-slate-100 my-1"></div>
                        
                        {isLoggedIn ? (
                            <Link href="/dashboard" className="bg-dark-900 hover:bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold w-full text-center shadow-lg">Dashboard</Link>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-dark-900 w-full text-center py-2">Log in</Link>
                                <Link href="/register" className="bg-dark-900 hover:bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold w-full text-center shadow-lg">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* 2. Hero Section */}
            <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">

                {/* Video Background (Full Cover) */}
                <div className="video-background">
                    <video autoPlay loop muted playsInline>
                        <source src="/hero.mp4" type="video/mp4" />
                    </video>
                    {/* Gradient Overlay for Readability */}
                    {/* <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/95 backdrop-blur-[1px]"></div> */}
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 pt-20">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur border border-slate-200/60 shadow-sm mb-8 reveal-item cursor-default hover:border-accent-500/50 transition-colors">
                        <span className="flex h-2 w-2 rounded-full bg-accent-500 animate-pulse"></span>
                        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">v2.0 is live</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-[800] tracking-tight text-dark-900 mb-8 leading-[1.05] reveal-item" style={{ transitionDelay: '100ms' }}>
                        The operating system for <br />
                        <span className="text-gradient">independent creatives.</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium reveal-item" style={{ transitionDelay: '200ms' }}>
                        Flova unifies your client workflow. From the first opportunity to the final payment, run your business without the chaos.
                    </p>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center reveal-item" style={{ transitionDelay: '300ms' }}>
                        <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-dark-900 hover:bg-black text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                            Start for free
                        </Link>
                        <a href="#demo" className="w-full sm:w-auto px-8 py-4 bg-white/80 border border-slate-200 hover:border-slate-300 text-dark-900 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 group backdrop-blur-sm">
                            <i className="ph-fill ph-play-circle text-accent-500 text-2xl group-hover:scale-110 transition-transform"></i> See how it works
                        </a>
                    </div>

                </div>
            </section>

            {/* 4. Bento Grid (Features) */}
            <section id="features" className="py-24 md:py-32 px-6">
                <div className="max-w-7xl mx-auto">

                    <div className="mb-16 md:mb-20 max-w-2xl reveal-item">
                        <h2 className="text-3xl md:text-5xl font-bold text-dark-900 mb-6 tracking-tight">Built for flow, <br />not just storage.</h2>
                        <p className="text-lg text-slate-500">Most tools are just databases. Flova is an active workflow that moves your business forward.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Card 1: Pipeline (Tall) */}
                        <div className="md:col-span-1 row-span-2 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-card-hover hover:border-slate-300 transition-all group overflow-hidden relative reveal-item">
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-light-100 rounded-xl flex items-center justify-center text-2xl mb-6 text-dark-900"><i className="ph-bold ph-kanban"></i></div>
                                <h3 className="text-xl font-bold text-dark-900 mb-3">Visual Pipeline</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">See every deal stage at a glance. Drag, drop, and close.</p>
                            </div>
                            {/* Mock Visual */}
                            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-50 to-transparent"></div>
                            <div className="absolute bottom-8 left-8 right-8 space-y-3 opacity-80 group-hover:translate-y-[-10px] transition-transform duration-500">
                                <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm text-xs font-semibold">Start Redesign <span className="float-right text-accent-600">$5k</span></div>
                                <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm text-xs font-semibold">Mobile App <span className="float-right text-emerald-600">$12k</span></div>
                            </div>
                        </div>

                        {/* Card 2: AI Proposals (Wide) */}
                        <div className="md:col-span-2 bg-dark-900 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden relative group reveal-item" style={{ transitionDelay: '100ms' }}>
                            <div className="absolute inset-0 bg-gradient-to-r from-dark-900 to-dark-800"></div>
                            {/* Gradient Orb */}
                            <div className="absolute -right-20 -top-20 w-80 h-80 bg-accent-600/30 rounded-full blur-[100px] group-hover:bg-accent-600/40 transition-colors"></div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-1">
                                    <span className="text-accent-500 font-bold tracking-wide uppercase text-xs mb-2 block">AI Powered</span>
                                    <h3 className="text-2xl font-bold text-white mb-3">Proposal Generator</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">Generate bespoke proposals using your portfolio assets. Stop writing the same cover letter twice.</p>
                                </div>
                                <div className="w-full md:w-1/2 bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                                    <div className="space-y-2">
                                        <div className="h-2 w-3/4 bg-white/20 rounded"></div>
                                        <div className="h-2 w-1/2 bg-white/20 rounded"></div>
                                        <div className="h-2 w-full bg-white/10 rounded"></div>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <div className="h-8 w-20 bg-accent-600 rounded-lg"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Payments */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-card-hover hover:border-slate-300 transition-all reveal-item" style={{ transitionDelay: '200ms' }}>
                            <div className="w-12 h-12 bg-light-100 rounded-xl flex items-center justify-center text-2xl mb-6 text-dark-900"><i className="ph-bold ph-credit-card"></i></div>
                            <h3 className="text-lg font-bold text-dark-900 mb-2">Direct Payments</h3>
                            <p className="text-sm text-slate-500">Add Stripe/PayPal links. No hidden platform fees.</p>
                        </div>

                        {/* Card 4: Automation */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-card-hover hover:border-slate-300 transition-all reveal-item" style={{ transitionDelay: '300ms' }}>
                            <div className="w-12 h-12 bg-light-100 rounded-xl flex items-center justify-center text-2xl mb-6 text-dark-900"><i className="ph-bold ph-robot"></i></div>
                            <h3 className="text-lg font-bold text-dark-900 mb-2">Auto-Reminders</h3>
                            <p className="text-sm text-slate-500">Chasing invoices on autopilot, so you don't have to.</p>
                        </div>

                    </div>
                </div>
            </section>

            {/* 5. Workflow (Sticky Scroll) */}
            <section id="how-it-works" className="py-24 md:py-32 px-6 bg-dark-900 text-white rounded-[2.5rem] md:rounded-[3rem] mx-4 lg:mx-8 relative overflow-hidden">

                {/* Background Accents */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-600/10 rounded-full blur-[150px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">

                    <div className="lg:w-1/3 lg:sticky lg:top-40 h-fit">
                        <span className="text-accent-500 font-bold tracking-wide uppercase text-sm mb-4 block">The Workflow</span>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">From lead to cash,<br />without the friction.</h2>
                        <p className="text-lg text-slate-400 mb-8">Flova connects every stage of your client interaction into one continuous thread.</p>
                        <Link href="/register" className="inline-flex items-center gap-2 text-white font-bold border-b border-white/30 pb-1 hover:text-accent-400 hover:border-accent-400 transition-colors">
                            Start your workflow <i className="ph-bold ph-arrow-right"></i>
                        </Link>
                    </div>

                    <div className="lg:w-2/3 space-y-16 md:space-y-24">
                        {/* Steps */}
                        <div className="group reveal-item pl-8 border-l border-white/10 hover:border-accent-500 transition-colors">
                            <span className="text-xs font-mono text-accent-400 mb-2 block">01</span>
                            <h3 className="text-2xl font-bold mb-4">Capture the opportunity.</h3>
                            <p className="text-slate-400 max-w-md">Don't let leads rot in your inbox. Centralize them immediately.</p>
                        </div>
                        <div className="group reveal-item pl-8 border-l border-white/10 hover:border-accent-500 transition-colors">
                            <span className="text-xs font-mono text-accent-400 mb-2 block">02</span>
                            <h3 className="text-2xl font-bold mb-4">Send a winning proposal.</h3>
                            <p className="text-slate-400 max-w-md">Use templates to move fast. Impress clients with a professional link.</p>
                        </div>
                        <div className="group reveal-item pl-8 border-l border-white/10 hover:border-accent-500 transition-colors">
                            <span className="text-xs font-mono text-accent-400 mb-2 block">03</span>
                            <h3 className="text-2xl font-bold mb-4">Get paid on time.</h3>
                            <p className="text-slate-400 max-w-md">Automated reminders ensure you're top of mind when the invoice is due.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW SECTION: Templates & Assets */}
            <section className="py-24 md:py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 reveal-item">
                        <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">Your assets, your voice, your system.</h2>
                        <p className="text-lg text-slate-500">Flova gets better the more you use it—because it learns from what you save.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Templates Card */}
                        <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-card-hover transition-all text-center group reveal-item">
                            <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform text-3xl text-dark-900">
                                <i className="ph-duotone ph-copy"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-dark-900 mb-3">Templates</h3>
                            <p className="text-slate-500 leading-relaxed">Save terms, default line items, and reusable structures so you never start from scratch.</p>
                        </div>

                        {/* Profile Library Card */}
                        <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-card-hover transition-all text-center group reveal-item" style={{ transitionDelay: '100ms' }}>
                            <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform text-3xl text-dark-900">
                                <i className="ph-duotone ph-books"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-dark-900 mb-3">Profile Library</h3>
                            <p className="text-slate-500 leading-relaxed">Store portfolio items, testimonials, and bio snippets for instant, personalized proposals.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW SECTION: BYO Payment (Dark Contrast) */}
            <section className="py-20 md:py-24 px-6 bg-dark-900 text-white mx-4 lg:mx-8 rounded-[2.5rem] md:rounded-[3rem] relative overflow-hidden">
                <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-accent-600/20 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-sm">
                        <i className="ph-fill ph-lock-key text-accent-500"></i>
                        <span className="text-xs font-bold uppercase tracking-wide text-slate-300">Zero Transaction Fees</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Payment-ready—without <br />payment complexity.</h2>
                    <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                        Flova doesn’t process payments. Add your <strong className="text-white">Stripe / Midtrans / PayPal payment link</strong> or show your bank details directly. Clients pay the way you already prefer.
                    </p>
                    <div className="flex justify-center gap-6 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        <i className="ph-fill ph-paypal-logo text-3xl"></i>
                        <i className="ph-fill ph-stripe-logo text-3xl"></i>
                        <i className="ph-fill ph-bank text-3xl"></i>
                    </div>
                </div>
            </section>

            {/* 6. Pricing */}
            <section id="pricing" className="py-24 md:py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-6">Simple pricing for real work.</h2>
                    <p className="text-lg text-slate-500 mb-12">No hidden fees. No credit card required to start.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {/* Free */}
                        <div className="p-8 rounded-3xl border border-slate-200 hover:border-slate-300 transition-colors text-left reveal-item">
                            <h3 className="text-xl font-bold text-dark-900 mb-2">Starter</h3>
                            <div className="text-4xl font-extrabold text-dark-900 mb-6">$0</div>
                            <ul className="space-y-4 mb-8 text-sm text-slate-600">
                                <li className="flex gap-3"><i className="ph-bold ph-check text-dark-900"></i> 3 Active Proposals</li>
                                <li className="flex gap-3"><i className="ph-bold ph-check text-dark-900"></i> Unlimited Invoices</li>
                                <li className="flex gap-3"><i className="ph-bold ph-check text-dark-900"></i> Basic Templates</li>
                            </ul>
                            <Link href="/register" className="block w-full py-3 text-center border border-slate-200 font-bold rounded-xl hover:bg-slate-50 hover:text-dark-900 transition-all text-slate-600">Start Free</Link>
                        </div>

                        {/* Pro */}
                        <div className="p-8 rounded-3xl bg-dark-900 text-white shadow-2xl relative overflow-hidden text-left reveal-item" style={{ transitionDelay: '100ms' }}>
                            <div className="absolute top-0 right-0 bg-white/10 px-4 py-1.5 rounded-bl-2xl text-xs font-bold uppercase tracking-wider">Popular</div>
                            <h3 className="text-xl font-bold mb-2">Pro</h3>
                            <div className="text-4xl font-extrabold mb-6">$19<span className="text-lg font-medium opacity-60">/mo</span></div>
                            <ul className="space-y-4 mb-8 text-sm text-slate-300">
                                <li className="flex gap-3"><i className="ph-fill ph-check-circle text-accent-500"></i> Unlimited Everything</li>
                                <li className="flex gap-3"><i className="ph-fill ph-check-circle text-accent-500"></i> AI Proposal Writing</li>
                                <li className="flex gap-3"><i className="ph-fill ph-check-circle text-accent-500"></i> Automated Reminders</li>
                            </ul>
                            <Link href="/register" className="block w-full py-3 text-center bg-white text-dark-900 font-bold rounded-xl hover:bg-slate-100 transition-all">Get Pro</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW SECTION: FAQ (Accordion) */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-dark-900 mb-10 text-center">Frequently Asked Questions</h2>

                    <div className="space-y-3">
                        <details className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <summary className="flex cursor-pointer items-center justify-between p-5 font-bold text-slate-800 hover:bg-slate-50 transition-colors">
                                Does Flova process payments?
                                <span className="shrink-0 transition duration-300 group-open:-rotate-180"><i className="ph-bold ph-caret-down"></i></span>
                            </summary>
                            <div className="px-5 pb-5 pt-0 text-slate-500 text-sm leading-relaxed">
                                No. We don't touch your money. You can attach your own payment links (Stripe, PayPal, etc.) or bank details directly in the invoice notes.
                            </div>
                        </details>

                        <details className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <summary className="flex cursor-pointer items-center justify-between p-5 font-bold text-slate-800 hover:bg-slate-50 transition-colors">
                                Is this a CRM?
                                <span className="shrink-0 transition duration-300 group-open:-rotate-180"><i className="ph-bold ph-caret-down"></i></span>
                            </summary>
                            <div className="px-5 pb-5 pt-0 text-slate-500 text-sm leading-relaxed">
                                It’s a lightweight workflow system designed specifically for managing client work (Opportunities to Invoices), not a heavy, complex CRM.
                            </div>
                        </details>

                        <details className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <summary className="flex cursor-pointer items-center justify-between p-5 font-bold text-slate-800 hover:bg-slate-50 transition-colors">
                                Can I export my data?
                                <span className="shrink-0 transition duration-300 group-open:-rotate-180"><i className="ph-bold ph-caret-down"></i></span>
                            </summary>
                            <div className="px-5 pb-5 pt-0 text-slate-500 text-sm leading-relaxed">
                                Yes, you can export your invoices, quotes, and client contact data anytime as CSV or PDF formats.
                            </div>
                        </details>

                        <details className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <summary className="flex cursor-pointer items-center justify-between p-5 font-bold text-slate-800 hover:bg-slate-50 transition-colors">
                                Does Flova support multiple currencies?
                                <span className="shrink-0 transition duration-300 group-open:-rotate-180"><i className="ph-bold ph-caret-down"></i></span>
                            </summary>
                            <div className="px-5 pb-5 pt-0 text-slate-500 text-sm leading-relaxed">
                                Yes. You can set a default workspace currency and override it on a per-document basis if you work with international clients.
                            </div>
                        </details>
                    </div>
                </div>
            </section>

            {/* NEW SECTION: Final CTA */}
            <section className="py-32 px-6 text-center">
                <div className="max-w-3xl mx-auto reveal-item">
                    <h2 className="text-4xl md:text-6xl font-[800] text-dark-900 mb-6 tracking-tighter">Run client work with <br />clarity and speed.</h2>
                    <p className="text-xl text-slate-500 mb-12">Stop rebuilding the same docs and chasing the same follow-ups. Flova keeps everything moving forward.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register" className="px-8 py-4 bg-dark-900 hover:bg-black text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">Get started free</Link>
                        <a href="#" className="px-8 py-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-full font-bold text-lg transition-all">Book a demo</a>
                    </div>
                </div>
            </section>

            {/* 7. Footer */}
            <footer className="py-12 px-6 border-t border-slate-100 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-dark-900 rounded flex items-center justify-center text-white text-xs overflow-hidden"><img src="/logo.png" alt="Flova" className="w-full h-full object-cover" /></div>
                            <span className="font-bold text-lg text-dark-900">Flova.</span>
                        </div>
                        <p className="text-sm text-slate-500">The operating system for independent creatives.</p>
                    </div>

                    <div className="flex gap-8 text-sm font-medium text-slate-500">
                        <a href="#" className="hover:text-dark-900 transition-colors">Twitter</a>
                        <a href="#" className="hover:text-dark-900 transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-dark-900 transition-colors">Email</a>
                    </div>

                    <div className="flex gap-6 text-xs text-slate-400">
                        <a href="#" className="hover:text-slate-600">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-600">Terms of Service</a>
                        <span>© 2026 Flova Inc.</span>
                    </div>
                </div>
            </footer>
        </>
    );
}
