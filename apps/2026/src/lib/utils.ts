import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Locale, Localized } from '@portfolio/content'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Lấy chuỗi đúng ngôn ngữ từ dữ liệu song ngữ */
export function t(value: Localized, locale: Locale): string {
  return value[locale] ?? value.vi
}

/** "2024-06" → "06/2024" (vi) hoặc "Jun 2024" (en) */
export function formatMonth(value: string, locale: Locale): string {
  const [year, month] = value.split('-')
  if (!month) return year
  if (locale === 'vi') return `${month}/${year}`
  const date = new Date(Number(year), Number(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

/** "2026-07-01" → "01/07/2026" (vi) hoặc "Jul 1, 2026" (en) */
export function formatDate(value: string, locale: Locale): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return locale === 'vi'
    ? date.toLocaleDateString('vi-VN')
    : date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
}
