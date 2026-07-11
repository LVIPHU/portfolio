---
phase: C09-gsap-migration
plan: 03
type: execute
wave: 3
depends_on: [C09-02]
files_modified:
  - packages/ui/src/motion/hover-highlight.tsx
  - packages/ui/src/motion/index.ts
  - apps/2025/src/components/molecules/hover-effect.tsx
  - apps/2025/src/components/atoms/link-preview.tsx
autonomous: true
requirements: [REQ-04, REQ-10]
must_haves:
  truths:
    - 'hover-effect highlight bám card bằng gsap.to đo rect; link-preview follow chuột bằng quickTo'
    - '2 file sạch import motion; AnimatePresence exit thay bằng state closing + onComplete'
  artifacts:
    - 'packages/ui/src/motion/hover-highlight.tsx'
  key_links:
    - 'quickTo tạo 1 lần trong useGSAP, handler pointermove chỉ GỌI — không alloc tween mỗi event (D-05)'
---

<objective>
Port nhóm pointer-driven (bảng M-02 #6, #7): hover-effect qua primitive hover-highlight, link-preview follow chuột bằng quickTo — hot-path đúng chuẩn D-05.
</objective>

<context>
@docs/plans/phases/C09-gsap-migration/C09-CONTEXT.md
@apps/2025/src/components/molecules/hover-effect.tsx
@apps/2025/src/components/atoms/link-preview.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: hover-highlight primitive + hover-effect</name>
  <files>packages/ui/src/motion/hover-highlight.tsx, packages/ui/src/motion/index.ts, apps/2025/src/components/molecules/hover-effect.tsx</files>
  <action>Theo bảng M-02 #6: viết hover-highlight.tsx ('use client', khuôn M-01 không ScrollTrigger) — 1 div highlight absolute trong container; onMouseEnter từng card đo getBoundingClientRect (tương đối container) rồi gsap.to(highlight, {x, y, width, height, opacity, duration: .25}); mouse leave container thì fade opacity 0. hover-effect.tsx của 2025 bọc primitive, giữ nguyên markup card + class; xóa import motion + layoutId cũ. Flip plugin KHÔNG dùng vội — chỉ dự phòng nếu user chê morph (D-08, ghi chú SUMMARY).</action>
  <verify>grep -n "framer-motion\|from 'motion" apps/2025/src/components/molecules/hover-effect.tsx | wc -l = 0; pnpm build --filter=web-2025 thoát 0</verify>
  <done>Highlight bám card mượt; primitive dùng lại được cho 2026.</done>
</task>

<task type="auto">
  <name>Task 2: link-preview quickTo + exit tự quản</name>
  <files>apps/2025/src/components/atoms/link-preview.tsx</files>
  <action>Theo bảng M-02 #7 (ở lại app theo D-09 — đặc thù microlink): trong useGSAP tạo const xTo = gsap.quickTo(el, 'x', {duration:.3, ease:'power3'}) và yTo tương tự (D-05 — tạo 1 lần, handler chỉ gọi); onPointerMove gọi xTo(offset). Enter: gsap.fromTo opacity/scale khi ảnh mount. Exit thay AnimatePresence: state closing=true → tween opacity/scale về 0 → onComplete setMounted(false) unmount. Giữ nguyên phần fetch/encode qss + Image microlink. Xóa import framer-motion + @emotion nếu file tham chiếu.</action>
  <verify>grep -n "framer-motion\|from 'motion\|AnimatePresence" apps/2025/src/components/atoms/link-preview.tsx | wc -l = 0; pnpm build --filter=web-2025 thoát 0</verify>
  <done>Ảnh preview follow chuột không khựng, exit không giật; file sạch motion.</done>
</task>

</tasks>

<verification>
Dev :3001 trang có link-preview (about/blog) — hover link thấy ảnh follow chuột, rời link ảnh tắt mượt; hover-effect trên grid card — highlight trượt giữa các card. Console 0 error. `grep -rln "framer-motion\|from 'motion'" apps/2025/src | wc -l` = 1 (chỉ còn floating-dock).
</verification>

<success_criteria>
8/9 file sạch motion — chỉ còn floating-dock cho plan 04.
</success_criteria>

<output>
Commit: `feat(motion): pointer-driven ports — hover highlight primitive + quickTo link preview`
Sau khi xong: viết C09-03-SUMMARY.md.
</output>
