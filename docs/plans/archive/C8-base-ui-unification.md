# C8 — UI hợp nhất: full Base UI trong packages/ui, apps/2025 bỏ Radix

> **Phụ thuộc:** C7 (stack 2025 đã mới). **Chặn:** C9 (một số component đích của GSAP nằm trong atoms sẽ dời).
> **Ước lượng:** ~5–7h, **2 commit**: `feat(ui): full Base UI component kit` (8a) + `feat(2025)!: adopt @portfolio/ui, drop radix` (8b).
> Phase chạm UI nhiều nhất — **user nghiệm thu bằng mắt trước khi đóng**.

## 1. Mục tiêu & phạm vi

- `packages/ui` từ 4 component (button, badge, card, separator — C1) lên **bộ đầy đủ**: mọi primitive 2 app cần.
- 2025 xóa toàn bộ atoms gốc shadcn/Radix, tiêu thụ `@portfolio/ui`; gỡ **14 gói @radix-ui + vaul + cva/clsx/tailwind-merge** khỏi deps app.
- Atoms đặc thù app **ở lại app** (không cào bằng).

## 2. Hiện trạng (facts)

- packages/ui: style `base-nova`, `@base-ui/react ^1.6.0`, components.json chuẩn đã chạy được `shadcn add` (kỹ thuật reference-app từ C1).
- 2025 có 43 atoms; nhóm shadcn-derived cần thay: `avatar, dialog, dropdown-menu, hover-card, label, popover, scroll-area, select, tabs, toggle, toggle-group, tooltip, separator, badge, button, card, input, textarea, form, pagination, drawer(vaul)`.
- **15 chỗ `asChild` / 10 file** (đã đếm): `badge.tsx`(3—chính là component sẽ xóa), `button.tsx`(3—nt), `about.tsx`(1), `technologies.tsx`(1), `social-icons.tsx`(1), `select.tsx`(1—xóa), `footer.tsx`(1), `experience.tsx`(1), `project-card.tsx`(2), `social-share.tsx`(1). Sau khi xóa atoms, **call site thật cần convert ~8 chỗ/7 file**.
- Base UI khác Radix: không `asChild` (dùng prop `render`), data-attr trạng thái khác (`data-[state=open]` → `data-[open]`, `data-[popup-open]`…), một số component đổi cấu trúc part (Select có `Select.Value`/`Select.Icon` riêng…).
- Atoms ở lại 2025: `logo, grid-background, video-card, views-counter, authors, social-icons, toc, search-articles, image, container, blur, boxes, grit-background, navigation-link, discuss-on-x, edit-on-github, growing-underline, back-to-posts, timeline, link-preview, animated-content, fade-content` (3 file cuối chờ C9/C12 xử).

## 3. Cấu trúc file đích

```
packages/ui/src/
├── components/
│   ├── button.tsx badge.tsx card.tsx separator.tsx     # sẵn từ C1
│   ├── avatar.tsx dialog.tsx dropdown-menu.tsx hover-card.tsx
│   ├── input.tsx label.tsx popover.tsx scroll-area.tsx select.tsx
│   ├── tabs.tsx textarea.tsx toggle.tsx toggle-group.tsx tooltip.tsx
│   ├── form.tsx pagination.tsx
│   └── drawer.tsx        # port thủ công: vaul không có bản Base UI → dùng Dialog Base UI + CSS
├── index.ts               # barrel đầy đủ
└── ...

apps/2025/src/components/atoms/
├── index.ts               # THÀNH SHIM: export * from '@portfolio/ui' + export atoms còn lại
└── (xóa ~21 file shadcn-derived)
```

## 4. Hướng code chi tiết

### 8a — Lấp đầy packages/ui

1. Trong `packages/ui`: `pnpm dlx shadcn@latest add avatar dialog dropdown-menu hover-card input label popover scroll-area select tabs textarea toggle toggle-group tooltip form pagination` (registry base-nova → code Base UI, data-slot).
2. **Diff từng component với bản atoms 2025** (2025 có custom: kích thước, class, sub-component thêm). Quy tắc: giữ hành vi registry, port custom **class/variant** của 2025 vào (như đã làm button icon-sm/icon-lg ở C1). Ghi lại mọi custom đã port vào mô tả commit.
3. `drawer.tsx`: vaul là Radix-based — không mang vào ui. Port bằng `Dialog` của Base UI + transform/transition CSS cho hiệu ứng trượt đáy (đủ cho mobile menu 2025); giữ API `Drawer/DrawerTrigger/DrawerContent` để call site không đổi.
4. `form.tsx`: registry form của shadcn dựa react-hook-form — thêm `react-hook-form` vào **peerDependencies** của packages/ui (app cung cấp), không dependencies (2026 chưa dùng form thì không phải cài — pnpm peer auto-install lo phần còn lại).
5. Barrel `index.ts` export hết; `pnpm build --filter=web-2026` xác nhận không vỡ (2026 mới dùng 4 component cũ — không đổi hành vi). **Commit 8a.**

### 8b — 2025 chuyển sang @portfolio/ui

1. `atoms/index.ts` thành shim:
   ```ts
   // shadcn-derived → package chung
   export { Button, buttonVariants, Badge, Card, ..., Tooltip, TooltipProvider } from '@portfolio/ui'
   // atoms đặc thù app — giữ nguyên
   export * from './logo'
   ...
   ```
   Organisms/templates giữ nguyên `import { X } from '@/components/atoms'` — **churn tối thiểu**, chỉ file nào import path file cụ thể (`@/components/atoms/button`) mới phải sửa (grep để tìm).
2. Xóa ~21 file atoms shadcn-derived.
3. Convert ~8 call site `asChild` → `render`:
   ```tsx
   // Radix:  <Button asChild><Link href="...">Xem</Link></Button>
   // Base UI: <Button render={<Link href="..." />}>Xem</Button>
   ```
4. `grep -rn "data-\[state=" apps/2025/src` → đổi selector Tailwind sang attr Base UI (`data-[open]`, `data-[closed]`, `data-[highlighted]`, `data-[checked]`…) — tra bảng attr trong docs Base UI từng component.
5. `globals.css` 2025: thêm `@source '../../../../packages/ui/src';` + bổ sung token còn thiếu (đối chiếu danh sách token C1 đã thêm cho 2026: `--input --destructive --popover…`).
6. `next.config.ts`: `transpilePackages += '@portfolio/ui'`.
7. Gỡ deps 2025: 14 `@radix-ui/*`, `vaul`, `class-variance-authority`, `clsx`, `tailwind-merge` (utils `cn` giờ import từ `@portfolio/ui`); grep xác nhận 0 import trước khi xóa. **Commit 8b.**

## 5. Design pattern áp dụng

- **Facade / re-export shim**: `atoms/index.ts` là façade — nguồn component đổi (local → package) mà 60+ consumer không biết. Shim này là **trạng thái đích lâu dài** của 2025 (app cũ giữ ergonomics cũ), không phải nợ.
- **Open component pattern của shadcn**: component sống trong repo (packages/ui/src), không phải node_modules — sửa trực tiếp, không chờ upstream; registry chỉ là nguồn khởi tạo.
- **Peer dependency cho framework-coupling**: react-hook-form là peer — package ui không ép app nào chưa cần form phải mang theo.
- **Composition qua `render` prop** (Base UI): thay slot-injection ngầm của `asChild` bằng composition tường minh — dễ type, dễ đọc.

## 6. Tối ưu

- Base UI tree-shake tốt (`@base-ui/react` import per-part) — sau phase, đo lại first-load JS trang nặng overlay nhất (blog post: tooltip+popover+select) so trước.
- Hết double-source (Radix trong app + Base UI trong ui pkg từ C1) → node_modules nhẹ đi 14 gói.

## 7. Testing & gate nghiệm thu

1. `grep -r "@radix-ui\|asChild\|vaul" apps/2025/src` = 0; `pnpm ls "@radix-ui/*" --filter web-2025` rỗng.
2. `pnpm typecheck` + build cả 2 xanh.
3. Smoke `:3001` **từng overlay một** (điểm dễ vỡ nhất là select/dropdown vì Base UI đổi part structure):
   - Contact modal (dialog qua parallel route) mở/đóng/ESC/click-outside.
   - Setting (dropdown/select): mở, chọn, keyboard navigation ↑↓ Enter.
   - Locale switch, theme switch (dropdown), tabs trang about, tooltip icon xã hội, hover-card, drawer menu mobile (viewport hẹp), toggle-group grid/list ở blog, pagination, scroll-area TOC, form contact (focus ring, `aria-invalid` khi lỗi).
   - Dark mode toàn bộ các overlay trên.
4. Smoke `:3000` (2026) 4 component cũ không đổi hành vi.
5. **User duyệt bằng mắt** cả 2 site trước khi merge; push → 2 deploy xanh.
6. Hậu kiểm design-sync: các preview atoms cũ sẽ lệch — ghi nợ, re-sync ở C12 (không chặn phase).

## 8. Rủi ro & rollback

| Rủi ro                                                       | Phòng bị                                                                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| Base UI khác hành vi Radix (focus trap, portal, positioning) | smoke từng overlay có kịch bản; giữ mỗi component 1 lần `--diff` trước khi ghi đè                             |
| Drawer tự chế kém mượt hơn vaul                              | chỉ dùng cho mobile menu — hiệu ứng đơn giản; nếu tệ, giữ vaul lại riêng 2025 (chấp nhận 1 gói lệch, ghi chú) |
| Form + react-hook-form peer trục trặc pnpm                   | kiểm `pnpm why react-hook-form` sau install                                                                   |
| Shim export trùng tên với atom còn lại                       | typecheck bắt ngay (duplicate export)                                                                         |

Rollback: 8b là 1 commit — revert là 2025 quay về atoms cũ (file xóa nằm trong git); 8a độc lập không ảnh hưởng ai.
