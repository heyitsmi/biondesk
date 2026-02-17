"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  user?: {
    name: string;
    email: string;
    avatar_url?: string;
    role: string;
  };
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function AdminSidebar({ user, isMobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isActive = (path: string) => pathname.startsWith(path);

  const menuItems = [
    {
      section: null,
      items: [
        { name: "Dashboard", path: "/admin/dashboard", icon: "ph-squares-four" },
        { name: "Users", path: "/admin/users", icon: "ph-users" },
        { name: "AI Usage", path: "/admin/ai-usage", icon: "ph-robot" },
      ],
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setIsUserMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  // Mobile Drawer Classes
  const mobileClasses = `fixed inset-y-0 left-0 z-30 w-[260px] transform ${
    isMobileOpen ? "translate-x-0" : "-translate-x-full"
  } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:transform-none`;

  return (
    <aside
      className={`${mobileClasses} ${isCollapsed ? "lg:w-[80px]" : "lg:w-[260px]"} bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 z-30 transition-all duration-300 lg:relative shadow-2xl lg:shadow-none text-slate-300`}
    >
      {/* Brand & Toggle Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 transition-all duration-300">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 text-white overflow-hidden whitespace-nowrap"
          onClick={onMobileClose} // Close drawer on link click
        >
          <div className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center bg-indigo-600 text-white overflow-hidden">
             <span className="font-bold text-lg">A</span>
          </div>
          {!isCollapsed && (
            <span className="text-lg font-[650] tracking-tight transition-opacity duration-200">
              Admin
            </span>
          )}
        </Link>
        
        {/* Mobile Close Button */}
        <button
            onClick={onMobileClose}
            className="lg:hidden text-slate-400 hover:text-white"
        >
            <i className="ph ph-x text-xl"></i>
        </button>

        {/* Desktop Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:block text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800 shrink-0"
        >
          <i
            className={`ph-bold ${isCollapsed ? "ph-caret-double-right" : "ph-caret-double-left"} text-lg`}
          ></i>
        </button>
      </div>

      {/* Scrollable Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8 no-scrollbar">
        {menuItems.map((group, groupIdx) => (
          <div key={groupIdx}>
            {group.section && !isCollapsed && (
              <div className="px-3 mb-2 text-[11px] font-[600] text-slate-500 uppercase tracking-wider whitespace-nowrap overflow-hidden transition-opacity duration-200">
                {group.section}
              </div>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onMobileClose} // Close drawer on link click
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-[500] rounded-lg transition-all whitespace-nowrap overflow-hidden group relative ${
                    isActive(item.path)
                      ? "text-white bg-indigo-600/20 border border-indigo-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  } ${isCollapsed ? "lg:justify-center" : ""}`}
                  title={item.name}
                >
                  <i
                    className={`ph ${item.icon} text-xl shrink-0 ${
                      isActive(item.path)
                        ? "text-indigo-400"
                        : "text-slate-500 group-hover:text-white"
                    } transition-colors`}
                  ></i>
                  {(!isCollapsed || (isMobileOpen && !isCollapsed)) && (
                    <span className={`transition-opacity duration-200 ${isCollapsed ? 'lg:hidden' : ''}`}>
                      {item.name}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile (Bottom) & Popover */}
      <div className="p-4 border-t border-slate-800 relative">
        {/* Popover Menu */}
        {isUserMenuOpen && (
          <div className="absolute bottom-20 left-4 w-60 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 p-1 animate-fade-in-up origin-bottom-left text-slate-300">
            <div className="px-3 py-2 border-b border-slate-700 mb-1">
              <p className="text-sm font-[600] text-white">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-slate-400">
                {user?.email || "email@example.com"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-900/20 rounded-lg transition-colors"
            >
              <i className="ph ph-sign-out"></i> Sign out
            </button>
          </div>
        )}

        {/* Profile Trigger Button */}
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className={`flex items-center gap-3 w-full p-2 hover:bg-slate-800 rounded-lg transition-all text-left group overflow-hidden ${isCollapsed ? "lg:justify-center" : ""}`}
        >
          <div className="w-9 h-9 shrink-0 rounded-full bg-slate-700 border border-slate-600 overflow-hidden relative font-bold text-white flex items-center justify-center">
             {user?.name?.[0] || 'A'}
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <>
              <div className={`flex-1 min-w-0 transition-opacity duration-200 ${isCollapsed ? 'lg:hidden' : ''}`}>
                <p className="text-sm font-[600] text-white truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs font-[450] text-slate-500 truncate capitalize">
                  Administrator
                </p>
              </div>
              <i className={`ph ph-caret-up text-slate-500 ${isCollapsed ? 'lg:hidden' : ''}`}></i>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
