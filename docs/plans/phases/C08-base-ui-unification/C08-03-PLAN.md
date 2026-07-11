---
phase: C08-base-ui-unification
plan: 03
type: execute
wave: 3
depends_on: [C08-02]
files_modified:
  - apps/2025/src/components/atoms/index.ts # thành shim
  - apps/2025/src/components/atoms/ # xóa ~21 file shadcn-derived
  - apps/2025/src/components/templates/about.tsx
  - apps/2025/src/components/organisms/technologies.tsx
  - apps/2025/src/components/atoms/social-icons.tsx
  - apps/2025/src/components/organisms/footer.tsx
  - apps/2025/src/components/organisms/experience.tsx
  - apps/2025/src/components/molecules/project-card.tsx
  - apps/2025/src/components/molecules/social-share.tsx
  - apps/2025/next.config.ts # transpilePackages += @portfolio/ui
autonomous: true
requirements: [REQ-03, REQ-10]
must_haves:
  truths:
    - 'grep -rn asChild apps/2025/src = 0; typecheck xanh qua shim'
    - 'Organisms/templates không đổi dòng import nào (vẫn @/components/atoms)'
  artifacts:
    - 'atoms/index.ts dạng shim theo mẫu M-04; ~21 file atoms shadcn-derived đã xóa'
  key_links:
    - 'Mọi export cũ của barrel atoms vẫn resolve (không missing export sau shim)'
---

<objective>
Mở commit lớn 8b: 2025 chuyển nguồn UI sang `@portfolio/ui` qua shim (D-06), xóa atoms trùng (D-07), convert 8 call site `asChild` → `render` (D-08).
</objective>

<context>
@docs/plans/phases/C08-base-ui-unification/C08-CONTEXT.md
@apps/2025/src/components/atoms/index.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Shim barrel + xóa atoms shadcn-derived</name>
  <files>apps/2025/src/components/atoms/index.ts, apps/2025/src/components/atoms/{avatar,badge,button,card,dialog,drawer,dropdown-menu,form,hover-card,input,label,pagination,popover,scroll-area,select,separator,tabs,textarea,toggle,toggle-group,tooltip}.tsx, apps/2025/next.config.ts</files>
  <action>Trước khi xóa: đọc atoms/index.ts hiện tại, lập danh sách MỌI export name của 21 file sắp xóa (D-07) — mỗi tên phải có bản tương đương trong @portfolio/ui barrel (đối chiếu với danh mục export chốt ở C08-02; thiếu tên nào thì bổ sung export vào packages/ui trước, ghi SUMMARY). Viết lại atoms/index.ts theo mẫu M-04 (D-06): nhóm shadcn-derived re-export từ @portfolio/ui, nhóm D-12 giữ export * từ file local. Xóa 21 file. Grep import path cụ thể @/components/atoms/<tên-file-đã-xóa> toàn src → sửa về barrel @/components/atoms. next.config.ts thêm '@portfolio/ui' vào transpilePackages. Typecheck bắt duplicate export/missing export ngay.</action>
  <verify>pnpm --filter web-2025 typecheck thoát 0; ls apps/2025/src/components/atoms/*.tsx | wc -l ≈ 22 (chỉ còn nhóm D-12); grep -rn "from '@/components/atoms/button'\|from '@/components/atoms/dialog'" apps/2025/src | wc -l = 0</verify>
  <done>Shim sống, 21 xác atoms biến mất, không consumer nào phải đổi import barrel.</done>
</task>

<task type="auto">
  <name>Task 2: Convert 8 call site asChild → render</name>
  <files>apps/2025/src/components/templates/about.tsx, apps/2025/src/components/organisms/technologies.tsx, apps/2025/src/components/atoms/social-icons.tsx, apps/2025/src/components/organisms/footer.tsx, apps/2025/src/components/organisms/experience.tsx, apps/2025/src/components/molecules/project-card.tsx, apps/2025/src/components/molecules/social-share.tsx</files>
  <action>Theo D-08 + mẫu M-03: 7 file / ~8 chỗ (danh sách chốt trong code_context — project-card có 2). Từng chỗ: children element chuyển vào prop render dạng element không children (render={<Link href=... />}), children text/icon giữ lại làm children của component cha. Sau convert grep asChild toàn src = 0 (6 occurrence trong badge/button/select.tsx đã biến mất cùng file xóa ở Task 1). Build web-2025 xác nhận không lỗi runtime prop.</action>
  <verify>grep -rn "asChild" apps/2025/src | wc -l = 0; pnpm build --filter=web-2025 thoát 0</verify>
  <done>Composition tường minh qua render prop; build xanh.</done>
</task>

</tasks>

<verification>
Typecheck + build web-2025 xanh; dev :3001 mở nhanh trang about/projects — button-link (asChild cũ) điều hướng đúng; KHÔNG cần user ở plan này (nghiệm thu tổng ở plan 04).
</verification>

<success_criteria>
2025 tiêu thụ 100% component shadcn-derived từ @portfolio/ui; codebase sạch asChild.
</success_criteria>

<output>
Commit: `feat(2025)!: adopt @portfolio/ui via atoms shim, drop duplicated atoms, asChild→render (8b-1)`
Sau khi xong: viết C08-03-SUMMARY.md.
</output>
