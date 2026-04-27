import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 py-12 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Biondesk" className="h-8 w-auto" />
            </div>
            <div className="flex gap-8 text-sm text-slate-500 font-medium">
                <Link href="/insights" className="hover:text-slate-900">Insights</Link>
                <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
                <Link href="/terms" className="hover:text-slate-900">Terms</Link>
                <Link href="/cookie" className="hover:text-slate-900">Cookie</Link>
            </div>
            <div className="text-sm text-slate-400">
                &copy; {new Date().getFullYear()} Biondesk Inc.
            </div>
        </div>
    </footer>
  );
}
