---
phase: C09-gsap-migration
plan: 02
type: execute
wave: 2
depends_on: [C09-01]
files_modified:
  - packages/ui/src/motion/reveal.tsx
  - packages/ui/src/motion/scroll-progress.ts
  - packages/ui/src/motion/parallax-columns.tsx
  - packages/ui/src/motion/index.ts
  - apps/2025/src/components/atoms/animated-content.tsx # XÓA, call site → Reveal
  - apps/2025/src/components/atoms/timeline.tsx
  - apps/2025/src/components/molecules/parallax-scroll.tsx
autonomous: true
requirements: [REQ-04, REQ-10]
must_haves:
  truths:
    - 'Reveal/scroll-progress/parallax-columns sống trong packages/ui/src/motion, dùng khuôn useGSAP scope'
    - 'animated-content.tsx đã xóa; timeline beam + photos parallax chạy bằng ScrollTrigger scrub'
  artifacts:
    - '3 primitive mới + barrel cập nhật'
  key_links:
    - 'Call site AnimatedContent toàn app đã đổi sang Reveal không sót (grep = 0)'
---

<objective>
Port nhóm scroll-driven (bảng M-02 #3, #4, #5): Reveal primitive thay animated-content, timeline beam, parallax 3 cột — tất cả trên khuôn M-01 (D-02).
</objective>

<context>
@docs/plans/phases/C09-gsap-migration/C09-CONTEXT.md
@apps/2025/src/components/atoms/animated-content.tsx
@apps/2025/src/components/atoms/timeline.tsx
@apps/2025/src/components/molecules/parallax-scroll.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Reveal primitive thay animated-content</name>
  <files>packages/ui/src/motion/reveal.tsx, packages/ui/src/motion/index.ts, apps/2025/src/components/atoms/animated-content.tsx</files>
  <action>Đọc animated-content.tsx lấy prop surface hiện tại (distance/direction/reverse/initialOpacity/scale/threshold/delay...). Viết reveal.tsx trong packages/ui theo đúng khuôn M-01 + D-02 ('use client', useGSAP scope, gsap.from + scrollTrigger once) — map prop cũ sang API mới gọn hơn (y, once, delay; các prop ít dùng lược nếu 0 call site dùng — grep trước, ghi SUMMARY). Xóa IntersectionObserver thủ công (ScrollTrigger thay — bảng M-02 #3). grep -rn "AnimatedContent" apps/2025/src → đổi từng call site sang Reveal import từ @portfolio/ui, rồi XÓA atoms/animated-content.tsx + entry trong atoms/index.ts shim.</action>
  <verify>grep -rn "AnimatedContent\|animated-content" apps/2025/src | wc -l = 0; pnpm build --filter=web-2025 thoát 0</verify>
  <done>Reveal là đường duy nhất cho scroll-in; file cũ chết sạch.</done>
</task>

<task type="auto">
  <name>Task 2: timeline beam + parallax 3 cột</name>
  <files>packages/ui/src/motion/scroll-progress.ts, packages/ui/src/motion/parallax-columns.tsx, packages/ui/src/motion/index.ts, apps/2025/src/components/atoms/timeline.tsx, apps/2025/src/components/molecules/parallax-scroll.tsx</files>
  <action>Theo bảng M-02 #4: viết scroll-progress.ts (hook nhận ref container + tween config, tạo tween scaleY 0→1 transformOrigin top với scrollTrigger scrub theo start/end container) — timeline.tsx bỏ useScroll+useSpring của framer, dùng hook này cho beam. Theo #5: viết parallax-columns.tsx (nhận N cột, mỗi cột tween yPercent dấu xen kẽ ± với scrollTrigger scrub trên container chung) — parallax-scroll.tsx bọc primitive, giữ nguyên markup ảnh 3 cột. Cả 2 theo khuôn M-01. Xóa import motion khỏi 2 file app (D-06). Số yPercent/scrub lấy tương đương bản cũ (đọc useTransform range hiện tại — Claude tự quyết nếu không 1-1).</action>
  <verify>grep -n "framer-motion\|from 'motion" apps/2025/src/components/atoms/timeline.tsx apps/2025/src/components/molecules/parallax-scroll.tsx | wc -l = 0; pnpm build --filter=web-2025 && pnpm --filter @portfolio/ui typecheck thoát 0</verify>
  <done>Beam vẽ theo scroll đúng chiều; photos 3 cột lệch pha khi cuộn; primitive tái dùng được cho 2026.</done>
</task>

</tasks>

<verification>
Dev :3001: /about (hoặc trang chứa timeline) — beam scrub theo scroll; /photos — parallax không giật; chuyển trang 3-4 lần không lỗi console (leak check đầy đủ ở plan 04, M-03).
</verification>

<success_criteria>
Nhóm scroll-driven sống trên ScrollTrigger; 5/9 file đã sạch motion (còn hover-effect, link-preview, floating-dock + grid/list đã xong).
</success_criteria>

<output>
Commit: `feat(motion): reveal/scroll-progress/parallax primitives; timeline + photos on scrolltrigger`
Sau khi xong: viết C09-02-SUMMARY.md.
</output>
