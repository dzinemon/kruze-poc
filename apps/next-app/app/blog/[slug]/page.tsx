import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { client, imageBuilder, sanityFetch } from "@/lib/sanity";
import { blogPostQuery } from "@kruze-poc/groq-queries";
import type { BlogPost } from "@kruze-poc/sanity-schemas/src/types";
import { PortableTextHybrid } from "@/components/portable-text-hybrid";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { BlogBreadcrumbs } from "@/components/blog/blog-breadcrumbs";
import { BlogAuthorMeta } from "@/components/blog/blog-author-meta";
import { RelatedPostsSection } from "@/components/blog/related-posts-section";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "blogPost"]{ slug }`
  );
  return posts.map((p) => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch<BlogPost>(blogPostQuery, { slug });
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} — Kruze POC`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const { data: post } = await sanityFetch({
    query: blogPostQuery,
    params: { slug },
  }) as { data: BlogPost };
  if (!post) notFound();

  const heroImageUrl = post.heroImage?.asset
    ? imageBuilder.image(post.heroImage).width(1200).height(675).url()
    : null;

  const authorImageUrl = post.author?.image?.asset
    ? imageBuilder.image(post.author.image).width(96).height(96).url()
    : null;

  const categoryIds = post.topicCategories?.map((c) => c._id) ?? [];
  const tagIds = post.topicTags?.map((t) => t._id) ?? [];

  return (
    <article>
      <BlogBreadcrumbs title={post.title} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 xl:gap-12">

          {/* Main content */}
          <div className="min-w-0">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-primary mb-6">
              {post.headlineText}
            </h1>

            <BlogAuthorMeta
              author={post.author}
              authorImageUrl={authorImageUrl}
              date={post.date}
              modifiedDate={post.modifiedDate}
            />

            {heroImageUrl && (
              <div className="relative rounded-md overflow-hidden mb-8 aspect-video">
                <Image
                  src={heroImageUrl}
                  alt={post.heroImage?.alt || post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />
              </div>
            )}

            {post.body && <PortableTextHybrid value={post.body} />}

            {post.topicCategories && post.topicCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-divider">
                <span className="text-sm font-bold text-secondary mr-2">Categories:</span>
                {post.topicCategories.map((cat) => (
                  <Link
                    key={cat._id}
                    href="#"
                    className="px-3 py-1 text-xs font-black bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 rounded-full border border-brand-200 dark:border-brand-800 hover:bg-brand-100 transition-fast"
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-8 self-start">
            <BlogSidebar />
          </div>

        </div>
      </div>

      <RelatedPostsSection
        currentSlug={post.slug.current}
        categoryIds={categoryIds}
        tagIds={tagIds}
      />
    </article>
  );
}
