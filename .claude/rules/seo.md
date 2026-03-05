# SEO Rules

**Rule:** Text content is always static HTML. Interactivity is always deferred.

## Rendering contract

| Static HTML (must be in DOM at load) | Client-side / lazy-loaded |
|---|---|
| Headings, paragraphs, lists, links | Contact forms — `client:visible` |
| Images with `alt`, `width`, `height` | Charts, calculators — `client:visible` |
| FAQ answers, testimonials, feature text | YouTube iframes — `client:idle` |
| JSON-LD structured data | Embeds, tracking scripts |

**Next.js:** RSC by default. `"use client"` only for: FAQ accordion, contact forms, charts, calculators.

**Astro:** Static `.astro` for all text. Use `client:visible` for below-fold interactive sections (forms, charts, calculators). Use `client:load` only when above-fold interaction is expected immediately.

## Heading hierarchy

```
H1 — one per page, hero section only
H2 — section title (Sanity content block style "h2")
H3 — card titles, FAQ questions, feature tile titles
```

**Accordion questions must use `<h3><button>` pattern:**
```html
<h3 class="m-0">
  <button aria-expanded="false" aria-controls="panel-id">Question</button>
</h3>
```

## Accordion content stays in DOM

Use `max-height: 0` + CSS transition for collapsed state. Never conditionally render (`&&`) accordion content — removing it from the DOM hides it from crawlers.

## Structured data (JSON-LD)

| Section / Page | Schema |
|---|---|
| FAQ section | `FAQPage` → `Question` + `Answer` — inject in the section component |
| Blog post page | `Article` / `BlogPosting` — inject in page `<head>` |
| Root layout | `Organization` + `WebSite` — inject in root `<head>` |

## ARIA for interactive sections

Required on every accordion / collapsible:
- trigger `<button>`: `aria-expanded`, `aria-controls="panel-id"`
- panel `<div>`: `role="region"`, `aria-labelledby="trigger-id"`
- decorative icons: `aria-hidden="true"`

## Reference implementation

[faq-section.tsx](../../apps/next-app/components/sections/faq-section.tsx) and [faq-section.astro](../../apps/astro-app/src/components/sections/faq-section.astro) apply all rules above.
