---
phase: C06-2025-next-intl
plan: 03
subsystem: i18n-2025
tags: [data-unification, client-safe-subpath, debridge]
provides:
  - 12 organism/molecule/atom sạch @lingui (locale-switch viết lại 2 locale theo D-10)
  - "'@portfolio/content/data2025' — subpath export data tĩnh KHÔNG fs, client component import an toàn (áp bài học C5-01)"
  - 22 file swap @data/* → package; apps/2025/data XÓA HẲN + alias @data gỡ
  - Khung chuyển tiếp 2 runtime tháo sạch (layout getTranslations, ProviderRegistry thuần theme/app, initLingui hết khỏi pages)
key-decisions:
  - 'Chuỗi data (experience/project description) KHÔNG có trong msgid-map (Lingui chưa từng extract data/) — đúng phát hiện C2; render qua makeDataMsg(locale) đọc Localized {vi,en}; nợ 11 TODO dịch vẫn theo data (có từ trước).'
  - 'createTimelineItems là hàm thuần → dataMsg truyền tham số thay vì hook (tránh gọi hook ngoài component).'
  - 'SITE_METADATA_2025 as SITE_METADATA: consumer chỉ đụng field literal không phải sửa; 3 field Localized (title/headerTitle/description) — chỗ dùng đã port sang t() key App.* từ trước.'
  - 'FloatingDock active-indicator so pathname === item.href — usePathname locale-aware cần theo dõi khi smoke (agent C cảnh báo); hoạt động vì navbar hrefs đã bỏ prefix.'
status: complete
completed: 2026-07-12
---

# C06-03 — Summary

Verify: grep @lingui components = 0; grep @data toàn app = 0; data/ không tồn tại; typecheck PASS; build 1m04 xanh; /about vi ("Giới thiệu" + rich text vi) và /en/about (rich text en + emoji + LinkPreview) render đúng — tự test browser.
