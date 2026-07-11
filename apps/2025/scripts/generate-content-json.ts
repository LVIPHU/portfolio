import 'dotenv/config'
import { mkdirSync, writeFileSync } from 'fs'
import { getSearchDocs, getTagData } from '@portfolio/content'

/**
 * Thay vai trò hook onSuccess của hệ content cũ (C5-03, D-06):
 * - json/tag-data.json: Record<slug(tag), count> — tags/[tag] generateStaticParams + rss per-tag
 * - public/search.json: PostMeta[] cho kbar
 * Locale 'vi' (mặc định) đã fallback-merge đủ mọi slug nên phủ toàn bộ bài.
 */
mkdirSync('./json', { recursive: true })
writeFileSync('./json/tag-data.json', JSON.stringify(getTagData('vi')))
console.log('🏷️. Tag list generated.')

writeFileSync('./public/search.json', JSON.stringify(getSearchDocs('vi')))
console.log('🔍. Local search index generated.')
