/**
 * Locale vocabulary thuần — không import next-intl / React.
 * Nguồn sự thật cho @portfolio/content và defineRouting trong package này.
 * Phải giữ khớp với mọi consumer (content Localized, app messages).
 */
export const locales = ['vi', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'vi'
