# design-sync — app 2026 (Portfolio 2026 UI)

Project: `dc0c0939-0f5c-4409-87d4-2a38ca0d3b5e` · bundle `window.Web2026UI`.
Config **riêng**, không đụng bản 2025 (`.design-sync/config.json`).

## Hình dạng nguồn

- **PKG_DIR = `packages/ui`.** `cfg.pkg` = `@portfolio/ui`, `entry` = `packages/ui/src/index.ts`, `globalName` = `Web2026UI`.
- **Không còn `apps/2026/.design-sync.entry.tsx` / `gen-entry-2026.mjs`.** App 2026 (4 effect + ShowcaseCard + `DsTheme2026`) + icons vào qua `extraEntries`:
  - `@portfolio/icons`
  - `../../.design-sync/shims/app-2026.tsx` (viết tay: `Card as ShowcaseCard` bắt buộc, `export *` sẽ đụng Card của UI).
- `cssEntry` = `.ds-css/css2026.css` trong `packages/ui/.ds-css/`. `buildCmd` chỉ `refresh-css-2026.mjs`.
- `guidelinesGlob`: `["../../apps/2026/docs/*.md"]` — glob mặc định tính theo PKG_DIR; không đổi thì mất `design-system.md`.
- `packages/ui/package.json` phải có `"types": "./src/index.ts"`.

## Chạy (khi user gọi `/design-sync`)

```bash
node .design-sync/refresh-css-2026.mjs
node .ds-sync/package-build.mjs --config .design-sync/config.2026.json \
  --node-modules ./apps/2026/node_modules --out ./ds-bundle-2026
node .ds-sync/package-validate.mjs ./ds-bundle-2026
```

`--node-modules` PHẢI trỏ `apps/2026/node_modules`.

## Khác biệt bắt buộc so với 2025 (đừng "sửa lại cho giống")

1. `refresh-css-2026.mjs` đọc `<dist>/static/chunks/*.css` — Next 16 + Turbopack.
2. Ưu tiên `.next-build` rồi mới `.next`.
3. GHÉP TẤT CẢ chunk CSS.
4. Copy `static/media/` → `.ds-css/media/` và viết lại url.
5. Provider `DsTheme2026` phải là export của bundle — thiếu là fail cứng `[PROVIDER_UNEXPORTED]`.

## Phạm vi

- Entry chính: `packages/ui`.
- Allowlist app 2026 trong shim: FelixHeroMark, ListItem, Marquee, AppearTitle, ShowcaseCard, DsTheme2026. CỐ TÌNH loại `three/` và showcase bám lenis/gsap.

## Preview

`.design-sync/previews/` dùng chung. Import `from '@portfolio/ui'` (pkgRx → `window.<globalName>`); icon → `from '@portfolio/icons'`.

## Chưa kiểm chứng trên máy này (không chạy `/design-sync`)

- Bundle IIFE / `[PROVIDER_UNEXPORTED]` / 0-component-nếu-thiếu-`types`.
- FONT_MISSING Panchang và RENDER_BLANK Form như trước.

## Bẫy Base UI

- `DropdownMenuLabel`/`CheckboxItem` BẮT BUỘC trong `<DropdownMenuGroup>`.
- Portal: `cardMode: single`; `ShowcaseCard`: `column`.
- `--out` không được nằm trong `.design-sync/` (`OUT_UNSAFE`).
