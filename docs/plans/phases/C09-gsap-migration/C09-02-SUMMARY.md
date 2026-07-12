---
phase: C09-gsap-migration
plan: 02
subsystem: motion-scroll
tags: [gsap, scrolltrigger, reveal, parallax, timeline-beam]
provides:
  - 3 primitive GSAP trong packages/ui/src/motion — Reveal, useScrollProgress, ParallaxColumns (đều khuôn useGSAP scope, M-01)
  - animated-content.tsx XÓA; ~18 call site AnimatedContent → Reveal (9 file); timeline beam + photos parallax chạy ScrollTrigger scrub
key-decisions:
  - 'DEVIATION nhẹ so plan: Reveal đưa vào shim atoms/index.ts (re-export từ @portfolio/ui/motion) thay vì đổi từng call site sang import @portfolio/ui trực tiếp. Lý do: giữ nguyên tắc C8 D-06 (organisms/templates import từ @/components/atoms, churn tối thiểu) + swap AnimatedContent→Reveal chỉ 1 sed. Grep gate AnimatedContent=0 vẫn thỏa.'
  - 'Reveal giữ prop direction/reverse/delay/distance/className (call site dùng thật) + thêm once; lược prop 0 call site dùng (initialOpacity/animateOpacity/scale/threshold/endDuration). Mapping khớp bản cũ: horizontal→x, reverse→dấu âm, delay giây.'
  - 'Timeline beam: bỏ ResizeObserver + height state — beam wrapper top-0 bottom-0 (full), inner scaleY 0→1 origin-top scrub (useScrollProgress start top 10% / end bottom 50%, khớp offset framer cũ).'
  - 'ParallaxColumns: tween y ± xen kẽ theo [data-parallax-col], scrub top bottom→bottom top. Bản framer cũ dùng range [0,20] (chỉ ±10px thực) — biên độ mới amount=60 rõ hơn chút, user duyệt mắt plan 04. ParallaxScroll bỏ forwardRef (0 call site dùng ref).'
  - 'gsap/ScrollTrigger là module-scope (không lên window) — verify qua computed transform + dev badge, không qua window.ScrollTrigger.'
status: complete
completed: 2026-07-12
---

# C09-02 — Summary

## Primitive mới (packages/ui/src/motion)

| File                                   | Thay gì                                       | Cơ chế                                        |
| -------------------------------------- | --------------------------------------------- | --------------------------------------------- |
| reveal.tsx (Reveal)                    | atoms/animated-content                        | gsap.from + ScrollTrigger once, useGSAP scope |
| scroll-progress.ts (useScrollProgress) | framer useScroll/useTransform (timeline beam) | fromTo scaleY 0→1 origin-top, scrub           |
| parallax-columns.tsx (ParallaxColumns) | framer useScroll/useTransform (photos)        | tween y ± xen kẽ, scrub                       |

## App

- `animated-content.tsx` xóa; shim `atoms/index.ts` re-export Reveal từ @portfolio/ui/motion.
- ~18 call site (tags, hover-effect, experience, github-cal, technologies, about, blog, not-found, timeline) `AnimatedContent`→`Reveal`.
- `timeline.tsx`: beam ScrollTrigger scrub (bỏ framer + ResizeObserver).
- `parallax-scroll.tsx`: bọc ParallaxColumns, giữ markup 3 cột + Zoom.

## Self-test (:3001, pane desktop)

- /about: nội dung Reveal hiện khi cuộn; beam timeline scaleY 0→1 (matrix identity ở đáy) ✅.
- /photos: 3 cột `[data-parallax-col]` translateY -5.6 / +5.6 / -5.6 khi cuộn, 55 ảnh ✅.
- Dev badge issues 0/none sau fresh load (module-not-found lúc test là HMR trung gian trước rewrite, đã hết) ✅.

## Còn lại (plan 03/04)

3 file framer: `hover-effect.tsx` (highlight → hover-highlight primitive, plan 03), `link-preview.tsx` (quickTo, plan 04), `floating-dock.tsx` (magnify, plan 04). Gỡ framer-motion/motion/@emotion ở plan 04.
