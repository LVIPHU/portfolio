# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A pnpm + Turborepo monorepo of portfolio website "versions". Each version is an app in `apps/`:

- `apps/2026` (package `web-2026`) — Next.js 16 + React 19.2 + Tailwind v4 + next-intl, port 3000. Uses shared content from `packages/content` (`@portfolio/content`), so a redesign never requires re-entering data. Bilingual Vietnamese/English.
- `apps/2025` (package `web-2025`) — the older portfolio: Next.js 15.2 + Lingui (2 locales `/vi-VN`, `/en-US`), Drizzle/Postgres-backed extras, port 3001. Blog/content now comes from `packages/content` and renders via `packages/mdx` (contentlayer2 removed in C5). Upgrades follow the staged roadmap in `docs/plans/` (GSD format) — consult STATE.md/ROADMAP.md there before touching it.

## Commands

Requires Node >= 20 and pnpm 11 (`corepack enable`).

```bash
pnpm install
pnpm dev:2026     # run only the 2026 app → http://localhost:3000
pnpm dev:2025     # run only the 2025 app → http://localhost:3001
pnpm dev          # run all apps via turbo
pnpm build        # build all (turbo skips unchanged apps)
pnpm typecheck    # tsc --noEmit across all packages
```

Scope to one package with turbo filters, e.g. `pnpm build --filter=web-2026` or `pnpm --filter web-2026 typecheck`.

There are no tests and no linter configured — `pnpm typecheck` and `pnpm build` are the verification gates (`web-2025` has no typecheck script yet; its `next build` type-checks).

`apps/2025` requires `apps/2025/.env.local` to build (untracked). Minimum: `NODE_ENV=development`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_NODE_ENV`, and a syntactically valid placeholder `DATABASE_URL` (src/db/index.ts throws at build if missing; the client is lazy so it never connects unless DB features are used).

## Architecture

### Content layer (`packages/content`)

- Exported as **raw TypeScript source** (`exports: "./src/index.ts"`) with no build step; the app consumes it via `transpilePackages: ["@portfolio/content"]` in `next.config.ts`.
- Every display string is a `Localized` object `{ vi: "...", en: "..." }` (types in [types.ts](packages/content/src/types.ts)). Structured data lives in `profile.ts`, `projects.ts`, `resume.ts`, `gallery.ts`.
- **Blog**: MDX files in `packages/content/blog/` named `<slug>.<locale>.mdx` (e.g. `hello-world.vi.mdx`). [blog.ts](packages/content/src/blog.ts) reads them from the filesystem at build/SSG time (gray-matter frontmatter: title, description, date, tags), locating the directory relative to the app's cwd or via the `PORTFOLIO_CONTENT_DIR` env var. `getPost` falls back to the other locale if a translation is missing.
- **Assets**: images in `packages/content/assets/` are copied into `apps/2026/public/content/` by [sync-content-assets.mjs](apps/2026/scripts/sync-content-assets.mjs), which runs automatically via `predev`/`prebuild`. `public/content/` is generated and wiped on every sync — never edit it directly; add assets to the content package.

### App (`apps/2026`) — Next.js 16 App Router, React 19, Tailwind v4

- **i18n via next-intl**: locales `vi` (default, no URL prefix) and `en` (`/en/...` prefix), configured with `localePrefix: "as-needed"` in [routing.ts](apps/2026/src/i18n/routing.ts). UI chrome strings live in `apps/2026/messages/{vi,en}.json`; content strings come from `@portfolio/content` `Localized` objects — keep that separation.
- All routes live under `src/app/[locale]/` and are statically generated (`generateStaticParams`); pages call `setRequestLocale(locale)` before rendering.
- Internal links/navigation must use `Link`, `redirect`, `usePathname`, `useRouter` from `@/i18n/navigation` (locale-aware), not `next/link`/`next/navigation` directly.
- Next 16 convention: the middleware file is [src/proxy.ts](apps/2026/src/proxy.ts) (not `middleware.ts`).
- MDX is rendered server-side with `MDXRemote` from `next-mdx-remote/rsc`.
- UI components follow the shadcn pattern (`src/components/ui/` with class-variance-authority + `cn()` from `src/lib/utils.ts`); theming via next-themes with Tailwind `dark:` variants.

### Adding a new version

Create `apps/<year>` with any stack, add `"@portfolio/content": "workspace:*"` as a dependency, and give it a unique package name and dev port. Old versions stay deployed in parallel (one Vercel project per app, Root Directory set to the app folder).

## Deploy (Vercel)

- GitHub: `LVIPHU/portfolio` (the pre-monorepo repo was renamed `portfolio-2025-legacy`). Pushing to `main` auto-deploys both Vercel projects.
- Vercel team `luong-vi-phus-projects`: project `web-2026` (Root Directory `apps/2026`) → https://web-2026.vercel.app, project `web-2025` (Root Directory `apps/2025`) → https://web-2025.vercel.app.
- Turborepo on Vercel strips undeclared env vars from task processes: non-`NEXT_PUBLIC_*` vars must be declared in the app's `turbo.json` (`env` / `passThroughEnv` — see apps/2025/turbo.json). web-2025 production env: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_NODE_ENV`, `DATABASE_URL` (placeholder; swap in a real one to enable views/reactions).
- Do NOT use `vercel build` / `vercel deploy --prebuilt` locally on Windows — the local @vercel/next builder fails lambda mapping for route groups/intercepting routes ("Unable to find lambda for route"). Deploy by pushing to `main` (or API-triggered git builds).

## Active plan

[docs/PLAN-apps-2025.md](docs/PLAN-apps-2025.md) is the agreed roadmap for importing the older 2025 portfolio as `apps/2025` and incrementally upgrading it (Contentlayer→Velite, Lingui→next-intl, Next 15→16, motion→GSAP). Consult it before doing any `apps/2025` work — the phase ordering and gates there are deliberate.

## Notes

- The repo is not yet a git repository (git init is step A0.1 of the plan above).
- README and code comments are written in Vietnamese; follow that convention for user-facing docs.
