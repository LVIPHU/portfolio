import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { authorFrontmatterSchema } from './schema'
import { contentDir } from './blog'
import type { Author } from './types'

const authorsDir = () => path.join(contentDir(), 'authors')

/** Author file dạng authors/<slug>.mdx với frontmatter name/avatar/occupation... */
export function getAllAuthors(): Author[] {
  const dir = authorsDir()
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '')
      const raw = fs.readFileSync(path.join(dir, file), 'utf8')
      const { data, content } = matter(raw)
      const fm = authorFrontmatterSchema.safeParse(data)
      if (!fm.success) {
        throw new Error(`Frontmatter author không hợp lệ ở ${file}:\n${fm.error.message}`)
      }
      return { slug, ...fm.data, content }
    })
}

export function getAuthor(slug: string): Author | null {
  return getAllAuthors().find((a) => a.slug === slug) ?? null
}
