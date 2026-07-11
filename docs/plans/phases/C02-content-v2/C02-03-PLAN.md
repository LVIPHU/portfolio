---
phase: C02-content-v2
plan: 03
type: execute
wave: 2
depends_on: [C02-01, C02-02]
files_modified:
  - packages/content/blog/hello-world.vi.mdx
  - packages/content/blog/hello-world.en.mdx
  - packages/content/blog/portfolio-monorepo.vi.mdx
  - packages/content/blog/portfolio-monorepo.en.mdx
  - apps/2026/src/components/post-card.tsx
  - apps/2026/src/app/[locale]/blog/page.tsx
  - apps/2026/src/app/[locale]/blog/[slug]/page.tsx
  - apps/2026/scripts/sync-content-assets.mjs # chỉ khi chưa copy đệ quy
autonomous: false
requirements: [REQ-01, REQ-10]
must_haves:
  truths:
    - 'Build web-2026 xanh; :3000/blog hiện đủ 6 slug (4 vi + 2 en fallback ở locale vi và ngược lại)'
    - 'Frontmatter sai (date: banana) làm build ĐỎ với message chứa đường dẫn file'
    - 'Build web-2025 (PowerShell) xanh, hành vi không đổi'
  artifacts:
    - '4 MDX 2026 dùng key summary thay description'
    - 'apps/2026/public/content/blog/*.jpg xuất hiện sau sync'
  key_links:
    - 'generateMetadata của [slug] đọc post.summary → <meta name=description> đúng'
    - 'Trang tags gộp tag 2 nguồn, không còn vietnamese/english'
---

<objective>
Chốt phase C2: chuẩn hóa 4 MDX 2026 sang schema mới, xác nhận sync assets ăn thư mục con mới, chạy toàn bộ gate (typecheck + build 2 app + smoke + test tiêu cực fail-fast) và user nghiệm thu.
</objective>

<context>
@docs/plans/phases/C02-content-v2/C02-CONTEXT.md
@apps/2026/scripts/sync-content-assets.mjs
@packages/content/src/schema.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: 2026 đổi description → summary (MDX + code)</name>
  <files>packages/content/blog/hello-world.vi.mdx, packages/content/blog/hello-world.en.mdx, packages/content/blog/portfolio-monorepo.vi.mdx, packages/content/blog/portfolio-monorepo.en.mdx, apps/2026/src/components/post-card.tsx, apps/2026/src/app/[locale]/blog/page.tsx, apps/2026/src/app/[locale]/blog/[slug]/page.tsx</files>
  <action>Theo D-02 (schema chuẩn field 2025): đổi key frontmatter description: thành summary: trong 4 file MDX 2026. Rồi grep toàn apps/2026/src mọi chỗ đọc post.description hoặc destructure description từ Post/PostMeta — 3 file đã biết trong code_context, nhưng grep lại để bắt chỗ mới — đổi hết sang summary. Lưu ý schema có default '' cho summary nên sót chỗ nào build KHÔNG đỏ mà chỉ mất text — vì vậy grep là gate chính, không dựa build.</action>
  <verify>grep -rn "description" packages/content/blog | wc -l = 0; grep -rn "\.description\b" apps/2026/src --include="*.tsx" --include="*.ts" | grep -v "metadata.description\|openGraph" | wc -l = 0 (metadata description của Next là API khác — không đụng)</verify>
  <done>4 MDX dùng summary; code 2026 không còn đọc field description của post.</done>
</task>

<task type="auto">
  <name>Task 2: Sync assets đệ quy + test tiêu cực fail-fast</name>
  <files>apps/2026/scripts/sync-content-assets.mjs</files>
  <action>Đọc sync-content-assets.mjs: nếu script đã copy ĐỆ QUY (cpSync recursive hoặc tương đương) thì không sửa; nếu chỉ copy nông thì sửa thành đệ quy để ăn assets/blog/ + assets/authors/ mới. Chạy node apps/2026/scripts/sync-content-assets.mjs rồi kiểm public/content/blog có đủ banner. Sau đó chạy test tiêu cực theo mẫu M-03 trong CONTEXT: sửa tạm date: banana vào 1 MDX → build 2026 phải đỏ kèm đường dẫn file (bằng chứng D-02) → HOÀN LẠI file ngay. Ghi kết quả test tiêu cực vào SUMMARY.</action>
  <verify>ls apps/2026/public/content/blog | wc -l ≥ số banner trong assets/blog; git status --short packages/content/blog không còn dòng M nào sau khi hoàn lại test tiêu cực</verify>
  <done>Sync ăn thư mục con; fail-fast đã được chứng minh và hoàn trạng thái sạch.</done>
</task>

<task type="checkpoint:human-verify">
  <name>Task 3: Gate build 2 app + user nghiệm thu :3000/blog</name>
  <action>Executor chạy gate tự động: (1) pnpm typecheck root xanh; (2) pnpm build --filter=web-2026 xanh; (3) pnpm build --filter=web-2025 TỪ POWERSHELL xanh (2025 chưa đọc package này — chỉ xác nhận không vỡ vì hoisting deps). Rồi pnpm dev:2026 và mời user mở http://localhost:3000/blog: thấy đủ 6 slug bài (4 vi + 2 en fallback khi xem locale vi; đổi sang /en thấy 4 en + 2 vi fallback); mở bài kien-truc-react-fiber — ảnh banner load từ /content/blog/; trang /tags gộp tag 2 nguồn và KHÔNG còn tag vietnamese/english; view-source 1 bài kiểm <meta name="description"> = summary.</action>
  <verify>User xác nhận OK (sau khi 3 gate build pass)</verify>
  <done>6 bài hiện đúng cả 2 locale với fallback; banner load; tags sạch; meta description đúng; cả 2 build xanh.</done>
</task>

</tasks>

<verification>
Map thẳng Success Criteria Phase C2 trong ROADMAP: SC1 = typecheck (đã pass từ C02-01), SC2 = smoke Task 3, SC3 = test tiêu cực Task 2, SC4 = build 2025 Task 3.
</verification>

<success_criteria>
Phase C2 đóng: content hợp nhất hoạt động end-to-end trên 2026, 2025 nguyên vẹn, fail-fast chứng minh được.
</success_criteria>

<output>
Commit: `feat(content): unified schema adoption in 2026 (description→summary) + recursive asset sync`
Sau khi xong: viết C02-03-SUMMARY.md, tick cả phase C2 trong ROADMAP Progress, cập nhật STATE.md (vị trí → C3).
</output>
