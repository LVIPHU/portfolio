/**
 * Logic OG thuần (URL, size, locale, clamp) — không import Next.
 * ImageResponse / Metadata.openGraph ở từng app: hai style card không được lẫn một file.
 */

export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630
export const OG_IMAGE_TYPE = 'image/png'
export const OG_TITLE_MAX = 120
export const OG_DESCRIPTION_MAX = 200

export type OgType = 'website' | 'article'

export type OgArticle = {
  publishedTime: string
  modifiedTime?: string
  authors?: string[]
  tags?: string[]
  section?: string
}

export type OgImageSpec = {
  url: string
  width: number
  height: number
  alt: string
  type: string
}

export type OgFields = {
  title: string
  description: string
  url: string
  type: OgType
  siteName: string
  locale: string
  alternateLocale: string
  images: OgImageSpec[]
  twitterCard: 'summary_large_image'
  article?: OgArticle
}

export type BuildOgFieldsInput = {
  title: string
  description: string
  canonicalUrl: string
  siteName: string
  locale: string
  origin: string
  type?: OgType
  article?: OgArticle
  /** Ảnh ngoài /api/og (vd. ảnh bài). Path tương đối resolve với origin. */
  imageUrls?: string[]
  imageWidth?: number
  imageHeight?: number
}

export function ogLocale(locale: string): 'vi_VN' | 'en_US' {
  return locale === 'en' ? 'en_US' : 'vi_VN'
}

export function ogAlternateLocale(locale: string): 'vi_VN' | 'en_US' {
  return locale === 'en' ? 'vi_VN' : 'en_US'
}

export function clampOgText(s: string | null | undefined, max: number): string {
  if (s == null) return ''
  const text = String(s)
  if (text.length <= max) return text
  return text.slice(0, max)
}

export function localePrefixPath(locale: string, path: string): string {
  const normalized = !path || path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  if (locale === 'en') return `/en${normalized}`
  return normalized || '/'
}

export function normalizeHttpOrigin(origin: string): string {
  const trimmed = origin.trim().replace(/\/+$/, '')
  if (/javascript:/i.test(trimmed) || !/^https?:\/\//i.test(trimmed)) {
    throw new Error('OG origin phải là URL http(s), không nhúng javascript:')
  }
  return trimmed
}

export function absolutePageUrl(origin: string, locale: string, path: string): string {
  const base = normalizeHttpOrigin(origin)
  const p = localePrefixPath(locale, path)
  if (p === '/') return base
  return `${base}${p}`
}

export function buildOgImageSearch(title: string, description?: string): string {
  const params = new URLSearchParams()
  const t = clampOgText(title, OG_TITLE_MAX)
  if (t) params.set('title', t)
  const d = clampOgText(description, OG_DESCRIPTION_MAX)
  if (d) params.set('description', d)
  return params.toString()
}

export function absoluteOgImageUrl(origin: string, title: string, description?: string): string {
  const base = normalizeHttpOrigin(origin)
  const search = buildOgImageSearch(title, description)
  return search ? `${base}/api/og?${search}` : `${base}/api/og`
}

export function ogImageTypeFromUrl(url: string): string {
  const path = url.split('?')[0]?.toLowerCase() ?? ''
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg'
  if (path.endsWith('.webp')) return 'image/webp'
  if (path.endsWith('.gif')) return 'image/gif'
  if (path.endsWith('.svg')) return 'image/svg+xml'
  return OG_IMAGE_TYPE
}

function resolveImageUrl(origin: string, url: string): string {
  if (/^https?:\/\//i.test(url)) return url
  const base = normalizeHttpOrigin(origin)
  return `${base}${url.startsWith('/') ? url : `/${url}`}`
}

export function buildOgFields(input: BuildOgFieldsInput): OgFields {
  const type: OgType = input.article ? 'article' : (input.type ?? 'website')
  const images: OgImageSpec[] =
    input.imageUrls && input.imageUrls.length > 0
      ? input.imageUrls.map((raw) => {
          const url = resolveImageUrl(input.origin, raw)
          return {
            url,
            width: input.imageWidth ?? OG_IMAGE_WIDTH,
            height: input.imageHeight ?? OG_IMAGE_HEIGHT,
            alt: input.title,
            type: ogImageTypeFromUrl(url),
          }
        })
      : [
          {
            url: absoluteOgImageUrl(input.origin, input.title, input.description),
            width: OG_IMAGE_WIDTH,
            height: OG_IMAGE_HEIGHT,
            alt: input.title,
            type: OG_IMAGE_TYPE,
          },
        ]

  return {
    title: input.title,
    description: input.description,
    url: input.canonicalUrl,
    type,
    siteName: input.siteName,
    locale: ogLocale(input.locale),
    alternateLocale: ogAlternateLocale(input.locale),
    images,
    twitterCard: 'summary_large_image',
    article: input.article,
  }
}

type OgImageMeta = {
  url: string
  secureUrl?: string
  width: number
  height: number
  alt: string
  type: string
}

export function buildSocialMeta(fields: OgFields): {
  openGraph: {
    title: string
    description: string
    url: string
    siteName: string
    locale: string
    alternateLocale: string[]
    type: OgType
    images: OgImageMeta[]
    publishedTime?: string
    modifiedTime?: string
    authors?: string[]
    tags?: string[]
    section?: string
  }
  twitter: {
    card: 'summary_large_image'
    title: string
    description: string
    images: { url: string; alt: string }[]
  }
} {
  const images = fields.images.map((img) => ({
    url: img.url,
    ...(img.url.startsWith('https:') ? { secureUrl: img.url } : {}),
    width: img.width,
    height: img.height,
    alt: img.alt,
    type: img.type,
  }))

  const articleMeta =
    fields.type === 'article' && fields.article
      ? {
          publishedTime: fields.article.publishedTime,
          modifiedTime: fields.article.modifiedTime ?? fields.article.publishedTime,
          ...(fields.article.authors?.length ? { authors: fields.article.authors } : {}),
          ...(fields.article.tags?.length ? { tags: fields.article.tags } : {}),
          ...(fields.article.section ? { section: fields.article.section } : {}),
        }
      : {}

  return {
    openGraph: {
      title: fields.title,
      description: fields.description,
      url: fields.url,
      siteName: fields.siteName,
      locale: fields.locale,
      alternateLocale: [fields.alternateLocale],
      type: fields.type,
      images,
      ...articleMeta,
    },
    twitter: {
      card: fields.twitterCard,
      title: fields.title,
      description: fields.description,
      images: fields.images.map((img) => ({ url: img.url, alt: img.alt })),
    },
  }
}
