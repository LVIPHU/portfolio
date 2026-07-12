---
phase: C12-ci-cleanup
plan: 01
subsystem: ci
tags: [ci-check, dead-link-crawler]
provides:
  - scripts/check-dead-links.mjs — crawler link chết Node thuần (0 dep), spawn next start 2 app, BFS + anchor check
  - script root check-links + ci-check (prettier → typecheck → build → dead-links)
key-decisions:
  - 'Crawler (D-01/M-02): mặc định tự spawn `pnpm --filter <app> exec next start -p <port>` (3000/3001), poll ready, crawl, taskkill /T /F khi xong; --base=url,... để crawl server có sẵn. BFS từ / và /en mỗi app, concurrency 6, fetch timeout 15s.'
  - 'BUG tự bắt khi test: href trong HTML entity-encode (&amp;) → phải htmlDecode trước fetch; và /_next/image?url=... KHÔNG phải link điều hướng (thất bại = ảnh remote drive flaky, không phải link chết) → skip mọi /_next/. Sau fix: 2026 62 trang / 2025 32 trang, 0 link chết.'
  - 'Anchor #frag (D-02): kiểm id tồn tại ở trang đích, mặc định error, --anchors=warn hạ cấp. Link ngoài: chỉ new URL() kiểm định dạng, KHÔNG fetch (tránh flaky).'
  - 'ci-check (D-03): prettier --check . && turbo typecheck && turbo build && crawler. Chính ci-check bắt được scripts/check-dead-links.mjs chưa format (chứng minh gate prettier sống) → prettier --write → xanh.'
  - 'DISK: .turbo cache phình 26GB làm D: đầy 100% (Turbopack IO error 112) → xóa .turbo (cache tái tạo) giải phóng 26GB. Ghi nhớ dọn cache định kỳ.'
status: complete
completed: 2026-07-12
---

# C12-01 — Summary

## Gate 1 lệnh

- `scripts/check-dead-links.mjs`: crawler BFS, spawn/kill next start, htmlDecode href, skip /_next/, anchor check, external format-only.
- `pnpm check-links` + `pnpm ci-check` (chuỗi 4 bước).

## Bằng chứng (D-04 negative test)

1. ci-check sạch → **exit 0** (prettier + typecheck + build 2 app 1m4s + crawler 0 link chết).
2. Chèn `[link gãy](/duong-dan-khong-ton-tai-xyz)` vào hello-world.vi.mdx → rebuild 2026 → crawler báo `✗ [(link tới)] → /duong-dan-khong-ton-tai-xyz (HTTP 404)` → **FAIL exit 1**.
3. Hoàn lại + rebuild → git sạch, crawler xanh lại.

## Ngoài lề

- Xóa .turbo 26GB (D: full 100%).
- Prettier gate bắt file crawler chưa format (đã fix).

## Nợ chuyển plan 02/03

- Dọn xác code grep-driven (fade-content, back-to-posts dup, hooks trùng, .ds-css…) + knip tham khảo.
- CLAUDE.md viết lại (kiến trúc 3 package, bỏ ghi chú contentlayer/PowerShell chết); PLAN-apps-2025 đóng dấu superseded.
- design-sync re-sync (plan 03) + hỏi user có thêm .github/workflows/ci.yml không.
