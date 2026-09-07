# PLAN — Chuẩn hoá responsive: thang breakpoint + hợp đồng kiểm UI

Trạng thái: **ĐANG LÀM** (lập 2026-09-07). Áp cho `apps/2026`, `apps/2025`, `packages/ui`, `packages/mdx`.
Không commit trong lúc thực hiện. Không sửa `docs/plans/*` (lịch sử GSD C0–C12). Không ghi vào `D:/JARVIS/wiki`.

## 1. Bối cảnh

Hai bề mặt đang chạy hai hệ responsive không nói chuyện với nhau và chưa có thủ tục kiểm nào:

- **2026 (showcase)**: 22 media query CSS đều ở `800px` / `799.98px` (số `$mobile-breakpoint` của lenis-website), `800` hard-code hai lần trong JS (`apps/2026/src/components/effects/horizontal-slides.tsx:20,36`). Tailwind của app vẫn để thang rem mặc định nên 5 chỗ dùng `sm:` / `lg:` (640 / 1024) và 2 chỗ dùng `min-[800px]:` lệch nhau. `apps/2026/docs/design-system.md` không nói gì về prefix Tailwind và không có mục kiểm viewport.
- **2025 + `packages/ui`**: Tailwind mobile-first, `md:` chiếm 55% prefix. Một chuỗi heading 6 utility lặp 5 lần (4 file 2025 + `packages/ui/src/components/drawer.tsx:79`). Vài class no-op. JS breakpoint `(min-width: 1024px)` viết bằng px trong `molecules/modal.tsx:30`.
- **QA**: `ci-check` không có bước UI; Vitest chỉ node / jsdom; `.ds-sync` Playwright chỉ chụp card 900–1000px; `docs/plans/STATE.md` còn nợ "desktop-only chưa từng nhìn thấy" kéo qua ba phase.

## 2. Quyết định đã chốt

- **Thang token Tailwind**: 7 bậc, đơn vị rem (luật Tailwind v4: mọi breakpoint cùng đơn vị, mặc định là rem), ở **cả hai app**:
  `xs 30rem (480)` · `sm 40rem (640)` · `md 48rem (768)` · `lg 64rem (1024)` · `xl 80rem (1280)` · `2xl 96rem (1536)` · `3xl 120rem (1920)`.
  Không thêm mốc tablet 600 / 840 (tablet < 1% traffic VN). Không có mốc đồng hồ: Apple Watch dựng trang ở 320 CSS px và media query cũng thấy 320, nên rơi vào base; Wear OS không có trình duyệt hệ thống.
- **Mốc mobile/desktop duy nhất của 2026**: **bỏ 800, dùng `md` 768.** Điểm cân bằng giữa hai comp 375 / 1440 là ≈ 735 nên 768 là mốc gần nhất trong thang, đồng thời là mốc đồng thuận của Tailwind / Bootstrap / AntD / Chakra. Cú nhảy chữ khi đổi comp là hằng số theo tỉ lệ nên không mốc nào xoá được nó; `.h3` sẽ là 40.9px ở 767 và 27.7px ở 768 (trước: 42.6 / 28.9 ở 799 / 800).
- **Một nguồn số cho 2026**: CSS module dùng `@reference` + `@media (width >= theme(--breakpoint-md))`; JS đọc một hằng `DESKTOP_MEDIA = '(min-width: 48rem)'`. Số 768 sống trong theme Tailwind, `theme()` chỉ trỏ tới nó; hằng JS là nơi thứ hai duy nhất và có comment nói vậy.
- **Hai bề mặt, hai luật dùng**:
  - Showcase 2026: hai layout (phone + desktop). Bố cục trang chỉ được dùng `md:` / `max-md:`. Type và spacing đã scale theo vw nên **cấm** ramp kiểu `text-2xl sm:text-3xl md:text-4xl`. Các bậc còn lại tồn tại để `@portfolio/ui` / `@portfolio/mdx` biên dịch qua `@source` và cho form / drawer — không cho bố cục trang.
  - 2025 + `packages/ui`: Tailwind mobile-first. Ngữ nghĩa: base = phone; `sm` = 2 cột / phone ngang; `md` = nav / dock / stack→row; `lg` = layout đầy (sidebar / TOC, dialog↔drawer); `xl` = mật độ; `2xl` / `3xl` = max-width màn rộng; `xs` chỉ khi phone ngang thật sự gãy. Chỉ thêm prefix nơi bố cục thật sự đổi; cấm stack đủ bậc trên mọi utility.
  - Component tái sử dụng đặt ở chỗ có bề rộng ≠ cửa sổ: `@container` (2025 đã dùng đúng ở `molecules/contact-form.tsx` với `@sm/form:` và `app/[locale]/@modal/(.)contact/page.tsx` với `@2xl:`). Chrome toàn site: viewport.
- **Kiểm**: checklist chạy bằng browser **và** script Playwright `pnpm shots` chụp đa viewport (không đưa vào `ci-check`). Ma trận bề rộng theo thang theme: `320` (sàn / Apple Watch), `375` (comp mobile), `480`, `640`, `767`, `768`, `1024`, `1280`, `1440` (comp desktop), `1536`, `1920`.
- **Nhà của spec**: tách theo app — mục mới trong `apps/2026/docs/design-system.md`; tạo `apps/2025/docs/design-system.md`. `CLAUDE.md` trỏ tới.

## 3. Việc A — 2026: đổi mốc 800 → `md` 768, một nguồn số

### A1. Theme — `apps/2026/src/app/globals.css`

1. Thêm một block `@theme` riêng (KHÔNG nhét vào block `@theme inline` dòng ~182), đặt ngay sau các dòng `@import` / `@source` đầu file:

   ```css
   @theme {
     --breakpoint-xs: 30rem;
     --breakpoint-3xl: 120rem;
   }
   ```

   `sm…2xl` giữ mặc định — bắt buộc, vì class `sm:` / `md:` của `@portfolio/ui` được biên dịch vào app này qua `@source`; xoá là chúng biến mất âm thầm.

2. Đổi 7 media query trong file (hiện ở khoảng dòng 137, 332, 373, 446, 454, 459):
   - `@media (min-width: 800px)` → `@media (width >= theme(--breakpoint-md))`
   - `@media (max-width: 799.98px)` → `@media (width < theme(--breakpoint-md))` (range syntax; hết hack `.98`)
3. Sửa các comment còn nhắc "800px" / "block 800px" (khoảng dòng 75, 139) → "mốc `--breakpoint-md`".

### A2. CSS module — thêm `@reference`, đổi query

Mỗi file thêm dòng đầu `@reference '../../app/globals.css';` rồi đổi query giống A1. Danh sách (số dòng theo audit, kiểm lại bằng grep `800`):

- `apps/2026/src/components/chrome/site-menu.module.css` (216)
- `apps/2026/src/components/effects/card.module.css` (20, 38, 52)
- `apps/2026/src/components/effects/horizontal-slides.module.css` (14, 22)
- `apps/2026/src/components/effects/list-item.module.css` (70)
- `apps/2026/src/components/showcase/feature-cards.module.css` (22, 43, 51)
- `apps/2026/src/components/showcase/sections.module.css` (50, 76, 136, 160, 188, 284)

Rủi ro đã biết: nếu `theme()` không được resolve trong CSS module dưới Turbopack, `next build` sẽ fail ở Lightning CSS (không fail âm thầm). **Fallback đã thoả thuận**: viết thẳng `@media (width >= 48rem)` / `(width < 48rem)` trong CSS module, giữ `@reference` bỏ đi, và ghi nhận trong báo cáo + retro.

### A3. JS — một hằng

1. Tạo `apps/2026/src/utils/breakpoints.ts`:

   ```ts
   /** Khớp --breakpoint-md của Tailwind (48rem). Đổi số ở @theme thì đổi ở đây — là chỗ thứ hai duy nhất. */
   export const DESKTOP_MEDIA = '(min-width: 48rem)'
   ```

2. `apps/2026/src/components/effects/horizontal-slides.tsx`:
   - Bỏ `setIsDesktop(window.innerWidth >= 800)` và state `isDesktop`; thay bằng `const isDesktop = useMediaQuery(DESKTOP_MEDIA, { initializeWithValue: false })` từ `@portfolio/hooks` (đã là dependency; `initializeWithValue: false` để SSR không lệch hydration). Effect `measure` chỉ còn đo `trackWidth`.
   - Dòng `if (!w || !r || window.innerWidth < 800) return` → `if (!w || !r || !window.matchMedia(DESKTOP_MEDIA).matches) return`. Giữ comment "đọc trực tiếp thay vì state isDesktop".

### A4. Tailwind prefix trong `apps/2026/src` — về đúng `md:`

- `apps/2026/src/app/[locale]/(main)/page.tsx` (≈59, 70): `min-[800px]:col-span-6` → `md:col-span-6`; `min-[800px]:grid-cols-2` → `md:grid-cols-2`.
- `apps/2026/src/app/[locale]/(main)/gallery/page.tsx` (≈28): `columns-1 sm:columns-2 lg:columns-3` → `columns-1 md:columns-3` (hai layout). Kiểm ở 768 / 1024; chỉ khi ảnh quá hẹp mới cân nhắc thêm bậc.
- `apps/2026/src/app/[locale]/(main)/projects/page.tsx` (≈34): `sm:flex-row sm:items-baseline` → `md:flex-row md:items-baseline`.
- `apps/2026/src/components/chrome/site-footer.tsx` (≈12): `sm:flex-row` → `md:flex-row`.
- `apps/2026/src/components/post-row.tsx` (≈19, 22): `sm:flex-row sm:items-baseline` → `md:…`; `text-xl sm:text-2xl` → `text-xl md:text-2xl` (px tĩnh là nợ có sẵn của `(main)`, không mở rộng đợt này).

Cổng grep sau khi xong, trong `apps/2026/src` phải bằng 0: `800`, `799.98`, `min-[`, `sm:`, `lg:`, `xl:`, `2xl:` (bỏ qua key size `sm`/`lg` của CVA nếu có).

### A5. Tài liệu 2026

- `apps/2026/docs/design-system.md`:
  - Mục "Nguyên tắc cốt lõi" (dòng 10–13): `--device-width` đổi tại `--breakpoint-md` (768px); xoá mọi "800px".
  - Đoạn "Giấy phép dùng gold" (dòng 78–80): ví dụ `.h3` → 40.9px ở 767 / 27.7px ở 768.
  - Thêm mục **"Responsive — thang breakpoint và luật prefix"**: thang 7 bậc; showcase chỉ dùng `md:` / `max-md:`; các bậc khác cho `@portfolio/ui` / form / drawer; cấm ramp type theo prefix; JS đọc `DESKTOP_MEDIA`; ba nơi số sống (theme / `theme()` trong CSS / hằng JS); `@container` khi cần.
  - Thêm mục **"Kiểm tra viewport (bắt buộc khi đụng UI)"** — nội dung ở mục 5 dưới.
- `CLAUDE.md`:
  - Dòng "one breakpoint at 800px" → "one breakpoint at `md` 768px (Tailwind `--breakpoint-md`); the number lives in the theme, CSS reads it via `theme()`, JS via `DESKTOP_MEDIA`".
  - Sửa hai dòng stale về `ci-check` (dòng ≈28 và ≈31): lệnh thật là `prettier --check . && eslint . && vitest run && turbo typecheck && turbo build && node scripts/check-dead-links.mjs`; câu "No unit tests" đã sai (có 7 file test Vitest).
  - Thêm một gạch đầu dòng: "Responsive: đọc mục Responsive trong `docs/design-system.md` của app tương ứng trước khi thêm prefix Tailwind; kiểm theo ma trận viewport; `pnpm shots` để chụp đa viewport".
- `README.md` (≈79): "một breakpoint 800px" → "một mốc `md` 768px".

## 4. Việc B — 2025 + `packages/ui` + `packages/mdx`

### B1. Theme — `apps/2025/src/styles/_theme.css`

Trong block `@theme` (dòng 2) thêm `--breakpoint-xs: 30rem;` và `--breakpoint-3xl: 120rem;`.

### B2. Gộp heading lặp → `@utility` — `apps/2025/src/styles/_utilities.css`

```css
/* Heading trang / mục: hai bậc (base + md), bỏ bậc sm — chỉ prefix nơi bố cục đổi. */
@utility heading-page {
  @apply text-3xl font-extrabold leading-9 tracking-tight;
  @variant md {
    @apply leading-14 text-6xl;
  }
}
@utility heading-section {
  @apply text-2xl font-extrabold leading-9 tracking-tight;
  @variant md {
    @apply leading-14 text-4xl;
  }
}
```

Thay tại:

- `apps/2025/src/components/organisms/header.tsx` (≈17) → `heading-page`
- `apps/2025/src/app/[locale]/(page)/tags/page.tsx` (≈29) → `heading-page` + giữ `font-bold text-gray-900 md:border-r-2 md:px-6 dark:text-gray-100` (font-bold ghi sau utility để thắng font-extrabold, hoặc chấp nhận extrabold cho đồng nhất — chọn đồng nhất extrabold, bỏ `font-bold`).
- `apps/2025/src/components/organisms/experience.tsx` (≈85), `github-cal.tsx` (≈16), `technologies.tsx` (≈71) → `heading-section`.

Hệ quả nhìn thấy, cố ý: ở 640–767 heading về cỡ base (h1 30px thay 36px, h3 24px thay 30px).

`packages/ui/src/components/drawer.tsx` (≈79): KHÔNG dùng utility của app (2026 cũng biên dịch drawer; utility không tồn tại ở đó sẽ no-op âm thầm). Rút về hai bậc: `text-2xl leading-9 font-extrabold tracking-tight md:text-4xl md:leading-14`. `drawer.tsx:91` `text-sm md:text-base` giữ (đã hai bậc).

### B3. Dọn class chết

- `apps/2025/src/components/organisms/technologies.tsx` (≈113): bỏ `sm:p-2`; (≈106): bỏ `lg:grid-cols-8` (trùng `md:grid-cols-8`).
- `apps/2025/src/components/templates/about.tsx` (≈43): bỏ `md:mb-0`.
- KHÔNG đụng `templates/tag.tsx:78` (`sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1` là cố ý: sidebar đổi hướng ở `lg`) và `technologies.tsx:84` (gap `2 → md:1 → xl:2`) — ghi vào doc là ramp có lý do.

### B4. JS breakpoint cùng đơn vị

- Tạo `apps/2025/src/constants/breakpoints.ts`:

  ```ts
  /** Media query khớp thang Tailwind (rem). `constants/boxes.ts` BREAKPOINTS (510/1530) là hệ lerp scale, KHÔNG phải layout. */
  export const MEDIA = {
    md: '(min-width: 48rem)',
    lg: '(min-width: 64rem)',
  } as const
  ```

- `apps/2025/src/components/molecules/modal.tsx` (≈30): `useMediaQuery('(min-width: 1024px)')` → `useMediaQuery(MEDIA.lg)`.

### B5. `@container` — không sửa code

Đã dùng đúng: `molecules/contact-form.tsx:50` (`@container/form` + `@sm/form:grid-cols-2`), `app/[locale]/@modal/(.)contact/page.tsx:14` (`@container` + `@2xl:grid-cols-2`); `packages/ui/src/components/card.tsx:24` là shadcn upstream. Doc 2025 ghi đây là mẫu cho component đặt ở chỗ ≠ bề rộng cửa sổ.

### B6. `packages/mdx/src/styles.css` (≈314) — giữ số

Giữ `@media (max-width: 768px)`: nó mirror đúng `@media screen and (max-width: 768px)` của chính `@codesandbox/sandpack-react` (đã grep trong dist). Chỉ thêm một câu vào comment phía trên: "Số 768px là của Sandpack, KHÔNG đổi theo theme Tailwind của app."

### B7. Tạo `apps/2025/docs/design-system.md`

Đợt này chỉ viết mục **Responsive** (ghi rõ đầu file: các mục màu / type / spacing chưa viết, nguồn sự thật vẫn là `src/styles/*.css`):

- Thang 7 bậc + ngữ nghĩa từng bậc (mục 2).
- Cấm sprawl; ví dụ đúng / sai lấy từ repo: `heading-page` / `heading-section` thay chuỗi lặp; `py-5 md:py-10` là mẫu hai bậc hợp lệ.
- `@container` cho component tái sử dụng (ví dụ contact-form); viewport cho chrome (dock `md:`).
- JS: `constants/breakpoints.ts`, rem, `useMediaQuery` từ `@portfolio/hooks`.
- Nợ đã thấy, chưa làm: trần `max-w-6xl` 1152px ở `atoms/container.tsx` (vùng 1440–1920 chưa thiết kế); không có TOC mobile (`templates/post-layout.tsx:52` `hidden lg:block`); hai quy ước page-top (`pt-4 lg:pt-12` ×7 vs `pt-4 md:pt-0` ở `tags/page.tsx`); ~30 cặp `X-5 md:X-10` nên thành token; `tag.tsx:78` và `technologies.tsx:84` là ramp có lý do.
- Ma trận kiểm (mục 5).

## 5. Việc C — công cụ kiểm

### C1. `scripts/responsive-shots.mjs` (Playwright)

- Root `devDependencies`: `"playwright": "^1.61.0"` (cùng phiên bản `.ds-sync/package.json`). Root `scripts`: `"shots": "node scripts/responsive-shots.mjs"`. **KHÔNG** thêm vào `ci-check`.
- Nếu Chromium chưa cài, script in `pnpm exec playwright install chromium` rồi exit 2.
- Tham số:
  - `--base=http://localhost:3000` (mặc định); `--app=2026|2025|both` (`both` → 3000 + 3001).
  - `--routes=/,/about,...` — mặc định 2026: `/`, `/about`, `/blog`, `/projects`, `/resume`, `/gallery`, `/contact`, cộng bản `/en/...`; 2025: `/`, `/blog`, `/projects`, `/about`, `/tags`, `/contact`, cộng `/en/...`. (Kiểm lại route thật trong `apps/*/src/app/[locale]` trước khi hard-code.)
  - `--widths=` mặc định `320,375,480,640,767,768,1024,1280,1440,1536,1920`.
- Mỗi width: viewport cao 900; `< 768` bật `hasTouch: true, isMobile: true` (khớp Browser pane); `reducedMotion: 'reduce'`; với 2026 chờ selector `html.intro-out` (trần 10s) rồi chờ `networkidle` trước khi chụp.
- Output: `.shots/<app>/<route-slug>/<width>.png` (full page); `.shots/<app>/overflow.json` = `{ route, width, scrollWidth, innerWidth }` cho mọi cặp có `document.documentElement.scrollWidth > window.innerWidth`; `.shots/index.html` contact-sheet (grid ảnh theo route × width). Exit code 1 nếu `overflow.json` không rỗng.
- Header script ghi giới hạn: chỉ layout tĩnh; scroll-driven (GSAP / lenis) phải cuộn chuột thật (luật ở `CLAUDE.md`, mục scroll-driven).
- Thêm `.shots/` vào `.gitignore`, `.prettierignore`, và `ignores` của `eslint.config.mjs`.
- Viết bằng Node thuần + `playwright`, style giống `scripts/check-dead-links.mjs` (comment tiếng Việt, `--help`).

### C2. Checklist thủ công (ghi nguyên văn vào cả hai doc)

1. Resize lần lượt các width trong ma trận (browser emulate touch khi `< 768`).
2. Oracle tràn ngang ở mỗi width: `document.documentElement.scrollWidth > window.innerWidth` phải là `false`.
3. 2026, cặp 767 / 768: `getComputedStyle(document.querySelector('.h3')).fontSize` ≈ 40.9px → 27.7px; `getComputedStyle(document.documentElement).getPropertyValue('--columns')` 6 → 12; `.desktop-only` / `.mobile-only` lật; rail HorizontalSlides chỉ chạy ≥ 768 khi cuộn chuột thật.
4. Cả hai theme (light / dark), cả hai locale (vi / en — locale rộng hơn quyết định).
5. Một máy thật hoặc ít nhất emulate touch: nav / dock, CTA, không tràn ngang.
6. Tối thiểu bắt buộc mỗi lần đụng UI: 375 / 767–768 / 1440 + cuộn thật; phần còn lại giao `pnpm shots`.

## 6. Verification (thứ tự bắt buộc)

1. `pnpm format:write` cho các file doc / script mới, rồi `pnpm ci-check` xanh (prettier + eslint + vitest + typecheck + build + check-links). Build 2026 chứng minh `theme()` trong CSS module có `@reference` hoạt động; nếu fail → fallback A2 và ghi lại.
2. Grep gate A4 trong `apps/2026/src` = 0 hit cho `800`, `799.98`, `min-[`, `sm:`, `lg:`, `xl:`, `2xl:`.
3. Chạy dev `web-2026` (port 3000): thực hiện C2 bước 1–4 ở 375, 767, 768, 1024, 1440 trên `/`, `/about`, `/blog`, `/gallery`; xác nhận gallery 3 cột ở 768 chấp nhận được; HorizontalSlides ở `/about` chạy khi cuộn chuột thật ≥ 768.
4. Chạy dev `web-2025` (port 3001): heading mới ở 375 / 640 / 768 / 1024; modal ↔ drawer lật đúng tại 1024; contact form `@sm/form` vẫn lật theo container; tags page vẫn có `md:border-r-2`.
5. `pnpm shots --app=both` với hai dev server đang chạy; mở `.shots/index.html`; `overflow.json` rỗng.
6. Retro JARVIS chỉ khi có gì đo được / lệch dự đoán (`theme()` không resolve, tràn ngang bất ngờ, số 767 / 768 khác tính toán): file MỚI `D:/JARVIS/raw/2026-09-07-retro-<slug>.md`, ngôi thứ nhất, kèm entry `wiki/log.md` op `ingest` trong cùng commit theo mẫu ở `CLAUDE.md`, rồi `bash D:/JARVIS/tools/lint.sh --self-check`. Không có gì đáng kiểm thì không viết.

## 7. Không làm đợt này

Prettier `tailwindStylesheet` cho `packages/**` (đổi thứ tự class hàng loạt); redesign 2025 (trần 1152, TOC mobile, page-top); clamp cỡ chữ vw quanh mốc; `docs/plans/*`; JARVIS `wiki/`; commit; `.env.local`.

## 8. Báo cáo cuối

- Layout nào đổi (2026: 5 site prefix + gallery 3 cột từ 768; 2025: heading hai bậc, class chết), breakpoint nào dùng (2026 chỉ `md`; 2025 base / sm / md / lg / xl / 2xl + xs / 3xl sẵn), chỗ cố ý không prefix (type vw của 2026, `tag.tsx:78`, `@container` form).
- 2026: **đã lệch khỏi 800 có chủ đích** → mốc duy nhất là `md` 768; số sống ở theme + `theme()` + `DESKTOP_MEDIA`.
- Kết quả `pnpm ci-check`, grep gate, `overflow.json`, và fallback A2 có phải dùng không.
