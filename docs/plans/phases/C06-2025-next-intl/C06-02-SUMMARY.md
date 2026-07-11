---
phase: C06-2025-next-intl
plan: 02
subsystem: i18n-2025
tags: [macro-port, icu-rich-text, workflow-fanout]
provides:
  - 10 page app router + 7 template sạch @lingui (2 agent song song, hợp đồng port chung)
  - Quy ước full-path key thống nhất — useTranslations()/getTranslations() không namespace, t('Ns.key')
key-decisions:
  - 'PHÁT HIỆN QUAN TRỌNG (agent B verify bằng use-intl@4.13.1 thật): ICU parser TỪ CHỐI tag số <0> — INVALID_MESSAGE, t.rich render key thô. Fix tích hợp: đổi tag chữ (<company>/<lol>/<ww>) trong messages/{vi,en}.json + 2 chỗ t.rich của about.tsx; đồng thời arg {0}{1} (emoji) trùng key với tag số cũ — sau khi đổi tên tag, emoji args truyền lại được cùng lúc.'
  - 'blog.tsx: usePathname từ @/i18n/navigation trả path KHÔNG prefix locale → basePath phân trang đúng route mới.'
  - 'generateMetadata dùng getTranslations({locale}) tường minh ở layout (khuyến nghị SSG); các page con dùng getTranslations() thường — theo dõi nếu build báo dynamic.'
  - 'NavigationLink atom (ngoài batch) còn next/link thuần — link nội bộ trong MDX/label chưa locale-aware; hoạt động đúng nhờ as-needed + redirect, port hẳn ghi nợ C12.'
status: complete
completed: 2026-07-12
---

# C06-02 — Summary

Verify: grep @lingui trong src/app + templates = 0; typecheck PASS; build xanh (gộp gate với 03/04). Port bởi workflow 4-agent (2 batch thuộc plan này), 0 msgid thiếu map ở batch A/B.
