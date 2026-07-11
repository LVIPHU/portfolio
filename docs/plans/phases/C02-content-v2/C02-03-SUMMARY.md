---
phase: C02-content-v2
plan: 03
subsystem: content
tags: [schema-adoption, frontmatter, assets]
provides:
  - 2026 dùng field summary thống nhất (4 MDX + generateMetadata + post-card)
  - Bằng chứng fail-fast D-02 (test tiêu cực date banana)
  - public/content/blog sync tự động (script vốn đã đệ quy — không phải sửa)
affects: [C03-mdx-package, C05-2025-drop-contentlayer]
key-files:
  modified:
    - packages/content/blog/hello-world.{vi,en}.mdx (description→summary)
    - packages/content/blog/portfolio-monorepo.{vi,en}.mdx (description→summary)
    - apps/2026/src/app/[locale]/blog/[slug]/page.tsx (post.summary)
    - apps/2026/src/components/post-card.tsx (post.summary)
key-decisions:
  - 'project-card.tsx dùng project.description (type Project của profile — KHÔNG phải post) → giữ nguyên.'
  - 'sync-content-assets.mjs đã cpSync recursive sẵn — không sửa.'
status: complete (gate tự động) — CHỜ USER nghiệm thu mắt Task 3
completed: 2026-07-11
---

# C02-03: Chuẩn hóa 2026 + gate phase — Summary

**Phase C2 hoàn tất phần máy: schema hợp nhất chạy end-to-end trên 2026, fail-fast được chứng minh, 2025 nguyên vẹn.**

## Gate đã chạy (kết quả thật)

1. Test tiêu cực (M-03): `date: banana` → build ĐỎ với "Frontmatter không hợp lệ ở D:\portfolio\packages\content\blog\kien-truc-react-fiber.vi.mdx" → hoàn lại, git sạch. ✓ SC3
2. `pnpm build --filter=web-2026` XANH; artifact: **6/6 slug** prerender tại /vi/blog (4 vi + 2 en fallback — fallback locale hoạt động); 0 trang tag vietnamese/english. ✓ SC2 (phần máy)
3. `<meta name="description">` bài kien-truc-react-fiber = summary tiếng Việt. ✓
4. `pnpm typecheck` root xanh (2 lỗi description đã hết). ✓ SC1
5. Build web-2025 (PowerShell) xanh — cache hit hợp lệ vì 2025 không phụ thuộc @portfolio/content. ✓ SC4

## Còn chờ user (checkpoint Task 3)

Mở http://localhost:3000/blog (`pnpm dev:2026`): thấy 6 bài cả 2 locale, banner load từ /content/blog/, trang tags sạch tag ngôn ngữ. Sau khi OK → push (trigger deploy).
