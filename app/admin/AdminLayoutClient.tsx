"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/Sidebar";

export default function AdminLayoutClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar 
        user={user} 
        isMobileOpen={isMobileOpen} 
        onMobileClose={() => setIsMobileOpen(false)}
    />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
         {/* Mobile Header Toggle */}
         <div className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 shrink-0 justify-between">
            <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-600 text-white overflow-hidden">
                     <span className="font-bold">A</span>
                 </div>
                 <span className="font-bold text-slate-900">Admin</span>
            </div>
            <button 
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
                <i className="ph ph-list text-2xl"></i>
            </button>
         </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            {children}
        </main>
      </div>

       {/* Mobile Overlay */}
       {isMobileOpen && (
        <div 
            className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
        ></div>
      )}
    </div>
  );
}
