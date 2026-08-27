# web-2025

Portfolio version 2025 — Next.js 16 App Router, port **3001**.

Stack dùng chung với 2026: React 19, Tailwind v4, next-intl (`vi` mặc định, `/en`), nội dung từ `@portfolio/content`. Blog stats (views/reactions) qua `@portfolio/service`. Comment Giscus trên bài viết.

## Chạy

Từ **root monorepo** (`D:\portfolio`):

```bash
pnpm install
# cần apps/2025/.env.local — copy từ .env.example
pnpm dev:2025   # http://localhost:3001
```

Biến bắt buộc trong `.env.local`: `NODE_ENV`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_NODE_ENV`, `DATABASE_URL` (placeholder hợp lệ là đủ — thiếu DB thì stats trả 0). Giscus và GitHub API là tuỳ chọn.

Tuỳ chọn analytics: `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (Umami Cloud, không cookie). Vercel Speed Insights tự chạy trên deploy Vercel.

## Ghi chú

- Dev port 3001, không phải 3000 (3000 là web-2026).
- Nội dung blog/ảnh/profile nằm ở `packages/content`, không còn thư mục `data/` trong app.
- `pnpm --filter web-2025 typecheck` / build từ root. Cổng chất lượng cả repo: `pnpm ci-check`.
