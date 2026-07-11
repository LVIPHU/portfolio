export type Locale = 'vi' | 'en'

/** Chuỗi song ngữ — mọi text hiển thị đều dùng dạng này */
export type Localized = Record<Locale, string>

export interface Profile {
  name: string
  title: Localized
  tagline: Localized
  bio: Localized[] // mỗi phần tử là 1 đoạn văn
  email: string
  location: Localized
  avatar: string // đường dẫn ảnh trong /content/...
  socials: SocialLink[]
}

export interface SocialLink {
  label: string
  url: string
}

export interface Project {
  slug: string
  name: string
  description: Localized
  tech: string[]
  year: number
  featured: boolean
  links: {
    demo?: string
    source?: string
  }
}

export interface ResumeData {
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: SkillGroup[]
}

export interface ExperienceItem {
  company: string
  role: Localized
  start: string // "2024-06"
  end: string | null // null = hiện tại
  summary: Localized[]
}

export interface EducationItem {
  school: string
  degree: Localized
  start: string
  end: string
}

export interface SkillGroup {
  label: Localized
  items: string[]
}

export interface GalleryItem {
  src: string // /content/gallery/...
  alt: string
  caption: Localized
  date: string // "2026-01"
}

export interface PostMeta {
  slug: string
  locale: Locale
  title: string
  summary: string
  date: string // "2026-07-01"
  lastmod?: string
  tags: string[]
  draft: boolean
  images: string[]
  authors: string[]
  layout?: 'PostLayout' | 'PostSimple' | 'PostBanner'
  canonicalUrl?: string
  /** đường dẫn tương đối dạng blog/<slug> (tương thích shape cũ của 2025) */
  path: string
  readingTime: { text: string; minutes: number; time: number; words: number }
}

export interface Post extends PostMeta {
  content: string // MDX body
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
  content: string // MDX body (bio)
}

export interface TagCount {
  tag: string
  count: number
}
