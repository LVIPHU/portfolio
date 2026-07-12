---
phase: C12-ci-cleanup
plan: 02
subsystem: cleanup-docs
tags: [dead-code, hooks-dedup, claude-md]
provides:
  - Dọn xác code 10 phase (grep-driven, 0 ref trước khi xóa); dedup 6 hook về @portfolio/ui/hooks
  - CLAUDE.md viết lại theo kiến trúc 3 package; PLAN-apps-2025 đóng dấu SUPERSEDED; ROADMAP hash đầy
key-decisions:
  - 'Hook dedup (D-05): 6 hook (use-drag-rotate/event-listener/isomorphic-layout-effect/media-query/unmount/window-size) GIỐNG HỆT bản @portfolio/ui/hooks (chỉ khác thêm 'use client') → hooks/index.ts re-export `export * from @portfolio/ui/hooks`, xóa 6 file app. use-blog-stats GIỮ (đặc thù DB app). Kéo theo xóa utils/math.ts (chỉ use-drag-rotate cũ dùng calculateAngle; bản ui tự có).'
  - 'SỬA giả định nợ: fade-content.tsx KHÔNG mồ côi — vẫn dùng ở video-card + home → GIỮ (D-07 còn nghi thì giữ; đây là dùng thật).'
  - 'Xóa: atoms/back-to-posts.tsx (dup 0-ref; molecules/back-to-posts mới là bản export/dùng), public .../backgrounds/grid.svg (đã inline C7, chỉ còn trong comment), .ds-css/ (untracked, artifact design-sync).'
  - 'knip (D-06) tham khảo: 72 "unused" toàn là .design-sync/ (tooling + 58 preview) — xử ở plan 03, KHÔNG phải dead code app. knip lỗi load drizzle.config (env) nên phân tích 1 phần; không thêm xóa nào.'
  - 'CLAUDE.md (D-08): mục "What this is" → cả 2 app cùng stack khóa + 3 package chung; thêm section shared packages (ui/mdx/content) với gotcha (cn subpath react-free, relative import sau shadcn add, named barrel không export* qua use client, sandpack transpilePackages); Commands thêm lint/check-links/ci-check; bỏ ghi chú contentlayer/PowerShell/git-init chết; Active plan → docs/plans/. PLAN-apps-2025 header SUPERSEDED.'
status: complete
completed: 2026-07-12
---

# C12-02 — Summary

## Dọn xác (grep 0-ref)

| Xóa                                                                                                   | Lý do                                                     |
| ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| 6 hook app (drag-rotate, event-listener, isomorphic-layout-effect, media-query, unmount, window-size) | giống hệt @portfolio/ui/hooks (+'use client') → re-export |
| utils/math.ts                                                                                         | calculateAngle chỉ hook cũ dùng; bản ui tự có             |
| atoms/back-to-posts.tsx                                                                               | dup 0-ref (molecules/back-to-posts là bản dùng)           |
| public/static/images/backgrounds/grid.svg                                                             | inline ở C7, chỉ còn trong comment                        |
| .ds-css/ (untracked)                                                                                  | artifact design-sync                                      |

GIỮ: fade-content.tsx (dùng thật ở video-card+home — sửa giả định nợ cũ), use-blog-stats (DB app).

## Docs

- CLAUDE.md viết lại (3-package, gotcha, lệnh mới, bỏ note chết).
- PLAN-apps-2025.md: header ⚠️ SUPERSEDED.
- ROADMAP Progress: hash đủ (chỉ C12 chưa đóng).

## Gate

- `pnpm typecheck` 5/5 xanh (4 cached); cả 2 app build xanh sau dọn.
- knip tham khảo — không phát sinh xóa app.

## Nợ chuyển plan 03

- design-sync re-sync (D-10): componentSrcMap .design-sync/config.json (atoms còn lại + @portfolio/ui), rebuild bundle + upload — cần design-sync tooling/connector.
- Checklist đi tay cuối (M-03) + user nghiệm thu toàn bộ 2 app × 2 locale × 2 theme.
- Hỏi user: có thêm .github/workflows/ci.yml không (D-03).
