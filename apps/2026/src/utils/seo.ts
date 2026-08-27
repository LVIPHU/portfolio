import type { Metadata } from 'next'
import type { Locale } from '@portfolio/i18n/locales'
import { profile } from '@portfolio/content'

/** Canonical production host. Preview/Vercel ghi đè bằng NEXT_PUBLIC_SITE_URL / APP_URL. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'https://web-2026.vercel.app')

export function localePath(locale: string, path: string): string {
  const normalized = !path || path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  if (locale === 'en') return `/en${normalized || ''}`
  return normalized || '/'
}

export function absoluteUrl(locale: string, path: string): string {
  const p = localePath(locale, path)
  if (p === '/') return SITE_URL
  return `${SITE_URL}${p}`
}

export function buildAlternates(locale: string, path: string) {
  const vi = absoluteUrl('vi', path)
  const en = absoluteUrl('en', path)
  return {
    canonical: locale === 'en' ? en : vi,
    languages: { vi, en, 'x-default': vi },
  }
}

export function ogLocale(locale: string): string {
  return locale === 'en' ? 'en_US' : 'vi_VN'
}

export function pageMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  const alternates = buildAlternates(locale, path)
  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      locale: ogLocale(locale),
      siteName: profile.name,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    url: SITE_URL,
    email: profile.email,
    jobTitle: profile.title.en,
    sameAs: profile.socials.map((s) => s.url),
  }
}

export function breadcrumbJsonLd(locale: Locale, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(locale, item.path),
    })),
  }
}

export function articleJsonLd(opts: {
  locale: Locale
  path: string
  title: string
  description: string
  datePublished: string
  dateModified?: string
  tags?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: { '@type': 'Person', name: profile.name, url: SITE_URL },
    url: absoluteUrl(opts.locale, opts.path),
    keywords: opts.tags?.join(', '),
  }
}
