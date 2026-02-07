"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import "../../public.css";

export default function SupportClient() {
  useEffect(() => {
    // Icons
    if ((window as any).lucide) {
      (window as any).lucide.createIcons();
    }
  }, []);

  return (
    <div className="flex-grow pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    
                    {/* Left Column: Info */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">Talk to us.</h1>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Have a question about the desk? Need help with an invoice? Or just want to suggest a feature? We read every message.
                        </p>

                        <div className="space-y-8">
                            {/* Contact Item 1 */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                    <i data-lucide="mail" className="w-5 h-5"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Email Support</h3>
                                    <p className="text-slate-500 text-sm mb-1">For general inquiries and help.</p>
                                    <a href="mailto:hello@biondesk.com" className="text-indigo-600 font-medium hover:underline">hello@biondesk.com</a>
                                </div>
                            </div>

                            {/* Contact Item 2 */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                    <i data-lucide="message-square" className="w-5 h-5"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Twitter / X</h3>
                                    <p className="text-slate-500 text-sm mb-1">Follow us for quick updates.</p>
                                    <a href="#" className="text-indigo-600 font-medium hover:underline">@biondesk</a>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Teaser */}
                        <div className="mt-12 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="font-bold text-slate-900 mb-2">Looking for quick answers?</h4>
                            <p className="text-sm text-slate-600 mb-4">Check out our Frequently Asked Questions for info on pricing, trials, and features.</p>
                            <Link href="/#faq" className="text-sm font-semibold text-slate-900 flex items-center gap-1 hover:gap-2 transition-all">
                                Go to FAQ <i data-lucide="arrow-right" className="w-4 h-4"></i>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
                        <form action="#" method="POST" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-slate-700">Name</label>
                                    <input type="text" id="name" name="name" required placeholder="Jane Doe" 
                                        className="input-field w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white" />
                                </div>
                                
                                {/* Email */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
                                    <input type="email" id="email" name="email" required placeholder="jane@example.com" 
                                        className="input-field w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white" />
                                </div>
                            </div>

                            {/* Subject */}
                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium text-slate-700">Topic</label>
                                <div className="relative">
                                    <select id="subject" name="subject" className="input-field w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white appearance-none cursor-pointer">
                                        <option value="general">General Inquiry</option>
                                        <option value="support">Technical Support</option>
                                        <option value="billing">Billing Question</option>
                                        <option value="feedback">Feature Request</option>
                                    </select>
                                    <i data-lucide="chevron-down" className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"></i>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-slate-700">Message</label>
                                <textarea id="message" name="message" required rows={4} placeholder="How can we help you?" 
                                    className="input-field w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none"></textarea>
                            </div>

                            <button type="submit" className="w-full bg-slate-900 text-white font-semibold py-4 rounded-xl hover:bg-slate-800 transition-all hover:scale-[1.02] shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2">
                                Send Message
                                <i data-lucide="send" className="w-4 h-4"></i>
                            </button>
                        </form>
                    </div>

                </div>

            </div>
    </div>
  );
}
