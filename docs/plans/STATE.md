# Project State — Nâng cấp C

## Tham chiếu

Roadmap: `docs/plans/ROADMAP.md` (cập nhật 2026-07-11)
**Giá trị lõi:** "Nâng 1 là nâng cho cả 2" — 3 package raw-TS dùng chung, 2 app khóa chung stack.
**Đang tập trung:** C11 ĐÓNG (2/2) → C12 (CI ci-check 1 lệnh + dead-link crawler + dọn xác code + design-sync re-sync + docs) — PHASE CUỐI

## Vị trí hiện tại

Phase: C11/13 đóng (C0…C11 ✅)
Status: C11 merge + push (user duyệt OK) — deploy Vercel đang build. C10 (`5783d36`) đã READY production.
Hoạt động cuối: 2026-07-12 — C11 Sandpack playground trong MDX (cả 2 app); trị bug Turbopack (sandpack-react cần transpilePackages); tự test render + code-split → merge

Progress: [████████████░] 12/13 phase

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
Dừng tại: PHASE C11 ĐÓNG — <Sandpack> trong @portfolio/mdx (remark trích fence→files prop ở mdast trước rehype-pretty-code; server shim → next/dynamic ssr:false → SandpackProvider; theme CSS var). Bài demo playground-demo.{vi,en}. CSP 2025 frame-src += codesandbox/csb. BUG TURBOPACK TRỊ: sandpack-react ESM thô không eval client → dynamic promise treo → thêm @codesandbox/sandpack-react vào transpilePackages CẢ 2 app (giữ next/dynamic để code-split, import tĩnh làm mọi bài kéo bundle nặng). next+@types/mdast vào mdx devDep. pnpm-workspace es5-ext=false.
Nợ C12 (phase cuối): ci-check 1 lệnh + dead-link crawler; dọn 16 warning react-hooks + useMemo/useCallback thủ công; xóa fade-content.tsx + back-to-posts dup; design-sync re-sync (atoms shadcn rời app); ds-bundle/.ds-css; đo bundle before/after GSAP; NavigationLink→i18n Link; cập nhật CLAUDE.md/README.
Kế tiếp: `phases/C12-*/` trên branch c12-ci-cleanup
Nợ desktop-only chưa mắt trong pane (tích lũy): navbar/contact-modal desktop (C6/7/8), desktop dock magnify (C9), sandpack chơi thử + dark-mode editor (C11) — user duyệt trên desktop/production.
