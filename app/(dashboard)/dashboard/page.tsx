import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/dashboard/Header";
import { getCurrentUser, getUserWorkspace } from "@/lib/auth";
import {
  getDashboardStats,
  getRecentEvents,
  getOpportunities,
  getDocuments,
} from "@/lib/db";
import { Opportunity, OpportunityStage } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper for relative time
const timeAgo = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return "Just now";
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  let workspace = await getUserWorkspace(user.id);

  if (!workspace) {
    // Fallback: Create workspace if missing (e.g. legacy users or race condition in auth)
    const { createServerClient } = await import("@/lib/supabase"); // Dynamic import to avoid cycles if any
    const supabase = createServerClient();

    const { data: newWorkspace, error } = await supabase
      .from("workspaces")
      .insert({
        user_id: user.id,
        name: `${user.name || "My"} Workspace`,
        currency: "USD",
        locale: "en-US",
      })
      .select()
      .single();

    if (newWorkspace) {
      workspace = newWorkspace;
    } else {
      console.error("Failed to auto-create workspace:", error);
      // Handle onboarding or error state
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">No workspace found.</p>
            <p className="text-sm text-slate-500 mb-4">
              Please contact support or try refreshing.
            </p>
            <a href="/dashboard" className="text-indigo-600 hover:underline">
              Refresh Page
            </a>
          </div>
        </div>
      );
    }
  }

  // Parallel Data Fetching
  const [stats, recentEvents, allOpportunities, overdueInvoices] =
    await Promise.all([
      getDashboardStats(workspace.id),
      getRecentEvents(workspace.id, 5),
      getOpportunities(workspace.id, { limit: 100 }), // Fetch recent opportunities for pipeline calc
      getDocuments(workspace.id, {
        type: "invoice",
        status: "overdue",
        limit: 5,
      }),
    ]);

  // 1. Calculate Pipeline Stats (Value & Change)
  // Filter active opportunities (not won, lost, archived)
  const activeOpps = allOpportunities.data.filter(
    (o) => !["won", "lost", "archived"].includes(o.stage),
  );

  const pipelineValue = activeOpps.reduce((sum, o) => sum + (o.value || 0), 0);

  // Mock change for now as we don't have historical snapshots
  const pipelineChange = "+0%";

  // 2. Win Rate Calculation
  // We need total closed deals (won + lost)
  // Note: getDashboardStats gives us total won, but not lost.
  // We can iterate allOpportunities if limit is high enough, or rely on stats if updated.
  // For accuracy with pagination limits, ideally we'd have a DB aggregation.
  // Here we approximate with loaded data or use what we have.
  // Let's rely on the loaded batch for "Recent Win Rate" or similar if dataset is large
  // OR filter the loaded opportunities if we fetched enough.
  // let's assume allOpportunities (limit 100) covers recent history for "Trend".
  const closedOpps = allOpportunities.data.filter((o) =>
    ["won", "lost"].includes(o.stage),
  );
  const wonOpps = closedOpps.filter((o) => o.stage === "won");

  let winRate = 0;
  if (closedOpps.length > 0) {
    winRate = Math.round((wonOpps.length / closedOpps.length) * 100);
  }

  // 3. Priority Actions
  const priorityActions: any[] = [];

  // Action: Overdue Invoices
  overdueInvoices.data.forEach((inv) => {
    priorityActions.push({
      id: `inv-${inv.id}`,
      type: "overdue",
      icon: "ph-bold ph-warning",
      iconBg: "bg-rose-50 border-rose-100",
      iconColor: "text-rose-600",
      title: `Invoice ${inv.number} Overdue`,
      subtitle: `Client: ${inv.contact?.name || "Unknown"} • Due ${inv.due_date ? timeAgo(inv.due_date) : ""}`,
      action: "Send Reminder",
      href: `/invoices/${inv.id}`,
    });
  });

  // Action: Stalled Proposals (e.g. sent > 3 days ago)
  const stalledOpps = activeOpps
    .filter((o) => {
      if (o.stage !== "sent" && o.stage !== "negotiation") return false;
      const lastUpdated = new Date(o.updated_at).getTime();
      const diffDays =
        (new Date().getTime() - lastUpdated) / (1000 * 3600 * 24);
      return diffDays > 3;
    })
    .slice(0, 3);

  stalledOpps.forEach((opp) => {
    priorityActions.push({
      id: `opp-${opp.id}`,
      type: "followup",
      icon: "ph-bold ph-paper-plane-tilt",
      iconBg: "bg-indigo-50 border-indigo-100",
      iconColor: "text-indigo-600",
      title: `Follow up: ${opp.title}`,
      subtitle: `Stage: ${opp.stage} • Last updated ${timeAgo(opp.updated_at)}`,
      action: "Write Follow-up",
      href: `/opportunities/${opp.id}`,
    });
  });

  // Limit actions
  const displayActions = priorityActions.slice(0, 3);
  if (displayActions.length === 0) {
    // Add a placeholder "All good" action or "Create new"
    displayActions.push({
      id: "create-new",
      type: "draft",
      icon: "ph-bold ph-plus",
      iconBg: "bg-slate-50 border-slate-100",
      iconColor: "text-slate-500",
      title: "No urgent actions required",
      subtitle: "Start a new opportunity to grow your pipeline.",
      action: "New Opportunity",
      href: "/opportunities/create",
    });
  }

  // 4. Pipeline Snapshot Data
  const pipelineCounts = {
    opportunities: {
      count: activeOpps.filter((o) =>
        ["inbox", "drafting", "sent"].includes(o.stage),
      ).length,
      items: activeOpps
        .filter((o) => ["inbox", "drafting", "sent"].includes(o.stage))
        .slice(0, 3)
        .map((o) => o.title),
    },
    negotiation: {
      count: activeOpps.filter((o) => o.stage === "negotiation").length,
      items: activeOpps
        .filter((o) => o.stage === "negotiation")
        .slice(0, 3)
        .map((o) => ({
          name: o.title,
          value: o.value ? formatCurrency(o.value) : "-",
        })),
    },
  };

  // Calculate progress bars (arbitrary visual scale vs total active)
  const totalActive = activeOpps.length || 1;
  const oppsProgress = Math.round(
    (pipelineCounts.opportunities.count / totalActive) * 100,
  );
  const negProgress = Math.round(
    (pipelineCounts.negotiation.count / totalActive) * 100,
  );

  // 5. Recent Activity Formatting
  const mappedActivity = recentEvents.map((event) => {
    let icon = "ph-fill ph-info";
    let statusClass = "bg-slate-100 text-slate-600 border-slate-200";
    let statusText = "Logged";
    let entityName = "Unknown Entity";

    // Basic mapping based on action and type
    if (event.action.includes("created")) {
      icon = "ph-fill ph-plus-circle";
      statusText = "Created";
    } else if (event.action.includes("sent")) {
      icon = "ph-fill ph-paper-plane-right";
      statusText = "Sent";
      statusClass = "bg-blue-50 text-blue-600 border-blue-100";
    } else if (event.action.includes("paid") || event.action === "won") {
      icon = "ph-fill ph-check-circle";
      statusText = event.action === "won" ? "Won" : "Paid";
      statusClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
    } else if (event.action === "lost") {
      icon = "ph-fill ph-x-circle";
      statusText = "Lost";
      statusClass = "bg-rose-50 text-rose-700 border-rose-100";
    } else if (event.action.includes("reminder")) {
      icon = "ph-fill ph-bell-ringing";
      statusText = "Reminded";
      statusClass = "bg-amber-50 text-amber-600 border-amber-100";
    }

    // Try to get a readable name from metadata if available, otherwise generic
    // In real app, we might need to join or fetch entity details if not in feed
    // For now, we'll try to be generic or use ID
    if (event.entity_type === "opportunity") entityName = "Opportunity";
    if (event.entity_type === "document") entityName = "Document";
    if (event.entity_type === "contact") entityName = "Contact";

    return {
      id: event.id,
      icon,
      entity: entityName,
      action: event.action.replace("_", " "), // e.g. "reminder_sent" -> "reminder sent"
      date: timeAgo(event.created_at),
      status: statusText,
      statusClass,
    };
  });

  return (
    <>
      <Header
        title="Dashboard"
        focusItems={
          displayActions.length > 0
            ? displayActions.map((a) => a.title).slice(0, 2)
            : ["Check your pipeline"]
        }
      />

      {/* Dashboard Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="w-full space-y-8">
          {/* 1. KPI Cards (Metrics) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric: Pipeline */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card flex flex-col justify-between group hover:border-indigo-200 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-[600] text-slate-500 uppercase tracking-wide">
                    Pipeline Value
                  </p>
                  <h3 className="text-2xl font-[600] text-slate-900 mt-1">
                    {formatCurrency(pipelineValue)}
                  </h3>
                </div>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <i className="ph ph-trend-up"></i>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-[500]">
                <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                  {pipelineChange}
                </span>
                <span className="text-slate-400">vs last month</span>
              </div>
            </div>

            {/* Metric: Outstanding Invoices */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card flex flex-col justify-between group hover:border-amber-200 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-[600] text-slate-500 uppercase tracking-wide">
                    To Be Collected
                  </p>
                  <h3 className="text-2xl font-[600] text-slate-900 mt-1">
                    {formatCurrency(stats.pendingAmount + stats.overdueAmount)}
                  </h3>
                </div>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <i className="ph ph-wallet"></i>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-[500]">
                <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                  {overdueInvoices.data.length} Overdue
                </span>
                <span className="text-slate-400">invoices</span>
              </div>
            </div>

            {/* Metric: Success Rate */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card flex flex-col justify-between group hover:border-emerald-200 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-[600] text-slate-500 uppercase tracking-wide">
                    Win Rate
                  </p>
                  <h3 className="text-2xl font-[600] text-slate-900 mt-1">
                    {winRate}%
                  </h3>
                </div>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <i className="ph ph-target"></i>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-[500]">
                <span className="text-slate-400">
                  Based on last {closedOpps.length} deals
                </span>
              </div>
            </div>
          </div>

          {/* 2. Split Layout: Priority Actions & Pipeline Snapshot */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: Priority Actions (The "To-Do" list) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-[600] text-slate-900">
                  Priority Actions
                </h2>
                <Link
                  href="/opportunities"
                  className="text-sm font-[550] text-indigo-600 hover:text-indigo-700"
                >
                  View all
                </Link>
              </div>

              {displayActions.map((action) => (
                <Link
                  key={action.id}
                  href={action.href}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4 flex-1 w-full min-w-0">
                    <div
                        className={`w-10 h-10 rounded-full ${action.iconBg} border flex items-center justify-center shrink-0`}
                    >
                        <i className={`${action.icon} ${action.iconColor}`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-[600] text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {action.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {action.subtitle}
                        </p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-[600] rounded-lg hover:border-slate-300 hover:text-slate-900 transition-all whitespace-nowrap self-start sm:self-auto max-sm:w-full max-sm:text-center">
                    {action.action}
                  </span>
                </Link>
              ))}
            </div>

            {/* RIGHT: Pipeline Snapshot (Mini List) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-[600] text-slate-900">Pipeline</h2>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle space-y-5">
                {/* Stage: Opportunities */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-[600] text-slate-500">
                      OPPORTUNITIES
                    </span>
                    <span className="text-xs font-[600] text-slate-900">
                      {pipelineCounts.opportunities.count} Active
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full"
                      style={{ width: `${oppsProgress}%` }}
                    ></div>
                  </div>
                  <div className="mt-3 space-y-2">
                    {pipelineCounts.opportunities.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                        <p className="text-sm font-[450] text-slate-700 truncate">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Stage: Negotiation */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-[600] text-slate-500">
                      NEGOTIATION
                    </span>
                    <span className="text-xs font-[600] text-slate-900">
                      {pipelineCounts.negotiation.count} Deals
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className="bg-amber-400 h-1.5 rounded-full"
                      style={{ width: `${negProgress}%` }}
                    ></div>
                  </div>
                  <div className="mt-3 space-y-2">
                    {pipelineCounts.negotiation.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                        <p className="text-sm font-[450] text-slate-700 truncate">
                          {item.name}
                        </p>
                        <span className="ml-auto text-xs text-slate-400">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mini Promo for AI */}
              <Link
                href="/opportunities/create"
                className="block bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-5 text-white shadow-lg relative overflow-hidden group cursor-pointer"
              >
                <div className="relative z-10">
                  <h3 className="text-base font-[600] mb-1">
                    Generate Proposal
                  </h3>
                  <p className="text-xs font-[400] text-indigo-100 mb-3">
                    Turn a messy job post into a winning proposal in seconds.
                  </p>
                  <div className="inline-flex items-center gap-1 text-xs font-[600] bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-colors">
                    <span>Try AI Draft</span>
                    <i className="ph-bold ph-arrow-right"></i>
                  </div>
                </div>
                {/* Decor */}
                <i className="ph ph-magic-wand absolute -right-2 -bottom-2 text-6xl text-white/10 rotate-12 group-hover:scale-110 transition-transform"></i>
              </Link>
            </div>
          </div>

          {/* 3. Recent Activity (History) */}
          <div>
            <h2 className="text-lg font-[600] text-slate-900 mb-4">
              Recent Activity
            </h2>
            {mappedActivity.length > 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">
                        Entity
                      </th>
                      <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-xs font-[600] text-slate-500 uppercase tracking-wider text-right">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mappedActivity.map((activity) => (
                      <tr
                        key={activity.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                              <i className={activity.icon}></i>
                            </div>
                            <span className="text-sm font-[500] text-slate-900 capitalize">
                              {activity.entity}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 capitalize">
                          {activity.action}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {activity.date}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-[500] border ${activity.statusClass}`}
                          >
                            {activity.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
                <p className="text-slate-500 text-sm">
                  No recent activity found.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 mb-6 text-center">
          <p className="text-xs text-slate-400">
            © 2026 Biondesk. Crafted for growth.
          </p>
        </div>
      </div>
    </>
  );
}
