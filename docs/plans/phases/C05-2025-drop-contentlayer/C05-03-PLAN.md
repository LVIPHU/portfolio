---
phase: C05-2025-drop-contentlayer
plan: 03
type: execute
wave: 3
depends_on: [C05-02]
files_modified:
  - apps/2025/scripts/generate-content-json.ts # MỚI
  - apps/2025/scripts/rss.ts
  - apps/2025/scripts/sync-content-assets.mjs # MỚI, port từ 2026
  - apps/2025/package.json # predev/prebuild hooks
  - packages/content/src/blog.ts # chỉ khi cần slugify getTagData (D-06)
autonomous: true
requirements: [REQ-01, REQ-10]
must_haves:
  truths:
    - 'json/tag-data.json + public/search.json sinh từ script mới, shape khớp bản contentlayer (kbar + tags page chạy)'
    - 'feed.xml + tags/*/feed.xml sinh từ @portfolio/content, item link giữ slug cũ'
  artifacts:
    - 'scripts/generate-content-json.ts, scripts/sync-content-assets.mjs, hooks predev/prebuild trong package.json'
  key_links:
    - 'URL /tags/<slug> khớp key trong tag-data.json (điểm nghi slugify D-06)'
---

<objective>
Tái lập 3 side-effect của contentlayer `onSuccess` + postbuild bằng script tường minh (D-06, D-07, D-08): tag/search json, RSS, sync assets.
</objective>

<context>
@docs/plans/phases/C05-2025-drop-contentlayer/C05-CONTEXT.md
@apps/2025/scripts/rss.ts
@apps/2026/scripts/sync-content-assets.mjs
@packages/content/src/blog.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: generate-content-json.ts + quyết định slugify</name>
  <files>apps/2025/scripts/generate-content-json.ts, apps/2025/package.json, packages/content/src/blog.ts</files>
  <action>Trước tiên xử điểm nghi D-06: đọc apps/2025/src/app/[lang]/(page)/tags/[tag]/page.tsx và tags/page.tsx xem key tag đang dùng dạng slugified (github-slugger) hay raw. Bản onSuccess cũ slugify — nếu consumer cần slug thì sửa getTagData trong packages/content/src/blog.ts dùng slug(tag) của github-slugger (sửa TẠI packages/content để 2026 hưởng chung, thêm github-slugger vào deps của content nếu chưa); nếu consumer dùng raw thì giữ nguyên và ghi rõ vào SUMMARY. Rồi viết scripts/generate-content-json.ts theo mẫu M-03; hook vào package.json: predev/prebuild chạy tsx scripts/generate-content-json.ts (thay vai trò onSuccess).</action>
  <verify>npx tsx apps/2025/scripts/generate-content-json.ts thoát 0; node -e "const t=require('./apps/2025/json/tag-data.json');if(!Object.keys(t).length)throw 'rỗng';console.log(Object.keys(t))" — key khớp dạng URL /tags/ đang dùng; node -e "const s=require('./apps/2025/public/search.json');if(!Array.isArray(s)||!s[0].path)throw 'sai shape'"</verify>
  <done>2 file json sinh đúng shape; quyết định slugify được chốt bằng bằng chứng consumer.</done>
</task>

<task type="auto">
  <name>Task 2: RSS + sitemap đổi nguồn</name>
  <files>apps/2025/scripts/rss.ts</files>
  <action>Theo D-07: rss.ts bỏ import { allBlogs } from '.contentlayer/generated/index.mjs' và type Blog — thay bằng getAllPosts('vi') + getAllPosts('en') từ @portfolio/content (union, sort date desc — feed là 1 kho chung như hành vi cũ). Giữ NGUYÊN: RSS_CONFIG, generateRssItem/generateRss template XML, escape, output feed.xml + tags/<tag>/feed.xml. Field đổi: item.slug/item.path đã có sẵn trong PostMeta (shape C2 giữ tương thích). sitemap.ts đã đổi nguồn ở C05-01 — kiểm lại URL /blog/<slug> đủ và đúng.</action>
  <verify>pnpm build --filter=web-2025 (PowerShell) thoát 0 && test -f apps/2025/public/feed.xml (postbuild chạy rss); grep -c "<item>" apps/2025/public/feed.xml ≥ 8</verify>
  <done>feed.xml + per-tag feed sinh từ nguồn mới, item link slug cũ nguyên vẹn.</done>
</task>

<task type="auto">
  <name>Task 3: sync-content-assets + dọn ảnh cũ</name>
  <files>apps/2025/scripts/sync-content-assets.mjs, apps/2025/package.json</files>
  <action>Theo D-08: port sync-content-assets.mjs từ apps/2026/scripts (wipe public/content rồi copy đệ quy packages/content/assets) — đổi đường dẫn tương đối cho apps/2025; nối vào chuỗi predev/prebuild (chạy TRƯỚC generate-content-json). Ảnh banner cũ public/static/images/banners: grep toàn src + packages/content xem còn tham chiếu /static/images/banners không — 0 thì xóa thư mục, còn thì liệt kê vào SUMMARY và GIỮ (không xóa mù).</action>
  <verify>node apps/2025/scripts/sync-content-assets.mjs && ls apps/2025/public/content/blog | wc -l ≥ 4; grep -rn "/static/images/banners" apps/2025/src packages/content | wc -l — ghi số vào SUMMARY, 0 mới được xóa thư mục</verify>
  <done>Assets pipeline 2 app đồng dạng; không còn ảnh mồ côi hoặc lý do giữ được ghi lại.</done>
</task>

</tasks>

<verification>
Build PowerShell xanh; dev :3001: `/vi-VN/tags` đếm khớp và click vào `/tags/<slug>` ra bài; Cmd+K search index mới hoạt động; `feed.xml` mở trong browser là XML hợp lệ.
</verification>

<success_criteria>
Cả 3 side-effect sống độc lập khỏi contentlayer — plugin giờ hoàn toàn không còn ai dùng output.
</success_criteria>

<output>
Commit (branch c5-drop-contentlayer): `feat(2025): standalone content json/rss/assets scripts replacing contentlayer onSuccess`
Sau khi xong: viết C05-03-SUMMARY.md.
</output>
