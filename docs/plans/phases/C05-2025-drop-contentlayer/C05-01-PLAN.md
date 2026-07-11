---
phase: C05-2025-drop-contentlayer
plan: 01
type: execute
wave: 1
depends_on: [C02-03, C03-03]
files_modified:
  - apps/2025/src/utils/content.ts # MỚI
  - apps/2025/src/utils/contentlayer.ts # XÓA
  - apps/2025/src/utils/index.ts
  - apps/2025/src/app/[lang]/(page)/blog/page.tsx
  - apps/2025/src/app/[lang]/(page)/tags/[tag]/page.tsx
  - apps/2025/src/app/sitemap.ts
  - apps/2025/src/components/templates/{blog,tag}.tsx
  - apps/2025/src/components/organisms/{grid-view,list-view}.tsx
  - apps/2025/src/components/molecules/{post-card-grid-view,post-card-list-view}.tsx
  - apps/2025/src/components/atoms/authors.tsx
autonomous: true
requirements: [REQ-01, REQ-10]
must_haves:
  truths:
    - '13/14 file consumer hết import contentlayer/generated (trừ blog/[...slug]/page.tsx — plan 02)'
    - 'Typecheck xanh với nguồn dữ liệu mới qua eo biển utils/content.ts'
  artifacts:
    - 'apps/2025/src/utils/content.ts với đầy đủ signature cũ + mapLocale'
  key_links:
    - 'Mọi consumer đi qua utils/content.ts, không import trực tiếp @portfolio/content rải rác (trừ chỗ cần type)'
---

<objective>
Dựng eo biển `utils/content.ts` (D-01) và chuyển 13/14 file consumer sang nguồn mới (file thứ 14 — trang render bài — thuộc plan 02 vì kéo theo MDXContent/layout map). Thi công trên branch `c5-drop-contentlayer` (D-13).
</objective>

<context>
@docs/plans/phases/C05-2025-drop-contentlayer/C05-CONTEXT.md
@apps/2025/src/utils/contentlayer.ts
@packages/content/src/index.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Rà field contentlayer toàn app + viết utils/content.ts</name>
  <files>apps/2025/src/utils/content.ts, apps/2025/src/utils/index.ts</files>
  <action>Chạy grep -rn "_raw\|_id\|body\." apps/2025/src --include="*.tsx" --include="*.ts" để lập bảng đầy đủ field contentlayer được dùng NGOÀI danh sách 14 file đã biết (điểm nghi trong code_context) — ghi bảng vào SUMMARY. Rồi viết utils/content.ts theo D-01 + mẫu M-01: giữ nguyên signature sortPosts/allCoreContent/coreContent/dateSortDesc (+ pick/omit nếu grep thấy ai dùng — Claude tự quyết), CoreContent<T> = Omit<T,'content'>, thêm mapLocale (D-04); re-export type PostMeta/Post/Author từ @portfolio/content. Cập nhật utils/index.ts barrel; XÓA utils/contentlayer.ts (không giữ shim tạm — đổi 1 lần dứt điểm theo plan cũ).</action>
  <verify>test -f apps/2025/src/utils/content.ts && test ! -f apps/2025/src/utils/contentlayer.ts && echo ok; grep -n "export function sortPosts\|export function allCoreContent\|mapLocale" apps/2025/src/utils/content.ts | wc -l ≥ 3</verify>
  <done>Eo biển sẵn sàng, bảng field-ngoài-luồng có trong SUMMARY, file cũ đã xóa.</done>
</task>

<task type="auto">
  <name>Task 2: Đổi nguồn 13 file consumer</name>
  <files>apps/2025/src/app/[lang]/(page)/blog/page.tsx, apps/2025/src/app/[lang]/(page)/tags/[tag]/page.tsx, apps/2025/src/app/sitemap.ts, apps/2025/src/components/templates/blog.tsx, apps/2025/src/components/templates/tag.tsx, apps/2025/src/components/organisms/grid-view.tsx, apps/2025/src/components/organisms/list-view.tsx, apps/2025/src/components/molecules/post-card-grid-view.tsx, apps/2025/src/components/molecules/post-card-list-view.tsx, apps/2025/src/components/atoms/authors.tsx, apps/2025/src/components/templates/post-layout.tsx, apps/2025/src/components/templates/post-simple.tsx, apps/2025/src/components/templates/post-banner.tsx</files>
  <action>Từng file trong 13 file (danh sách 14 file ở code_context TRỪ blog/[...slug]/page.tsx): đổi import contentlayer/generated → type/hàm từ @/utils/content; nguồn dữ liệu allBlogs → getAllPosts(mapLocale(lang)) tại các page (D-04 — mỗi lang thấy bài locale đó + fallback, hành vi có chủ đích); map field theo D-02 (path thay _raw.flattenedPath; toc gọi extractTocHeadings từ @portfolio/mdx tại chỗ template cần; structuredData → getStructuredData). 3 template post-* chỉ đổi TYPE import (CoreContent<Post>) — không đổi logic render children (D-03 giữ nguyên hợp đồng). authors.tsx đổi sang getAllAuthors/getAuthor của @portfolio/content qua eo biển. transpilePackages: thêm '@portfolio/content','@portfolio/mdx' vào next.config.ts NGAY plan này (build cần), phần còn lại của next.config (withContentlayer) GIỮ đến plan 04 — contentlayer vẫn chạy song song, nguồn của nó không còn ai đọc.</action>
  <verify>grep -rl "contentlayer/generated" apps/2025/src | wc -l = 1 (chỉ còn blog/[...slug]/page.tsx); pnpm --filter web-2025 typecheck thoát 0</verify>
  <done>13 file sống trên nguồn mới; typecheck xanh; app vẫn build được (PowerShell) vì contentlayer còn nguyên chờ plan 04.</done>
</task>

</tasks>

<verification>
`pnpm --filter web-2025 typecheck` + `pnpm build --filter=web-2025` (PowerShell — còn contentlayer) xanh; dev :3001 trang /vi-VN/blog hiện danh sách từ nguồn mới (bài vi + fallback — hành vi D-04 quan sát được ngay).
</verification>

<success_criteria>
Eo biển hoạt động, chỉ còn 1 file + scripts đọc contentlayer, sẵn sàng plan 02 thay renderer.
</success_criteria>

<output>
Commit (branch c5-drop-contentlayer): `feat(2025): content facade over @portfolio/content, migrate 13 consumers`
Sau khi xong: viết C05-01-SUMMARY.md.
</output>
