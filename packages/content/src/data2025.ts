/**
 * Barrel CON chỉ gồm data tĩnh 2025 (không import blog/authors → KHÔNG node:fs)
 * — an toàn cho client component import qua '@portfolio/content/data2025'.
 */
export type { Locale, Localized, Skill, Company, Product, Project, SkillCategory, SkillId } from './types'
export { SKILL_CATEGORIES } from './types'
export { profile } from './profile'
export { me, skills, projects, featuredProjects, skillNames, education, experience } from './me'
export { SITE_METADATA_2025, type SiteMetadata2025 } from './site-metadata2025'
/** Alias tên cũ — shape đã đổi sang `me.*`; consumer sửa ở Phase 3. */
export { skills as SKILLS_2025, experience as EXPERIENCES_2025, projects as PROJECTS_2025 } from './me'
export type { Skill as Skill2025, Company as Company2025, Project as Project2025 } from './types'
