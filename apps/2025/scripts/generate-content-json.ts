import 'dotenv/config'
import { writeFileSync } from 'fs'
import { getSearchDocs } from '@portfolio/content'

/**
 * Thay vai trò hook onSuccess của hệ content cũ (C5-03, D-06):
 * - public/search.json: PostMeta[] cho kbar
 * Locale 'vi' (mặc định) đã fallback-merge đủ mọi slug nên phủ toàn bộ bài.
 *
 * (tag-data.json ĐÃ BỎ: tags giờ lấy trực tiếp getTagData/getAllTags LIVE từ @portfolio/content
 * ở tags/[tag], tags/page, TagTemplate và rss — không còn snapshot làm nguồn-đôi.)
 */
writeFileSync('./public/search.json', JSON.stringify(getSearchDocs('vi')))
console.log('🔍. Local search index generated.')
