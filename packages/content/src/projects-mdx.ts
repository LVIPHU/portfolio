import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { projectFrontmatterSchema } from './schema'
import { contentDir } from './blog'
import { defaultLocale } from '@portfolio/i18n/locales'
import { projects } from './projects'
import type { Locale, Project, ProjectCase } from './types'

const projectsDir = () => path.join(contentDir(), 'projects')

interface ParsedFile {
  slug: string
  locale: Locale
  file: string
}

function listFiles(): ParsedFile[] {
  const dir = projectsDir()
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .flatMap((file) => {
      const m = file.match(/^(.+)\.(vi|en)\.mdx$/)
      const slug = m?.[1]
      const locale = m?.[2]
      if (!slug || (locale !== 'vi' && locale !== 'en')) return []
      return [{ slug, locale, file: path.join(dir, file) }]
    })
}

function readCase(parsed: ParsedFile): ProjectCase | null {
  const raw = fs.readFileSync(parsed.file, 'utf8')
  const { data, content } = matter(raw)
  const fm = projectFrontmatterSchema.safeParse(data)
  if (!fm.success) {
    throw new Error(`Frontmatter không hợp lệ ở ${parsed.file}:\n${fm.error.message}`)
  }
  const f = fm.data
  if (f.draft && process.env.NODE_ENV === 'production') return null
  return {
    slug: parsed.slug,
    locale: parsed.locale,
    title: f.title,
    summary: f.summary,
    date: f.date ? f.date.toISOString().slice(0, 10) : '',
    content,
  }
}

/** Mọi slug trong `projects.ts` — case study page luôn tồn tại, MDX là phần thân (có thể thiếu). */
export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug)
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

/**
 * Case study MDX cho 1 slug. Fallback locale giống blog: đúng locale → defaultLocale → bản còn lại.
 * Trả null nếu không có file nào (trang vẫn render từ `projects.ts`).
 */
export function getProjectCase(slug: string, locale: Locale): ProjectCase | null {
  const files = listFiles().filter((f) => f.slug === slug)
  const exact = files.find((f) => f.locale === locale)
  const fallback = files.find((f) => f.locale === defaultLocale) ?? files[0]
  const target = exact ?? fallback
  if (!target) return null
  return readCase(target)
}
