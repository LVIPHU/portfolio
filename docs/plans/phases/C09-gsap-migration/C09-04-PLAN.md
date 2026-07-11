---
phase: C09-gsap-migration
plan: 04
type: execute
wave: 4
depends_on: [C09-03]
files_modified:
  - packages/ui/src/motion/use-magnify.ts
  - packages/ui/src/motion/index.ts
  - apps/2025/src/components/molecules/floating-dock.tsx
  - apps/2025/package.json # gỡ framer-motion + motion + @emotion/is-prop-valid
  - pnpm-lock.yaml
autonomous: false
requirements: [REQ-04, REQ-10]
must_haves:
  truths:
    - "grep framer-motion|from 'motion' toàn apps + packages = 0 (SC1)"
    - 'Dock magnify mượt theo con trỏ, indicator trượt giữa tab, không leak ScrollTrigger khi chuyển trang (SC2)'
    - 'User nghiệm thu bằng mắt toàn bộ hiệu ứng (SC3, D-08)'
  artifacts:
    - 'packages/ui/src/motion/use-magnify.ts'
  key_links:
    - '3 gói framer-motion/motion/@emotion/is-prop-valid biến mất khỏi package.json 2025 MỘT LẦN (D-06)'
---

<objective>
Trận cuối: floating-dock (khó nhất — D-07), gỡ 3 gói motion một lần (D-06), leak check M-03, user nghiệm thu toàn phase (D-08).
</objective>

<context>
@docs/plans/phases/C09-gsap-migration/C09-CONTEXT.md
@apps/2025/src/components/molecules/floating-dock.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: use-magnify + floating-dock</name>
  <files>packages/ui/src/motion/use-magnify.ts, packages/ui/src/motion/index.ts, apps/2025/src/components/molecules/floating-dock.tsx</files>
  <action>ĐỌC floating-dock.tsx trước, chép ra SUMMARY các số hiện tại (range px, size min/max icon — bảng M-02 #8 ước 40→80 trong bán kính ±150, LẤY SỐ THẬT từ useTransform của bản motion). Viết use-magnify.ts ('use client'): mỗi icon 1 cặp quickTo width/height (D-05); handler pointermove trên dock tính khoảng cách con trỏ→tâm từng icon rồi gsap.utils.mapRange(-R, R, minSize, maxSize) → gọi quickTo; pointerleave đưa mọi icon về minSize. floating-dock.tsx dùng hook; indicator active: đo rect tab đích + gsap.to(indicator, {x, width, duration:.3}) thay layoutId (D-07 — Flip chỉ khi thiếu mượt, ghi chú nếu dùng); tooltip chuyển CSS (group-hover); whileTap → CSS :active scale-95. Xóa import motion.</action>
  <verify>grep -rn "framer-motion\|from 'motion'" apps/2025/src packages | wc -l = 0; pnpm build --filter=web-2025 thoát 0</verify>
  <done>Dock magnify tương đương bản cũ theo số đo; toàn codebase sạch import motion.</done>
</task>

<task type="auto">
  <name>Task 2: Gỡ 3 gói + leak check</name>
  <files>apps/2025/package.json, pnpm-lock.yaml</files>
  <action>Theo D-06 (một lần, cuối phase): pnpm --filter web-2025 remove framer-motion motion @emotion/is-prop-valid. Build cả 2 app. Chạy leak check theo mẫu M-03: dev :3001, chuyển qua lại ≥10 lần giữa home/photos/about (các trang có ScrollTrigger), console gõ ScrollTrigger.getAll().length — số ổn định không tăng dần (useGSAP cleanup D-02 phải lo được; tăng thì tìm chỗ port thiếu scope trước khi nghĩ tới refresh thủ công).</action>
  <verify>grep -cE "framer-motion|\"motion\"|@emotion" apps/2025/package.json = 0; pnpm build --filter=web-2025 && pnpm build --filter=web-2026 thoát 0</verify>
  <done>3 gói biến mất; không leak; build 2 app xanh.</done>
</task>

<task type="checkpoint:human-verify">
  <name>Task 3: User nghiệm thu toàn bộ hiệu ứng</name>
  <action>Mời user duyệt :3001 theo checklist (D-08): (1) dock — magnify theo con trỏ mượt, indicator trượt giữa tab, tooltip, tap scale; (2) photos — parallax 3 cột; (3) timeline beam scrub; (4) blog grid/list fade-in; (5) hover highlight bám card; (6) link-preview follow chuột; (7) theme-switch. So CẢM GIÁC với bản cũ (production đang chạy trước merge) — nếu user chê spring dock: thử ease elastic.out(1, 0.5) hoặc InertiaPlugin (free) rồi duyệt lại, KHÔNG đổi thiết kế hiệu ứng. User OK → merge, push, 2 deploy Vercel xanh.</action>
  <verify>User xác nhận OK (sau khi Task 1-2 gate + leak check pass)</verify>
  <done>3 Success Criteria phase C9 đạt; animation stack của repo là GSAP duy nhất.</done>
</task>

</tasks>

<verification>
SC1 = Task 1+2 grep; SC2 = Task 2 leak check M-03 + Task 3 mục 1; SC3 = Task 3. Bổ sung: first-load JS home/photos ghi vào SUMMARY để so bundle (deferred — không gate).
</verification>

<success_criteria>
Phase C9 đóng: 9/9 file port xong, deps motion sạch, user duyệt cảm giác, primitives sẵn cho 2026.
</success_criteria>

<output>
Commit: `feat(motion)!: floating dock on gsap quickTo — framer-motion fully removed`
Sau khi xong: viết C09-04-SUMMARY.md, tick phase C9, cập nhật STATE.md (vị trí → C10).
</output>
