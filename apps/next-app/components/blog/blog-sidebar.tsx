import { SidebarCalculator } from "./sidebar-calculator";
import { SidebarArticleList } from "./sidebar-article-list";

const topArticles = [
  { title: "Best Accounting + Top 20 Firms", href: "#" },
  { title: "Outsourced Accounting Services", href: "#" },
  { title: "Where to file 409A for 20% Off Valuation", href: "#" },
  { title: "Startup Tax Credit - How to Get R&D Credit", href: "#" },
  { title: "Proper Use Of Widgets Technology & How Much They Cost", href: "#" },
];

const mainArticles = [
  { title: "Startup Accounting Services", href: "#" },
  { title: "Startup Tax Filing Services", href: "#" },
  { title: "Venture Capital Firms", href: "#" },
  { title: "What is a Cap Table?", href: "#" },
  { title: "409A Valuation Guide", href: "#" },
];

export function BlogSidebar() {
  return (
    <aside className="space-y-6">
      <SidebarCalculator />
      <SidebarArticleList title="TOP ARTICLES" articles={topArticles} />
      <SidebarArticleList title="MAIN ARTICLES" articles={mainArticles} />
    </aside>
  );
}
