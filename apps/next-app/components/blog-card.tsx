import Link from "next/link";
import type { BlogPost } from "@kruze-poc/sanity-schemas/src/types";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group block border border-gray-200 rounded-lg overflow-hidden hover:border-primary transition-colors"
    >
      {post.heroImage?.asset?.url && (
        <div className="h-48 overflow-hidden bg-gray-100">
          <img
            src={post.heroImage.asset.url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-4">
        <h2 className="text-lg font-bold text-body mb-2 group-hover:text-primary transition-colors">
          {post.title}
        </h2>

        {post.description && (
          <p className="text-sm text-secondary line-clamp-2 mb-3">
            {post.description}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-muted">
          {post.author && <span>{post.author.fullName}</span>}
          {post.date && (
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          )}
        </div>
      </div>
    </Link>
  );
}
