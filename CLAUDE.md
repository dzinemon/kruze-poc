# CLAUDE.md — Kruze POC Monorepo

## What This POC Is

A focused comparison of Next.js vs Astro rendering **identical content from Sanity CMS**. The goal is to evaluate the **editor experience** (Sanity Studio → content → rendered page) and pick a CMS + framework for the full migration. This is NOT a polished site — no design perfection, no complex layouts, no production features.

## What We're Testing

1. **Editor workflow:** Create/edit content in Sanity Studio → see it rendered correctly in both apps
2. **Custom blocks:** Editor inserts a chart, CTA, alert, or YouTube embed via Portable Text → it renders in both apps
3. **Block page builder:** Editor assembles sections (hero, text, chart, testimonials, FAQ) → page renders in both apps
4. **Framework comparison:** Lighthouse scores, bundle sizes, build times, DX side by side
5. **Sanity Studio UX:** Is the editing experience good enough? What needs custom Studio components?

## What We're NOT Testing

- Visual design fidelity to current site
- Forms, search, authentication, analytics
- Production deployment configuration

## SEO & Performance Principles

Both apps must follow SEO-first rendering to ensure search engines can crawl content effectively:

### Critical Content in HTML
**Must be static HTML** (rendered at build time, available to crawlers):
- All text content: paragraphs, headings, lists, blockquotes
- Links and navigation
- Images with proper alt text
- Meta tags and structured data

### Dynamic Parts Can Lazy Load
**Can be client-side JavaScript** (hydrated on-demand):
- Charts and data visualizations
- Interactive calculators/forms
- Animations and transitions
- Video embeds (YouTube iframes)
- CTA blocks with tracking

### Implementation Approach
- **Astro**: Uses hybrid rendering — static HTML for text content, React islands for interactive components
- **Next.js**: Uses full React renderer for Portable Text (acceptable trade-off for POC, but less optimal for SEO)

This ensures:
1. Fast initial page load (minimal JavaScript for content)
2. Search engines can index all important content
3. Interactive features load only when needed
4. Lighthouse scores prioritize performance

## Monorepo Structure

```
kruze-poc/
├── packages/
│   ├── sanity-schemas/      # Sanity schema definitions
│   ├── tailwind-config/     # Shared Tailwind preset (brand tokens)
│   ├── groq-queries/        # Shared GROQ queries (identical data shape)
│   └── ui/                  # Shared React components (Portable Text, charts)
├── apps/
│   ├── studio/              # Sanity Studio (localhost:3333)
│   ├── next-app/            # Next.js 15 (localhost:3000)
│   └── astro-app/           # Astro 5 (localhost:4321)
└── scripts/                 # Content migration scripts (Jekyll → Sanity)
```

## Commands

```bash
pnpm dev:studio    # Sanity Studio at localhost:3333
pnpm dev:next      # Next.js at localhost:3000
pnpm dev:astro     # Astro at localhost:4321
pnpm build         # Build all apps
pnpm type-check    # Type-check all packages
```

## Sanity

- **Project ID:** Go to Sanity dashboard → Projects → Kruze 
- **Dataset:** production
- **Studio:** apps/studio/ (localhost:3333)
- Content types: blogPost, blockPage, author, testimonial, category, tag
- Portable Text custom blocks: chartBlock, ctaBlock, alertBlock, youtubeBlock
- Document IDs match Jekyll `_uid` values for reference integrity

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

## TypeScript

- Strict mode. No `any`. Import types with `import type`.
- Use `interface` for object shapes, `type` for unions/intersections.

## Tailwind CSS

Shared preset extends Tailwind defaults. Brand colors are flat: `text-primary`, `bg-info`, `text-body`, `text-muted`, etc.

| Class | Hex | Usage |
|-------|-----|-------|
| `text-primary` / `bg-primary` | #2F74B2 | Links, CTAs, headings |
| `text-primary-dark` | #024D7C | Hover states |
| `text-info` | #02ABE3 | Accents |
| `text-body` | #434344 | Body text |
| `text-secondary` | #59595b | Secondary text |
| `text-muted` | #9B9B9B | Captions |

Custom: `rounded-btn` (26px), `font-black` (900), `max-w-container-lg` (960px).

Rules: no arbitrary values when a token exists. No inline styles for colors/spacing.

## Component Patterns

- Files: `kebab-case.tsx` / `.astro`. Components: `PascalCase`.
- Props as `interface`, destructured in function signature.
- **Both apps must use identical Tailwind classes for the same content.** The rendered HTML may differ (React vs Astro templates) but the visual output must match.

## Sanity Client

Each app creates its own in `lib/sanity.ts`:

```typescript
import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID,
  dataset: import.meta.env.SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: true,
});
```

## Code Quality

- No unused imports, no console.log, no commented-out code
- Keep files under 200 lines
- No premature abstraction — duplicate is fine at two, abstract at three

## POC Pages (Both Apps)

Both apps render the same two page types with the same styling:

1. **Blog post** (`/blog/[slug]`) — hero image, title, author, date, Portable Text body with custom blocks
2. **Block page** (`/landing/[slug]`) — section-based page builder (hero, text, chart, testimonials, FAQ)

Navigation and footer are minimal — site name + links to blog listing. No elaborate design needed.
