---
phase: C09-gsap-migration
plan: 04
subsystem: motion-dock
tags: [gsap, quickto, magnify, framer-removed]
provides:
  - useMagnify primitive (packages/ui/src/motion) — dock magnify bằng gsap.quickTo per-icon
  - floating-dock sạch framer; 9/9 file port xong; framer-motion + motion + @emotion/is-prop-valid GỠ khỏi web-2025
  - SC1 đạt — grep framer-motion|from 'motion' toàn apps + packages = 0
key-decisions:
  - 'useMagnify: mỗi icon 1 cặp quickTo width/height (+ icon con) tạo 1 lần trong useGSAP (D-05); pointermove chỉ gọi setter. Khoảng cách tính theo TÂM NGHỈ icon, đo lại ở onMouseEnter (robust hơn boundsRef-1-lần của framer: dock ẩn dưới md lúc mount cho rect=0). Số giữ đúng bản cũ: radius 150, size 40↔80, icon 20↔40; ease power2.out duration 0.2 (spring cũ mass .1/stiff 150/damp 12 — snappy tương đương).'
  - 'DEVIATION D-07 (indicator sliding): dock NÀY không có layoutId indicator trượt — chỉ dot tĩnh dưới tab active (IndicatorDesktop/Mobile). layoutId duy nhất là panel mobile mở → thay bằng .fade-in-up stagger CSS (bỏ AnimatePresence exit, như D-04). Không cần đo-rect + gsap.to indicator.'
  - 'tooltip → CSS group-hover/dock (opacity+translate transition); whileTap/onTap jump → CSS active:scale-95 (bỏ controls.start y-50 phức tạp, giữ cảm giác nhấn).'
  - 'D-06: gỡ framer-motion + motion + @emotion/is-prop-valid MỘT LẦN cuối phase. 9/9 file đã port trước đó.'
status: complete — 9/9; PHASE C9 chờ user duyệt mắt (D-08) trước merge
completed: 2026-07-12
---

# C09-04 — Summary (đóng thi công C9)

## 3 Success Criteria (ROADMAP)

1. ✅ SC1: `grep -rn "framer-motion\|from 'motion'" apps packages` = 0; 3 gói (framer-motion, motion, @emotion/is-prop-valid) gỡ khỏi web-2025.
2. ✅ SC2: leak check — 10 lần chuyển trang SPA qua trang có ScrollTrigger, 0 error tích lũy; beam /about vẫn scrub đúng (scaleY 0.95 ở đáy) sau churn → useGSAP scope cleanup lo được (ScrollTrigger module-scope, không lên window nên verify qua hành vi + dev badge, không qua getAll()).
3. ⏳ SC3 (D-08): chờ user duyệt mắt — desktop dock magnify KHÔNG test được trong pane hẹp (dock ẩn dưới md), cần mắt user trên desktop thật.

## use-magnify + floating-dock

- `useMagnify` (packages/ui/src/motion): quickTo per-icon, remeasure tâm on mouseenter.
- `floating-dock.tsx`: magnify qua useMagnify, tooltip/tap CSS, panel mobile fade-in stagger; bỏ hết framer.

## 9/9 file port xong

theme-switch, grid-view, list-view (CSS, plan 01); animated-content→Reveal, timeline, parallax-scroll (plan 02); hover-effect, link-preview (plan 03); floating-dock (plan 04).

## Self-test (:3001, pane ~534px)

- Mobile dock: mở → 15 item `.fade-in-up` stagger ✅.
- Timeline beam: scaleY 0.95 ở đáy sau 10-nav churn ✅ (không leak).
- Reveal/parallax/hover-highlight: đã xác nhận plan 02/03.
- devIssues 0/none suốt.
- Desktop dock magnify: chỉ verify build + logic (pane hẹp không render md); user duyệt trên desktop.

## Nợ

- Nếu user chê spring dock: thử `ease: elastic.out(1, 0.5)` hoặc InertiaPlugin (free) — D-08, không đổi thiết kế.
- fade-content.tsx mồ côi (không dùng) → xóa ở C12.
- Đo first-load JS trước/sau (bundle) → deferred, không gate.
