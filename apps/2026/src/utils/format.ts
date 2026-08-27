import type { Locale, Localized } from '@portfolio/content'
import { defaultLocale } from '@portfolio/i18n/locales'

/** Pick localized string by current locale (fallback default). */
export function t(value: Localized, locale: Locale): string {
  return value[locale] ?? value[defaultLocale]
}

/** "2024-06" → "06/2024" (vi) hoặc "Jun 2024" (en) — parse local, không UTC. */
const monthFormatters: Record<Locale, (year: string, month: string) => string> = {
  vi: (year, month) => `${month}/${year}`,
  en: (year, month) =>
    new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    }),
}

export function formatMonth(value: string, locale: Locale): string {
  const [year, month] = value.split('-')
  if (!year || !month) return value
  return monthFormatters[locale](year, month)
}

/** "2026-07-01" → "01/07/2026" (vi) hoặc "Jul 1, 2026" (en). */
const dateFormatters: Record<Locale, (d: Date) => string> = {
  vi: (d) => d.toLocaleDateString('vi-VN'),
  en: (d) =>
    d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
}

export function formatDate(value: string, locale: Locale): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return dateFormatters[locale](date)
}
