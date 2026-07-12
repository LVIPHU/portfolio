# Project State — Nâng cấp C

## Tham chiếu

Roadmap: `docs/plans/ROADMAP.md` (cập nhật 2026-07-11)
**Giá trị lõi:** "Nâng 1 là nâng cho cả 2" — 3 package raw-TS dùng chung, 2 app khóa chung stack.
**NÂNG CẤP C HOÀN THÀNH** ✅ — C0…C12 đóng (13/13). 3 package raw-TS dùng chung (content/ui/mdx), 2 app cùng stack Next 16.2 / React 19.2 (Turbopack + React Compiler) / Tailwind 4.3 / Base UI / GSAP / next-intl; gate `pnpm ci-check` + GitHub Actions; Sandpack playground; docs khớp.

## Vị trí hiện tại

Phase: C12/13 đóng — TOÀN BỘ ROADMAP XONG.
Status: C12 merge (`bc9c07a`) + push — web-2025 & web-2026 production READY. Cả C0–C12 đã lên production.
Hoạt động cuối: 2026-07-12 — C12 ci-check+crawler+GitHub Actions, dọn xác 10 phase, viết lại CLAUDE.md. design-sync re-sync = user chạy /design-sync (skill user-only).

Progress: [█████████████] 13/13 phase — HOÀN THÀNH

## Bối cảnh tích lũy

### Quyết định toàn cục (user đã khóa)

- Base UI hẳn; shadcn cài **từng component qua CLI** (`pnpm dlx shadcn@latest add <name>`).
- Content thủ công (gray-matter+Zod+next-mdx-remote/rsc); zod 4; pipeline MDX = 2 mảng export từ @portfolio/mdx.
- i18n đích next-intl vi(mặc định)+en; motion→GSAP 3.15; Next pin 16.2.10, React 19.2.7.
- Mỗi PLAN = 1 atomic commit; **user ủy quyền Claude tự test bằng browser** (từ C3).
- Prose tiếng Việt, commit tiếng Anh.

### Bug bắt được khi tự test live (đã vá)

- `getAllPosts` không fallback locale trong danh sách (chỉ getPost có) → danh sách 4/6 bài; vá per-slug merge (`40a7453`).
- Prose underline kẻ vệt "_" dưới `<a>` autolink chứa icon trong suốt → vá `.content-header > a:first-child` trong styles.css package.

### Nợ/quan sát tồn đọng

- 11 chuỗi `TODO dịch` trong data 2025 (nợ dịch có từ trước — catalog .po chưa từng chứa data/main.ts).
- Ảnh chết từ trước: ocean.{jpg,jpeg} + sparrowhawk-avatar.jpg (404 cả trên production cũ) — C12 xử.
- Console error "script tag while rendering" MỌI trang 2026 (script init next-themes, dev-only React 19.2) — có từ trước C3, theo dõi khi C10 bật compiler.
- Callout label mặc định tiếng Việt trên bài en (override được bằng prop title) — backlog i18n label.
- KaTeX đã nối pipeline + CSS nhưng chưa bài nào có công thức — exercise ở C11.
- `apps/2025/data/` ĐÃ XÓA HẲN; data tĩnh qua '@portfolio/content/data2025' (subpath KHÔNG fs — client-safe).
- pnpm `autoInstallPeers: false` — peer khai tường minh; facade 2 tầng content-core/content (client-safe vs fs) + barrel NAMED exports (không export * qua 'use client') là quy tắc từ nay. Đồ tạm C5/C6 đã gỡ hết ở C7.
- `.claude/launch.json` đã tạo (web-2026:3000, web-2025:3001) — dev server chạy qua preview tool.

## Session Continuity

Phiên cuối: 2026-07-12
Dừng tại: NÂNG CẤP C ĐÓNG SỔ (C0–C12). C12: ci-check (prettier+typecheck+build+dead-links) + crawler Node thuần + GitHub Actions; dọn xác (6 hook→@portfolio/ui, math.ts, back-to-posts dup, grid.svg, .ds-css); CLAUDE.md viết lại theo kiến trúc 3 package; PLAN-apps-2025 SUPERSEDED. Đã xóa .turbo 26GB (D: full).
VIỆC CÒN CỦA USER (non-blocking):

1. Chạy `/design-sync` re-sync — skill user-invocation-only, model không gọi được; auth OK. Skill sẽ reconcile componentSrcMap (22 atom shadcn đã dời @portfolio/ui + animated-content + back-to-posts đã xóa) + fix preview asChild→render + build + upload.
2. Visual acceptance mắt: 2 app × 2 locale × 2 theme; các mục desktop-only pane không thấy: navbar/contact-modal desktop (C6/7/8), dock magnify (C9), sandpack chơi thử + dark editor (C11).
   Backlog kỹ thuật: 16 warning react-hooks (refactor); gỡ useMemo/useCallback thủ công; đo bundle before/after GSAP; NavigationLink→i18n Link; pick messages 2025; ds-bundle dọn.
