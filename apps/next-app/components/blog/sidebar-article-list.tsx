import Link from "next/link";

interface SidebarArticleListProps {
  title: string;
  articles: Array<{ title: string; href: string }>;
}

export function SidebarArticleList({ title, articles }: SidebarArticleListProps) {
  return (
    <div className="rounded-md bg-bg-subtle border border-border-subtle p-5">
      <h3 className="text-xs font-black tracking-wide uppercase text-muted mb-3">{title}</h3>
      <ul className="space-y-3">
        {articles.map((article, index) => (
          <li key={index} className={index > 0 ? "border-t border-border-subtle pt-3" : ""}>
            <Link
              href={article.href}
              className="text-sm text-brand-500 hover:text-brand-600 transition-fast focus-ring rounded-sm"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
