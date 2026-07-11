---
phase: C08-base-ui-unification
plan: 02
type: execute
wave: 2
depends_on: [C08-01]
files_modified:
  - packages/ui/src/components/select.tsx
  - packages/ui/src/components/tabs.tsx
  - packages/ui/src/components/textarea.tsx
  - packages/ui/src/components/toggle.tsx
  - packages/ui/src/components/toggle-group.tsx
  - packages/ui/src/components/tooltip.tsx
  - packages/ui/src/components/form.tsx
  - packages/ui/src/components/pagination.tsx
  - packages/ui/src/components/drawer.tsx # port tay
  - packages/ui/src/index.ts
  - packages/ui/package.json # react-hook-form peer
autonomous: true
requirements: [REQ-03, REQ-10]
must_haves:
  truths:
    - 'packages/ui đủ 21 component (20 + drawer tự chế); tất cả import được từ barrel'
    - 'react-hook-form là peerDependencies — pnpm ls trong 2026 KHÔNG thấy nó bị ép cài'
  artifacts:
    - 'packages/ui/src/components/drawer.tsx với API Drawer/DrawerTrigger/DrawerContent'
  key_links:
    - 'TooltipProvider export từ barrel (design-sync conventions yêu cầu provider này)'
---

<objective>
Lấp đầy đợt 2: 8 component còn lại qua CLI từng lệnh (M-02), drawer port tay từ Dialog Base UI (D-04), form với react-hook-form làm peer (D-05). Kết thúc commit lớn 8a.
</objective>

<context>
@docs/plans/phases/C08-base-ui-unification/C08-CONTEXT.md
@apps/2025/src/components/atoms/drawer.tsx
@apps/2025/src/components/atoms/form.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Cài 8 component còn lại qua CLI, từng lệnh một</name>
  <files>packages/ui/src/components/select.tsx, packages/ui/src/components/tabs.tsx, packages/ui/src/components/textarea.tsx, packages/ui/src/components/toggle.tsx, packages/ui/src/components/toggle-group.tsx, packages/ui/src/components/tooltip.tsx, packages/ui/src/components/form.tsx, packages/ui/src/components/pagination.tsx, packages/ui/package.json</files>
  <action>Trong packages/ui, chạy TUẦN TỰ 8 lệnh mẫu M-02, mỗi lệnh riêng theo D-02/D-03: pnpm dlx shadcn@latest add select; pnpm dlx shadcn@latest add tabs; pnpm dlx shadcn@latest add textarea; pnpm dlx shadcn@latest add toggle; pnpm dlx shadcn@latest add toggle-group; pnpm dlx shadcn@latest add tooltip; pnpm dlx shadcn@latest add form; pnpm dlx shadcn@latest add pagination. Diff-port custom 2025 từng cái như C08-01 Task 2 (danh mục vào SUMMARY). Select chú ý part structure mới (Select.Value/Select.Icon — điểm dễ vỡ code_context). form.tsx: chuyển react-hook-form sang peerDependencies theo D-05 (+ peerDependenciesMeta optional nếu cần cho 2026), app 2025 đã có react-hook-form ^7 trong deps riêng — pnpm install xác nhận không warning unmet peer ở 2026.</action>
  <verify>ls packages/ui/src/components | wc -l = 20; node -p "const p=require('./packages/ui/package.json'); (p.peerDependencies['react-hook-form']||'MISSING') + '|' + (p.dependencies?.['react-hook-form']||'ok-not-dep')"; grep -rln "@radix-ui" packages/ui/src | wc -l = 0</verify>
  <done>20 component từ CLI; react-hook-form đúng vai peer; sạch Radix.</done>
</task>

<task type="auto">
  <name>Task 2: Drawer port tay + barrel chốt 8a</name>
  <files>packages/ui/src/components/drawer.tsx, packages/ui/src/index.ts</files>
  <action>Theo D-04: viết drawer.tsx dựa Dialog của @base-ui/react + CSS transform/transition trượt từ đáy (duration/easing thuộc Claude tự quyết, user duyệt mắt ở plan 04); GIỮ NGUYÊN API surface của apps/2025/src/components/atoms/drawer.tsx (Drawer/DrawerTrigger/DrawerContent/DrawerHeader... — đọc file cũ liệt kê đủ export) để call site 2025 không đổi khi sang plan 03. KHÔNG thêm vaul vào packages/ui. Chốt barrel index.ts: đủ 21 component + sub-part + TooltipProvider (key_links). Gate 8a: pnpm typecheck + pnpm build --filter=web-2026.</action>
  <verify>grep -n "vaul" packages/ui/package.json | wc -l = 0; grep -c "Drawer" packages/ui/src/index.ts ≥ 3; pnpm build --filter=web-2026 thoát 0</verify>
  <done>Drawer API-compatible không vaul; barrel hoàn chỉnh; 2026 xanh — 8a sẵn sàng commit.</done>
</task>

</tasks>

<verification>
`pnpm --filter @portfolio/ui typecheck` + `pnpm build --filter=web-2026` xanh; đếm export barrel khớp 21 component; danh mục custom-port 2 plan gộp đủ trong SUMMARY.
</verification>

<success_criteria>
packages/ui là bộ UI hoàn chỉnh duy nhất của repo — mọi component sinh từ CLI từng lệnh (D-02), 2 ngoại lệ có chủ đích: drawer (port tay, D-04), 4 component C1.
</success_criteria>

<output>
Commit: `feat(ui): complete base-ui kit — remaining 8 via shadcn cli + hand-ported drawer (8a)`
Sau khi xong: viết C08-02-SUMMARY.md.
</output>
