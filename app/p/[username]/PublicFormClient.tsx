'use client';

import { useState } from 'react';
import { Workspace } from '@/lib/types';

interface PublicFormClientProps {
    workspace: Workspace;
}

export default function PublicFormClient({ workspace }: PublicFormClientProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/api/public/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workspace_id: workspace.id,
                    ...data
                }),
            });

            if (!res.ok) throw new Error('Submission failed');
            
            setIsSuccess(true);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to send inquiry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
             {/* Configuration is handled by global layout or simple inclusion here if needed, but Tailwind is already globally set up in layout.tsx? 
                 Wait, public page might not share the same layout.tsx if it's in (dashboard). 
                 Actually, app/p/[username]/page.tsx is at root app level, so it uses app/layout.tsx.
                 We should check app/layout.tsx if it includes tailwind.
             */}
             
             {/* We need to ensure the styles from the template are respected. 
                 The template uses Google Sans Flex. We might need to import it or rely on established fonts.
                 For now, we will use the existing app styles.
             */}

            <div className="font-sans antialiased text-slate-900 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative bg-slate-50">

                {/* Background Decoration */}
                <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50 to-transparent"></div>
                    <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
                </div>

                <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 animate-fade-in-up">
                    {/* User Branding */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 mb-6 overflow-hidden">
                        {workspace.logo_url ? (
                            <img src={workspace.logo_url} alt={workspace.name} className="w-full h-full object-contain" />
                        ) : (
                            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                                <i className="ph-bold ph-lightning text-xl"></i>
                            </div>
                        )}
                    </div>
                    <h2 className="text-3xl font-[800] tracking-tight text-slate-900">Work with {workspace.name}</h2>
                    <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">
                        Tell us about your project. We usually respond within 24 hours.
                    </p>
                </div>

                <div className="sm:mx-auto sm:w-full sm:max-w-[600px] animate-fade-in-up relative z-10" style={{ animationDelay: '100ms' }}>
                    <div className="bg-white py-8 px-4 shadow-form sm:rounded-2xl sm:px-10 border border-slate-100 relative overflow-hidden">
                        
                        {!isSuccess ? (
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {/* Contact Info Group */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label htmlFor="name" className="block text-xs font-[600] text-slate-700 uppercase tracking-wide">Your Name <span className="text-rose-500">*</span></label>
                                        <input id="name" name="name" type="text" required className="appearance-none block w-full px-3 py-2.5 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all" placeholder="John Doe" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="email" className="block text-xs font-[600] text-slate-700 uppercase tracking-wide">Email Address <span className="text-rose-500">*</span></label>
                                        <input id="email" name="email" type="email" required className="appearance-none block w-full px-3 py-2.5 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all" placeholder="john@company.com" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="company" className="block text-xs font-[600] text-slate-700 uppercase tracking-wide">Company / Website (Optional)</label>
                                    <input id="company" name="company" type="text" className="appearance-none block w-full px-3 py-2.5 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all" placeholder="https://acme.com" />
                                </div>

                                {/* Project Details Group */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                    <div className="space-y-1.5">
                                        <label htmlFor="service" className="block text-xs font-[600] text-slate-700 uppercase tracking-wide">Looking For</label>
                                        <div className="relative">
                                            <select id="service" name="service" className="appearance-none block w-full px-3 py-2.5 border border-slate-200 rounded-xl shadow-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm cursor-pointer transition-all bg-white">
                                                <option>Web Design</option>
                                                <option>Mobile App Design</option>
                                                <option>Branding</option>
                                                <option>Development</option>
                                                <option>Other</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                                                <i className="ph-bold ph-caret-down"></i>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="budget" className="block text-xs font-[600] text-slate-700 uppercase tracking-wide">Budget Range</label>
                                        <div className="relative">
                                            <select id="budget" name="budget" className="appearance-none block w-full px-3 py-2.5 border border-slate-200 rounded-xl shadow-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm cursor-pointer transition-all bg-white">
                                                <option>&lt; $1,000</option>
                                                <option>$1,000 - $5,000</option>
                                                <option>$5,000 - $10,000</option>
                                                <option>$10,000+</option>
                                                <option>Not sure yet</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                                                <i className="ph-bold ph-caret-down"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* NEW FIELD: Detailed Needs */}
                                <div className="space-y-1.5">
                                    <label htmlFor="detailed_needs" className="block text-xs font-[600] text-slate-700 uppercase tracking-wide">Detailed Requirements & Goals</label>
                                    <textarea id="detailed_needs" name="detailed_needs" rows={5} className="appearance-none block w-full px-3 py-2.5 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all resize-y" placeholder="Please describe your needs, problems to solve, and expected outcomes in detail..."></textarea>
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="message" className="block text-xs font-[600] text-slate-700 uppercase tracking-wide">Additional Context / Timeline <span className="text-rose-500">*</span></label>
                                    <textarea id="message" name="message" rows={2} required className="appearance-none block w-full px-3 py-2.5 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all resize-none" placeholder="Any specific timeline or other constraints?"></textarea>
                                </div>

                                <div className="pt-2">
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-[600] text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        <span className="flex items-center gap-2">
                                            {isSubmitting ? (
                                                <><i className="ph-bold ph-spinner animate-spin text-lg"></i> Sending...</>
                                            ) : (
                                                <>Send Inquiry <i className="ph-bold ph-paper-plane-right"></i></>
                                            )}
                                        </span>
                                    </button>
                                    <p className="mt-4 text-center text-xs text-slate-400">
                                        <i className="ph-fill ph-lock-key mr-1"></i> Your information is secure and never shared.
                                    </p>
                                </div>
                            </form>
                        ) : (
                            /* Success State */
                            <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-8 text-center animate-fade-in-up">
                                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-500 animate-bounce">
                                    <i className="ph-fill ph-check-circle text-4xl"></i>
                                </div>
                                <h3 className="text-2xl font-[800] text-slate-900 mb-2">Message Sent!</h3>
                                <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                                    Thanks for reaching out. We've received your inquiry and will get back to you shortly.
                                </p>
                                <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-slate-100 text-slate-700 font-[600] rounded-xl hover:bg-slate-200 transition-colors text-sm">
                                    Back to Form
                                </button>
                            </div>
                        )}

                    </div>
                </div>

                {/* Footer Branding */}
                <div className="mt-8 text-center">
                    <a href="https://flova.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors">
                        <i className="ph-fill ph-lightning"></i> Powered by Flova
                    </a>
                </div>
            </div>
        </>
    );
}
