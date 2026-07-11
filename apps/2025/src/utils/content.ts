/**
 * Tầng SERVER của eo biển content (C5, D-01 — strangler fig):
 * data functions đọc filesystem từ @portfolio/content. KHÔNG export qua
 * barrel @/utils (client bundle sẽ dính node:fs) — server code import
 * trực tiếp '@/utils/content'.
 */
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
