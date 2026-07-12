---
phase: C09-gsap-migration
plan: 01
subsystem: motion-groundwork
tags: [gsap, css-first, theme-switch, blog-views]
provides:
  - gsap@3.15 + @gsap/react là dependencies của packages/ui (D-01)
  - motion barrel thật thay placeholder export {}
  - 3 file framer dễ nhất (theme-switch, grid-view, list-view) hạ xuống CSS thuần (D-03/D-04)
key-decisions:
  - 'theme-switch: dải 3 icon translateX theo theme bằng transition-transform + inline style (0 JS animation). Giữ nguyên offset 0/-size/-2size của bản framer → cảm giác y hệt.'
  - 'grid/list-view: bỏ AnimatePresence + AnimatedContent, thay .fade-in-up keyframe + animation-delay calc(var(--i)*40ms) (--i inline theo index). BỎ exit animation (D-04, chủ đích). Keyframe trong app CSS (_animations.css) vì đặc thù app (D-09).'
  - 'Comment-discipline: comment ban đầu chứa literal framer-motion + AnimatedContent làm grep gate C9 fail → viết lại (lib animation cũ / atom scroll-in cũ) để gate về 0.'
status: complete
completed: 2026-07-12
---

# C09-01 — Summary

## Hạ tầng

- `gsap@^3.15` + `@gsap/react` vào packages/ui dependencies (D-01, không peer).
- `motion/index.ts` từ placeholder `export {}` → barrel thật (lấp dần plan 02-04).

## 3 file CSS-first (D-03/D-04)

| File             | Trước                                     | Sau                                            |
| ---------------- | ----------------------------------------- | ---------------------------------------------- |
| theme-switch.tsx | framer motion.div variants                | CSS transition-transform + inline offset, 0 JS |
| grid-view.tsx    | AnimatePresence + AnimatedContent stagger | .fade-in-up + --i, không exit                  |
| list-view.tsx    | AnimatePresence + AnimatedContent stagger | .fade-in-up + --i, không exit                  |

## Gate

- `node -p gsap version` = ^3.15.0; `pnpm --filter @portfolio/ui typecheck` = 0.
- 3 file: 0 ref framer/motion; `pnpm build --filter=web-2025` xanh 34.9s; `web-2026` xanh 21s (không hồi quy).

## Nợ chuyển tiếp

Plan 02: Reveal/scroll-progress/parallax. Plan 03: hover-highlight. Plan 04: link-preview quickTo + floating-dock + gỡ framer-motion/motion/@emotion.
