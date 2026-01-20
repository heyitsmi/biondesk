"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PublicNavbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Close mobile menu on path change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <nav className="fixed top-4 md:top-6 left-4 right-4 z-50 flex flex-col items-center px-0">
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-sm rounded-3xl md:rounded-full px-2 py-2 pl-4 md:pl-6 w-full max-w-5xl transition-all duration-300">
                <div className="flex items-center justify-between">
                    
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group shrink-0">
                        <div className="w-8 h-8 flex items-center justify-center text-white group-hover:rotate-12 transition-transform duration-300 overflow-hidden">
                            <img src="/logo.png" alt="Flova" className="w-full h-full rounded-full shadow object-cover" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-dark-900">Flova</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-1 bg-light-100/50 p-1 rounded-full border border-black/5">
                        <Link href="/#features" className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-dark-900 hover:bg-white rounded-full transition-all">Features</Link>
                        <Link href="/#how-it-works" className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-dark-900 hover:bg-white rounded-full transition-all">Workflow</Link>
                        <Link href="/#pricing" className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-dark-900 hover:bg-white rounded-full transition-all">Pricing</Link>
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-3 pr-1">
                        <Link href="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-dark-900 transition-colors">Log in</Link>
                        <Link href="/register" className="bg-dark-900 hover:bg-black text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-lg active:scale-95 flex items-center gap-2">
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <button 
                        className="md:hidden p-2 text-dark-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
                        onClick={toggleMobileMenu}
                    >
                        <i className={`ph-bold ${isMobileMenuOpen ? 'ph-x' : 'ph-list'} text-2xl`}></i>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden w-full flex flex-col items-center gap-4 pt-4 pb-2 border-t border-slate-100 mt-2 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <Link href="/" className="text-sm font-medium text-slate-600 hover:text-dark-900 w-full text-center py-2">Home</Link>
                    <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-dark-900 w-full text-center py-2">Log in</Link>
                    <Link href="/register" className="bg-dark-900 hover:bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold w-full text-center shadow-lg">Get Started</Link>
                </div>
            </div>
        </nav>
    );
}
