import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { postFrontmatterSchema } from './schema'
import type { Locale, Post, PostMeta } from './types'

/**
 * Tìm thư mục gốc của package content.
 * - Ưu tiên biến môi trường PORTFOLIO_CONTENT_DIR (trỏ tới packages/content)
 * - Mặc định: đoán từ cwd của app (apps/<version> → ../../packages/content)
 * Chỉ chạy lúc build/SSG (server), không chạy trên client.
 */
export function contentDir(): string {
  const fromEnv = process.env.PORTFOLIO_CONTENT_DIR
  if (fromEnv) return fromEnv

  const candidates = [
    path.join(process.cwd(), '..', '..', 'packages', 'content'),
    path.join(process.cwd(), 'packages', 'content'),
  ]
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir
  }
  throw new Error('Không tìm thấy packages/content. Set PORTFOLIO_CONTENT_DIR trỏ tới packages/content.')
}

const blogDir = () => path.join(contentDir(), 'blog')

interface ParsedFile {
  slug: string
  locale: Locale
  file: string
}

/** File đặt tên dạng <slug>.<locale>.mdx, ví dụ hello-world.vi.mdx */
function listFiles(): ParsedFile[] {
  const dir = blogDir()
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .flatMap((file) => {
      const m = file.match(/^(.+)\.(vi|en)\.mdx$/)
      if (!m) return []
      return [{ slug: m[1], locale: m[2] as Locale, file: path.join(dir, file) }]
    })
}

const iso = (d: Date) => d.toISOString().slice(0, 10)

function toPost(parsed: ParsedFile): Post {
  const raw = fs.readFileSync(parsed.file, 'utf8')
  const { data, content } = matter(raw)
  const fm = postFrontmatterSchema.safeParse(data)
  if (!fm.success) {
    throw new Error(`Frontmatter không hợp lệ ở ${parsed.file}:\n${fm.error.message}`)
  }
  const f = fm.data
  return {
    slug: parsed.slug,
    locale: parsed.locale,
    title: f.title,
    summary: f.summary,
    date: iso(f.date),
    lastmod: f.lastmod ? iso(f.lastmod) : undefined,
    tags: f.tags,
    draft: f.draft,
    images: f.images,
    authors: f.authors,
    layout: f.layout,
    canonicalUrl: f.canonicalUrl,
    path: `blog/${parsed.slug}`,
    filePath: `blog/${parsed.slug}.${parsed.locale}.mdx`,
    readingTime: readingTime(content),
    content,
  }
}

function isPublished(p: { draft: boolean }): boolean {
  return !p.draft || process.env.NODE_ENV !== 'production'
}

/**
 * Tất cả bài viết cho 1 locale (bỏ draft ở production), mới nhất trước.
 * Mỗi slug 1 bài: ưu tiên bản đúng locale, thiếu thì fallback bản locale còn lại
 * (cùng ngữ nghĩa fallback với getPost — danh sách và trang bài luôn khớp nhau).
 */
export function getAllPosts(locale: Locale): PostMeta[] {
  const bySlug = new Map<string, ParsedFile>()
  for (const f of listFiles()) {
    const current = bySlug.get(f.slug)
    if (!current || f.locale === locale) bySlug.set(f.slug, f)
  }
  return [...bySlug.values()]
    .map((f) => {
      const { content: _content, ...meta } = toPost(f)
      return meta
    })
    .filter(isPublished)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

/** 1 bài viết đầy đủ nội dung; fallback sang locale còn lại nếu chưa dịch */
export function getPost(slug: string, locale: Locale): Post | null {
  const files = listFiles().filter((f) => f.slug === slug)
  const exact = files.find((f) => f.locale === locale)
  const fallback = files[0]
  const target = exact ?? fallback
  if (!target) return null
  const post = toPost(target)
  return isPublished(post) ? post : null
}

/** Mọi slug (dùng cho generateStaticParams) */
export function getAllSlugs(): string[] {
  return [...new Set(listFiles().map((f) => f.slug))]
}

/** Tag kèm số bài, theo locale */
export function getAllTags(locale: Locale): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const post of getAllPosts(locale)) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return [...counts.entries()].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count)
}

export function getPostsByTag(tag: string, locale: Locale): PostMeta[] {
  return getAllPosts(locale).filter((p) => p.tags.includes(tag))
}

/** Record<tag, count> — shape của json/tag-data.json cũ (2025) */
export function getTagData(locale: Locale): Record<string, number> {
  return Object.fromEntries(getAllTags(locale).map(({ tag, count }) => [tag, count]))
}

/** Documents cho search (kbar) — shape khớp public/search.json cũ của 2025 */
export function getSearchDocs(locale: Locale): PostMeta[] {
  return getAllPosts(locale)
}

/** schema.org BlogPosting cho 1 bài (thay computedField structuredData của contentlayer) */
export function getStructuredData(post: PostMeta, siteUrl: string, authorName?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.lastmod ?? post.date,
    description: post.summary,
    image: post.images.length ? post.images.map((i) => new URL(i, siteUrl).toString()) : `${siteUrl}/og-image.png`,
    url: `${siteUrl}/${post.path}`,
    ...(authorName ? { author: [{ '@type': 'Person', name: authorName }] } : {}),
  }
}
