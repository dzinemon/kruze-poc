import { sanityFetch } from "@/lib/sanity";
import { relatedPostsQuery, relatedByTagsQuery } from "@kruze-poc/groq-queries";
import type { BlogPost } from "@kruze-poc/sanity-schemas/src/types";
import { BlogCard } from "@/components/blog-card";

interface RelatedPostsSectionProps {
  currentSlug: string;
  categoryIds: string[];
  tagIds: string[];
}

export async function RelatedPostsSection({ currentSlug, categoryIds, tagIds }: RelatedPostsSectionProps) {
  const [{ data: byCategory }, { data: byTagsRaw }] = await Promise.all([
    categoryIds.length > 0
      ? sanityFetch({ query: relatedPostsQuery, params: { slug: currentSlug, categoryIds } })
      : Promise.resolve({ data: [] }),
    tagIds.length > 0
      ? sanityFetch({ query: relatedByTagsQuery, params: { slug: currentSlug, tagIds } })
      : Promise.resolve({ data: [] }),
  ]) as [{ data: BlogPost[] }, { data: BlogPost[] }];

  const categoryPostIds = new Set((byCategory ?? []).map((p) => p._id));
  const byTags = (byTagsRaw ?? []).filter((p) => !categoryPostIds.has(p._id));

  if (!byCategory?.length && !byTags.length) return null;

  return (
    <section className="bg-neutral-50 dark:bg-[var(--color-bg-subtle)] py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {byCategory && byCategory.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Also Read</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {byCategory.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        )}

        {byTags.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {byTags.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
