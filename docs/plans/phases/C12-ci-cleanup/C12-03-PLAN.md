---
phase: C12-ci-cleanup
plan: 03
type: execute
wave: 3
depends_on: [C12-02]
files_modified:
  - .design-sync/config.json # componentSrcMap mới
  - .design-sync/ # previews sửa theo API mới nếu vỡ
autonomous: false
requirements: [REQ-09]
must_haves:
  truths:
    - 'design-sync project render lại đủ card với cấu trúc component mới (sau C8/C9)'
    - 'Đi tay checklist M-03 đủ 2 app × 2 locale × 2 theme không lỗi (SC3)'
    - '2 deploy Vercel xanh; pnpm ci-check xanh lần cuối'
  artifacts:
    - '.design-sync/config.json cập nhật, mapping file chết đã xóa'
  key_links:
    - 'Các sửa tay của user trong .design-sync/previews + conventions.md được TÔN TRỌNG (không revert — code_context)'
---

<objective>
Hậu kỳ cuối cùng: re-sync design-sync theo cấu trúc mới (D-10), đi tay toàn bộ 2 site theo checklist M-03, đóng sổ Nâng cấp C.
</objective>

<context>
@docs/plans/phases/C12-ci-cleanup/C12-CONTEXT.md
@.design-sync/config.json
</context>

<tasks>

<task type="auto">
  <name>Task 1: Re-sync design-sync</name>
  <files>.design-sync/config.json, .design-sync/previews/, apps/2025/.design-sync.entry.tsx</files>
  <action>Theo D-10: cập nhật componentSrcMap trong config.json — entry trỏ file atoms đã xóa ở C8 (button, dialog, select...) đổi sang re-export từ @portfolio/ui (qua shim atoms hoặc trực tiếp packages/ui/src/components/), entry của file đã chết hẳn (animated-content, fade-content) xóa mapping; xóa shim lingui/env thừa trong entry nếu C6 làm chúng vô nghĩa. Chạy lại buildCmd (gen-entry + refresh-css + icons) + quy trình build bundle + validate + upload của /design-sync. Preview vỡ do API đổi (asChild→render, data-attr): sửa theo lỗi build của tool — TÔN TRỌNG các file previews/conventions.md user đã chỉnh tay (không revert nội dung của họ, chỉ sửa phần API chết).</action>
  <verify>Bundle design-sync build thoát 0; số card upload ≥ số card cũ trừ các component đã xóa có chủ đích (ghi con số vào SUMMARY)</verify>
  <done>Design-sync phản chiếu đúng codebase hậu C8/C9.</done>
</task>

<task type="checkpoint:human-verify">
  <name>Task 2: Đi tay toàn bộ + đóng sổ</name>
  <action>Executor chạy pnpm ci-check lần cuối (xanh) rồi cùng user đi checklist M-03: home / about / blog + 1 bài đủ format (code block dual theme, callout, playground Sandpack) / tags + 1 tag / projects / photos (parallax) / contact + modal / 404 — nhân 2 locale (vi, /en) × 2 theme × 2 app (:3000, :3001). Hỏi user có muốn .github/workflows/ci.yml cho PR flow không (Claude tự quyết trong CONTEXT — thêm 1 file tối giản nếu có). User OK → commit cuối, push, xác nhận 2 deploy Vercel READY, mở cả 2 URL production đi lại checklist rút gọn. Điền nốt Progress ROADMAP (C12 ✅ + hash), cập nhật STATE.md trạng thái "Nâng cấp C HOÀN THÀNH" + tổng kết velocity.</action>
  <verify>User xác nhận OK (sau ci-check xanh + checklist đủ)</verify>
  <done>3 Success Criteria phase C12 đạt; toàn bộ roadmap C0–C12 đóng; production sống trên stack mới.</done>
</task>

</tasks>

<verification>
SC1 đã đóng ở C12-01; SC2 ở C12-02; SC3 = Task 2. Trạng thái cuối: ROADMAP 13/13 ✅, STATE.md sạch blocker.
</verification>

<success_criteria>
Dự án Nâng cấp C kết thúc: 3 package dùng chung, 2 app cùng stack Next 16/React 19.2/Tailwind 4.3/Base UI/GSAP/React Compiler, gate 1 lệnh, docs đúng, design-sync khớp.
</success_criteria>

<output>
Commit: `chore: design-sync re-sync + final walkthrough — upgrade C complete`
Sau khi xong: viết C12-03-SUMMARY.md, tick phase C12, STATE.md đóng sổ.
</output>
