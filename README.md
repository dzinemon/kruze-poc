# Kruze POC — Next.js vs Astro with Sanity CMS

A focused comparison of **Next.js 15** and **Astro 5** rendering identical content from **Sanity CMS**. The goal is to evaluate editor workflow, custom block rendering, and framework performance to inform a full site migration.

## Live Environments

| App | Environment | URL |
|-----|-------------|-----|
| Sanity Studio | Production | https://kruze-website.sanity.studio/ |
| Next.js (Vercel) | Production | https://kruze-poc-next-app.vercel.app/ |
| Next.js (Vercel) | Staging | https://kruze-poc-next-app-git-dev-andriishas-projects.vercel.app/ |
| Astro (Cloudflare) | Production | https://kruze-poc.pages.dev/ |
| Astro (Cloudflare) | Staging | https://dev.kruze-poc.pages.dev/ |

## What This Compares

- **Editor workflow** — Sanity Studio → content → rendered in both apps
- **Portable Text custom blocks** — charts, CTAs, alerts, YouTube embeds
- **Block page builder** — hero, text, chart, testimonials, FAQ sections
- **Framework metrics** — Lighthouse scores, bundle sizes, build times, DX

## Tech Stack

### Core Frameworks

| Technology | Version | Usage |
|---|---|---|
| Next.js | 16.0.0 | App Router, React Server Components, `generateStaticParams` for SSG |
| Astro | 5.17.3 | Static HTML output + React islands for interactivity |
| React | 19.0.0 | Full rendering in Next.js; islands only (charts, YouTube) in Astro |
| TypeScript | 5.7.3 | Strict mode, no `any`, shared types from workspace packages |

### CMS & Content

| Technology | Version | Usage |
|---|---|---|
| Sanity Studio | 5.11.0 | Headless CMS — content editing at localhost:3333 |
| @sanity/client | 7.15.0 | GROQ data fetching in both apps |
| next-sanity | 12.1.0 | Draft mode, live preview, visual editing in Next.js |
| GROQ | — | Query language; shared queries in `packages/groq-queries` |

### Portable Text Rendering

| Technology | Version | Usage |
|---|---|---|
| @portabletext/react | 6.0.2 | React renderer — used in Next.js hybrid component |
| @portabletext/to-html | 5.0.1 | HTML string renderer — used in Astro for zero-JS static output |

Both apps use a **hybrid approach**: consecutive text blocks render as static HTML (SEO-friendly), while chart and YouTube blocks become interactive islands.

### Styling & Design Tokens

| Technology | Version | Usage |
|---|---|---|
| Tailwind CSS | 4.2.1 | Primary styling — v4 `@theme` with CSS-native tokens, no JS config |
| packages/tailwind-config | — | Shared design system: `tokens.css` (200+ CSS custom properties) + `prose.css` (self-contained typography presets, no plugin dependency) |
| Dark mode | — | Class-based (`<html class="dark">`), semantic tokens auto-switch |

### Fonts

| Technology | Details |
|---|---|
| Lato | 4 weights: 300 (light), 400 (normal), 700 (bold), 900 (black) |
| Next.js loading | `next/font/google` — auto self-hosted, preloaded, CSS variable `--font-lato` |
| Astro loading | Astro Fonts API (`fontProviders.google()`) — auto self-hosted, preloaded, CSS variable `--font-lato` |

### Icons

| Technology | Version | Usage |
|---|---|---|
| lucide-react | 0.576.0 | Icon library in Next.js and shared `packages/ui` components |
| Inline SVGs | — | Hand-coded SVGs in Astro `.astro` components (no icon library dep) |

All icons use `stroke-width="1.5"`, `currentColor`, and the design system icon size scale.

### Images

| Technology | Version | Usage |
|---|---|---|
| @sanity/image-url | 2.0.3 | Builds responsive URLs with srcset from Sanity CDN assets |
| LQIP blur | — | Low-quality image placeholder via inline CSS `background-image` |

No `next/image` or `astro:image` — both apps use plain `<img>` with Sanity-generated srcset and lazy loading.

### Charts

| Technology | Details |
|---|---|
| Google Charts | CDN-loaded (`gstatic.com`), lazy via IntersectionObserver |
| Chart config | JSON string stored in Sanity `chartBlock` — type, data, options |
| Rendering | React `"use client"` component in Next.js; `client:load` island in Astro |

### Animations

| Technology | Details |
|---|---|
| CSS transitions | Design tokens: `--transition-fast` (150ms), `--transition-base` (200ms), `--transition-spring` (400ms) |
| framer-motion | 12.34.3 — in dependencies but not actively used |

### Monorepo Tooling

| Technology | Version | Usage |
|---|---|---|
| pnpm | 10.30.2 | Package manager with workspaces |
| Turborepo | 2.8.10 | Build orchestration, parallel dev servers, task caching |

### Shared Workspace Packages

| Package | Purpose |
|---|---|
| `packages/sanity-schemas` | Sanity schema definitions + shared TypeScript types |
| `packages/groq-queries` | GROQ queries used identically by both apps |
| `packages/ui` | Shared React components: Portable Text renderer, GoogleChart, block components, image utilities |
| `packages/tailwind-config` | Shared design system: `tokens.css` (design tokens, base styles, utilities) + `prose.css` (typography presets) |

### Deployment

| App | Platform | Details |
|---|---|---|
| Next.js | Vercel | `output: "standalone"`, automatic preview deploys per branch |
| Astro | Cloudflare Pages | `@astrojs/cloudflare` adapter, Wrangler CLI, branch previews |
| Astro (alt) | Node.js / Docker | `@astrojs/node` adapter via `BUILD_TARGET=docker` |
| Sanity Studio | Sanity CDN | `sanity deploy` to hosted dashboard |

## Monorepo Structure

```
kruze-poc/
├── apps/
│   ├── studio/          # Sanity Studio (localhost:3333)
│   ├── next-app/        # Next.js 15 (localhost:3000)
│   └── astro-app/       # Astro 5 (localhost:4321)
├── packages/
│   ├── sanity-schemas/  # Sanity schema definitions and types
│   ├── groq-queries/    # Shared GROQ queries
│   ├── ui/              # Shared React components
│   └── tailwind-config/ # Shared Tailwind preset
└── scripts/             # Content migration scripts
```

## Environment Variables

The root `.env` is checked in and contains the public Sanity config (`SANITY_PROJECT_ID`, `SANITY_DATASET`). It is safe to commit.

Each app also needs a **`.env.local`** file for secrets (git-ignored). Use `.env.example` as a reference:

| File | Required variables |
|------|--------------------|
| `apps/next-app/.env.local` | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN` |
| `apps/astro-app/.env.local` | `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_READ_TOKEN` |
| `apps/studio/.env.local` | `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET` |

Get the `SANITY_API_READ_TOKEN` from the [Sanity dashboard](https://sanity.io/manage) → API → Tokens.

## Getting Started

### Option A — Local (Node.js)

**Requirements:** Node.js >= 24.12.0, pnpm >= 9

```bash
pnpm install
```

Create the per-app `.env.local` files as described above, then:

```bash
pnpm dev
```
This runs all three apps concurrently. You can also run them individually:

```bash
pnpm dev:studio   # Sanity Studio at localhost:3333
pnpm dev:next     # Next.js at localhost:3000
pnpm dev:astro    # Astro at localhost:4321
```

### Option B — Docker (no local Node/pnpm required)

**Requirements:** Docker Desktop

Docker bind-mounts the entire repo, so it reads the same per-app `.env.local` files as local dev. Create them as described above (same step as Option A).

#### First-time setup

You must run `pnpm install` locally once to generate/update `pnpm-lock.yaml` before building the Docker image. The image runs `pnpm install --frozen-lockfile` and will fail if the lockfile is missing or out of date.

```bash
pnpm install          # generates/updates pnpm-lock.yaml
docker compose up --build
```

#### Subsequent runs

```bash
docker compose up
```

Hot reload is enabled for all three apps — file changes on the host are picked up immediately.

#### After adding or updating dependencies

The Docker named volumes cache `node_modules`. When you change any `package.json`, you must rebuild and wipe the old volumes:

```bash
pnpm install                  # update pnpm-lock.yaml on the host
docker compose down -v        # destroy stale node_modules volumes
docker compose up --build     # rebuild image + reinitialise volumes
```

#### All three apps start with hot reload

| App | URL |
|-----|-----|
| Next.js | http://localhost:3000 |
| Astro | http://localhost:4321 |
| Sanity Studio | http://localhost:3333 |

#### Run a single app

```bash
docker compose up next-app
docker compose up astro-app
docker compose up studio
```

## Other Commands

```bash
pnpm build        # Build all apps
pnpm type-check   # Type-check all packages
pnpm lint         # Lint all packages
```

## Deploying Sanity Studio

Sanity Studio can be deployed to Sanity's hosted CDN with a single command.

```bash
cd apps/studio
pnpm sanity deploy
```

To update an existing deployment, run the same command — it overwrites the previous build.

> **Note:** You must be logged in to the Sanity CLI (`pnpm sanity login`) and have deploy permissions on the project.

