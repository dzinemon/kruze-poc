import Link from "next/link";
import { BookOpenCheck, User, ArrowRight } from "lucide-react";
import type { BlogPost } from "@kruze-poc/sanity-schemas/src/types";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const category = post.topicCategories?.[0];
  const readTime = post.readTime ? Math.max(1, post.readTime) : null;
  const authorSubtitle = [post.author?.certification, post.author?.position]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="group relative rounded-md overflow-hidden bg-white dark:bg-[var(--color-bg-subtle)] border border-neutral-200 dark:border-white/10 shadow-sm hover-lift flex flex-col">
      <Link
        href={`/blog/${post.slug.current}`}
        className="absolute inset-0 z-10 focus-ring rounded-md"
        aria-label={`Read: ${post.title}`}
      />

      {/* Image */}
      <div className="overflow-hidden aspect-video">
        {post.heroImage?.asset?.url ? (
          <img
            src={post.heroImage.asset.url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/60 dark:to-brand-800/40 flex items-center justify-center">
            <BookOpenCheck
              size={40}
              strokeWidth={0.8}
              aria-hidden="true"
              className="text-brand-400 dark:text-brand-500"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {category && (
          <span className="self-start px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/40 text-xs font-black text-brand-700 dark:text-brand-300">
            {category.title}
          </span>
        )}

        <h3 className="text-xl font-bold leading-snug text-neutral-800 dark:text-neutral-100 group-hover:text-brand-500 transition-colors duration-200">
          {post.title}
        </h3>

        <p className="text-sm text-neutral-400 dark:text-neutral-500">
          {formattedDate && (
            <span className="font-bold text-neutral-600 dark:text-neutral-300">{formattedDate}</span>
          )}
          {readTime && ` · ${readTime} min read`}
        </p>

        {post.description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-3">
            {post.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-100 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center">
              {post.author?.image?.asset?.url ? (
                <img
                  src={post.author.image.asset.url}
                  alt={post.author.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User
                  size={16}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="text-brand-500"
                />
              )}
            </div>
            {post.author && (
              <div>
                <p className="text-sm font-bold text-neutral-700 dark:text-neutral-200">{post.author.fullName}</p>
                {authorSubtitle && (
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">{authorSubtitle}</p>
                )}
              </div>
            )}
          </div>

          <div className="text-brand-500 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true">
            <ArrowRight size={20} strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </article>
  );
}
