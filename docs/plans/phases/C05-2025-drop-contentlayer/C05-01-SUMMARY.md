---
phase: C05-2025-drop-contentlayer
plan: 01
subsystem: content-2025
tags: [facade, strangler-fig, pnpm-peers]
provides:
  - utils/content-core.ts (helper thuần, client-safe, đi qua barrel @/utils)
  - utils/content.ts (data fns fs-backed — CHỈ import trực tiếp từ server code)
  - 13 consumer sống trên @portfolio/content; PostMeta có thêm filePath
affects: [C05-03, C05-04, C07]
key-decisions:
  - 'DEVIATION: gate typecheck của plan 01 dời về cuối plan 02 — type của [...slug]/templates chảy từ facade, 2 plan không tách được ở tầng type (đã lường trong thi công, ghi tại đây).'
  - 'PHÁT HIỆN KIẾN TRÚC: facade 1 file làm client bundle dính node:fs (barrel @/utils ← avatar.tsx client). Fix: TÁCH 2 TẦNG content-core (thuần) / content (fs) — barrel chỉ export tầng thuần. Pattern này C6+ phải giữ.'
  - 'pnpm autoInstallPeers: false (pnpm-workspace.yaml — pnpm 11 không đọc .npmrc cho key này): trước đó packages/{mdx,ui} bị nhét react@19.2.7 + next@16 lồng, trộn internals với Next 15.2. Hệ quả: shiki (peer của rehype-pretty-code) phải khai tường minh ở packages/mdx + apps/2025.'
  - 'next-mdx-remote hạ v6→v5 (v6 đòi internals react 19.1+, Next 15.2 vendor 19.0); react 2025 PIN EXACT 19.0.0 (thử nâng 19.2.7 → lỗi dev app-wide, revert; unify 19.2 để dành C7 cùng Next 16).'
  - 'contentlayer.config tự chứa 2 helper (esbuild của nó không resolve nổi transitive deps của facade — ConfigReadError gray-matter); cả config chết ở plan 04.'
  - 'Next 15.2 typegen: generateMetadata của layout có @modal đòi param phủ {children, modal} REQUIRED — widen type (lỗi tiềm ẩn lộ ra khi cache invalidate).'
status: complete
completed: 2026-07-11
---

# C05-01 — Summary

Verify: grep contentlayer/generated trong src = 1 file duy nhất ([...slug] — plan 02 xử); build + typecheck xanh sau plan 02 (xem C05-02-SUMMARY).
