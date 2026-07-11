---
phase: C05-2025-drop-contentlayer
plan: 02
subsystem: renderer-2025
tags: [rsc, mdx, webpack-rsc-alias]
provides:
  - Bài viết 2025 render qua <MDXContent> RSC của @portfolio/mdx (hết body.code + new Function)
  - Map template tĩnh PostLayout/PostSimple/PostBanner; templates nhận BlogContent (toc từ page)
  - mdx-components 2025 chỉ còn override đặc thù (Image+Zoom, a→NavigationLink)
key-decisions:
  - "BUG GỐC RỄ ĐÃ TRIỆT (2h săn): TypeError recentlyCreatedOwnerStacks ở dev = pnpm bind peer next-mdx-remote với react@19.2.7 (variant của 2026) trong khi RSC layer Next 15.2 dùng react vendored 19.0 → 2 bộ internals trộn. THUỐC: transpilePackages += 'next-mdx-remote' (webpack bundle + alias react theo layer). Gỡ được ở C7. Các thuốc thử sai đường (đã revert/ghi lại): development:false cho MDX compile, xóa react lồng tay, nâng react 19.2."
  - "cssnano của webpack Next 15 vỡ với attr selector chứa space ([data-theme*=' ']) → styles.css package đổi sang code[data-theme] (pipeline luôn dual-theme nên tương đương)."
  - "Field 'type' của doc contentlayer hardcode 'blog' tại 3 template (giá trị duy nhất từng tồn tại)."
  - 'DEVIATION D-05: tập slug MỞ RỘNG 4→6 (2025 giờ serve cả 2 bài gốc 2026 — hệ quả tất yếu của content hợp nhất REQ-01). 4 URL cũ NGUYÊN VẸN (baseline ⊂ mới, không mất URL nào). Banner bài 2025 tạm vỡ trên :3001 — sync-content-assets là việc plan 03.'
status: complete
completed: 2026-07-11
---

# C05-02 — Summary

## Gate đã chạy

1. ✅ grep contentlayer/generated trong src = 0; grep meta-programming renderer cũ = 0.
2. ✅ Build 2025 full (2m14) + build 2026 (45s) + typecheck root — đều xanh.
3. ✅ Dev :3001 tự test browser: 6 route 200, log server SẠCH lỗi; bài Promise.all render trong giao diện 2025 với code block pipeline mới (title promises.js + line numbers + highlight), BlogMeta/tags nguyên vẹn.
4. ✅ Blog list :3001 hiện 6 bài (4 cũ + 2 bài 2026) có phân trang — "nâng 1 nâng cả 2" chạy ở app CŨ.
