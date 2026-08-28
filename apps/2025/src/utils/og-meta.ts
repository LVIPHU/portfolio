import type { Metadata } from 'next'
import { SITE_METADATA_2025 as SITE_METADATA } from '@portfolio/content/data2025'
import { absolutePageUrl, buildOgFields, buildSocialMeta, type OgArticle } from '@portfolio/utils'

export function siteOrigin(): string {
  return (SITE_METADATA.siteUrl ?? 'http://localhost:3001').replace(/\/+$/, '')
}

type WithOgInput = {
  locale: string
  path: string
  title: string
  description: string
  siteName?: string
  article?: OgArticle
  /** Ảnh bài viết (absolute hoặc path). Không truyền thì dùng /api/og. */
  imageUrls?: string[]
}

type WithOgExtra = {
  title?: Metadata['title']
  robots?: Metadata['robots']
  alternateTypes?: NonNullable<Metadata['alternates']>['types']
}

export function withOg(input: WithOgInput, extra?: WithOgExtra): Metadata {
  const origin = siteOrigin()
  const canonical = absolutePageUrl(origin, input.locale, input.path)
  const localeKey = input.locale === 'en' ? 'en' : 'vi'
  // title có bản vi; headerTitle cả hai locale English (kicker card 2025 vẫn dùng .en).
  const siteName = input.siteName ?? SITE_METADATA.title[localeKey]
  const fields = buildOgFields({
    title: input.title,
    description: input.description,
    canonicalUrl: canonical,
    siteName,
    locale: input.locale,
    origin,
    type: input.article ? 'article' : 'website',
    article: input.article,
    imageUrls: input.imageUrls,
  })
  const vi = absolutePageUrl(origin, 'vi', input.path)
  const en = absolutePageUrl(origin, 'en', input.path)
  return {
    title: extra?.title ?? input.title,
    description: input.description,
    alternates: {
      canonical,
      languages: { vi, en, 'x-default': vi },
      ...(extra?.alternateTypes ? { types: extra.alternateTypes } : {}),
    },
    ...(extra?.robots ? { robots: extra.robots } : {}),
    ...buildSocialMeta(fields),
  }
}
