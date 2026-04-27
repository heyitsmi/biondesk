import { createServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import InsightForm from "../../InsightForm";

export const metadata = {
  title: "Edit Insight | Admin",
};

export default async function EditInsightPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const supabase = createServerClient();
  
  const [insightRes, categoriesRes] = await Promise.all([
    supabase.from("insights").select("*").eq("id", id).single(),
    supabase.from("insight_categories").select("*").order("name", { ascending: true }),
  ]);

  if (insightRes.error || !insightRes.data) {
    notFound();
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 pb-32">
      <div>
        <Link href="/admin/insights" className="text-sm text-slate-500 hover:text-slate-900 mb-4 inline-flex items-center gap-1">
          <i className="ph ph-arrow-left"></i> Back to Insights
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Edit Insight</h1>
      </div>

      <InsightForm 
        initialData={insightRes.data} 
        categories={categoriesRes.data || []} 
      />
    </div>
  );
}
