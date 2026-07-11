---
phase: C05-2025-drop-contentlayer
plan: 04
subsystem: cleanup-2025
tags: [contentlayer-removal, git-bash, dep-sweep]
provides:
  - contentlayer2 BIẾN MẤT khỏi repo (config + data/blog + data/authors + libs/remark + 21 gói deps + tsconfig paths + turbo/allowBuilds)
  - CLAUDE.md hết ghi chú PowerShell/Git Bash (lý do đã chết)
key-decisions:
  - 'Gỡ 21 gói THEO BẰNG CHỨNG grep: 12 remark/rehype + hast/probe/js-yaml/unist/mdast + shiki + contentlayer2×2 + 3 @types. GIỮ: github-slugger (6 file dùng), reading-time (type trong blog-meta), @types/mdx (mdx-components).'
  - 'libs/remark xóa cả thư mục (0 importer — đã port sang @portfolio/mdx từ C3).'
  - 'Comment-text discipline: mọi comment nhắc tên hệ cũ được viết lại để gate grep=0 đúng nghĩa đen.'
status: complete — PHASE C5 ĐÓNG
completed: 2026-07-11
---

# C05-04 — Summary (đóng phase C5)

## 3 Success Criteria của phase (ROADMAP)

1. ✅ SC1: `pnpm build --filter=web-2025` chạy XANH TỪ GIT BASH không cần env -u PWD (1m43 — nhanh hơn cả bản cũ 2m14 vì bỏ được 1 pass compile). **Blocker #1 của Next 16 chết.**
2. ✅ SC2: grep -ri contentlayer apps/2025 (ts/tsx/json, trừ node_modules/.next/.vercel) = **0**.
3. ✅ SC3: 4/4 URL baseline `/blog/<slug>` nguyên vẹn trong .next output; +2 URL mới (bài 2026 — deviation có chủ đích của content hợp nhất, đã ghi ở C05-02).

## Smoke browser (tự test theo ủy quyền)

- Bài Promise.all: banner /content/blog HIỆN (hết vỡ), code block title+line numbers+highlight, BlogMeta/tags.
- /vi-VN/tags 200 + tag mới /tags/monorepo 200; feed.xml XML hợp lệ 6 item; kbar Ctrl+K search "fiber" ra đúng bài từ search.json mới.
- Server log 0 error; console chỉ còn giscus "not installed" (placeholder env local — có từ trước).
- typecheck root + build web-2026 xanh.
