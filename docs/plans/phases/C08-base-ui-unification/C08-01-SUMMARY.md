---
phase: C08-base-ui-unification
plan: 01
subsystem: packages-ui
tags: [base-ui, shadcn-cli, self-contained-imports]
provides:
  - packages/ui từ 4 → 12 component (thêm avatar, dialog, dropdown-menu, hover-card, input, label, popover, scroll-area) — mỗi cái add bằng 1 lệnh CLI riêng
  - barrel index.ts export 8 component mới + mọi sub-part
  - packages/ui thành SELF-CONTAINED: import nội bộ `@/` → tương đối (regresh sau mỗi shadcn add)
key-decisions:
  - 'BUG BẮT ĐƯỢC (gate 2026): shadcn sinh import nội bộ `@/lib/utils` + `@/components/button`; app tiêu thụ qua transpilePackages nên Turbopack phân giải `@/` theo tsconfig CỦA APP. `@/lib/utils` trùng khớp app (may mắn — vì sao C1 chạy được) nhưng `@/components/button` không có trong apps/2026/src → Module not found. FIX BỀN: đổi toàn bộ import nội bộ packages/ui sang tương đối (../lib/utils, ./button). QUY TẮC MỚI: sau MỖI `shadcn add`, sửa `@/` → tương đối trước khi build.'
  - 'Không cần port custom tay: bản base-nova của cả 8 component là SUPERSET hành vi so với atoms 2025 (đều là shadcn vanilla). Dialog base-nova đã sẵn showCloseButton + nút close render Button size=icon-sm (đúng khuôn port C1). Avatar base-nova thêm size/AvatarBadge/AvatarGroup; Popover/HoverCard thêm Positioner + Title/Description; DropdownMenu đủ mọi sub-part 2025 dùng.'
  - 'Label base-nova là <label> thuần (không primitive) → tự nhiên bỏ phụ thuộc @radix-ui/react-label; Dialog dùng Backdrop (map DialogOverlay) + Popup (map DialogContent); HoverCard = PreviewCard; DropdownMenu = Menu (SubmenuRoot/SubmenuTrigger).'
status: complete
completed: 2026-07-12
---

# C08-01 — Summary (mở commit lớn 8a)

## 8 lệnh CLI đã chạy (D-02: mỗi component 1 lệnh riêng, trong packages/ui)

`avatar` → `dialog` → `dropdown-menu` → `hover-card` → `input` → `label` → `popover` → `scroll-area`. Tất cả sinh từ registry base-nova, import `@base-ui/react/*`, 0 dính `@radix-ui`.

## Danh mục diff-port (D-02 — giữ hành vi registry, port custom 2025)

| Component     | Custom 2025                             | Xử lý                                                                                                           |
| ------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| avatar        | chỉ `size-8` mặc định                   | base-nova mặc định cũng size-8 + thêm size/AvatarBadge/AvatarGroup — **superset, giữ nguyên**                   |
| dialog        | `showCloseButton`, nút close XIcon      | base-nova đã có `showCloseButton` + close render `<Button size="icon-sm">` — **khớp khuôn port C1, giữ nguyên** |
| dropdown-menu | inset/variant, sub-menu, checkbox/radio | base-nova đủ hết (Menu.Submenu*) — **giữ nguyên**                                                               |
| hover-card    | w-64                                    | base-nova w-64 + Positioner — **giữ nguyên**                                                                    |
| input         | h-9                                     | base-nova h-8 (registry mới) — **giữ registry**                                                                 |
| label         | Radix label                             | base-nova `<label>` thuần — **tốt hơn, bỏ dep radix-label**                                                     |
| popover       | thêm `PopoverAnchor`                    | call-site 2025 KHÔNG dùng PopoverAnchor (chỉ Popover/Trigger/Content) → **bỏ được, không port**                 |
| scroll-area   | forwardRef cũ, ScrollBar                | base-nova ScrollArea+ScrollBar tương đương — **giữ registry**                                                   |

Không component nào cần chỉnh tay để bảo toàn hành vi 2025.

## Gate

- `pnpm --filter @portfolio/ui typecheck` → 0 (tsc --noEmit sạch).
- `pnpm build --filter=web-2026` → xanh 22.4s (4 component C1 hành vi không đổi; sau khi vá import nội bộ).
- Số liệu: 12 component; 0 `@radix-ui` trong src; 11/12 data-slot (badge là cva từ C1, không data-slot — không đụng); index.ts 14 dòng export.

## Nợ chuyển tiếp

- Plan 02: 8 lệnh còn lại (select→pagination) + drawer tự chế (D-04) + form.tsx đẩy react-hook-form vào peerDependencies (D-05). NHỚ: sửa `@/` → tương đối sau mỗi add.
