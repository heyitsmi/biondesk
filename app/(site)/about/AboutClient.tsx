"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import "../../public.css";

export default function AboutClient() {
  useEffect(() => {
    // Icons
    if ((window as any).lucide) {
      (window as any).lucide.createIcons();
    }

    // Animation Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
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

  return (
    <>
            {/* HERO */}
            <section className="pt-32 pb-24 md:pt-48 md:pb-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="inline-block text-sm font-bold text-slate-500 tracking-widest uppercase mb-4 reveal-on-scroll">About Biondesk</span>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 mb-8 reveal-on-scroll delay-100 leading-[1.1]">
                        Beyond desk,<br/> <span className="text-indigo-600">by design.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl mx-auto reveal-on-scroll delay-200">
                        Biondesk is a calm workspace for running client work end-to-end, without the tab fatigue. From the first inquiry to the final invoice, everything stays connected.
                    </p>
                </div>
            </section>

            {/* THE STORY */}
            <section className="py-24 border-t border-slate-200 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="reveal-on-scroll">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8">Work doesn’t live on a desk anymore.</h2>
                        <div className="prose prose-lg text-slate-600 leading-relaxed space-y-6">
                            <p>
                                Client work happens everywhere: inboxes, chats, docs, boards, spreadsheets. Over time, the work itself stays the same, but the tools multiply. Context gets lost. Follow-ups get delayed. Delivery feels heavier than it should.
                            </p>
                            <p>
                                Biondesk started from a simple idea: <strong className="text-slate-900">good work deserves a calmer system.</strong>
                            </p>
                            <p>
                                Not more features. Not more notifications. Just a clear place where your work can move—quietly, consistently.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHAT "BEYOND DESK" MEANS */}
            <section className="py-24 bg-slate-50 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="reveal-on-scroll">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">What “Beyond Desk” means</h2>
                            <p className="text-lg text-slate-600 mb-8">
                                It isn’t about working more. It’s about working with less friction. Biondesk helps you keep the business side of client work in order, so your focus stays on the craft.
                            </p>
                        </div>
                        
                        <div className="space-y-6 reveal-on-scroll delay-100">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0 mt-1">
                                    <i data-lucide="git-merge" className="w-5 h-5"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">One flow</h3>
                                    <p className="text-slate-500">Pipeline → Delivery → Invoicing. No context switching.</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-1">
                                    <i data-lucide="clock" className="w-5 h-5"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">One timeline</h3>
                                    <p className="text-slate-500">Know exactly what’s next, what’s stuck, and what’s paid.</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 mt-1">
                                    <i data-lucide="layers" className="w-5 h-5"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">One place for context</h3>
                                    <p className="text-slate-500">Fewer tabs, fewer missed details, more clarity.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRINCIPLES */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 mb-16 text-center reveal-on-scroll">Our Principles</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Principle 1 */}
                        <div className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 transition-colors reveal-on-scroll">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6 text-slate-900">
                                <i data-lucide="coffee" className="w-6 h-6"></i>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Calm by design</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Only what matters, when it matters. Clean screens. Quiet defaults. No red dots screaming for attention.
                            </p>
                        </div>

                        {/* Principle 2 */}
                        <div className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 transition-colors reveal-on-scroll delay-100">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6 text-slate-900">
                                <i data-lucide="heart-handshake" className="w-6 h-6"></i>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Client-first</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Professional docs, clear next steps, and a workflow you can trust. Build confidence with every interaction.
                            </p>
                        </div>

                        {/* Principle 3 */}
                        <div className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 transition-colors reveal-on-scroll delay-200">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6 text-slate-900">
                                <i data-lucide="zap" className="w-6 h-6"></i>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Progress over noise</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Less chasing. More momentum. Everything stays visible and accountable so you can keep moving forward.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHO IT'S FOR & FOUNDER NOTE */}
            <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-900/30 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                        
                        {/* Who it's for */}
                        <div className="reveal-on-scroll">
                            <h2 className="text-3xl font-bold mb-8">Built for people who deliver.</h2>
                            <ul className="space-y-6">
                                {[
                                    "Freelancers and independent makers",
                                    "Solo studios and small service businesses",
                                    "Operators who value clarity, not chaos"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <i data-lucide="check" className="w-6 h-6 text-indigo-400 mt-1"></i>
                                        <span className="text-lg text-slate-300">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-8 text-slate-400 italic border-l-2 border-slate-700 pl-4">
                                If your work is client-driven and your tools feel scattered, Biondesk is for you.
                            </p>
                        </div>

                        {/* Founder Note */}
                        <div className="bg-slate-800/50 p-8 md:p-10 rounded-3xl border border-slate-700 reveal-on-scroll delay-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">H</div>
                                <div>
                                    <h3 className="font-bold text-white">A note from the maker</h3>
                                    <p className="text-sm text-slate-400">Hilmi, Founder</p>
                                </div>
                            </div>
                            <div className="space-y-4 text-slate-300 leading-relaxed">
                                <p>
                                    "Biondesk is built for the way I work: delivering projects, managing clients, sending proposals, and making sure invoices don’t slip through."
                                </p>
                                <p>
                                    "I wanted a system that feels quiet and reliable—something you can return to every day without rebuilding it. If you try Biondesk and have feedback, I’d love to hear it."
                                </p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-700/50 flex items-center justify-between">
                                <span className="text-sm text-slate-500">Currently in Public Beta</span>
                                <a href="mailto:hello@biondesk.com" className="text-indigo-400 hover:text-white transition-colors text-sm font-medium">Say hello →</a>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-32 text-center px-6">
                <div className="max-w-3xl mx-auto reveal-on-scroll">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-8">
                        Ready to clear your desk?
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register" className="bg-slate-900 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-slate-800 transition-transform hover:-translate-y-1 shadow-xl">
                            Start your desk
                        </Link>
                        <Link href="/#pricing" className="text-slate-600 font-medium px-6 py-4 rounded-full hover:bg-slate-100 transition-colors">
                            See pricing
                        </Link>
                    </div>
                </div>
            </section>
    </>
  );
}
