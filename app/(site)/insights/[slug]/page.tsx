import { createServerClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data: insight } = await supabase
    .from("insights")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!insight) {
    return { title: "Not Found" };
  }

  const defaultTitle = `${insight.title} | Biondesk Insights`;
  const defaultDesc = insight.excerpt || "Read more on Biondesk Insights.";
  const ogImage = insight.og_image || insight.featured_image || "/og-image.png";

  return {
    title: insight.meta_title || defaultTitle,
    description: insight.meta_description || defaultDesc,
    openGraph: {
      title: insight.meta_title || defaultTitle,
      description: insight.meta_description || defaultDesc,
      images: [{ url: ogImage }],
      type: "article",
      publishedTime: insight.published_at,
    },
    alternates: insight.canonical_url ? { canonical: insight.canonical_url } : undefined,
  };
}

export default async function InsightDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServerClient();
  
  const { data: insight } = await supabase
    .from("insights")
    .select("*, insight_categories(name), users(name, avatar_url)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!insight) {
    notFound();
  }

  return (
    <article className="bg-slate-50 min-h-screen pt-32 pb-24">
      <div className="w-full max-w-3xl mx-auto px-4 md:px-8 overflow-hidden">
        
        {/* Breadcrumb & Meta */}
        <div className="mb-10 space-y-6">
          <Link href="/insights" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
            <i className="ph-bold ph-arrow-left"></i> Back to Insights
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium">
            {insight.insight_categories?.name && (
              <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100/50">
                {insight.insight_categories.name}
              </span>
            )}
            {insight.published_at && (
              <span className="flex items-center gap-1.5">
                <i className="ph ph-calendar-blank text-lg"></i>
                {new Date(insight.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2]">
            {insight.title}
          </h1>

          {/* Author */}
          {insight.users && (
            <div className="flex items-center gap-4 pt-6 pb-4 border-b border-slate-200">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={insight.users.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(insight.users.name)}&background=e2e8f0&color=475569`} 
                  alt={insight.users.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-base font-bold text-slate-900 leading-tight">{insight.users.name}</p>
                <p className="text-sm text-slate-500">Author</p>
              </div>
            </div>
          )}
        </div>

        {/* Featured Image */}
        {insight.featured_image && (
          <div className="mb-12 w-full aspect-[16/9] md:aspect-[2/1] rounded-2xl overflow-hidden shadow border border-slate-200 bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={insight.featured_image} 
              alt={insight.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-slate prose-indigo lg:prose-lg max-w-none w-full prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:text-indigo-700 prose-img:rounded-xl prose-img:border prose-img:border-slate-200 break-words"
          dangerouslySetInnerHTML={{ __html: insight.content }}
        />

        {/* Tags */}
        {insight.tags && insight.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-200 flex flex-wrap gap-2">
            <span className="text-sm font-medium text-slate-500 mr-2 py-1.5">Tags:</span>
            {insight.tags.map((tag: string, i: number) => (
              <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-full text-sm hover:border-indigo-200 hover:text-indigo-600 cursor-default transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
