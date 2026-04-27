import { createServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import InsightsTable from "./InsightsTable";
import CategoriesManager from "./CategoriesManager";

export const metadata = {
  title: "Manage Insights | Biondesk Admin",
};

export default async function AdminInsightsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const supabase = createServerClient();
  
  // Fetch insights
  const { data: insights } = await supabase
    .from("insights")
    .select("*, insight_categories(name)")
    .order("created_at", { ascending: false });

  // Fetch categories
  const { data: categories } = await supabase
    .from("insight_categories")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Insights</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your blog posts, articles, and updates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CategoriesManager initialCategories={categories || []} />
          <Link
            href="/admin/insights/create"
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <i className="ph ph-plus"></i> New Insight
          </Link>
        </div>
      </div>

      {/* Table */}
      <InsightsTable initialInsights={insights || []} />
    </div>
  );
}
