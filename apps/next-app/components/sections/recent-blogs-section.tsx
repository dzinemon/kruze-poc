import { client } from "@/lib/sanity";
import { recentBlogsByCategoryQuery } from "@kruze-poc/groq-queries";
import type { RecentBlogsSection as RecentBlogsSectionType } from "@kruze-poc/sanity-schemas/src/types";
import { ArrowRight } from "lucide-react";

interface BlogCard {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  description?: string;
  heroImage?: { asset?: { url: string } };
  author?: { fullName: string };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function fetchRecentPosts(categoryId: string | null, limit: number): Promise<BlogCard[]> {
  return client.fetch<BlogCard[]>(recentBlogsByCategoryQuery, {
    categoryId: categoryId ?? null,
    limit,
  });
}

export async function RecentBlogsSection({ section }: { section: RecentBlogsSectionType }) {
  const categoryId = section.category?._id ?? null;
  const limit = section.limit ?? 3;
  const posts = await fetchRecentPosts(categoryId, limit);
  const bgClass = section.background === "light" ? "bg-neutral-50" : "bg-white";

  return (
    <section className={`${bgClass} py-20 px-6`}>
      <div className="max-w-6xl mx-auto">
        {Array.isArray(section.content) && section.content.length > 0 && (
          <div className="text-center mb-12 flex flex-col gap-3">
            {section.content
              .filter((b: any) => b._type === "block")
              .map((b: any, i: number) => {
                const text = (b.children ?? []).map((c: any) => c.text ?? "").join("");
                if (b.style === "h2") {
                  return (
                    <h2 key={i} className="text-4xl lg:text-5xl font-bold tracking-tight text-primary">
                      {text}
                    </h2>
                  );
                }
                return (
                  <p key={i} className="text-lg font-normal text-secondary leading-relaxed max-w-2xl mx-auto">
                    {text}
                  </p>
                );
              })}
          </div>
        )}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <a
                key={post._id}
                href={`/blog/${post.slug.current}`}
                className="group flex flex-col rounded-md bg-bg-subtle border border-border-subtle shadow-sm hover:shadow-md hover-lift overflow-hidden focus-ring"
              >
                {post.heroImage?.asset?.url && (
                  <div className="aspect-video overflow-hidden bg-neutral-100">
                    <img
                      src={post.heroImage.asset.url}
                      alt={post.title}
                      width={640}
                      height={360}
                      className="w-full h-full object-cover group-hover:scale-105 duration-300 transition-transform"
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <p className="text-xs font-bold text-muted uppercase tracking-wider">
                    {formatDate(post.date)}
                  </p>
                  <h3 className="text-xl font-bold text-primary leading-snug group-hover:text-brand-500 duration-300 transition-transform">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="text-sm font-normal text-secondary leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                  )}
                  <div className="mt-auto pt-3 border-t border-border-subtle flex items-center justify-between gap-4">
                    <p className="text-xs font-bold text-muted truncate">
                      {post.author?.fullName ?? ""}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-500 group-hover:text-brand-600 duration-300 transition-transform shrink-0">
                      Read more
                      <span className="group-hover:translate-x-1 duration-300 transition-transform inline-flex">
                        <ArrowRight width={12} height={12} strokeWidth={1.5} aria-hidden="true" />
                      </span>
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted text-sm">No posts found.</p>
        )}
      </div>
    </section>
  );
}
