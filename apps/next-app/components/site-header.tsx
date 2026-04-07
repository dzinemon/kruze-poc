import Link from "next/link";
import { Phone } from "lucide-react";
import { sanityFetch } from "@/lib/sanity";
import { siteNavigationQuery } from "@kruze-poc/groq-queries";
import type { SiteNavigation, NavItem } from "@kruze-poc/sanity-schemas/src/types";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavScrollEffect } from "@/components/nav-scroll-effect";
import { MobileMenu } from "@/components/mobile-menu";

function DropdownPanel({ item }: { item: NavItem }) {
  if (!item.dropdownColumns?.length) return null;

  return (
    <div className="nav-dropdown absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50">
      <div className="bg-base border border-divider rounded-md shadow-lg min-w-[680px] p-6">
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: `repeat(${item.dropdownColumns.length}, minmax(0, 1fr))` }}
        >
          {item.dropdownColumns.map((col) => (
            <div key={col._key}>
              {col.featured && col.featuredImage?.asset?.url ? (
                <div>
                  {col.heading && (
                    <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">
                      {col.heading}
                    </p>
                  )}
                  <a
                    href={col.featuredImageUrl ?? "#"}
                    className="block relative rounded-md overflow-hidden border border-divider hover:border-brand-500 transition-fast"
                  >
                    <img
                      src={col.featuredImage.asset.url}
                      alt={col.heading ?? "Featured"}
                      className="w-full object-cover"
                      width={255}
                      height={160}
                    />
                    {col.featuredImageLinkText && (
                      <div className="mt-2 text-center">
                        <span className="inline-block text-xs font-bold text-white bg-brand-500 px-3 py-1 rounded-full">
                          {col.featuredImageLinkText}
                        </span>
                      </div>
                    )}
                  </a>
                </div>
              ) : (
                <div>
                  {col.heading && (
                    <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">
                      {col.heading}
                    </p>
                  )}
                  <ul className="space-y-1">
                    {col.navLinks?.map((link) => (
                      <li key={link._key}>
                        <a
                          href={link.url}
                          className="group/link flex flex-col py-1 hover:text-brand-500 transition-fast"
                        >
                          <span className="text-sm font-bold text-primary group-hover/link:text-brand-500">
                            {link.title}
                          </span>
                          {link.helpText && (
                            <span className="text-xs text-secondary">{link.helpText}</span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
        {item.dropdownInfoBar?.text && (
          <div className="mt-4 pt-4 border-t border-divider text-center">
            <a
              href={item.dropdownInfoBar.linkUrl ?? "#"}
              className="text-sm font-bold text-brand-500 hover:text-brand-600 transition-fast"
            >
              {item.dropdownInfoBar.text}
              {item.dropdownInfoBar.linkText && ` — ${item.dropdownInfoBar.linkText}`}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="transition-transform duration-200 group-hover:rotate-180"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export async function SiteHeader() {
  const nav = await sanityFetch({ query: siteNavigationQuery });
  const data = (nav?.data as SiteNavigation | null) ?? null;

  return (
    <header className="sticky top-0 z-50 bg-base border-b border-divider" data-nav>
      <NavScrollEffect />
      {data?.infoBar?.enabled && (
        <div className="bg-brand-800 text-white text-center text-xs md:text-sm py-1 md:px-4 px-2">
          <span>{data.infoBar.text}</span>
          {data.infoBar.linkUrl && (
            <Link
              href={data.infoBar.linkUrl}
              className="ml-2 font-bold underline hover:no-underline"
            >
              {data.infoBar.linkText} →
            </Link>
          )}
        </div>
      )}

      <nav className="max-w-7xl mx-auto px-4 py-0 flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-black text-primary flex-shrink-0">
          Kruze POC
        </Link>

        {data?.navItems && data.navItems.length > 0 ? (
          <ul className="hidden lg:flex items-center gap-1" role="list">
            {data.navItems.map((item: NavItem) => (
              <li key={item._key} className="relative group">
                {item.url ? (
                  <Link
                    href={item.url}
                    className="nav-link px-3 py-2 text-sm font-bold text-primary hover:text-brand-500 transition-fast focus-ring rounded-sm inline-flex items-center gap-1"
                  >
                    {item.title}
                    {item.dropdownColumns?.length ? <Chevron /> : null}
                  </Link>
                ) : (
                  <button
                    className="nav-link px-3 py-2 text-sm font-bold text-primary hover:text-brand-500 transition-fast focus-ring rounded-sm inline-flex items-center gap-1"
                    aria-expanded="false"
                  >
                    {item.title}
                    {item.dropdownColumns?.length ? <Chevron /> : null}
                  </button>
                )}
                <DropdownPanel item={item} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/blog" className="nav-link px-3 py-2 text-sm font-bold text-secondary hover:text-primary transition-fast">
              Blog
            </Link>
            <Link href="/landing" className="nav-link px-3 py-2 text-sm font-bold text-secondary hover:text-primary transition-fast">
              Pages
            </Link>
          </div>
        )}

        <div className="flex items-center gap-3">
          {data?.phoneNumber && (
            <a
              href={`tel:${data.phoneNumber.replace(/\D/g, "")}`}
              className="hidden lg:inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-brand-500 transition-fast"
            >
              <Phone width={14} height={14} strokeWidth={1.5} aria-hidden="true" />
              {data.phoneNumber}
            </a>
          )}
          {data?.ctaButton?.text && (
            <Link
              href={data.ctaButton.url ?? "/free-consultation"}
              className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-full bg-brand-500 hover:bg-brand-600 shadow-sm hover:shadow-brand transition-fast focus-ring"
            >
              {data.ctaButton.text}
            </Link>
          )}
          <ThemeToggle />
          <MobileMenu data={data} />
        </div>
      </nav>
    </header>
  );
}
