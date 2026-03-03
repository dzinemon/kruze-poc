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

Docker bind-mounts the entire repo, so it reads the same per-app `.env.local` files as local dev. Create them as described above (same step as Option A), then:

```bash
docker compose up --build
```

All three apps start with hot reload:

| App | URL |
|-----|-----|
| Next.js | http://localhost:3000 |
| Astro | http://localhost:4321 |
| Sanity Studio | http://localhost:3333 |

Run a single app:

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

## Tech Stack

| Layer | Technology |
|-------|-----------|
| CMS | Sanity v3 |
| Framework A | Next.js 15 (App Router) |
| Framework B | Astro 5 |
| Monorepo | Turborepo + pnpm workspaces |
| Styling | Tailwind CSS v4 |
| Language | TypeScript (strict) |
