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

## Requirements

- Node.js >= 24.12.0
- pnpm >= 9

## Getting Started

```bash
pnpm install
```

Copy `.env.example` to `.env.local` in each app and set your Sanity project credentials.

## Dev Commands

```bash
pnpm dev:studio   # Sanity Studio at localhost:3333
pnpm dev:next     # Next.js at localhost:3000
pnpm dev:astro    # Astro at localhost:4321
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

## Tech Stack

| Layer | Technology |
|-------|-----------|
| CMS | Sanity v3 |
| Framework A | Next.js 15 (App Router) |
| Framework B | Astro 5 |
| Monorepo | Turborepo + pnpm workspaces |
| Styling | Tailwind CSS v4 |
| Language | TypeScript (strict) |
