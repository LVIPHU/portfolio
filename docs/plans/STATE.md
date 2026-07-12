# Project State — Nâng cấp C

## Tham chiếu

Roadmap: `docs/plans/ROADMAP.md` (cập nhật 2026-07-11)
**Giá trị lõi:** "Nâng 1 là nâng cho cả 2" — 3 package raw-TS dùng chung, 2 app khóa chung stack.
**Đang tập trung:** C10 ĐÓNG (1/1) → C11 (Sandpack playground trong bài viết, pin 2.20, lazy 2 tầng)

## Vị trí hiện tại

Phase: C10/13 đóng (C0…C10 ✅)
Status: C10 merge + push (user duyệt OK) — deploy Vercel đang build. C9 (`d291646`) + C8 hotfix (`9a006d0`) đã READY production.
Hoạt động cuối: 2026-07-12 — C10 bật React Compiler 2 app + eslint react-hooks flat root; tự test kbar OK → merge

Progress: [███████████░░] 11/13 phase

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
Dừng tại: PHASE C10 ĐÓNG — reactCompiler:true (top-level Next 16) cả 2 app + babel-plugin-react-compiler; eslint.config.mjs flat root (react-hooks v7 configs.flat['recommended-latest'] + @typescript-eslint/parser chỉ parse). kbar OK không cần opt-out. 3 rule v7 mới (refs/set-state-in-effect/immutability) hạ 'warn' (16 nợ) — rules-of-hooks/exhaustive-deps/compiler giữ error. Dọn eslint config + disable-directive chết thời C7. Build chậm hơn do babel (2026 28s, 2025 44s).
Nợ C11: Sandpack pin 2.20, lazy 2 tầng, trong MDX bài viết. Nợ C12: 16 warning react-hooks refactor; gỡ useMemo/useCallback thủ công; fade-content.tsx; design-sync re-sync; ds-bundle/.ds-css dọn; đo bundle GSAP.
Kế tiếp: `phases/C11-sandpack/` trên branch c11-sandpack
Nợ desktop-only chưa mắt trong pane (tích lũy): navbar/contact-modal desktop (C6/7/8), desktop dock magnify (C9) — user duyệt trên desktop/production.
