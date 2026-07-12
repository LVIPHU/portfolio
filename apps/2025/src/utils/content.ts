/**
 * Tầng SERVER của eo biển content (C5, D-01 — strangler fig):
 * data functions đọc filesystem từ @portfolio/content. KHÔNG export qua
 * barrel @/utils (client bundle sẽ dính node:fs) — server code import
 * trực tiếp '@/utils/content'.
 */
import type { Locale } from '@portfolio/content'
import { getAllPosts as _getAllPosts, getAllAuthors as _getAllAuthors } from '@portfolio/content'
import { coreContent, type PostWithAuthor } from './content-core'

export * from './content-core'
export {
  getAllPosts,
  getPost,
  getAllSlugs,
  getAllTags,
  getPostsByTag,
  getTagData,
  getSearchDocs,
  getStructuredData,
  getAllAuthors,
  getAuthor,
} from '@portfolio/content'

/**
 * getAllPosts kèm tác giả đã resolve (map slug→author, fallback 'default') — dùng cho
 * card grid/list cần avatar/tên/occupation. SERVER-only (getAllAuthors đọc fs); author
 * đã bỏ content (coreContent) để serialize an toàn sang client.
 */
export function getPostsWithAuthors(locale: Locale): PostWithAuthor[] {
  const map = new Map(_getAllAuthors().map((a) => [a.slug, coreContent(a)]))
  const fallback = map.get('default') ?? null
  return _getAllPosts(locale).map((p) => ({ ...p, author: map.get(p.authors[0] ?? '') ?? fallback }))
}
