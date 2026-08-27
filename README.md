# Portfolio Monorepo

Monorepo chứa các version portfolio theo thời gian. Mỗi version là một app trong `apps/`, phần dùng chung nằm trong `packages/` — nội dung (bio, projects, resume, blog, ảnh), pipeline MDX, bộ component UI, cấu hình i18n, helper và tầng API/DB. Làm lại giao diện không phải nhập lại data, và **nâng cấp một package là nâng cho cả hai site**.

Hai app hiện chạy **cùng một stack**: Next.js 16.2 + React 19.2 (Turbopack, React Compiler) + Tailwind v4 + next-intl (`vi` mặc định không prefix, `/en`).

## Cấu trúc

```
portfolio/
├── apps/
│   ├── 2025/              # Version 2025 — port 3001, thêm Drizzle/Postgres (views, reactions)
│   └── 2026/              # Version 2026 — port 3000, thêm lenis + GSAP + three/r3f
├── packages/
│   ├── content/           # Nội dung dùng chung giữa mọi version
│   │   ├── src/           # profile, projects, resume, gallery (TypeScript, song ngữ)
│   │   ├── blog/          # Bài viết MDX: <slug>.<locale>.mdx
│   │   └── assets/        # Ảnh (gallery, blog...) — tự động sync vào public/content của app
│   ├── mdx/               # Pipeline remark/rehype + component MDX + Sandpack playground
│   ├── ui/                # Component shadcn trên Base UI + motion primitive (GSAP)
│   ├── i18n/              # locales + routing/navigation/middleware/request của next-intl
│   ├── service/           # Tầng API/DB: Drizzle schema, blog stats (handler + SWR hooks)
│   ├── utils/             # cn() + helper string/object/date/fetch (không dính React)
│   └── hooks/             # Hook client dùng chung (useMediaQuery, useDragRotate...)
├── pnpm-workspace.yaml
└── turbo.json
```

Mọi package export **TypeScript thô** (không có bước build), app nạp qua `transpilePackages`. Riêng `messages/{vi,en}.json` (chữ giao diện) vẫn nằm trong từng app.

## Chạy dự án

Yêu cầu: Node >= 20, pnpm 11 (`corepack enable`).

```bash
pnpm install
pnpm dev          # chạy tất cả apps
pnpm dev:2026     # chỉ chạy version 2026 → http://localhost:3000
pnpm dev:2025     # chỉ chạy version 2025 → http://localhost:3001 (cần apps/2025/.env.local)
pnpm build        # build tất cả (Turborepo chỉ build app có thay đổi)
pnpm typecheck    # tsc --noEmit toàn workspace
pnpm lint         # eslint (react-hooks + React Compiler)
pnpm format       # prettier --check (format:write để tự sửa)
pnpm check-links  # crawler dò link chết trên bản build của cả 2 app
pnpm ci-check     # prettier + eslint + vitest + typecheck + build + check-links
```

Testing: Vitest + Testing Library cho shared packages (`packages/utils`, `hooks`, `content`, `service`). Không có unit test ở app — `pnpm test` (vitest run) nằm trong `ci-check`. GitHub Actions chạy đúng `pnpm ci-check`. Commit được prettier + eslint --fix qua husky + lint-staged.

Analytics: **Umami Cloud** (pageviews, `data-umami-event`) khi có `NEXT_PUBLIC_UMAMI_WEBSITE_ID`; **Vercel Speed Insights** (Core Web Vitals) trên deploy. Thiếu env thì Umami không render — app vẫn chạy.

`apps/2025` cần `apps/2025/.env.local` (không commit) mới build được: `NODE_ENV`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_NODE_ENV`, và `DATABASE_URL` (chỉ cần chuỗi hợp lệ — client DB lazy, thiếu DB thì stats tự trả 0). `apps/2026` chỉ cần `DATABASE_URL` tuỳ chọn, xem `apps/2026/.env.example`. Migration + drizzle-kit nằm ở `packages/service` (`pnpm --filter @portfolio/service db:push`).

Vài điểm hay vướng khi chạy local:

- Build local ghi ra `.next-build`, còn dev dùng `.next` — cố ý tách để `next build` không phá dev server.
- Mỗi lần `pnpm dev` sẽ tự xoá `.next` trước (Turbopack dev đôi khi kẹt ở trạng thái 404 toàn bộ route mà restart không chữa được).
- Cache của Turborepo (`.turbo/`) có thể phình lên hàng chục GB — đầy đĩa thì cứ xoá, nó tự tạo lại.

## Cập nhật nội dung

| Muốn sửa                              | Sửa ở đâu                                                                                          |
| ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Tên, chức danh, bio, social links     | `packages/content/src/profile.ts`                                                                  |
| Projects                              | `packages/content/src/projects.ts`                                                                 |
| Resume (kinh nghiệm, học vấn, skills) | `packages/content/src/resume.ts`                                                                   |
| Ảnh gallery                           | Thêm ảnh vào `packages/content/assets/gallery/` + khai báo trong `packages/content/src/gallery.ts` |
| Viết blog                             | Tạo `packages/content/blog/<slug>.vi.mdx` và `<slug>.en.mdx`                                       |
| Case study (2026)                     | Tạo `packages/content/projects/<slug>.<locale>.mdx` + khai báo slug trong `projects.ts`            |
| Chữ giao diện (nav, footer, nút...)   | `apps/<version>/messages/{vi,en}.json`                                                             |
| File resume PDF                       | Đặt `resume.pdf` vào `apps/2026/public/`                                                           |

Mọi text nội dung đều song ngữ dạng `{ vi: "...", en: "..." }`. URL tiếng Việt không có prefix, tiếng Anh có `/en`. Thiếu bản dịch của một bài blog thì site tự rơi về locale còn lại.

`public/content/` là thư mục **sinh tự động** (xoá sạch và copy lại trước mỗi lần dev/build) — đừng sửa trực tiếp, hãy thêm ảnh vào `packages/content/assets/`.

## Thiết kế (version 2026)

Hệ thiết kế của web-2026 nằm ở [apps/2026/docs/design-system.md](apps/2026/docs/design-system.md); nguồn sự thật là `apps/2026/src/app/globals.css` + `src/components/showcase/theme.css`. Đọc trước khi đụng vào màu, khoảng cách hay typography — luật khá chặt (kích thước scale theo viewport, một breakpoint 800px, bộ ba theme token, và **một** gold thương hiệu duy nhất kèm giới hạn chỗ được dùng).

Font: Anton (h1/h2) + Space Grotesk (h3/h4) + Roboto (thân bài), tất cả qua `next/font`. Font thay thế bắt buộc phải có subset `vietnamese` — Panchang bị loại vì thiếu glyph tiếng Việt và hỏng rất im lặng (chữ Latin đúng font, dấu rơi về font hệ thống).

## Thêm version mới (ví dụ 2027)

1. Tạo `apps/2027` (stack tùy ý — Next, Astro...) với tên package và port dev riêng
2. Thêm dependency `"@portfolio/content": "workspace:*"` để dùng lại toàn bộ nội dung (thêm `@portfolio/i18n` / `mdx` / `ui` / `utils` / `hooks` / `service` nếu muốn đi chung stack)
3. Version cũ vẫn giữ nguyên trong `apps/2026`, deploy song song (ví dụ `2026.your-domain.com`)

## Deploy (Vercel)

Mỗi app một Vercel project, đặt **Root Directory** = thư mục app (`apps/2026`, `apps/2025`). Vercel tự nhận diện Turborepo và chỉ build khi app đó (hoặc package nó phụ thuộc) thay đổi; push lên `main` là deploy.

Lưu ý: biến môi trường không phải `NEXT_PUBLIC_*` phải được khai trong `turbo.json` của app (`env` / `passThroughEnv`), nếu không Turborepo sẽ lọc mất khi build trên Vercel.
