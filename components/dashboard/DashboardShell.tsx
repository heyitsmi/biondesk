"use client";

import { useState, ReactNode } from "react";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

interface DashboardShellProps {
  children: ReactNode;
  user?: {
    name: string;
    email: string;
    avatar_url?: string;
    plan: string;
  };
}

export default function DashboardShell({ children, user }: DashboardShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-slate-50 text-slate-900 font-sans antialiased h-screen flex overflow-hidden">
      {/* Sidebar - Desktop: Relative/Sticky, Mobile: Fixed Drawer via props */}
      <Sidebar 
        user={user} 
        isMobileOpen={isMobileMenuOpen} 
        onMobileClose={() => setIsMobileMenuOpen(false)} 
      />

      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50/50 transition-all duration-300 ease-in-out">
        {/* Mobile Header */}
        <MobileNav 
            onOpenSidebar={() => setIsMobileMenuOpen(true)} 
            user={user} 
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar">
            {children}
        </main>
      </div>
      
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
