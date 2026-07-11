---
phase: C09-gsap-migration
plan: 01
type: execute
wave: 1
depends_on: [C08-04]
files_modified:
  - packages/ui/package.json # + gsap, @gsap/react
  - packages/ui/src/motion/index.ts
  - apps/2025/src/components/molecules/theme-switch.tsx
  - apps/2025/src/components/organisms/grid-view.tsx
  - apps/2025/src/components/organisms/list-view.tsx
  - pnpm-lock.yaml
autonomous: true
requirements: [REQ-04, REQ-10]
must_haves:
  truths:
    - '3 file dễ nhất (theme-switch, grid-view, list-view) hết import motion, hiệu ứng bằng CSS thuần'
    - 'gsap + @gsap/react cài trong packages/ui dependencies'
  artifacts:
    - 'motion/index.ts không còn là placeholder export {}'
  key_links:
    - 'framer-motion VẪN CÒN trong deps 2025 (D-06 — gỡ ở plan 04)'
---

<objective>
Khởi động: cài GSAP vào packages/ui (D-01), port 3 mục dễ nhất của bảng M-02 (#1, #2) xuống CSS thuần (D-03, D-04).
</objective>

<context>
@docs/plans/phases/C09-gsap-migration/C09-CONTEXT.md
@apps/2025/src/components/molecules/theme-switch.tsx
@apps/2025/src/components/organisms/grid-view.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Cài GSAP + scaffold motion/</name>
  <files>packages/ui/package.json, packages/ui/src/motion/index.ts, pnpm-lock.yaml</files>
  <action>pnpm --filter @portfolio/ui add gsap@^3.15 @gsap/react (dependencies theo D-01, KHÔNG peer). Thay placeholder motion/index.ts (D-10) bằng barrel rỗng có sẵn khung export cho 5 primitive sắp tới (reveal, use-magnify, parallax-columns, scroll-progress, hover-highlight) — comment đánh dấu plan nào lấp file nào. File primitive tạo dần ở plan 02/03/04, KHÔNG tạo file rỗng trước (typecheck sẽ đỏ vì export thiếu — chỉ export cái đã tồn tại).</action>
  <verify>node -p "require('./packages/ui/package.json').dependencies.gsap"; pnpm --filter @portfolio/ui typecheck thoát 0</verify>
  <done>GSAP sẵn sàng; barrel motion thật thay placeholder.</done>
</task>

<task type="auto">
  <name>Task 2: theme-switch + grid/list-view xuống CSS thuần</name>
  <files>apps/2025/src/components/molecules/theme-switch.tsx, apps/2025/src/components/organisms/grid-view.tsx, apps/2025/src/components/organisms/list-view.tsx</files>
  <action>Đọc 3 file lấy hành vi hiện tại (duration/hướng fade) rồi port theo bảng M-02: theme-switch (D-03) — bỏ motion, icon chuyển bằng CSS transition transform/opacity theo data-attr theme, 0 JS animation; grid-view/list-view — bỏ AnimatePresence + variants stagger, thay bằng class CSS @keyframes fade-in-up + style animation-delay calc(var(--i)*40ms) với --i set inline theo index; BỎ exit animation theo D-04 (có chủ đích, ghi commit message). Xóa import framer-motion/motion khỏi 3 file (quy tắc D-06). Keyframes đặt trong css app 2025 (hiệu ứng đặc thù app theo D-09).</action>
  <verify>grep -n "framer-motion\|from 'motion" apps/2025/src/components/molecules/theme-switch.tsx apps/2025/src/components/organisms/grid-view.tsx apps/2025/src/components/organisms/list-view.tsx | wc -l = 0; pnpm build --filter=web-2025 thoát 0</verify>
  <done>3 file sạch motion; toggle theme mượt bằng CSS; blog đổi view có fade-in stagger, không exit.</done>
</task>

</tasks>

<verification>
Build cả 2 xanh; dev :3001 kiểm mắt nhanh theme toggle + blog grid/list switch (executor tự kiểm; user duyệt tổng plan 04).
</verification>

<success_criteria>
6/9 file còn lại cho plan 02-04; hạ tầng GSAP sẵn; đã chứng minh cách "CSS-first" chạy được.
</success_criteria>

<output>
Commit: `feat(motion): gsap groundwork in ui pkg; theme-switch + views to pure css`
Sau khi xong: viết C09-01-SUMMARY.md.
</output>
