import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient, imageBuilder } from "@/lib/sanity";
import { blogPostQuery } from "@kruze-poc/groq-queries";
import type { BlogPost } from "@kruze-poc/sanity-schemas/src/types";
import { KruzePortableText } from "@kruze-poc/ui/portable-text";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import Image from "next/image";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await sanityClient.fetch<{ slug: { current: string } }[]>(
    `*[_type == "blogPost"]{ slug }`
  );
  return posts.map((p) => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityClient.fetch<BlogPost>(blogPostQuery, { slug });
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} — Kruze POC`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await sanityClient.fetch<BlogPost>(blogPostQuery, { slug });
  if (!post) notFound();

  const heroImageUrl = post.heroImage?.asset
    ? imageBuilder.image(post.heroImage).width(1920).height(1080).url()
    : null;

  const authorImageUrl = post.author?.image?.asset
    ? imageBuilder.image(post.author.image).width(80).height(80).url()
    : null;

  return (
    <article>
      {heroImageUrl && (
        <div className="relative w-full h-64 md:h-96 overflow-hidden bg-primary">
          <Image
            src={heroImageUrl}
            alt={post.heroImage?.alt || post.title}
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <h1 className="text-3xl md:text-5xl font-black text-white text-center max-w-4xl uppercase">
              {post.title}
            </h1>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="text-sm text-muted mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-primary">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-secondary">{post.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div>
            {post.author && (
              <div className="flex items-center gap-4 mb-6">
                {authorImageUrl ? (
                  <Image
                    src={authorImageUrl}
                    alt={post.author.fullName}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-black text-xl">
                    {post.author.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                )}
                <div>
                  <div className="font-black text-body">{post.author.fullName}</div>
                  {post.author.position && (
                    <div className="text-sm text-secondary">{post.author.position}</div>
                  )}
                </div>
              </div>
            )}

            {post.date && (
              <div className="text-sm text-muted mb-8">
                Published{" "}
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            )}

            {post.headlineText && (
              <p className="text-xl text-secondary mb-8">{post.headlineText}</p>
            )}

            {post.body && <KruzePortableText value={post.body} />}

            {post.topicCategories && post.topicCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-200">
                <span className="font-bold text-secondary mr-2">Categories:</span>
                {post.topicCategories.map((cat) => (
                  <Link
                    key={cat._id}
                    href="#"
                    className="px-3 py-1 text-xs font-bold bg-gray-100 text-secondary rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-8 self-start">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </article>
  );
}
