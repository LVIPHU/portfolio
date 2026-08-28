import { describe, expect, it } from 'vitest'
import {
  absoluteOgImageUrl,
  absolutePageUrl,
  buildOgFields,
  buildSocialMeta,
  clampOgText,
  ogLocale,
  OG_DESCRIPTION_MAX,
  OG_TITLE_MAX,
} from './og'

describe('ogLocale', () => {
  it('maps vi and en to Open Graph locale tags', () => {
    expect(ogLocale('vi')).toBe('vi_VN')
    expect(ogLocale('en')).toBe('en_US')
  })
})

describe('clampOgText', () => {
  it('keeps short strings unchanged', () => {
    expect(clampOgText('About', 120)).toBe('About')
  })

  it('truncates strings longer than max', () => {
    const long = 'a'.repeat(50)
    const out = clampOgText(long, 10)
    // Nếu clamp thành no-op, length <= max sẽ đỏ — lock hành vi cắt, không green-for-wrong-reason.
    expect(out.length).toBeLessThanOrEqual(10)
    expect(out).not.toBe(long)
    expect(out).toBe('a'.repeat(10))
  })

  it('does not throw on empty or undefined', () => {
    expect(clampOgText('', 10)).toBe('')
    expect(clampOgText(undefined, 10)).toBe('')
    expect(clampOgText(null, 10)).toBe('')
  })
})

describe('absoluteOgImageUrl', () => {
  it('strips trailing slash so origin does not double up', () => {
    expect(absoluteOgImageUrl('https://example.com/', 'About')).toBe('https://example.com/api/og?title=About')
    expect(absoluteOgImageUrl('https://example.com/', 'About')).not.toContain('//api')
  })

  it('puts title in the query string', () => {
    const url = absoluteOgImageUrl('https://example.com', 'Hello World')
    expect(url).toContain('title=Hello')
    expect(url.startsWith('https://example.com/api/og?')).toBe(true)
  })

  it('rejects javascript: origins', () => {
    expect(() => absoluteOgImageUrl('javascript:alert(1)', 'x')).toThrow(/javascript/)
    expect(() => absoluteOgImageUrl('javascript:alert(1)', 'x')).toThrow(/http/)
  })

  it('clamps title and description in the search string', () => {
    const url = absoluteOgImageUrl(
      'https://example.com',
      't'.repeat(OG_TITLE_MAX + 40),
      'd'.repeat(OG_DESCRIPTION_MAX + 40)
    )
    const query = new URL(url).searchParams
    expect(query.get('title')?.length).toBe(OG_TITLE_MAX)
    expect(query.get('description')?.length).toBe(OG_DESCRIPTION_MAX)
  })
})

describe('absolutePageUrl', () => {
  it('prefixes /en for English and leaves vi at origin root', () => {
    expect(absolutePageUrl('https://example.com', 'vi', '/')).toBe('https://example.com')
    expect(absolutePageUrl('https://example.com', 'en', '/')).toBe('https://example.com/en')
    expect(absolutePageUrl('https://example.com', 'vi', '/about')).toBe('https://example.com/about')
    expect(absolutePageUrl('https://example.com', 'en', '/about')).toBe('https://example.com/en/about')
  })
})

describe('buildOgFields', () => {
  it('website includes images, locale, and alternateLocale', () => {
    const fields = buildOgFields({
      title: 'About',
      description: 'Hello',
      canonicalUrl: 'https://example.com/about',
      siteName: 'Felix',
      locale: 'vi',
      origin: 'https://example.com',
    })
    expect(fields.type).toBe('website')
    expect(fields.locale).toBe('vi_VN')
    expect(fields.alternateLocale).toBe('en_US')
    expect(fields.images.length).toBeGreaterThan(0)
    expect(fields.images[0]?.url).toContain('/api/og?')
    expect(fields.images[0]?.width).toBe(1200)
    expect(fields.images[0]?.height).toBe(630)
    expect(fields.images[0]?.alt).toBe('About')
  })

  it('article includes type and publishedTime', () => {
    const fields = buildOgFields({
      title: 'Post',
      description: 'Summary',
      canonicalUrl: 'https://example.com/blog/hello',
      siteName: 'Felix',
      locale: 'en',
      origin: 'https://example.com',
      article: {
        publishedTime: '2026-07-01T00:00:00.000Z',
        authors: ['Phu'],
        tags: ['life'],
        section: 'Blog',
      },
    })
    expect(fields.type).toBe('article')
    expect(fields.article?.publishedTime).toBe('2026-07-01T00:00:00.000Z')
    const social = buildSocialMeta(fields)
    expect(social.openGraph.type).toBe('article')
    expect(social.openGraph.publishedTime).toBe('2026-07-01T00:00:00.000Z')
    expect(social.openGraph.locale).toBe('en_US')
    expect(social.openGraph.alternateLocale).toEqual(['vi_VN'])
    expect(social.openGraph.images?.[0]).toMatchObject({ width: 1200, height: 630, type: 'image/png' })
    expect(social.twitter.card).toBe('summary_large_image')
  })

  it('resolves relative imageUrls against origin with jpeg MIME', () => {
    const fields = buildOgFields({
      title: 'Post',
      description: 'Summary',
      canonicalUrl: 'https://example.com/blog/x',
      siteName: 'Felix',
      locale: 'vi',
      origin: 'https://example.com',
      imageUrls: ['/content/blog/x.jpg'],
    })
    expect(fields.images).toHaveLength(1)
    expect(fields.images[0]?.url).toBe('https://example.com/content/blog/x.jpg')
    expect(fields.images[0]?.type).toBe('image/jpeg')
    // Xóa nhánh imageUrls.length > 0 phải đỏ: không được rơi về /api/og.
    expect(fields.images[0]?.url).not.toContain('/api/og')
  })

  it('keeps absolute https imageUrls unchanged', () => {
    const fields = buildOgFields({
      title: 'Post',
      description: 'Summary',
      canonicalUrl: 'https://example.com/blog/x',
      siteName: 'Felix',
      locale: 'vi',
      origin: 'https://example.com',
      imageUrls: ['https://cdn.example/a.png'],
    })
    expect(fields.images[0]?.url).toBe('https://cdn.example/a.png')
    expect(fields.images[0]?.type).toBe('image/png')
    expect(fields.images[0]?.url).not.toContain('/api/og')
  })

  it('falls back to /api/og when imageUrls is empty or omitted', () => {
    const base = {
      title: 'About',
      description: 'Hello',
      canonicalUrl: 'https://example.com/about',
      siteName: 'Felix',
      locale: 'vi',
      origin: 'https://example.com',
    }
    expect(buildOgFields(base).images[0]?.url).toContain('/api/og?')
    expect(buildOgFields({ ...base, imageUrls: [] }).images[0]?.url).toContain('/api/og?')
    expect(buildOgFields({ ...base, imageUrls: undefined }).images[0]?.url).toContain('/api/og?')
  })

  it('sets secureUrl only when the image URL is https', () => {
    const https = buildSocialMeta(
      buildOgFields({
        title: 'About',
        description: 'Hello',
        canonicalUrl: 'https://example.com/about',
        siteName: 'Felix',
        locale: 'vi',
        origin: 'https://example.com',
      })
    )
    expect(https.openGraph.images[0]?.secureUrl).toBe('https://example.com/api/og?title=About&description=Hello')
    const http = buildSocialMeta(
      buildOgFields({
        title: 'About',
        description: 'Hello',
        canonicalUrl: 'http://localhost:3000/about',
        siteName: 'Felix',
        locale: 'vi',
        origin: 'http://localhost:3000',
      })
    )
    expect(http.openGraph.images[0]?.secureUrl).toBeUndefined()
  })
})
