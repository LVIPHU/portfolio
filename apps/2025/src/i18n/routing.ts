import { defineRouting } from 'next-intl/routing'

// Copy nguyên pattern apps/2026 (C6, D-01 — convention mirroring)
export const routing = defineRouting({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  // vi không có prefix (/about), en có prefix (/en/about)
  localePrefix: 'as-needed',
})
