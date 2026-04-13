import { client } from "@/lib/sanity";
import { recentBlogsByCategoryQuery } from "@kruze-poc/groq-queries";
import type { BlogPost, RecentBlogsSection as RecentBlogsSectionType } from "@kruze-poc/sanity-schemas/src/types";
import { heading } from "@kruze-poc/ui/styles";
import { BlogCard } from "@/components/blog-card";

async function fetchRecentPosts(categoryId: string | null, limit: number): Promise<BlogPost[]> {
  return client.fetch<BlogPost[]>(recentBlogsByCategoryQuery, {
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
    <section className={`${bgClass} py-20 px-4`}>
      <div className="max-w-6xl mx-auto">
        {Array.isArray(section.content) && section.content.length > 0 && (
          <div className="text-center mb-12 flex flex-col gap-3">
            {section.content
              .filter((b: any) => b._type === "block")
              .map((b: any, i: number) => {
                const text = (b.children ?? []).map((c: any) => c.text ?? "").join("");
                if (b.style === "h2") {
                  return (
                    <h2 key={i} className={heading.h2}>
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
                <BlogCard key={post._id} post={post} />
              ))}
          </div>
        ) : (
          <p className="text-center text-dim text-sm">No posts found.</p>
        )}
      </div>
    </section>
  );
}
