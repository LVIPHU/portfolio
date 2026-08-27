# web-2026

Portfolio version 2026 — Next.js 16 App Router, port **3000**. Thiết kế hiện tại (Lenis + GSAP + three/r3f).

Stack dùng chung với 2025: React 19, Tailwind v4, next-intl (`vi` mặc định, `/en`), packages `@portfolio/*`. Luật hình ảnh/chữ/gold: [docs/design-system.md](docs/design-system.md).

## Chạy

Từ **root monorepo**:

```bash
pnpm install
pnpm dev:2026   # http://localhost:3000
```

`DATABASE_URL` tuỳ chọn (stats blog soft-fail về 0). `NEXT_PUBLIC_UMAMI_WEBSITE_ID` tuỳ chọn — không có thì không gắn script. Speed Insights chỉ có trên Vercel.

## Nội dung

| Sửa                        | Ở đâu                                                                      |
| -------------------------- | -------------------------------------------------------------------------- |
| Profile, projects, gallery | `packages/content/src/`                                                    |
| Blog                       | `packages/content/blog/<slug>.<locale>.mdx`                                |
| Case study                 | `packages/content/projects/<slug>.<locale>.mdx` + slug trong `projects.ts` |
| Chữ UI                     | `apps/2026/messages/{vi,en}.json`                                          |

## Ghi chú

- Intro chạy **một lần mỗi session** (sessionStorage). Reduced-motion bỏ overlay.
- OG/favicon sinh bằng `opengraph-image.tsx` / `icon.tsx` — `public/` không chứa file favicon tĩnh.
- `pnpm ci-check` ở root là cổng chất lượng (prettier, eslint, vitest, typecheck, build, check-links).
