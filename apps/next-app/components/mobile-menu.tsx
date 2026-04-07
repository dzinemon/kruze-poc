"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import type { SiteNavigation } from "@kruze-poc/sanity-schemas/src/types";

interface MobileMenuProps {
  data: SiteNavigation | null;
}

export function MobileMenu({ data }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggleExpanded(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function close() {
    setOpen(false);
    setExpanded(new Set());
  }

  return (
    <>
      {/* Hamburger toggle — hidden on desktop */}
      <div className="lg:hidden flex items-center">
        <button
          onClick={() => setOpen(!open)}
          className="icon-container icon-container-md squircle bg-muted hover:bg-neutral-200 dark:hover:bg-neutral-700 text-primary transition-fast focus-ring"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <div className="flex flex-col justify-between h-[12px] w-5">
            <span
              className="block h-px w-full bg-current rounded-full origin-center"
              style={{
                transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                ...(open ? { transform: "translateY(5.5px) rotate(45deg)" } : {}),
              }}
            />
            <span
              className="block h-px w-full bg-current rounded-full"
              style={{
                transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 150ms ease-out",
                ...(open ? { opacity: 0, transform: "scaleX(0)" } : {}),
              }}
            />
            <span
              className="block h-px w-full bg-current rounded-full origin-center"
              style={{
                transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                ...(open ? { transform: "translateY(-5.5px) rotate(-45deg)" } : {}),
              }}
            />
          </div>
        </button>
      </div>

      {/* Backdrop */}
      <div
        className={`mobile-backdrop fixed inset-0 z-[48] bg-black/20 backdrop-blur-sm lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Top-reveal panel — drops from below the header */}
      <div
        className={`mobile-panel fixed top-16 inset-x-0 bottom-0 z-[49] bg-base border-t border-divider shadow-lg overflow-y-auto flex flex-col lg:hidden ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {/* Nav items */}
        <nav className="flex-1 py-4 px-4 max-w-7xl mx-auto w-full" aria-label="Mobile navigation">
          <ul className="space-y-0.5">
            {data?.navItems?.map((item) => (
              <li key={item._key}>
                {item.dropdownColumns?.length ? (
                  <div>
                    <button
                      onClick={() => toggleExpanded(item._key)}
                      className="w-full flex items-center justify-between px-3 py-3 text-sm font-bold text-primary hover:text-brand-500 hover:bg-muted rounded-sm transition-fast focus-ring"
                      aria-expanded={expanded.has(item._key)}
                      aria-controls={`mobile-submenu-${item._key}`}
                    >
                      {item.title}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className={`transition-transform duration-200 flex-shrink-0 ${
                          expanded.has(item._key) ? "rotate-180" : ""
                        }`}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                    {/* Always in DOM — max-height keeps sub-links crawlable */}
                    <ul
                      id={`mobile-submenu-${item._key}`}
                      role="region"
                      className="ml-3 pl-3 border-l-2 border-brand-50 dark:border-brand-800 space-y-0.5 overflow-hidden"
                      style={{
                        maxHeight: expanded.has(item._key) ? "600px" : "0px",
                        paddingBottom: expanded.has(item._key) ? "4px" : "0px",
                        transition: "max-height 300ms cubic-bezier(0.34, 1.56, 0.64, 1), padding-bottom 300ms ease",
                      }}
                    >
                      {item.dropdownColumns.flatMap(
                        (col) =>
                          col.navLinks?.map((link) => (
                            <li key={link._key}>
                              <Link
                                href={link.url ?? "#"}
                                onClick={close}
                                className="block px-3 py-2.5 text-sm font-bold text-secondary hover:text-brand-500 rounded-sm transition-fast"
                                tabIndex={expanded.has(item._key) ? 0 : -1}
                              >
                                {link.title}
                              </Link>
                            </li>
                          )) ?? []
                      )}
                    </ul>
                  </div>
                ) : item.url ? (
                  <Link
                    href={item.url}
                    onClick={close}
                    className="block px-3 py-3 text-sm font-bold text-primary hover:text-brand-500 hover:bg-muted rounded-sm transition-fast focus-ring"
                  >
                    {item.title}
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom CTA strip */}
        <div className="flex-shrink-0 border-t border-divider px-4 py-4 max-w-7xl mx-auto w-full space-y-3">
          {data?.phoneNumber && (
            <a
              href={`tel:${data.phoneNumber.replace(/\D/g, "")}`}
              className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-primary hover:text-brand-500 rounded-sm transition-fast"
            >
              <Phone width={15} height={15} strokeWidth={1.5} aria-hidden="true" />
              {data.phoneNumber}
            </a>
          )}
          {data?.ctaButton?.text && (
            <Link
              href={data.ctaButton.url ?? "/free-consultation"}
              onClick={close}
              className="flex items-center justify-center gap-2 w-full px-5 py-2.5 text-sm font-bold text-white rounded-full bg-brand-500 hover:bg-brand-600 shadow-sm hover:shadow-brand transition-fast focus-ring"
            >
              {data.ctaButton.text}
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
