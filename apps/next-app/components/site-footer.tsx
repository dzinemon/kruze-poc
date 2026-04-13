import { sanityFetch } from "@/lib/sanity";
import { siteFooterQuery } from "@kruze-poc/groq-queries";
import type { SiteFooter as SiteFooterType } from "@kruze-poc/sanity-schemas/src/types";

export async function SiteFooter() {
  const footer = await sanityFetch({ query: siteFooterQuery });
  const data = (footer?.data as SiteFooterType | null) ?? null;

  if (!data) {
    return (
      <footer className="border-t border-divider mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-secondary">
          Kruze POC — Next.js 15 + Sanity CMS
        </div>
      </footer>
    );
  }

  const year = new Date().getFullYear();

  return (
    <footer className="bg-subtle border-t border-divider mt-auto pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
          {/* Company column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <p className="text-xl font-black text-primary mb-3">Kruze Consulting</p>
            {data.companyDescription && (
              <p className="text-sm text-secondary leading-relaxed mb-4">
                {data.companyDescription}
              </p>
            )}
            {data.licenseNumber && (
              <p className="text-xs text-dim mb-4">
                CA CPA License{" "}
                {data.licenseUrl ? (
                  <a
                    href={data.licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-brand-500 hover:text-brand-600"
                  >
                    {data.licenseNumber}
                  </a>
                ) : (
                  data.licenseNumber
                )}
              </p>
            )}
            {data.incAwardText && (
              <p className="text-xs text-secondary bg-muted rounded-md px-3 py-2 mb-4">
                {data.incAwardText}
              </p>
            )}
            {data.socialLinks && data.socialLinks.length > 0 && (
              <ul className="space-y-1">
                {data.socialLinks.map((link) => (
                  <li key={link._key}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-secondary hover:text-brand-500 transition-fast"
                    >
                      {link.platform}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Dynamic columns */}
          {data.columns?.map((col) => (
            <div key={col._key}>
              <p className="text-xs font-black uppercase tracking-wide text-primary mb-3">
                {col.heading}
              </p>
              {col.links && col.links.length > 0 && (
                <ul className="space-y-1">
                  {col.links.map((link) => (
                    <li key={link._key}>
                      <a
                        href={link.url}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="text-sm text-secondary hover:text-brand-500 transition-fast py-0.5 inline-block"
                      >
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-divider pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-dim">
            {data.copyrightText ?? "Copyright © Kruze Consulting"} {year}
          </p>
          {data.legalLinks && data.legalLinks.length > 0 && (
            <ul className="flex flex-wrap gap-4">
              {data.legalLinks.map((link) => (
                <li key={link._key}>
                  <a
                    href={link.url}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-xs text-dim hover:text-secondary transition-fast"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
