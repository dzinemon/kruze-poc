import Link from "next/link";

interface SidebarArticleListProps {
  title: string;
  articles: Array<{ title: string; href: string }>;
}

export function SidebarArticleList({ title, articles }: SidebarArticleListProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-black text-body mb-4">{title}</h3>
      <ul className="space-y-3">
        {articles.map((article, index) => (
          <li key={index}>
            <Link
              href={article.href}
              className="text-sm text-primary hover:text-primary-dark hover:underline"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
