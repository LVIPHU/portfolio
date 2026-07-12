---
phase: C12-ci-cleanup
plan: 03
subsystem: design-sync-closeout
tags: [design-sync, ci-github-actions, closeout]
provides:
  - .github/workflows/ci.yml (pnpm ci-check trên PR + push main) — user chọn thêm
  - Nâng cấp C đóng sổ (C0–C12); 2 deploy production READY trên stack mới
  - design-sync re-sync = việc user chạy /design-sync (skill user-invocation-only)
key-decisions:
  - 'GitHub Actions (D-03, user chọn có): 1 job Node 22 + pnpm cache gọi `pnpm ci-check`; env placeholder cho t3-env của 2025 (NODE_ENV/NEXT_PUBLIC_*/DATABASE_URL). Vercel vẫn là build/deploy chính; CI chỉ gác PR.'
  - 'BLOCKER design-sync (D-10): auth design OK (list_projects thấy "Portfolio 2025 UI" d5b3d749), NHƯNG skill /design-sync là USER-INVOCATION-ONLY — harness chặn model gọi. Tool DesignSync đơn lẻ không tái tạo được pipeline build-bundle/preview/render-validate của skill. KHÔNG hand-hack config.json (rủi ro làm hỏng lần chạy /design-sync của user). → design-sync re-sync là VIỆC USER: chạy /design-sync, skill sẽ reconcile componentSrcMap (22 atom shadcn đã dời @portfolio/ui + animated-content + back-to-posts đã xóa). Non-blocking đúng như D-10.'
  - 'C12 merge tách: plans 01-02 + ci.yml đã merge (bc9c07a) + push; design-sync là follow-up user; final visual acceptance (M-03, 2 app × 2 locale × 2 theme) là mắt user trên desktop/production.'
status: complete — PHASE C12 ĐÓNG (design-sync + visual acceptance = user follow-up)
completed: 2026-07-12
---

# C12-03 — Summary (đóng sổ Nâng cấp C)

## 3 Success Criteria phase (ROADMAP)

1. ✅ SC1 (C12-01): `pnpm ci-check` xanh + crawler bắt link chết (negative test).
2. ✅ SC2 (C12-02): dọn xác grep-driven + CLAUDE.md khớp kiến trúc 3 package.
3. ⏳ SC3: user đi checklist M-03 mắt + design-sync re-sync (cả hai là việc user — xem blocker).

## GitHub Actions

`.github/workflows/ci.yml` — user chọn thêm; chạy `pnpm ci-check` (prettier+typecheck+build+dead-links) trên PR/push main.

## design-sync (BLOCKER kỹ thuật, non-blocking cho dự án)

- Auth design OK (2 project thấy được). Nhưng /design-sync là skill USER-INVOCATION-ONLY → model không chạy được pipeline đầy đủ. DesignSync tool đơn lẻ chỉ upload, không build bundle/preview/validate.
- KHÔNG hand-edit config.json (tránh làm hỏng lần chạy của user). **Việc user:** chạy `/design-sync` — skill tự cập nhật componentSrcMap (bỏ 22 atom shadcn đã dời sang @portfolio/ui + animated-content + back-to-posts), fix preview asChild→render, build + upload.

## Trạng thái deploy

- web-2025 production READY (`bc9c07a`, C12). web-2026 production READY (C10+C11; C12 không đụng code 2026).
- Toàn bộ C0–C12 đã lên production suốt hành trình.

## Đóng sổ

Nâng cấp C hoàn thành: 3 package raw-TS dùng chung (content/ui/mdx), 2 app cùng stack Next 16.2 / React 19.2 (Turbopack + React Compiler) / Tailwind 4.3 / Base UI / GSAP / next-intl, gate 1 lệnh `pnpm ci-check` + GitHub Actions, Sandpack playground, docs khớp hiện thực.

## Nợ còn (user/backlog)

- Chạy `/design-sync` re-sync (user).
- Visual acceptance mắt user: 2 app × 2 locale × 2 theme; các mục desktop-only chưa mắt được trong pane (navbar/contact-modal desktop, dock magnify, sandpack chơi thử + dark editor).
- 16 warning react-hooks (refactor); gỡ useMemo/useCallback thủ công; đo bundle GSAP; NavigationLink→i18n Link; pick messages 2025.
