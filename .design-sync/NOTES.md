# design-sync NOTES — web-2025 (apps/2025)

## Hình dạng nguồn

- apps/2025 là **Next.js app, không có dist/**. Entry tự viết: `apps/2025/.design-sync.entry.tsx` (gitignored, sinh bởi `.design-sync/gen-entry.mjs` — nằm trong `buildCmd`). KHÔNG dùng chế độ synth mặc định của converter: nó `export *` mọi file dưới srcDir → kéo cả organisms dính Lingui macro/@env làm chết IIFE.
- `componentSrcMap` là danh sách card CHÍNH THỨC (map đầy đủ do gen-entry in ra; bản trong config đã curate). Thêm component mới: chạy gen-entry, merge entry tự động, nhưng phải TỰ thêm dòng vào componentSrcMap + chạy lại extract-props.
- PKG_DIR được suy từ vị trí entry (walk lên package.json có name) → entry BẮT BUỘC nằm trong apps/2025. `cssEntry` bị giới hạn trong PKG_DIR (lý do bảo mật) → cache css để ở `apps/2025/.ds-css/`.

## Shims (tsconfig.dsync.json paths → .design-sync/shims/)

- `next/image`→img thuần, `next/link`→a, `next/navigation`→hooks no-op, `@env`→object tĩnh (env.mjs thật import dotenv+node:path, chết trong browser), `@lingui/macro`+`@lingui/core/macro`+`@lingui/react/macro`→passthrough chuỗi gốc, `@data/site-metadata`→bản tĩnh (bản thật đọc `process.env.owner/email` do next.config bơm → "process is not defined" giết cả bundle).
- **Windows/esbuild**: import barrel không đuôi (`@/utils`, `@/components/atoms`...) qua tsconfig paths KHÔNG tự resolve directory→index (lỗi EISDIR "Incorrect function") → phải khai exact-path tới `index.ts` cho từng barrel.

## CSS & fonts

- `cssEntry` = Tailwind compile sẵn của app, copy từ `.next/static/css/<file lớn nhất>` bằng `refresh-css.mjs` (buildCmd). **Phải `pnpm build --filter=web-2025` trước nếu .next thiếu** (chạy từ PowerShell, KHÔNG Git Bash — xem CLAUDE.md, contentlayer đọc env PWD).
- Token: 299 defined / 2 missing (dưới ngưỡng, không chặn). Font: next/font không phát @font-face vào css này → validate không kêu FONT_MISSING (font-family fallback hệ thống); nếu sau này cần đúng font Space Grotesk..., wire qua extraFonts từ .next/static/media.

## Converter env

- `.ds-sync` cài: esbuild, ts-morph, @types/react, playwright@1.61.0 (khớp chromium-1228 trong %LOCALAPPDATA%\ms-playwright), **typescript@5.9.3** (typescript@7 native đổi API làm check .d.ts của validate rơi vào catch im lặng).
- `dtsPropsFor` sinh bởi `.design-sync/extract-props.mjs` (ts-morph, flatten cả VariantProps của cva; chỉ giữ prop khai trong repo + children/className). Đã normalize: children→React.ReactNode, `…`→any, `json`→any. CẢNH GIÁC type có `;` bên trong object (PostNav từng vỡ vì split).
- `cfg.overrides.<Name>.skip` là MẢNG tên story, không phải boolean.

## Card bị loại (vẫn là export trong bundle)

- Logo, GridBackground: import .svg as-component cần svgr — esbuild load svg thành chuỗi → crash khi render.
- ContactForm: useLingui runtime (@lingui/react) cần I18nProvider thật.
- Comments: Giscus cần env repo thật.
- molecules/back-to-posts.tsx trùng export BackToPosts với atoms/ (2 bản giống hệt) → entry chỉ giữ bản atoms (SKIP_FILES trong gen-entry).

## Provider

- `cfg.provider = TooltipProvider` (Radix) — vô hại toàn cục, cần cho Tooltip.

## Học từ wave authoring (đã fold từ learnings wave1-A/B/C)

- **CSS bundle chỉ chứa utility mà SOURCE APP dùng** (JIT từ apps/2025): utility preview-only (`size-6`, `ring-2`, `my-4`, `-space-x-2`...) im lặng không ăn. Nguy hiểm kép: tailwind-merge trong `cn()` strip class mặc định của component khi truyền class xung đột. → Glue layout trong preview dùng INLINE STYLE; muốn dùng utility lạ thì grep `ds-bundle/_ds_bundle.css` trước.
- Inline style dùng `var(--color-background)` (đã wrap hsl), KHÔNG dùng `var(--background)` (raw HSL triplet).
- Overlay Radix: prop `open` trần đủ render trạng thái mở tĩnh cho cả Dialog/DropdownMenu/Popover/Tooltip/Select (`open` + `value`). Portal không thoát viewport chụp.
- Drawer (vaul) animate ~0.5s: preview cần `<style>[data-vaul-drawer],[data-vaul-overlay]{transition:none!important}</style>`.
- `@lingui/react` TRẦN (không /macro) phải shim riêng (shims/lingui-react.tsx) — copy thật bake vào bundle có LinguiContext riêng, I18nProvider từ preview không với tới (chỉ vendor react/react-dom được share). Ai import '@lingui/react' trần đều dính (project-card, locale-switch).
- **Bundle của converter compile JSX CLASSIC** (sharedBuildOptions không truyền tsconfig/jsx cho esbuild → esbuild dò tsconfig app: preserve→transform; jsxFactory tsconfig.dsync bị phớt lờ). Hệ quả: file nào có binding cục bộ tên `React` không phải react namespace sẽ shadow factory → "X.createElement is not a function". DS này có icon `React` (utils/icons.tsx) + social-icons.tsx import icon đó. Fix: `gen-icons-safe.mjs` sinh 3 bản safe vào .cache (icons-safe, social-icons-safe, atoms-barrel-safe), route qua tsconfig alias `@/utils`, `@/components/atoms` (shims/utils-barrel.ts) + entry. Nếu upstream converter chuyển sang automatic runtime thì có thể gỡ toàn bộ cụm này. Shim trong .design-sync/shims KHÔNG được gọi React.createElement trực tiếp qua namespace import — dùng JSX.
- PostCard*: bắt buộc `readingTime.minutes` (Math.ceil) — thiếu là crash.
- Banner: nhánh Credit cần filename dạng `path__author__id` — không demo được bằng data-URI; GritBackground texture trỏ /static không có trong bundle (mất trang trí, không vỡ).
- ThemeSwitch không cần ThemeProvider (next-themes có default context).

## Học từ wave 2 (fold từ learnings wave2-D/E/F — pattern hệ thống cho preview)

- **Capture đóng băng clock** (`page.clock.setFixedTime`) → framer-motion kẹt ở keyframe `initial` (component trắng/collapse dù mount OK). CSS transition thuần + Radix animate-in KHÔNG bị. Fix theo thứ tự ưu tiên: (1) tắt animation bằng chính props (AnimatedContent: `distance={0} animateOpacity={false}`; FadeContent: `initialOpacity={1} duration={1}`), (2) CSS scoped `!important` ép trạng thái CUỐI (= resting state site thật).
- Viewport capture 900x700: `md:` ăn, `lg:`/`xl:` KHÔNG — cần cột thì truyền `className='md:grid-cols-2'`.
- Atom `position:fixed` (Blur, Boxes, ScrollButtons): wrapper `relative + overflow:hidden + translateZ(0)` làm containing block; ScrollButtons cần gỡ `fixed`+`hidden` bằng glue CSS.
- **react-hover-card popper trong bundle NEO SAI** (HoverCard, LinkPreview — khác react-popover neo đúng): ghim `[data-radix-popper-content-wrapper]{position:fixed!important;top:...;left:50%;transform:translateX(-50%)}`. LinkPreview không có prop open → dispatch `PointerEvent('pointerover')` lên trigger.
- Radix ScrollArea: `type="always"` mới thấy scrollbar trong screenshot; props ngoài d.ts spread qua `as any` được (esbuild không typecheck).
- `imageDriveLoader` của app bọc MỌI src qua drive.google.com → ảnh trong ParallaxScroll/Image dùng qua loader sẽ 404: glue CSS gradient trên `.image-container` hoặc dùng component không qua loader.
- **Quirk THẬT của site (đừng sửa trong preview, note trong grade)**: avatar Authors vuông-bo (`.image-container` đè `rounded-full`); chevron TableOfContents không xoay (`[&_.chevron-right]:open:` compile sai target); placeholder LocaleSwitch là "Select a timezone" (copy sót trong source — nên fix ở app).
- Class thiếu thêm trong CSS bundle: `z-[-1]`, toàn bộ `dark:*` của SearchArticles, `focus:border-primary-500`.
- Scroll-lock guard `body{margin-right:0!important;padding-right:0!important}` đặt trong mọi preview có trigger mở overlay live (Setting, LocaleSwitch, SocialShare, Modal, Popover).

## Học từ vòng review 3 của user (live trong DS pane)

- **Guard scroll-lock v2**: `body{margin-right:0}` chưa đủ — scrollbar iframe biến mất khi Radix khóa scroll vẫn gây xê dịch → thêm `html{scrollbar-gutter:stable}`. Chuẩn hiện tại: `html{scrollbar-gutter:stable}body{margin-right:0!important;padding-right:0!important}`.
- Card iframe trong PANE hẹp hơn 768px → mọi layout `md:flex-row` xếp cột (khác capture 900px!). Component responsive kiểu này (PostNav) cần glue CSS ép resting state desktop + cardMode column.
- Modal zoom của react-medium-image-zoom (position:fixed) bị transform của harness giam trong cell → user zoom xong KẸT. Preview nào có Zoom phải `[data-rmiz]{pointer-events:none}` (chỉ trình bày).
- `space-x-2` không tạo gap giữa `.image-container` và text trong Authors (cấu trúc con của Image) → glue `li{gap:10px}`.
- **VideoCard đã LOẠI card** (componentSrcMap null, vẫn là bundle export): props là glue trang chủ (`name: VideoKey` từ templates, pointer handlers bắt buộc, src suy nội bộ /static/videos) — không dùng độc lập được, không có gì hiển thị nổi trong card.

## Known render warns (triaged hợp lệ)

- [RENDER_THIN]/nhỏ trên các icon-only components (ThemeSwitch trước khi author) — đã có authored preview.
- GritBackground/Blur/AnimatedContent...: floor card, một số render trắng trang trí — đúng bản chất decorative.

## Re-sync risks (những gì có thể mục âm thầm)

- `css2025.css` chụp từ build .next — đổi style app mà quên rebuild app trước khi sync = CSS cũ.
- Shim `site-metadata.ts` và `env.ts` là BẢN SAO tĩnh — user sửa data/site-metadata.ts hoặc đổi domain thì shim lệch; kiểm tra khi re-sync.
- `dtsPropsFor` là snapshot type lúc extract — API component đổi thì phải chạy lại extract-props.mjs.
- Component mới thêm vào atoms/molecules: vào entry tự động (gen-entry) nhưng KHÔNG có card cho tới khi thêm vào componentSrcMap.
- Lingui macro shim trả chuỗi gốc trong code (đa phần tiếng Anh) — card hiển thị tiếng Anh dù site mặc định vi-VN; chấp nhận được cho DS pane.
