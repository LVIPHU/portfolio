# Phase C9: motion → GSAP — Context

**Thu thập:** 2026-07-11
**Trạng thái:** Sẵn sàng lập plan

<domain>
## Ranh giới phase

Thay toàn bộ framer-motion/motion (12.x) trong `apps/2025` bằng GSAP 3.15 + `@gsap/react` (free 100% kể cả ScrollTrigger/Flip/Inertia từ 2024): 9 file dùng motion port sang GSAP hoặc CSS thuần; primitive tái dùng đặt ở `packages/ui/src/motion/`; gỡ `framer-motion` + `motion` + `@emotion/is-prop-valid` một lần cuối phase. **Giữ cảm giác animation hiện tại — không redesign.** KHÔNG thuộc phase: hiệu ứng mới cho 2026 (chỉ nhận primitives), React Compiler (C10).
</domain>

<decisions>
## Quyết định đã khóa

### Nền tảng

- **D-01:** `gsap@^3.15` + `@gsap/react` vào **dependencies** của packages/ui (không peer — version GSAP do package quyết, app không cần biết).
- **D-02:** Mọi chỗ port theo khuôn `useGSAP({ scope })` (mẫu M-01) — tự revert tween + kill ScrollTrigger khi unmount, an toàn StrictMode; `gsap.registerPlugin` gọi ở module scope từng file motion (idempotent); mọi file motion là `'use client'`.
- **D-03:** CSS-first: hiệu ứng đủ đơn giản hạ xuống CSS thuần, 0 JS — theme-switch (icon xoay/fade transition), grid/list-view (fade-in stagger bằng `animation-delay: calc(var(--i)*40ms)`).
- **D-04:** BỎ exit animation của grid/list-view (AnimatePresence) — không đáng 1 dependency; quyết định có chủ đích từ master plan.
- **D-05:** Pointer-follow hot-path dùng `gsap.quickTo` (tween tái sử dụng, không alloc mỗi event) — link-preview, floating-dock.
- **D-06:** Giữ framer-motion trong deps đến khi CẢ 9 file xong; gỡ `framer-motion` + `motion` + `@emotion/is-prop-valid` MỘT LẦN ở plan cuối. Quy tắc trung gian: port xong file nào xóa import motion file đó.
- **D-07:** floating-dock khó nhất — làm CUỐI CÙNG; nav indicator dùng đo-rect + `gsap.to({x,width})` thay `layoutId`; Flip plugin chỉ là dự phòng nếu thiếu mượt.
- **D-08:** User nghiệm thu bằng mắt trước khi đóng phase; nếu cảm giác spring khác quá, thử `ease: 'elastic.out(1, 0.5)'` hoặc InertiaPlugin (đã free) trước khi bàn lại.

### Phân bố primitive vs instance

- **D-09:** `packages/ui/src/motion/`: `reveal.tsx` (thay animated-content), `use-magnify.ts` (logic dock), `parallax-columns.tsx`, `scroll-progress.ts` (timeline beam), `hover-highlight.tsx`. Hiệu ứng đặc thù app Ở LẠI app (theme-switch CSS, link-preview, grid/list-view).
- **D-10:** Thay `motion/index.ts` placeholder `export {}` của packages/ui bằng barrel thật.

### Claude tự quyết

- Số liệu duration/ease từng tween khi bản motion cũ không đo được chính xác — miễn cảm giác tương đương, user duyệt cuối.
- Dùng `ScrollTrigger.batch()` cho Reveal hàng loạt trang photos hay không (quyết khi đo thực tế).
</decisions>

<specifics>
## Ý tưởng & mẫu cụ thể

**M-01 — Khuôn useGSAP chuẩn (mọi chỗ port đi theo):**

```tsx
'use client'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Reveal({ children, y = 24, once = true }: RevealProps) {
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
  )
  return <div ref={scope}>{children}</div>
}
```

**M-02 — Bảng port 9 file (thứ tự dễ → khó):**

| #   | File                                | Cách port                                                                                                                                                                                                                                                                                 |
| --- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `theme-switch.tsx`                  | CSS thuần: transition transform/opacity + data-attr. 0 JS. (D-03)                                                                                                                                                                                                                         |
| 2   | `grid-view.tsx` / `list-view.tsx`   | CSS `@keyframes fade-in-up` + `animation-delay: calc(var(--i)*40ms)` (set `--i` inline). Bỏ exit (D-04).                                                                                                                                                                                  |
| 3   | `animated-content.tsx` → `<Reveal>` | Khuôn M-01; xóa IntersectionObserver thủ công (ScrollTrigger `once` thay). Call site grep AnimatedContent toàn app đổi prop theo API mới.                                                                                                                                                 |
| 4   | `timeline.tsx`                      | 1 tween `scaleY 0→1`, `transformOrigin: 'top'`, `scrollTrigger: { scrub: true }` — thay useScroll+useSpring. Dùng `scroll-progress.ts`.                                                                                                                                                   |
| 5   | `parallax-scroll.tsx`               | 3 cột: mỗi cột tween `yPercent` dấu xen kẽ, `scrollTrigger scrub` — thay useTransform(scrollYProgress). Dùng `parallax-columns.tsx`.                                                                                                                                                      |
| 6   | `hover-effect.tsx`                  | 1 div highlight absolute; mouseenter card → đo `getBoundingClientRect` → `gsap.to(highlight, {x,y,width,height,duration:.25})`. Dùng `hover-highlight.tsx`.                                                                                                                               |
| 7   | `link-preview.tsx`                  | `quickTo(el,'x'/'y')` trong useGSAP, gọi trong onPointerMove (D-05); enter/exit fromTo + state closing + onComplete unmount (thay AnimatePresence). Ở lại app.                                                                                                                            |
| 8   | `floating-dock.tsx` (CUỐI, D-07)    | Mỗi icon quickTo width/height; pointermove tính khoảng cách con trỏ→tâm icon, `gsap.utils.mapRange(-150,150,40,80)` (số đọc từ bản motion hiện tại) → quickTo. Indicator: đo rect tab đích + gsap.to({x,width}). Tooltip CSS. whileTap → `:active { scale: .95 }`. Dùng `use-magnify.ts`. |

**M-03 — Leak check ScrollTrigger (gate plan 04):** chuyển trang qua lại ≥10 lần giữa các trang có ScrollTrigger, chạy `ScrollTrigger.getAll().length` trong console — số không tăng dần.
</specifics>

<canonical_refs>

## Tài liệu gốc phải đọc

- `docs/plans/ROADMAP.md` §Phase C9 — goal, REQ-04/REQ-10, 3 success criteria
- 9 file nguồn port (danh sách code_context) — đọc TỪNG file trước khi port để lấy số liệu spring/duration hiện tại
- `packages/ui/src/motion/index.ts` — placeholder sẽ thay (D-10)
- Docs GSAP: useGSAP (gsap.com/resources/React), ScrollTrigger, quickTo — tra khi cần API chính xác
  </canonical_refs>

<code_context>

## Hiện trạng codebase (facts đã xác minh)

### 9 file dùng framer-motion/motion trong apps/2025/src (grep chốt)

`molecules/hover-effect.tsx`, `molecules/floating-dock.tsx`, `atoms/timeline.tsx`, `organisms/list-view.tsx`, `organisms/grid-view.tsx`, `molecules/theme-switch.tsx`, `molecules/parallax-scroll.tsx`, `atoms/link-preview.tsx`, `atoms/animated-content.tsx`.

### Deps liên quan (apps/2025/package.json)

`framer-motion ^12.6.3`, `motion ^12.6.3`, `@emotion/is-prop-valid ^1.3.1` (helper của framer). 2026: KHÔNG dùng motion — chỉ nhận primitives mới qua packages/ui.

### Bundle math (tham khảo, ghi số thật vào SUMMARY)

− framer-motion/motion/emotion ~40KB gz; + gsap core ~23KB + ScrollTrigger ~12KB nhưng chỉ ở route dùng (motion/ import per-file, tree-shake theo trang).

### Điểm tích hợp

- Sau C8, timeline.tsx/link-preview.tsx/animated-content.tsx vẫn nằm trong atoms 2025 (nhóm D-12 của C8) — port tại chỗ, riêng animated-content bị thay bằng Reveal từ packages/ui.
- ScrollTrigger + App Router: nếu vị trí trigger lệch sau route change → `ScrollTrigger.refresh()` chỉ thêm khi tái hiện được (không thêm mù).
  </code_context>

<deferred>
## Ý tưởng hoãn

- InertiaPlugin cho dock nếu user chê cảm giác — chỉ sau nghiệm thu D-08
- 2026 dùng Reveal/parallax cho trang mới — backlog sau phase
- Xóa xác file animation mồ côi còn lại (fade-content.tsx) — Phase C12
- Đo 60fps bằng devtools performance chi tiết — chỉ khi user thấy giật
</deferred>

---

_Phase: C09-gsap-migration_
