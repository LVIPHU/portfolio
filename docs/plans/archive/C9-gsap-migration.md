# C9 — framer-motion/motion → GSAP 3.15 (@gsap/react), primitives trong packages/ui

> **Phụ thuộc:** C8 (atoms đã ổn định vị trí). **Chặn:** C10 (React Compiler nên chạy sau khi hết framer-motion để tránh nhiễu chẩn đoán).
> **Ước lượng:** ~4–6h. **Commit:** `feat!: migrate framer-motion to gsap across apps + shared motion primitives`.
> Phase animation — **user nghiệm thu bằng mắt trước khi đóng**.

## 1. Mục tiêu & phạm vi

Thay toàn bộ framer-motion (12.x, ~34KB gz + emotion helper) bằng GSAP 3.15 (free 100% kể cả ScrollTrigger/Flip từ 2024). Primitive tái sử dụng đặt ở `packages/ui/src/motion/`; hiệu ứng đặc thù app ở lại app. Giữ **cảm giác** animation hiện tại — không redesign.

## 2. Hiện trạng (facts — 9 file dùng motion trong apps/2025)

`hover-effect.tsx`, `floating-dock.tsx`, `timeline.tsx`, `list-view.tsx`, `grid-view.tsx`, `theme-switch.tsx`, `parallax-scroll.tsx`, `link-preview.tsx`, `animated-content.tsx`. Deps liên quan: `framer-motion`, `motion`, `@emotion/is-prop-valid`. 2026 chưa dùng motion — chỉ nhận primitives mới.

## 3. Cấu trúc file đích

```
packages/ui/
├── package.json                   # + gsap@^3.15, @gsap/react (dependencies)
└── src/motion/
    ├── index.ts                   # barrel (thay placeholder export {})
    ├── reveal.tsx                  # <Reveal> — thay animated-content (scroll-in một lần)
    ├── use-magnify.ts              # logic dock magnify (quickTo + mapRange) — hook thuần
    ├── parallax-columns.tsx        # thay parallax-scroll core (ScrollTrigger scrub)
    ├── scroll-progress.ts          # tween theo tiến độ scroll (timeline beam dùng)
    └── hover-highlight.tsx         # thay hover-effect (1 div highlight đo rect)

apps/2025/src/components/
├── atoms/animated-content.tsx      # XÓA — call site đổi sang <Reveal>
├── atoms/timeline.tsx              # SỬA: dùng scroll-progress
├── atoms/link-preview.tsx          # SỬA: quickTo pointer-follow (đặc thù — ở lại app)
├── molecules/{parallax-scroll,hover-effect}.tsx  # SỬA: bọc primitive từ ui
├── molecules/floating-dock.tsx     # SỬA: use-magnify (làm CUỐI)
├── molecules/theme-switch.tsx      # SỬA: bỏ motion → CSS transition thuần
└── organisms/{grid,list}-view.tsx  # SỬA: bỏ motion → CSS fade-in, bỏ exit animation
```

## 4. Hướng code chi tiết

### 4.1 Nền tảng: quy tắc dùng `useGSAP`

Mọi chỗ port đều theo 1 khuôn (đây là lý do không cần cleanup tay):

```tsx
'use client'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger, useGSAP)

function Reveal({ children, y = 24, once = true }: RevealProps) {
  const scope = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      gsap.from(scope.current, {
        y,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: scope.current, start: 'top 85%', once },
      })
    },
    { scope }
  ) // useGSAP tự revert tween + kill ScrollTrigger khi unmount
  return <div ref={scope}>{children}</div>
}
```

`registerPlugin` gọi ở module scope từng file motion (idempotent). Tất cả file trong `motion/` là `'use client'`.

### 4.2 Bảng port từng file (thứ tự thực hiện — dễ trước khó sau)

| #   | File                                      | Cách port                                                                                                                                                                                                                                                                                                                                    |
| --- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `theme-switch.tsx`                        | Bỏ motion hẳn: icon xoay/fade bằng CSS `transition transform/opacity` + data-attr. 0 JS animation.                                                                                                                                                                                                                                           |
| 2   | `grid-view.tsx` / `list-view.tsx`         | Bỏ `AnimatePresence` + stagger enter: CSS `@keyframes fade-in-up` + `animation-delay: calc(var(--i)*40ms)` (set `--i` inline). **Bỏ exit animation** (đã quyết — không đáng 1 dependency).                                                                                                                                                   |
| 3   | `animated-content.tsx` → `<Reveal>`       | Như khuôn 4.1; xóa IntersectionObserver thủ công (ScrollTrigger `once` thay). Call site đổi prop theo API mới (grep `AnimatedContent` toàn app).                                                                                                                                                                                             |
| 4   | `timeline.tsx`                            | 1 tween `scaleY: 0→1`, `transformOrigin: 'top'`, `scrollTrigger: { scrub: true, start/end theo container }` — thay `useScroll`+`useSpring`.                                                                                                                                                                                                  |
| 5   | `parallax-scroll.tsx`                     | 3 cột ảnh: mỗi cột 1 tween `yPercent` (dấu xen kẽ ±) với `scrollTrigger: { trigger: container, scrub: true }` — thay `useTransform(scrollYProgress)`.                                                                                                                                                                                        |
| 6   | `hover-effect.tsx`                        | 1 div highlight absolute; `onMouseEnter` card → đo `getBoundingClientRect` → `gsap.to(highlight, { x, y, width, height, duration: 0.25 })`. Flip plugin là dự phòng nếu cần morph mượt hơn.                                                                                                                                                  |
| 7   | `link-preview.tsx`                        | Follow chuột: `const xTo = gsap.quickTo(el, 'x', {duration: 0.3, ease: 'power3'})` trong useGSAP, gọi trong `onPointerMove`. Enter/exit: `fromTo` opacity/scale; exit = state `closing` + `onComplete` unmount (thay AnimatePresence).                                                                                                       |
| 8   | `floating-dock.tsx` (**khó nhất — cuối**) | Mỗi icon: `quickTo` cho width/height; `onPointerMove` trên dock tính khoảng cách con trỏ→tâm icon, `gsap.utils.mapRange(-150, 150, 40, 80)` (số lấy từ bản motion hiện tại) → gọi quickTo. Nav indicator active: đo rect tab đích + `gsap.to(indicator, {x, width})` — thay `layoutId`. Tooltip: CSS. `whileTap` → `:active { scale: .95 }`. |

### 4.3 Gỡ dependency (1 lần, sau khi đủ 9 file)

`pnpm --filter web-2025 remove framer-motion motion @emotion/is-prop-valid`; grep `framer-motion\|from 'motion` = 0 toàn repo. packages/ui thêm `gsap`, `@gsap/react` **dependencies** (không peer — version GSAP do package quyết, 2 app không cần biết).

## 5. Design pattern áp dụng

- **Primitive vs. instance**: `motion/` chỉ chứa hành vi tái sử dụng (Reveal, magnify, parallax, highlight); component app bọc primitive + style riêng — 2026 sau này dùng cùng primitive với skin khác.
- **Scoped side-effects**: mọi tween sống trong `useGSAP({ scope })` — React StrictMode double-invoke an toàn (auto revert), không leak ScrollTrigger khi route change.
- **CSS-first**: hiệu ứng đủ đơn giản (theme-switch, fade-in list) hạ xuống CSS — JS animation chỉ nơi cần tương tác/scroll thật.
- **quickTo cho hot-path**: pointer-follow (dock, link-preview) dùng `quickTo` (tween tái sử dụng, không alloc mỗi event) thay vì `gsap.to` trong handler.

## 6. Tối ưu

- Bundle: −framer-motion/motion/emotion (~40KB gz) ; +gsap core (~23KB gz) + ScrollTrigger (~12KB) **chỉ ở route dùng** — motion/ import per-file nên tree-shake theo trang. Đo first-load JS home + photos trước/sau.
- `will-change`/`force3D`: GSAP tự set transform 3D; không thêm tay.
- ScrollTrigger nhiều instance (list dài): dùng `batch()` nếu Reveal áp cho >20 phần tử một trang (photos) — quyết khi đo thực tế.

## 7. Testing & gate nghiệm thu

1. `grep -rn "framer-motion\|from 'motion'\|@emotion" apps packages` = 0; typecheck + build cả 2 xanh.
2. Smoke `:3001` từng hiệu ứng theo bảng 4.2:
   - Dock: magnify mượt theo con trỏ (60fps — kiểm devtools performance nhanh), indicator trượt giữa tab, tooltip, tap scale.
   - Photos: parallax 3 cột lệch pha khi scroll, không giật.
   - About/timeline: beam vẽ theo scroll (scrub), đúng chiều.
   - Blog grid/list: fade-in stagger khi đổi view; **không lỗi console khi unmount** (chuyển trang nhanh nhiều lần — bắt leak ScrollTrigger).
   - Link-preview: ảnh follow chuột, exit không khựng. Hover-effect: highlight bám card.
   - Theme-switch: icon chuyển mượt bằng CSS.
3. Chuyển trang qua lại ≥10 lần giữa các trang có ScrollTrigger → `ScrollTrigger.getAll().length` trong console không tăng dần (leak check).
4. **User nghiệm thu bằng mắt** (đặc biệt dock — cảm giác spring khác GSAP ease; nếu user chê, thử `ease: 'elastic.out(1, 0.5)'` hoặc plugin `InertiaPlugin` giờ đã free).
5. Push → 2 deploy xanh.

## 8. Rủi ro & rollback

| Rủi ro                                                     | Phòng bị                                                                                                       |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Cảm giác spring khác (motion spring vs GSAP ease)          | port từng file, so cạnh bản cũ (git stash pop từng phần); elastic/expo ease map gần đúng; user duyệt cuối      |
| ScrollTrigger + Next App Router (bfcache, scroll restore)  | useGSAP cleanup + `ScrollTrigger.refresh()` sau route change nếu thấy lệch vị trí — chỉ thêm khi tái hiện được |
| layoutId (FLIP giữa 2 element) không có bản GSAP trực tiếp | dock indicator dùng đo-rect (đủ); nếu thiếu mượt → Flip plugin (free)                                          |
| Giữ 2 lib song song quá lâu gây lẫn import                 | quy tắc: port xong file nào xóa import motion file đó; gỡ deps 1 lần cuối phase                                |

Rollback: revert commit — framer-motion quay lại nguyên vẹn (không đổi markup ngoài file được port).
