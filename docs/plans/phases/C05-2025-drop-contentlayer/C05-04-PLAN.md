---
phase: C05-2025-drop-contentlayer
plan: 04
type: execute
wave: 4
depends_on: [C05-03]
files_modified:
  - apps/2025/next.config.ts
  - apps/2025/contentlayer.config.ts # XÓA
  - apps/2025/data/blog/ # XÓA
  - apps/2025/data/authors/ # XÓA
  - apps/2025/package.json
  - apps/2025/turbo.json
  - CLAUDE.md
  - pnpm-lock.yaml
autonomous: false
requirements: [REQ-01, REQ-02, REQ-10]
must_haves:
  truths:
    - 'pnpm build --filter=web-2025 chạy XANH TỪ GIT BASH không cần env -u PWD (SC1 — bằng chứng blocker #1 chết)'
    - 'grep -ri contentlayer apps/2025 --include=*.ts* = 0 (SC2)'
    - 'Tập URL /blog/<slug> trước/sau y hệt (SC3, gate M-04)'
  artifacts:
    - 'CLAUDE.md hết ghi chú PowerShell/contentlayer'
  key_links:
    - 'Merge c5-drop-contentlayer → main; 2 deploy Vercel xanh'
---

<objective>
Nhổ xác contentlayer (D-09, D-10), cập nhật CLAUDE.md (D-12), chạy gate toàn phase — đặc biệt là build từ Git Bash — và user nghiệm thu, merge main (D-13).
</objective>

<context>
@docs/plans/phases/C05-2025-drop-contentlayer/C05-CONTEXT.md
@apps/2025/next.config.ts
@apps/2025/package.json
@CLAUDE.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Gỡ config + file + deps contentlayer</name>
  <files>apps/2025/next.config.ts, apps/2025/contentlayer.config.ts, apps/2025/data/blog/, apps/2025/data/authors/, apps/2025/package.json, apps/2025/turbo.json, pnpm-lock.yaml</files>
  <action>Theo D-09: next.config.ts bỏ withContentlayer khỏi plugins reduce (giữ CSP/headers/images nguyên); xóa contentlayer.config.ts; xóa data/blog/ + data/authors/ (đã copy sang packages/content từ C2 — data/main.ts + site-metadata.ts GIỮ, thuộc C6, nằm trong deferred); turbo.json bỏ .contentlayer khỏi inputs/outputs; root package.json bỏ entry allowBuilds/onlyBuiltDependencies contentlayer2 nếu có. pnpm --filter web-2025 remove contentlayer2 next-contentlayer2. Theo D-10: với TỪNG gói trong danh sách (7 rehype-*, 4 remark-*, unist-util-visit, mdast-util-to-string, hast-util-from-html-isomorphic, reading-time, github-slugger, probe-image-size, js-yaml) chạy grep import trong apps/2025/src + scripts trước — 0 kết quả mới remove, còn kết quả thì GIỮ và ghi SUMMARY (không gỡ mù).</action>
  <verify>grep -rn "contentlayer" apps/2025 --include="*.ts" --include="*.tsx" --include="*.json" -l | grep -v node_modules | wc -l = 0; pnpm install thoát 0</verify>
  <done>Xác contentlayer sạch khỏi config/file/deps; gói dọn theo bằng chứng grep.</done>
</task>

<task type="auto">
  <name>Task 2: CLAUDE.md + gate Git Bash</name>
  <files>CLAUDE.md</files>
  <action>Theo D-12: trong CLAUDE.md xóa đoạn "Run dev/build for web-2025 from PowerShell or cmd, NOT Git Bash" + workaround env -u PWD (lý do đã chết); cập nhật mô tả apps/2025 (không còn Contentlayer2, blog từ @portfolio/content). Rồi chạy gate then chốt: MỞ GIT BASH chạy pnpm build --filter=web-2025 — phải xanh không cần env -u PWD (SC1). Chạy tiếp gate M-04: so danh sách URL /blog/<slug> trong sitemap build mới với danh sách đã lưu trước phase — diff = 0 (SC3, D-05).</action>
  <verify>Từ Git Bash: pnpm build --filter=web-2025 thoát 0; diff danh sách slug trước/sau = 0 dòng</verify>
  <done>Bằng chứng blocker #1 chết nằm trong log; URL bất biến được chứng minh.</done>
</task>

<task type="checkpoint:human-verify">
  <name>Task 3: User nghiệm thu :3001 + merge main</name>
  <action>Executor build + start, mời user đi tay :3001 (còn URL /vi-VN vì C6 chưa chạy): /vi-VN/blog (danh sách + grid/list switch + pagination), mở kien-truc-react-fiber (highlight dual theme, KaTeX, TOC, reading time, authors, prev/next), thử bài có layout khác nếu có (PostSimple/PostBanner), /vi-VN/tags + 1 tag, Cmd+K search + click kết quả, feed.xml + 1 tags/<tag>/feed.xml mở trong browser. Lưu ý cho user: trang blog giờ hiện bài THEO LOCALE (hành vi mới có chủ đích D-04) — xác nhận chấp nhận. User OK → merge c5-drop-contentlayer vào main (D-13), push, xác nhận 2 deploy Vercel xanh.</action>
  <verify>User xác nhận OK (sau khi Task 1-2 gate pass)</verify>
  <done>3 Success Criteria phase C5 đạt; main deploy xanh; hành vi per-locale được user chấp thuận.</done>
</task>

</tasks>

<verification>
SC1 = Task 2 (Git Bash build); SC2 = Task 1 grep; SC3 = Task 2 diff sitemap + Task 3 đi tay đủ hạng mục blog/tags/kbar/feed.
</verification>

<success_criteria>
contentlayer2 biến mất hoàn toàn; 2025 render/data/side-effects sống trên 3 package chung; đường sang C6/C7 thông.
</success_criteria>

<output>
Commit (branch, rồi merge): `feat(2025)!: drop contentlayer2 entirely — shared content pipeline live`
Sau khi xong: viết C05-04-SUMMARY.md, tick phase C5 trong ROADMAP, cập nhật STATE.md (gỡ ràng buộc PowerShell, vị trí → C6).
</output>
