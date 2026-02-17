"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  user?: {
    name: string;
    email: string;
    avatar_url?: string;
    plan: string;
  };
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ user, isMobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isActive = (path: string) => pathname.startsWith(path);

  const menuItems = [
    {
      section: null,
      items: [
        { name: "Dashboard", path: "/dashboard", icon: "ph-squares-four" },
        { name: "Analytics", path: "/analytics", icon: "ph-chart-pie-slice" },
      ],
    },
    {
      section: "Growth & Sales",
      items: [
        {
          name: "Opportunities",
          path: "/opportunities",
          icon: "ph-rocket-launch",
        },
        { name: "Proposals", path: "/proposals", icon: "ph-scroll" },
        { name: "TapTone", path: "/taptone", icon: "ph-magic-wand" },
      ],
    },
    {
      section: "Operations",
      items: [
        { name: "Contacts", path: "/contacts", icon: "ph-users" },
        { name: "Quotations", path: "/quotations", icon: "ph-file-text" },
        { name: "Invoices", path: "/invoices", icon: "ph-receipt" },
        { name: "Reminders", path: "/reminders", icon: "ph-bell-ringing" },
        { name: "Calculator", path: "/calculator", icon: "ph-calculator" },
        { name: "AI Usage", path: "/ai-usage", icon: "ph-robot" },
      ],
    },
    {
      section: "Assets",
      items: [
        { name: "Templates", path: "/templates", icon: "ph-stack" },
        {
          name: "Profile Library",
          path: "/profile-library",
          icon: "ph-user-circle",
        },
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
      className={`${mobileClasses} ${isCollapsed ? "lg:w-[80px]" : "lg:w-[260px]"} bg-white border-r border-slate-200 flex flex-col shrink-0 z-30 transition-all duration-300 lg:relative shadow-2xl lg:shadow-none`}
    >
      {/* Brand & Toggle Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 transition-all duration-300">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-slate-900 overflow-hidden whitespace-nowrap"
          onClick={onMobileClose} // Close drawer on link click
        >
          <div className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-white overflow-hidden">
            <img
              src="/favicon/favicon-32x32.png"
              alt="Biondesk"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-[650] tracking-tight transition-opacity duration-200">
              Biondesk.
            </span>
          )}
        </Link>
        
        {/* Mobile Close Button */}
        <button
            onClick={onMobileClose}
            className="lg:hidden text-slate-400 hover:text-slate-600"
        >
            <i className="ph ph-x text-xl"></i>
        </button>

        {/* Desktop Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:block text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded-md hover:bg-slate-50 shrink-0"
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
              <div className="px-3 mb-2 text-[11px] font-[600] text-slate-400 uppercase tracking-wider whitespace-nowrap overflow-hidden transition-opacity duration-200">
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
                      ? "text-indigo-700 bg-indigo-50/80"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  } ${isCollapsed ? "lg:justify-center" : ""}`}
                  title={item.name}
                >
                  <i
                    className={`ph ${item.icon} text-xl shrink-0 ${
                      isActive(item.path)
                        ? ""
                        : "text-slate-400 group-hover:text-indigo-600"
                    } transition-colors`}
                  ></i>
                  {(!isCollapsed || (isMobileOpen && !isCollapsed)) && (
                    <span className={`transition-opacity duration-200 ${isCollapsed ? 'lg:hidden' : ''}`}>
                      {item.name}
                    </span>
                  )}
                  {/* Tooltip for collapsed state (Desktop only) */}
                  {isCollapsed && (
                    <div className="hidden lg:block absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile (Bottom) & Popover */}
      <div className="p-4 border-t border-slate-100 relative">
        {/* Popover Menu */}
        {isUserMenuOpen && (
          <div className="absolute bottom-20 left-4 w-60 bg-white border border-slate-200 rounded-xl shadow-dropdown z-50 p-1 animate-fade-in-up origin-bottom-left">
            <div className="px-3 py-2 border-b border-slate-100 mb-1">
              <p className="text-sm font-[600] text-slate-900">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-slate-500">
                {user?.email || "email@example.com"}
              </p>
            </div>
            <Link
              href="/settings"
              onClick={onMobileClose}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <i className="ph ph-gear"></i> Settings
            </Link>
            <div className="h-px bg-slate-100 my-1"></div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <i className="ph ph-sign-out"></i> Sign out
            </button>
          </div>
        )}

        {/* Profile Trigger Button */}
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className={`flex items-center gap-3 w-full p-2 hover:bg-slate-50 rounded-lg transition-all text-left group overflow-hidden ${isCollapsed ? "lg:justify-center" : ""}`}
        >
          <div className="w-9 h-9 shrink-0 rounded-full bg-slate-200 border border-slate-300 overflow-hidden relative">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=0f172a&color=fff`}
                alt="User"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <>
              <div className={`flex-1 min-w-0 transition-opacity duration-200 ${isCollapsed ? 'lg:hidden' : ''}`}>
                <p className="text-sm font-[600] text-slate-900 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs font-[450] text-slate-500 truncate capitalize">
                  {user?.plan || "Free"} Plan
                </p>
              </div>
              <i className={`ph ph-caret-up text-slate-400 ${isCollapsed ? 'lg:hidden' : ''}`}></i>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
