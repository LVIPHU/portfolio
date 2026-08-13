import { defineRouting } from 'next-intl/routing'
import { defaultLocale, locales } from './locales'

export const routing = defineRouting({
  locales,
  defaultLocale,
  // vi không có prefix (/about), en có prefix (/en/about)
  localePrefix: 'as-needed',
})

export { defaultLocale, locales, type Locale } from './locales'
