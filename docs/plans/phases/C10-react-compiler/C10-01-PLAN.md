---
phase: C10-react-compiler
plan: 01
type: execute
wave: 1
depends_on: [C09-04]
files_modified:
  - apps/2025/next.config.ts
  - apps/2026/next.config.ts
  - apps/2025/package.json
  - apps/2026/package.json
  - eslint.config.mjs # MỚI, root
  - package.json # script lint
  - pnpm-lock.yaml
autonomous: false
requirements: [REQ-07]
must_haves:
  truths:
    - 'Build cả 2 app xanh với reactCompiler: true; pnpm lint 0 error (SC1)'
    - 'Island client hành vi không đổi: kbar, dock GSAP, contact-form, theme switch (SC2)'
  artifacts:
    - 'eslint.config.mjs flat config root chỉ react-hooks'
  key_links:
    - "Mọi opt-out 'use no memo' có comment lý do và được liệt kê trong SUMMARY"
---

<objective>
Bật React Compiler cả 2 app + ESLint react-hooks flat config root trong 1 plan duy nhất; giá trị kép: memo tự động + linter ép Rules of React (D-05).
</objective>

<context>
@docs/plans/phases/C10-react-compiler/C10-CONTEXT.md
@apps/2025/next.config.ts
@apps/2026/next.config.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Bật flag + cài deps 2 app</name>
  <files>apps/2025/next.config.ts, apps/2026/next.config.ts, apps/2025/package.json, apps/2026/package.json, pnpm-lock.yaml</files>
  <action>pnpm --filter web-2025 --filter web-2026 add -D babel-plugin-react-compiler@latest. Thêm reactCompiler: true (top-level theo D-01, KHÔNG bọc experimental) vào cả 2 next.config.ts. Build cả 2, ghi build time trước/sau vào SUMMARY (D-06). Lỗi compile ở component nào: đọc message, nếu là vi phạm Rules of React rõ (setState trong render, mutate ref render...) thì SỬA; nếu là pattern lib bên thứ 3 (kbar — D-04): opt-out theo mẫu M-02 kèm comment lý do (D-03), liệt kê SUMMARY.</action>
  <verify>pnpm build --filter=web-2025 && pnpm build --filter=web-2026 thoát 0; grep -c "reactCompiler" apps/2025/next.config.ts apps/2026/next.config.ts — mỗi file 1</verify>
  <done>2 app compile qua React Compiler; danh sách opt-out (nếu có) minh bạch.</done>
</task>

<task type="auto">
  <name>Task 2: ESLint flat config root + sửa vi phạm</name>
  <files>eslint.config.mjs, package.json</files>
  <action>Theo D-02: cài eslint-plugin-react-hooks@latest ở root devDeps (eslint 9 sẵn từ C7); tạo eslint.config.mjs theo mẫu M-01 (kiểm tên preset recommended-latest với docs plugin lúc chạy — Claude tự quyết nếu đổi tên); script root lint: eslint . Chạy pnpm lint: ERROR phải sửa hết (deps sai của useEffect, điều kiện hook...) hoặc opt-out D-03 có lý do; WARNING ghi nợ SUMMARY không chặn. KHÔNG thêm plugin/rule ngoài react-hooks (deferred).</action>
  <verify>pnpm lint thoát 0; test -f eslint.config.mjs</verify>
  <done>Rules of React được ép ở CI-level từ nay; 0 error toàn repo.</done>
</task>

<task type="checkpoint:human-verify">
  <name>Task 3: Smoke island client 2 app</name>
  <action>Executor dev cả 2 app, đi kỹ island client (compiler chỉ ảnh hưởng client components — code_context): :3001 — kbar mở + gõ nhanh kết quả đúng (D-04 nghi phạm số 1), dock magnify không khựng (GSAP + compiler chung), contact-form validate + submit, theme/locale switch, gallery zoom, giscus load; :3000 — theme toggle, locale switch, copy-button blog. Console không warning React mới (double render bất thường, key). Đo Profiler kbar trước/sau nếu tiện (D-05 — ghi số, không gate). User xác nhận nhanh 2 site không khác lạ → merge, push, theo dõi build Vercel không timeout (D-06).</action>
  <verify>User xác nhận OK (sau khi executor đi đủ island 2 app, console sạch)</verify>
  <done>2 Success Criteria phase C10 đạt; compiler chạy production.</done>
</task>

</tasks>

<verification>
SC1 = Task 1 build + Task 2 lint; SC2 = Task 3. Rollback ghi sẵn: đổi reactCompiler: false — 1 dòng mỗi app, không đụng code.
</verification>

<success_criteria>
Memo hóa tự động sống trên cả 2 app; linter Rules of React thành gate lâu dài của repo.
</success_criteria>

<output>
Commit: `feat: enable react compiler in both apps + react-hooks flat eslint at root`
Sau khi xong: viết C10-01-SUMMARY.md, tick phase C10, cập nhật STATE.md (vị trí → C11).
</output>
