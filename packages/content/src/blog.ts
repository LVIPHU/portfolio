import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { Locale, Post, PostMeta } from './types'

/**
 * Tìm thư mục blog của package này.
 * - Ưu tiên biến môi trường PORTFOLIO_CONTENT_DIR (trỏ tới packages/content)
 * - Mặc định: đoán từ cwd của app (apps/<version> → ../../packages/content)
 * Chỉ chạy lúc build/SSG (server), không chạy trên client.
 */
function blogDir(): string {
  const fromEnv = process.env.PORTFOLIO_CONTENT_DIR
  if (fromEnv) return path.join(fromEnv, 'blog')

  const candidates = [
    path.join(process.cwd(), '..', '..', 'packages', 'content', 'blog'),
    path.join(process.cwd(), 'packages', 'content', 'blog'),
  ]
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir
  }
  throw new Error('Không tìm thấy thư mục blog. Set PORTFOLIO_CONTENT_DIR trỏ tới packages/content.')
}

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

function toPost(parsed: ParsedFile): Post {
  const raw = fs.readFileSync(parsed.file, 'utf8')
  const { data, content } = matter(raw)
  return {
    slug: parsed.slug,
    locale: parsed.locale,
    title: String(data.title ?? parsed.slug),
    description: String(data.description ?? ''),
    date: String(data.date ?? ''),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    content,
  }
}

/** Tất cả bài viết của 1 locale, mới nhất trước */
export function getAllPosts(locale: Locale): PostMeta[] {
  return listFiles()
    .filter((f) => f.locale === locale)
    .map((f) => {
      const { content: _content, ...meta } = toPost(f)
      return meta
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

/** 1 bài viết đầy đủ nội dung; fallback sang locale còn lại nếu chưa dịch */
export function getPost(slug: string, locale: Locale): Post | null {
  const files = listFiles().filter((f) => f.slug === slug)
  const exact = files.find((f) => f.locale === locale)
  const fallback = files[0]
  const target = exact ?? fallback
  return target ? toPost(target) : null
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
