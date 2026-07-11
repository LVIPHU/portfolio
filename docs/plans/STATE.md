# Project State — Nâng cấp C

## Tham chiếu

Roadmap: `docs/plans/ROADMAP.md` (cập nhật 2026-07-11)
**Giá trị lõi:** "Nâng 1 là nâng cho cả 2" — 3 package raw-TS dùng chung, 2 app khóa chung stack.
**Đang tập trung:** C5 ĐÓNG (4/4) → kế tiếp C6 (Lingui → next-intl, blocker #2 cuối cùng của Next 16)

## Vị trí hiện tại

Phase: C5/13 đóng (C0…C5 ✅)
Status: C5 merge vào main (`c957184`) + push — chờ xác nhận 2 deploy Vercel READY.
Hoạt động cuối: 2026-07-11 — C3 thi công + tự test browser (user ủy quyền), bắt & vá 2 bug khi test live

Progress: [██████░░░░░░░] 6/13 phase

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
- HẾT ràng buộc PowerShell (contentlayer chết); `apps/2025/data/` chỉ còn main.ts + site-metadata.ts (xóa ở C6).
- MỚI (C5): pnpm `autoInstallPeers: false` — peer phải khai tường minh (shiki đã khai); facade 2 tầng content-core/content (client-safe vs fs) phải giữ từ nay; `transpilePackages: next-mdx-remote` + react pin 19.0.0 + next-mdx-remote v5 là tạm, gỡ ở C7.
- `.claude/launch.json` đã tạo (web-2026:3000, web-2025:3001) — dev server chạy qua preview tool.

## Session Continuity

Phiên cuối: 2026-07-11
Dừng tại: PHASE C5 ĐÓNG — contentlayer2 biến mất, 21 gói gỡ, build Git Bash xanh, smoke browser đủ (blog/tags/kbar/feed/banner)
Kế tiếp: `phases/C05-2025-drop-contentlayer/C05-01-PLAN.md` trên branch riêng
