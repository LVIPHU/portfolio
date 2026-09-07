# Design System — Portfolio 2025

Đợt này chỉ viết mục **Responsive**. Các mục màu / type / spacing chưa viết — nguồn sự thật
vẫn là `src/styles/*.css`.

## Responsive — thang breakpoint và luật prefix

Thang Tailwind 7 bậc, đơn vị rem (luật v4: mọi breakpoint cùng đơn vị). `xs` và `3xl` khai
trong `@theme` của `src/styles/_theme.css`; `sm…2xl` là mặc định — **không xoá**.

| Prefix | Token                     | CSS px | Ngữ nghĩa                                 |
| ------ | ------------------------- | ------ | ----------------------------------------- |
| (base) | —                         | —      | phone dọc                                 |
| `xs`   | `--breakpoint-xs` 30rem   | 480    | chỉ khi phone ngang thật sự gãy           |
| `sm`   | `--breakpoint-sm` 40rem   | 640    | 2 cột / phone ngang                       |
| `md`   | `--breakpoint-md` 48rem   | 768    | nav / dock / stack→row                    |
| `lg`   | `--breakpoint-lg` 64rem   | 1024   | layout đầy (sidebar / TOC, dialog↔drawer) |
| `xl`   | `--breakpoint-xl` 80rem   | 1280   | mật độ                                    |
| `2xl`  | `--breakpoint-2xl` 96rem  | 1536   | max-width màn rộng                        |
| `3xl`  | `--breakpoint-3xl` 120rem | 1920   | max-width màn rộng                        |

Chỉ thêm prefix nơi bố cục **thật sự** đổi. Cấm stack đủ bậc trên mọi utility
(`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl`).

Đúng: `heading-page` / `heading-section` (hai bậc base + `md`, bỏ `sm`) thay chuỗi lặp;
`py-5 md:py-10` là mẫu hai bậc hợp lệ.

Sai: ramp đủ prefix trên một utility; dùng `@utility` của app trong `packages/ui` (2026 cũng
biên dịch component đó — utility không tồn tại thì no-op âm thầm).

Chrome toàn site theo viewport. Component tái sử dụng đặt ở chỗ bề rộng ≠ cửa sổ: `@container`
(mẫu: `molecules/contact-form.tsx` `@container/form` + `@sm/form:grid-cols-2`;
`app/[locale]/@modal/(.)contact/page.tsx` `@container` + `@2xl:grid-cols-2`). Dock/nav dùng
`md:` theo viewport.

JS: `src/constants/breakpoints.ts` (`MEDIA.md` / `MEDIA.lg`, đơn vị rem) + `useMediaQuery`
từ `@portfolio/hooks`. `constants/boxes.ts` BREAKPOINTS (510/1530) là hệ lerp scale, **không**
phải layout.

Ramp có lý do, giữ nguyên: `templates/tag.tsx` `sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1`
(sidebar đổi hướng ở `lg`); `technologies.tsx` gap `2 → md:1 → xl:2`.

Nợ đã thấy, chưa làm:

- Trần `max-w-6xl` 1152px ở `atoms/container.tsx` (vùng 1440–1920 chưa thiết kế).
- Không có TOC mobile (`templates/post-layout.tsx` `hidden lg:block`).
- Hai quy ước page-top (`pt-4 lg:pt-12` ×7 vs `pt-4 md:pt-0` ở `tags/page.tsx`).
- ~30 cặp `X-5 md:X-10` nên thành token.

## Kiểm tra viewport (bắt buộc khi đụng UI)

Ma trận bề rộng: `320`, `375`, `480`, `640`, `767`, `768`, `1024`, `1280`, `1440`, `1536`,
`1920`. `pnpm shots` chụp đa viewport (không nằm trong `ci-check`).

1. Resize lần lượt các width trong ma trận (browser emulate touch khi `< 768`).
2. Oracle tràn ngang ở mỗi width: `document.documentElement.scrollWidth > document.documentElement.clientWidth` phải là `false`.
3. 2025: `heading-page` / `heading-section` còn cỡ base ở 375 và 640, nhảy cỡ tại 768; modal↔drawer tại 1024; contact form `@sm/form` vẫn theo container; tags giữ `md:border-r-2`.
4. Cả hai theme (light / dark), cả hai locale (vi / en — locale rộng hơn quyết định).
5. Một máy thật hoặc ít nhất emulate touch: nav / dock, CTA, không tràn ngang.
6. Tối thiểu bắt buộc mỗi lần đụng UI: 375 / 767–768 / 1440; phần còn lại giao `pnpm shots`.
