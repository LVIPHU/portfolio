---
phase: C04-2025-trim-locales
plan: 01
subsystem: i18n-2025
tags: [lingui, locales]
provides:
  - apps/2025 còn 2 locale vi-VN + en-US (Lingui giữ nguyên — engine đổi ở C6)
  - 2 catalog regenerate sạch (59 msgid, vi-VN 0 missing)
key-files:
  modified:
    - apps/2025/lingui.config.js (locales 6→2)
    - apps/2025/src/components/molecules/locale-switch.tsx (LOCALES + languages 2 entry)
    - apps/2025/src/libs/dayjs.ts (2 map còn en/vi)
    - apps/2025/src/components/atoms/timeline.tsx (bỏ 8 case ja/zh/ko)
  deleted:
    - src/i18n/locales/{ja-JP,ko-KR,zh-CN,zh-TW}/ (8 file .po/.js)
key-decisions:
  - '4 điểm derive (i18n.ts, middleware.ts, [lang]/layout generateStaticParams, sitemap) đều đọc từ lingui.config — đúng single source, KHÔNG phải sửa (D-06).'
  - 'HÀNH VI THỰC TẾ /ja-JP/about (ghi cho C6 D-09): middleware coi ja-JP là path segment → 307 về /vi-VN/ja-JP/about → 200 trang not-found CÓ STYLE (catch-all [...rest]), không 404 trắng. C6 thay bằng redirect tổng.'
status: complete
completed: 2026-07-11
---

# C04-01: Trim locales — Summary

## Gate đã chạy (kết quả thật)

1. ✅ Grep tổng M-04 (*.ts/tsx/js/po, exclude node_modules/.next) = **0** — mạnh hơn SC1 ROADMAP.
2. ✅ Build PowerShell full (không cache) xanh — 2m06s.
3. ✅ `curl -H "Accept-Language: ja" /` → 307 `/vi-VN` (negotiator fallback không crash); `/vi-VN` + `/en-US` 200.
4. ✅ Lingui extract: đúng 2 locale, 59/59 msgid vi đủ.
5. ✅ Browser :3001: trang vi ("Giới thiệu"/"Sơ yếu lý lịch") + en ("About") render đúng ngôn ngữ; languages map còn 2 option (code-level).
