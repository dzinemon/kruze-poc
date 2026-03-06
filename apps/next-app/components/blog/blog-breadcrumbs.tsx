import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BlogBreadcrumbsProps {
  title: string;
}

export function BlogBreadcrumbs({ title }: BlogBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <ol className="flex items-center gap-1 text-sm flex-wrap">
          <li>
            <Link href="/" className="text-muted hover:text-brand-500 transition-fast focus-ring rounded-sm">
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={14} strokeWidth={1.5} className="text-muted" />
          </li>
          <li>
            <Link href="/blog" className="text-muted hover:text-brand-500 transition-fast focus-ring rounded-sm">
              Blog
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={14} strokeWidth={1.5} className="text-muted" />
          </li>
          <li aria-current="page" className="text-secondary font-bold">
            {title}
          </li>
        </ol>
      </div>
    </nav>
  );
}
