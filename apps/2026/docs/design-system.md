# Design System — Portfolio 2026 (phong cách lenis.dev)

Hệ thiết kế của web-2026, port từ kiến trúc token của lenis-website (darkroom.engineering)
sang CSS thuần + Tailwind v4, thay palette pink của lenis bằng **gold thương hiệu**.
Nguồn sự thật: `src/app/globals.css` (token toàn cục) + `src/components/showcase/theme.css`
(theme bộ ba scoped cho showcase).

## Nguyên tắc cốt lõi

1. **Mọi kích thước scale theo viewport** — không px tĩnh. Công thức chuẩn:
   `calc(((<px trên comp> * 100) / var(--device-width)) * 1vw)`.
   Comp mobile = 375, comp desktop = 1440 (`--device-width` tự đổi tại breakpoint 800px).
2. **Một breakpoint duy nhất: 800px.** Dưới = mobile (6 cột), trên = desktop (12 cột).
3. **Màu qua bộ ba theme** `--theme-primary/secondary/contrast` — component không gọi
   thẳng màu palette, nhờ vậy section đổi theme (dark → light → contrast) không cần sửa
   component.
4. **Motion:** dùng easing token, không viết cubic-bezier tay. Mặc định reveal/settle =
   `--ease-out-expo`; crossfade = `--ease-in-out-quad`; scale lớn (intro) = 1500ms
   (`--intro-dur`), micro-interaction 300–600ms.

## Palette

| Token               | Giá trị            | Vai trò                                            |
| ------------------- | ------------------ | -------------------------------------------------- |
| `--color-black`     | `rgb(0 0 0)`       | nền dark (mặc định)                                |
| `--color-white`     | `rgb(239 239 239)` | chữ trên dark / nền light — KHÔNG dùng trắng thuần |
| `--color-grey`      | `rgb(176 176 176)` | chữ phụ, meta                                      |
| `--color-gold`      | `rgb(223 180 84)`  | contrast thương hiệu (vai trò "pink" của lenis)    |
| `--color-gold-deep` | `rgb(143 98 0)`    | bản đậm — CHỈ dùng ở light theme cho chữ/UI        |

Mỗi màu có biến `-transparent` (alpha 0) cho gradient fade trên Safari.
Gold thương hiệu `#DFB454` = **bản sinh đôi cảm nhận của pink lenis**. Đổi `#FF98A2`
sang OKLCH được L=0.789 / C=0.124 / H=14°; giữ nguyên L và C, chỉ xoay hue sang vàng.
Nhờ vậy nó hành xử gần trùng khít lenis: **10.79** trên đen (pink 10.27) và **1.69**
trên `#EFEFEF` (pink 1.78).

Vật liệu quả cầu Earth **cố ý KHÁC**: giữ `#D4AF37` để còn chất kim loại/kintsugi. Đừng
đồng bộ hai giá trị này.

Light theme dùng gold ĐẬM `rgb(143 98 0)` cho `--primary` — cùng hue 41° với gold thương
hiệu, bão hoà 100% (nên vẫn ra vàng, không ngả olive), đạt **4.66:1** trên nền off-white
(WCAG AA cho chữ thường). Gold thương hiệu chỉ đạt 1.69:1 nên cấm dùng làm chữ nhỏ trên
nền sáng — y như pink của lenis, vốn cũng không đọc được ở đó.

## Theme (bộ ba, kiểu lenis)

| Theme             | primary (nền) | secondary (chữ) | contrast (nhấn) | display (trang trí) |
| ----------------- | ------------- | --------------- | --------------- | ------------------- |
| `dark` (mặc định) | black         | white           | gold            | gold                |
| `light`           | white         | black           | **gold đậm**    | gold                |
| `contrast`        | gold          | black           | white           | white               |

Showcase: đặt `data-theme` trên `.showcase-root`. Selection luôn: nền contrast, chữ primary.

**`--theme-contrast` vs `--theme-display`** — hai vai trò khác nhau, đừng lẫn:

- `--theme-contrast`: chữ nhỏ, link, nút, nav, `::selection`, viền con trỏ. **Phải đọc
  được**, nên ở light theme nó lật sang bản đậm.
- `--theme-display`: chữ TRANG TRÍ cỡ lớn (wordmark FELIX, số 01–09 của FeatureCards, số
  404). **Luôn là gold thương hiệu ở cả hai theme** để nhìn đâu cũng ra một màu. Chấp nhận
  1.69:1 trên nền sáng vì là trang trí — đây đúng điều lenis làm với số 01–07 của họ.

## Typography

Font: **Anton** (heading — mặc định cho h1–h6, uppercase), **Panchang** (h3/h4 kỹ thuật),
**Roboto** (thân bài). Class toàn cục (mobile → desktop, px trên comp):

| Class   | Font         | Size     | Line-height | Ghi chú                                |
| ------- | ------------ | -------- | ----------- | -------------------------------------- |
| `.h1`   | Anton        | 56 → 160 | 95%         | uppercase; `.vh` = tính theo chiều cao |
| `.h2`   | Anton        | 56 → 96  | 90%         | uppercase                              |
| `.h3`   | Panchang 700 | 20 → 52  | 90%         | uppercase                              |
| `.h4`   | Panchang 700 | 20 → 28  | 100%        | uppercase                              |
| `.p-l`  | Roboto 500   | 32 → 64  | 100%        | lead                                   |
| `.p`    | Roboto 500   | 16 → 18  | 125% → 133% | thân bài; `.p.bold` = 900              |
| `.p-s`  | Roboto 900   | 14       | → 114%      | uppercase, label                       |
| `.p-xs` | Roboto 900   | 12       | → 113%      | uppercase, meta                        |

Helper màu: `.contrast` (màu nhấn theo theme), `.grey`.

## Spacing — `--spacer-*` (lưới 8px, scale vw)

| Token         | Mobile (comp 375) | Desktop (comp 1440) |
| ------------- | ----------------- | ------------------- |
| `--spacer-xs` | 32px              | 48px                |
| `--spacer-sm` | 32px              | 64px                |
| `--spacer-md` | 48px              | 80px                |
| `--spacer-lg` | 64px              | 128px               |
| `--spacer-xl` | 80px              | 192px               |

Khoảng cách giữa section dùng spacer, không số tay. Lề an toàn: `--safe` (16 → 40).

## Layout — hệ cột

`--columns` 6 → 12, `--gap` 24, `--layout-width` = 100vw − 2×safe, `--column-width` dẫn xuất.
Class sẵn: `.layout-block`, `.layout-block-inner`, `.layout-grid`, `.layout-grid-inner`
(grid đúng hệ cột + gap). Component mới dùng các class này, không tự kê
`grid-template-columns`.

## Motion & easing

Đủ 18 đường cong lenis (`--ease-in|out|in-out` × `quad/cubic/quart/quint/expo/circ`) +
`--ease-gleasing`. Token nhịp: `--intro-dur` 1500ms (intro FELIX), header trượt 0.5s
out-expo, đổi nền theme 0.6s out-expo.

## Thành phần đặc trưng

- **FelixHeroMark** — wordmark FELIX (Cloister Black → SVG, viewBox `0 0 1401 368`), fill
  `var(--primary)`; vị trí khớp intro qua `--wordmark-top/-inset` (30 / 32.5 trên comp 1440).
- **Marquee / ListItem / AppearTitle / ShowcaseCard** — hiệu ứng showcase thuần CSS;
  ListItem cần `visible`, AppearTitle tự reveal bằng IntersectionObserver.
- **Nav** — cao `--header-height` (58 → 98), tự ẩn ở đỉnh trang chủ, trượt vào khi cuộn.

## Cấm kỵ

- Không px tĩnh cho kích thước/spacing (trừ border 1–4px).
- Không cubic-bezier viết tay — dùng token.
- Không trắng `#fff` thuần — luôn `--color-white` (#EFEFEF).
- Không gold thương hiệu làm chữ NHỎ trên nền sáng (1.69:1) — dùng `--primary` của light.
  Chữ trang trí ≥40px thì dùng `--theme-display`, được phép.
- Không một màu nào nổi tốt trên CẢ hai nền: giới hạn cân bằng tối đa là **4.27:1**.
- Không gọi màu palette trực tiếp trong component showcase — đi qua `--theme-*`.
