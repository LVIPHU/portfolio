---
phase: C08-base-ui-unification
plan: 03
subsystem: 2025-ui-adoption
tags: [atoms-shim, aschild-to-render, base-ui-select-api]
provides:
  - apps/2025 tiêu thụ 21 component shadcn-derived từ @portfolio/ui qua shim atoms/index.ts (D-06); 21 file atoms trùng đã xóa (D-07)
  - 0 asChild trong apps/2025/src — 8 call site convert sang render prop Base UI (D-08, M-03)
  - transpilePackages 2025 += @portfolio/ui
key-decisions:
  - 'Shim atoms/index.ts NAMED exports (không export * — bug Turbopack ownKeys C7): 21 component re-export từ @portfolio/ui + 22 atom local D-12 giữ export named. Bỏ PopoverAnchor khỏi shim (0 call site dùng, @portfolio/ui không export). Mọi tên khác đối chiếu đủ với barrel ui (card/pagination/tabs/select/tooltip khớp).'
  - 'BUG API bắt qua typecheck: Base UI Select onValueChange trả `string | null` (Radix chỉ `string`) → locale-switch.tsx handler nhận string|null + guard sớm. Đây là kiểu lỗi D-09 điển hình — typecheck web-2025 là lưới bắt.'
  - '8 asChild→render (M-03): social-icons(Button→NavigationLink), project-card(2× Button→NavigationLink), social-share(DropdownMenuTrigger→Button), experience(HoverCardTrigger→div), footer(TooltipTrigger→SocialIcons), technologies(TooltipTrigger→NavigationLink), about(TooltipTrigger→Button). Quy tắc: element cũ vào render (bỏ children), children/icon/text giữ làm children component cha.'
  - 'social-icons.tsx (atom Ở LẠI D-12) từng import Button từ @/components/atoms/button (bị xóa) → đổi import Button sang @portfolio/ui trực tiếp (tránh vòng lặp qua barrel).'
  - 'STRAGGLER phát hiện: link-preview.tsx (D-12, ở lại) import @radix-ui/react-hover-card TRỰC TIẾP + framer-motion (không dùng HoverCard chung). Chưa đụng ở plan 03 (gate là asChild=0 + build); chuyển sang plan 04 (D-10 gỡ radix ép convert sang PreviewCard Base UI, giữ framer-motion cho C9). Còn 1 ref --radix-hover-card-content-transform-origin ở đây (D-09) xử ở plan 04.'
status: complete — 8b-1
completed: 2026-07-12
---

# C08-03 — Summary (8b-1)

## Chuyển 2025 sang @portfolio/ui

- `atoms/index.ts` → shim: 21 component shadcn-derived re-export từ `@portfolio/ui`, 22 atom đặc thù (D-12) giữ export named local. Organisms/templates KHÔNG đổi dòng import nào (vẫn `@/components/atoms`).
- Xóa 21 file atoms shadcn-derived (còn 22 file .tsx trong atoms/).
- `next.config.ts`: transpilePackages += `@portfolio/ui`.

## asChild → render (0 còn lại)

8 chỗ / 7 file convert theo M-03; grep `asChild` toàn src = 0 (6 occurrence trong badge/button/select.tsx biến mất cùng file xóa).

## Gate

- `pnpm --filter web-2025 typecheck` → 0 (sau fix Select onValueChange string|null).
- `pnpm build --filter=web-2025` → xanh 2m29s (Turbopack + shim named-export OK, RSS post-build chạy).
- `pnpm build --filter=web-2026` vẫn xanh (8a) — không hồi quy.

## Nợ chuyển plan 04

- Gỡ 14 gói `@radix-ui/*` + vaul + cva/clsx/tailwind-merge (D-10) — trong đó CONVERT link-preview.tsx từ @radix-ui/react-hover-card → PreviewCard Base UI (giữ framer-motion, C9 mới port motion) + đổi `--radix-hover-card-content-transform-origin` → `--transform-origin` (D-09).
- globals.css: `@source '../../../../packages/ui/src'` + token thiếu (D-11).
- Smoke overlay + user nghiệm thu mắt (D-13): contact modal (parallel route, nợ từ C6/C7), select keyboard, dropdown, tooltip, hover-card, drawer mobile, drawer easing/duration.
