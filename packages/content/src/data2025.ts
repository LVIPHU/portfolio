/**
 * Barrel CON chỉ gồm data tĩnh 2025 (không import blog/authors → KHÔNG node:fs)
 * — an toàn cho client component import qua '@portfolio/content/data2025'.
 * (Barrel chính '.' kéo blog.ts dùng fs, chỉ dành cho server — bài học C5-01.)
 */
export type { Locale, Localized } from './types'
export { SKILLS_2025, type Skill2025 } from './skills2025'
export { EXPERIENCES_2025, type Company2025, type Experience2025 } from './experience2025'
export { PROJECTS_2025, type Project2025 } from './projects2025'
export { SITE_METADATA_2025, type SiteMetadata2025 } from './site-metadata2025'
