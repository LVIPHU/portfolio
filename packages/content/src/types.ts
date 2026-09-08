import type { Locale } from '@portfolio/i18n/locales'
import type { SkillId } from './skill-ids'

export type { Locale }
export type { SkillId }
export { SKILL_IDS, PHI_ICON, PHI_ICON_IDS } from './skill-ids'

/** Chuỗi song ngữ — mọi text hiển thị đều dùng dạng này */
export type Localized = Record<Locale, string>

/** 9 heading trong mục Skills của CV — dùng CHUNG cho cả 2025 và 2026 */
export type SkillCategory =
  | 'languages'
  | 'frameworks'
  | 'state-data'
  | 'ui-styling'
  | 'performance'
  | 'accessibility'
  | 'testing'
  | 'ai-assisted'
  | 'tooling'

export const SKILL_CATEGORIES: { id: SkillCategory; label: Localized }[] = [
  { id: 'languages', label: { vi: 'Ngôn ngữ', en: 'Languages' } },
  { id: 'frameworks', label: { vi: 'Framework', en: 'Frameworks' } },
  { id: 'state-data', label: { vi: 'State & dữ liệu', en: 'State & Data' } },
  { id: 'ui-styling', label: { vi: 'Giao diện & tạo kiểu', en: 'UI & Styling' } },
  { id: 'performance', label: { vi: 'Hiệu năng', en: 'Performance' } },
  { id: 'accessibility', label: { vi: 'Khả năng tiếp cận', en: 'Accessibility' } },
  { id: 'testing', label: { vi: 'Kiểm thử & kỹ thuật', en: 'Testing and engineering' } },
  { id: 'ai-assisted', label: { vi: 'Lập trình hỗ trợ bởi AI', en: 'AI-assisted development' } },
  { id: 'tooling', label: { vi: 'Công cụ & hạ tầng', en: 'Tooling and infrastructure' } },
]

export interface Profile {
  name: string
  title: Localized
  tagline: Localized
  bio: Localized[]
  email: string
  phone: string
  phoneHref: string
  location: Localized
  avatar: string
  resumeUrl: string
  company: { name: string; url: string }
  socials: SocialLink[]
}

export interface SocialLink {
  id: SkillId
  label: string
  url: string
}

export interface Company {
  id: string
  name: string
  url?: string
  location: Localized
  role: Localized
  start: string
  end: string | null
  active: boolean
  products: Product[]
}

export interface Product {
  id: string
  name: string
  url?: string
  description: Localized
  role: Localized
  team?: Localized
  start: string
  end: string | null
  active: boolean
  stack: SkillId[]
  summary: Localized[]
  hidden?: boolean
}

export interface Education {
  id: string
  school: string
  degree: Localized
  field: Localized
  start: string
  end: string
}

export interface Skill {
  id: SkillId
  name: string
  category: SkillCategory
  level: 'beginner' | 'learning' | 'familiar' | 'proficient' | 'advanced' | 'expert'
  href?: string
  hidden?: boolean
  mostUsed?: boolean
}

export interface Project {
  slug: string
  name: string
  description: Localized
  type: 'work' | 'self'
  tech: SkillId[]
  year: number
  featured: boolean
  hidden?: boolean
  image?: string
  links: { demo?: string; source?: string }
}

export interface ResumeData {
  experience: Company[]
  education: Education[]
  skills: { id: SkillCategory; label: Localized; items: string[] }[]
}

export interface GalleryItem {
  src: string
  alt: string
  caption: Localized
  date: string
  width: number
  height: number
}

export interface ProjectCase {
  slug: string
  locale: Locale
  title: string
  summary: string
  date: string
  content: string
}

export interface PostMeta {
  slug: string
  locale: Locale
  title: string
  summary: string
  date: string
  lastmod?: string
  tags: string[]
  draft: boolean
  images: string[]
  authors: string[]
  layout?: 'PostLayout' | 'PostSimple' | 'PostBanner'
  canonicalUrl?: string
  /** đường dẫn tương đối dạng blog/<slug> (tương thích shape cũ của 2025) */
  path: string
  /** blog/<slug>.<locale>.mdx — cho edit-on-github (tương thích filePath cũ) */
  filePath: string
  readingTime: { text: string; minutes: number; time: number; words: number }
}

export interface Post extends PostMeta {
  content: string
}

export interface Author {
  slug: string
  name: string
  avatar?: string
  occupation?: string
  company?: string
  email?: string
  twitter?: string
  x?: string
  linkedin?: string
  github?: string
  content: string
}

export interface TagCount {
  tag: string
  count: number
}
