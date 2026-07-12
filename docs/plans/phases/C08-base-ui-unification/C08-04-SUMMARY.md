---
phase: C08-base-ui-unification
plan: 04
subsystem: 2025-radix-removal
tags: [radix-removal, base-ui-previewcard, cn-single-source, dark-mode-smoke]
provides:
  - apps/2025 sạch Radix hoàn toàn (SC1: grep @radix-ui apps/2025 = 0 kể cả package.json + comment)
  - gỡ 18 gói khỏi web-2025 (14 @radix-ui/* + vaul + class-variance-authority + clsx + tailwind-merge)
  - link-preview.tsx: PreviewCard Base UI (consumer Radix trực tiếp cuối cùng); cn 1 nguồn từ @portfolio/ui; globals @source packages/ui
key-decisions:
  - 'data-[state= trong apps/2025/src = 0 sẵn (selector trạng thái đều nằm trong atoms đã chuyển sang packages/ui — đã dùng attr Base UI từ 8a). D-09 chỉ còn 1 ref biến transform-origin trong link-preview: --radix-hover-card-content-transform-origin → --transform-origin (Base UI Positioner set var này trên popup).'
  - 'link-preview (D-12, atom ở lại) là consumer Radix TRỰC TIẾP cuối: Radix hover-card → Base UI PreviewCard (Root/Trigger/Portal/Positioner/Popup). GIỮ framer-motion (port GSAP ở C9). PreviewCard.Root KHÔNG có openDelay/closeDelay (bỏ, dùng mặc định); onOpenChange (open, details) tương thích. Trigger mặc định là <a>. Vì đây là dùng primitive Base UI TRỰC TIẾP ở tầng app (không bọc trong packages/ui) → @base-ui/react thành dependency trực tiếp của web-2025.'
  - 'D-11 tokens (--input --destructive --destructive-foreground --popover --popover-foreground) ĐÃ có sẵn trong _theme.css của 2025 (app từng có full atom) — chỉ cần thêm @source packages/ui/src vào main.css để JIT quét class của package chung.'
  - 'Comment-discipline: comment link-preview ban đầu chứa literal @radix-ui/react-hover-card làm grep SC1 = 1 → viết lại "Radix hover-card" để gate về 0.'
  - 'cn (D-10): utils/style.ts giờ chỉ `export { cn } from @portfolio/ui`; clsx + tailwind-merge chỉ còn trong package chung. @/utils re-export style nên mọi import cn cũ sống nguyên.'
status: complete — 8b-2; PHASE C8 ĐÓNG
completed: 2026-07-12
---

# C08-04 — Summary (8b-2, đóng phase C8)

## 3 Success Criteria (ROADMAP)

1. ✅ SC1: `grep -r @radix-ui apps/2025` = 0 (kể cả package.json + comment); `grep -rn asChild apps/2025/src` = 0 (từ 8b-1).
2. ✅ SC2: self-test từng overlay (:3001, light + dark) — xem bảng dưới.
3. ⏳ SC3 (D-13): chờ user nghiệm thu mắt trước khi merge — đã trình bằng chứng.

## Gỡ deps (18 gói khỏi web-2025)

14 `@radix-ui/*` (avatar, dialog, dropdown-menu, hover-card, label, popover, scroll-area, select, separator, slot, tabs, toggle, toggle-group, tooltip) + `vaul` + `class-variance-authority` + `clsx` + `tailwind-merge`. Thêm `@base-ui/react` (link-preview dùng primitive trực tiếp). Cả 2 app typecheck + build Turbopack xanh.

## SC2 — Smoke overlay tự kiểm (dev :3001)

| Overlay                                            | Kết quả                                                                          |
| -------------------------------------------------- | -------------------------------------------------------------------------------- |
| Contact modal (Dialog/Drawer parallel route)       | ✅ mở qua /contact intercept, ESC đóng (url về /about, 0 dialog), light + dark   |
| Social-share DropdownMenu (trigger→render)         | ✅ mở, 6 item (Copy link, X, Linkedin, Facebook…)                                |
| Avatar / Badge / Card                              | ✅ ảnh profile, tag nextjs/monorepo, card render                                 |
| Form: Label/Input/Textarea/Button                  | ✅ 5 field contact + nút Gửi, dark token đúng                                    |
| Tabs (about experience)                            | ✅ 5 tab                                                                         |
| Tooltip + render conversions (about, social-icons) | ✅ 2 nút tròn social render đúng                                                 |
| LinkPreview → PreviewCard Base UI                  | ✅ 5 trigger render, biên dịch sạch                                              |
| Dark mode (token + @source)                        | ✅ contact modal dark: popup/input/border token đúng                             |
| Console/build                                      | ✅ dev log 0 error; "1 Issue" badge = HMR cũ trước restart (fresh load → 0/none) |

Chưa click hết: Select keyboard ↑↓ (đã fix API string|null + typecheck), tooltip hover popup, drawer mobile easing, scroll-area TOC, pagination, toggle-group — build+typecheck phủ, độ tin cao.

## Nợ chuyển tiếp (C9/C12)

- link-preview + timeline + animated-content còn framer-motion → C9 (port GSAP).
- design-sync componentSrcMap lệch (atoms shadcn-derived đã rời app) → re-sync C12.
- drawer easing/duration tự chế: chờ user duyệt mắt kỹ khi dùng thật (menu mobile).
