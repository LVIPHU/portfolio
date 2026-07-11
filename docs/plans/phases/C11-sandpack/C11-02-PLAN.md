---
phase: C11-sandpack
plan: 02
type: execute
wave: 2
depends_on: [C11-01]
files_modified:
  - packages/content/blog/playground-demo.vi.mdx
  - packages/content/blog/playground-demo.en.mdx
  - apps/2025/next.config.ts # CSP frame-src codesandbox
autonomous: false
requirements: [REQ-08, REQ-02]
must_haves:
  truths:
    - 'Bài demo trên :3000 và :3001: sửa code → preview cập nhật, dark mode đổi theme editor (SC1)'
    - 'Network tab: trang không dùng Sandpack không tải chunk sandpack; bài demo chỉ tải khi cuộn gần (SC2, D-09)'
  artifacts:
    - 'playground-demo.{vi,en}.mdx trong packages/content/blog'
  key_links:
    - 'CSP 2025 cho phép iframe codesandbox mà không nới lỏng gì khác (D-07)'
---

<objective>
Bài demo playground (D-08) + mở CSP 2025 (D-07) + gate lazy bằng Network tab (D-09) + user nghiệm thu trên CẢ 2 app.
</objective>

<context>
@docs/plans/phases/C11-sandpack/C11-CONTEXT.md
@apps/2025/next.config.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Bài demo song ngữ + CSP</name>
  <files>packages/content/blog/playground-demo.vi.mdx, packages/content/blog/playground-demo.en.mdx, apps/2025/next.config.ts</files>
  <action>Viết bài demo theo D-08: frontmatter đúng schema C2 (title/date/summary/tags — không tag vietnamese/english); nội dung ngắn giới thiệu playground, 1 <Sandpack> React counter theo cú pháp M-03 (App.js active + styles.css hidden) + 1 code block thường ngay dưới để đối chứng highlight pipeline C3. Bản vi + en (văn bản Claude tự quyết, tự nhiên như site). CSP 2025 theo D-07: trong chuỗi ContentSecurityPolicy thêm *.codesandbox.io vào frame-src (hiện chỉ giscus.app; connect-src đã là * — kiểm hiện trạng trước, chỉ sửa đúng directive thiếu, ghi rõ trong commit message).</action>
  <verify>pnpm build --filter=web-2026 && pnpm build --filter=web-2025 thoát 0 (bài mới qua Zod schema); grep -c "codesandbox" apps/2025/next.config.ts ≥ 1</verify>
  <done>2 bài demo hợp lệ schema; CSP mở đúng 1 khe cần thiết.</done>
</task>

<task type="checkpoint:human-verify">
  <name>Task 2: Gate lazy Network tab + user nghiệm thu 2 app</name>
  <action>Executor kiểm D-09 bằng devtools Network: (1) mở :3000/blog và 1 bài KHÔNG dùng Sandpack — filter 'sandpack' 0 request; (2) mở bài playground-demo — chunk sandpack chỉ xuất hiện khi CUỘN GẦN block (rootMargin 1400px), không phải lúc load trang nếu block dưới xa; (3) lặp trên :3001 — iframe codesandbox load được (CSP D-07 hoạt động, không lỗi CSP trong console). Mời user chơi playground trên cả 2 app: sửa code counter → preview cập nhật nóng; toggle dark mode → editor đổi theme theo site (D-05); bài thường vẫn render như cũ. User OK → commit, push, 2 deploy Vercel xanh, thử playground trên production (sandbox bundler cần mạng thật).</action>
  <verify>User xác nhận OK (sau khi Network gate + CSP console sạch trên cả 2 app)</verify>
  <done>2 Success Criteria phase C11 đạt trên local + production.</done>
</task>

</tasks>

<verification>
SC1 = Task 2 user; SC2 = Task 2 Network. Regression: 1 bài không Sandpack render y cũ (đã gate ở C11-01, lặp nhanh).
</verification>

<success_criteria>
Playground sống trên cả 2 site với chi phí đúng chỗ dùng; bài demo là fixture lâu dài cho pipeline MDX.
</success_criteria>

<output>
Commit: `feat(content): sandpack playground demo post + csp allowance for codesandbox iframe`
Sau khi xong: viết C11-02-SUMMARY.md, tick phase C11, cập nhật STATE.md (vị trí → C12).
</output>
