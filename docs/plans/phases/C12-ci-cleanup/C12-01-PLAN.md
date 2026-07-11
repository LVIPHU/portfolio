---
phase: C12-ci-cleanup
plan: 01
type: execute
wave: 1
depends_on: [C11-02]
files_modified:
  - scripts/check-dead-links.mjs # MỚI, root
  - package.json # scripts check-links + ci-check
autonomous: true
requirements: [REQ-09]
must_haves:
  truths:
    - 'pnpm ci-check chạy hết chuỗi prettier→typecheck→build→dead-links và exit 0 (SC1 nửa đầu)'
    - 'Link cố tình gãy bị crawler bắt, exit 1 (SC1 nửa sau, D-04)'
  artifacts:
    - 'scripts/check-dead-links.mjs'
  key_links:
    - 'Crawler chạy trên HTML build thật của cả 2 app — bao cả link sinh từ MDX/frontmatter'
---

<objective>
Dựng gate 1 lệnh: dead-link crawler kiểu react.dev đơn giản hóa (D-01, D-02) + script `ci-check` (D-03) + test negative (D-04).
</objective>

<context>
@docs/plans/phases/C12-ci-cleanup/C12-CONTEXT.md
@package.json
</context>

<tasks>

<task type="auto">
  <name>Task 1: check-dead-links.mjs</name>
  <files>scripts/check-dead-links.mjs</files>
  <action>Viết crawler theo khung M-02 (D-01): nhận BASE_URLS qua args hoặc default http://localhost:3000 + http://localhost:3001; BFS từ / và /en mỗi app; fetch HTML → regex href nội bộ → theo dấu chưa thăm; link ngoài chỉ kiểm định dạng URL, KHÔNG fetch; gom id= mỗi trang để kiểm anchor #fragment trỏ trang đích (D-02 — implement dạng lỗi thường, có cờ --anchors=warn hạ cấp nếu ồn); output bảng "trang nguồn → link chết", exit 1 nếu có link chết. Concurrency/timeout Claude tự quyết (ghi đầu file). Node thuần, 0 dependency mới.</action>
  <verify>node scripts/check-dead-links.mjs --help hoặc chạy thật với 2 app đang start — exit 0 khi site sạch</verify>
  <done>Crawler chạy được độc lập, deterministic trên HTML SSG.</done>
</task>

<task type="auto">
  <name>Task 2: ci-check + test negative</name>
  <files>package.json</files>
  <action>Thêm 2 script theo mẫu M-01 (D-03) vào package.json root. Chạy trọn pnpm ci-check từ trạng thái cache sạch 1 lần (xóa .turbo cache) — xanh. Rồi test negative D-04: sửa tạm 1 link trong 1 bài MDX packages/content/blog thành /duong-dan-khong-ton-tai → chạy check-links (2 app đang start) → PHẢI exit 1 và bảng chỉ đúng trang nguồn → HOÀN LẠI file → chạy lại xanh. Ghi cả 2 kết quả vào SUMMARY. GitHub Actions ci.yml: CHƯA thêm ở plan này — hỏi user ở checkpoint plan 03 (Claude tự quyết trong CONTEXT).</action>
  <verify>pnpm ci-check thoát 0; git status --short packages/content/blog sạch sau test negative</verify>
  <done>Gate 1 lệnh sống; bằng chứng crawler bắt link chết nằm trong SUMMARY.</done>
</task>

</tasks>

<verification>
`pnpm ci-check` xanh từ cache sạch (SC1); test negative pass-fail-pass đúng chu trình.
</verification>

<success_criteria>
Người và CI (tương lai) chạy cùng một lệnh — không lệch chuẩn chất lượng.
</success_criteria>

<output>
Commit: `chore: ci-check pipeline + dead-link crawler`
Sau khi xong: viết C12-01-SUMMARY.md.
</output>
