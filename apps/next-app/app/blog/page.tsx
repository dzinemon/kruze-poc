import type { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity";
import { blogPostsListQuery } from "@kruze-poc/groq-queries";
import type { BlogPost } from "@kruze-poc/sanity-schemas/src/types";
import { BlogCard } from "@/components/blog-card";

export const metadata: Metadata = {
  title: "Blog — Kruze POC",
};

export default async function BlogListingPage() {
  const { data: posts } = await sanityFetch({
    query: blogPostsListQuery,
  }) as { data: BlogPost[] };

  return (
    <div className="max-w-container-lg mx-auto px-4 py-16">
      <h1 className="text-4xl font-black text-body mb-8">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-secondary">
          No blog posts yet. Create one in Sanity Studio.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
