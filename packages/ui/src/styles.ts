/**
 * Shared style constants — single source of truth for repeated Tailwind class strings.
 *
 * Importable by both React components and HTML string templates (to-html.ts).
 * Only promote a pattern here once it appears in 2+ files.
 *
 * Usage:
 *   import { heading, cta, text } from "@kruze-poc/ui/styles";
 *   <h2 className={heading.h2}>{…}</h2>
 *   <a className={cta.primary}>{…}</a>
 */

// ── Headings ────────────────────────────────────────────────────────────────────
// Matches design-system.md heading defaults. All headings are font-bold.

export const heading = {
  h2: "text-4xl lg:text-5xl font-bold tracking-tight text-primary",
  h3: "text-4xl font-bold tracking-tight text-primary",
  h4: "text-2xl font-bold text-primary",
} as const;

// ── Body text ───────────────────────────────────────────────────────────────────

export const text = {
  /** Section lead / intro paragraph */
  sectionLead: "text-base lg:text-lg font-normal text-secondary leading-relaxed",
  /** Standard body copy */
  body: "text-base font-normal text-secondary leading-relaxed",
} as const;

// ── Eyebrow badge ───────────────────────────────────────────────────────────────

export const eyebrow =
  "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black tracking-wide uppercase text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 rounded-full border border-brand-200 dark:border-brand-800" as const;

// ── CTA buttons (standalone / section-level) ────────────────────────────────────
// Design-system.md "lg" size (py-3, text-base) — used in hero, CTA strips,
// CTA section blocks. For form-context buttons use different patterns.

export const cta = {
  primary:
    "inline-flex items-center gap-2 px-5 py-3 text-base font-bold text-white rounded-full bg-brand-500 hover:bg-brand-600 shadow-md hover:shadow-brand focus-ring transition-all duration-200",
  secondary:
    "inline-flex items-center gap-2 px-5 py-3 text-base font-bold text-neutral-700 rounded-full ring-1 ring-neutral-300 hover:bg-neutral-50 focus-ring transition-all duration-200",
  outline:
    "inline-flex items-center gap-2 px-5 py-3 text-base font-bold text-neutral-700 rounded-full ring-1 ring-neutral-300 hover:bg-neutral-50 focus-ring transition-all duration-200",
} as const;

// ── CTA section wrapper variants ────────────────────────────────────────────────

export const ctaSectionWrapper = {
  boxed: "my-10 rounded-md bg-subtle border border-divider shadow-sm p-8",
  flat: "my-10",
  outlined: "my-10 rounded-md ring-1 ring-rule p-8",
} as const;
