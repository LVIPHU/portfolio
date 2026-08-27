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

| Token           | Giá trị            | Vai trò                                            |
| --------------- | ------------------ | -------------------------------------------------- |
| `--color-black` | `rgb(0 0 0)`       | nền dark (mặc định)                                |
| `--color-white` | `rgb(239 239 239)` | chữ trên dark / nền light — KHÔNG dùng trắng thuần |
| `--color-grey`  | `rgb(176 176 176)` | chữ phụ, meta                                      |
| `--color-gold`  | `rgb(223 180 84)`  | contrast thương hiệu (vai trò "pink" của lenis)    |

Mỗi màu có biến `-transparent` (alpha 0) cho gradient fade trên Safari.
Gold thương hiệu `#DFB454` = **bản sinh đôi cảm nhận của pink lenis**. Đổi `#FF98A2`
sang OKLCH được L=0.789 / C=0.124 / H=14°; giữ nguyên L và C, chỉ xoay hue sang vàng.
Nhờ vậy nó hành xử gần trùng khít lenis: **10.79** trên đen (pink 10.27) và **1.69**
trên `#EFEFEF` (pink 1.78).

Vật liệu quả cầu Earth **cố ý KHÁC**: giữ `#D4AF37` để còn chất kim loại/kintsugi. Đừng
đồng bộ hai giá trị này.

**MỘT gold duy nhất cho mọi theme** — `--primary` không lật màu nữa, y như lenis chỉ có một
`#FF98A2` và KHÔNG có bản đậm. Gold đọc được không phải nhờ đổi sắc độ mà nhờ **giới hạn chỗ
được dùng** (xem "Giấy phép dùng gold"). Chữ nằm TRÊN nền gold luôn là **đen cứng**
(`var(--color-black)`, 10.79:1) — không lấy `--theme-primary`.

> Không màu nào nổi tốt trên CẢ `#000` lẫn `#EFEFEF`: giới hạn cân bằng tối đa là **4.27:1**,
> vẫn dưới ngưỡng AA 4.5. Nên bài toán chỉ giải được bằng vai trò, không bằng sắc độ.

## Theme (bộ ba, kiểu lenis)

Đúng **ba** token, không hơn: `--theme-primary` (nền), `--theme-secondary` (chữ),
`--theme-contrast` (nhấn) — bằng đúng bộ của lenis.

| Theme             | primary (nền) | secondary (chữ) | contrast (nhấn) |
| ----------------- | ------------- | --------------- | --------------- |
| `dark` (mặc định) | black         | white           | gold            |
| `light`           | white         | black           | gold            |
| `contrast`        | gold          | black           | white           |

Showcase: đặt `data-theme` trên `.showcase-root`. Selection: nền contrast, chữ **đen cứng**
(không phải primary — lenis sai đúng chỗ này ở `global.scss:64`).

## Giấy phép dùng gold

Gold được phép ở đâu, và ở đâu thì không:

| Vai trò                                                                         | Nền sáng | Cụ thể                                                             |
| ------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------ |
| **NỀN** (kèm chữ **đen cứng** bên trên)                                         | ✅       | nút, chip locale đang bật, tấm hover ListItem, `::selection`       |
| **VIỀN / GẠCH 1–4px**, gạch chân, thanh cuộn, vòng con trỏ, chấm timeline       | ✅       | chrome không mang thông tin                                        |
| **CHỮ TRÌNH BÀY** ≥56px comp mobile / ≥64px comp desktop                        | ✅       | `.h1`, `.h2`, `.p-l`, số 01–09 của Card, wordmark FELIX            |
| **CHỮ NHỎ** — `.h3` trở xuống, `.p`, `.p-s`, `.p-xs`, mọi `text-*` của Tailwind | ❌       | thừa kế `--theme-secondary` / `text-foreground`; dark dùng `dark:` |

Dark theme được nới: trên nền đen gold đạt 10.79:1 nên chữ nhỏ **vẫn** được là gold, khai
bằng biến thể `dark:` (`h3 dark:text-primary`, `p-s hover:underline dark:text-primary`).
Light thì **đổi tín hiệu chứ không bỏ tín hiệu**: chữ về đen, gold chuyển thành **gạch** —
`hover:underline`, `border-b-2 border-primary` (nav ngang), `border-l-2 border-primary`
(nav dọc), `hover:border-primary` (hàng list/card).

Ngưỡng tính theo **px trên comp**, không phải px render. Mọi class đều tụt cỡ quanh mốc
800px do scale theo vw (`.h3` render 42.6px ở 799px nhưng chỉ 28.9px ở 800px) — lenis cũng
vậy. **Đừng chặn gold bằng media query**: nó sẽ bôi gold vào đúng cỡ chữ nhỏ hơn.

Ngoại lệ đã cân nhắc (chrome trang trí, chấp nhận 1.69:1 ở light — cùng loại với thanh cuộn
1.78:1 của lenis): dấu `·` phân cách marquee, chấm timeline ở `/resume`, vòng con trỏ, thanh
cuộn showcase, vạch scroll-hint, và **dòng vai trò hero** (`.h3`, đi cặp với wordmark 160px
ngay trên nó).

Ngoài DOM còn `--mdx-accent`: chữ/icon nhỏ của `@portfolio/mdx` (nút copy, token cú pháp
Sandpack) đi qua biến này thay vì `--color-primary`, light → `--foreground`, dark →
`--primary`. `apps/2025` không khai nên rơi về `--color-primary` của nó, không đổi gì.

## Typography

Font: **Anton** (heading lớn — h1/h2, uppercase), **Space Grotesk** (h3/h4 kỹ thuật,
uppercase; thay Panchang vì Panchang không có glyph tiếng Việt), **Roboto** (thân bài).
Class toàn cục (mobile → desktop, px trên comp):

| Class   | Font              | Size     | Line-height | Ghi chú                                |
| ------- | ----------------- | -------- | ----------- | -------------------------------------- |
| `.h1`   | Anton             | 56 → 160 | 100%        | uppercase; `.vh` = tính theo chiều cao |
| `.h2`   | Anton             | 56 → 96  | 105%        | uppercase; nới so lenis 90% vì dấu VI  |
| `.h3`   | Space Grotesk 700 | 20 → 52  | 110%        | uppercase                              |
| `.h4`   | Space Grotesk 700 | 20 → 28  | 110%        | uppercase                              |
| `.p-l`  | Roboto 500        | 32 → 64  | 100%        | lead                                   |
| `.p`    | Roboto 500        | 16 → 18  | 125% → 133% | thân bài; `.p.bold` = 900              |
| `.p-s`  | Roboto 900        | 14       | → 114%      | uppercase, label                       |
| `.p-xs` | Roboto 900        | 12       | → 113%      | uppercase, meta                        |

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

Component xếp theo MỐI QUAN TÂM, không theo trang dùng nó:

| Thư mục                | Chứa gì                                                            | Ghi chú                                                                            |
| ---------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `components/brand/`    | FelixHeroMark, Intro                                               | nhận diện thương hiệu; Intro giao tiếp bằng class `html.intro-running`/`intro-out` |
| `components/effects/`  | AppearTitle, Card, HorizontalSlides, ListItem, Marquee, PillButton | hiệu ứng dùng chung, KHÔNG phụ thuộc `.showcase-root`                              |
| `components/scroll/`   | SmoothScroll, Scrollbar                                            | cụm Lenis; Scrollbar phải là hậu duệ của `<ReactLenis root>`                       |
| `components/chrome/`   | SiteNav, SiteMenu, SiteFooter, LocaleSwitcher, ThemeToggle, Cursor | khung site, chạy toàn bộ route                                                     |
| `components/showcase/` | theme.css + các section của `/about`                               | CHỈ chỗ này mới được phụ thuộc `.showcase-root`                                    |

Vì sao hiệu ứng dùng chung được: `globals.css` khai đủ cả năm token `--theme-*` ngay ở `:root`
làm cầu nối, `theme.css` chỉ _ghi đè_ chúng theo `data-theme`. Nên component render ngoài
`.showcase-root` vẫn có màu đúng theo next-themes.

- **FelixHeroMark** — wordmark FELIX (Cloister Black → SVG, viewBox `0 0 1401 368`), fill
  `var(--theme-contrast)`; vị trí khớp intro qua `--wordmark-top/-inset` (30 / 32.5 trên comp 1440).
- **Thanh cuộn gốc** (`app/native-scrollbar.css`, tách khỏi globals vì Lightning CSS cắt
  `scrollbar-*`) — hai luật dễ mất nếu ai đó dọn file này, cả hai đều đã trả giá một vòng vá sai:
  - **KHÔNG được để thanh cuộn biến mất khi khoá.** `lenis.stop()` không khoá bằng JS mà dựa vào
    `.lenis:not(.lenis-autoToggle).lenis-stopped { overflow: clip }` của lenis; `clip` bỏ luôn
    thanh cuộn nên khung nội dung **và viewport của mọi lớp `position: fixed`** rộng thêm bấy
    nhiêu px: đo được canvas 3D nhảy `0,1914 → 0,1920`, r3f vẽ lại cảnh ở tỉ lệ khác → quả cầu
    giật ngang mỗi lượt mở/đóng. Vì thế app **trung hoà** luật đó bằng
    `html.lenis.lenis-stopped:not(.lenis-autoToggle) { overflow: visible }` (specificity 0,3,1 —
    không `!important`, và **không** gỡ class bằng JS vì `updateClassName()` gắn lại). Phần khoá
    thật vẫn còn: lenis `preventDefault()` wheel/touch khi `isStopped`, bàn phím do
    `scroll/scroll-lock.ts` chặn. Bù bằng `padding-right` (bản trước) chỉ cứu nội dung trong
    luồng — KHÔNG cứu lớp fixed; `scrollbar-gutter: stable` cũng vô dụng (Chrome bỏ gutter của
    viewport khi overflow là clip/hidden).
  - Máng cuộn của `/about` theo `.showcase-root[data-theme]` (dark ⇄ light đổi theo cuộn) và luật
    phải đặt trên **`body`**: khi `html` còn `overflow: visible` thì body mới là phần tử truyền
    thanh cuộn cho viewport, bản chỉ có `html:has(…)` **không bao giờ được vẽ**. Đừng tin
    `getComputedStyle(html, '::-webkit-scrollbar-track')` — nó trả màu "đúng" cả khi không hề vẽ;
    kiểm bằng ảnh chụp DPR 4 ở mép phải. Và **đừng** đổi sang tô nền `<html>`: nền body đang được
    propagate lên canvas, cho html một nền là body tự tô nền của nó, mà nền block in-flow vẽ TRÊN
    lớp z-index âm → `.showcase-bg` (z −20) bị phủ và `/about` sáng trưng khi site đang light.
- **Intro** — mount MỘT lần ở `[locale]/layout.tsx`, chạy lại **mỗi lần đổi route** (kể cả điều
  hướng SPA) và kiêm **cổng chờ tải**: chỉ vào pha `intro-out` khi nhịp tối thiểu 1000ms xong
  **và** `brand/page-ready.ts` báo trang đích đủ font + ảnh + cảnh 3D (trần chờ 8s để mạng hỏng
  không nhốt người dùng). Bốn điều dễ vấp:
  - Phủ màn bằng `useLayoutEffect` chứ không `useEffect`: `usePathname()` chỉ đổi SAU khi trang mới
    commit, chờ tới effect là người dùng kịp thấy trang chưa tải xong.
  - Transition khai TRÊN `.out`; bỏ class ra là tấm phủ lại kín ngay, không trượt ngược.
  - Trong lúc chờ, `.loader` (vạch 2px đen chạy qua lại) giữ nhịp — trước đây chỗ này là tấm gold
    trống trơn, mạng chậm đọc ra "treo".
  - Trạng thái cảnh 3D đọc qua `three/scene-ready.ts` (store nhỏ, API theo **id** nên StrictMode
    gọi hai lần vẫn đúng và không phụ thuộc thứ tự effect cha–con) — **không** import
    `useProgress` của drei, làm thế là kéo `three` ra khỏi chunk lazy vào bundle chính.
  - `BackgroundCanvas` ghim `frameloop='never'` khi `intro-running` **và chưa** `intro-out`: canvas
    chạy lại đúng lúc tấm bắt đầu trượt đi nên kịp vẽ khung đầu trước khi trang lộ ra.
- **Lề hero (cả `/` lẫn `/about`)** — trên = dưới = `--wordmark-top`: hàng CTA cách mép dưới đúng
  bằng wordmark cách mép trên (lenis: title `margin-top: 30px`, `.bottom` `padding-bottom: 40px`).
  ĐỪNG cộng thêm `padding-bottom` ở khối dưới — đó chính là lỗi lề gấp đôi đã sửa một lần.
  Trang chủ: chữ + nút dồn cột 1→6, quả cầu Earth chiếm nửa phải (pose riêng `HERO_POSE` trong
  `earth-canvas.tsx`); `/about` ngược lại — cầu trái, CTA cột 9→12.
- **Marquee / ListItem / AppearTitle / Card** — hiệu ứng thuần CSS; ListItem cần `visible`,
  AppearTitle tự reveal bằng IntersectionObserver. (Registry design-sync publish `Card` dưới tên
  `ShowcaseCard` để không đè `Card` của `packages/ui` — tên lịch sử, đừng đổi.)
- **PillButton** — nút chính kiểu lenis: ô icon vuông định chiều cao (48 comp), nhãn nhân đôi tráo
  chỗ khi hover, nền gold + chữ **đen cứng**. Dùng chung cho CTA của `/about` và nút mở menu
  (`iconOnly`). Giữ nguyên mẹo specificity `.btn.btnFilled` — `theme.css` có
  `.showcase-root a { color: inherit }` (0,1,1) sẽ đè một class đơn.
- **SiteNav** — KHÔNG còn là `<header>`: chỉ một `PillButton` nổi `position: fixed` ở góc
  **phải-dưới** (`bottom: var(--wordmark-top); right: var(--wordmark-inset)` — cùng cặp token với
  hero thì mới thẳng hàng với nút CTA), z 60, không nền / không viền / không chiếm chỗ trong luồng.
  Mount ở `[locale]/layout.tsx` nên chạy trên **mọi** route, kể cả `(showcase)/about`. Ẩn trong lúc
  intro qua `html.intro-running:not(.intro-out)`. Vì nút không chiếm chỗ: `(main)/layout.tsx` khai
  `--main-top` cho `<main>` (hero trang chủ huỷ lại đúng biến đó để chữ FELIX vẫn chồng khít tấm
  intro), desktop né NGANG bằng `padding-right` của `.heroCta`, mobile né XUỐNG bằng class
  `.menu-button-reserve` (globals.css).
- **SiteMenu** — tấm phủ trọn viewport (z 40, dưới nút), trượt xuống 800ms `--ease-out-expo`. Nửa
  trái: bốn ảnh gallery hai cột lệch tầng, tràn mép, lộ dần bằng `clip-path`. Nửa phải: khối chữ
  **căn giữa** cả hai chiều + socials/công tắc bên dưới. Bốn điểm dễ vấp nếu sửa lại:
  - Tấm **LUÔN nền đen** bất kể theme của site — class toàn cục `dark` gắn ngay trên thẻ overlay
    (`globals.css` khai `.dark { --background… }` cho bất kỳ phần tử nào, và `@custom-variant dark
(&:is(.dark *))` kéo theo cả `dark:` của các control bên trong). Nhờ đó gold luôn 10.79:1.
  - Cỡ chữ link **44 comp** — chọn theo ràng buộc chiều cao (7 mục hiện đủ, không cuộn, kể cả
    1920×950). Dưới ngưỡng 56/64 comp của giấy phép gold nhưng hợp lệ **chỉ vì** tấm luôn tối; đổi
    nền tấm là phải xét lại cỡ chữ.
  - Hover cuộn **từng ký tự**, so le TRÁI → PHẢI (`delay = i × 45ms`, mỗi ký tự 800ms). Bản dự bị
    đặt ở `translateY(120%)` chứ không phải 100%, và `line-height: 1.35` cho mỗi bản: dấu tiếng
    Việt nhô ra ngoài hộp ký tự sẽ thò lên mép mặt nạ thành vệt gold lấm tấm lúc nghỉ. Vì lý do
    dấu đó, dòng link **không** dùng mặt nạ `overflow: hidden` như ListItem/AppearTitle — lượt vào
    là trồi + mờ dần.
  - Trang đang xem render bằng `<span>` (không phải `<Link>`) + gạch ngang gold: `aria-disabled`
    trên thẻ `<a>` chỉ nói với trình đọc màn hình, chuột và bàn phím vẫn điều hướng như thường.

## Cấm kỵ

- Không px tĩnh cho kích thước/spacing (trừ border 1–4px).
- Không cubic-bezier viết tay — dùng token.
- Không trắng `#fff` thuần — luôn `--color-white` (#EFEFEF).
- Không gold làm chữ NHỎ (`.h3` trở xuống) trên nền sáng — 1.69:1. Đổi tín hiệu sang gạch
  gold (`underline` / `border-*-primary`) và để chữ thừa kế màu foreground.
- Không đặt `--theme-primary` làm màu chữ trên nền gold — dùng `var(--color-black)`.
- **Không thêm biến thể gold thứ hai.** Một gold. Chỗ nào không đọc được thì đổi **vai trò**
  của gold, không đổi màu gold.
- Không gọi màu palette trực tiếp trong component showcase — đi qua `--theme-*`.
- Không khai token màu ở `packages/ui` — nguồn sự thật duy nhất là `src/app/globals.css` của
  app này (`packages/ui/components.json` đã trỏ thẳng vào đó cho shadcn CLI).
