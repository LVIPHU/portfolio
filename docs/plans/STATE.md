# Project State — Nâng cấp C

## Tham chiếu

Roadmap: `docs/plans/ROADMAP.md` (cập nhật 2026-07-11)
**Giá trị lõi:** "Nâng 1 là nâng cho cả 2" — 3 package raw-TS dùng chung, 2 app khóa chung stack.
**Đang tập trung:** C9 ĐÓNG (4/4) → C10 (React Compiler cả 2 app + eslint react-hooks flat config)

## Vị trí hiện tại

Phase: C9/13 đóng (C0…C9 ✅)
Status: C9 merge + push (user duyệt mắt OK) — deploy Vercel đang build. NHỚ: C8 web-2025 deploy từng ERROR (cn kéo react vào tsx post-build) đã vá bằng subpath @portfolio/ui/utils (`9a006d0`).
Hoạt động cuối: 2026-07-12 — C9 thi công + tự test browser (beam/parallax/hover/mobile-dock/leak-check OK), user duyệt mắt → merge

Progress: [██████████░░░] 10/13 phase

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
Dừng tại: PHASE C9 ĐÓNG — 9/9 file framer→GSAP/CSS; gỡ framer-motion+motion+@emotion; 5 primitive trong packages/ui/src/motion (Reveal, useScrollProgress, ParallaxColumns, HoverHighlight, useMagnify). Khuôn useGSAP{scope} tự cleanup (leak-check 10-nav sạch). Số magnify giữ đúng bản cũ. gsap+@gsap/react là dep trực tiếp cả packages/ui LẪN web-2025 (link-preview/floating-dock dùng trực tiếp). CSS-first: theme-switch + grid/list fade-in-up.
Nợ C10: bật reactCompiler cả 2 app (theo dõi console error "script tag while rendering" của 2026). Nợ C12: fade-content.tsx mồ côi xóa; design-sync re-sync; đo bundle before/after GSAP.
Kế tiếp: `phases/C10-react-compiler/C10-01-PLAN.md` trên branch c10-react-compiler
Nợ desktop-only chưa mắt được trong pane (tích lũy): navbar/contact-modal desktop (C6/7/8), desktop dock magnify (C9) — user duyệt trên desktop thật/production.
