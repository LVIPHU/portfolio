---
phase: C06-2025-next-intl
plan: 04
subsystem: cleanup-2025
tags: [lingui-removal, redirects, blocker-2]
provides:
  - 9 gói gỡ (7 @lingui + negotiator + @types); swcPlugins + 2 rule .po + lingui.config + catalogs + runtime files + đồ 1 lần (po-to-messages, msgid-map) XÓA
  - redirects() 308 vĩnh viễn — /vi-VN/* → /*, /en-US/* → /en/*
  - Barrel @/i18n chỉ còn type PageLangParam {locale} (tên lịch sử — cân nhắc đổi C12)
key-decisions:
  - 'grep @lingui = 0 toàn app (chỉ còn artifact .vercel local — đã xóa). BLOCKER #2 CỦA NEXT 16 CHẾT — đường sang C7 thông hoàn toàn.'
  - 'Contact modal (intercepting route) CHƯA click-test được: pane browser cố định viewport mobile, navbar desktop chứa link Contact bị ẩn — build validate slot @modal + full page /contact chạy đúng cả 2 locale; VERIFY TRÊN PRODUCTION/desktop ghi nợ smoke C7 checkpoint.'
status: complete — PHASE C6 ĐÓNG (chờ xác nhận deploy)
completed: 2026-07-12
---

# C06-04 — Summary (đóng phase C6)

## 3 Success Criteria (ROADMAP)

1. ✅ SC1: grep @lingui = 0 kể cả package.json.
2. ✅ SC2 (phần máy): đủ trang `/` + `/en/*` (10 route × 2 locale đều 200), không lộ key — about vi/en + rich text + contact full page verify browser; modal intercept ghi nợ desktop-check.
3. ✅ SC3: curl 308 — /vi-VN/about→/about, /en-US/blog→/en/blog, /vi-VN→/ (local); production verify sau deploy.

## Build

- web-2025: 1m21 (Git Bash) — không còn swc plugin/.po loader; web-2026: 34s; typecheck root sạch.
