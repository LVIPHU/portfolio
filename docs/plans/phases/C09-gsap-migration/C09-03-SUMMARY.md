---
phase: C09-gsap-migration
plan: 03
subsystem: motion-pointer
tags: [gsap, quickto, hover-highlight, base-ui-transition]
provides:
  - HoverHighlight primitive (packages/ui/src/motion) — highlight bám item hover bằng gsap.to đo rect
  - hover-effect + link-preview sạch framer; 8/9 file xong, chỉ còn floating-dock
key-decisions:
  - 'HoverHighlight thay framer layoutId shared-layout: 1 span highlight duy nhất trong container relative, onMouseOver (event delegation) tìm [data-hover-item] gần nhất → gsap.to {x,y,width,height,opacity} đo getBoundingClientRect tương đối container; onMouseLeave fade opacity 0. contextSafe (useGSAP) để tween tự dọn. hover-effect giữ nguyên markup, thêm data-hover-item + highlightClassName.'
  - 'link-preview follow chuột: gsap.quickTo(followRef, x) tạo LAZY 1 lần mỗi phiên hover (D-05 — không alloc mỗi event), reset xTo=null trong onOpenChange khi đóng (followRef remount theo Popup). currentTarget (Trigger) thay target để đo rect ổn định.'
  - 'DEVIATION plan (M-02 #7 exit): thay vì tự dựng state closing + onComplete unmount, để Base UI PreviewCard quản mount + CSS transition data-[starting-style]/data-[ending-style] (scale-90 + opacity-0) lo enter/exit. Base UI đợi transition xong mới unmount → mượt, ít state, ít bug hơn. Cảm giác pop+fade tương đương framer initial/animate/exit.'
  - 'gsap + @gsap/react thành dependency trực tiếp của web-2025 (link-preview dùng primitive GSAP trực tiếp ở tầng app — như @base-ui). Không vi phạm tinh thần D-01 (primitive CHUNG vẫn để app khỏi biết version; đây là component đặc thù app D-09).'
status: complete
completed: 2026-07-12
---

# C09-03 — Summary

## Primitive

`hover-highlight.tsx` (HoverHighlight) — highlight bám item hover bằng gsap.to đo rect, contextSafe cleanup. Thay framer `layoutId`.

## App

- `hover-effect.tsx`: bọc HoverHighlight, giữ markup card + Reveal; `data-hover-item` mỗi wrapper; highlightClassName `rounded-2xl bg-neutral-200 dark:bg-slate-800/[0.8]`.
- `link-preview.tsx`: quickTo follow (D-05) + Base UI/CSS enter-exit (bỏ AnimatePresence + useMotionValue/useSpring). gsap/@gsap/react vào web-2025 deps.

## Self-test (:3001)

- /projects: hover card thật → highlight snap đúng rect (opacity 1, matrix vị trí card, 487×370px) ✅.
- devIssues 0/none sau fresh load ✅.

## Còn lại (plan 04)

`floating-dock.tsx` (magnify — khó nhất, D-07) + gỡ `framer-motion` + `motion` + `@emotion/is-prop-valid` + leak-check ScrollTrigger (M-03) + user duyệt mắt (D-08).
