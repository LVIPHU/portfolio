import { createAppRequestConfig } from '@portfolio/i18n/request'
import type { Locale } from '@portfolio/i18n/locales'

export default createAppRequestConfig(async (locale: Locale) => (await import(`../../messages/${locale}.json`)).default)
