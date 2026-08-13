import { hasLocale } from 'next-intl'
import type { AbstractIntlMessages } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import type { Locale } from './locales'

/**
 * Factory getRequestConfig: app inject loader messages (JSON per-app).
 * Giữ createNextIntlPlugin() trỏ ./src/i18n/request.ts ở từng app.
 */
export function createAppRequestConfig(loadMessages: (locale: Locale) => Promise<AbstractIntlMessages>) {
  return getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale
    const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

    return {
      locale,
      messages: await loadMessages(locale),
    }
  })
}
