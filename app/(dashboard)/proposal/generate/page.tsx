"use client";

import { useState } from 'react';
import Header from '@/components/dashboard/Header';
import Link from 'next/link';

export default function ProposalGeneratorPage() {
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [formData, setFormData] = useState({
        jobUrl: '',
        jobDescription: '',
        clientName: '',
        tone: 'professional',
        focusAreas: [] as string[]
    });
    const [generatedProposal, setGeneratedProposal] = useState('');

    const handleGenerate = async () => {
        setIsGenerating(true);
        
        // Simulate AI generation
        setTimeout(() => {
            setGeneratedProposal(`Hi there,

I came across your project and I'm excited about the opportunity to help you with "${formData.clientName ? formData.clientName + "'s" : 'your'} website redesign.

**Understanding Your Needs**
Based on your requirements, I understand you're looking for a modern, professional website that effectively communicates your brand value and converts visitors into customers.

**My Approach**
I would approach this project in three phases:

1. **Discovery & Strategy** (Week 1)
   - Deep dive into your brand, competitors, and target audience
   - Create wireframes and user flow diagrams
   - Present initial concepts for your approval

2. **Design & Development** (Week 2-3)
   - High-fidelity designs in Figma
   - Responsive development using modern technologies
   - Integration with your existing tools

3. **Launch & Handoff** (Week 4)
   - Thorough testing and optimization
   - Training session on content management
   - 30-day post-launch support

**Why Work With Me?**
- 5+ years of experience in web design and development
- Proven track record with similar projects
- Clear communication and on-time delivery

**Investment**
Based on the scope described, I estimate this project at $X,XXX with a timeline of 4 weeks.

Would you like to schedule a quick call to discuss the details?

Best regards,
[Your Name]`);
            setStep(2);
            setIsGenerating(false);
        }, 2000);
    };

    const focusOptions = [
        { id: 'portfolio', label: 'Include Portfolio Work' },
        { id: 'testimonials', label: 'Add Testimonials' },
        { id: 'pricing', label: 'Include Pricing' },
        { id: 'timeline', label: 'Detailed Timeline' },
        { id: 'tech', label: 'Technical Approach' }
    ];

    const toggleFocus = (id: string) => {
        setFormData(prev => ({
            ...prev,
            focusAreas: prev.focusAreas.includes(id) 
                ? prev.focusAreas.filter(f => f !== id)
                : [...prev.focusAreas, id]
        }));
    };

    return (
        <>
            <Header 
                title="Proposal Generator"
                subtitle="AI-powered proposal drafting"
                showNewButton={false}
            />

            <div className="flex-1 overflow-y-auto p-8">
                <div className="w-full max-w-4xl mx-auto">
                    
                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-[600] ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">1</span>
                            Input
                        </div>
                        <div className="w-8 h-px bg-slate-200"></div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-[600] ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">2</span>
                            Review & Edit
                        </div>
                        <div className="w-8 h-px bg-slate-200"></div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-[600] ${step === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">3</span>
                            Send
                        </div>
                    </div>

                    {step === 1 && (
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            {/* Main Input Form */}
                            <div className="lg:col-span-3 space-y-6">
                                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-100">
                                        <h2 className="text-lg font-[600] text-slate-900">Project Details</h2>
                                        <p className="text-sm text-slate-500 mt-1">Paste a job post or describe the project</p>
                                    </div>
                                    <div className="p-6 space-y-5">
                                        
                                        {/* Job URL */}
                                        <div>
                                            <label className="block text-sm font-[600] text-slate-700 mb-1.5">Job Post URL (Optional)</label>
                                            <input 
                                                type="url" 
                                                placeholder="https://www.upwork.com/jobs/..."
                                                value={formData.jobUrl}
                                                onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                            />
                                            <p className="text-xs text-slate-400 mt-1.5">
                                                <i className="ph ph-magic-wand"></i> We&apos;ll extract the job details automatically
                                            </p>
                                        </div>

                                        <div className="relative my-4">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-slate-200"></div>
                                            </div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-white px-2 text-slate-400 font-medium">or describe manually</span>
                                            </div>
                                        </div>

                                        {/* Job Description */}
                                        <div>
                                            <label className="block text-sm font-[600] text-slate-700 mb-1.5">
                                                Project Description <span className="text-rose-500">*</span>
                                            </label>
                                            <textarea 
                                                rows={6}
                                                placeholder="Paste the full job post or describe what the client needs..."
                                                value={formData.jobDescription}
                                                onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                                            ></textarea>
                                        </div>

                                        {/* Client Name */}
                                        <div>
                                            <label className="block text-sm font-[600] text-slate-700 mb-1.5">Client / Company Name (Optional)</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g., Acme Corp"
                                                value={formData.clientName}
                                                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Sidebar - Options */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Tone Selection */}
                                <div className="bg-white rounded-xl border border-slate-200 p-5">
                                    <h3 className="text-sm font-[600] text-slate-900 mb-3">Writing Tone</h3>
                                    <div className="space-y-2">
                                        {['professional', 'friendly', 'confident', 'consultative'].map((tone) => (
                                            <label 
                                                key={tone}
                                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                                                    formData.tone === tone 
                                                        ? 'bg-indigo-50 border border-indigo-200' 
                                                        : 'bg-slate-50 border border-transparent hover:border-slate-200'
                                                }`}
                                            >
                                                <input 
                                                    type="radio" 
                                                    name="tone" 
                                                    value={tone}
                                                    checked={formData.tone === tone}
                                                    onChange={() => setFormData({ ...formData, tone })}
                                                    className="accent-indigo-600"
                                                />
                                                <span className="text-sm font-[500] text-slate-700 capitalize">{tone}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Focus Areas */}
                                <div className="bg-white rounded-xl border border-slate-200 p-5">
                                    <h3 className="text-sm font-[600] text-slate-900 mb-3">Include in Proposal</h3>
                                    <div className="space-y-2">
                                        {focusOptions.map((option) => (
                                            <label 
                                                key={option.id}
                                                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                                            >
                                                <input 
                                                    type="checkbox" 
                                                    checked={formData.focusAreas.includes(option.id)}
                                                    onChange={() => toggleFocus(option.id)}
                                                    className="accent-indigo-600"
                                                />
                                                <span className="text-sm font-[500] text-slate-700">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Generate Button */}
                                <button 
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !formData.jobDescription}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-[600] rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="ph-bold ph-magic-wand"></i>
                                            Generate Proposal
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-[600] text-slate-900">Generated Proposal</h2>
                                        <p className="text-sm text-slate-500">Review and edit before sending</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => setStep(1)}
                                            className="px-3 py-1.5 text-sm font-[500] text-slate-600 hover:text-slate-800 transition-colors"
                                        >
                                            <i className="ph ph-arrow-counter-clockwise mr-1"></i>
                                            Regenerate
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <textarea 
                                        rows={20}
                                        value={generatedProposal}
                                        onChange={(e) => setGeneratedProposal(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none font-mono"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <button 
                                    onClick={() => setStep(1)}
                                    className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-[600] rounded-lg hover:border-slate-300 transition-all"
                                >
                                    <i className="ph ph-arrow-left mr-1"></i>
                                    Back
                                </button>
                                <div className="flex items-center gap-3">
                                    <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-[600] rounded-lg hover:border-slate-300 transition-all">
                                        Save as Draft
                                    </button>
                                    <button className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-[600] rounded-lg shadow-lg transition-all">
                                        Copy to Clipboard
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tips */}
                    <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                                <i className="ph-fill ph-lightbulb text-indigo-600"></i>
                            </div>
                            <div>
                                <h3 className="text-sm font-[600] text-indigo-900 mb-1">Pro Tips</h3>
                                <ul className="text-xs text-indigo-700 space-y-1">
                                    <li>• Be specific about your understanding of their needs</li>
                                    <li>• Mention relevant portfolio pieces from your Profile Library</li>
                                    <li>• Always include a clear call-to-action</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
                
                {/* Footer */}
                <div className="mt-12 mb-6 text-center">
                    <p className="text-xs text-slate-400">© 2026 Flova. Crafted for growth.</p>
                </div>
            </div>
        </>
    );
}
