"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "@/app/public.css";

export default function PublicNotFound() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-slate-900 selection:text-white">
      <div className="bg-noise"></div>

      {/* NAVIGATION */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-white/80 backdrop-blur-md border-slate-200/50"
            : "border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl font-bold tracking-tight flex items-center gap-2"
            >
              <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center text-white">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                </svg>
              </div>
              Biondesk
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <Link href="/#features" className="hover:text-slate-900 transition-colors">
                Features
              </Link>
              <Link href="/#pricing" className="hover:text-slate-900 transition-colors">
                Pricing
              </Link>
              <Link href="/about" className="hover:text-slate-900 transition-colors">
                About
              </Link>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="hidden md:block text-sm font-medium text-slate-900 hover:text-slate-600"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-slate-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/10"
              >
                Start your desk
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex items-center justify-center pt-20 pb-20 relative overflow-hidden">
        {/* Decor gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-50/50 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="text-center px-6">
          {/* Visual Element */}
          <div className="mb-8 relative inline-block animate-float">
            <div className="w-24 h-24 bg-white rounded-3xl border border-slate-200 shadow-xl flex items-center justify-center text-slate-300 relative z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10"
              >
                <path d="m13.5 8.5-5 5" />
                <path d="m8.5 8.5 5 5" />
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center animate-bounce delay-100">
              <span className="text-xl font-bold text-slate-400">?</span>
            </div>
            <div className="absolute -bottom-2 -left-4 w-12 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white animate-pulse delay-700 shadow-lg">
              <span className="text-xs font-bold">404</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
            Desk not found.
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-md mx-auto leading-relaxed">
            The page you are looking for might have been moved, deleted, or simply
            doesn't exist. Let's get you back to work.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-800 transition-all hover:-translate-y-1 shadow-lg shadow-slate-900/10 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Back to Home
            </Link>
            <Link
              href="/support"
              className="text-slate-600 font-medium px-6 py-3.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-8 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-400">
            &copy; 2024 Biondesk Inc.
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <a href="#" className="hover:text-slate-900 transition-colors">
              Status
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
