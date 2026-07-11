# Phase C8: UI hợp nhất — full Base UI, 2025 bỏ Radix — Context

**Thu thập:** 2026-07-11
**Trạng thái:** Sẵn sàng lập plan

<domain>
## Ranh giới phase

`packages/ui` từ 4 component (C1) lên bộ đầy đủ ~20 component Base UI; `apps/2025` xóa toàn bộ atoms gốc shadcn/Radix, tiêu thụ `@portfolio/ui` qua shim re-export, gỡ 14 gói `@radix-ui/*` + `vaul` + `cva/clsx/tailwind-merge`. Atoms đặc thù app Ở LẠI app. 2 commit lớn: 8a (lấp đầy packages/ui — plan 01+02), 8b (2025 chuyển sang — plan 03+04). KHÔNG thuộc phase: animation (C9), component 2026 mới, redesign theme (mỗi app giữ token riêng).
</domain>

<decisions>
## Quyết định đã khóa

### Cách cài & nguồn component

- **D-01:** Chuyển HẲN Base UI (`@base-ui/react ^1.6`), không ở lại Radix — quyết định user. Style registry `base-nova` (components.json của packages/ui đã cấu hình từ C1, `shadcn add` đã chạy được trong package con).
- **D-02:** **Mọi component cài bằng CLI, MỖI COMPONENT MỘT LỆNH RIÊNG** chạy trong `packages/ui`: `pnpm dlx shadcn@latest add <name>` — yêu cầu tường minh của user. KHÔNG chép code từ docs/registry vào tay; KHÔNG gộp nhiều component 1 lệnh (mỗi lệnh 1 dòng để chạy/diff/rollback từng cái). Sau MỖI lệnh: diff file sinh ra với bản atoms 2025 tương ứng để port custom (như C1 đã làm button icon-sm/icon-lg).
- **D-03:** 16 component add qua CLI: avatar, dialog, dropdown-menu, hover-card, input, label, popover, scroll-area, select, tabs, textarea, toggle, toggle-group, tooltip, form, pagination. Danh sách lệnh đầy đủ ở M-01/M-02.
- **D-04:** `drawer` KHÔNG có trong registry Base UI → port TAY bằng `Dialog` Base UI + CSS transform/transition trượt đáy; GIỮ API `Drawer/DrawerTrigger/DrawerContent` để call site 2025 không đổi. vaul (Radix-based) không vào packages/ui. Nếu bản tự chế kém mượt: fallback giữ vaul riêng trong 2025, ghi chú lệch — chấp nhận.
- **D-05:** `form.tsx` dựa react-hook-form → `react-hook-form` vào **peerDependencies** của packages/ui (app cung cấp), không dependencies — 2026 chưa dùng form thì không bị ép mang theo.

### 2025 chuyển đổi (8b)

- **D-06:** `atoms/index.ts` thành **shim re-export**: component shadcn-derived export từ `@portfolio/ui`, atoms đặc thù giữ `export * from './x'`. Organisms/templates giữ nguyên `import ... from '@/components/atoms'` — churn tối thiểu; shim là TRẠNG THÁI ĐÍCH lâu dài, không phải nợ. File nào import path cụ thể (`@/components/atoms/button`) → grep sửa về barrel.
- **D-07:** Xóa ~21 file atoms shadcn-derived: avatar, badge, button, card, dialog, drawer, dropdown-menu, form, hover-card, input, label, pagination, popover, scroll-area, select, separator, tabs, textarea, toggle, toggle-group, tooltip.
- **D-08:** Convert `asChild` → `render` prop (Base UI không có asChild): 15 occurrence/10 file nhưng 6 nằm trong badge/button/select.tsx sẽ bị xóa → thực convert **~8 call site/7 file**: about.tsx(1), technologies.tsx(1), social-icons.tsx(1), footer.tsx(1), experience.tsx(1), project-card.tsx(2), social-share.tsx(1). Mẫu M-03.
- **D-09:** Đổi selector trạng thái: grep `data-[state=` → attr Base UI (`data-[open]`, `data-[closed]`, `data-[highlighted]`, `data-[checked]`, `data-[popup-open]`…) — tra docs Base UI TỪNG component, không đoán.
- **D-10:** Gỡ deps 2025 sau khi grep 0 import: 14 gói `@radix-ui/*`, `vaul` (nếu D-04 không fallback), `class-variance-authority`, `clsx`, `tailwind-merge` (cn import từ `@portfolio/ui`).
- **D-11:** globals.css 2025: thêm `@source '../../../../packages/ui/src';` + bổ token thiếu đối chiếu danh sách C1 đã thêm cho 2026 (`--input --destructive --destructive-foreground --popover --popover-foreground`) ở :root/.dark/@theme inline.
- **D-12:** Atoms Ở LẠI 2025 (không cào bằng): logo, grid-background, video-card, views-counter, authors, social-icons, toc, search-articles, image, container, blur, boxes, grit-background, navigation-link, discuss-on-x, edit-on-github, growing-underline, back-to-posts, timeline, link-preview, animated-content, fade-content (3 file cuối chờ C9/C12).
- **D-13:** Phase chạm UI nhiều nhất — **user nghiệm thu bằng mắt từng overlay trước khi merge**; design-sync sẽ lệch, re-sync ở C12 (không chặn phase).

### Claude tự quyết

- Thứ tự add 16 component trong plan 01/02 (miễn mỗi lệnh riêng).
- Chi tiết CSS drawer tự chế (duration/easing) — miễn user duyệt mắt ở plan 04.
- Giữ hay bỏ sub-component 2025 thêm tay khi diff (quy tắc: giữ hành vi registry, port custom class/variant).
</decisions>

<specifics>
## Ý tưởng & mẫu cụ thể

**M-01 — 8 lệnh add plan 01 (chạy tuần tự trong `packages/ui`, sau mỗi lệnh diff-port custom 2025):**

```bash
pnpm dlx shadcn@latest add avatar
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add dropdown-menu
pnpm dlx shadcn@latest add hover-card
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add label
pnpm dlx shadcn@latest add popover
pnpm dlx shadcn@latest add scroll-area
```

**M-02 — 8 lệnh add plan 02:**

```bash
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add tabs
pnpm dlx shadcn@latest add textarea
pnpm dlx shadcn@latest add toggle
pnpm dlx shadcn@latest add toggle-group
pnpm dlx shadcn@latest add tooltip
pnpm dlx shadcn@latest add form
pnpm dlx shadcn@latest add pagination
```

**M-03 — asChild → render:**

```tsx
// Radix cũ:   <Button asChild><Link href="/x">Xem</Link></Button>
// Base UI mới: <Button render={<Link href="/x" />}>Xem</Button>
```

**M-04 — Khuôn shim atoms/index.ts:**

```ts
// shadcn-derived → package chung
export {
  Button,
  buttonVariants,
  Badge,
  Card,
  CardContent,
  CardHeader,
  /*...,*/ Tooltip,
  TooltipProvider,
} from '@portfolio/ui'
// atoms đặc thù app — giữ nguyên
export * from './logo'
export * from './image'
// ...
```

</specifics>

<canonical_refs>

## Tài liệu gốc phải đọc

- `docs/plans/ROADMAP.md` §Phase C8 — goal, REQ-03/REQ-10, 3 success criteria
- `packages/ui/components.json` — cấu hình registry base-nova đã chạy được từ C1
- `packages/ui/src/components/button.tsx` — mẫu chuẩn của việc "diff-port custom" (icon-sm/icon-lg đã port ở C1)
- `apps/2025/src/components/atoms/index.ts` — barrel sẽ thành shim
- Docs Base UI (base-ui.com) — bảng data-attr từng component cho D-09
  </canonical_refs>

<code_context>

## Hiện trạng codebase (facts đã xác minh)

### Tài sản tái dùng

- packages/ui (C1): button, badge, card, separator + 7 hooks + cn(); components.json style base-nova; kỹ thuật reference-app đã giải quyết `shadcn add` trong package con (shadcn init fail framework detection — KHÔNG chạy init lại, chỉ add).
- 2026 đã tiêu thụ 4 component — plan 01/02 không được làm vỡ hành vi hiện có (build web-2026 là gate).

### Số liệu grep

- `asChild`: 15 occurrence/10 file — badge.tsx(3), button.tsx(3), select.tsx(1) là file sẽ xóa; call site thật: about(1), technologies(1), social-icons(1), footer(1), experience(1), project-card(2), social-share(1).
- 14 gói @radix-ui trong apps/2025/package.json: avatar, dialog, dropdown-menu, hover-card, label, popover, scroll-area, select, separator, slot, tabs, toggle, toggle-group, tooltip.
- 43 atoms hiện có; nhóm xóa D-07 ~21 file, nhóm ở lại D-12 ~22 file.

### Điểm dễ vỡ

- Select/DropdownMenu: Base UI đổi part structure (Select.Value/Select.Icon riêng) — smoke keyboard navigation bắt buộc.
- Dialog trong parallel route (@modal contact): focus trap + close hành vi khác Radix — smoke riêng.
- TooltipProvider: design-sync conventions ghi Tooltip cần provider — kiểm export TooltipProvider từ ui.
  </code_context>

<deferred>
## Ý tưởng hoãn

- Port animation atoms (animated-content, link-preview, timeline...) — Phase C9
- Xóa fade-content.tsx + dup back-to-posts.tsx — Phase C12
- design-sync re-sync componentSrcMap mới — Phase C12
- Đo first-load JS trước/sau để báo cáo tree-shake Base UI — ghi số trong SUMMARY plan 04 nếu tiện, không gate
</deferred>

---

_Phase: C08-base-ui-unification_
