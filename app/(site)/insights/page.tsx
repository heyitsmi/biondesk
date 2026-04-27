import { createServerClient } from "@/lib/supabase";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights | Biondesk Workspace",
  description: "Read our latest articles, guides, and updates on freelancing, agency growth, and client management.",
};

export default async function InsightsPage() {
  const supabase = createServerClient();
  
  const { data: insights } = await supabase
    .from("insights")
    .select("*, insight_categories(name)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
            Insights & Guides
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Discover the latest strategies, updates, and thoughts on running a successful independent business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!insights || insights.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500">
              Check back soon for new insights.
            </div>
          ) : (
            insights.map((insight) => (
              <Link 
                key={insight.id} 
                href={`/insights/${insight.slug}`}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                  {insight.featured_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={insight.featured_image} 
                      alt={insight.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <i className="ph ph-image text-4xl"></i>
                    </div>
                  )}
                  {insight.insight_categories?.name && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full">
                      {insight.insight_categories.name}
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-xs font-medium text-indigo-600 mb-3">
                    {insight.published_at ? new Date(insight.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Recently"}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {insight.title}
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                    {insight.excerpt || "Read more about this topic..."}
                  </p>
                  <div className="text-indigo-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read article <i className="ph-bold ph-arrow-right"></i>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
