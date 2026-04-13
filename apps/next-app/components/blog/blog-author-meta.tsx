import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import type { Author } from "@kruze-poc/sanity-schemas/src/types";

interface BlogAuthorMetaProps {
  author?: Author;
  authorImageUrl?: string | null;
  date?: string;
  modifiedDate?: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogAuthorMeta({ author, authorImageUrl, date, modifiedDate }: BlogAuthorMetaProps) {
  if (!author && !date) return null;

  const authorSubtitle = [author?.certification, author?.position].filter(Boolean).join(", ");

  return (
    <div className="flex flex-row items-center justify-between gap-2 md:gap-4 pb-4 mb-4 md:pb-6 md:mb-6 border-b border-divider">
      {author && (
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-brand-50 dark:bg-brand-900/40 flex items-center justify-center">
            {authorImageUrl ? (
              <Image
                src={authorImageUrl}
                alt={author.fullName}
                width={48}
                height={48}
                className="object-cover h-auto w-8"
              />
            ) : (
              <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
                {author.fullName.split(" ").map((n) => n[0]).join("")}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-primary">{author.fullName}</p>
            {authorSubtitle && (
              <p className="text-xs text-dim">{authorSubtitle}</p>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1 sm:text-right">
        {date && (
          <p className="flex items-center gap-1.5 sm:justify-end text-sm text-dim">
            <Calendar size={14} strokeWidth={1.5} aria-hidden="true" />
            <span>Published: <time dateTime={date} className="text-secondary font-bold">{formatDate(date)}</time></span>
          </p>
        )}
        {modifiedDate && (
          <p className="flex items-center gap-1.5 sm:justify-end text-sm text-dim">
            <Clock size={14} strokeWidth={1.5} aria-hidden="true" />
            <span>Last updated: <time dateTime={modifiedDate} className="text-secondary font-bold">{formatDate(modifiedDate)}</time></span>
          </p>
        )}
      </div>
    </div>
  );
}
