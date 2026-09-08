# design-sync NOTES — web-2025 (apps/2025)

## Hình dạng nguồn

- **PKG_DIR = `packages/ui`.** `cfg.pkg` = `@portfolio/ui`, `entry` = `packages/ui/src/index.ts` (field `entry` giữ để PKG_DIR là thư mục thật, không phải symlink `node_modules/@portfolio/ui`). `globalName` vẫn `Web2025UI`.
- **Không còn file entry sinh ra** trong `apps/`. Converter không synth-from-src. App 2025 (atoms/molecules) + `@portfolio/icons` vào bundle qua `extraEntries`:
  - `@portfolio/icons`
  - `../../.design-sync/shims/app-2025.tsx` (viết tay, commit — sửa khi thêm atom/molecule)
- `cssEntry` = `.ds-css/css2025.css` resolve trong `packages/ui/.ds-css/` (bị chặn cứng trong PKG_DIR). `refresh-css.mjs` ghi đúng chỗ đó. `buildCmd` chỉ còn refresh-css — **không** gen-entry / gen-icons-safe.
- Icon `React` đổi thành `ReactIcon` trong `@portfolio/icons` nên không còn script `gen-icons-safe.mjs`.
- `packages/ui/package.json` có `"types": "./src/index.ts"` — thiếu field này thì ts-morph 0 component.

## Shims (tsconfig.dsync.json paths → .design-sync/shims/)

- `next/image`→img thuần, `next/link`→a, `next/navigation`→hooks no-op, `@env`→object tĩnh, Lingui macro passthrough, `@data/site-metadata`→bản tĩnh.
- `@/components/atoms` trỏ barrel thật `apps/2025/src/components/atoms/index.ts` (hết `.cache/atoms-barrel-safe.ts`). `utils-barrel.ts` không còn `icons-safe`.
- **Windows/esbuild**: import barrel không đuôi qua tsconfig paths phải khai exact-path tới `index.ts`.

## CSS & fonts

- `cssEntry` copy từ `.next/static/css/<file lớn nhất>` bằng `refresh-css.mjs`. **Phải `pnpm build --filter=web-2025` trước nếu .next thiếu**.
- Token/font: như trước (next/font không phát @font-face vào css này).

## Converter env

- `.ds-sync` cài: esbuild, ts-morph, @types/react, playwright@1.61.0, **typescript@5.9.3**.
- `dtsPropsFor` sinh bởi `.design-sync/extract-props.mjs`. `cfg.overrides.<Name>.skip` là MẢNG tên story.

## Card bị loại (vẫn là export trong bundle)

- Logo, GridBackground: import .svg as-component.
- ContactForm / Comments: runtime I18n / Giscus.
- molecules/back-to-posts.tsx trùng tên với bản cũ ở atoms → shim SKIP molecules/back-to-posts; card BackToPosts trỏ molecules.

## Provider

- `cfg.provider = TooltipProvider`.

## Chưa kiểm chứng trên máy này (không chạy `/design-sync`)

- Bundle IIFE có đủ export app+icons hay không.
- `[PROVIDER_UNEXPORTED]` nếu TooltipProvider không ra bundle.
- 0-component nếu `types` bị mất trên `@portfolio/ui`.
- Preview `from '@portfolio/ui'` / `'@portfolio/icons'` có được `pkgRx` shim về `window.Web2025UI` hay không.

## Học từ wave authoring / review

Giữ nguyên các bài học CSS JIT, Radix overlay, scroll-lock, capture clock — xem git history NOTES trước commit này. Preview SocialIcons: không còn `iconType='button'`; `size` là pixel.
