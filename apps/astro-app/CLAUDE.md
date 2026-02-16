# CLAUDE.md — Astro App (POC)

## Purpose

Render blog posts and block pages from Sanity CMS. Visual output must be identical to the Next.js app — same Tailwind classes, same layout, same content. This is a POC for framework comparison, not a polished site.

## Stack

- Astro 5 (static output), React 19 via @astrojs/react (islands only), Tailwind CSS 4 via @tailwindcss/vite, Framer Motion 12 (inside React islands), @sanity/client
- Deploy target: Cloudflare Pages

## Commands

```bash
pnpm dev      # localhost:4321
pnpm build    # Static build to dist/
pnpm preview  # Preview static build
```

## Architecture

### Astro Components vs React Islands

Default to `.astro` files (zero JS shipped). Only use React when the component needs client-side interactivity.

**Astro (zero JS):** pages, layouts, nav, footer, blog cards, testimonial cards, FAQ accordion (`<details>`/`<summary>`), hero sections, text sections — everything static.

**React islands (JS shipped):** charts (Chart.js needs canvas), Portable Text renderer (may contain chart blocks), Framer Motion animations.

### Client Directives

| Directive | When |
|-----------|------|
| `client:load` | Must work immediately (Portable Text on blog post — above fold) |
| `client:visible` | Can wait until scrolled into view (below-fold charts) |

Default to `client:visible`. Use `client:load` only for above-fold interactive content.

### File Structure

```
src/
├── layouts/
│   └── base.astro              # Minimal shell: site name, nav links, footer
├── pages/
│   ├── index.astro             # Homepage: links to blog listing and sample landing page
│   ├── blog/
│   │   ├── index.astro         # Blog listing (card grid)
│   │   └── [slug].astro        # Blog post detail
│   ├── landing/
│   │   └── [slug].astro        # Block page (section renderer)
│   └── 404.astro               # Not found
├── components/
│   ├── blog-card.astro         # Blog post card for listing (zero JS)
│   ├── section-renderer.astro  # Maps block page section types to components
│   ├── sections/
│   │   ├── hero-section.astro
│   │   ├── text-section.astro
│   │   ├── testimonials-section.astro
│   │   └── faq-section.astro
│   └── react/                  # React islands
│       ├── portable-text-island.tsx
│       ├── chart-island.tsx
│       └── framer-hero.tsx
└── lib/
    └── sanity.ts               # Sanity client
```

## Data Fetching

Fetch in Astro frontmatter (build time). Use shared GROQ queries.

```astro
---
import { sanityClient } from "../../lib/sanity";
import { blogPostQuery } from "@kruze-poc/groq-queries";
import type { BlogPost } from "@kruze-poc/sanity-schemas/src/types";

export async function getStaticPaths() {
  const posts = await sanityClient.fetch<{ slug: { current: string } }[]>(
    `*[_type == "blogPost"]{ slug }`
  );
  return posts.map((p) => ({ params: { slug: p.slug.current } }));
}

const { slug } = Astro.params;
const post = await sanityClient.fetch<BlogPost>(blogPostQuery, { slug });
if (!post) return Astro.redirect("/404");
---
```

## Astro Config

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  output: "static",
});
```

## Tailwind Setup

```css
/* src/styles/global.css */
@import "tailwindcss";
```

Import in base layout: `import "../styles/global.css";`

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";
import kruzePreset from "@kruze-poc/tailwind-config";

const config: Config = {
  presets: [kruzePreset],
  content: [
    "./src/**/*.{astro,ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};
export default config;
```

## Astro Template Reminders

- Use `class` not `className` in `.astro` files
- Use `{}` for expressions
- Conditional: `{condition && <element />}`
- Iteration: `{items.map((item) => <Component {...item} />)}`

## SEO-Optimized Content Rendering

**CRITICAL**: All text content must be static HTML for search engine crawlers. Only interactive components should use React islands.

### Portable Text Rendering

Use the **hybrid approach** for blog posts and text sections:

```astro
---
import PortableTextHybrid from "../../components/portable-text-hybrid.astro";
---

{post.body && <PortableTextHybrid value={post.body} />}
```

**How it works:**
1. Text content (paragraphs, headings, lists) → **Static HTML** (zero JS)
2. Chart blocks → **React islands** with `client:load` (Chart.js requires canvas)
3. Other blocks (images, CTAs, alerts, YouTube) → **Static HTML**

**Result:**
- ✅ Search engines can crawl all text content
- ✅ Fast initial page load (minimal JavaScript)
- ✅ Charts hydrate and become interactive
- ✅ Better Lighthouse scores

### React Islands

Use React islands ONLY for components that require client-side interactivity:

```tsx
// src/components/react/chart-island.tsx
import { DemoChart } from "@kruze-poc/ui/chart/demo-chart";
import type { ComponentProps } from "react";
export default function ChartIsland(props: ComponentProps<typeof DemoChart>) {
  return <DemoChart {...props} />;
}
```

```tsx
// src/components/react/portable-text-island.tsx (NOT USED IN BLOG POSTS - use PortableTextHybrid instead)
import { KruzePortableText } from "@kruze-poc/ui/portable-text";
export default function PortableTextIsland({ value }: { value: unknown[] }) {
  return <KruzePortableText value={value} />;
}
```

Usage in `.astro`:
```astro
<!-- For blog posts and text sections (SEO-optimized) -->
<PortableTextHybrid value={post.body} />

<!-- For standalone charts (in chart sections) -->
<ChartIsland
  client:visible
  chartType="bar"
  labels={labels}
  datasets={datasets}
/>
```

### When to Use Each Approach

| Component | Approach | Reason |
|-----------|----------|--------|
| Blog post body | `PortableTextHybrid` | Text must be HTML, charts are islands |
| Text sections | `PortableTextHybrid` | Same as blog posts |
| Chart sections | `ChartIsland` with `client:visible` | Standalone charts can lazy load |
| Static content | Astro component | No JS needed |

## Pages to Build

| Page | Route | What It Demonstrates |
|------|-------|---------------------|
| Base layout | `src/layouts/base.astro` | Minimal nav (site name + "Blog" link), footer ("Kruze POC"), Lato font |
| Homepage | `src/pages/index.astro` | Simple links to `/blog` and a sample landing page |
| Blog listing | `src/pages/blog/index.astro` | Grid of blog cards (zero JS Astro components) |
| Blog post | `src/pages/blog/[slug].astro` | Hero image, title, author, date, Portable Text island |
| Landing page | `src/pages/landing/[slug].astro` | Section renderer: Astro components + React chart island |
| 404 | `src/pages/404.astro` | "Page not found" with link home |

## Styling Must Match Next.js

Both apps use the same Tailwind classes for the same content. Blog post title:

```
text-4xl font-black text-body mb-4
```

Section container:

```
max-w-container-lg mx-auto px-4 py-16
```

Visual output must be identical. Differences come from framework (partial hydration, View Transitions), not from styling.

## Key Differences from Next.js

| Aspect | Next.js | Astro |
|--------|---------|-------|
| Static content | Server Components (React) | `.astro` templates (zero JS) |
| Interactive parts | `"use client"` | `client:visible` / `client:load` |
| Data fetching | `async` Server Components | Astro frontmatter (`---` block) |
| Static paths | `generateStaticParams()` | `getStaticPaths()` |
| Not found | `notFound()` | `Astro.redirect("/404")` |

## What NOT to Build

- Elaborate nav/footer design
- Forms, search, analytics
- Image optimization
- SSR mode (keep `output: "static"`)
- View Transitions (nice-to-have, not required for POC)
