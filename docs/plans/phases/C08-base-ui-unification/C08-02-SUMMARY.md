---
phase: C08-base-ui-unification
plan: 02
subsystem: packages-ui
tags: [base-ui, shadcn-cli, drawer-hand-port, form-rhf-peer]
provides:
  - packages/ui đủ 21 component (select, tabs, textarea, toggle, toggle-group, tooltip, pagination qua CLI; form + drawer port tay)
  - react-hook-form là optional peerDependency (2026 KHÔNG bị ép cài; xác minh pnpm ls rỗng)
  - drawer trượt-từ-đáy dựng trên Dialog Base UI, 0 vaul; API surface y hệt bản vaul cũ
key-decisions:
  - 'DEVIATION D-05: base-nova ship `form.json` RỖNG (files: []) — Base UI ưu tiên `field` (native, deps label+separator), KHÔNG có form react-hook-form. Kiểm chứng: fetch registry base-nova/form.json → files rỗng; field.json → có registry/base-nova/ui/field.tsx. Vì KHÔNG call site 2025 nào dùng Form API (ContactForm chỉ dùng Label/Input/Textarea/Button; FormControl/FormField/useFormField chỉ form.tsx tự tham chiếu) → port tay bản react-hook-form của shadcn vào packages/ui, FormControl thay Radix Slot bằng useRender của Base UI (convention render prop). Rủi ro migration = 0.'
  - 'react-hook-form: peerDependencies ^7 + peerDependenciesMeta.optional=true + devDependencies ^7.81 (cho typecheck standalone). 2026 không dùng form nên không mang theo; 2025 đã có rhf ^7.81 sẵn.'
  - 'drawer (D-04): Dialog Base UI (Root/Trigger/Portal/Backdrop/Popup/Close/Title/Description) + trượt bằng data-[starting-style]/data-[ending-style]:translate-y-full, duration-300 ease-out. Nuốt prop `shouldScaleBackground` (vaul-ism) để không rò xuống DOM. Giữ đủ 10 export cũ. Easing/duration chờ user duyệt mắt ở plan 04.'
  - "BUG typecheck: mergeProps<'div'> từ chối key 'data-slot' (excess property trên object literal có type). Bỏ data-slot ở FormControl cho khớp badge (badge cũng không emit data-slot literal, dùng useRender). Không ảnh hưởng hành vi."
  - 'select part structure mới OK: SelectValue/SelectTrigger/SelectContent/SelectItem/SelectGroup/SelectLabel/SelectSeparator/SelectScroll{Up,Down}Button đủ. tooltip export TooltipProvider (key_links thỏa).'
status: complete — commit lớn 8a (plan 01+02) đóng
completed: 2026-07-12
---

# C08-02 — Summary (đóng commit lớn 8a)

## 8 lệnh CLI đợt 2 (D-02: mỗi component 1 lệnh riêng, trong packages/ui)

`select` → `tabs` → `textarea` → `toggle` → `toggle-group` → `tooltip` → `form`(rỗng) → `pagination`. Tất cả từ base-nova/@base-ui, 0 radix.

## 2 ngoại lệ port tay (có chủ đích)

- **form.tsx** — base-nova không ship form (xem DEVIATION D-05); port react-hook-form form, FormControl dùng `useRender` Base UI thay `@radix-ui/react-slot`.
- **drawer.tsx** — không có trong registry (D-04); dựng trên Dialog Base UI + trượt-từ-đáy, không vaul.

## Danh mục diff-port đợt 2 (giữ hành vi registry)

| Component                               | Ghi chú port                                                                                    |
| --------------------------------------- | ----------------------------------------------------------------------------------------------- |
| select                                  | part structure Base UI mới (SelectValue/Trigger/Content/Item…), đủ cho call site — giữ registry |
| tabs / textarea / toggle / toggle-group | vanilla, superset — giữ nguyên (toggle-group import ./toggle)                                   |
| tooltip                                 | có TooltipProvider (design-sync yêu cầu) — giữ nguyên                                           |
| pagination                              | import ./button — giữ nguyên                                                                    |
| form                                    | port tay RHF + useRender FormControl (DEVIATION D-05)                                           |
| drawer                                  | port tay Dialog Base UI (D-04)                                                                  |

## Sửa import self-contained (tiếp tục quy tắc plan 01)

7 component đợt 2 sinh `@/lib/utils`/`@/components/{button,toggle}` → đổi sang tương đối (../lib/utils, ./button, ./toggle). 0 `@/` còn trong src.

## Gate 8a

- 21 component; 0 `@radix-ui` trong ui/src; 0 vaul trong ui/package.json.
- react-hook-form: optional peer (in-deps=no); `pnpm --filter web-2026 ls react-hook-form` = rỗng ✅.
- `pnpm --filter @portfolio/ui typecheck` → 0.
- `pnpm build --filter=web-2026` → xanh 52.8s (không cache).

## Nợ chuyển tiếp

- Plan 03: `atoms/index.ts` thành shim re-export từ @portfolio/ui (D-06) + convert ~8 asChild→render (D-08, M-03) + đổi selector data-[state=…] → attr Base UI (D-09).
- Plan 04: gỡ 14 gói radix + vaul + cva/clsx/tailwind-merge (D-10), globals @source + token (D-11), smoke overlay + user nghiệm thu mắt (D-13). Trong đó duyệt easing/duration drawer.
