# design-sync — app 2026 (Portfolio 2026 UI)

Project: `dc0c0939-0f5c-4409-87d4-2a38ca0d3b5e` · bundle `window.Web2026UI` · 26 component.
Config **riêng**, không đụng bản 2025 (`.design-sync/config.json` → Portfolio 2025 UI).

## Chạy

```bash
node .design-sync/gen-entry-2026.mjs && node .design-sync/refresh-css-2026.mjs
node .ds-sync/package-build.mjs --config .design-sync/config.2026.json \
  --node-modules ./apps/2026/node_modules --out ./ds-bundle-2026
node .ds-sync/package-validate.mjs ./ds-bundle-2026
```

`--node-modules` PHẢI trỏ `apps/2026/node_modules`: pnpm cô lập nên repo root không có
`react`, converter sẽ báo nhầm là "hoisted monorepo".

## Khác biệt bắt buộc so với 2025 (đừng "sửa lại cho giống")

1. `refresh-css-2026.mjs` đọc `<dist>/static/chunks/*.css` — Next 16 + Turbopack KHÔNG còn
   dùng `static/css`. Bản 2025 hiện hỏng vì lý do này.
2. Ưu tiên `.next-build` rồi mới `.next`: build local ghi ra `.next-build` (distDir tách
   dev/build trong `next.config.ts`).
3. GHÉP TẤT CẢ chunk CSS, không lấy file lớn nhất — 2026 tách CSS theo route group; lấy
   một file là mất `.showcase-root` + CSS module của FELIX/marquee/list-item.
4. Copy `static/media/` → `.ds-css/media/` và viết lại `url(../media/` → `url(./media/`,
   nếu không Anton/Roboto dangling và rơi về font hệ thống.
5. Provider `DsTheme2026` ép `.dark` + `.showcase-root`: 2026 mặc định dark, preview không
   có `<html class="dark">` nên không bọc là card ra tông sáng, sai hẳn thiết kế.

## Phạm vi

- Quét tự động: `packages/ui` (21 component).
- Allowlist tường minh cho app 2026: FelixHeroMark, ShowcaseCard, ListItem, Marquee,
  AppearTitle. CỐ TÌNH loại `three/` (WebGL + leva + stats.js) và các showcase bám
  `useLenis`/gsap (Intro, ZoomSection, HorizontalSlides, Cursor…) — chúng cần rAF/scroll
  thật nên trong preview tĩnh sẽ chết bundle hoặc ra card trống.
- `Card` trùng tên giữa `packages/ui` và showcase → bản showcase đổi thành `ShowcaseCard`.

## Preview dùng chung với 2025 — cẩn thận

`.design-sync/previews/` bị hardcode, KHÔNG cấu hình được, nên hai app dùng chung. Vì vậy:

- Preview của component có mặt ở CẢ hai app (DropdownMenu, Form) phải `import ... from
'web-2025'` — tsconfig 2026 map `web-2025` → entry 2026, còn tsconfig 2025 không biết
  `web-2026`. Import `web-2026` sẽ làm hỏng build của 2025.
- Preview của component chỉ có ở 2026 thì 2025 bỏ qua (không nằm trong componentSrcMap).

## Warning lành tính (đã kiểm, không phải lỗi mới)

- `FONT_MISSING: Panchang` — nạp qua `<link>` Fontshare trong layout nên không bao giờ nằm
  trong CSS bundle. Không sửa được bằng extraFonts; chấp nhận thay bằng font hệ thống.
- `RENDER_BLANK: Form` — đã có `previews/Form.tsx` với `useForm` thật, `firstErr: null`
  (không ném lỗi) nhưng Controller vẫn ra rỗng, ảnh chụp chỉ có dải nền provider 48px.
  Nghi do React-instance khi bundle react-hook-form. Non-blocking; cần làm lại preview nếu
  muốn card này có nội dung.

## Guidelines cho Claude Design

`apps/2026/docs/design-system.md` được glob mặc định của converter (`docs/*.md` trong
PKG_DIR) tự đưa vào `guidelines/` của bundle → Claude Design đọc khi generate. Đây là
tài liệu token chuẩn (palette, theme bộ ba, typography, spacer, layout, easing) — sửa
design system thì cập nhật file này TRƯỚC rồi mới rebuild bundle.

## Bẫy đã gặp và đã sửa

- Base UI (khác Radix của 2025 cũ): `DropdownMenuLabel`/`CheckboxItem` BẮT BUỘC nằm trong
  `<DropdownMenuGroup>`, không thì `MenuGroupContext is missing` → card rỗng.
- Component portal (Dialog, Drawer, HoverCard, Popover, Select, Tooltip, DropdownMenu) đặt
  `cardMode: single`; `ShowcaseCard` đặt `cardMode: column`.
- `--out` không được nằm trong `.design-sync/` (converter từ chối: `OUT_UNSAFE`).
