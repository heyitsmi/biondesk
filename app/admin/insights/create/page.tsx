import { createServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import InsightForm from "../InsightForm";

export const metadata = {
  title: "Create Insight | Admin",
};

export default async function CreateInsightPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const supabase = createServerClient();
  const { data: categories } = await supabase
    .from("insight_categories")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 pb-32">
      <div>
        <Link href="/admin/insights" className="text-sm text-slate-500 hover:text-slate-900 mb-4 inline-flex items-center gap-1">
          <i className="ph ph-arrow-left"></i> Back to Insights
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Create Insight</h1>
      </div>

      <InsightForm categories={categories || []} />
    </div>
  );
}
