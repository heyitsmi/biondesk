"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface NavbarProps {
  isAuthenticated: boolean;
}

export default function Navbar({ isAuthenticated }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Icons
    if ((window as any).lucide) {
      (window as any).lucide.createIcons();
    }

    // Navbar Blur Effect on Scroll
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        if (navbar) {
            if (window.scrollY > 20) {
                navbar.classList.add('bg-white/80', 'backdrop-blur-md', 'border-slate-200/50', 'border-b');
                navbar.classList.remove('border-transparent');
            } else {
                navbar.classList.remove('bg-white/80', 'backdrop-blur-md', 'border-slate-200/50', 'border-b');
                navbar.classList.add('border-transparent');
            }
        }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Refresh icons when menu opens
  useEffect(() => {
    if (isOpen && (window as any).lucide) {
        setTimeout(() => (window as any).lucide.createIcons(), 100);
    }
  }, [isOpen]);

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent" id="navbar">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Biondesk" className="h-8 w-auto" />
                    </div>

                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <Link href="/about" className="hover:text-slate-900 transition-colors">About</Link>
                    <Link href="/#features" className="hover:text-slate-900 transition-colors">Features</Link>
                    <Link href="/#pricing" className="hover:text-slate-900 transition-colors">Pricing</Link>
                    <Link href="/faq" className="hover:text-slate-900 transition-colors">FAQ</Link>
                    <Link href="/support" className="hover:text-slate-900 transition-colors">Support</Link>
                </div>

                {/* CTA & Mobile Toggle */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated ? (
                                <Link href="/dashboard" className="bg-slate-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/10">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm font-medium text-slate-900 hover:text-slate-600">Log in</Link>
                                <Link href="/register" className="bg-slate-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/10">
                                    Start your desk
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? (
                            <i data-lucide="x" className="w-6 h-6"></i>
                        ) : (
                            <i data-lucide="menu" className="w-6 h-6"></i>
                        )}
                    </button>
                </div>
            </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
            <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-xl animate-fade-in-up">
                <div className="flex flex-col p-6 gap-4">
                    <Link href="/about" className="text-base font-medium text-slate-600 hover:text-slate-900 py-2 border-b border-slate-100" onClick={() => setIsOpen(false)}>About</Link>
                    <Link href="/#features" className="text-base font-medium text-slate-600 hover:text-slate-900 py-2 border-b border-slate-100" onClick={() => setIsOpen(false)}>Features</Link>
                    <Link href="/#pricing" className="text-base font-medium text-slate-600 hover:text-slate-900 py-2 border-b border-slate-100" onClick={() => setIsOpen(false)}>Pricing</Link>
                    <Link href="/faq" className="text-base font-medium text-slate-600 hover:text-slate-900 py-2 border-b border-slate-100" onClick={() => setIsOpen(false)}>FAQ</Link>
                    <Link href="/support" className="text-base font-medium text-slate-600 hover:text-slate-900 py-2 border-b border-slate-100" onClick={() => setIsOpen(false)}>Support</Link>
                    
                    <div className="pt-4 flex flex-col gap-3">
                        {isAuthenticated ? (
                            <Link href="/dashboard" className="bg-slate-900 text-white text-center text-sm font-medium px-5 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10" onClick={() => setIsOpen(false)}>
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="text-center text-sm font-medium text-slate-900 hover:text-slate-600 py-2" onClick={() => setIsOpen(false)}>Log in</Link>
                                <Link href="/register" className="bg-slate-900 text-white text-center text-sm font-medium px-5 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10" onClick={() => setIsOpen(false)}>
                                    Start your desk
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )}

    </nav>
  );
}
