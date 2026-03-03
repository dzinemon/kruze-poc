# CLAUDE.md — Kruze POC Monorepo

## What This POC Evaluates

A focused comparison of Next.js 15 vs Astro 5 rendering **identical content from Sanity CMS**. This is NOT a polished site — no design perfection, no complex layouts, no production features.

Evaluation goals:

1. **Editor workflow** — Create/edit content in Sanity Studio → see it rendered correctly in both apps
2. **Custom Portable Text blocks** — Editor inserts a chart, CTA, alert, or YouTube embed → it renders in both apps
3. **Block page builder** — Editor assembles sections (hero, text, chart, testimonials, FAQ) → page renders in both apps
4. **Framework comparison** — Lighthouse/PageSpeed scores, bundle sizes, build times, DX side by side
5. **Hosting cost comparison** — Next.js on Vercel (function invocations + bandwidth billing) vs Astro on Cloudflare Pages (generous free tier, Workers pricing for edge functions)
6. **SEO comparison** — crawlability, static HTML output, Core Web Vitals, metadata
7. **Sanity Studio UX** — Is the editing experience good enough? What needs custom Studio components?

## What We're NOT Testing

- Visual design fidelity to the current site
- Forms, search, authentication, analytics
- Production deployment configuration

## Monorepo Structure

```
kruze-poc/
├── packages/
│   ├── sanity-schemas/      # Sanity schema definitions and types
│   ├── groq-queries/        # Shared GROQ queries (identical data shape for both apps)
│   ├── ui/                  # Shared React components (Portable Text, charts)
│   └── tailwind-config/     # Shared Tailwind preset
├── apps/
│   ├── studio/              # Sanity Studio (localhost:3333)
│   ├── next-app/            # Next.js 15 (localhost:3000)
│   └── astro-app/           # Astro 5 (localhost:4321)
└── scripts/                 # Content migration scripts (Jekyll → Sanity)
```

## Rendering Architecture

Both apps use the same GROQ queries and the same Tailwind classes. The rendering approach differs by framework.

### Next.js — React Server Components

- All content renders via **React Server Components** (RSC) — no `"use client"` for content
- Portable Text uses the full `@portabletext/react` renderer: `KruzePortableText`
- Charts use `"use client"` components (`DemoChart`)
- RSC generates static HTML that search engines can crawl; hydration cost is higher than Astro

```typescript
// blog post body — rendered server-side as React
import { KruzePortableText } from "@kruze-poc/ui/portable-text";

{post.body && <KruzePortableText value={post.body} />}
```

### Astro — Hybrid Rendering (Static HTML + React Islands)

- Text content renders as **static HTML** via `PortableTextHybrid` (zero JS shipped for text)
- `PortableTextHybrid` groups consecutive non-chart blocks → `renderPortableTextHtml()` from `packages/ui/src/portable-text/to-html.ts`
- Chart blocks become **React islands** with `client:load`
- Result: maximum SEO fidelity, minimal JavaScript

```astro
---
import PortableTextHybrid from "../../components/portable-text-hybrid.astro";
---
{post.body && <PortableTextHybrid value={post.body} />}
```

`to-html.ts` is used **only by Astro** — Next.js does not use it.

### SEO-First Principle

**Must be static HTML** (available to crawlers at page load):
- All text content: paragraphs, headings, lists, blockquotes
- Links and navigation
- Images with proper alt text
- Meta tags and structured data

**Can be client-side JS** (hydrated on demand):
- Charts and data visualizations (`client:load` / `client:visible`)
- YouTube iframes
- CTA blocks with tracking
- Framer Motion animations

## Workspace Package Imports

Always import from workspace packages. Never duplicate queries, types, or components locally.

```typescript
// Types
import type { BlogPost, BlockPage } from "@kruze-poc/sanity-schemas/src/types";

// GROQ queries (both apps use identical queries)
import { blogPostQuery, blogPostsListQuery } from "@kruze-poc/groq-queries";

// Shared React components
import { KruzePortableText } from "@kruze-poc/ui/portable-text";
import { DemoChart } from "@kruze-poc/ui/chart/demo-chart";
```

## Sanity Content Model

- **Studio:** `apps/studio/` (localhost:3333)
- Content types: `blogPost`, `blockPage`, `author`, `testimonial`, `category`, `tag`
- Portable Text custom blocks: `chartBlock`, `ctaBlock`, `alertBlock`, `youtubeBlock`
- Document IDs match Jekyll `_uid` values for reference integrity

## Design System

Full design rules are in `.claude/rules/design-system.md` and `.claude/rules/style.md`. Design tokens are defined in `tokens.css` at the repo root — this is the single source of truth.

### Semantic Token Quick Reference

Always use semantic tokens in components — they auto-switch in dark mode.

| Token class | Variable | Usage |
|-------------|----------|-------|
| `text-text-primary` | `--color-text-primary` | Headings, body text |
| `text-text-secondary` | `--color-text-secondary` | Secondary labels, captions |
| `text-text-muted` | `--color-text-muted` | Placeholder, helper text |
| `bg-bg-base` | `--color-bg-base` | Page root background |
| `bg-bg-subtle` | `--color-bg-subtle` | Card and panel surfaces |
| `border-border-default` | `--color-border-default` | Input borders, card borders |
| `text-brand-500` | `--color-brand-500` | Links, CTAs, highlights (#2F74B2) |
| `text-brand-800` | `--color-brand-800` | Depth, strong CTA backgrounds (#024D7C) |
| `shadow-brand` | `--shadow-brand` | CTA button glow |
| `shadow-md` | `--shadow-md` | Hover shadow |

Rules: no arbitrary values when a token exists. No inline styles for colors/spacing. See `design-system.md` for the full component pattern library.

## TypeScript

- Strict mode. No `any`. Import types with `import type`.
- Use `interface` for object shapes, `type` for unions/intersections.

## Component & File Conventions

- Files: `kebab-case.tsx` / `.astro`. Components: `PascalCase`.
- Props as `interface`, destructured in function signature.
- **Both apps must use identical Tailwind classes for the same content.** The rendered HTML may differ (React vs Astro templates) but the visual output must match.

## Code Quality

- No unused imports, no `console.log`, no commented-out code
- Keep files under 200 lines
- No premature abstraction — duplicate is fine at two, abstract at three

## POC Pages (Both Apps)

Both apps render the same two page types:

1. **Blog post** (`/blog/[slug]`) — hero image, title, author, date, Portable Text body with custom blocks
2. **Block page** (`/landing/[slug]`) — section-based page builder (hero, text, chart, testimonials, FAQ)

Navigation and footer are minimal — site name + links to blog listing.

## Related Docs

| File | Contents |
|------|----------|
| `README.md` | Dev setup, commands, Docker, env vars, live URLs |
| `SANITY-MIGRATION.md` | Hybrid schema plan (semantic blocks + `flexSectionBlock` escape hatch) for migrating 61 block pages |
| `sanity-deploy-architecture.md` | Sanity RBAC roles, git strategy, deploy webhooks, SOC 2 checklist, rollback procedures |
| `.claude/rules/design-system.md` | Full design system: typography, color, spacing, shadow, gradient, component patterns |
| `.claude/rules/style.md` | Aesthetic philosophy and visual direction |
