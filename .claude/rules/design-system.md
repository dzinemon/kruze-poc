# Kruze Consulting — Design System

**Version:** 3.0 (post-migration, Tailwind-only)
**Stack:** Tailwind CSS v4, Lato, Lucide Icons
**Theme:** Premium Fintech Minimalism — light mode first, dark mode supported
**Token file:** `packages/tailwind-config/src/tokens.css`

> Color scales, shadow CSS values, gradient vars, and custom overrides are in `packages/tailwind-config/src/tokens.css`. Spacing, type scale, font weights, letter spacing, line heights, and standard easing use Tailwind v4 defaults. This document covers semantic decisions, component patterns, and rules.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Typography](#typography)
3. [Body Text & Paragraphs](#body-text--paragraphs)
4. [Links](#links)
5. [Labels & Eyebrows](#labels--eyebrows)
6. [Blockquotes](#blockquotes)
7. [Data Typography](#data-typography)
8. [Color System](#color-system)
9. [Spacing](#spacing)
10. [Geometric System](#geometric-system)
11. [Borders](#borders)
12. [Shadows](#shadows)
13. [Gradients](#gradients)
14. [Icons](#icons)
15. [Transitions & Animations](#transitions--animations)
16. [Focus & Accessibility](#focus--accessibility)
17. [Dark Mode](#dark-mode)
18. [Layout System](#layout-system)
19. [Navigation Pattern](#navigation-pattern)
20. [Component Patterns](#component-patterns)
21. [Tailwind v4 Usage](#tailwind-v4-usage)

---

## Design Philosophy

**Premium Fintech Minimalism — clean, structured, and trust-forward.**

Kruze Consulting serves startup founders and CFOs. Every visual decision reinforces financial authority and technical precision. The product should feel fast, credible, and premium — like the best enterprise fintech tools.

**Aesthetic keywords:** *premium fintech · airy white space · high-contrast bold typography · brand-infused chromatic gradients · blue-tinted shadows · rounded corners · glassmorphism lite · structural depth · trust-forward · clean tech*

### Core Principles

| Principle | How it manifests |
|---|---|
| **Airy minimalism** | White root, generous padding, let the value proposition breathe |
| **Geometric coherence** | One border-radius value per element type. Lean generous — pill buttons, rounded cards |
| **Chromatic depth** | Brand-tinted shadows + brand radial hero gradient — not heavy dark blocks or pastel washes |
| **Purposeful gradients** | Structural use only (hero bg, CTAs, icon containers) — never decorative pastel filler |
| **Type contrast** | Weight does the work, not uppercase. Deep slate on white for max legibility |
| **Glassmorphism lite** | Subtle transparency and soft shadows for depth — never heavy frosted glass |

### What we communicate

- **Trust** — clean, precise, no visual noise
- **Premium** — depth, quality, intentional use of space
- **Clarity** — information hierarchy at a glance
- **Warmth** — not cold SaaS; approachable expertise

### What to avoid

- Multi-color pastel washes (pink + baby blue + pale yellow aurora effects) — generic SaaS, not premium fintech
- Flat gray Bootstrap-style shadows
- `font-semibold` or `font-medium` — Lato doesn't have these weights
- `text-transform: uppercase` on headings — weight contrast does the job
- `font-light` on any heading — all headings H1–H6 use `font-bold` (700)
- Mixed font-weight inside headings — `<strong>`, `<b>`, or span elements must not override the heading's weight
- Gradient text on `font-normal` — fill is invisible on thin strokes
- `accent-500` for any text — fails WCAG AA on white

---

## Typography

### Font: Lato

4 weights only: 300, 400, 700, 900. Self-hosted woff2 files.

> **Hard rule:** `font-semibold` (600) and `font-medium` (500) do not exist in Lato — browsers synthesize them and the result looks wrong at all sizes. Use `font-bold` (700) wherever you'd reach for semibold. No exceptions.

### Type Scale

| Token | Size | Use |
|---|---|---|
| `text-xs`   | 12px | Badges, captions, legal footnotes |
| `text-sm`   | 14px | UI labels, nav items, helper text |
| `text-base` | 16px | Body copy |
| `text-lg`   | 18px | Lead text, intro paragraphs |
| `text-xl`   | 20px | Card titles |
| `text-2xl`  | 24px | Subheadings, section labels |
| `text-4xl`  | 36px | Section headings (h3/h4) |
| `text-5xl`  | 48px | Page headings (h2) |
| `text-6xl`  | 60px | Hero headlines (h1) |
| `text-7xl`  | 72px | Landing page hero headlines (h1) |

### Font Weights

| Token | Value | Tailwind class | Use |
|---|---|---|---|
| Light  | 300 | `font-light`  | Body lead text only — large intro paragraphs at `text-lg`+ |
| Normal | 400 | `font-normal` | Body copy, descriptions, captions |
| Bold   | 700 | `font-bold`   | **All headings H1–H6**, button labels, card titles, UI labels |
| Black  | 900 | `font-black`  | Eyebrow badges, stat numbers — never on headings above `text-2xl` |

### Heading Defaults

| Element | Size | Weight | Tracking |
|---|---|---|---|
| h1 (landing) | `text-6xl lg:text-7xl` | `font-bold` | `tracking-tight` |
| h1 (standard) | `text-6xl` | `font-bold` | `tracking-tight` |
| h2 | `text-4xl lg:text-5xl` | `font-bold` | `tracking-tight` |
| h3 | `text-4xl` | `font-bold` | `tracking-tight` |
| h4 | `text-2xl` | `font-bold` | `tracking-normal` |
| h5 | `text-xl`  | `font-bold` | `tracking-normal` |
| h6 | `text-lg`  | `font-bold` | `tracking-normal` |

### Typography Rules

**DO:**
- Weight hierarchy: `font-bold` heading → `font-normal` body → `font-black` badge
- `font-bold` (700) for **all headings H1–H6**, all button labels, all UI controls
- `font-black` (900) only for eyebrow badges (`text-xs`) and stat numbers (`text-5xl+`)
- `tracking-tight` on `text-4xl` and above
- `leading-tight` on headings; `leading-relaxed` on body paragraphs
- **Heading weight is locked** — the entire heading element must use a single consistent weight. Nested `<strong>`, `<b>`, or `<span>` elements must **not** override the heading's font-weight. If a nested element resets weight, use `font-inherit` to neutralize it.

**DON'T:**
- `font-semibold` or `font-medium` — synthesized weight looks wrong in Lato
- `font-light` on any heading — headings are always `font-bold`
- Mix heading weight with a heavier nested element (e.g. `font-bold` span inside a heading — the heading is already bold; use it as-is)
- `font-black` on anything larger than `text-2xl` — becomes brutish
- Gradient text on `font-normal` — fill won't render on thin strokes
- More than 3 type sizes in one section

### Gradient Text

One short phrase per section — hero keyword only, never full sentences. Requires `font-bold` (700) or `font-black` (900). Since all headings are `font-bold`, gradient spans inside headings inherit the correct weight automatically — no extra `font-bold` on the span needed.

```html
<!-- Correct — bold heading with gradient keyword (span inherits font-bold from h1) -->
<h1 class="text-6xl lg:text-7xl font-bold tracking-tight text-primary">
  Your startup's <span class="text-gradient-brand">financial backbone</span>
</h1>

<!-- Correct — section heading with gradient keyword -->
<h2 class="text-4xl lg:text-5xl font-bold tracking-tight text-primary">
  Built for <span class="text-gradient-brand">VC-backed</span> startups
</h2>

<!-- Correct — stat callout -->
<p class="text-5xl font-black text-gradient-brand">$2B+</p>

<!-- WRONG — mixed weights inside a heading -->
<!-- <h1 class="text-6xl font-light ...">Text <span class="font-bold text-gradient-brand">keyword</span></h1> -->
```

---

## Body Text & Paragraphs

Four body sizes. All use `font-normal` (400) and `text-secondary` unless context overrides.

| Class | Size | Use |
|---|---|---|
| `text-lg` | 18px | Lead / intro paragraphs — section subtitles, hero descriptions. Pair with `font-light` (300) or `font-normal`. |
| `text-base` | 16px | **Default body copy** — articles, descriptions, card text |
| `text-sm` | 14px | Secondary descriptions, metadata, helper text, nav items |
| `text-xs` | 12px | Captions, timestamps, fine print, legal footnotes |

### Standard Patterns

```html
<!-- Default body paragraph -->
<p class="text-base font-normal text-secondary leading-relaxed">...</p>

<!-- Lead / intro paragraph (section subtitle) -->
<p class="text-base lg:text-lg font-normal text-secondary leading-relaxed">...</p>

<!-- Secondary / metadata -->
<p class="text-sm font-normal text-dim">...</p>

<!-- Caption / fine print -->
<p class="text-xs font-normal text-dim">...</p>
```

### Content Contexts

Two CSS contexts apply automatic paragraph styling — no per-element classes needed:

| Context | Class | Use | Defined in |
|---|---|---|---|
| **Article content** | `.article-content` | Blog post bodies, long-form text | `tokens.css` |
| **Section content** | `.section-content` | Rich text inside cards, grids, section blocks | `tokens.css` |

Both set `text-base`, `text-secondary`, `leading-relaxed` on `<p>` elements. Article content adds vertical margins (`margin-bottom: 1em`). Section content is more compact (`margin-bottom: 0.75em`, last-child 0).

### Inline Formatting

| Element | Style |
|---|---|
| `<strong>` | `color: var(--color-primary)` — pops against secondary body text |
| `<em>` | `color: var(--color-primary)`, italic |
| `<code>` | `text-brand-600`, `bg-subtle`, `rounded-xs`, `text-[0.875em]` |

---

## Links

### Navigation & CTA Links

No underline. Color alone is sufficient because these links are visually distinct by context (buttons, nav items, standalone actions).

```html
<a class="text-brand-500 hover:text-brand-600 focus-ring transition-fast">...</a>
```

### Links in Body Text (article-content)

**Underlined** to satisfy WCAG 1.4.1 — links within running text must be distinguishable by more than color alone.

```css
/* Applied automatically inside .article-content */
text-decoration: underline;
text-decoration-color: var(--color-brand-200);   /* subtle at rest */
text-underline-offset: 2px;

/* Hover */
text-decoration-color: var(--color-brand-500);    /* stronger on hover */
color: var(--color-interact-hover);
```

Links in `.section-content` follow the same color pattern (`text-link` → `text-interact-hover`) but do **not** have underlines — section content is typically short and links are contextually obvious.

### Link Color Tokens

| State | Light mode | Dark mode |
|---|---|---|
| Resting | `--color-link` = brand-500 (#2F74B2) | `--color-link` = #75baff |
| Hover | `--color-interact-hover` = brand-600 | `--color-interact-hover` = #75baff |
| Visited | Not styled — uses resting color | Same |

---

## Labels & Eyebrows

Three label contexts. All use `font-bold` (700) or `font-black` (900), uppercase, and wider tracking.

### Eyebrow Badge

Pill-shaped label above hero headlines and section titles. Uses `font-black` (900) for maximum impact at small size.

```html
<span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black tracking-wide uppercase text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 rounded-full border border-brand-200 dark:border-brand-800">
  <span class="size-1.5 rounded-full bg-brand-500"></span>
  Startup Accounting
</span>
```

> Exported as `eyebrow` from `packages/ui/src/styles.ts`.

### Form Label

Sentence case, bold, paired with inputs. Sits directly above the input with `gap-1.5`.

```html
<label class="text-sm font-bold text-primary">Email address</label>
```

### Table Header Label

Uppercase, compact, muted color. Used in `.kruze-table` thead and data table headers.

```html
<th class="text-xs font-bold uppercase tracking-wider text-secondary bg-muted px-4 py-3">Revenue</th>
```

---

## Blockquotes

### Article Blockquote

Applied automatically inside `.article-content`. Left border accent, italic, secondary color.

```css
/* tokens.css — .article-content blockquote */
border-left: 3px solid var(--color-brand-500);
padding-left: 1em;
color: var(--color-secondary);
font-style: italic;
margin: 1.5em 0;
```

```html
<!-- Rendered output -->
<blockquote>
  <p>The best accounting firms don't just track numbers — they tell a story.</p>
</blockquote>
```

### Pull Quote (optional)

For emphasis within articles — larger, centered, not italic. Use sparingly (max 1 per article).

```html
<blockquote class="border-l-3 border-brand-500 pl-6 my-8">
  <p class="text-xl font-bold text-primary leading-snug">
    We saved $240K in R&D tax credits in our first year.
  </p>
  <cite class="block mt-2 text-sm font-normal text-secondary not-italic">— Sarah Chen, CEO at Acme</cite>
</blockquote>
```

---

## Data Typography

For numbers, metrics, financial data, and tabular content. Uses `tabular-nums` for column alignment and wider tracking for a data-forward feel.

### Patterns

| Context | Classes | Example |
|---|---|---|
| Hero metric / stat callout | `text-5xl font-black tabular-nums text-gradient-brand` | `$2B+` |
| Dashboard metric | `text-4xl font-black tabular-nums text-primary` | `$148,290` |
| Table cell number | `text-sm font-normal tabular-nums text-right text-secondary` | `$3,420.00` |
| Inline data (IDs, timestamps) | `text-sm font-normal tabular-nums tracking-wide text-dim` | `txn_8f2a · 2026-03-26` |
| Percentage change (positive) | `text-sm font-bold text-green-600` | `↓ 8.3%` |
| Percentage change (negative) | `text-sm font-bold text-red-600` | `↑ 12.1%` |

### Rules

- Always use `tabular-nums` on number columns and aligned metrics — ensures decimal/comma alignment
- Use `tracking-wide` (0.025em) on inline data strings to create visual separation from body text
- Hero metrics use `font-black` (900); table/inline data uses `font-normal` (400)
- Right-align numbers in tables (`text-right`)

```html
<!-- Stat card metric -->
<p class="text-5xl font-black tabular-nums text-gradient-brand">500+</p>

<!-- Table number cell -->
<td class="py-3 text-sm tabular-nums text-right text-secondary">$3,420.00</td>

<!-- Inline data -->
<span class="text-sm tabular-nums tracking-wide text-dim">txn_8f2a4b · $12,847.00</span>
```

---

## Color System

> Brand, accent, and neutral color scales with hex values are in `packages/tailwind-config/src/tokens.css`. Always use semantic tokens in components — they auto-switch in dark mode.

### Brand Palette

Three-color foundation. These are the only permitted brand hues.

```
Brand Blue    #2F74B2  (brand-500)  — Primary actions, links, highlights
Brand Dark    #024D7C  (brand-800)  — Depth, strong CTA backgrounds
Cyan Accent   #02ABE3  (accent-500) — Icons, gradients, borders, decorative only
```

Brand scale includes: 50, 100, 200, 400, 500, 600, 700, 800, 900, 950. Only `accent-500` is defined — no other accent scale values exist.

> `accent-500` is decorative only — 3.0:1 contrast ratio fails WCAG AA. Never use it for text on white.

### Semantic Tokens

**Always use semantic tokens in components** — they auto-switch in dark mode.

```css
/* Backgrounds */
var(--color-base)       /* #fff / dark: #0a0f1c */
var(--color-subtle)     /* card, panel bg */
var(--color-muted)      /* hover bg */

/* Borders */
var(--color-divider)   /* dividers, table lines */
var(--color-rule)  /* input borders, card borders */

/* Text */
var(--color-primary)    /* headings, body */
var(--color-secondary)  /* secondary labels, captions */
var(--color-dim)      /* placeholder, helper text */
var(--color-inverse)    /* white text on dark/brand bg */
var(--color-link)      /* links, brand highlights */

/* Interactive */
var(--color-interact)  /* resting — brand-500 */
var(--color-interact-hover)    /* hover — brand-600 */
var(--color-interact-active)   /* pressed — brand-700 */
```

### Accessibility (WCAG AA)

Minimum 4.5:1 normal text · 3:1 large text (18px+ or 14px bold+).

| Foreground | Background | Ratio | Status |
|---|---|---|---|
| `neutral-900` | white | 19.6:1 | AAA |
| `neutral-600` | white | 5.9:1  | AA  |
| `brand-500`   | white | 4.8:1  | AA  |
| `brand-800`   | white | 9.6:1  | AAA |
| `brand-400`   | dark bg-base | 5.2:1 | AA |
| `accent-500`  | white | 3.0:1  | FAIL — decorative only |

> Text on any `brand-500`–`brand-800` background: always `text-white`.

---

## Spacing

4px base grid. All spacing is a multiple of 4. Uses **Tailwind v4's built-in spacing scale** — no custom tokens needed in `tokens.css`.

| Class | px | Common use |
|---|---|---|
| `p-1` / `gap-1`   |  4px | Icon gap, tight padding |
| `p-2` / `gap-2`   |  8px | Inline gap, compact items |
| `p-3` / `gap-3`   | 12px | Button padding Y, chip padding |
| `p-4` / `gap-4`   | 16px | Default gap, input padding |
| `p-5` / `gap-5`   | 20px | Card padding (compact) |
| `p-6` / `gap-6`   | 24px | Card padding, button padding X |
| `p-8` / `gap-8`   | 32px | Section internal gap |
| `p-10` / `gap-10` | 40px | Medium section padding |
| `p-12` / `gap-12` | 48px | Large section padding |
| `py-16`  | 64px | Section vertical padding (mobile) |
| `py-20`  | 80px | Section vertical padding (tablet) |
| `py-32`  | 128px | Section vertical padding (desktop) |

---

## Geometric System

**One rule: each element type has exactly one border-radius value.**

### Radius Scale

| Token | Value | Use |
|---|---|---|
| `radius-xs`       | 4px    | Small badges, tight UI chips |
| `radius-sm`       | 8px    | Inputs, textarea, select, tooltips, alerts |
| `radius-md`       | 12px   | Cards, dropdowns, popovers |
| `radius-lg`       | 16px   | Panels, modals, drawers |
| `radius-xl`       | 20px   | Large cards, featured sections |
| `radius-2xl`      | 24px   | Hero cards, feature containers |
| `rounded-full`    | 9999px | Buttons, round badges, tags (Tailwind built-in) |
| `radius-squircle` | 28%    | Icon containers, avatars only |

### Component → Radius Mapping

| Component | Radius |
|---|---|
| Button (standalone CTA) | `rounded-full` (pill) |
| Button (form submit) | `rounded-sm` (8px) |
| Button (inline + input) | `rounded-r-sm` (8px) |
| Input / Textarea | `rounded-sm` (8px) |
| Input (inline + button) | `rounded-l-sm` (8px) |
| Select / Dropdown | `rounded-sm` |
| Card | `rounded-md` (12px) |
| Hero Card | `rounded-2xl` (24px) |
| Panel / Sidebar | `rounded-lg` (16px) |
| Modal | `rounded-lg` |
| Tooltip | `rounded-sm` |
| Badge / Tag | `rounded-full` |
| Alert | `rounded-sm` |
| Icon container | `squircle` (28%) |
| Avatar | `squircle` |
| Navbar | `rounded-none` |
| Table | `rounded-none` |

### Squircle Rules

Use `squircle` (CSS `border-radius: 28%`) only on equal-dimension elements:
- Icon containers (32–64px)
- Avatar / profile photos
- Small stat callout tiles
- NOT on buttons, inputs, cards, or modals

```html
<!-- Icon container: squircle + brand gradient -->
<div class="icon-container icon-container-xl squircle"
     style="background: var(--gradient-brand);">
  <svg class="text-white" width="28" height="28" stroke-width="1.5" ...></svg>
</div>

<!-- Avatar -->
<img class="squircle size-12 object-cover" src="..." alt="..." />
```

---

## Borders

### Border Width

All borders default to **1px**. No other border widths are used in the system except focus indicators and gradient borders.

| Context | Width | Method | Why |
|---|---|---|---|
| Cards, panels | 1px | `border border-divider` | Standard separation |
| Inputs (resting) | 1px | `border border-rule` | Consistent with cards |
| Inputs (focused) | 1px + glow | `border-brand-500` + `shadow-focus-ring` | No layout shift — shadow adds the visual emphasis |
| Outlined buttons | 1px | `ring-1 ring-brand-500` | `ring` avoids height increase that `border` causes (border adds 2px total to element height) |
| Gradient borders | 1px | `::before` pseudo with `inset: -1px` | Allows gradient fill on the border |
| Blockquotes | 3px | `border-left: 3px solid brand-500` | Accent indicator |
| Nav active link | 2px | `::after` pseudo, `height: 2px` | Bottom bar indicator |

### Rules

- **Never change border-width on focus.** Changing from 1px to 2px on focus causes a 1px layout shift. Use `box-shadow` (`shadow-focus-ring`) for focus indication instead.
- **Use `ring-1` instead of `border` on outlined buttons.** `border` adds 2px to the element's box model, making outlined buttons taller than fill buttons. `ring` is painted outside the box model and doesn't affect layout.
- **Gradient borders use `::before`.** The `.gradient-border-brand` utility places a gradient-filled pseudo-element at `inset: -1px` behind the element.

### Border Color Tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `border-divider` | neutral-200 | `rgba(255,255,255,0.06)` | Cards, panels, table lines, section separators |
| `border-rule` | neutral-300 | `rgba(255,255,255,0.10)` | Input borders, card borders requiring more contrast |
| `border-brand-200` | brand-200 | brand-800 | Eyebrow badge borders |
| `border-brand-500` | brand-500 | brand-400 | Focused inputs, active indicators |

---

## Shadows

### Philosophy

Shadows are **brand-tinted**, not gray. 2–3 layers for organic depth. Light mode uses blue-tinted shadows. Dark mode uses near-black shadows with higher contrast.

### Scale

| Token | Description | Use |
|---|---|---|
| `shadow-xs` | 1 layer, barely visible | Subtle card separation |
| `shadow-sm` | 2 layers, soft | Default card resting state |
| `shadow-md` | 3 layers, clear depth | Hover state, elevated card |
| `shadow-lg` | 3 layers, strong | Dropdown, popover |
| `shadow-xl` | 3 layers, dramatic | Modal, drawer |
| `shadow-brand` | Blue glow ring | CTA buttons, focused brand elements |
| `shadow-accent` | Cyan glow ring | Accent buttons, highlighted items |
| `shadow-focus-ring` | 3px brand ring | Focus visible state (all interactive) |
| `shadow-inner` | Inset | Pressed state, sunken inputs |

### Interaction Pattern

```
Resting  →  shadow-sm
Hover    →  shadow-md  +  translateY(-2px)   [use .hover-lift utility]
Active   →  shadow-xs  +  translateY(0)
Focus    →  shadow-focus-ring
```

---

## Gradients

### Available Gradients

| Token | Use | Max per page |
|---|---|---|
| `--gradient-hero-light` / `--gradient-hero-dark` | Page hero section (required) | 1 |
| `--gradient-cta` | CTA / contact section | 1 |
| `--gradient-brand` | Icon containers, card borders | Unlimited |
| `--gradient-text-brand` | Hero headline keywords (via `.text-gradient-brand`) | 2–3 spans total |
| `--gradient-glass-light` / `--gradient-glass-dark` | Glass morphism cards | As needed |
| Gradient on body text | Never | 0 |

> All gradient variables are defined in `packages/tailwind-config/src/tokens.css`.

### Hero Section Pattern (required)

```html
<section class="bg-hero-gradient section-spacing">
  <!-- content -->
</section>
```

```css
/* bg-hero-gradient */
background-color: #ffffff;
background-image:
  radial-gradient(ellipse 80% 50% at 70% -10%, rgba(47,116,178,0.12) 0%, transparent 70%),
  radial-gradient(ellipse 60% 40% at -10% 90%, rgba(2,171,227,0.08) 0%, transparent 60%);
```

### Gradient Border on Cards

```html
<div class="gradient-border-brand rounded-md p-6">
  <!-- featured card content -->
</div>
```

---

## Icons

**Library: Lucide Icons** — https://lucide.dev

### Baseline

```html
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24" height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <!-- paths -->
</svg>
```

- **Stroke width:** Always `1.5` — do not change
- **Color:** Always `currentColor`
- **Size:** Use standard `width` / `height` attributes — no custom icon size tokens. Default is `24x24`.

### Icon Containers

Three sizes using hardcoded rem values (no custom @theme tokens):

| Class | Size | Use |
|---|---|---|
| `icon-container-sm` | 2rem (32px) | Small icons, nav |
| `icon-container-md` | 2.5rem (40px) | Button icons, hamburger |
| `icon-container-xl` | 3.5rem (56px) | Feature icons, hero icons |

```html
<!-- Brand gradient -->
<div class="icon-container icon-container-xl squircle"
     style="background: var(--gradient-brand);">
  <svg class="text-white" width="28" height="28" stroke-width="1.5" ...></svg>
</div>
```

---

## Transitions & Animations

### Composed Transitions

| Token | Value | Use |
|---|---|---|
| `--transition-fast`   | 150ms ease-out | Buttons, badges, icon states |
| `--transition-base`   | 200ms ease-in-out | Cards, nav links, most UI |
| `--transition-spring` | 400ms ease-spring | Drawer open, accordion |

> Standard easing functions (`ease-in`, `ease-out`, `ease-in-out`) use Tailwind v4 defaults. Only custom easing (`--ease-spring`, `--ease-bounce`) is defined in `tokens.css`.

### Custom Easing

| Token | Value | Use |
|---|---|---|
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Drawer, accordion |
| `--ease-bounce` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Playful micro-interactions |

### Utility Classes

**`.hover-lift`** — card/element hover elevation:
```css
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
}
```

**`.focus-ring`** — see [Focus & Accessibility](#focus--accessibility).

### Rules

| Element | Transition |
|---|---|
| Buttons (color, shadow) | `--transition-fast` |
| Nav links, form inputs | `--transition-fast` |
| Cards (shadow, transform) | `--transition-base` |
| Drawer / accordion | `--transition-spring` |

---

## Focus & Accessibility

### Focus Ring Utility

All interactive elements must use `.focus-ring`. It activates only on `:focus-visible` (keyboard navigation), not on mouse click.

```css
.focus-ring:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus-ring); /* 3px brand-500 ring */
}
```

Apply to every `<button>`, `<a>`, `<input>`, `<select>`, `<textarea>`, and custom interactive element.

```html
<button class="... focus-ring">Submit</button>
<a href="..." class="... focus-ring">Learn More</a>
```

### Minimum Touch Target

40px — aligns with `button-md` height (`py-2.5 text-sm` = 40px). Never create tappable elements smaller than 40px in either dimension.

### Color Contrast Rules

- Minimum 4.5:1 for normal text (below 18px or non-bold below 14px)
- Minimum 3:1 for large text (18px+, or 14px bold+)
- `accent-500` (#02abe3) on white = 3.0:1 — **decorative only**, never use for text
- Brand-500 and above all pass AA — see [Color System WCAG table](#accessibility-wcag-aa)
- Text on any `brand-500`–`brand-800` background: use `text-white` (all pass 4.5:1+)

### Keyboard Navigation

- Dropdowns: arrow keys (↑↓) to navigate items, Escape to close, Enter to select
- Modal: focus trap inside modal while open, Escape to close, return focus to trigger on close
- All tab-order must follow visual reading order

---

## Dark Mode

### Strategy

- **Class-based:** `<html class="dark">` — not media query alone
- Respect OS preference on initial load, allow user override via toggle
- Store preference in `localStorage`
- Semantic tokens auto-switch — no per-component dark overrides needed

### Dark Background Layers

```
--color-base     #0a0f1c   deep navy-black — page root
--color-subtle   #0f1823   cards, side panels
--color-muted    #162032   elevated cards, hover
```

Navy night palette — not pure black. Brand undertone preserved throughout.

### JS Toggle

```js
// On page load
const theme = localStorage.getItem('theme')
  ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.classList.toggle('dark', theme === 'dark');

// Toggle button
function toggleDark() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}
```

### Dark Mode Checklist

- [ ] All backgrounds use semantic tokens (`--color-base`, `--color-subtle`, `--color-muted`)
- [ ] All text uses semantic tokens (`--color-primary`, `--color-secondary`, `--color-dim`, etc.)
- [ ] All borders use semantic tokens (`--color-divider`, `--color-rule`)
- [ ] Images: sufficient contrast on dark bg
- [ ] Logos: dark-mode variant provided (or brand-colored version)
- [ ] Gradient text: tested on dark bg (may need `text-gradient-light` variant)

---

## Layout System

### Container Widths

Pick one width per section — never nest a wider container inside a narrower one.

| Class | Max-width | Use |
|---|---|---|
| `max-w-7xl` | 1280px | Nav, footer, hero (side-by-side) |
| `max-w-6xl` | 1152px | **Standard** — card grids, feature lists, blog grids |
| `max-w-4xl` | 896px  | Wide text blocks, trust bars, alert callouts |
| `max-w-3xl` | 768px  | FAQ accordions, focused reading, contact copy |
| `max-w-xl`  | 576px  | Form cards, inline forms |

> Nav and footer always use `max-w-7xl` regardless of surrounding sections.

### Full-Bleed vs Constrained

| Type | Background | Use |
|---|---|---|
| Full-bleed | Gradient or solid color — 100vw | Hero, CTA strips, dark contact sections |
| Constrained | White or `neutral-50` — contained | Card grids, FAQ, text + icon features |

```html
<!-- Full-bleed -->
<section class="bg-hero-gradient py-20 px-6">
  <div class="max-w-6xl mx-auto"><!-- content --></div>
</section>

<!-- Constrained -->
<section class="bg-white dark:bg-[var(--color-base)] py-20 px-6">
  <div class="max-w-6xl mx-auto"><!-- content --></div>
</section>
```

### Page Structure Template

Alternate white and `neutral-50` between constrained sections. Interrupt with full-bleed CTA strips.

```
Hero (full-bleed, bg-hero-gradient)
↓ Trust bar (white, max-w-6xl)
↓ Benefits grid (white, max-w-6xl)
↓ Mid-CTA strip (full-bleed gradient)
↓ Services grid (neutral-50, max-w-6xl)
↓ FAQ (white, max-w-3xl)
↓ Blog grid (neutral-50, max-w-6xl)
↓ Contact CTA (full-bleed dark)
```

### Desktop Type Scaling

| Element | Mobile | Desktop (`lg:`) |
|---|---|---|
| Landing h1 | `text-6xl font-bold` | `lg:text-7xl` |
| Section h2 | `text-4xl font-bold` | `lg:text-5xl` |
| Lead paragraph | `text-base` | `lg:text-lg` |
| Trust bar callout | `text-base` | `lg:text-xl` |
| Card body copy | `text-base` | no change |

---

## Navigation Pattern

> The current nav (`_includes/global/new-js-nav.html`) uses Bootstrap classes. This section documents the **target post-migration structure** to build toward.

### Spec

- **Container:** `max-w-7xl mx-auto` — matches footer
- **Height:** 64px desktop / 56px mobile
- **Background:** `bg-base` (auto dark mode via semantic token)
- **Border bottom:** `border-b border-divider`
- **Position:** `sticky top-0 z-50`

### Active Link Indicator

2px brand-500 bottom bar — matches the current nav animation pattern:

```css
/* Active link */
.nav-link[aria-current="page"]::after,
.nav-link:hover::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: var(--color-brand-500);
  transition: var(--transition-fast);
}
```

### Dropdown

| Property | Value |
|---|---|
| Radius | `rounded-md` (12px) |
| Shadow | `shadow-lg` |
| Background | `bg-base` |
| Border | `border border-divider` |
| Z-index | `z-50` |
| Animation | fade + translateY(-4px) → 0 on open |

### Mobile

- Full-width drawer: `rounded-none`
- Max-height: `calc(100vh - 56px)`, overflow-y scroll
- Hamburger toggle: icon button (`icon-container-md squircle`)
- Focus trap while open

### Structure (Target HTML Pattern)

```html
<nav class="sticky top-0 z-50 bg-base border-b border-divider"
     aria-label="Main navigation">
  <div class="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

    <!-- Logo -->
    <a href="/" class="flex-shrink-0 focus-ring rounded-sm" aria-label="Kruze Consulting home">
      <img src="/img/logo.svg" alt="Kruze Consulting" height="32" />
    </a>

    <!-- Desktop nav links -->
    <ul class="hidden lg:flex items-center gap-1" role="list">
      <li>
        <a href="/services/"
           class="relative px-3 py-2 text-sm font-bold text-primary hover:text-brand-500 transition-fast focus-ring rounded-sm">
          Services
        </a>
      </li>
      <!-- Dropdown trigger -->
      <li class="relative">
        <button class="flex items-center gap-1 px-3 py-2 text-sm font-bold text-primary hover:text-brand-500 transition-fast focus-ring rounded-sm"
                aria-expanded="false" aria-haspopup="true">
          Resources
          <svg width="16" height="16" stroke-width="1.5" ...><!-- chevron-down --></svg>
        </button>
        <!-- Dropdown panel -->
        <div class="absolute top-full left-0 mt-1 rounded-md shadow-lg bg-base border border-divider"
             style="min-width: 220px;">
          <!-- dropdown items -->
        </div>
      </li>
    </ul>

    <!-- Right: CTA -->
    <div class="hidden lg:flex items-center gap-3">
      <a href="tel:+1..." class="text-sm font-bold text-primary hover:text-brand-500 transition-fast focus-ring">
        (415) 000-0000
      </a>
      <a href="/contact/"
         class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-full bg-brand-500 hover:bg-brand-600 shadow-sm hover:shadow-brand transition-fast focus-ring">
        Contact Us
      </a>
    </div>

    <!-- Mobile hamburger -->
    <button class="lg:hidden icon-container icon-container-md squircle bg-muted hover:bg-neutral-200 dark:hover:bg-neutral-700 text-primary transition-fast focus-ring"
            aria-expanded="false" aria-label="Open menu">
      <svg width="20" height="20" stroke-width="1.5" ...><!-- menu --></svg>
    </button>

  </div>
</nav>
```

---

## Component Patterns

### Button

#### Border Radius by Context — One Rule

| Context | Radius | Class |
|---|---|---|
| **Standalone CTA** — hero, section CTAs, nav, page-level actions | pill | `rounded-full` |
| **Form submit button** — inside `<form>`, below or beside fields | input radius | `rounded-sm` (8px) |
| **Inline button paired with input** — search, newsletter, subscribe | input half-side | `rounded-r-sm` (8px) |

> **Never use `rounded-full` on a button that lives inside a form or is paired with an input.** `rounded-sm` (8px) matches the input and creates a coherent control group. Pill shape on a form button looks detached and breaks the geometric pairing.

#### Size

Three sizes. All form-context buttons use **md**. **lg** is for standalone hero CTAs only. **sm** is for compact UI (toolbars, inline actions, tags with actions).

| Size | Height | Padding | Font | Use |
|---|---|---|---|---|
| **sm** | 32px | `py-1.5 px-4` | `text-xs` | Compact UI — toolbars, inline actions, secondary controls |
| **md** | 40px | `py-2.5 px-5` | `text-sm` | Default — all UI, forms |
| **lg** | 48px | `py-3 px-7` | `text-base` | Standalone hero CTAs only |

> Use `ring-1` instead of `border` for outlined buttons — `border` adds 2px to height and breaks alignment with fill buttons.

```html
<!-- Standalone CTA — rounded-full -->
<button class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-full bg-brand-500 hover:bg-brand-600 active:bg-brand-700 shadow-sm hover:shadow-brand transition-fast focus-ring">
  Get Started
  <svg width="16" height="16" stroke-width="1.5" ...><!-- arrow-right --></svg>
</button>

<!-- Standalone CTA lg (hero only) — rounded-full -->
<button class="inline-flex items-center gap-2 px-7 py-3 text-base font-bold text-white rounded-full bg-brand-500 hover:bg-brand-600 active:bg-brand-700 shadow-md hover:shadow-brand transition-base focus-ring">
  Talk to a CFO
  <svg width="20" height="20" stroke-width="1.5" ...><!-- arrow-right --></svg>
</button>

<!-- Form submit button — rounded-sm (8px), NOT rounded-full -->
<button class="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 text-sm font-bold text-white rounded-sm bg-brand-500 hover:bg-brand-600 active:bg-brand-700 shadow-sm hover:shadow-brand transition-fast focus-ring">
  Submit
</button>

<!-- Secondary outline — standalone, rounded-full -->
<button class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-brand-500 dark:text-brand-400 rounded-full ring-1 ring-brand-500 dark:ring-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950 transition-fast focus-ring">
  View Pricing
</button>

<!-- Ghost — standalone, rounded-full -->
<button class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-neutral-700 dark:text-neutral-200 rounded-full ring-1 ring-neutral-300 dark:ring-white/20 hover:ring-neutral-400 bg-transparent hover:bg-neutral-50 dark:hover:bg-white/5 transition-fast focus-ring">
  Learn More
</button>

<!-- Inverse — standalone on dark bg, rounded-full -->
<button class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-full ring-1 ring-white/30 hover:bg-white/10 transition-fast focus-ring">
  View Pricing
</button>

<!-- Icon button (squircle) -->
<button class="icon-container icon-container-md squircle bg-muted hover:bg-neutral-200 dark:hover:bg-neutral-700 text-secondary hover:text-primary transition-fast focus-ring">
  <svg width="20" height="20" stroke-width="1.5" ...></svg>
</button>
```

### Input Height Rule — 40px via Arithmetic, Never `h-*`

**Never use `h-*` height classes on inputs or inline form buttons.** Reach 40px exactly through border + padding + line height arithmetic.

| Layer | Input | Paired Button (borderless) |
|---|---|---|
| Border | `border` = 1px × 2 = **2px** | none = **0px** |
| Padding | `py-[9px]` = 9px × 2 = **18px** | `py-2.5` = 10px × 2 = **20px** |
| Line height | `text-sm leading-5` = **20px** | `text-sm leading-5` = **20px** |
| **Total** | **40px** | **40px** |

> Using `h-10` (40px) or `h-12` (48px) bypasses this system and causes misalignment with paired buttons. Always use the padding + line-height formula.

### Inline Input + Button

Input gets `rounded-l-sm`, button gets `rounded-r-sm`. Both 40px height via arithmetic above. Never `rounded-full` on inputs.

```html
<div class="flex">
  <input type="email"
    class="flex-1 px-4 py-[9px] text-sm font-normal leading-5 text-primary bg-base border border-rule rounded-l-sm placeholder:text-dim focus:outline-none focus:border-brand-500 focus:shadow-focus-ring transition-fast"
    placeholder="you@startup.com" />
  <button class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-r-sm transition-fast focus-ring">
    Subscribe
  </button>
</div>
```

### Card

```html
<!-- Standard card -->
<div class="rounded-md bg-subtle border border-divider shadow-sm hover:shadow-md hover-lift p-6">
  <!-- content -->
</div>

<!-- Featured card — gradient border -->
<div class="gradient-border-brand rounded-md p-6 bg-surface-gradient">
  <!-- content -->
</div>

<!-- Glass card (dark mode hero sections) -->
<div class="glass rounded-lg p-6">
  <!-- content -->
</div>
```

### Form Input

One size: 40px via arithmetic — `border` (2px) + `py-[9px]` (18px) + `text-sm leading-5` (20px) = 40px. Always `rounded-sm` (8px). Never `rounded-full` on inputs. Never use `h-*` height classes on inputs.

```html
<div class="flex flex-col gap-1.5">
  <label class="text-sm font-bold text-primary">
    Email address
  </label>
  <input type="email"
    class="w-full px-4 py-[9px] text-sm font-normal leading-5 text-primary bg-base dark:bg-subtle border border-rule rounded-sm placeholder:text-dim focus:outline-none focus:border-brand-500 focus:shadow-focus-ring transition-fast"
    placeholder="you@startup.com" />
  <p class="text-xs text-dim">We'll never share your email.</p>
</div>
```

### Feature Icon Block

```html
<div class="flex flex-col gap-4 p-6 rounded-xl bg-subtle border border-divider hover-lift">
  <div class="icon-container icon-container-xl squircle"
       style="background: var(--gradient-brand);">
    <svg class="text-white" width="28" height="28" stroke-width="1.5" ...></svg>
  </div>
  <div class="space-y-2">
    <h3 class="text-xl font-bold text-primary">Virtual CFO Services</h3>
    <p class="text-base text-secondary leading-relaxed">
      Expert financial strategy for Series A+ startups.
    </p>
  </div>
</div>
```

### Stat / Metric Card

```html
<div class="squircle bg-subtle border border-divider p-6 text-center hover-lift">
  <p class="text-5xl font-black text-gradient-brand">500+</p>
  <p class="text-sm font-normal text-secondary mt-1">Startups Funded</p>
</div>
```

### Section Hero

```html
<section class="bg-hero-gradient section-spacing">
  <div class="max-w-7xl mx-auto px-6">
    <div class="max-w-prose mx-auto text-center flex flex-col gap-6">

      <!-- Eyebrow label -->
      <span class="inline-flex items-center gap-1.5 mx-auto px-3 py-1 text-xs font-black tracking-wide uppercase text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 rounded-full border border-brand-200 dark:border-brand-800">
        <span class="size-1.5 rounded-full bg-brand-500"></span>
        Startup Accounting
      </span>

      <!-- Display headline — font-bold, gradient span inherits weight -->
      <h1 class="text-6xl lg:text-7xl font-bold tracking-tight text-primary">
        Your startup's<br>
        <span class="text-gradient-brand">financial backbone</span>
      </h1>

      <!-- Lead -->
      <p class="text-base lg:text-lg font-normal text-secondary leading-relaxed">
        Kruze Consulting handles accounting, taxes, and CFO advisory
        for VC-backed startups — so you can focus on growth.
      </p>

      <!-- CTAs -->
      <div class="flex flex-wrap gap-3 justify-center">
        <button class="inline-flex items-center gap-2 px-7 py-3 text-base font-bold text-white rounded-full bg-brand-500 hover:bg-brand-600 shadow-md hover:shadow-brand transition-base focus-ring">
          Talk to a CFO
        </button>
        <button class="inline-flex items-center gap-2 px-7 py-3 text-base font-bold text-brand-500 dark:text-brand-400 rounded-full ring-1 ring-brand-500 dark:ring-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950 transition-base focus-ring">
          See Our Work
        </button>
      </div>

    </div>
  </div>
</section>
```

---

## Tailwind v4 Usage

### Setup

```css
/* main.css */
@import "tailwindcss";
@import "./packages/tailwind-config/src/tokens.css";
```

Tailwind v4 uses CSS-native `@theme` — no `tailwind.config.js`. All tokens in `tokens.css` become Tailwind utilities automatically.

> **What uses TW4 defaults (not in tokens.css):** spacing, type scale (`text-*`), font weights (`font-*`), letter spacing (`tracking-*`), line heights (`leading-*`), standard easing (`ease-in`, `ease-out`, `ease-in-out`), durations, and z-index.
>
> **What is custom (defined in tokens.css):** colors, shadows, border radius, gradients, custom easing (`--ease-spring`, `--ease-bounce`), and composed transitions (`--transition-fast`, `--transition-base`, `--transition-spring`).

### Token → Utility Quick Reference

| Token | Tailwind class | Example |
|---|---|---|
| `--color-brand-500` | `bg-brand-500`, `text-brand-500`, `border-brand-500` | Primary button bg |
| `--color-subtle` | `bg-subtle` | Card background |
| `--color-primary` | `text-primary` | Body text |
| `--color-rule` | `border-rule` | Input border |
| `--radius-md` | `rounded-md` | Standard card |
| `rounded-full` (built-in) | `rounded-full` | Buttons, round badges |
| `--shadow-md` | `shadow-md` | Hover shadow |
| `--shadow-brand` | `shadow-brand` | CTA button glow |
| `--color-base` dark mode | `dark:bg-[var(--color-base)]` or semantic via `.dark` | Auto-switches |

### CSS Variable Usage

For gradients and transitions — use inline `style` or custom CSS:

```html
<section style="background: var(--gradient-hero-light);">
<div style="box-shadow: var(--shadow-brand);">
<div style="transition: var(--transition-spring);">
```

### Dark Mode Classes

```html
<div class="bg-subtle dark:bg-subtle">     <!-- semantic tokens auto-switch -->
<p class="text-primary">                  <!-- auto dark mode via .dark on <html> -->
<div class="bg-neutral-50 dark:bg-neutral-900"> <!-- manual scale if needed -->
```
