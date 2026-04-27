import { createServerClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import "react-quill-new/dist/quill.snow.css"; // For viewing rich text content styles

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
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        
        {/* Breadcrumb & Meta */}
        <div className="mb-8 space-y-6 text-center">
          <Link href="/insights" className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-3 py-1.5 rounded-full">
            <i className="ph-bold ph-arrow-left"></i> Back to Insights
          </Link>

          <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
            {insight.insight_categories?.name && (
              <span className="font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                {insight.insight_categories.name}
              </span>
            )}
            {insight.published_at && (
              <span className="flex items-center gap-1.5">
                <i className="ph ph-calendar-blank"></i>
                {new Date(insight.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            {insight.title}
          </h1>

          {/* Author */}
          {insight.users && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 border border-slate-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={insight.users.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(insight.users.name)}&background=e2e8f0&color=475569`} 
                  alt={insight.users.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-900">{insight.users.name}</p>
                <p className="text-xs text-slate-500">Author</p>
              </div>
            </div>
          )}
        </div>

        {/* Featured Image */}
        {insight.featured_image && (
          <div className="mb-12 aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
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
          className="prose prose-slate prose-lg md:prose-xl max-w-none ql-editor px-0"
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
