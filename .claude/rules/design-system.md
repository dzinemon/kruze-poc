# Kruze Consulting — Design System

**Version:** 3.0 (post-migration, Tailwind-only)
**Stack:** Tailwind CSS v4, Lato, Lucide Icons
**Theme:** Premium Fintech Minimalism — light mode first, dark mode supported
**Token file:** `_features/design-system/tokens.css`

> Full color scales, shadow CSS values, gradient vars, z-index values, and raw spacing values are in `_features/design-system/tokens.css`. This document covers semantic decisions, component patterns, and rules.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Typography](#typography)
3. [Color System](#color-system)
4. [Spacing](#spacing)
5. [Geometric System](#geometric-system)
6. [Shadows](#shadows)
7. [Gradients](#gradients)
8. [Icons](#icons)
9. [Transitions & Animations](#transitions--animations)
10. [Z-index Scale](#z-index-scale)
11. [Focus & Accessibility](#focus--accessibility)
12. [Dark Mode](#dark-mode)
13. [Layout System](#layout-system)
14. [Navigation Pattern](#navigation-pattern)
15. [Component Patterns](#component-patterns)
16. [Tailwind v4 Usage](#tailwind-v4-usage)

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
<h1 class="text-6xl lg:text-7xl font-bold tracking-tight text-text-primary">
  Your startup's <span class="text-gradient-brand">financial backbone</span>
</h1>

<!-- Correct — section heading with gradient keyword -->
<h2 class="text-4xl lg:text-5xl font-bold tracking-tight text-text-primary">
  Built for <span class="text-gradient-brand">VC-backed</span> startups
</h2>

<!-- Correct — stat callout -->
<p class="text-5xl font-black text-gradient-brand">$2B+</p>

<!-- WRONG — mixed weights inside a heading -->
<!-- <h1 class="text-6xl font-light ...">Text <span class="font-bold text-gradient-brand">keyword</span></h1> -->
```

---

## Color System

> Full brand, accent, neutral, and status color scales with hex values are in `_features/design-system/tokens.css`. Always use semantic tokens in components — they auto-switch in dark mode.

### Brand Palette

Three-color foundation. These are the only permitted brand hues.

```
Brand Blue    #2F74B2  (brand-500)  — Primary actions, links, highlights
Brand Dark    #024D7C  (brand-800)  — Depth, strong CTA backgrounds
Cyan Accent   #02ABE3  (accent-500) — Icons, gradients, borders, decorative only
```

> `accent-500` is decorative only — 3.0:1 contrast ratio fails WCAG AA. Never use it for text on white.

### Status Colors

For feedback states only — alerts, toasts, validation. Not for decoration.

| Scale | Light | Base | Dark |
|---|---|---|---|
| `success-*` | `#dcfce7` | `#22c55e` | `#15803d` |
| `warning-*` | `#fef9c3` | `#eab308` | `#a16207` |
| `danger-*`  | `#fee2e2` | `#ef4444` | `#b91c1c` |
| `info-*`    | `#ecfcff` | `#02abe3` | `#0369a1` |

Use `-dark` variant for text, base variant for icons.

```html
<div class="rounded-sm bg-danger-light border border-danger/30 text-danger-dark px-4 py-3">
  Something went wrong.
</div>
```

### Semantic Tokens

**Always use semantic tokens in components** — they auto-switch in dark mode.

```css
/* Backgrounds */
var(--color-bg-base)       /* #fff / dark: #0a0f1c */
var(--color-bg-subtle)     /* card, panel bg */
var(--color-bg-muted)      /* hover bg */
var(--color-bg-emphasis)   /* selected / active state */

/* Borders */
var(--color-border-subtle)   /* dividers, table lines */
var(--color-border-default)  /* input borders, card borders */
var(--color-border-strong)   /* focused inputs */
var(--color-border-brand)    /* active/selected brand borders */

/* Text */
var(--color-text-primary)    /* headings, body */
var(--color-text-secondary)  /* secondary labels, captions */
var(--color-text-muted)      /* placeholder, helper text */
var(--color-text-inverse)    /* white text on dark/brand bg */
var(--color-text-brand)      /* links, brand highlights */

/* Interactive */
var(--color-interactive-default)  /* resting — brand-500 */
var(--color-interactive-hover)    /* hover — brand-600 */
var(--color-interactive-active)   /* pressed — brand-700 */
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
| `accent-400`  | dark bg-base | 4.5:1 | AA |
| `accent-500`  | white | 3.0:1  | FAIL — decorative only |

> Text on any `brand-500`–`brand-800` background: always `text-white`.

---

## Spacing

4px base grid. All spacing is a multiple of 4.

| Token | px | Common use |
|---|---|---|
| `spacing-1`  |  4px | Icon gap, tight padding |
| `spacing-2`  |  8px | Inline gap, compact items |
| `spacing-3`  | 12px | Button padding Y, chip padding |
| `spacing-4`  | 16px | Default gap, input padding |
| `spacing-5`  | 20px | Card padding (compact) |
| `spacing-6`  | 24px | Card padding, button padding X |
| `spacing-8`  | 32px | Section internal gap |
| `spacing-10` | 40px | Medium section padding |
| `spacing-12` | 48px | Large section padding |
| `spacing-16` | 64px | Section vertical padding (mobile) |
| `spacing-20` | 80px | Section vertical padding (tablet) |
| `spacing-32` | 128px | Section vertical padding (desktop) |

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

### Rules

| Gradient type | Use | Max per page |
|---|---|---|
| Hero bg — brand radial | Page hero section (required) | 1 |
| CTA background (linear brand) | CTA / contact section | 1 |
| Animated gradient | CTA sections only | 1 |
| Gradient text | Hero headline keywords | 2–3 spans total |
| Icon container fill | Feature icons | Unlimited |
| Card border | Featured cards only | 3–4 |
| Gradient on body text | Never | 0 |

> All gradient variables (`--gradient-brand`, `--gradient-hero-light`, `--gradient-cta`, etc.) are defined in `_features/design-system/tokens.css`.

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

Use `bg-hero-gradient` as default. Use `bg-mesh-gradient` as secondary option for alternate layouts or content-heavy pages.

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
- **Size:** Match context using icon size tokens

### Size Scale

| Token | Size | Use |
|---|---|---|
| `icon-xs`   | 12px | Inline text decorators |
| `icon-sm`   | 16px | Nav items, small buttons |
| `icon-md`   | 20px | Button icons, list items |
| `icon-base` | 24px | **Default** — all standard use |
| `icon-lg`   | 28px | Card header icons |
| `icon-xl`   | 32px | Feature icons (small container) |
| `icon-2xl`  | 40px | Feature icons (medium container) |
| `icon-3xl`  | 48px | Feature section hero icons |

### Icon Containers

```html
<!-- Brand gradient -->
<div class="icon-container icon-container-xl squircle"
     style="background: var(--gradient-brand);">
  <svg class="text-white" width="28" height="28" stroke-width="1.5" ...></svg>
</div>

<!-- Soft brand tint (light mode friendly) -->
<div class="icon-container icon-container-xl squircle"
     style="background: var(--gradient-brand-soft);">
  <svg style="color: var(--color-brand-600);" width="28" height="28" stroke-width="1.5" ...></svg>
</div>

<!-- Accent -->
<div class="icon-container icon-container-xl squircle"
     style="background: var(--gradient-accent);">
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
| `--transition-slow`   | 300ms ease-in-out | Image zoom, shadow elevation |
| `--transition-spring` | 400ms ease-spring | Drawer open, accordion |

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

### Animated Gradient

For CTA sections only — max 1 per page:
```html
<section class="bg-cta-animated">
  <!-- 12s rotating brand gradient loop -->
</section>
```

### Rules

| Element | Transition |
|---|---|
| Buttons (color, shadow) | `--transition-fast` |
| Nav links, form inputs | `--transition-fast` |
| Cards (shadow, transform) | `--transition-base` |
| Image zoom on hover | `--transition-slow` |
| Drawer / accordion | `--transition-spring` |
| Animated gradient bg | CSS `@keyframes` (12s, not transition) |

---

## Z-index Scale

Use `var(--z-*)` tokens only — no arbitrary z-index values. Full scale in `_features/design-system/tokens.css`.

### Component Layer Assignments

| Component | Z-index tier |
|---|---|
| Card click anchor (inset `<a>`) | `z-raised` |
| Dropdown menu | `z-dropdown` |
| Sticky navbar | `z-sticky` |
| Modal backdrop | `z-overlay` |
| Modal panel | `z-modal` |
| Toast notification | `z-toast` |

```html
<!-- Example usage -->
<div style="z-index: var(--z-dropdown);">...</div>
```

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
--color-bg-base     #0a0f1c   deep navy-black — page root
--color-bg-subtle   #0f1823   cards, side panels
--color-bg-muted    #162032   elevated cards, hover
--color-bg-emphasis #1c2b3e   selected, active states
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

- [ ] All backgrounds use semantic tokens (`--color-bg-*`)
- [ ] All text uses semantic tokens (`--color-text-*`)
- [ ] All borders use semantic tokens (`--color-border-*`)
- [ ] Images: sufficient contrast on dark bg
- [ ] Logos: dark-mode variant provided (or brand-colored version)
- [ ] Gradient text: tested on dark bg (may need `text-gradient-light` variant)

---

## Layout System

### Container Widths

Pick one width per section — never nest a wider container inside a narrower one.

| Class | Max-width | Use |
|---|---|---|
| `container-site` / `max-w-7xl` | 1280px | Nav, footer, hero (side-by-side) |
| `max-w-6xl` | 1152px | **Standard** — card grids, feature lists, blog grids |
| `max-w-4xl` | 896px  | Wide text blocks, trust bars, alert callouts |
| `max-w-3xl` | 768px  | FAQ accordions, focused reading, contact copy |
| `max-w-xl`  | 576px  | Form cards, inline forms |

> Nav and footer always use `container-site` regardless of surrounding sections.

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
<section class="bg-white dark:bg-[var(--color-bg-base)] py-20 px-6">
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
| Landing h1 | `text-6xl font-light` | `lg:text-7xl` |
| Section h2 | `text-4xl font-bold` | `lg:text-5xl` |
| Lead paragraph | `text-base` | `lg:text-lg` |
| Trust bar callout | `text-base` | `lg:text-xl` |
| Card body copy | `text-base` | no change |

---

## Navigation Pattern

> The current nav (`_includes/global/new-js-nav.html`) uses Bootstrap classes. This section documents the **target post-migration structure** to build toward.

### Spec

- **Container:** `container-site` (max-w-7xl) — matches footer
- **Height:** 64px desktop / 56px mobile
- **Background:** `bg-bg-base` (auto dark mode via semantic token)
- **Border bottom:** `border-b border-border-subtle`
- **Position:** `sticky top-0` + `z-sticky`

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
| Background | `bg-bg-base` |
| Border | `border border-border-subtle` |
| Z-index | `z-dropdown` |
| Animation | fade + translateY(-4px) → 0 on open |

### Mobile

- Full-width drawer: `rounded-none`
- Max-height: `calc(100vh - 56px)`, overflow-y scroll
- Hamburger toggle: icon button (`icon-container-md squircle`)
- Focus trap while open

### Structure (Target HTML Pattern)

```html
<nav class="sticky top-0 bg-bg-base border-b border-border-subtle"
     style="z-index: var(--z-sticky);"
     aria-label="Main navigation">
  <div class="container-site flex items-center justify-between h-16">

    <!-- Logo -->
    <a href="/" class="flex-shrink-0 focus-ring rounded-sm" aria-label="Kruze Consulting home">
      <img src="/img/logo.svg" alt="Kruze Consulting" height="32" />
    </a>

    <!-- Desktop nav links -->
    <ul class="hidden lg:flex items-center gap-1" role="list">
      <li>
        <a href="/services/"
           class="relative px-3 py-2 text-sm font-bold text-text-primary hover:text-brand-500 transition-fast focus-ring rounded-sm">
          Services
        </a>
      </li>
      <!-- Dropdown trigger -->
      <li class="relative">
        <button class="flex items-center gap-1 px-3 py-2 text-sm font-bold text-text-primary hover:text-brand-500 transition-fast focus-ring rounded-sm"
                aria-expanded="false" aria-haspopup="true">
          Resources
          <svg width="16" height="16" stroke-width="1.5" ...><!-- chevron-down --></svg>
        </button>
        <!-- Dropdown panel -->
        <div class="absolute top-full left-0 mt-1 rounded-md shadow-lg bg-bg-base border border-border-subtle"
             style="z-index: var(--z-dropdown); min-width: 220px;">
          <!-- dropdown items -->
        </div>
      </li>
    </ul>

    <!-- Right: CTA -->
    <div class="hidden lg:flex items-center gap-3">
      <a href="tel:+1..." class="text-sm font-bold text-text-primary hover:text-brand-500 transition-fast focus-ring">
        (415) 000-0000
      </a>
      <a href="/contact/"
         class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-full bg-brand-500 hover:bg-brand-600 shadow-sm hover:shadow-brand transition-fast focus-ring">
        Contact Us
      </a>
    </div>

    <!-- Mobile hamburger -->
    <button class="lg:hidden icon-container icon-container-md squircle bg-bg-muted hover:bg-bg-emphasis text-text-primary transition-fast focus-ring"
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

Two sizes. All form-context buttons use **md**. **lg** is for standalone hero CTAs only.

| Size | Height | Padding | Font | Use |
|---|---|---|---|---|
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
<button class="icon-container icon-container-md squircle bg-bg-muted hover:bg-bg-emphasis text-text-secondary hover:text-text-primary transition-fast focus-ring">
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
    class="flex-1 px-4 py-[9px] text-sm font-normal leading-5 text-text-primary bg-bg-base border border-border-default rounded-l-sm placeholder:text-text-muted focus:outline-none focus:border-brand-500 focus:shadow-focus-ring transition-fast"
    placeholder="you@startup.com" />
  <button class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-r-sm transition-fast focus-ring">
    Subscribe
  </button>
</div>
```

### Card

```html
<!-- Standard card -->
<div class="rounded-md bg-bg-subtle border border-border-subtle shadow-sm hover:shadow-md hover-lift p-6">
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
  <label class="text-sm font-bold text-text-primary">
    Email address
  </label>
  <input type="email"
    class="w-full px-4 py-[9px] text-sm font-normal leading-5 text-text-primary bg-bg-base dark:bg-bg-subtle border border-border-default rounded-sm placeholder:text-text-muted focus:outline-none focus:border-brand-500 focus:shadow-focus-ring transition-fast"
    placeholder="you@startup.com" />
  <p class="text-xs text-text-muted">We'll never share your email.</p>
</div>
```

### Feature Icon Block

```html
<div class="flex flex-col gap-4 p-6 rounded-xl bg-bg-subtle border border-border-subtle hover-lift">
  <div class="icon-container icon-container-xl squircle"
       style="background: var(--gradient-brand);">
    <svg class="text-white" width="28" height="28" stroke-width="1.5" ...></svg>
  </div>
  <div class="space-y-2">
    <h3 class="text-xl font-bold text-text-primary">Virtual CFO Services</h3>
    <p class="text-base text-text-secondary leading-relaxed">
      Expert financial strategy for Series A+ startups.
    </p>
  </div>
</div>
```

### Stat / Metric Card

```html
<div class="squircle bg-bg-subtle border border-border-subtle p-6 text-center hover-lift">
  <p class="text-5xl font-black text-gradient-brand">500+</p>
  <p class="text-sm font-normal text-text-secondary mt-1">Startups Funded</p>
</div>
```

### Section Hero

```html
<section class="bg-hero-gradient section-spacing">
  <div class="container-site">
    <div class="max-w-prose mx-auto text-center flex flex-col gap-6">

      <!-- Eyebrow label -->
      <span class="inline-flex items-center gap-1.5 mx-auto px-3 py-1 text-xs font-black tracking-wide uppercase text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 rounded-full border border-brand-200 dark:border-brand-800">
        <span class="size-1.5 rounded-full bg-brand-500"></span>
        Startup Accounting
      </span>

      <!-- Display headline — font-bold, gradient span inherits weight -->
      <h1 class="text-6xl lg:text-7xl font-bold tracking-tight text-text-primary">
        Your startup's<br>
        <span class="text-gradient-brand">financial backbone</span>
      </h1>

      <!-- Lead -->
      <p class="text-base lg:text-lg font-normal text-text-secondary leading-relaxed">
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
@import "./_features/design-system/tokens.css";
```

Tailwind v4 uses CSS-native `@theme` — no `tailwind.config.js`. All tokens in `tokens.css` become Tailwind utilities automatically.

### Token → Utility Quick Reference

| Token | Tailwind class | Example |
|---|---|---|
| `--color-brand-500` | `bg-brand-500`, `text-brand-500`, `border-brand-500` | Primary button bg |
| `--color-bg-subtle` | `bg-bg-subtle` | Card background |
| `--color-text-primary` | `text-text-primary` | Body text |
| `--color-border-default` | `border-border-default` | Input border |
| `--radius-md` | `rounded-md` | Standard card |
| `rounded-full` (built-in) | `rounded-full` | Buttons, round badges |
| `--shadow-md` | `shadow-md` | Hover shadow |
| `--shadow-brand` | `shadow-brand` | CTA button glow |
| `--color-bg-base` dark mode | `dark:bg-[var(--color-bg-base)]` or semantic via `.dark` | Auto-switches |

### CSS Variable Usage

For gradients, transitions, and z-index — use inline `style` or custom CSS:

```html
<section style="background: var(--gradient-hero-light);">
<div style="box-shadow: var(--shadow-brand);">
<div style="transition: var(--transition-spring);">
<div style="z-index: var(--z-dropdown);">
```

### Dark Mode Classes

```html
<div class="bg-bg-subtle dark:bg-bg-subtle">  <!-- semantic tokens auto-switch -->
<p class="text-text-primary">               <!-- auto dark mode via .dark on <html> -->
<div class="bg-neutral-50 dark:bg-neutral-900"> <!-- manual scale if needed -->
```
