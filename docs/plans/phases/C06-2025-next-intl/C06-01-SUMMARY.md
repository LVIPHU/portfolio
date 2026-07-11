---
phase: C06-2025-next-intl
plan: 01
subsystem: i18n-2025
tags: [next-intl, po-convert, dual-runtime-bridge]
provides:
  - messages/{vi,en}.json (59 msgid → 20 namespace, đối xứng) + msgid-map.json (đồ 1 lần)
  - src/i18n/{routing,request,navigation}.ts copy pattern 2026; middleware = createMiddleware
  - app/api tách khỏi segment (D-13); [lang] → [locale] (git mv giữ history)
  - Layout: NextIntlClientProvider ngoài + ProviderRegistry(linguiLocale) trong (khung M-09)
key-decisions:
  - 'Namespace suy TỰ ĐỘNG từ tham chiếu #: trong .po (không map tay như dự kiến D-03) — msgid đa file → Common(12 key).'
  - 'Cầu nối rẻ: getI18nInstance normalize vi→vi-VN/en→en-US TẠI GỐC + PageLangParam đổi shape {locale} giữ tên export — 10 page chỉ đổi accessor .lang→.locale, không đụng logic.'
  - 'mapLocale (content-core) nhận cả 2 hệ locale trong giai đoạn chuyển tiếp.'
  - 'PHÁT HIỆN: next-intl BẮT BUỘC createNextIntlPlugin() trong next.config để nối request.ts — thiếu là prerender chết "Couldn t find next-intl config file".'
  - 'git mv bị Permission denied khi dev server đang chạy (Windows file lock) — phải stop server trước.'
status: complete
completed: 2026-07-11
---

# C06-01 — Summary

## Gate đã chạy

1. ✅ Build Git Bash xanh với HAI runtime song song (next-intl routing + Lingui bridge).
2. ✅ URL scheme mới: `/` `/about` `/blog` `/blog/<slug>` (vi không prefix) + `/en/*` — đều 200; html lang đúng vi/en.
3. ✅ Bridge dịch: /about ra "Giới thiệu", /en/about metadata "About | ..." — component chưa port vẫn dịch đủ.
4. ✅ /vi-VN/about → 200 not-found có style (catch-all) — redirect vĩnh viễn đến ở plan 04 (đúng trình tự D-14: chưa merge main).
