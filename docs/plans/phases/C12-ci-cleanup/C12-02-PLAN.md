---
phase: C12-ci-cleanup
plan: 02
type: execute
wave: 2
depends_on: [C12-01]
files_modified:
  - apps/2025/src/components/atoms/fade-content.tsx # XÓA nếu grep 0
  - apps/2025/src/components/ # back-to-posts dedup
  - apps/2025/src/hooks/ # hooks mồ côi
  - apps/2025/src/utils/ # utils mồ côi
  - apps/2025/.ds-css/ # XÓA
  - apps/2025/public/static/images/backgrounds/grid.svg # XÓA (đã inline C7)
  - CLAUDE.md
  - docs/PLAN-apps-2025.md
autonomous: true
requirements: [REQ-09]
must_haves:
  truths:
    - 'Mọi file xóa đều có bằng chứng grep 0 tham chiếu (tên file + tên export); build 2 app xanh sau dọn'
    - 'CLAUDE.md mô tả đúng kiến trúc 3 package, không còn ghi chú contentlayer/PowerShell (SC2)'
  artifacts:
    - 'docs/PLAN-apps-2025.md có header SUPERSEDED'
  key_links:
    - 'ROADMAP.md Progress điền hash commit các phase đã đóng'
---

<objective>
Dọn xác code grep-driven (D-05…D-07) + viết lại docs cho khớp hiện thực (D-08, D-09).
</objective>

<context>
@docs/plans/phases/C12-ci-cleanup/C12-CONTEXT.md
@CLAUDE.md
@docs/PLAN-apps-2025.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Dọn xác theo danh sách nghi + knip tham khảo</name>
  <files>apps/2025/src/components/atoms/fade-content.tsx, apps/2025/src/components/atoms/back-to-posts.tsx, apps/2025/src/components/molecules/back-to-posts.tsx, apps/2025/src/hooks/, apps/2025/src/utils/, apps/2025/.ds-css/, apps/2025/public/static/images/backgrounds/grid.svg</files>
  <action>Với TỪNG mục trong danh sách D-05: grep tên file + tên export toàn repo (trừ node_modules/.next) — 0 kết quả mới xóa, còn nghi thì GIỮ + ghi SUMMARY (D-07). back-to-posts × 2: xem file nào được import thật, giữ 1 sửa import về nó. Hooks 2025: cái nào trùng packages/ui/src/hooks thì xóa bản app + sửa import sang @portfolio/ui (use-blog-stats GIỮ — đặc thù app). Chạy pnpm dlx knip THAM KHẢO (D-06): finding hợp lý thì xử cùng nguyên tắc grep, finding lạ bỏ qua có ghi chú. Sau dọn: pnpm build cả 2 + đi nhanh vài trang.</action>
  <verify>pnpm build --filter=web-2025 && pnpm build --filter=web-2026 thoát 0; git status --short cho thấy chỉ file trong danh sách bị xóa/sửa</verify>
  <done>Xác chết ra đi có bằng chứng; không vỡ gì.</done>
</task>

<task type="auto">
  <name>Task 2: CLAUDE.md + superseded + ROADMAP hash</name>
  <files>CLAUDE.md, docs/PLAN-apps-2025.md, docs/plans/ROADMAP.md, docs/plans/STATE.md</files>
  <action>Viết lại CLAUDE.md theo D-08: mục "What this is" thêm packages/{content,ui,mdx} với quy ước raw-TS (exports ./src/index.ts + transpilePackages + @source); XÓA đoạn PowerShell/Git Bash contentlayer + ghi chú contentlayer trong Architecture; cập nhật Commands (ci-check, check-links, lint); thêm quy ước version anchor 2026; mục Active plan trỏ docs/plans/ (STATE.md làm điểm vào). docs/PLAN-apps-2025.md: chèn header blockquote SUPERSEDED theo D-09 ngay đầu file, nội dung giữ nguyên làm sử liệu. ROADMAP.md bảng Progress: điền hash commit mọi phase đã đóng (git log --oneline tra theo commit message các SUMMARY).</action>
  <verify>grep -c "PowerShell" CLAUDE.md = 0 hoặc chỉ còn ngữ cảnh không-contentlayer; head -3 docs/PLAN-apps-2025.md chứa SUPERSEDED; grep -c "Not started" docs/plans/ROADMAP.md ≤ 1 (chỉ C12 nếu chưa đóng)</verify>
  <done>Docs khớp hiện thực; người mới đọc CLAUDE.md không bị dẫn sai.</done>
</task>

</tasks>

<verification>
Build 2 app xanh; `pnpm ci-check` vẫn xanh sau dọn (prettier --check bắt file mới sửa).
</verification>

<success_criteria>
Repo sạch xác 10 phase; tài liệu là bản đồ đúng của lãnh thổ.
</success_criteria>

<output>
Commit: `chore: post-migration cleanup + docs rewrite (3-package architecture)`
Sau khi xong: viết C12-02-SUMMARY.md.
</output>
