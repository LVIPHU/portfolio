# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A pnpm + Turborepo monorepo of portfolio website "versions". Each version is an app in `apps/`:

Both apps now run the **same locked stack** — Next.js 16.2 + React 19.2 (Turbopack, React Compiler on) + Tailwind v4 + next-intl (`vi` default no-prefix, `/en`) — and consume three shared raw-TS packages: `@portfolio/content` (data + blog), `@portfolio/mdx` (MDX pipeline + components), `@portfolio/ui` (Base UI components, hooks, GSAP motion primitives). "Upgrade one, upgrade both": a change in a shared package lands in both sites.

- `apps/2026` (package `web-2026`) — port 3000. The current design; consumes all three shared packages. Bilingual Vietnamese/English.
- `apps/2025` (package `web-2025`) — port 3001. The 2025 design, migrated onto the shared stack across phases C0–C12 (contentlayer2, Lingui, Radix, framer-motion all removed; Drizzle/Postgres extras kept, DB client lazy). History in `docs/plans/` (GSD format) — consult STATE.md/ROADMAP.md there before touching it.

## Commands

Requires Node >= 20 and pnpm 11 (`corepack enable`).

```bash
pnpm install
pnpm dev:2026     # run only the 2026 app → http://localhost:3000
pnpm dev:2025     # run only the 2025 app → http://localhost:3001
pnpm dev          # run all apps via turbo
pnpm build        # build all (turbo skips unchanged apps)
pnpm typecheck    # tsc --noEmit across all packages (both apps have it)
pnpm lint         # eslint flat config (eslint.config.mjs) — react-hooks + React Compiler rules
pnpm check-links  # dead-link crawler over both built apps (scripts/check-dead-links.mjs)
pnpm ci-check     # prettier --check + typecheck + build + check-links (one gate for humans & CI)
```

Scope to one package with turbo filters, e.g. `pnpm build --filter=web-2026` or `pnpm --filter web-2026 typecheck`. No unit tests; `pnpm ci-check` is the quality gate.

`apps/2025` requires `apps/2025/.env.local` to build (untracked). Minimum: `NODE_ENV` (`development` locally), `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_NODE_ENV`, and a syntactically valid placeholder `DATABASE_URL` (src/db/index.ts throws at build if missing; the client is lazy so it never connects unless DB features are used).

> The turbo local cache (`.turbo/`) can grow to tens of GB over many builds — delete it if the disk fills; turbo regenerates it.

## Architecture

### Shared packages (raw-TS, no build step)

All three export **raw TypeScript source** (`exports: "./src/index.ts"`, plus subpaths) and are consumed via `transpilePackages: ["@portfolio/content", "@portfolio/ui", "@portfolio/mdx"]` in each app's `next.config.ts`. Tailwind picks up their classes via `@source` in the app CSS. Version anchor = `apps/2026`.

- **`@portfolio/ui`** — shadcn components on **Base UI** (`@base-ui/react`), added one-per-CLI-command (`pnpm dlx shadcn@latest add <name>` inside `packages/ui`); `cn()` at `@portfolio/ui/utils` (react-free subpath — import cn from there, not the component barrel, so Node scripts don't pull React); shared hooks at `@portfolio/ui/hooks`; GSAP motion primitives (Reveal, useScrollProgress, ParallaxColumns, HoverHighlight, useMagnify) at `@portfolio/ui/motion`. Intra-package imports are **relative** (shadcn emits `@/…`, which resolves against the _app's_ tsconfig under transpilePackages — convert to relative after each `add`). App barrels re-export named symbols (never `export *` across a `'use client'` boundary — it crashes Turbopack).
- **`@portfolio/mdx`** — one remark/rehype pipeline (`remarkPlugins`/`rehypePlugins`) + MDX components (`defaultMdxComponents`) + `<MDXContent>` RSC renderer, shared by both apps. Includes `<Sandpack>` live playground (fences → files via the `remarkSandpackFiles` plugin at MDAST level; heavy `@codesandbox/sandpack-react` is code-split behind `next/dynamic` and must be in the app's `transpilePackages`).

### Content (`packages/content`)

- Every display string is a `Localized` object `{ vi: "...", en: "..." }` (types in [types.ts](packages/content/src/types.ts)). Structured data lives in `profile.ts`, `projects.ts`, `resume.ts`, `gallery.ts`.
- **Blog**: MDX files in `packages/content/blog/` named `<slug>.<locale>.mdx` (e.g. `hello-world.vi.mdx`). [blog.ts](packages/content/src/blog.ts) reads them from the filesystem at build/SSG time (gray-matter frontmatter: title, description, date, tags), locating the directory relative to the app's cwd or via the `PORTFOLIO_CONTENT_DIR` env var. `getPost` falls back to the other locale if a translation is missing.
- **Assets**: images in `packages/content/assets/` are copied into `apps/2026/public/content/` by [sync-content-assets.mjs](apps/2026/scripts/sync-content-assets.mjs), which runs automatically via `predev`/`prebuild`. `public/content/` is generated and wiped on every sync — never edit it directly; add assets to the content package.

### App (`apps/2026`) — Next.js 16 App Router, React 19, Tailwind v4

- **i18n via next-intl**: locales `vi` (default, no URL prefix) and `en` (`/en/...` prefix), configured with `localePrefix: "as-needed"` in [routing.ts](apps/2026/src/i18n/routing.ts). UI chrome strings live in `apps/2026/messages/{vi,en}.json`; content strings come from `@portfolio/content` `Localized` objects — keep that separation.
- All routes live under `src/app/[locale]/` and are statically generated (`generateStaticParams`); pages call `setRequestLocale(locale)` before rendering.
- Internal links/navigation must use `Link`, `redirect`, `usePathname`, `useRouter` from `@/i18n/navigation` (locale-aware), not `next/link`/`next/navigation` directly.
- Next 16 convention: the middleware file is [src/proxy.ts](apps/2026/src/proxy.ts) (not `middleware.ts`).
- MDX is rendered via `<MDXContent>` from `@portfolio/mdx` (server-side, `next-mdx-remote/rsc` under the hood).
- UI comes from `@portfolio/ui` (Base UI + `cn()`); theming via next-themes with Tailwind `dark:` variants. `apps/2025` consumes the same components through a shim barrel `src/components/atoms/index.ts` that re-exports from `@portfolio/ui` (app-specific atoms stay local).

### Adding a new version

Create `apps/<year>` with any stack, add `"@portfolio/content": "workspace:*"` as a dependency, and give it a unique package name and dev port. Old versions stay deployed in parallel (one Vercel project per app, Root Directory set to the app folder).

## Deploy (Vercel)

- GitHub: `LVIPHU/portfolio` (the pre-monorepo repo was renamed `portfolio-2025-legacy`). Pushing to `main` auto-deploys both Vercel projects.
- Vercel team `luong-vi-phus-projects`: project `web-2026` (Root Directory `apps/2026`) → https://web-2026.vercel.app, project `web-2025` (Root Directory `apps/2025`) → https://web-2025.vercel.app.
- Turborepo on Vercel strips undeclared env vars from task processes: non-`NEXT_PUBLIC_*` vars must be declared in the app's `turbo.json` (`env` / `passThroughEnv` — see apps/2025/turbo.json). web-2025 production env: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_NODE_ENV`, `DATABASE_URL` (placeholder; swap in a real one to enable views/reactions).
- Do NOT use `vercel build` / `vercel deploy --prebuilt` locally on Windows — the local @vercel/next builder fails lambda mapping for route groups/intercepting routes ("Unable to find lambda for route"). Deploy by pushing to `main` (or API-triggered git builds).

## Plans

The C0–C12 upgrade is complete. History and rationale live in [docs/plans/](docs/plans/) (GSD format) — start at `STATE.md` (living memory) then `ROADMAP.md`. Each phase folder has a CONTEXT (locked decisions), atomic PLANs, and SUMMARYs (evidence). Consult the relevant phase before revisiting that area. `docs/PLAN-apps-2025.md` is superseded (kept as history).

## Notes

- README and code comments are written in Vietnamese; follow that convention for user-facing docs. Respond in Vietnamese; commit messages in English (conventional format).
