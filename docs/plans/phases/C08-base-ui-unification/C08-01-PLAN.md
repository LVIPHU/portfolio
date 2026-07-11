---
phase: C08-base-ui-unification
plan: 01
type: execute
wave: 1
depends_on: [C07-02]
files_modified:
  - packages/ui/src/components/avatar.tsx
  - packages/ui/src/components/dialog.tsx
  - packages/ui/src/components/dropdown-menu.tsx
  - packages/ui/src/components/hover-card.tsx
  - packages/ui/src/components/input.tsx
  - packages/ui/src/components/label.tsx
  - packages/ui/src/components/popover.tsx
  - packages/ui/src/components/scroll-area.tsx
  - packages/ui/src/index.ts
autonomous: true
requirements: [REQ-03, REQ-10]
must_haves:
  truths:
    - '8 component mới import được từ @portfolio/ui, mang data-slot attributes của registry base-nova'
    - 'Custom class/variant của bản atoms 2025 tương ứng đã được port (ghi danh mục trong SUMMARY)'
  artifacts:
    - 'packages/ui/src/components/{avatar,dialog,dropdown-menu,hover-card,input,label,popover,scroll-area}.tsx'
  key_links:
    - 'build web-2026 xanh — 4 component cũ (C1) hành vi không đổi'
---

<objective>
Lấp đầy packages/ui đợt 1: cài 8 component Base UI qua CLI — từng lệnh riêng theo D-02 — và diff-port custom của atoms 2025 tương ứng. Mở đầu commit lớn 8a.
</objective>

<context>
@docs/plans/phases/C08-base-ui-unification/C08-CONTEXT.md
@packages/ui/components.json
@packages/ui/src/components/button.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Cài 8 component qua CLI, từng lệnh một</name>
  <files>packages/ui/src/components/avatar.tsx, packages/ui/src/components/dialog.tsx, packages/ui/src/components/dropdown-menu.tsx, packages/ui/src/components/hover-card.tsx, packages/ui/src/components/input.tsx, packages/ui/src/components/label.tsx, packages/ui/src/components/popover.tsx, packages/ui/src/components/scroll-area.tsx</files>
  <action>Đứng trong packages/ui (KHÔNG chạy shadcn init lại — components.json base-nova đã chuẩn từ C1, xem code_context), chạy TUẦN TỰ đúng 8 lệnh của mẫu M-01, mỗi lệnh một dòng riêng theo D-02/D-03: pnpm dlx shadcn@latest add avatar; rồi pnpm dlx shadcn@latest add dialog; rồi pnpm dlx shadcn@latest add dropdown-menu; rồi pnpm dlx shadcn@latest add hover-card; rồi pnpm dlx shadcn@latest add input; rồi pnpm dlx shadcn@latest add label; rồi pnpm dlx shadcn@latest add popover; rồi pnpm dlx shadcn@latest add scroll-area. KHÔNG gộp nhiều tên vào 1 lệnh, KHÔNG chép code từ docs. Sau MỖI lệnh: kiểm file sinh ra nằm đúng src/components/ (path aliases của components.json), import từ @base-ui/react (không @radix-ui — lệnh sinh ra bản Radix là sai preset, dừng ngay và kiểm components.json).</action>
  <verify>ls packages/ui/src/components | wc -l = 12 (4 cũ + 8 mới); grep -rln "@radix-ui" packages/ui/src | wc -l = 0; grep -rln "data-slot" packages/ui/src/components | wc -l = 12</verify>
  <done>8 file mới đúng nguồn Base UI/base-nova, đủ data-slot, không dính Radix.</done>
</task>

<task type="auto">
  <name>Task 2: Diff-port custom 2025 + barrel + gate 2026</name>
  <files>packages/ui/src/components/*.tsx, packages/ui/src/index.ts</files>
  <action>Với TỪNG component vừa add, diff với bản atoms 2025 cùng tên (apps/2025/src/components/atoms/<name>.tsx): quy tắc D-02 — giữ hành vi registry, port CUSTOM class/variant/sub-component của 2025 vào (theo tiền lệ button icon-sm/icon-lg của C1 — xem canonical_refs); ghi DANH MỤC mọi custom đã port/bỏ vào SUMMARY (điểm rà --diff của plan gốc). Kiểm dialog: overlay/close hành vi dùng được cho parallel-route modal (điểm dễ vỡ code_context). Cập nhật packages/ui/src/index.ts export 8 component + mọi sub-part (DialogTrigger, PopoverContent, ScrollBar...). Gate: pnpm typecheck + pnpm build --filter=web-2026 — 4 component cũ không được đổi hành vi.</action>
  <verify>pnpm --filter @portfolio/ui typecheck thoát 0; pnpm build --filter=web-2026 thoát 0; grep -c "export" packages/ui/src/index.ts tăng so trước (ghi số)</verify>
  <done>Custom 2025 được bảo toàn có danh mục; barrel đủ; 2026 nguyên vẹn.</done>
</task>

</tasks>

<verification>
`pnpm build --filter=web-2026` + `pnpm --filter @portfolio/ui typecheck` xanh; 8 component render thử nhanh trong 1 page scratch của 2026 (executor tự kiểm, xóa sau) nếu nghi ngờ part structure.
</verification>

<success_criteria>
packages/ui có 12/20 component đích, toàn bộ từ CLI từng lệnh, custom 2025 không mất.
</success_criteria>

<output>
Commit: `feat(ui): add 8 base-ui components via shadcn cli (avatar→scroll-area)`
Sau khi xong: viết C08-01-SUMMARY.md.
</output>
