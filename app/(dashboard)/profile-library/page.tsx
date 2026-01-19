"use client";

import { useState } from 'react';
import Header from '@/components/dashboard/Header';
import Link from 'next/link';

export default function ProfileLibraryPage() {
    const [activeTab, setActiveTab] = useState<'portfolio' | 'testimonials' | 'skills'>('portfolio');

    // Mock data - will be replaced with real data from Supabase
    const portfolioItems = [
        {
            id: '1',
            title: 'E-commerce Platform Redesign',
            client: 'Acme Corp',
            category: 'Web Design',
            thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
            year: '2024'
        },
        {
            id: '2',
            title: 'Mobile Banking App',
            client: 'FinTech Inc',
            category: 'Mobile App',
            thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
            year: '2024'
        },
        {
            id: '3',
            title: 'Brand Identity System',
            client: 'Studio Design',
            category: 'Branding',
            thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
            year: '2023'
        }
    ];

    const testimonials = [
        {
            id: '1',
            quote: 'Working with this team was an absolute pleasure. They delivered beyond our expectations and were always responsive to our needs.',
            author: 'John Smith',
            role: 'CEO',
            company: 'Acme Corp',
            avatar: null
        },
        {
            id: '2',
            quote: 'The attention to detail and creative solutions they provided helped us achieve our goals faster than anticipated.',
            author: 'Sarah Johnson',
            role: 'Product Manager',
            company: 'Startup.io',
            avatar: null
        }
    ];

    const skills = [
        { name: 'UI/UX Design', level: 95 },
        { name: 'Web Development', level: 90 },
        { name: 'Mobile Development', level: 85 },
        { name: 'Brand Identity', level: 88 },
        { name: 'Motion Design', level: 75 }
    ];

    return (
        <>
            <Header 
                title="Profile Library"
                subtitle="Your portfolio, testimonials & skills"
                newButtonText="Add Item"
                newButtonHref="/profile-library/add"
            />

            <div className="flex-1 overflow-y-auto p-8">
                <div className="w-full">
                    
                    {/* Tabs */}
                    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 w-fit mb-8">
                        {(['portfolio', 'testimonials', 'skills'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-sm font-[600] rounded-md transition-all capitalize ${
                                    activeTab === tab 
                                        ? 'bg-white text-slate-900 shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Portfolio Tab */}
                    {activeTab === 'portfolio' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {portfolioItems.map((item) => (
                                <div 
                                    key={item.id}
                                    className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-indigo-200 hover:shadow-md transition-all group"
                                >
                                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                                        <img 
                                            src={item.thumbnail} 
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-[500] text-slate-700">
                                                {item.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-sm font-[600] text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-slate-500">{item.client} • {item.year}</p>
                                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                                            <button className="text-xs font-[500] text-indigo-600 hover:text-indigo-700">Edit</button>
                                            <span className="text-slate-300">•</span>
                                            <button className="text-xs font-[500] text-slate-500 hover:text-slate-700">Preview</button>
                                            <span className="text-slate-300">•</span>
                                            <button className="text-xs font-[500] text-rose-500 hover:text-rose-700">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Add New */}
                            <Link 
                                href="/profile-library/add?type=portfolio"
                                className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center min-h-[280px] hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group"
                            >
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors mb-3">
                                    <i className="ph-bold ph-plus text-xl text-slate-400 group-hover:text-indigo-600 transition-colors"></i>
                                </div>
                                <p className="text-sm font-[600] text-slate-500 group-hover:text-indigo-600 transition-colors">Add Portfolio Item</p>
                            </Link>
                        </div>
                    )}

                    {/* Testimonials Tab */}
                    {activeTab === 'testimonials' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {testimonials.map((testimonial) => (
                                <div 
                                    key={testimonial.id}
                                    className="bg-white rounded-xl border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-md transition-all"
                                >
                                    <div className="mb-4">
                                        <i className="ph-fill ph-quotes text-3xl text-indigo-200"></i>
                                    </div>
                                    <p className="text-sm text-slate-600 italic mb-6 leading-relaxed">
                                        &ldquo;{testimonial.quote}&rdquo;
                                    </p>
                                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-[600]">
                                            {testimonial.author.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-sm font-[600] text-slate-900">{testimonial.author}</p>
                                            <p className="text-xs text-slate-500">{testimonial.role}, {testimonial.company}</p>
                                        </div>
                                        <div className="ml-auto flex items-center gap-2">
                                            <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                                                <i className="ph ph-pencil-simple"></i>
                                            </button>
                                            <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors">
                                                <i className="ph ph-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Add New */}
                            <Link 
                                href="/profile-library/add?type=testimonial"
                                className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center min-h-[200px] hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group"
                            >
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors mb-3">
                                    <i className="ph-bold ph-plus text-xl text-slate-400 group-hover:text-indigo-600 transition-colors"></i>
                                </div>
                                <p className="text-sm font-[600] text-slate-500 group-hover:text-indigo-600 transition-colors">Add Testimonial</p>
                            </Link>
                        </div>
                    )}

                    {/* Skills Tab */}
                    {activeTab === 'skills' && (
                        <div className="max-w-2xl">
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                    <h2 className="text-lg font-[600] text-slate-900">Skills & Expertise</h2>
                                    <button className="text-sm font-[550] text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                                        <i className="ph-bold ph-plus"></i>
                                        Add Skill
                                    </button>
                                </div>
                                <div className="p-6 space-y-5">
                                    {skills.map((skill, idx) => (
                                        <div key={idx} className="group">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-[600] text-slate-700">{skill.name}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs text-slate-400">{skill.level}%</span>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-1 text-slate-400 hover:text-indigo-600 rounded">
                                                            <i className="ph ph-pencil-simple text-sm"></i>
                                                        </button>
                                                        <button className="p-1 text-slate-400 hover:text-rose-600 rounded">
                                                            <i className="ph ph-trash text-sm"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2">
                                                <div 
                                                    className="bg-indigo-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${skill.level}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tip */}
                            <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                                <p className="text-xs text-indigo-700">
                                    <i className="ph-fill ph-lightbulb mr-1"></i>
                                    Skills and portfolio items can be referenced in your AI-generated proposals to make them more personalized.
                                </p>
                            </div>
                        </div>
                    )}

                </div>
                
                {/* Footer */}
                <div className="mt-12 mb-6 text-center">
                    <p className="text-xs text-slate-400">© 2026 Flova. Crafted for growth.</p>
                </div>
            </div>
        </>
    );
}
