---
phase: C07-2025-next16-dep-sweep
plan: 01
subsystem: core-2025
tags: [next16, turbopack, barrel-export-star]
provides:
  - web-2025 chạy Next 16.2.10 + React 19.2.7 + TS 5.9 trên TURBOPACK — build 33s (trước 1m21 webpack), compile 9s
  - proxy.ts (convention 16), next.config object thuần (withNextIntl giữ; analyzer/svgr/webpack block gỡ), grid-background SVG inline
  - GỠ 3 workaround thời Next 15 (đúng dự kiến C5/C6): transpilePackages next-mdx-remote, react pin 19.0.0 exact → ^19.2.7, next-mdx-remote v5 → v6
key-decisions:
  - "BUG TURBOPACK BẮT ĐƯỢC + TRIỆT: `export *` trong barrel qua ranh giới 'use client' làm Object.seal vỡ trên client-reference Proxy (TypeError ownKeys… non-extensible ở collect page data). Fix: convert TOÀN BỘ export * của 4 barrel (atoms/molecules/organisms/templates) sang NAMED exports bằng script — 0 export * còn lại. Đây cũng là tiền đề tốt cho shim C8."
  - 'Codemod @next/codemod upgrade là interactive — áp tay (params đã Promise từ 15.2, thực tế chỉ cần proxy rename + config shape). DEVIATION so D-02, kết quả tương đương.'
  - 'Next 16 TỪ CHỐI NextConfig dạng hàm — bắt buộc object thuần export default withNextIntl(config).'
  - 'pnpm dính link rỗng khi đổi version cùng gói nhiều lần (store dir hollow, install/--force đều "up to date") — thuốc: remove+add lại gói, nặng hơn thì xóa node_modules cài sạch (13.7s).'
status: complete
completed: 2026-07-12
---

# C07-01 — Summary

Verify: build Turbopack 2025 (33s, RSS chạy) + 2026 (19s) + typecheck root (9s) đều xanh; react@19.2.7 + next@16.2.10 duy nhất toàn repo (pnpm why cả 2 app); grep svgr/bundle-analyzer/webpack trong config = 0.
