# CLAUDE.md — Next.js App (POC)

## Purpose

Render blog posts and block pages from Sanity CMS. Visual output must be identical to the Astro app — same Tailwind classes, same layout, same content. This is a POC for framework comparison, not a polished site.

## Stack

- Next.js 15 (App Router), React 19, Tailwind CSS 4, Framer Motion 12, next-sanity
- Deploy target: Vercel

## Commands

```bash
pnpm dev     # localhost:3000
pnpm build   # Production build
```

## Architecture

### Server vs Client Components

Default to Server Components. Add `"use client"` only for:
- Framer Motion animations
- Chart.js rendering (DemoChart)
- Portable Text renderer (contains interactive chart blocks)
- Navigation mobile menu toggle (if needed)

### File Structure

```
app/
├── layout.tsx              # Minimal shell: site name, nav links, footer
├── page.tsx                # Homepage: links to blog listing and sample landing page
├── blog/
│   ├── page.tsx            # Blog listing (card grid)
│   └── [slug]/page.tsx     # Blog post detail
├── landing/
│   └── [slug]/page.tsx     # Block page (section renderer)
└── not-found.tsx           # 404
components/
├── blog-card.tsx           # Blog post card for listing
├── section-renderer.tsx    # Maps block page section types to components
└── framer/
    ├── scroll-reveal.tsx   # Scroll-triggered fade-in
    └── hero-animation.tsx  # Hero entrance animation
lib/
    └── sanity.ts           # Sanity client
```

## Data Fetching

Fetch in Server Components. Use shared GROQ queries. Handle not-found.

```typescript
import { sanityClient } from "@/lib/sanity";
import { blogPostQuery } from "@kruze-poc/groq-queries";
import type { BlogPost } from "@kruze-poc/sanity-schemas/src/types";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await sanityClient.fetch<BlogPost>(blogPostQuery, { slug });
  if (!post) notFound();
  // render
}
```

Use `generateStaticParams` on all `[slug]` routes. Use `generateMetadata` for basic `<title>` and `<meta description>`.

## Portable Text Rendering

Next.js uses the full React renderer for Portable Text content:

```typescript
import { KruzePortableText } from "@kruze-poc/ui/portable-text";

{post.body && <KruzePortableText value={post.body} />}
```

**How it works:**
- ALL content (text, charts, images) renders as React components
- Charts work immediately since everything is React
- Content is server-rendered as HTML, then hydrates on client

**Trade-offs:**
- ⚠️ More JavaScript shipped (entire Portable Text renderer + Chart.js)
- ⚠️ All content hydrates as React (not as SEO-optimal as Astro's HTML)
- ✅ Simpler implementation (no hybrid rendering needed)
- ✅ Works well for POC comparison

**For production:** Consider implementing a hybrid approach similar to Astro where:
- Text content renders as static HTML
- Only charts/interactive components use React

**SEO Note:** While React Server Components do generate HTML that search engines can crawl, the Astro approach (static HTML + selective islands) is more optimal for SEO and performance.

## Tailwind Setup

```css
/* app/globals.css */
@import "tailwindcss";
```

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";
import kruzePreset from "@kruze-poc/tailwind-config";

const config: Config = {
  presets: [kruzePreset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};
export default config;
```

## Framer Motion

Keep it subtle — B2B accounting site. Scroll reveal and hero entrance only.

- Duration: 0.3–0.6s max
- `viewport.once: true` always
- Hero: fade + scale. Sections: fade + slight y-translate.

## Pages to Build

| Page | Route | What It Demonstrates |
|------|-------|---------------------|
| Layout | `app/layout.tsx` | Minimal nav (site name + "Blog" link), footer ("Kruze POC"), Lato font |
| Homepage | `app/page.tsx` | Simple links to `/blog` and a sample landing page |
| Blog listing | `app/blog/page.tsx` | Grid of BlogCards from Sanity |
| Blog post | `app/blog/[slug]/page.tsx` | Hero image, title, author, date, Portable Text body (charts, CTAs, alerts, YouTube) |
| Landing page | `app/landing/[slug]/page.tsx` | Section renderer: hero, text, chart, testimonials, FAQ |
| 404 | `app/not-found.tsx` | "Page not found" with link home |

## Styling Must Match Astro

Both apps use the same Tailwind classes for the same content. For example, a blog post title in both apps:

```
text-4xl font-black text-body mb-4
```

A section container in both apps:

```
max-w-container-lg mx-auto px-4 py-16
```

This ensures the POC comparison is fair — differences come from the framework, not from styling choices.

## What NOT to Build

- Elaborate nav/footer design
- Forms, search, analytics
- Image optimization (use Sanity URLs directly, no next/image needed for POC)
- Loading/error states beyond basic
- ISR/revalidation configuration
