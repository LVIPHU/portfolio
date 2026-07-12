# Project State — Nâng cấp C

## Tham chiếu

Roadmap: `docs/plans/ROADMAP.md` (cập nhật 2026-07-11)
**Giá trị lõi:** "Nâng 1 là nâng cho cả 2" — 3 package raw-TS dùng chung, 2 app khóa chung stack.
**Đang tập trung:** C8 ĐÓNG (4/4) → C9 (motion → GSAP 3.15 + @gsap/react, primitives packages/ui/src/motion)

## Vị trí hiện tại

Phase: C8/13 đóng (C0…C8 ✅)
Status: C8 merge + push (user duyệt mắt OK) — deploy Vercel đang build; C7 deploys (`5718356`, `9ab6912`) đã READY.
Hoạt động cuối: 2026-07-12 — C8 thi công + tự test browser (contact modal/dropdown/form/dark mode OK), user duyệt mắt → merge

Progress: [█████████░░░░] 9/13 phase

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
Dừng tại: PHASE C8 ĐÓNG — packages/ui đủ 21 component Base UI (mỗi cái 1 lệnh shadcn CLI; form+drawer port tay); 2025 tiêu thụ qua shim atoms/index.ts (named exports), gỡ 18 gói (14 @radix-ui + vaul + cva/clsx/tailwind-merge), 0 asChild, 0 @radix-ui. Bug đã trị: shadcn sinh `@/` import → đổi tương đối (packages/ui self-contained, làm SAU mỗi add); base-nova form rỗng → port tay RHF; link-preview Radix→PreviewCard. cn 1 nguồn từ @portfolio/ui.
Nợ C9: link-preview/timeline/animated-content còn framer-motion; drawer easing tự chế duyệt kỹ khi menu mobile. Nợ C12: design-sync re-sync (atoms shadcn rời app).
Kế tiếp: `phases/C09-gsap-migration/C09-01-PLAN.md` trên branch c9-gsap
