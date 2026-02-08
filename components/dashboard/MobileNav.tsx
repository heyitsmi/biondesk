"use client";

import Link from "next/link";
import { useState } from "react";

interface MobileNavProps {
  onOpenSidebar: () => void;
  user?: {
    name: string;
    avatar_url?: string;
  };
}

export default function MobileNav({ onOpenSidebar, user }: MobileNavProps) {
  return (
    <div className="lg:hidden flex items-center justify-between h-16 px-4 border-b border-slate-200 bg-white sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <i className="ph ph-list text-2xl"></i>
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-white overflow-hidden">
                <img
                src="/favicon/favicon-32x32.png"
                alt="Biondesk"
                className="w-full h-full rounded-full object-cover"
                />
            </div>
            <span className="text-lg font-[650] text-slate-900 tracking-tight">
                Biondesk.
            </span>
        </Link>
      </div>

      <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden">
        {user?.avatar_url ? (
            <img
            src={user.avatar_url}
            alt={user.name || "User"}
            className="w-full h-full object-cover"
            />
        ) : (
            <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=0f172a&color=fff`}
            alt={user?.name || "User"}
            className="w-full h-full object-cover"
            />
        )}
      </div>
    </div>
  );
}
